/* ============================================================
   1. 목차 접기 / 펼치기
============================================================ */

const tocToggle = document.getElementById("toc-toggle");
const tocList = document.querySelector(".toc-list");

if (tocToggle && tocList) {
    tocToggle.addEventListener("click", () => {
        const isHidden = tocList.style.display === "none";
        tocList.style.display = isHidden ? "block" : "none";
        tocToggle.textContent = isHidden ? "ˇ" : "›";
    });
}

/* ============================================================
   2. 부드러운 스크롤 (목차 클릭 시)
============================================================ */

document.querySelectorAll('.toc-list a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

/* ============================================================
   3. 각주 툴팁 시스템
   - 데스크탑 hover
   - 모바일 탭
   - 툴팁 외부 클릭 닫힘
   - 화면 밖 보정
   - 각주 번호 클릭 시 하단 이동 금지
============================================================ */

let activeTooltip = null;

const footnoteRefs = document.querySelectorAll(".footnote-ref a");

function createTooltip(text, refEl) {
    const tip = document.createElement("div");
    tip.className = "fn-tooltip";
    tip.innerHTML = text;
    document.body.appendChild(tip);

    const rect = refEl.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    // 기본 위치 (ref 아래)
    let top = window.scrollY + rect.bottom + 8;
    let left = window.scrollX + rect.left;

    // 오른쪽 경계 보정
    if (left + tipRect.width > window.scrollX + window.innerWidth - 10) {
        left = window.scrollX + window.innerWidth - tipRect.width - 12;
    }

    // 왼쪽 경계 보정
    if (left < 10) left = 10;

    // 아래 여유 공간 부족 → 위로 올림
    if (rect.bottom + tipRect.height + 40 > window.innerHeight) {
        top = window.scrollY + rect.top - tipRect.height - 10;
    }

    tip.style.top = top + "px";
    tip.style.left = left + "px";

    return tip;
}

function closeTooltip() {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
}

footnoteRefs.forEach(ref => {
    const id = ref.getAttribute("href").replace("#", "");
    const fn = document.getElementById(id);

    if (!fn) return;

    const text = fn.innerHTML.replace(/<a href="#ref\d+">↩<\/a>/, ""); // 뒤의 ↩ 제거

    /* ---- 데스크탑 hover ---- */
    ref.addEventListener("mouseenter", () => {
        if (window.innerWidth < 800) return;
        closeTooltip();
        activeTooltip = createTooltip(text, ref);
    });

    ref.addEventListener("mouseleave", () => {
        if (window.innerWidth < 800) return;
        closeTooltip();
    });

    /* ---- 모바일/데스크탑 클릭 ---- */
    ref.addEventListener("click", e => {
        e.preventDefault(); // 하단 각주 이동 차단
        e.stopPropagation();

        if (activeTooltip) {
            closeTooltip();
            return;
        }
        activeTooltip = createTooltip(text, ref);
    });
});

/* ---- 바깥 클릭 시 닫힘 ---- */
document.addEventListener("click", e => {
    if (activeTooltip && !activeTooltip.contains(e.target)) {
        closeTooltip();
    }
});

/* ============================================================
   4. 표 스크롤 보조 (모바일)
============================================================ */

function enhanceTableScroll() {
    const wraps = document.querySelectorAll(".table-wrap");
    wraps.forEach(wrap => {
        wrap.style.webkitOverflowScrolling = "touch";
        wrap.style.overflowX = "auto";
    });
}
enhanceTableScroll();

/* ============================================================
   5. 정보표/목차 DOM 보정
   - float 관련 충돌을 최소화
============================================================ */

function fixLayout() {
    const infobox = document.querySelector(".infobox");
    const toc = document.querySelector(".toc-container");

    if (!infobox || !toc) return;

    // 모바일: infobox → 맨 위로, float 제거
    if (window.innerWidth < 960) {
        infobox.style.float = "none";
        toc.style.clear = "both";
    } else {
        // 데스크탑 복원
        infobox.style.float = "right";
    }
}

window.addEventListener("resize", fixLayout);
window.addEventListener("DOMContentLoaded", fixLayout);

/* ============================================================
   End of script.js
============================================================ */

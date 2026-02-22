document.documentElement.style.setProperty("scroll-behavior", "auto");

window.addEventListener("load", () => {
	setTimeout(() => {
		document.documentElement.style.removeProperty("scroll-behavior");
	}, 100);
});

// ─── Tab Component ───────────────────────────────────────────────────────────

const ACTIVE_BTN =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-2 border-cyan-500 transition";
const INACTIVE_BTN =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-2 border-transparent transition";

const ACTIVE_SPAN =
	"bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent";
const INACTIVE_SPAN =
	"bg-linear-to-r from-zinc-500 to-zinc-400 bg-clip-text text-transparent";

const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];
const panels = tabs.map((tab) =>
	document.getElementById(tab.getAttribute("aria-controls")),
);

function activateTab(index) {
	tabs.forEach((tab, i) => {
		const isActive = i === index;
		tab.className = isActive ? ACTIVE_BTN : INACTIVE_BTN;
		tab.setAttribute("aria-selected", String(isActive));
		tab.tabIndex = isActive ? 0 : -1;

		const span = tab.querySelector("span");
		if (span) span.className = isActive ? ACTIVE_SPAN : INACTIVE_SPAN;
	});
	panels.forEach((panel, i) => {
		i === index
			? panel.removeAttribute("hidden")
			: panel.setAttribute("hidden", "");
	});
}

// Set initial state
activateTab(0);

// Click
tabs.forEach((tab, i) => {
	tab.addEventListener("click", () => activateTab(i));
});

// Keyboard: arrow keys, Home, End
tablist.addEventListener("keydown", (e) => {
	const current = tabs.indexOf(document.activeElement);
	let next = -1;

	if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
	if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
	if (e.key === "Home") next = 0;
	if (e.key === "End") next = tabs.length - 1;

	if (next !== -1) {
		e.preventDefault();
		activateTab(next);
		tabs[next].focus();
	}
});

// ─── Footer Year ─────────────────────────────────────────────────────────────
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

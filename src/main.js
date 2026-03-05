document.documentElement.style.setProperty("scroll-behavior", "auto");

window.addEventListener("load", () => {
	setTimeout(() => {
		document.documentElement.style.removeProperty("scroll-behavior");
	}, 100);
});

// ─── Theme ────────────────────────────────────────────────────────────────────

// SVG gradient stop colors per theme
const SVG_THEME = {
	dark: {
		brandFrom: "#22d3ee", // cyan-400  (light end of blue→cyan gradient)
		metric: "#1c8af5", // mid blue
		brandTo: "#135ffb", // blue-600  (dark end)
		logoAccent: "#135ffb",
		bloomFill: "#135ffb",
		bloomOpacity: "0.08",
		gridStroke: "#e9e9e9",
	},
	light: {
		brandFrom: "#8B5CF6", // violet-500
		metric: "#7C6FF700", // mid indigo-violet
		brandTo: "#6366F1", // indigo-500
		logoAccent: "#6366F1",
		bloomFill: "#7C6FF7",
		bloomOpacity: "0.05",
		gridStroke: "#151515",
	},
};

function applyTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);

	// Update <meta name="theme-color">
	const metaTheme = document.getElementById("meta-theme-color");
	if (metaTheme) {
		metaTheme.setAttribute("content", theme === "dark" ? "#09090b" : "#fafaf9");
	}

	const c = SVG_THEME[theme];

	// Update SVG gradient stops
	document.querySelectorAll(".svg-brand-from").forEach((el) => {
		el.setAttribute("stop-color", c.brandFrom);
	});
	document.querySelectorAll(".svg-brand-to").forEach((el) => {
		el.setAttribute("stop-color", c.brandTo);
	});
	document.querySelectorAll(".svg-metric-to").forEach((el) => {
		el.setAttribute("stop-color", c.metric);
	});
	document.querySelectorAll(".svg-logo-accent").forEach((el) => {
		el.setAttribute("fill", c.logoAccent);
	});

	// Update hero grid lines
	document.querySelectorAll(".svg-grid-line").forEach((el) => {
		el.setAttribute("stroke", c.gridStroke);
	});

	// Update hero bloom ellipse
	const bloom = document.querySelector(".svg-bloom");
	if (bloom) {
		bloom.setAttribute("fill", c.bloomFill);
		bloom.setAttribute("opacity", c.bloomOpacity);
	}

	// Re-render active tab so tab classes re-apply
	const activeIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
	if (activeIndex !== -1) activateTab(activeIndex);
}

function initTheme() {
	const saved = localStorage.getItem("theme");
	if (saved === "dark" || saved === "light") return saved;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// ─── Tab Component ────────────────────────────────────────────────────────────

const ACTIVE_BTN =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-1 tab-border-active transition";
const INACTIVE_BTN =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-1 border-transparent transition";

const ACTIVE_SPAN = "tab-gradient-active bg-clip-text text-transparent";
const INACTIVE_SPAN = "bg-linear-to-r from-zinc-500 to-zinc-400 bg-clip-text text-transparent";

const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

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
		i === index ? panel.removeAttribute("hidden") : panel.setAttribute("hidden", "");
	});
}

activateTab(0);

tabs.forEach((tab, i) => {
	tab.addEventListener("click", () => activateTab(i));
});

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

// ─── Theme Toggle Button ──────────────────────────────────────────────────────

const themeToggle = document.getElementById("theme-toggle");
let currentTheme = initTheme();
applyTheme(currentTheme);

if (themeToggle) {
	themeToggle.addEventListener("click", () => {
		currentTheme = currentTheme === "dark" ? "light" : "dark";
		localStorage.setItem("theme", currentTheme);
		applyTheme(currentTheme);
	});
}

// Re-apply if system preference changes and user hasn't saved a preference
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	if (!localStorage.getItem("theme")) {
		currentTheme = e.matches ? "dark" : "light";
		applyTheme(currentTheme);
	}
});

// ─── Footer Year ──────────────────────────────────────────────────────────────
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

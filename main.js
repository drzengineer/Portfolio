// ─── Tab Component ──────────────────────────────────────────────────────────

const ACTIVE_TAB_CLASS =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-2 border-cyan-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text transition";
const INACTIVE_TAB_CLASS =
	"px-3 py-2 sm:p-4 md:px-6 md:py-4 text-sm font-medium border-b-2 border-transparent text-zinc-400 hover:text-zinc-300 transition";

/**
 * Activates a tab panel by name and updates all button states.
 * @param {string} tabName - The data-tab value to activate.
 */
function showTab(tabName) {
	document.querySelectorAll("[data-tab]").forEach((btn) => {
		const isActive = btn.dataset.tab === tabName;
		btn.className = isActive ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS;
		btn.setAttribute("aria-selected", String(isActive));
	});

	document.querySelectorAll("[data-panel]").forEach((panel) => {
		panel.classList.toggle("hidden", panel.dataset.panel !== tabName);
	});
}

document.querySelectorAll("[data-tab]").forEach((button) => {
	button.addEventListener("click", () => showTab(button.dataset.tab));
});

// ─── Freelance Duration ──────────────────────────────────────────────────────

/**
 * Returns a readable duration string from a start date to now.
 * Example: getDuration(2022, 8) → "2 years, 6 months"
 *
 * @param {number} startYear  - Full year, e.g. 2022
 * @param {number} startMonth - 1-based month, e.g. 8 for August
 * @returns {string}
 */
function getDuration(startYear, startMonth) {
	const now = new Date();
	const start = new Date(startYear, startMonth - 1);
	const totalMonths =
		(now.getFullYear() - start.getFullYear()) * 12 +
		(now.getMonth() - start.getMonth());
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
	return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
}

// Freelance start: August 2022
const durationEl = document.getElementById("freelanceDuration");
if (durationEl) durationEl.textContent = getDuration(2022, 8);

// ─── Footer Year ─────────────────────────────────────────────────────────────
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

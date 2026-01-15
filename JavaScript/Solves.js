// File: JavaScript/Solves.js
// Description: Handles all logic for managing solve times and statistics.

const Solves = (function () {
  // --- Private State ---
  let solveTimes = {};

  // DOM Elements (will be initialized by init)
  let timesListContentEl,
    totalSolvesCountEl,
    bestCaseNameEl,
    bestCaseAvgEl,
    worstCaseNameEl,
    worstCaseAvgEl;

  // --- Private Functions ---

  /**
   * Saves the current solveTimes object to localStorage.
   */
  function _save() {
    localStorage.setItem("solveTimes", JSON.stringify(solveTimes));
  }

  /**
   * Renders the entire list of solves based on the current state.
   */
  function _renderSolveTimesList() {
    timesListContentEl.innerHTML = "";
    let totalSolves = 0;
    const sortedCases = Object.keys(solveTimes).sort();

    for (const caseName of sortedCases) {
      const times = solveTimes[caseName];
      if (!times || times.length === 0) continue;

      totalSolves += times.length;
      const sum = times.reduce((a, b) => a + b, 0);
      const average = sum / times.length;
      const best = Math.min(...times);
      const worst = Math.max(...times);

      const allTimesString = times
        .map((t) => {
          const timeStr = t.toFixed(2);
          if (times.length > 1) {
            if (t === best) {
              return `<span class="time-best">${timeStr}</span>`;
            }
            if (t === worst) {
              return `<span class="time-worst">${timeStr}</span>`;
            }
          }
          return timeStr;
        })
        .join(", ");

      const entryEl = document.createElement("div");
      entryEl.className = "time-entry";

      entryEl.innerHTML = `
        <div class="time-entry-header">
            <span class="time-entry-casename">${caseName}</span>
            <span>
              <span class="time-entry-best">avg: ${average.toFixed(2)}</span>
              <a href="#" class="case-clear-btn" data-case="${caseName}" title="Clear this case">&times;</a>
            </span>
        </div>
        <div class="time-entry-alltimes">${allTimesString}</div>
      `;

      timesListContentEl.appendChild(entryEl);
    }
    totalSolvesCountEl.textContent = totalSolves;
  }

  /**
   * Updates the "Best Case" and "Worst Case" summary stats.
   */
  function _updateBestWorstStats() {
    let bestAvg = Infinity;
    let worstAvg = 0;
    let bestCase = "N/A";
    let worstCase = "N/A";

    const caseNames = Object.keys(solveTimes);

    if (caseNames.length === 0) {
      bestCaseNameEl.textContent = "N/A";
      bestCaseAvgEl.textContent = "0.00s";
      worstCaseNameEl.textContent = "N/A";
      worstCaseAvgEl.textContent = "0.00s";
      return;
    }

    for (const caseName of caseNames) {
      const times = solveTimes[caseName];
      if (!times || times.length === 0) continue;

      const sum = times.reduce((a, b) => a + b, 0);
      const avg = sum / times.length;

      if (avg < bestAvg) {
        bestAvg = avg;
        bestCase = caseName;
      }
      if (avg > worstAvg) {
        worstAvg = avg;
        worstCase = caseName;
      }
    }

    bestCaseNameEl.textContent = bestCase;
    bestCaseAvgEl.textContent = `${bestAvg.toFixed(2)}s`;
    worstCaseNameEl.textContent = worstCase;
    worstCaseAvgEl.textContent = `${worstAvg.toFixed(2)}s`;
  }

  // --- Public API ---
  return {
    /**
     * Initializes the Solves module and links DOM elements.
     */
    init: function (elements) {
      timesListContentEl = elements.timesListContentEl;
      totalSolvesCountEl = elements.totalSolvesCountEl;
      bestCaseNameEl = elements.bestCaseNameEl;
      bestCaseAvgEl = elements.bestCaseAvgEl;
      worstCaseNameEl = elements.worstCaseNameEl;
      worstCaseAvgEl = elements.worstCaseAvgEl;
    },

    /**
     * Loads solve times from localStorage.
     */
    load: function () {
      const storageSolveTimes = localStorage.getItem("solveTimes");
      solveTimes = storageSolveTimes ? JSON.parse(storageSolveTimes) : {};
      _renderSolveTimesList();
      _updateBestWorstStats();
    },

    /**
     * Adds a new solve time for a case.
     * @param {string} caseName - The name of the case.
     * @param {number} time - The solve time.
     */
    add: function (caseName, time) {
      if (!caseName) return;
      if (!solveTimes[caseName]) {
        solveTimes[caseName] = [];
      }
      solveTimes[caseName].push(time);
      _save();
      _renderSolveTimesList();
      _updateBestWorstStats();
    },

    /**
     * Clears all solve times from state and localStorage.
     */
    clearAll: function () {
      if (
        confirm(
          "Are you sure you want to delete ALL saved times? This cannot be undone."
        )
      ) {
        solveTimes = {};
        _save();
        _renderSolveTimesList();
        _updateBestWorstStats();
        alert("All solve times have been cleared.");
      }
    },

    /**
     * Clears all solves for a single case.
     * @param {string} caseName - The name of the case to clear.
     */
    clearCase: function (caseName) {
      if (
        confirm(`Are you sure you want to delete all solves for "${caseName}"?`)
      ) {
        delete solveTimes[caseName];
        _save();
        _renderSolveTimesList();
        _updateBestWorstStats();
      }
    },

    /**
     * Gets all solve times.
     * @returns {object} The solveTimes object.
     */
    getSolveTimes: function () {
      return solveTimes;
    },
  };
})();

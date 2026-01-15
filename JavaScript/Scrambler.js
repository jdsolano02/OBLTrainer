// File: JavaScript/Scrambler.js
// Description: Handles scramble generation, display, and navigation.

const Scrambler = (function () {
  // --- Private State ---
  let scrambleList = [];
  let scrambleOffset = 0;
  let currentCase = "";
  let usingKarn = 0;

  // DOM Elements
  let currentScrambleEl, previousScrambleEl, timerEl;

  // --- Private Functions ---
  /**
   * Generates a scramble string for a given case.
   */
  function _generate() {
    // 1. Get the next case to scramble from the Sidebar
    currentCase = Sidebar.getNextCase();
    if (currentCase === null) {
      timerEl.textContent = "--:--";
      currentScrambleEl.textContent = "Scramble will show up here";
      previousScrambleEl.textContent = "Last scramble will show up here";
      return { hasScramble: false, isError: false };
    }

    // 2. Translate and generate
    let translation = OBLtranslation[currentCase];
    if (!translation) {
      console.error(
        `Error: No translation found for case "${currentCase}". Check Constants.js.`
      );
      return { hasScramble: false, isError: true };
    }

    let translatedCase = translation[randInt(0, translation.length - 1)];
    let scramble = getScramble(translatedCase); // From ScrambleLogic.js

    // 3. Add random start/end moves
    let s = scramble[0].at(0);
    let e = scramble[0].at(-1);
    let start, end;
    if (s === "A") {
      start = [randrange(-5, 5, 3), randrange(-3, 7, 3)];
    } else {
      start = [randrange(-3, 7, 3), randrange(-4, 6, 3)];
    }
    if (e === "A") {
      end = [randrange(-4, 6, 3), randrange(-3, 7, 3)];
    } else {
      end = [randrange(-3, 7, 3), randrange(-5, 5, 3)];
    }

    // 4. Finalize
    let final = [
      (start.join(",") + scramble[0].slice(1, -1) + end.join(",")).replaceAll(
        "/",
        " / "
      ),
      start.join("") + scramble[1].slice(1, -1) + end.join(""),
      currentCase, // Save the *original* case name (e.g., "good pair/pair")
    ];

    return { hasScramble: true, finalScramble: final };
  }

  /**
   * Updates the UI with the previous scramble text.
   */
  function _displayPrevScram() {
    if (scrambleList.at(-2 - scrambleOffset) !== undefined) {
      previousScrambleEl.textContent =
        "Previous scramble: " +
        scrambleList.at(-2 - scrambleOffset)[usingKarn] +
        " (" +
        scrambleList.at(-2 - scrambleOffset)[2] +
        ")";
    } else {
      previousScrambleEl.textContent = "Last scramble will show up here";
    }
  }

  // --- Public API ---
  return {
    init: function (elements) {
      currentScrambleEl = elements.currentScrambleEl;
      previousScrambleEl = elements.previousScrambleEl;
      timerEl = elements.timerEl; // Need this to reset text
    },

    /**
     * Generates and displays a new scramble.
     * @param {boolean} wasActive - Was a scramble active before this?
     */
    generate: function (wasActive) {
      if (scrambleOffset > 0) {
        scrambleOffset--;
        _displayPrevScram();
        currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
          usingKarn
        ];
        return true; // Scramble was "generated" (navigated)
      }

      scrambleOffset = 0;
      const result = _generate();

      if (!result.hasScramble) {
        if (result.isError) {
          // Recover from a bad case
          this.generate(wasActive);
        }
        return false; // No scramble generated
      }

      let final = result.finalScramble;

      if (scrambleList.length != 0) {
        previousScrambleEl.textContent =
          "Previous scramble: " +
          scrambleList.at(-1)[usingKarn] +
          " (" +
          scrambleList.at(-1)[2] +
          ")";
      }
      if (!wasActive) {
        Timer.reset(true); // Reset timer display to 0.00
      }
      currentScrambleEl.textContent = final[usingKarn];
      scrambleList.push(final);
      return true; // Scramble generated
    },

    /**
     * Moves to the previous scramble in history.
     */
    displayPrev: function () {
      if (scrambleList.length == 0) return;
      scrambleOffset = Math.min(scrambleOffset + 1, scrambleList.length - 1);
      currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
        usingKarn
      ];
      _displayPrevScram();
    },

    /**
     * Moves to the next scramble in history (or generates a new one).
     * @param {boolean} wasActive - Was a scramble active before this?
     */
    displayNext: function (wasActive) {
      if (scrambleList.length == 0) return;
      scrambleOffset--;
      if (scrambleOffset < 0) {
        this.generate(wasActive);
      } else {
        currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
          usingKarn
        ];
        _displayPrevScram();
      }
    },

    /**
     * Gets the case name of the most recent solve.
     */
    getSolvedCase: function () {
      if (scrambleList.length === 0) return null;
      return scrambleList.at(-1)[2];
    },

    /**
     * Removes the last case from the selection.
     */
    removeLastCase: function () {
      if (scrambleList.at(-2 - scrambleOffset) !== undefined) {
        _displayPrevScram();
        const caseToDeselect = scrambleList.at(-2 - scrambleOffset)[2];
        Sidebar.deselectOBL(caseToDeselect); // Tell Sidebar to deselect
      }
    },

    setKarn: function (isKarn) {
      usingKarn = isKarn ? 1 : 0;
      if (scrambleList.length > 0) {
        currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
          usingKarn
        ];
        _displayPrevScram();
      }
    },
  };
})();

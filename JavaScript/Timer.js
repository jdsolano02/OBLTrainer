// File: JavaScript/Timer.js
// Description: Handles all logic for the stopwatch timer.

const Timer = (function () {
  // --- Private State ---
  let timer; // The DOM element to update
  let timerStart = null;
  let intervalId = null;
  let isRunning = false;

  // --- Private Functions ---

  /**
   * Updates the timer display every 10ms.
   * Relies on formatTime() from Utils.js
   */
  function _updateDisplay() {
    const now = performance.now();
    const elapsed = now - timerStart;
    if (timer) {
      // Check if timer element exists
      timer.textContent = formatTime(elapsed);
    }
  }

  // --- Public API ---
  return {
    /**
     * Initializes the Timer module.
     * @param {HTMLElement} element
     */
    init: function (element) {
      timer = element;
    },

    /**
     * Starts the timer.
     */
    start: function () {
      if (isRunning) return;

      timerStart = performance.now();
      intervalId = setInterval(_updateDisplay, 10);
      isRunning = true;
      this.setColor(""); // Clear any red/green
    },

    /**
     * Stops the timer.
     * @returns {number | null} The final elapsed time in milliseconds, or null if not running.
     */
    stop: function () {
      if (!isRunning) return null;

      clearInterval(intervalId);
      isRunning = false;
      const elapsed = performance.now() - timerStart;
      if (timer) {
        timer.textContent = formatTime(elapsed); // One final update
      }
      return elapsed;
    },

    /**
     * Resets the timer display to "0.00" or "--:--".
     * @param {boolean} canInteract - From App.js, checks if timer should be visible.
     */
    reset: function (canInteract) {
      this.stop();
      timerStart = null;
      if (timer) {
        if (canInteract) {
          timer.textContent = "0.00";
        } else {
          timer.textContent = "--:--";
        }
        this.setColor("");
      }
    },

    /**
     * Checks if the timer is currently running.
     * @returns {boolean}
     */
    isTimerRunning: function () {
      return isRunning;
    },

    /**
     * Sets the color of the timer display.
     * @param {string} className - "red", "green", or "" (default).
     */
    setColor: function (className) {
      if (!timer) return;
      timer.classList.remove("red", "green");
      if (className !== "") {
        timer.classList.add(className);
      }
    },
  };
})();

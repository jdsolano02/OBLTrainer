// File: JavaScript/App.js
// Description: Main application coordinator.
// Initializes modules and connects event listeners.

// --- TIMER EVENT STATE ---
let pressStartTime = null;
let holdTimeout = null;
let readyToStart = false;
let otherKeyPressed = 0;

// --- DOM ELEMENTS (Variables declaradas, pero NO asignadas) ---
let toggleUiEl, uploadEl, downloadEl, fileEl;
let selectorViewEl, trainerViewEl;
let OBLListEl,
  filterInputEl,
  eachCaseEl,
  selectAllEl,
  deselectAllEl,
  selectTheseEl,
  deselectTheseEl,
  showSelectionEl,
  showAllEl,
  openListsEl,
  newListEl,
  trainBtnEl;
let karnEl,
  removeLastEl,
  currentScrambleEl,
  previousScrambleEl,
  prevScrambleButton,
  nextScrambleButton,
  timerEl,
  timerBoxEl;
let timesListContentEl,
  totalSolvesCountEl,
  clearTimesLinkEl,
  bestCaseNameEl,
  bestCaseAvgEl,
  worstCaseNameEl,
  worstCaseAvgEl;
let userListsEl,
  defaultListsEl,
  deleteListEl,
  overwriteListEl,
  selectListEl,
  trainListEl,
  listPopupEl;

// --- VIEW NAVIGATION ---
function showTrainerView() {
  selectorViewEl.classList.add("hidden");
  trainerViewEl.classList.remove("hidden");

  const wasActive =
    !!currentScrambleEl.textContent &&
    currentScrambleEl.textContent !== "Scramble will show up here";
  const scrambleGenerated = Scrambler.generate(wasActive);

  if (!scrambleGenerated && !wasActive) {
    alert("No cases selected! Please select cases to train.");
    showSelectorView();
  }
}

function showSelectorView() {
  selectorViewEl.classList.remove("hidden");
  trainerViewEl.classList.add("hidden");
}

// --- TIMER EVENT HANDLERS (Coordinator Logic) ---
function canInteractTimer() {
  const hasActiveScramble =
    !!currentScrambleEl.textContent &&
    currentScrambleEl.textContent !== "Scramble will show up here";
  return (
    hasActiveScramble &&
    document.activeElement != filterInputEl &&
    !Sidebar.isPopupOpen()
  );
}

function timerBeginTouch(spaceEquivalent) {
  if (!canInteractTimer()) return;

  if (Timer.isTimerRunning()) {
    // --- STOP TIMER ---
    const solveTimeMs = Timer.stop();
    const solveTime = parseFloat(formatTime(solveTimeMs));
    const solvedCase = Scrambler.getSolvedCase();

    if (solveTime > 0) {
      Solves.add(solvedCase, solveTime); // Tell Solves module to add time
    }

    const wasActive = !!currentScrambleEl.textContent;
    Scrambler.generate(wasActive); // Tell Scrambler to generate next

    if (!spaceEquivalent) otherKeyPressed += 1;
  } else if (spaceEquivalent && otherKeyPressed <= 0) {
    // --- PREPARE TO START TIMER ---
    if (!pressStartTime) {
      pressStartTime = performance.now();
      Timer.setColor("red");
      holdTimeout = setTimeout(() => {
        Timer.setColor("green");
        readyToStart = true;
      }, startDelay);
    }
  }
}

function timerEndTouch(spaceEquivalent) {
  if (spaceEquivalent) {
    const heldTime = performance.now() - pressStartTime;
    clearTimeout(holdTimeout);

    if (!Timer.isTimerRunning()) {
      if (heldTime >= startDelay && readyToStart) {
        // --- START TIMER ---
        Timer.start();
      } else {
        Timer.setColor("");
      }
    }
    pressStartTime = null;
    readyToStart = false;
  } else {
    otherKeyPressed = Math.max(0, otherKeyPressed - 1);
  }
}

/**
 * Main function to initialize all modules and event listeners.
 */
async function init() {
  // --- 1. ASIGNAR ELEMENTOS DEL DOM ---
  toggleUiEl = document.getElementById("toggleui");
  uploadEl = document.getElementById("uploaddata");
  downloadEl = document.getElementById("downloaddata");
  fileEl = document.getElementById("fileinput");
  selectorViewEl = document.getElementById("selector-view");
  trainerViewEl = document.getElementById("trainer-view");
  OBLListEl = document.getElementById("results");
  filterInputEl = document.getElementById("filter");
  eachCaseEl = document.getElementById("allcases");
  selectAllEl = document.getElementById("sela");
  deselectAllEl = document.getElementById("desela");
  selectTheseEl = document.getElementById("selt");
  deselectTheseEl = document.getElementById("deselt");
  showSelectionEl = document.getElementById("showselected");
  showAllEl = document.getElementById("showall");
  openListsEl = document.getElementById("openlists");
  newListEl = document.getElementById("newlist");
  trainBtnEl = document.getElementById("train-btn");
  karnEl = document.getElementById("karn");
  removeLastEl = document.getElementById("unselprev");
  currentScrambleEl = document.getElementById("cur-scram");
  previousScrambleEl = document.getElementById("prev-scram");
  prevScrambleButton = document.getElementById("prev");
  nextScrambleButton = document.getElementById("next");
  timerEl = document.getElementById("timer");
  timerBoxEl = document.getElementById("timerbox");
  timesListContentEl = document.getElementById("times-list-content");
  totalSolvesCountEl = document.getElementById("total-solves-count");
  clearTimesLinkEl = document.getElementById("clear-times-link");
  bestCaseNameEl = document.getElementById("best-case-name");
  bestCaseAvgEl = document.getElementById("best-case-avg");
  worstCaseNameEl = document.getElementById("worst-case-name");
  worstCaseAvgEl = document.getElementById("worst-case-avg");
  userListsEl = document.getElementById("userlists");
  defaultListsEl = document.getElementById("defaultlists");
  deleteListEl = document.getElementById("dellist");
  overwriteListEl = document.getElementById("overlist");
  selectListEl = document.getElementById("sellist");
  trainListEl = document.getElementById("trainlist");
  listPopupEl = document.getElementById("list-popup");

  // --- 2. Initialize all modules ---
  Timer.init(timerEl);
  Solves.init({
    timesListContentEl: timesListContentEl,
    totalSolvesCountEl: totalSolvesCountEl,
    bestCaseNameEl: bestCaseNameEl,
    bestCaseAvgEl: bestCaseAvgEl,
    worstCaseNameEl: worstCaseNameEl,
    worstCaseAvgEl: worstCaseAvgEl,
  });
  Sidebar.init({
    OBLListEl: OBLListEl,
    filterInputEl: filterInputEl,
    eachCaseEl: eachCaseEl,
    userListsEl: userListsEl,
    defaultListsEl: defaultListsEl,
    listPopupEl: listPopupEl,
    sidebarEl: selectorViewEl,
    contentEl: trainerViewEl,
  });
  Scrambler.init({
    currentScrambleEl: currentScrambleEl,
    previousScrambleEl: previousScrambleEl,
    timerEl: timerEl,
  });

  // --- 3. Build the static UI ---
  Sidebar.buildGrid();

  // --- 4. Load data ---
  Solves.load();
  Sidebar.loadLocalSettings();
  Sidebar.filterAndDisplayCases(); // Aplica filtro inicial (mostrar todo)

  // --- 5. Load default lists from JSON ---
  try {
    const response = await fetch("./defaultlists.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    Sidebar.addDefaultLists(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // --- 6. Set initial mobile state ---
  if (window.innerWidth <= 900) {
    trainerViewEl.classList.add("hidden-mobile");
  }

  // --- 7. SET UP ALL EVENT LISTENERS ---

  // View Navigation
  toggleUiEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    showSelectorView();
  });

  // Listener para el botón "Train" (ID: train-btn)
  trainBtnEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    showTrainerView(); // <-- ACCIÓN: Ir al timer
  });

  // Solves Module Listeners
  timesListContentEl.addEventListener("click", function (e) {
    if (e.target.classList.contains("case-clear-btn")) {
      e.preventDefault();
      const caseName = e.target.dataset.case;
      Solves.clearCase(caseName);
    }
  });
  clearTimesLinkEl.addEventListener("click", (e) => {
    e.preventDefault();
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Solves.clearAll();
  });

  // Sidebar Module Listeners
  document.querySelectorAll(".case").forEach((caseEl) => {
    caseEl.addEventListener("click", () => {
      caseEl.classList.contains("checked")
        ? Sidebar.deselectOBL(caseEl.id)
        : Sidebar.selectOBL(caseEl.id);
    });
  });
  document.querySelectorAll(".obl-group-title").forEach((titleEl) => {
    titleEl.addEventListener("click", () => {
      if (Timer.isTimerRunning() || pressStartTime != null) return;
      Sidebar.toggleGroup(titleEl);
    });
  });

  filterInputEl.addEventListener("input", () => {
    filterInputEl.value = filterInputEl.value.replace(/[^a-zA-Z0-9/\- ]+/g, "");
    Sidebar.filterAndDisplayCases();
  });

  eachCaseEl.addEventListener("change", (e) => {
    Sidebar.setEachCase(e.target.checked);
  });
  selectAllEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.selectAll();
  });
  deselectAllEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.deselectAll();
  });
  selectTheseEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.selectThese();
  });
  deselectTheseEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.deselectThese();
  });
  showAllEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.showAll();
  });
  showSelectionEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    Sidebar.showSelected();
  });

  // List Popup Listeners
  // Listener para el botón "Select list" (ID: openlists)
  openListsEl.addEventListener("click", () => {
    Sidebar.openListPopup(); // <-- ACCIÓN: Abrir popup
  });
  newListEl.addEventListener("click", () => Sidebar.newList());
  overwriteListEl.addEventListener("click", () => Sidebar.overwriteList());
  deleteListEl.addEventListener("click", () => Sidebar.deleteList());

  selectListEl.addEventListener("click", () => {
    const listToView = Sidebar.getHighlightedList();
    Sidebar.selectList(listToView, false);
    Sidebar.closePopup();
  });
  trainListEl.addEventListener("click", () => {
    const listToTrain = Sidebar.getHighlightedList();
    Sidebar.selectList(listToTrain, true);
    Sidebar.closePopup();
    showTrainerView();
  });
  for (let cross of document.querySelectorAll(".cross")) {
    cross.addEventListener("click", () => Sidebar.closePopup());
  }

  // Scrambler Module Listeners
  karnEl.addEventListener("change", (e) => Scrambler.setKarn(e.target.checked));
  prevScrambleButton.addEventListener("click", () => Scrambler.displayPrev());
  nextScrambleButton.addEventListener("click", () =>
    Scrambler.displayNext(!!currentScrambleEl.textContent)
  );
  removeLastEl.addEventListener("click", () => Scrambler.removeLastCase());

  // Timer Event Listeners
  window.addEventListener("keydown", (e) => {
    if (e.code == "Escape") {
      if (Sidebar.isPopupOpen()) Sidebar.closePopup();
      if (Timer.isTimerRunning() || pressStartTime != null) {
        Timer.reset(canInteractTimer());
        pressStartTime = null;
        readyToStart = false;
        otherKeyPressed = 0;
      }
      return;
    }
    if (!canInteractTimer()) return;
    let isSpace = e.code == "Space";
    timerBeginTouch(isSpace);
    if (isSpace) e.preventDefault();
  });
  window.addEventListener("keyup", (e) => {
    if (!canInteractTimer()) return;
    let isSpace = e.code == "Space";
    timerEndTouch(isSpace);
    if (isSpace) e.preventDefault();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "hidden") {
      if (Timer.isTimerRunning() || pressStartTime != null) {
        Timer.reset(canInteractTimer());
        pressStartTime = null;
        readyToStart = false;
        otherKeyPressed = 0;
      }
    }
  });
  timerBoxEl.addEventListener("touchstart", (e) => {
    if (Sidebar.isPopupOpen()) return;
    if (!canInteractTimer()) return;
    timerBeginTouch(true);
  });
  timerBoxEl.addEventListener("touchend", (e) => {
    if (!canInteractTimer()) return;
    timerEndTouch(true);
  });

  // Data I/O Listeners
  downloadEl.addEventListener("click", () => {
    if (Timer.isTimerRunning() || pressStartTime != null) return;
    const data = {
      selectedOBL: localStorage.getItem("selectedOBL"),
      userLists: localStorage.getItem("userLists"),
      solveTimes: localStorage.getItem("solveTimes"),
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OBLTrainer_Backup.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  uploadEl.addEventListener("click", () => {
    if (pressStartTime != null) return;
    fileEl.click();
  });
  fileEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        jsonData = JSON.parse(reader.result);
        if (jsonData.selectedOBL)
          localStorage.setItem("selectedOBL", jsonData.selectedOBL);
        if (jsonData.userLists)
          localStorage.setItem("userLists", jsonData.userLists);
        if (jsonData.solveTimes)
          localStorage.setItem("solveTimes", jsonData.solveTimes);
        window.location.reload();
      } catch (e) {
        console.error("Error:", e);
      }
    };
    reader.readAsText(file);
  });
}

// --- START APPLICATION ---
document.addEventListener("DOMContentLoaded", init);

// --- ESTADO DE LA APLICACIÓN ---
let selectedOBL = []; // [oblid]
let scrambleList = []; // [[normal, karn], etc.]
let remainingOBL = [];
let eachCase = 0; // 0 = random, n = get each case n times before moving on
let usingKarn = 0; // 0 = not using karn, etc.
let defaultLists = {};
let userLists = {};
let solveTimes = {}; // Objeto para mantener los tiempos en memoria
let highlightedList = null;
let scrambleOffset = 0;
let hasActiveScramble = false;
let isPopupOpen = false;
let pressStartTime = null;
let holdTimeout = null;
let timerStart = null;
let intervalId = null;
let isRunning = false;
let readyToStart = false;
let otherKeyPressed = 0;
let currentCase = "";

// --- ELEMENTOS DEL DOM ---
// Top bar buttons
const toggleUiEl = document.getElementById("toggleui");
const uploadEl = document.getElementById("uploaddata");
const downloadEl = document.getElementById("downloaddata");
const fileEl = document.getElementById("fileinput");

const sidebarEl = document.getElementById("sidebar");
const contentEl = document.getElementById("content");

const OBLListEl = document.getElementById("results");
const filterInputEl = document.getElementById("filter");

const eachCaseEl = document.getElementById("allcases");
const karnEl = document.getElementById("karn");
const removeLastEl = document.getElementById("unselprev");

// Selection buttons
const selectAllEl = document.getElementById("sela");
const deselectAllEl = document.getElementById("desela");
const selectTheseEl = document.getElementById("selt");
const deselectTheseEl = document.getElementById("deselt");
const showSelectionEl = document.getElementById("showselected");
const showAllEl = document.getElementById("showall");

// List buttons
const openListsEl = document.getElementById("openlists");
const userListsEl = document.getElementById("userlists");
const defaultListsEl = document.getElementById("defaultlists");
const newListEl = document.getElementById("newlist");
const deleteListEl = document.getElementById("dellist");
const overwriteListEl = document.getElementById("overlist");
const selectListEl = document.getElementById("sellist");
const trainListEl = document.getElementById("trainlist");

// Popup
const listPopupEl = document.getElementById("list-popup");

// Main page elements (scrambles and timer)
const currentScrambleEl = document.getElementById("cur-scram");
const previousScrambleEl = document.getElementById("prev-scram");
const prevScrambleButton = document.getElementById("prev");
const nextScrambleButton = document.getElementById("next");
const timerEl = document.getElementById("timer");
const timerBoxEl = document.getElementById("timerbox");

// Elementos de la lista de tiempos
const timesListContentEl = document.getElementById("times-list-content");
const totalSolvesCountEl = document.getElementById("total-solves-count");
const clearTimesLinkEl = document.getElementById("clear-times-link");

// --- LÓGICA DE ALMACENAMIENTO ---
function getLocalStorageData() {
  // selectedOBL
  const storageSelectedOBL = localStorage.getItem("selectedOBL");
  if (storageSelectedOBL !== null) {
    selectedOBL = JSON.parse(storageSelectedOBL);
    for (let k of selectedOBL) {
      selectOBL(k);
    }
    if (eachCaseEl.checked) {
      enableGoEachCase(1);
    } else {
      enableGoEachCase(randInt(MIN_EACHCASE, MAX_EACHCASE));
    }
    generateScramble();
    if (selectedOBL.length != 0) {
      for (let obl of possibleOBL) {
        hideOBL(OBLname(obl));
      }
      for (let obl of selectedOBL) {
        showOBL(obl);
      }
    }
  }

  // userLists
  const storageUserLists = localStorage.getItem("userLists");
  if (storageUserLists !== null) {
    userLists = JSON.parse(storageUserLists);
    addUserLists();
  }

  // Cargar tiempos
  const storageSolveTimes = localStorage.getItem("solveTimes");
  if (storageSolveTimes !== null) {
    solveTimes = JSON.parse(storageSolveTimes);
  } else {
    solveTimes = {};
  }
  renderSolveTimesList();
}

function saveSelectedOBL() {
  localStorage.setItem("selectedOBL", JSON.stringify(selectedOBL));
  if (!hasActiveScramble || selectedOBL.length === 0) generateScramble();
}

function saveUserLists() {
  localStorage.setItem("userLists", JSON.stringify(userLists));
}

function saveSolveTimes() {
  localStorage.setItem("solveTimes", JSON.stringify(solveTimes));
}

// --- LÓGICA DE UI (VISTA) ---
function OBLname(obl) {
  return obl[0] ? `${obl[0]} ${obl[1]}/${obl[2]}` : `${obl[1]}/${obl[2]}`;
}

function listLength(list) {
  let l = 0;
  for (let i of Object.values(list)) {
    l += i;
  }
  return l;
}

function setHighlightedList(id) {
  if (id == "all") id = null;
  if (id != null) {
    const item = document.getElementById(id);
    item.classList.add("highlighted");
  }
  if (highlightedList != null) {
    document.getElementById(highlightedList).classList.remove("highlighted");
  }
  highlightedList = id;
}

function addListItemEvent(item) {
  item.addEventListener("click", () => {
    if (item.classList.contains("highlighted")) {
      item.classList.remove("highlighted");
      highlightedList = null;
    } else {
      setHighlightedList(item.id);
    }
  });
}

function passesFilter(obl, filter) {
  // obl is the standardized string
  let g = obl[0];
  let u = obl[1].toLowerCase();
  let d = obl[2].toLowerCase();
  filter = filter.replace("/", " ").toLowerCase();
  let result_from_good_bad;
  let result_from_non_good_bad;
  if ("good".startsWith(filter.split(" ")[0])) {
    if (g != "good") result_from_good_bad = false;
    else {
      if (filter.split(" ").length == 1 || filter.split(" ")[1] == "")
        result_from_good_bad = true;
      else {
        a = filter.split(" ")[1];
        if (filter.split(" ").length == 2) {
          result_from_good_bad = u.startsWith(a) || d.startsWith(a);
        } else {
          b = filter.split(" ")[2];
          result_from_good_bad =
            (u == a && d.startsWith(b)) || (d == a && u.startsWith(b));
        }
      }
    }
  }
  if ("bad".startsWith(filter.split(" ")[0])) {
    if (g != "bad") result_from_good_bad = false;
    else {
      if (filter.split(" ").length == 1 || filter.split(" ")[1] == "")
        result_from_good_bad = true;
      else {
        a = filter.split(" ")[1];
        if (filter.split(" ").length == 2) {
          result_from_good_bad = u.startsWith(a) || d.startsWith(a);
        } else {
          b = filter.split(" ")[2];
          result_from_good_bad =
            (u == a && d.startsWith(b)) || (d == a && u.startsWith(b));
        }
      }
    }
  }
  a = filter.split(" ")[0];
  if (filter.split(" ").length == 1 || filter.split(" ")[1] == "") {
    result_from_non_good_bad = u.startsWith(a) || d.startsWith(a);
  } else {
    b = filter.split(" ")[1];
    result_from_non_good_bad =
      (u == a && d.startsWith(b)) || (d == a && u.startsWith(b));
  }
  return result_from_good_bad || result_from_non_good_bad;
}

function displayPrevScram() {
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

function showAll() {
  for (let obl of possibleOBL) {
    showOBL(OBLname(obl));
  }
}

function hideOBL(text) {
  document.getElementById(text).classList.add("hidden");
}

function showOBL(text) {
  document.getElementById(text).classList.remove("hidden");
}

function selectOBL(obl) {
  document.getElementById(obl).classList.add("checked");
  if (!selectedOBL.includes(obl)) {
    selectedOBL.push(obl);
  }
  if (eachCase > 0 && !remainingOBL.includes(obl)) {
    remainingOBL = remainingOBL.concat(Array(eachCase).fill(obl));
  }
}

function deselectOBL(obl) {
  document.getElementById(obl).classList.remove("checked");
  if (selectedOBL.includes(obl)) {
    selectedOBL = selectedOBL.filter((a) => a != obl);
  }
  if (eachCase && remainingOBL.includes(obl)) {
    remainingOBL = remainingOBL.filter((a) => a != obl);
  }
}

function addUserLists() {
  let content = "";
  for (k of Object.keys(userLists)) {
    content += `
        <div id="${k}" class="list-item">${k} (${listLength(
      userLists[k]
    )})</div>`;
  }
  userListsEl.innerHTML = content;
  for (let item of document.querySelectorAll("#userlists>.list-item")) {
    addListItemEvent(item);
  }
  saveUserLists();
}

function addDefaultLists() {
  let content = "";
  for (k of Object.keys(defaultLists)) {
    content += `
        <div id="${k}" class="list-item">${k} (${listLength(
      defaultLists[k]
    )})</div>`;
  }
  defaultListsEl.innerHTML = content;
  for (let item of document.querySelectorAll("#defaultlists>.list-item")) {
    addListItemEvent(item);
  }
}

function selectList(listName, setSelection) {
  if (listName == null) {
    showAll();
    return;
  }
  let list;
  if (Object.keys(defaultLists).includes(listName)) {
    list = defaultLists[listName];
  } else {
    list = userLists[listName];
  }
  if (setSelection) {
    for (let [obl, inlist] of Object.entries(list)) {
      if (inlist) {
        showOBL(obl);
        selectOBL(obl);
      } else {
        hideOBL(obl);
        deselectOBL(obl);
      }
    }
    saveSelectedOBL();
  } else {
    for (let [obl, inlist] of Object.entries(list)) {
      if (inlist) {
        showOBL(obl);
      } else {
        hideOBL(obl);
      }
    }
  }
  saveUserLists();
}

function validName(n) {
  for (l of n) {
    if (
      l.toLowerCase() == l.toUpperCase() &&
      isNaN(parseInt(l)) &&
      !" /".includes(l)
    ) {
      return false;
    }
  }
  return true;
}

function openListPopup() {
  if (usingTimer()) return;
  isPopupOpen = true;
  listPopupEl.classList.add("open");
}

function closePopup() {
  isPopupOpen = false;
  listPopupEl.classList.remove("open");
}

function canInteractTimer() {
  return (
    hasActiveScramble && document.activeElement != filterInputEl && !isPopupOpen
  );
}

function renderSolveTimesList() {
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
                <span class="time-entry-best">avg: ${average.toFixed(2)}</span>
            </div>
            <div class="time-entry-alltimes">${allTimesString}</div>
        `;

    timesListContentEl.appendChild(entryEl);
  }
  totalSolvesCountEl.textContent = totalSolves;
}

function usingTimer() {
  return isRunning || pressStartTime != null;
}

function setColor(className) {
  timerEl.classList.remove("red", "green");
  if (className != "") timerEl.classList.add(className);
}

function startTimer() {
  timerStart = performance.now();
  intervalId = setInterval(() => {
    const now = performance.now();
    const elapsed = now - timerStart;
    timerEl.textContent = formatTime(elapsed);
  }, 10);
  isRunning = true;
  setColor("");
}

function stopTimer() {
  clearInterval(intervalId);
  isRunning = false;
}

function resetTimer(hidden) {
  stopTimer();
  pressStartTime = null;
  holdTimeout = null;
  timerStart = null;
  intervalId = null;
  readyToStart = false;
  otherKeyPressed = 0;
  if (canInteractTimer() && !hidden) {
    timerEl.textContent = "0.00";
  } else if (!hidden) {
    timerEl.textContent = "--:--";
  }
  setColor("");
}

function timerBeginTouch(spaceEquivalent) {
  if (!hasActiveScramble) return;
  if (document.activeElement == filterInputEl) return;
  if (isRunning) {
    // Stop timer
    stopTimer();

    const solvedCase = scrambleList.at(-1)[2];
    const solveTimeText = timerEl.textContent;
    const solveTime = parseFloat(solveTimeText);

    if (solveTime > 0) {
      if (!solveTimes[solvedCase]) {
        solveTimes[solvedCase] = [];
      }
      solveTimes[solvedCase].push(solveTime);
      saveSolveTimes();
      renderSolveTimesList();
    }

    generateScramble();
    if (!spaceEquivalent) otherKeyPressed += 1;
  } else if (spaceEquivalent && otherKeyPressed <= 0) {
    if (!pressStartTime) {
      pressStartTime = performance.now();
      setColor("red");
      holdTimeout = setTimeout(() => {
        setColor("green");
        readyToStart = true;
      }, startDelay);
    }
  }
}

function timerEndTouch(spaceEquivalent) {
  if (spaceEquivalent) {
    const heldTime = performance.now() - pressStartTime;
    clearTimeout(holdTimeout);
    if (!isRunning) {
      if (heldTime >= startDelay && readyToStart) {
        startTimer();
      } else {
        setColor();
      }
    }
    pressStartTime = null;
    readyToStart = false;
  } else {
    otherKeyPressed = Math.max(0, otherKeyPressed - 1);
  }
}

function enableGoEachCase(count) {
  eachCase = count;
  remainingOBL = selectedOBL.flatMap((el) => Array(eachCase).fill(el));
}

function generateScramble() {
  if (scrambleOffset > 0) {
    scrambleOffset--;
    displayPrevScram();
    currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
      usingKarn
    ];
    return;
  }
  scrambleOffset = 0;
  if (selectedOBL.length === 0) {
    timerEl.textContent = "--:--";
    currentScrambleEl.textContent = "Scramble will show up here";
    previousScrambleEl.textContent = "Last scramble will show up here";
    hasActiveScramble = false;
    scrambleList = [];
    return;
  }
  if (remainingOBL.length === 0) {
    let number = eachCaseEl.checked ? 1 : randInt(MIN_EACHCASE, MAX_EACHCASE);
    enableGoEachCase(number);
  }
  let caseNum = randInt(0, remainingOBL.length - 1);
  OBLChoice = remainingOBL.splice(caseNum, 1)[0];

  currentCase = OBLChoice;

  OBLChoice = OBLtranslation[OBLChoice];
  OBLChoice = OBLChoice[randInt(0, OBLChoice.length - 1)];
  let scramble = getScramble(OBLChoice); // Usa la función de scramble-logic.js

  let s = scramble[0].at(0);
  let e = scramble[0].at(-1);
  let start;
  let end;
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

  let final = [
    (start.join(",") + scramble[0].slice(1, -1) + end.join(",")).replaceAll(
      "/",
      " / "
    ),
    start.join("") + scramble[1].slice(1, -1) + end.join(""),
    currentCase,
  ];

  if (scrambleList.length != 0) {
    previousScrambleEl.textContent =
      "Previous scramble: " +
      scrambleList.at(-1)[usingKarn] +
      " (" +
      scrambleList.at(-1)[2] +
      ")";
  }
  if (!hasActiveScramble) {
    timerEl.textContent = "0.00";
  }
  currentScrambleEl.textContent = final[usingKarn];
  scrambleList.push(final);
  hasActiveScramble = true;
}

function clearAllTimes() {
  if (usingTimer()) return;
  if (
    confirm(
      "Are you sure you want to delete ALL saved times? This cannot be undone."
    )
  ) {
    solveTimes = {};
    saveSolveTimes();
    renderSolveTimesList();
    alert("All solve times have been cleared.");
  }
}

async function init() {
  let buttons = "";
  for (obl of possibleOBL) {
    buttons += `
        <div class="case" id="${OBLname(obl)}">${OBLname(obl)}</div>`;
  }
  OBLListEl.innerHTML += buttons;

  getLocalStorageData();

  document.querySelectorAll(".case").forEach((caseEl) => {
    caseEl.addEventListener("click", () => {
      const isChecked = caseEl.classList.contains("checked");
      n = caseEl.id;
      if (isChecked) {
        deselectOBL(n);
      } else {
        selectOBL(n);
      }
      saveSelectedOBL();
    });
  });

  await fetch("./defaultlists.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      defaultLists = data;
      addDefaultLists();
    })
    .catch((error) => console.error("Failed to fetch data:", error));
}

// --- EVENT LISTENERS ---
filterInputEl.addEventListener("input", () => {
  filterInputEl.value = filterInputEl.value.replace(/[^a-zA-Z1-4/\- ]+/g, "");
  setHighlightedList(null);
  for (obl of possibleOBL) {
    const n = OBLname(obl);
    if (passesFilter(obl, filterInputEl.value)) {
      showOBL(n);
    } else {
      hideOBL(n);
    }
  }
});

selectAllEl.addEventListener("click", () => {
  if (usingTimer()) return;
  for (let obl of possibleOBL) {
    selectOBL(OBLname(obl));
  }
  saveSelectedOBL();
});

deselectAllEl.addEventListener("click", () => {
  if (usingTimer()) return;
  for (let obl of possibleOBL) {
    deselectOBL(OBLname(obl));
  }
  saveSelectedOBL();
});

selectTheseEl.addEventListener("click", () => {
  if (usingTimer()) return;
  for (i of OBLListEl.children) {
    if (!i.classList.contains("hidden")) {
      selectOBL(i.id);
    }
  }
  saveSelectedOBL();
});

deselectTheseEl.addEventListener("click", () => {
  if (usingTimer()) return;
  for (i of OBLListEl.children) {
    if (!i.classList.contains("hidden")) {
      deselectOBL(i.id);
    }
  }
  saveSelectedOBL();
});

showAllEl.addEventListener("click", () => {
  if (usingTimer()) return;
  showAll();
});

showSelectionEl.addEventListener("click", () => {
  if (usingTimer()) return;
  for (obl of possibleOBL) {
    const n = OBLname(obl);
    if (selectedOBL.includes(n)) {
      showOBL(n);
    } else {
      hideOBL(n);
    }
  }
});

prevScrambleButton.addEventListener("click", () => {
  if (usingTimer()) return;
  if (scrambleList.length == 0) return;
  scrambleOffset = Math.min(scrambleOffset + 1, scrambleList.length - 1);
  currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
    usingKarn
  ];
  displayPrevScram();
});

nextScrambleButton.addEventListener("click", () => {
  if (usingTimer()) return;
  if (scrambleList.length == 0) return;
  scrambleOffset--;
  if (scrambleOffset < 0) {
    generateScramble();
  } else {
    currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
      usingKarn
    ];
    displayPrevScram();
  }
});

openListsEl.addEventListener("click", () => {
  if (usingTimer()) return;
  openListPopup();
});

newListEl.addEventListener("click", () => {
  if (usingTimer()) return;
  if (selectedOBL.length == 0) {
    alert("Please select OBLs to create a list!");
    return;
  }
  let newListName = prompt("Name of your list:");
  if (newListName == null || newListName == "") {
    return;
  }
  newListName = newListName.trim();
  if (newListName == "" || !validName(newListName)) {
    alert(
      "Please enter a valid name (only letters, numbers, slashes, and spaces)"
    );
    return;
  }
  if (Object.keys(defaultLists).includes(newListName)) {
    alert("A default list already has this name!");
    return;
  }
  if (Object.keys(userLists).includes(newListName)) {
    alert("You already gave this name to a list");
    return;
  }
  if (document.getElementById(newListName) != null) {
    alert("You can't give this name to a list (id taken)");
    return;
  }
  let newList = {};
  for (obl of possibleOBL) {
    const n = OBLname(obl);
    if (selectedOBL.includes(n)) {
      newList[n] = 1;
    } else {
      newList[n] = 0;
    }
    userLists[newListName] = newList;
  }
  addUserLists();
  setHighlightedList(newListName);
});

overwriteListEl.addEventListener("click", () => {
  if (usingTimer()) return;
  if (highlightedList == null) {
    alert("Please click on a list");
    return;
  } else if (Object.keys(defaultLists).includes(highlightedList)) {
    alert("You cannot overwrite a default list");
    return;
  }
  if (selectedOBL.length == 0) {
    alert("Please select OBLs to create a list!");
    return;
  }

  if (confirm("You are about to overwrite list " + highlightedList)) {
    let newList = {};
    for (obl of possibleOBL) {
      const n = OBLname(obl);
      if (selectedOBL.includes(n)) {
        newList[n] = 1;
      } else {
        newList[n] = 0;
      }
      userLists[highlightedList] = newList;
    }
    addUserLists();
    selectList(highlightedList, false);
    highlightedList = null;
    closePopup();
  }
});

selectListEl.addEventListener("click", () => {
  if (highlightedList == null) {
    alert("Please click on a list");
    return;
  }
  selectList(highlightedList, false);
  closePopup();
});

deleteListEl.addEventListener("click", () => {
  if (highlightedList == null) {
    return;
  }
  if (Object.keys(userLists).includes(highlightedList)) {
    if (confirm("You are about to delete list " + highlightedList)) {
      delete userLists[highlightedList];
      highlightedList = null;
      addUserLists();
    }
    return;
  }
  if (Object.keys(defaultLists).includes(highlightedList)) {
    alert("You cannot overwrite a default list");
    return;
  }
  alert("Error");
});

trainListEl.addEventListener("click", () => {
  if (highlightedList == null) {
    alert("Please click on a list");
    return;
  }
  selectList(highlightedList, true);
  closePopup();
});

window.addEventListener("keydown", (e) => {
  if (e.code == "Escape") {
    if (isPopupOpen) {
      closePopup();
    }
    if (usingTimer()) {
      resetTimer(false);
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
    resetTimer(true);
  }
});

timerBoxEl.addEventListener("touchstart", (e) => {
  if (isPopupOpen) return;
  if (!canInteractTimer()) return;
  timerBeginTouch(true);
});

timerBoxEl.addEventListener("touchend", (e) => {
  if (!canInteractTimer()) return;
  timerEndTouch(true);
});

toggleUiEl.addEventListener("click", () => {
  if (usingTimer()) return;
  if (sidebarEl.classList.contains("hidden")) {
    sidebarEl.classList.remove("hidden");
    sidebarEl.classList.add("full-width-mobile");
    contentEl.classList.add("hidden-mobile");
  } else {
    sidebarEl.classList.add("hidden");
    sidebarEl.classList.remove("full-width-mobile");
    contentEl.classList.remove("hidden-mobile");
  }
});

downloadEl.addEventListener("click", () => {
  if (usingTimer()) return;
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "OBLTrainerData.json";
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
      localStorage.setItem("selectedOBL", jsonData["selectedOBL"]);
      localStorage.setItem("userLists", jsonData["userLists"]);
      getLocalStorageData();
    } catch (e) {
      console.error("Error:", e);
    }
  };
  reader.readAsText(file);
});

eachCaseEl.addEventListener("change", (e) => {
  eachCase = eachCaseEl.checked ? 1 : randInt(MIN_EACHCASE, MAX_EACHCASE);
  if (eachCase == 1) {
    enableGoEachCase(eachCase);
  }
});

removeLastEl.addEventListener("click", () => {
  if (scrambleList.at(-2 - scrambleOffset) !== undefined) {
    displayPrevScram(); // Corregido: era displayPrevScram
    deselectOBL(scrambleList.at(-2 - scrambleOffset)[2]);
    saveSelectedOBL();
  }
});

karnEl.addEventListener("change", (e) => {
  usingKarn ^= 1; // switches between 0 and 1 with XOR
  currentScrambleEl.textContent = scrambleList.at(-1 - scrambleOffset)[
    usingKarn
  ];
  displayPrevScram();
});

clearTimesLinkEl.addEventListener("click", (e) => {
  e.preventDefault();
  clearAllTimes();
});

for (let cross of document.querySelectorAll(".cross")) {
  cross.addEventListener("click", () => closePopup());
}

// --- INICIAR LA APLICACIÓN ---
init();

// File: JavaScript/Sidebar.js
// Description: Handles all logic for the sidebar, including case selection and list management.

const Sidebar = (function () {
  // --- Private State ---
  let selectedOBL = [];
  let userLists = {};
  let defaultLists = {};
  let remainingOBL = [];
  let eachCase = 0;
  let highlightedList = null; // Esta es la variable que App.js no puede ver
  let isPopupOpen = false;

  /**
   * ESTADO DE VISTA: La clave de la solución.
   * Controla qué "vista" está activa.
   * null = Mostrar todo (Default)
   * "selected" = Mostrar solo los seleccionados (de selectedOBL)
   * array [...] = Mostrar solo los casos de una lista (de "View")
   */
  let currentListView = null;

  // DOM Elements
  let OBLListEl,
    filterInputEl,
    eachCaseEl,
    userListsEl,
    defaultListsEl,
    listPopupEl,
    selectorViewEl,
    trainerViewEl;

  // --- Private Functions ---

  function _saveSelectedOBL() {
    localStorage.setItem("selectedOBL", JSON.stringify(selectedOBL));
    // Post an event to notify App.js to generate a new scramble if needed
    window.dispatchEvent(
      new CustomEvent("selectionChanged", {
        detail: { selectedCount: selectedOBL.length },
      })
    );
  }

  function _saveUserLists() {
    localStorage.setItem("userLists", JSON.stringify(userLists));
  }

  function _listLength(list) {
    let l = 0;
    if (list) {
      for (let i of Object.values(list)) {
        l += i;
      }
    }
    return l;
  }

  function _renderUserLists() {
    let content = "";
    for (k of Object.keys(userLists)) {
      content += `<div id="${k}" class="list-item">${k} (${_listLength(
        userLists[k]
      )})</div>`;
    }
    userListsEl.innerHTML = content;
    userListsEl.querySelectorAll(".list-item").forEach(addListItemEvent);
  }

  function setHighlightedList(id) {
    if (id == "all") id = null;
    if (highlightedList != null) {
      const el = document.getElementById(highlightedList);
      if (el) el.classList.remove("highlighted");
    }
    if (id != null) {
      const item = document.getElementById(id);
      if (item) item.classList.add("highlighted");
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

  function _passesFilter(obl, filter) {
    const caseName = OBLname(obl).toLowerCase();
    return caseName.includes(filter.toLowerCase());
  }

  function _showOBL(text) {
    const el = document.getElementById(text);
    if (el) el.classList.remove("hidden");
  }

  function _hideOBL(text) {
    const el = document.getElementById(text);
    if (el) el.classList.add("hidden");
  }

  /**
   * Itera por todos los títulos de grupo y los muestra u oculta
   * si tienen algún caso visible debajo de ellos.
   */
  function _updateGroupVisibility() {
    for (const [groupName, cases] of Object.entries(OBL_GROUPS)) {
      const titleEl = [...OBLListEl.children].find(
        (el) =>
          el.classList.contains("obl-group-title") &&
          el.textContent === groupName
      );
      if (titleEl) {
        // Busca si hay algún '.case' dentro del 'obl-grid-group' que NO esté 'hidden'
        const hasVisibleCases =
          titleEl.nextElementSibling.querySelectorAll(".case:not(.hidden)")
            .length > 0;
        titleEl.style.display = hasVisibleCases ? "block" : "none";
      }
    }
  }

  function _validName(n) {
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

  // --- Public API ---
  return {
    init: function (elements) {
      OBLListEl = elements.OBLListEl;
      filterInputEl = elements.filterInputEl;
      eachCaseEl = elements.eachCaseEl;
      userListsEl = elements.userListsEl;
      defaultListsEl = elements.defaultListsEl;
      listPopupEl = elements.listPopupEl;
      selectorViewEl = elements.selectorViewEl;
      trainerViewEl = elements.trainerViewEl;
    },

    // Localización: JavaScript/Sidebar.js -> Función buildGrid

    buildGrid: function () {
      let html = "";
      for (const [groupName, cases] of Object.entries(OBL_GROUPS)) {
        const folderName = groupName.split(" ")[0].toUpperCase() + "SLICERS";
        html += `<div class="obl-group-title">${groupName}</div>`;
        html += `<div class="obl-grid-group">`;
        for (const obl of cases) {
          const caseName = OBLname(obl);

          // --- CORRECCIÓN PARA EL SERVIDOR ---
          // 1. Dividimos por espacios o barras diagonales
          // 2. Ponemos la primera letra de cada palabra en Mayúscula
          // 3. Unimos todo con guiones bajos
          const formattedFileName = caseName
            .split(/[\s\/]+/) // Divide por espacio o /
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("_");

          const fileName = formattedFileName + ".svg";
          // -----------------------------------

          const imgSrc = `Images/OBL/${folderName}/${fileName}`;

          html += `
        <div class="case" id="${caseName}" title="${caseName}">
          <div class="puzzle-image-container">
            <img src="${imgSrc}" alt="${caseName}" loading="lazy" 
                 onerror="this.style.display='none'; console.error('No se encontró: ${imgSrc}');" />
          </div>
          <span class="case-name-text">${caseName}</span>
        </div>`;
        }
        html += `</div>`;
      }
      OBLListEl.innerHTML = html;
    },

    loadLocalSettings: function () {
      const storageSelectedOBL = localStorage.getItem("selectedOBL");
      if (storageSelectedOBL !== null) {
        selectedOBL = JSON.parse(storageSelectedOBL);
        for (let k of selectedOBL) {
          const el = document.getElementById(k);
          if (el) el.classList.add("checked");
        }
        if (eachCaseEl.checked) {
          this.enableGoEachCase(1);
        } else {
          this.enableGoEachCase(randInt(MIN_EACHCASE, MAX_EACHCASE));
        }
      }
      const storageUserLists = localStorage.getItem("userLists");
      userLists = storageUserLists ? JSON.parse(storageUserLists) : {};
      _renderUserLists();
    },

    addDefaultLists: function (lists) {
      defaultLists = lists;
      let content = "";
      for (k of Object.keys(defaultLists)) {
        content += `<div id="${k}" class="list-item">${k} (${_listLength(
          defaultLists[k]
        )})</div>`;
      }
      defaultListsEl.innerHTML = content;
      defaultListsEl.querySelectorAll(".list-item").forEach(addListItemEvent);
    },

    selectOBL: function (obl) {
      const el = document.getElementById(obl);
      if (el) el.classList.add("checked");
      if (!selectedOBL.includes(obl)) {
        selectedOBL.push(obl);
      }
      if (eachCase > 0 && !remainingOBL.includes(obl)) {
        remainingOBL = remainingOBL.concat(Array(eachCase).fill(obl));
      }
      _saveSelectedOBL();
    },

    deselectOBL: function (obl) {
      const el = document.getElementById(obl);
      if (el) el.classList.remove("checked");
      if (selectedOBL.includes(obl)) {
        selectedOBL = selectedOBL.filter((a) => a != obl);
      }
      if (eachCase && remainingOBL.includes(obl)) {
        remainingOBL = remainingOBL.filter((a) => a != obl);
      }
      _saveSelectedOBL();
    },

    selectAll: function () {
      for (let obl of getAllOblCases()) {
        this.selectOBL(OBLname(obl));
      }
    },

    deselectAll: function () {
      for (let obl of getAllOblCases()) {
        this.deselectOBL(OBLname(obl));
      }
    },

    selectThese: function () {
      const visibleCases = OBLListEl.querySelectorAll(".case:not(.hidden)");
      visibleCases.forEach((caseEl) => {
        this.selectOBL(caseEl.id);
      });
    },

    deselectThese: function () {
      const visibleCases = OBLListEl.querySelectorAll(".case:not(.hidden)");
      visibleCases.forEach((caseEl) => {
        this.deselectOBL(caseEl.id);
      });
    },

    showAll: function () {
      filterInputEl.value = "";
      currentListView = null;
      this.filterAndDisplayCases();
    },

    showSelected: function () {
      currentListView = "selected";
      this.filterAndDisplayCases();
    },

    filterAndDisplayCases: function () {
      const filterText = filterInputEl.value.toLowerCase();
      const allCases = getAllOblCases();

      for (const obl of allCases) {
        const caseName = OBLname(obl);
        const caseEl = document.getElementById(caseName);
        if (!caseEl) continue;

        const passesFilter = _passesFilter(obl, filterText);

        let inCurrentView = false;
        if (currentListView === null) {
          inCurrentView = true;
        } else if (currentListView === "selected") {
          inCurrentView = selectedOBL.includes(caseName);
        } else if (Array.isArray(currentListView)) {
          inCurrentView = currentListView.includes(caseName);
        }

        if (passesFilter && inCurrentView) {
          _showOBL(caseName);
        } else {
          _hideOBL(caseName);
        }
      }
      _updateGroupVisibility();
    },

    toggleGroup: function (titleEl) {
      const gridGroup = titleEl.nextElementSibling;
      const casesInGroup = gridGroup.querySelectorAll(".case");
      const allAreChecked = Array.from(casesInGroup).every((c) =>
        c.classList.contains("checked")
      );

      if (allAreChecked) {
        casesInGroup.forEach((caseEl) => {
          if (!caseEl.classList.contains("hidden")) this.deselectOBL(caseEl.id);
        });
      } else {
        casesInGroup.forEach((caseEl) => {
          if (!caseEl.classList.contains("hidden")) this.selectOBL(caseEl.id);
        });
      }
    },

    // --- List Management ---
    openListPopup: function () {
      isPopupOpen = true;
      listPopupEl.classList.add("open");
    },

    closePopup: function () {
      isPopupOpen = false;
      listPopupEl.classList.remove("open");
    },

    isPopupOpen: function () {
      return isPopupOpen;
    },

    newList: function () {
      if (selectedOBL.length == 0) {
        alert("Please select OBLs to create a list!");
        return;
      }
      let newListName = prompt("Name of your list:");
      if (newListName == null || newListName == "") return;
      newListName = newListName.trim();
      if (newListName == "" || !_validName(newListName)) {
        alert("Please enter a valid name");
        return;
      }
      if (
        Object.keys(defaultLists).includes(newListName) ||
        Object.keys(userLists).includes(newListName)
      ) {
        alert("A list already has this name!");
        return;
      }

      let newList = {};
      for (obl of getAllOblCases()) {
        const n = OBLname(obl);
        newList[n] = selectedOBL.includes(n) ? 1 : 0;
      }
      userLists[newListName] = newList;
      _renderUserLists();
      _saveUserLists();
      setHighlightedList(newListName);
    },

    overwriteList: function () {
      if (highlightedList == null) {
        alert("Please select a list to overwrite.");
        return;
      }
      if (Object.keys(defaultLists).includes(highlightedList)) {
        alert("You cannot overwrite a default list");
        return;
      }
      if (selectedOBL.length == 0) {
        alert("Please select OBLs to create a list!");
        return;
      }
      if (confirm("You are about to overwrite list " + highlightedList)) {
        let newList = {};
        for (obl of getAllOblCases()) {
          const n = OBLname(obl);
          newList[n] = selectedOBL.includes(n) ? 1 : 0;
        }
        userLists[highlightedList] = newList;
        _renderUserLists();
        _saveUserLists();
        this.selectList(highlightedList, false);
        highlightedList = null;
        this.closePopup();
      }
    },

    deleteList: function () {
      if (highlightedList == null) return;
      if (Object.keys(userLists).includes(highlightedList)) {
        if (confirm("You are about to delete list " + highlightedList)) {
          delete userLists[highlightedList];
          _renderUserLists();
          _saveUserLists();
          highlightedList = null;
        }
      }
    },

    selectList: function (listName, setSelection) {
      if (listName == null) {
        this.showAll();
        return;
      }
      let list;
      if (Object.keys(defaultLists).includes(listName)) {
        list = defaultLists[listName];
      } else if (Object.keys(userLists).includes(listName)) {
        list = userLists[listName];
      } else {
        console.error("Nombre de lista no encontrado:", listName);
        return;
      }

      const allCases = getAllOblCases();
      const casesInList = [];

      for (const obl of allCases) {
        const caseName = OBLname(obl);
        if (list[caseName]) {
          casesInList.push(caseName);
        }
      }

      if (setSelection) {
        // --- LÓGICA DE "TRAIN" ---
        this.deselectAll();
        for (const caseName of casesInList) {
          this.selectOBL(caseName);
        }
      } else {
        // --- LÓGICA DE "VIEW" ---
        currentListView = casesInList;
        this.filterAndDisplayCases();
      }
    },

    // --- Case Generation Logic ---
    enableGoEachCase: function (count) {
      eachCase = count;
      remainingOBL = selectedOBL.flatMap((el) => Array(eachCase).fill(el));
    },

    getNextCase: function () {
      if (selectedOBL.length === 0) return null;
      if (remainingOBL.length === 0) {
        let number = eachCaseEl.checked
          ? 1
          : randInt(MIN_EACHCASE, MAX_EACHCASE);
        this.enableGoEachCase(number);
      }
      if (remainingOBL.length === 0) return null; // Still no cases
      let caseNum = randInt(0, remainingOBL.length - 1);
      return remainingOBL.splice(caseNum, 1)[0];
    },

    setEachCase: function (isChecked) {
      eachCase = isChecked ? 1 : randInt(MIN_EACHCASE, MAX_EACHCASE);
      this.enableGoEachCase(eachCase);
    },

    // --- NUEVA FUNCIÓN PÚBLICA ---
    /**
     * Permite a App.js "preguntar" cuál es la lista seleccionada.
     * @returns {string | null} El ID de la lista destacada.
     */
    getHighlightedList: function () {
      return highlightedList;
    },
  };
})();

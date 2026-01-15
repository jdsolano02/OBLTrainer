// Description: General-purpose helper functions (pure functions).

function mod(n, m) {
  return ((n % m) + m) % m;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randrange(start, stop, step = 1) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const width = Math.ceil((stop - start) / step);
  if (width <= 0) {
    throw new Error("Invalid range");
  }
  const index = Math.floor(Math.random() * width);
  return start + index * step;
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function replaceWithDict(str, dict) {
  const pattern = new RegExp(Object.keys(dict).join("|"), "g");
  return str.replace(pattern, (match) => dict[match]);
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
}

/**
 * Convierte un array de caso OBL (ej: ["good", "kite", "kite"])
 * en un nombre legible (ej: "good kite/kite").
 * @param {Array<string>} obl - El array del caso.
 * @returns {string} El nombre del caso.
 */
function OBLname(obl) {
  if (obl[0] === "") {
    return `${obl[1]}/${obl[2]}`;
  } else {
    return `${obl[0]} ${obl[1]}/${obl[2]}`;
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function randInt(min, max) {
  // max included
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

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function replaceWithDict(str, dict) {
  // keys are already sorted longest → shortest
  const pattern = new RegExp(Object.keys(dict).join("|"), "g");
  return str.replace((match) => dict[match]);
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
}

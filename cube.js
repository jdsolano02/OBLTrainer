function mod(n, m) {
    return ((n % m) + m) % m;
}

function randInt(min, max) {
    // max included
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randrange(start, stop, step = 1) {
    if (stop === undefined) {
        // Si un seul argument est fourni, il s'agit de stop ; start = 0
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
  return str.replace(pattern, match => dict[match]);
}


// here i'll attempt to generate algs
OBL = {"1c": "BBwWWwWWwWWw",
       "cadj": "BBwBBwWWwWWw",
       "copp": "BBwWWwBBwWWw",
       "3c": "BBwBBwBBwWWw",
       "4e": "BBwBBwBBwBBw",
       "3e": "WWbWWbWWbWWw",
       "line": "WWbWWwWWbWWw",
       "L": "WWbWWbWWwWWw",
       "1e": "WWbWWwWWwWWw",

       "left pair": "WWbBBwWWwWWw",
       "right pair": "BBbWWwWWwWWw",
       "left arrow": "BBwWWwWWbWWw",
       "right arrow": "BBwWWbWWwWWw",
       "gem": "WWbBBbWWwWWw",
       "left knight": "WWwWWbWWbBBw",
       "right knight": "BBbWWbWWwWWw",
       "left axe": "WWwWWbWWwBBb",
       "right axe": "BBwWWbWWwWWb",
       "squid": "BBwWWbWWbWWw",
       "left thumb": "WWwWWbBBbWWb",
       "right thumb": "WWbBBbWWwWWb",
       "left bunny": "WWwBBbWWbWWb",
       "right bunny": "WWbWWbBBwWWb",

       "shell": "BBbBBwWWwWWw",
       "left bird": "BBwWWwWWbBBw",
       "right bird": "BBwBBbWWwWWw",
       "hazard": "BBwWWbWWwBBw",
       "left kite": "BBbBBbWWwWWw",
       "right kite": "WWwWWbBBbBBw",
       "left cut": "BBwBBwWWbWWb",
       "right cut": "BBwBBbWWbWWw",
       "black T": "BBbBBwWWbWWw",
       "white T": "WWwWWbBBwBBb",
       "left N": "WWbBBwWWbBBw",
       "right N": "WWwBBbWWwBBb",
       "black tie": "WWbBBbWWwBBw",
       "white tie": "BBwWWwBBbWWb",
       "left yoshi": "BBbWWwBBwWWw",
       "right yoshi": "WWwBBwWWbBBw"}

// format is 16-character string, both corner first
const CUBEL = 24;
const HALF_L = 6;
const LAYERL = 12;
const THREE_FOUR_L = 18;
const SOLVED_a = "BBbBBbBBbBBbWWwWWwWWwWWw";
const SOLVED_A = "bBBbBBbBBbBBwWWwWWwWWwWW";
const SLICE_a = "WWwWWwBBbBBbBBbBBbWWwWWw";
const SLICE_A = "wWWwWWbBBbBBbBBbBBwWWwWW";
const KARN = {
    "3,0":"U",
    "-3,0":"U'",
    "0,3":"D",
    "0,-3":"D'",
    "3,3":"e",
    "2,-1":"u",
    "-1,2":"d",
    "-4,-1":"F'",
    "-1,-4":"f'",
    "2,-4":"T",
    "2,2":"m",
    "-1,-1": "M'",
    "5,-1":"u2",
    "-2,1":"u'",
    "1,-2":"d'",
    "4,1":"F",
    "1,4":"f",
    "-2,4":"T'",
    "-2,-2":"m'",
    "1,1": "M",
    "-5,1": "u2'"
};
const A_MOVES = [[3,0], [-3,0], [0,3], [0,-3], [3,3],
    [2,-1], [-1,2], [-4,-1], [-1,-4], [2,-4], [2,2], [-1,-1], [5,-1]];
const a_MOVES = [[3,0], [-3,0], [0,3], [0,-3], [3,3],
    [-2,1], [1,-2], [4,1], [1,4], [-2,4], [-2,-2], [1,1], [-5,1]];
// TODO: add more moves?
const KARNL = a_MOVES.length;
const HIGHKARN = {
    // add spaces for de-ambiguity
    "U U' U U' ": "U4 ",
    "U' U U' U ": "U4' ",
    "D D' D D' ": "D4 ",
    "D' D D' D ": "D4' ",
    "u u' u u' ": "u4 ",
    "u' u u' u ": "u4' ",
    "d d' d d' ": "d4 ",
    "d' d d' d ": "d4' ",

    "U U' U ": "U3 ",
    "U' U U' ": "U3' ",
    "D D' D ": "D3 ",
    "D' D D' ": "D3' ",
    "u u' u ": "u3 ",
    "u' u u' ": "u3' ",
    "d d' d ": "d3 ",
    "d' d d' ": "d3' ",
    "F F' F ": "F3 ",
    "F' F F' ": "F3' ",
    "f f' f ": "f3 ",
    "f' f f' ": "f3' ",

    "U U' ": "W ",
    "U' U ": "W' ",
    "D D' ": "B ",
    "D' D ": "B' ",
    "u u' ": "w ",
    "u' u ": "w' ",
    "d d' ": "b ",
    "d' d ": "b' ",
    "F F' ": "F2 ",
    "F' F ": "F2' ",
    "f f' ": "f2 ",
    "f' f ": "f2' ",

    "U U ": "UU ",
    "U' U' ": "UU' ",
    "D D ": "DD ",
    "D' D' ": "DD' ",

    "60 ": "U2 ",
    "63 ": "U2D ",
    "6-3 ": "U2D' ",
    "66 ": "U2D2 ",
    "06 ": "D2 ",
    "36 ": "UD2",
    "-36 ": "U'D2"
};
// if the following moves accur, replace them with optimized ones
// UPDATE THIS
const OPTIM = {
    // longest first
    "/3,3/3,3/": "-3,-3/-3,-3",
    "/-3,-3/-3,-3/": "3,3/3,3",
    "/2,2/-2,-2/": "2,2/-2,-2",
    "/-2,-2/2,2/": "-2,-2/2,2",
    "/1,1/-1,-1/": "1,1/-1,-1",
    "/-1,-1/1,1/": "-1,-1/1,1",
    "/2,-4/-2,4/2,-4/": "2,-4/-2,4/2,-4",
    "/-2,4/2,-4/-2,4/": "-2,4/2,-4/-2,4",
    "/5,-1/-5,1/5,-1/": "5,-1/-5,1/5,-1",
    "/-5,1/5,-1/-5,1/": "-5,1/5,-1/-5,1"
}

const OPTIM_KEYS = Array.from(Object.keys(OPTIM)); // array of keys

function isOBL(layer, obl) {
    // layer: 12-char string w/ BbWw, in cs
    // obl: a key of OBL dict
    // return: bool
    let target = OBL[obl];
    // if it's top misalign, change to bottom misalign
    if (layer.charAt(0).toUpperCase() !== layer.charAt(0)) layer = shift(layer,-1);
    for (let move = 0; move <= 3; move++) {
        if (target === shift(layer, 3*move)) return true;
    }
    if (obl.split(" ").at(-1) !== "T" && obl.split(" ").at(-1) !== "tie") {   
        // T and tie colors are specified 
        layer = layer_flip(layer);
        for (let move = 0; move <= 3; move++) {
            if (target === shift(layer, 3*move)) return true;
        }}
    return false;
}

function randAMove() {
    // return: element of A_MOVES
    return JSON.parse(JSON.stringify(A_MOVES))[randInt(0,KARNL-1)];
}

function randaMove() {
    // return: element of a_MOVES
    return JSON.parse(JSON.stringify(a_MOVES))[randInt(0,KARNL-1)];
}

function layer_flip(state){
    `flips "w" to "b" and vice versa in the given state

    Args:
        state (str): the state (e.g. "BBbBBbWWwWWw")
        
    Returns:
        str: the flipped state (e.g. "WWwWWwBBbBBb")
    `
    let return_val = [];
    for (let c of state) {
        switch (c) {
            case "b":
                return_val.push("w");
                break;
            case "B":
                return_val.push("W");
                break;
            case "w":
                return_val.push("b");
                break;
            case "W":
                return_val.push("B");
                break;
            default:
                console.log(c, ": from: layer_flip(): unrecognized piece")
        }
    }
    return return_val.join("")
}

function shift(a, amount) {
    // shift "ABC" to "CAB" aka cw move
    // assumes amount <= a.length (although if it's equal it makes no impact)
    amount *= -1;
    if (amount < 0) amount += a.length;
    return a.slice(amount) + a.slice(0, amount);
}

function move(cube, u,d) {
    // u,d in int
    return shift(cube.slice(0,LAYERL), u) + 
            shift(cube.slice(LAYERL), d)
}

function slice(cube) {
    return  cube.slice(LAYERL, THREE_FOUR_L) + // bottom sliced up
            cube.slice(HALF_L, LAYERL) +
            cube.slice(0,HALF_L) +
            cube.slice(THREE_FOUR_L, CUBEL)
}

function changesAlignment(move) {
    // move in [u, d], returns boolean
    return mod(move, 3) != 0
}

function karnify(scramble) {
    // scramble: e.g. "A/-3,0/-1,2/1,-2/-1,2/3,3/-2,-2/3,3/-3,0/-1,2/3,3/3,3/-2,4/A"
    // returns "A U' d3 e m' e U' d e e T' A"
    scramble = scramble.split("/");
    // first level karnify; skip the A and a
    for (let i = 1; i < scramble.length-1; i++) {
        if (scramble[i] in KARN) scramble[i] = KARN[scramble[i]];
        else {scramble[i] = scramble[i].replace(",", "")}
    }
    // second level karnify
    scramble = scramble.join(" ")
    scramble = replaceWithDict(scramble, HIGHKARN)
    return scramble
}

function legalMove(move) {
    // move: (int) -10 ~ 12 (i think)
    // returns: -5 ~ 6
    if (move < -5) {
        return move + 12;
    }
    else if (move > 6) {
        return move - 12;
    }
    return move;
}

function addMoves(move1, move2) {
    // move1/2: "3,-3"
    move1 = move1.split(",");
    move2 = move2.split(",");
    result = [legalMove(parseInt(move1[0],10) + parseInt(move2[0],10)),
                legalMove(parseInt(move1[1],10) + parseInt(move2[1],10))];
    return result.join(",");
}

function optimize(scramble) {
    // scramble: "A/-3,-3/0,3/0,-3/-1,-4/-3,0/3,0/0,-3/0,3/a"
    while (replaceWithDict(scramble, OPTIM) !== scramble) {
        //optimize needed
        let moves = scramble.split("/");
        // moves now in ["A","3,-3", "3,0", "a"]
        let atSlice = 0; // the index of the next move in "moves"
        let cycleCompleted = false;
        for (let i = 0; i < scramble.length; i++) {
            // going over every character of scramble
            if (cycleCompleted) break;
            if (scramble.at(i) !== "/") continue;
            atSlice++;
            for (let optimable of OPTIM_KEYS) {
                // avoid getting the last "a" also
                if (scramble.length - 1-i < optimable.length) continue;
                if (scramble.slice(i, i+optimable.length) === optimable) {
                    // match!!
                    let optimableLen = optimable.split("/").length;
                    let optimTo = OPTIM[optimable].split("/"); // no slice at beginning/end
                    let delSliceNum = optimableLen - optimTo.length;
                    if (atSlice === 1) {
                        // we at the beginning; not at the end
                        if (changesAlignment(optimTo.shift().split(",")[0])) {
                            moves[0] = moves[0] === "a" ? "A" : "a";
                        }
                        // else no change
                        // now we add the end move to the next move
                        moves[atSlice+optimableLen-2] = addMoves(moves[atSlice+optimableLen-2], optimTo.pop());
                    }
                    else if (atSlice + optimableLen -1 === moves.length) {
                        // -1 cuz it starts&ends with slice
                        // we at the end; not at the beginning
                        if (changesAlignment(optimTo.pop().split(",")[0])) {
                            moves.push(moves.pop() === "a" ? "A" : "a");
                        }
                        // else no change
                        // now we add the first move to the previous move
                        moves[atSlice-1] = addMoves(moves[atSlice-1], optimTo.shift());
                    }
                    else {
                        moves[atSlice-1] = addMoves(moves[atSlice-1], optimTo.shift());
                        moves[atSlice+optimableLen-2] = addMoves(moves[atSlice+optimableLen-2], optimTo.pop());
                    }
                    // now optimTo has the two merged moves removed
                    moves.splice(atSlice, delSliceNum, ...optimTo);
                    scramble = moves.join("/")
                    cycleCompleted = true;
                    break;
                }
            }
        }
    }
    return scramble;
}

function getScramble(obl) {
    // obl: e.g. "left gem/knight"
    // return: e.g. ["A/-3,-3/0,3/0,-3/-1,-4/-3,0/3,0/0,-3/0,3/a", in karn]
    let moves = "";
    let abf;
    let topA; // bool: top misalign?
    let [u, d] = obl.split("/");
    let state;
    while (true) {
        if (Math.random() < 0.5) {
            // A start
            moves += "A/";
            topA = true;
            state = SLICE_A;
        }
        else {
            // a start
            moves += "a/";
            topA = false;
            state = SLICE_a;
        }
        // first 5 slices
        for (let i = 2; i < 6; i++) {
            abf = topA ? randAMove() : randaMove();
            state = slice(move(state, abf[0], abf[1]));
            moves += `${abf[0]},${abf[1]}/`
            if (changesAlignment(abf[0])) topA = !topA;
        }
        // slice 6-10
        for (let i = 6; i <= 10; i++){
            abf = topA ? randAMove() : randaMove();
            state = slice(move(state, abf[0], abf[1]));
            moves += `${abf[0]},${abf[1]}/`
            if (changesAlignment(abf[0])) topA = !topA;
            // includes check for layer flip
            if ((isOBL(state.slice(0,LAYERL), u) &&
                isOBL(state.slice(LAYERL), d)) ||
                (isOBL(state.slice(0,LAYERL), d) &&
                isOBL(state.slice(LAYERL), u))) {
                currentA = topA ? "A" : "a";
                moves += currentA;
                moves = optimize(moves);
                return [moves, karnify(moves)];
            }
        }
        moves = "";
    }
}

// Variables
let possibleOBL = [
    ["", "1c", "1c"],
    ["", "cadj", "cadj"],
    ["", "cadj", "copp"],
    ["", "copp", "copp"],
    ["", "3c", "3c"],
    ["", "4e", "4e"],
    ["", "3e", "3e"],
    ["", "line", "line"],
    ["", "L", "line"],
    ["", "L", "L"],
    ["", "1e", "1e"],
    ["good", "pair", "pair"],
    ["bad", "pair", "pair"],
    ["good", "arrow", "pair"],
    ["bad", "arrow", "pair"],
    ["good", "arrow", "arrow"],
    ["bad", "arrow", "arrow"],
    ["", "gem", "gem"],
    ["", "gem", "knight"],
    ["", "gem", "axe"],
    ["", "gem", "squid"],
    ["good", "knight", "knight"],
    ["bad", "knight", "knight"],
    ["good", "knight", "axe"],
    ["bad", "knight", "axe"],
    ["good", "axe", "axe"],
    ["bad", "axe", "axe"],
    ["", "squid", "knight"],
    ["", "squid", "axe"],
    ["", "squid", "squid"],
    ["good", "thumb", "thumb"],
    ["bad", "thumb", "thumb"],
    ["good", "thumb", "bunny"],
    ["bad", "thumb", "bunny"],
    ["good", "bunny", "bunny"],
    ["bad", "bunny", "bunny"],
    ["", "shell", "shell"],
    ["", "shell", "bird"],
    ["", "shell", "hazard"],
    ["", "yoshi", "shell"],
    ["good", "bird", "bird"],
    ["bad", "bird", "bird"],
    ["", "bird", "hazard"],
    ["", "hazard", "hazard"],
    ["good", "yoshi", "bird"],
    ["bad", "yoshi", "bird"],
    ["", "yoshi", "hazard"],
    ["good", "yoshi", "yoshi"],
    ["bad", "yoshi", "yoshi"],
    ["good", "kite", "kite"],
    ["bad", "kite", "kite"],
    ["good", "kite", "cut"],
    ["bad", "kite", "cut"],
    ["", "kite", "T"],
    ["good", "kite", "N"],
    ["bad", "kite", "N"],
    ["", "kite", "tie"],
    ["", "cut", "T"],
    ["good", "cut", "N"],
    ["bad", "cut", "N"],
    ["", "cut", "tie"],
    ["good", "cut", "cut"],
    ["bad", "cut", "cut"],
    ["good", "T", "T"],
    ["bad", "T", "T"],
    ["", "T", "N"],
    ["good", "T", "tie"],
    ["bad", "T", "tie"],
    ["good", "N", "N"],
    ["bad", "N", "N"],
    ["", "tie", "N"],
    ["good", "tie", "tie"],
    ["bad", "tie", "tie"]
];
let OBLtranslation = {
    // layer flips are generated by getScramble()
    "1c/1c": ["1c/1c"],
    "cadj/cadj": ["cadj/cadj"],
    "cadj/copp": ["cadj/copp"],
    "copp/copp": ["copp/copp"],
    "3c/3c": ["3c/3c"],
    "4e/4e": ["4e/4e"],
    "3e/3e": ["3e/3e"],
    "line/line": ["line/line"],
    "L/line": ["L/line"],
    "L/L": ["L/L"],
    "1e/1e": ["1e/1e"],
    "good pair/pair": ["left pair/left pair", "right pair/right pair"],
    "bad pair/pair": ["left pair/right pair"],
    "good arrow/pair": ["left arrow/right pair", "right arrow/left pair"],
    "bad arrow/pair": ["left arrow/left pair", "right arrow/right pair"],
    "good arrow/arrow": ["left arrow/left arrow", "right arrow/right arrow"],
    "bad arrow/arrow": ["left arrow/right arrow"],
    "gem/gem": ["gem/gem"],
    "gem/knight": ["gem/left knight", "gem/right knight"],
    "gem/axe": ["gem/left axe", "gem/right axe"],
    "gem/squid": ["gem/squid"],
    "good knight/knight": ["left knight/right knight"],
    "bad knight/knight": ["left knight/left knight", "right knight/right knight"],
    "good knight/axe": ["left knight/left axe", "right knight/right axe"],
    "bad knight/axe": ["left knight/right axe", "right knight/left axe"],
    "good axe/axe": ["left axe/left axe", "right axe/right axe"],
    "bad axe/axe": ["left axe/right axe"],
    "squid/knight": ["squid/left knight", "squid/right knight"],
    "squid/axe": ["squid/left axe", "squid/right axe"],
    "squid/squid": ["squid/squid"],
    "good thumb/thumb": ["left thumb/left thumb", "right thumb/right thumb"],
    "bad thumb/thumb": ["left thumb/right thumb"],
    "good thumb/bunny": ["left thumb/right bunny", "right thumb/left bunny"],
    "bad thumb/bunny": ["left thumb/left bunny", "right thumb/right bunny"],
    "good bunny/bunny": ["left bunny/left bunny", "right bunny/right bunny"],
    "bad bunny/bunny": ["left bunny/right bunny"],
    "shell/shell": ["shell/shell"],
    "shell/bird": ["shell/left bird", "shell/right bird"],
    "shell/hazard": ["shell/hazard"],
    "yoshi/shell": ["left yoshi/shell", "right yoshi/shell"],
    "good bird/bird": ["left bird/right bird"],
    "bad bird/bird": ["left bird/left bird", "right bird/right bird"],
    "bird/hazard": ["left bird/hazard", "right bird/hazard"],
    "hazard/hazard": ["hazard/hazard"],
    "good yoshi/bird": ["left yoshi/left bird", "right yoshi/right bird"],
    "bad yoshi/bird": ["left yoshi/right bird", "right yoshi/left bird"],
    "yoshi/hazard": ["left yoshi/hazard", "right yoshi/hazard"],
    "good yoshi/yoshi": ["left yoshi/left yoshi", "right yoshi/right yoshi"],
    "bad yoshi/yoshi": ["left yoshi/right yoshi"],
    "good kite/kite": ["left kite/left kite", "right kite/right kite"],
    "bad kite/kite": ["left kite/right kite"],
    "good kite/cut": ["left kite/left cut", "right kite/right cut"],
    "bad kite/cut": ["left kite/right cut", "right kite/left cut"],
    "kite/T": ["left kite/black T", "left kite/white T",
                "right kite/black T", "right kite/white T"],
    "good kite/N": ["left kite/right N", "right kite/left N"],
    "bad kite/N": ["left kite/left N", "right kite/right N"],
    "kite/tie": ["left kite/black tie", "left kite/white tie",
                "right kite/black tie", "right kite/white tie"],
    "cut/T": ["left cut/black T", "left cut/white T",
                "right cut/black T", "right cut/white T"],
    "good cut/N": ["left cut/left N", "right cut/right N"],
    "bad cut/N": ["left cut/right N", "right cut/left N"],
    "cut/tie": ["left cut/black tie", "left cut/white tie",
                "right cut/black tie", "right cut/white tie"],
    "good cut/cut": ["left cut/left cut", "right cut/right cut"],
    "bad cut/cut": ["left cut/right cut"],
    "good T/T": ["black T/black T", "white T/white T"],
    "bad T/T": ["black T/white T"],
    "T/N": ["black T/left N", "black T/right N",
            "white T/left N", "white T/right N"],
    "good T/tie": ["black T/black tie", "white T/white tie"],
    "bad T/tie": ["black T/white tie", "white T/black tie"],
    "good N/N": ["left N/left N", "right N/right N"],
    "bad N/N": ["left N/right N"],
    "tie/N": ["black tie/left N", "black tie/right N",
            "white tie/left N", "white tie/right N"],
    "good tie/tie": ["black tie/black tie", "white tie/white tie"],
    "bad tie/tie": ["black tie/white tie"]
}
let selectedOBL = []; // [oblid]
let scrambleList = []; // [[normal, karn], etc.]

let previousScramble = null;

let remainingOBL = [];
let eachCase = 0; // 0 = random, n = get each case n times before moving on
let usingKarn = 0; // 0 = not using karn, etc.
const MIN_EACHCASE = 2;
const MAX_EACHCASE = 4;

let defaultLists = {};
let userLists = {};
let highlightedList = null;

let scrambleOffset = 0;
let hasActiveScramble = false;
let isPopupOpen = false;

let cubeCenter, cubeScale;

let pressStartTime = null;
let holdTimeout = null;
let timerStart = null;
let intervalId = null;
let isRunning = false;
let readyToStart = false;
let otherKeyPressed = 0;
const startDelay = 0;

let currentCase = "";

// HTML elements

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
const removeLastEl = document.getElementById("unselprev")

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
const selectListEl = document.getElementById("sellist");
const trainListEl = document.getElementById("trainlist");

// Popup
const scramblePopupEl = document.getElementById("scram-popup");
const displayScramEl = document.getElementById("display-scram");
const canvasWrapperEl = document.getElementById("canvas-wrapper");
const displayOBLname = document.getElementById("OBLname");

const listPopupEl = document.getElementById("list-popup");

// initialize canvas declared at the very top of the file
canvas = document.getElementById("scram-canvas");
ctx = canvas.getContext("2d");

// Main page elements (scrambles and timer)
const currentScrambleEl = document.getElementById("cur-scram");
const previousScrambleEl = document.getElementById("prev-scram");
const prevScrambleButton = document.getElementById("prev");
const nextScrambleButton = document.getElementById("next");
const timerEl = document.getElementById("timer");
const timerBoxEl = document.getElementById("timerbox");

function usingTimer() {
    return isRunning || pressStartTime != null;
}

function OBLname(obl) {
    // obl in an array, gives english
    return obl[0] ? `${obl[0]} ${obl[1]}/${obl[2]}` : `${obl[1]}/${obl[2]}`;
}

function listLength(list) {
    let l = 0;
    for (let i of Object.values(list)) {
        l += i;
    }
    return l;
}

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
}

function saveSelectedOBL() {
    localStorage.setItem("selectedOBL", JSON.stringify(selectedOBL));
    // this is === 0 cuz genScram() has a if statement that deletes the scram if so
    if (!hasActiveScramble || selectedOBL.length === 0) generateScramble();
}

function saveUserLists() {
    localStorage.setItem("userLists", JSON.stringify(userLists));
}

function setHighlightedList(id) {
    if (id == "all") id = null;
    if (id != null) {
        const item = document.getElementById(id);
        item.classList.add("highlighted");
    }
    if (highlightedList != null) {
        document
            .getElementById(highlightedList)
            .classList.remove("highlighted");
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

async function init() {
    let buttons = "";
    for (obl of possibleOBL) {
        buttons += `
        <div class="case" id="${OBLname(obl)}">${OBLname(obl)}</div>`;
    }
    OBLListEl.innerHTML += buttons;

    getLocalStorageData();

    // Add buttons to the page for each OBL choice
    // Stored to a temp variable so we edit the page only once, and prevent a lag spike

    // Add event listener to each button, so we can click it
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

    // Load default lists
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

    // deselect all and show all
    showAll();
    for (let obl of possibleOBL) {
        deselectOBL(OBLname(obl));
    }
    saveSelectedOBL();
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
            // if user only typed "good":
            if (filter.split(" ").length == 1 || filter.split(" ")[1] == "") 
                result_from_good_bad = true;
            else {
                a = filter.split(" ")[1]
                // only top case:
                if (filter.split(" ").length == 2) {
                    result_from_good_bad = u.startsWith(a) || d.startsWith(a);
                }
                else {
                    b = filter.split(" ")[2]
                    result_from_good_bad = (u == a && d.startsWith(b)) || 
                            (d == a && u.startsWith(b));
                }
            }
        }
    }
    if ("bad".startsWith(filter.split(" ")[0])) {
        if (g != "bad") result_from_good_bad = false;
        else {
            // if user only typed "bad":
            if (filter.split(" ").length == 1 || filter.split(" ")[1] == "")
                result_from_good_bad = true;
            else {
                a = filter.split(" ")[1]
                // only top case:
                if (filter.split(" ").length == 2) {
                    result_from_good_bad = u.startsWith(a) || d.startsWith(a);
                }
                else {
                    b = filter.split(" ")[2]
                    result_from_good_bad = (u == a && d.startsWith(b)) || 
                            (d == a && u.startsWith(b));
                }
            }
        }
    };
    // from here, filter's g = ""
    a = filter.split(" ")[0]
    // only top case:
    if (filter.split(" ").length == 1 || filter.split(" ")[1] == "") {
        result_from_non_good_bad = u.startsWith(a) || d.startsWith(a);
    }
    else {
        b = filter.split(" ")[1]
        result_from_non_good_bad = (u == a && d.startsWith(b)) || 
                (d == a && u.startsWith(b));
    }
    return result_from_good_bad || result_from_non_good_bad;
}

function generateScramble() {
    if (scrambleOffset > 0) {
        // user probably timed one of the prev scrams
        scrambleOffset--;
        displayPrevScram();
        currentScrambleEl.textContent = scrambleList.at(-1-scrambleOffset)[usingKarn];
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
        // start a new cycle
        let number = eachCaseEl.checked
            ? 1
            : randInt(MIN_EACHCASE, MAX_EACHCASE);
        enableGoEachCase(number);
    }
    let caseNum = randInt(0, remainingOBL.length - 1);
    OBLChoice = remainingOBL.splice(caseNum, 1)[0]; // OBLChoice: "good knight/axe"

    currentCase = OBLChoice;

    OBLChoice = OBLtranslation[OBLChoice];
    OBLChoice = OBLChoice[randInt(0, OBLChoice.length - 1)];
    scramble = getScramble(OBLChoice);

    // Add random begin and end layer moves
    let s = scramble[0].at(0);
    let e = scramble[0].at(-1);
    let start;
    let end;
    if (s === "A") {
        start = [randrange(-5, 5, 3),randrange(-3, 7, 3)];
    } else {
        start = [randrange(-3, 7, 3),randrange(-4, 6, 3)];
    }
    if (e === "A") {
        end = [randrange(-4, 6, 3),randrange(-3, 7, 3)];
    } else {
        end = [randrange(-3, 7, 3),randrange(-5, 5, 3)];
    }

    let final = [
        (start.join(",") + 
            scramble[0].slice(1, -1) + 
            end.join(",")).replaceAll("/", " / "),
        start.join("") + 
            scramble[1].slice(1, -1) + 
            end.join(""),
        currentCase
    ];

    if (scrambleList.length != 0) {
        previousScrambleEl.textContent = "Previous scramble: " + 
            scrambleList.at(-1)[usingKarn] + " (" +
            scrambleList.at(-1)[2] + ")";
    }
    if (!hasActiveScramble) {
        timerEl.textContent = "0.00";
    }
    currentScrambleEl.textContent = final[usingKarn];
    scrambleList.push(final);
    hasActiveScramble = true;
}

function displayPrevScram() {
    if (scrambleList.at(-2-scrambleOffset) !== undefined) {
        // we have a prev scram to display
        previousScrambleEl.textContent = "Previous scramble: " + 
            scrambleList.at(-2-scrambleOffset)[usingKarn] + " (" +
            scrambleList.at(-2-scrambleOffset)[2] + ")";
    }
    else {
        previousScrambleEl.textContent = "Last scramble will show up here"
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
    // obl is the id of the element, which is in english
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

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
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
    setColor();
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
    }
    else if (!hidden) {
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
        generateScramble();
        if (!spaceEquivalent) otherKeyPressed += 1;
    } else if (spaceEquivalent && otherKeyPressed <= 0) {
        if (!pressStartTime) {
            pressStartTime = performance.now();
            setColor("red");
            // Après 200ms, passer en vert
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

function addUserLists() {
    let content = "";
    for (k of Object.keys(userLists)) {
        content += `
        <div id="${k}" class=\"list-item\">${k} (${listLength(
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
        <div id="${k}" class=\"list-item\">${k} (${listLength(
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
    scramblePopupEl.classList.remove("open");
    listPopupEl.classList.remove("open");
}

function canInteractTimer() {
    return (
        hasActiveScramble &&
        document.activeElement != filterInputEl &&
        !isPopupOpen
    );
}

function enableGoEachCase(count) {
    eachCase = count;
    remainingOBL = selectedOBL.flatMap((el) => Array(eachCase).fill(el));
}

init();

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
    currentScrambleEl.textContent =
        scrambleList.at(-1-scrambleOffset)[usingKarn];
    displayPrevScram()
});

nextScrambleButton.addEventListener("click", () => {
    if (usingTimer()) return;
    if (scrambleList.length == 0) return;
    scrambleOffset--;
    if (scrambleOffset < 0) {
        // scrambleOffset = 0;: this is already set in the function below
        generateScramble();
    } else {
        currentScrambleEl.textContent =
            scrambleList.at(-1-scrambleOffset)[usingKarn];
        displayPrevScram()
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
    if (scrambleList.at(-2-scrambleOffset) !== undefined) {
         displayPrevScram
        deselectOBL(scrambleList.at(-2-scrambleOffset)[2])
    saveSelectedOBL();
    }
})

karnEl.addEventListener("change", (e) => {
    usingKarn ^= 1; // switches between 0 and 1 with XOR
    currentScrambleEl.textContent = scrambleList.at(-1-scrambleOffset)[usingKarn];
    displayPrevScram()
});

// Enable crosses
for (let cross of document.querySelectorAll(".cross")) {
    cross.addEventListener("click", () => closePopup());
}






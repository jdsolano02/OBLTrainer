// Description: Holds all cube state and scramble generation logic.
function isOBL(layer, obl) {
  // layer: 12-char string w/ BbWw, in cs
  // obl: a key of OBL dict
  // return: bool
  let target = OBL[obl];
  // if it's top misalign, change to bottom misalign
  if (layer.charAt(0).toUpperCase() !== layer.charAt(0))
    layer = shift(layer, -1);
  for (let move = 0; move <= 3; move++) {
    if (target === shift(layer, 3 * move)) return true;
  }
  if (obl.split(" ").at(-1) !== "T" && obl.split(" ").at(-1) !== "tie") {
    // T and tie colors are specified
    layer = layer_flip(layer);
    for (let move = 0; move <= 3; move++) {
      if (target === shift(layer, 3 * move)) return true;
    }
  }
  return false;
}

function randAMove() {
  // return: element of A_MOVES
  return JSON.parse(JSON.stringify(A_MOVES))[randInt(0, KARNL - 1)];
}

function randaMove() {
  // return: element of a_MOVES
  return JSON.parse(JSON.stringify(a_MOVES))[randInt(0, KARNL - 1)];
}

function layer_flip(state) {
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
        console.log(c, ": from: layer_flip(): unrecognized piece");
    }
  }
  return return_val.join("");
}

function shift(a, amount) {
  // shift "ABC" to "CAB" aka cw move
  // assumes amount <= a.length (although if it's equal it makes no impact)
  amount *= -1;
  if (amount < 0) amount += a.length;
  return a.slice(amount) + a.slice(0, amount);
}

function move(cube, u, d) {
  // u,d in int
  return shift(cube.slice(0, LAYERL), u) + shift(cube.slice(LAYERL), d);
}

function slice(cube) {
  return (
    cube.slice(LAYERL, THREE_FOUR_L) + // bottom sliced up
    cube.slice(HALF_L, LAYERL) +
    cube.slice(0, HALF_L) +
    cube.slice(THREE_FOUR_L, CUBEL)
  );
}

function changesAlignment(move) {
  // move in [u, d], returns boolean
  return mod(move, 3) != 0;
}

function karnify(scramble) {
  // scramble: e.g. "A/-3,0/-1,2/1,-2/-1,2/3,3/-2,-2/3,3/-3,0/-1,2/3,3/3,3/-2,4/A"
  // returns "A U' d3 e m' e U' d e e T' A"
  scramble = scramble.split("/");
  // first level karnify; skip the A and a
  for (let i = 1; i < scramble.length - 1; i++) {
    if (scramble[i] in KARN) scramble[i] = KARN[scramble[i]];
    else {
      scramble[i] = scramble[i].replace(",", "");
    }
  }
  // second level karnify
  scramble = scramble.join(" ");
  scramble = replaceWithDict(scramble, HIGHKARN);
  return scramble;
}

function legalMove(move) {
  // move: (int) -10 ~ 12 (i think)
  // returns: -5 ~ 6
  if (move < -5) {
    return move + 12;
  } else if (move > 6) {
    return move - 12;
  }
  return move;
}

function addMoves(move1, move2) {
  // move1/2: "3,-3"
  move1 = move1.split(",");
  move2 = move2.split(",");
  result = [
    legalMove(parseInt(move1[0], 10) + parseInt(move2[0], 10)),
    legalMove(parseInt(move1[1], 10) + parseInt(move2[1], 10)),
  ];
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
        if (scramble.length - 1 - i < optimable.length) continue;
        if (scramble.slice(i, i + optimable.length) === optimable) {
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
            moves[atSlice + optimableLen - 2] = addMoves(
              moves[atSlice + optimableLen - 2],
              optimTo.pop()
            );
          } else if (atSlice + optimableLen - 1 === moves.length) {
            // -1 cuz it starts&ends with slice
            // we at the end; not at the beginning
            if (changesAlignment(optimTo.pop().split(",")[0])) {
              moves.push(moves.pop() === "a" ? "A" : "a");
            }
            // else no change
            // now we add the first move to the previous move
            moves[atSlice - 1] = addMoves(moves[atSlice - 1], optimTo.shift());
          } else {
            moves[atSlice - 1] = addMoves(moves[atSlice - 1], optimTo.shift());
            moves[atSlice + optimableLen - 2] = addMoves(
              moves[atSlice + optimableLen - 2],
              optimTo.pop()
            );
          }
          // now optimTo has the two merged moves removed
          moves.splice(atSlice, delSliceNum, ...optimTo);
          scramble = moves.join("/");
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
    } else {
      // a start
      moves += "a/";
      topA = false;
      state = SLICE_a;
    }
    // first 5 slices
    for (let i = 2; i < 6; i++) {
      abf = topA ? randAMove() : randaMove();
      state = slice(move(state, abf[0], abf[1]));
      moves += `${abf[0]},${abf[1]}/`;
      if (changesAlignment(abf[0])) topA = !topA;
    }
    // slice 6-10
    for (let i = 6; i <= 10; i++) {
      abf = topA ? randAMove() : randaMove();
      state = slice(move(state, abf[0], abf[1]));
      moves += `${abf[0]},${abf[1]}/`;
      if (changesAlignment(abf[0])) topA = !topA;
      // includes check for layer flip
      if (
        (isOBL(state.slice(0, LAYERL), u) && isOBL(state.slice(LAYERL), d)) ||
        (isOBL(state.slice(0, LAYERL), d) && isOBL(state.slice(LAYERL), u))
      ) {
        currentA = topA ? "A" : "a";
        moves += currentA;
        moves = optimize(moves);
        return [moves, karnify(moves)];
      }
    }
    moves = "";
  }
}

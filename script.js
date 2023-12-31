// Display/UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const messageTxt = document.querySelector(".subtext");
const minesLeftTxt = document.querySelector("[data-mine-count]");

const selBoardSizeEl = document.getElementById("selBoardSize");
const selNumberOfMinesEl = document.getElementById("selNumberOfMines");

const BOARD_SIZE =
  sessionStorage.getItem("BOARD_SIZE") === null
    ? 5
    : sessionStorage.getItem("BOARD_SIZE");
const NUMBER_OF_MINES =
  sessionStorage.getItem("NUMBER_OF_MINES") === null
    ? 5
    : sessionStorage.getItem("NUMBER_OF_MINES");

if (BOARD_SIZE ** 2 >= NUMBER_OF_MINES) {
  var board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
} else {
  minesLeftTxt.textContent = "TOO MANY!";
  messageTxt.classList.add("scale-1-anim-1000ms");
  setTimeout(() => {
    messageTxt.classList.remove("scale-1-anim-1000ms");
  }, 1000);
}

const boardEl = document.querySelector(".board");

selBoardSizeEl.value = BOARD_SIZE;
selNumberOfMinesEl.value = NUMBER_OF_MINES;

selBoardSizeEl.addEventListener(
  "change",
  () => {
    sessionStorage.setItem("BOARD_SIZE", selBoardSizeEl.value);
    location.reload();
  },
  false
);

selNumberOfMinesEl.addEventListener(
  "change",
  () => {
    sessionStorage.setItem("NUMBER_OF_MINES", selNumberOfMinesEl.value);
    location.reload();
  },
  false
);

let mineRevealDelay = 0;

board.forEach((row) => {
  row.forEach((tile) => {
    boardEl.append(tile.element);
    tile.element.addEventListener(
      "click",
      () => {
        revealTile(board, tile);
        checkGameEnd();
      },
      false
    );
    tile.element.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        markTile(tile);
        listMinesLeft();
      },
      false
    );
  });
});

const windowWidth = window.innerWidth;
const boardWidth = boardEl.clientHeight;
const innerBoardChildWidth = windowWidth - 20 - 4 * BOARD_SIZE;

minesLeftTxt.textContent = NUMBER_OF_MINES;
boardEl.style.setProperty("--size", BOARD_SIZE);

if (boardWidth > windowWidth / 2) {
  boardEl.style.setProperty(
    "--length",
    innerBoardChildWidth / BOARD_SIZE / 1.5 + "px"
  );
  boardEl.style.fontSize = innerBoardChildWidth / BOARD_SIZE / 1.5 - 2 + "px";
} else {
  boardEl.style.setProperty("--length", 60 / BOARD_SIZE + "vh");
  boardEl.style.fontSize = 60 / BOARD_SIZE / 1.2 + "vh";
}

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);

  minesLeftTxt.textContent = NUMBER_OF_MINES - markedTilesCount;

  minesLeftTxt.style.color = minesLeftTxt.textContent < 0 ? "red" : "#BBB";
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardEl.addEventListener(
      "click",
      stopProp,
      {
        capture: true,
      },
      false
    );
    boardEl.addEventListener(
      "contextmenu",
      stopProp,
      {
        capture: true,
      },
      false
    );

    messageTxt.textContent = win ? "You win!" : "You lose";
    messageTxt.style.color = win ? "green" : "red";
    messageTxt.classList.add("scale-1-anim-1000ms");
    setTimeout(() => {
      messageTxt.classList.remove("scale-1-anim-1000ms");
    }, 1000);
  }

  if (win) {
  } else if (lose) {
    board.forEach((row) => {
      row.forEach((tile) => {
        mineRevealDelay++;
        setTimeout(() => {
          if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile;
          if (tile.mine) revealTile(board, tile);
        }, mineRevealDelay * 15);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function crtAndAppRstBtn() {
//     const reset = document.createElement("p");
//     reset.setAttribute("id", "reset");
//     reset.style.marginTop = "-10px"
//     reset.classList.add("fade-in-anim-5000ms");
//     reset.innerHTML = "<p>↻</p>";
//     messageTxt.appendChild(reset);
//     sleep(3000).then(() => {
//         cPSCounter.setAttribute("onclick", "location.reload();");
//     });
// }

// crtAndAppRstBtn();

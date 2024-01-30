// UI
import { 
  DIFFERENT_TILE_STATES, 
  createBoard, 
  markedTile, 
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const SIZE_OF_BOARD = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(SIZE_OF_BOARD, NUMBER_OF_MINES);
const boardElement = document.querySelector(".game-board");
const minesCounterText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");

// creating the board grid
board.forEach(row => {
  row.forEach(tile => {
    boardElement.appendChild(tile.newTileElement);
    // mouse left click
    tile.newTileElement.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    // mouse right click
    tile.newTileElement.addEventListener("contextmenu", event => {
      // preventing the menu from appearing
      event.preventDefault();
      markedTile(tile);
      minesLeft()
    });
  });
});

// setting the size of the board via style. 
// This controls the --size variable in styles.css
boardElement.style.setProperty("--size", SIZE_OF_BOARD);
minesCounterText.textContent = NUMBER_OF_MINES;

// adding to removing the the mine counter
const minesLeft = () => {
  const markedTilesCount = board.reduce((count, row) => {
    return (count + row.filter(tile => tile.status === DIFFERENT_TILE_STATES.MARKED).length)
  }, 0)

  minesCounterText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

const checkGameEnd = () => {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    // stopping the user from continuing to click on the board with eventPropagation by not allowing bubbling
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  // win text
  if (win) {
    messageText.textContent = "You've Won!";
  }

  // lose text
  if (lose) {
    messageText.textContent = "You have lost!";
    board.forEach(row => {
      row.forEach(tile => {
        // show the marked tiles
        if (tile.status === DIFFERENT_TILE_STATES.MARKED) {
          markedTile(tile);
        }
        // reveal all the mines on the board
        if (tile.mine) {
          revealTile(board, tile);
        }
      })
    });
  }
}

const stopProp = (event) => {
  event.stopImmediatePropagation();
}

// 4. Check for win / lose

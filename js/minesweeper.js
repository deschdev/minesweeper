// Logic

export const DIFFERENT_TILE_STATES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

// creating the game board
export const createBoard = (sizeOfBoard, numberOfMines) => {
  const gameBoard = [];
  const positionOfMines = minePositions(sizeOfBoard, numberOfMines);
  // console.log("POSITION OF MINES: ",positionOfMines);

  // looping through the x and y positions of the game board
  for (let x = 0; x < sizeOfBoard; x++) {
    const row = [];
    for (let y = 0; y< sizeOfBoard; y++) {
      const newTileElement = document.createElement("div");
      // hidding the newTile element by default
      newTileElement.dataset.status = DIFFERENT_TILE_STATES.HIDDEN;

      // individual tile object
      const tile = {
        newTileElement,
        x,
        y,
        mine: positionOfMines.some(matchingPositions.bind(null, { x, y })),
        // getting and setting the newTileElement's status value
        get status() {
          return this.newTileElement.dataset.status
        },
        set status(value) {
          this.newTileElement.dataset.status = value
        }
      }
      row.push(tile);
    }
    gameBoard.push(row);
  }
  return gameBoard;
};

export const markedTile = (tile) => {
  // checking to see if the tile is eligible to be marked
  if (
    tile.status !== DIFFERENT_TILE_STATES.HIDDEN && 
    tile.status !== DIFFERENT_TILE_STATES.MARKED
  ) {
  // otherwise return nothing
    return
  }
  if (tile.status === DIFFERENT_TILE_STATES.MARKED) {
    tile.status = DIFFERENT_TILE_STATES.HIDDEN;
  } else {
    tile.status = DIFFERENT_TILE_STATES.MARKED;
  }
}

export const revealTile = (board, tile) => {
  // checking if the tile is eligible to be revealed
  // if the title status is hidden we will return nothing
  if (tile.status !== DIFFERENT_TILE_STATES.HIDDEN) {
    return;
  }
  // if the title status is mine we will return nothing
  if (tile.mine) {
    tile.status = DIFFERENT_TILE_STATES.MINE;
    return;
  }
  // updating the tile's status to number
  tile.status = DIFFERENT_TILE_STATES.NUMBER;
  const adjacentTiles = nearByTiles(board, tile);
  const mines = adjacentTiles.filter(t => t.mine);

  // revealing empty spaced
  if (mines.length === 0) {
    // recursively calling the revealTile function over and over again. 
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.newTileElement.textContent = mines.length;
  }
}

const minePositions = (sizeOfBoard, numberOfMines) => {
  const positions = [];
  // using a while loop as a regular for loop would overlap x, y coordinates
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(sizeOfBoard),
      y: randomNumber(sizeOfBoard),
    }
    // returns true if the size matches
    if (!positions.some(matchingPositions.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions;
}

// checking if the user has won the game
export const checkWin = (board) => {
  // checking EVERY tile on the board
  return board.every(row => {
    return row.every(tile => {
      return (
        // checking if the tile status is number && if the tile mine is either has the status of hidden or marked
        tile.status === DIFFERENT_TILE_STATES.NUMBER || 
        (tile.mine && 
          (tile.status === DIFFERENT_TILE_STATES.HIDDEN || 
            tile.status === DIFFERENT_TILE_STATES.MARKED))
      );
    });
  });
}

// checking if the user has lost the game
export const checkLose = (board) => {
  // checking the board if a tile status is mine
  return board.some(row => {
    return row.some(tile => {
      return tile.status === DIFFERENT_TILE_STATES.MINE;
    });
  });
}

// checking if x and y positions match
const matchingPositions = (a, b) => {
  return a.x === b.x && a.y === b.y;
}

// returning a random number 
const randomNumber = (size) => {
  return Math.floor(Math.random() * size);
}

// looking for near by tiles
const nearByTiles = (board, { x, y }) => {
  const tiles = [];

  // tiles surrounding a 3x3 grid
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) {
        // adding title to the empty tiles array
        tiles.push(tile);
      }
    }
  }
  // returning the populated tiles array
  return tiles;
}
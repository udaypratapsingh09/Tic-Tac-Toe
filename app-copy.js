const grid = document.getElementById("grid");
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
c.lineWidth = 4;
c.lineCap = "round";
const x = "X";
const o = "0";
const disabled = "-";

function createEmptyBoard(rows, cols) {
  let board = [];
  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < cols; j++) {
      board[i].push(" ");
    }
  }
  return board;
}

class Game {
  constructor() {
    this.gameOver = false;
    this.clearBoard();
    this.squares = [];
    this.moveCount = 0;
    this.player1 = {
      name: "Player 1",
      token: x,
      color: "Blue",
      score: 0,
    };
    this.player2 = {
      name: "Player 2",
      token: o,
      color: "Red",
      score: 0,
    };
    this.currentPlayer = Math.random() * 2 < 1 ? this.player1 : this.player2;
  }
  move = (i, j) => {
    const clickedSquare = this.squares[i][j];
    if (this.gameOver) return;
    if (clickedSquare.textContent !== "") return;
    clickedSquare.textContent = this.currentPlayer.token;
    this.board[i][j] = this.currentPlayer.token;
    clickedSquare.style.color = this.currentPlayer.color;
    this.moveCount++;
    this.isGameOver();
    if (this.currentPlayer === this.player1) this.currentPlayer = this.player2;
    else this.currentPlayer = this.player1;
  };
  isGameOver = () => {
    throw "is game over has not been defined";
  };
  clearBoard = () => {
    grid.innerHTML = "";
  };
  fillBoard = () => {
    for (let i = 0; i < this.board.length; i++) {
      let newRow = document.createElement("tr");
      grid.appendChild(newRow);
      this.squares.push([]);
      for (let j = 0; j < this.board[i].length; j++) {
        let square = document.createElement("td");

        square.classList.add("border");
        if (this.board[i][j] == "") square.classList.add("hidden");
        this.squares[i].push(square);
        this.bindClick(i, j);
        newRow.appendChild(square);
      }
    }
  };
  bindClick = (i, j) => {
    this.squares[i][j].addEventListener("click", () => {
      this.move(i, j);
    });
  };
  markComplete(start, end) {
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    const x1 = startRect.x + startRect.width / 2;
    const y1 = startRect.y + startRect.height / 2;
    const x2 = endRect.x + endRect.width / 2;
    const y2 = endRect.y + endRect.height / 2;

    c.beginPath();
    c.moveTo(x1, y1);
    c.strokeStyle = this.currentPlayer.color;
    c.lineTo(x2, y2);
    c.stroke();
  }
  // Triplet here means three of the same token in a row,column or diagonal
  countTriplets = () => {
    // checking all rows
    for (let i = 0; i < this.totalRows; i++) {
      for (let j = 0; j < this.totalCols - 2; j++) {
        let substr = `${this.board[i][j]}${this.board[i][j + 1]}${
          this.board[i][j + 2]
        }`.trim();
        if (substr == this.player1.token.repeat(3)) {
          this.player1.score++;

          this.markComplete(this.squares[i][j], this.squares[i][j + 2]);
        } else if (substr == this.player2.token.repeat(3)) {
          this.player2.score++;

          this.markComplete(this.squares[i][j], this.squares[i][j + 2]);
        }
      }
    }
    // checking columns
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 0; j < this.totalCols; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j]}${
          this.board[i + 2][j]
        }`.trim();
        if (substr == this.player1.token.repeat(3)) {
          this.player1.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j]);
        } else if (substr == this.player2.token.repeat(3)) {
          this.player2.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j]);
        }
      }
    }
    // checking ↘️ diagonals
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 0; j < this.totalCols - 2; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j + 1]}${
          this.board[i + 2][j + 2]
        }`.trim();
        if (substr == this.player1.token.repeat(3)) {
          this.player1.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j + 2]);
        } else if (substr == this.player2.token.repeat(3)) {
          this.player2.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j + 2]);
        }
      }
    }
    // checking ↙️ diagonals
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 2; j < this.totalCols; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j - 1]}${
          this.board[i + 2][j - 2]
        }`.trim();
        if (substr == this.player1.token.repeat(3)) {
          this.player1.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j - 2]);
        } else if (substr == this.player2.token.repeat(3)) {
          this.player2.score++;

          this.markComplete(this.squares[i][j], this.squares[i + 2][j - 2]);
        }
      }
    }
  };
}

class Classic extends Game {
  constructor() {
    super();
    this.totalRows = 3;
    this.totalCols = 3;
    this.board = createEmptyBoard(this.totalRows, this.totalCols);
    this.squares = [];
    this.fillBoard();
  }

  fillBoard = () => {
    for (let i = 0; i < this.totalRows; i++) {
      let newRow = document.createElement("tr");
      grid.appendChild(newRow);
      this.squares.push([]);
      for (let j = 0; j < this.totalCols; j++) {
        let square = document.createElement("td");

        if (i > 0) square.classList.add("border-top");
        if (j > 0) square.classList.add("border-left");
        this.squares[i].push(square);
        this.bindClick(i, j);
        newRow.appendChild(square);
      }
    }
  };
  isGameOver = () => {
    this.countTriplets();
    if (this.player1.score > 0) {
      this.gameOver = true;
      this.gameWinner = this.player1;
    } else if (this.player2.score > 0) {
      this.gameOver = true;
      this.gameWinner = this.player2;
    }
    return this.gameOver;
  };
}

class Pyramid extends Game {
  constructor() {
    super();
    this.totalRows = 3;
    this.totalCols = 5;
    this.board = [
      ["", "", " ", "", ""],
      ["", " ", " ", " ", ""],
      [" ", " ", " ", " ", " "],
    ];
    this.fillBoard();
  }
  isGameOver = () => {
    this.countTriplets();
    if (this.player1.score > 0) {
      this.gameOver = true;
      this.gameWinner = this.player1;
    } else if (this.player2.score > 0) {
      this.gameOver = true;
      this.gameWinner = this.player2;
    }
    return this.gameOver;
  };
}

class Standard5x5 extends Game {
  constructor() {
    super();
    this.totalRows = 5;
    this.totalCols = 5;
    this.board = createEmptyBoard(this.totalRows, this.totalCols);
    this.board[2][2] = disabled;
    this.fillBoard();
    this.squares[2][2].classList.add("disabled");
  }
  isGameOver = () => {
    this.countTriplets();
    if (this.moveCount < 24) return false;
    if (this.player1.score > this.player2.score) this.gameWinner = this.player1;
    else if (this.player1.score < this.player2.score)
      this.gameWinner = this.player2;
    else this.gameWinner = null;
  };
}

class Wild extends Classic {
  constructor() {
    super();
    this.fillBoard();
  }
  bindClick = (i, j) => {
    this.squares[i][j].addEventListener("mousedown", (e) => {
      if (e.ctrlKey) {
        this.player1.token = o;
        this.player2.token = o;
      } else {
        this.player1.token = x;
        this.player2.token = x;
      }
      this.move(i, j);
    });
  };
}
const g1 = new Wild();

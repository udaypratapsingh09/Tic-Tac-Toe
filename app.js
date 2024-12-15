const grid = document.getElementById("grid");
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
c.lineWidth = 3;
c.lineCap = "round";
const playBtn = document.querySelector(".playBtn");
const playAgainBtn = document.querySelector(".playAgainBtn");
const classicMode = document.querySelector("#Classic").value;
const pyramidMode = document.querySelector("#Pyramid").value;
const std5x5Mode = document.querySelector("#Standard5x5").value;
const wildMode = document.querySelector("#Wild").value;
const wild5x5Mode = document.querySelector("#Wild5x5").value;
const resultDiv = document.querySelector(".result");
const showMenuBtn = document.querySelector(".showMenu");
const sidebar = document.querySelector("#sidebar");

const x = "x";
const o = "o";
const disabled = "-";
const wildcard = "#";

let currentMode;

playBtn.addEventListener("click", () => {
  play(false);
  sidebar.classList.remove("visible");
  sidebar.classList.add("sm-hidden");
  showMenuBtn.classList.toggle("sm-hidden");
});
playAgainBtn.addEventListener("click", () => {
  play(true);
});
showMenuBtn.addEventListener("click", () => {
  sidebar.classList.remove("sm-hidden");
  sidebar.classList.add("visible");
});

function play(playAgain) {
  // play again is true only if game is started by using play again button
  clearBoard();
  console.log(playAgain);
  if (!playAgain) {
    currentMode = document.querySelector('input[type="radio"]:checked').value;
  }

  if (currentMode == classicMode) currentGame = new Classic();
  else if (currentMode == pyramidMode) currentGame = new Pyramid();
  else if (currentMode == std5x5Mode) currentGame = new Standard5x5();
  else if (currentMode == wildMode) currentGame = new Wild();
  else if (currentMode == wild5x5Mode) currentGame = new WildCard5x5();
}

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

function clearBoard() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  grid.innerHTML = "";
  resultDiv.textContent = "";
  playAgainBtn.classList.add("hidden");
}

function showResult(gameWinner) {
  if (gameWinner == null) resultDiv.textContent = "DRAW";
  else {resultDiv.textContent = `${gameWinner.name} has won!!!`;
  confetti({
    particleCount: 200,
    spread: 100,
    origin: {x: 0.4 , y: 0.6 },
  });}
  playAgainBtn.classList.remove("hidden");
  showMenuBtn.classList.toggle("sm-hidden");
}

function markComplete(start, end, player) {
  const startRect = start.getBoundingClientRect();
  const endRect = end.getBoundingClientRect();

  const x1 = startRect.x + startRect.width / 2;
  const y1 = startRect.y + startRect.height / 2;
  const x2 = endRect.x + endRect.width / 2;
  const y2 = endRect.y + endRect.height / 2;
  const alpha = "d8";
  c.beginPath();
  c.moveTo(x1, y1);
  c.strokeStyle = `${player.color}${alpha}`;
  c.lineTo(x2, y2);
  c.stroke();
}

class Game {
  constructor() {
    this.gameOver = false;
    this.squares = [];
    this.moveCount = 0;
    this.player1 = {
      name: "Player 1",
      token: x,
      color: "#007fff",
      score: 0,
    };
    this.player2 = {
      name: "Player 2",
      token: o,
      color: "#ff2400",
      score: 0,
    };
    this.gameWinner = null;
    this.currentPlayer = Math.random() * 2 < 1 ? this.player1 : this.player2;
  }
  move = (i, j) => {
    console.log(this.board);
    const clickedSquare = this.squares[i][j];
    if (this.gameOver) return;
    if (clickedSquare.textContent !== "") return;
    clickedSquare.textContent = this.currentPlayer.token;
    this.board[i][j] = this.currentPlayer.token;
    clickedSquare.style.color = this.currentPlayer.color;
    this.moveCount++;
    this.gameOver = this.isGameOver();
    if (this.gameOver) showResult(this.gameWinner);
    if (this.currentPlayer === this.player1) this.currentPlayer = this.player2;
    else this.currentPlayer = this.player1;
  };
  isGameOver = () => {
    throw "is game over has not been defined";
  };
  fillBoard = () => {
    clearBoard();
    for (let i = 0; i < this.board.length; i++) {
      let newRow = document.createElement("tr");
      grid.appendChild(newRow);
      this.squares.push([]);
      for (let j = 0; j < this.board[i].length; j++) {
        let square = document.createElement("td");

        square.classList.add("border");
        if (this.board[i][j] == "") square.classList.add("hidden");
        this.squares[i].push(square);
        newRow.appendChild(square);
      }
    }
  };
  bindClick = () => {
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[i].length; j++) {
        this.squares[i][j].addEventListener("click", () => {
          this.move(i, j);
        });
      }
    }
  };
  // Triplet here means three of the same token in a row,column or diagonal
  countTriplets = () => {
    // checking all rows
    for (let i = 0; i < this.totalRows; i++) {
      for (let j = 0; j < this.totalCols - 2; j++) {
        let substr = `${this.board[i][j]}${this.board[i][j + 1]}${
          this.board[i][j + 2]
        }`.trim();
        if (
          substr.replace(wildcard, this.currentPlayer.token) ==
          this.currentPlayer.token.repeat(3)
        ) {
          this.currentPlayer.score++;
          markComplete(
            this.squares[i][j],
            this.squares[i][j + 2],
            this.currentPlayer
          );
        }
      }
    }
    // checking columns
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 0; j < this.totalCols; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j]}${
          this.board[i + 2][j]
        }`.trim();
        if (
          substr.replace(wildcard, this.currentPlayer.token) ==
          this.currentPlayer.token.repeat(3)
        ) {
          this.currentPlayer.score++;
          markComplete(
            this.squares[i][j],
            this.squares[i + 2][j],
            this.currentPlayer
          );
        }
      }
    }
    // checking ↘️ diagonals
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 0; j < this.totalCols - 2; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j + 1]}${
          this.board[i + 2][j + 2]
        }`.trim();
        if (
          substr.replace(wildcard, this.currentPlayer.token) ==
          this.currentPlayer.token.repeat(3)
        ) {
          this.currentPlayer.score++;
          markComplete(
            this.squares[i][j],
            this.squares[i + 2][j + 2],
            this.currentPlayer
          );
        }
      }
    }
    // checking ↙️ diagonals
    for (let i = 0; i < this.totalRows - 2; i++) {
      for (let j = 2; j < this.totalCols; j++) {
        let substr = `${this.board[i][j]}${this.board[i + 1][j - 1]}${
          this.board[i + 2][j - 2]
        }`.trim();
        if (
          substr.replace(wildcard, this.currentPlayer.token) ==
          this.currentPlayer.token.repeat(3)
        ) {
          this.currentPlayer.score++;
          markComplete(
            this.squares[i][j],
            this.squares[i + 2][j - 2],
            this.currentPlayer
          );
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
    this.bindClick();
  }
  fillBoard = () => {
    clearBoard();
    for (let i = 0; i < this.totalRows; i++) {
      let newRow = document.createElement("tr");
      grid.appendChild(newRow);
      this.squares.push([]);
      for (let j = 0; j < this.totalCols; j++) {
        let square = document.createElement("td");

        if (i > 0) square.classList.add("border-top");
        if (j > 0) square.classList.add("border-left");
        this.squares[i].push(square);
        newRow.appendChild(square);
      }
    }
  };
  isGameOver = () => {
    this.countTriplets();
    if (this.currentPlayer.score > 0) {
      this.gameWinner = this.currentPlayer;
      return true;
    }
    if (this.moveCount == 9) return true;
    return false;
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
    this.bindClick();
  }
  isGameOver = () => {
    this.countTriplets();
    if (this.currentPlayer.score > 0) {
      this.gameWinner = this.currentPlayer;
      return true;
    }
    if (this.moveCount == 9) return true;
    return false;
  };
}

class Standard5x5 extends Game {
  constructor() {
    super();
    this.totalRows = 5;
    this.totalCols = 5;
    this.board = createEmptyBoard(this.totalRows, this.totalCols);
    this.fillBoard();
    this.bindClick();
    this.board[2][2] = disabled;
    this.squares[2][2].classList.add("disabled");
  }
  isGameOver = () => {
    this.currentPlayer.score = 0;
    this.countTriplets();
    if (this.moveCount < 24) return false;
    if (this.player1.score > this.player2.score) this.gameWinner = this.player1;
    else if (this.player1.score < this.player2.score)
      this.gameWinner = this.player2;
    return true;
  };
}

class Wild extends Classic {
  constructor() {
    super();
    this.bindClick();
  }
  bindClick = () => {
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[i].length; j++) {
        this.squares[i][j].addEventListener("mousedown", (e) => {
          console.log(e.ctrlKey);
          if (e.ctrlKey) {
            this.player1.token = o;
            this.player2.token = o;
          } else {
            this.player1.token = x;
            this.player2.token = x;
          }
          this.move(i, j);
        });
      }
    }
  };
}

class WildCard5x5 extends Standard5x5 {
  constructor() {
    super();
    this.board[2][2] = wildcard;
    this.squares[2][2].classList.remove("disabled");
    this.squares[2][2].classList.add("wildcard");
  }
}

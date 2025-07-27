const board = document.getElementById("board");
const status = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");

let cells = Array(9).fill("");
let player = "X";
let computer = "O";
let gameOver = false;
let scores = { X: 0, O: 0 };

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = val;
    cell.onclick = () => handlePlayerMove(i);
    board.appendChild(cell);
  });
}

function handlePlayerMove(index) {
  if (cells[index] || gameOver) return;
  cells[index] = player;
  moveSound.play();
  renderBoard();
  if (checkWin(player)) return endGame("X");
  if (!cells.includes("")) return endGame("draw");
  setTimeout(computerMove, 400);
}

function computerMove() {
  let bestMove = getBestMove();
  cells[bestMove] = computer;
  moveSound.play();
  renderBoard();
  if (checkWin(computer)) return endGame("O");
  if (!cells.includes("")) return endGame("draw");
}

function checkWin(symbol) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(i => cells[i] === symbol));
}

function endGame(result) {
  gameOver = true;
  if (result === "X") {
    status.textContent = "You win! 🎉";
    winSound.play();
    scores.X++;
  } else if (result === "O") {
    status.textContent = "Computer wins! 💻";
    winSound.play();
    scores.O++;
  } else {
    status.textContent = "It's a draw! 🤝";
  }
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function resetGame() {
  cells = Array(9).fill("");
  gameOver = false;
  status.textContent = "Your turn (X)";
  renderBoard();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = computer;
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin(computer)) return 10 - depth;
  if (checkWin(player)) return depth - 10;
  if (!boardState.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = computer;
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = player;
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

resetGame();

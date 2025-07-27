const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let currentPlayer = "X";
let isGameOver = false;

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startGame();

function startGame() {
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("x", "o");
    cell.addEventListener("click", handleClick, { once: true });
  });
  statusText.innerText = "Player X's turn";
  currentPlayer = "X";
  isGameOver = false;
}

function handleClick(e) {
  if (isGameOver) return;
  const cell = e.target;
  cell.innerText = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin(currentPlayer)) {
    statusText.innerText = `Player ${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (isDraw()) {
    statusText.innerText = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerText = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
  return winCombos.some(combo => {
    return combo.every(index => {
      return cells[index].innerText === player;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => cell.innerText);
}

restartBtn.addEventListener("click", startGame);

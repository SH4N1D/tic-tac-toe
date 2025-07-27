const board = document.getElementById("board");
const status = document.getElementById("status");
let currentPlayer = "X";
let cells = Array(9).fill("");
let gameOver = false;

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = val;
    cell.onclick = () => handleClick(i);
    board.appendChild(cell);
  });
}

function handleClick(i) {
  if (cells[i] || gameOver) return;
  cells[i] = currentPlayer;
  renderBoard();
  if (checkWin(currentPlayer)) {
    status.textContent = `${currentPlayer} wins!`;
    gameOver = true;
  } else if (!cells.includes("")) {
    status.textContent = "It's a draw!";
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `${currentPlayer}'s turn`;
  }
}

function checkWin(p) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(i => cells[i] === p));
}

function resetGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  status.textContent = "X's turn";
  renderBoard();
}

resetGame();

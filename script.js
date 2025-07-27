const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const themeToggleBtn = document.getElementById('theme-toggle');
const soundToggleBtn = document.getElementById('sound-toggle');
const modeToggleBtn = document.getElementById('mode-toggle');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
let cells = Array.from(document.getElementsByClassName('cell'));

let gameActive = true;
let gameState = Array(9).fill('');
let currentPlayer = 'X';
let soundOn = true;
let isVsComputer = true;

let scores = { X: 0, O: 0, Draw: 0 };

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

// Sound effects
function playSound(type) {
    if (!soundOn) return;
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let o = ctx.createOscillator();
    let g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === 'move') {
        o.frequency.value = 440;
        g.gain.value = 0.1;
    } else if (type === 'win') {
        o.frequency.value = 880;
        g.gain.value = 0.2;
    } else {
        o.frequency.value = 220;
        g.gain.value = 0.1;
    }
    o.type = 'sine';
    o.start();
    o.stop(ctx.currentTime + 0.15);
}

function handleCellClick(e) {
    const idx = parseInt(e.target.dataset.index);
    // Only allow user to play if it's their turn
    if (!gameActive || gameState[idx]) return;
    if (isVsComputer && currentPlayer !== 'X') return;

    makeMove(idx, currentPlayer);
    playSound('move');

    if (gameActive && isVsComputer && currentPlayer === 'O') {
        // Block user clicks until computer moves
        board.style.pointerEvents = 'none';
        setTimeout(() => {
            computerMove();
            board.style.pointerEvents = 'auto';
        }, 400);
    }
}

function makeMove(idx, player) {
    if (gameState[idx]) return;
    gameState[idx] = player;
    cells[idx].textContent = player;
    if (checkWin(player)) {
        statusDiv.textContent = player === 'X' ? "X wins!" : "O wins!";
        playSound('win');
        gameActive = false;
        updateScore(player);
    } else if (gameState.every(cell => cell)) {
        statusDiv.textContent = "It's a draw!";
        playSound('draw');
        gameActive = false;
        updateScore('Draw');
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        statusDiv.textContent = isVsComputer
            ? (currentPlayer === 'X' ? "Your turn" : "Computer's turn")
            : `Player ${currentPlayer}'s turn`;
    }
}

function computerMove() {
    if (!gameActive) return;
    // Find all empty cells
    let empty = [];
    for (let i = 0; i < 9; i++) {
        if (!gameState[i]) empty.push(i);
    }
    if (empty.length === 0) return;
    // Pick a random empty cell
    const idx = empty[Math.floor(Math.random() * empty.length)];
    makeMove(idx, 'O');
    playSound('move');
}

function checkWin(player) {
    return winPatterns.some(pattern =>
        pattern.every(idx => gameState[idx] === player)
    );
}

function resetGame() {
    gameState.fill('');
    cells.forEach(cell => cell.textContent = '');
    gameActive = true;
    currentPlayer = 'X';
    statusDiv.textContent = isVsComputer ? "Your turn" : `Player ${currentPlayer}'s turn`;
    board.style.pointerEvents = 'auto';
}

function updateScore(winner) {
    if (winner === 'Draw') {
        scores.Draw++;
    } else {
        scores[winner]++;
    }
    scoreX.textContent = `X: ${scores.X}`;
    scoreO.textContent = `O: ${scores.O}`;
    scoreDraw.textContent = `Draws: ${scores.Draw}`;
}

function toggleTheme() {
    document.body.classList.toggle('light');
    themeToggleBtn.textContent = document.body.classList.contains('light') ? 'Light Theme' : 'Dark Theme';
}

function toggleSound() {
    soundOn = !soundOn;
    soundToggleBtn.textContent = soundOn ? 'Sound On' : 'Sound Off';
}

function toggleMode() {
    isVsComputer = !isVsComputer;
    modeToggleBtn.textContent = isVsComputer ? 'Vs Computer' : '2 Players';
    resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
themeToggleBtn.addEventListener('click', toggleTheme);
soundToggleBtn.addEventListener('click', toggleSound);
modeToggleBtn.addEventListener('click', toggleMode);

// Initialize status and scoreboard
statusDiv.textContent = "Your turn";
scoreX.textContent = `X: ${scores.X}`;
scoreO.textContent = `O: ${scores.O}`;
scoreDraw.textContent = `Draws: ${scores.Draw}`;

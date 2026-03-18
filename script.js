window.addEventListener('scroll', function() {
    const header = document.getElementById('navbar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// --- LOGIKA MINI GAME ---
let score = 0;
let timeLeft = 15;
let gameInterval;
let timerInterval;
let isPlaying = false;

const startBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-game-btn');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score-display');
const timeDisplay = document.getElementById('time-display');
const gameArea = document.getElementById('game-area');
const gameResult = document.getElementById('game-result');
const finalMessage = document.getElementById('final-message');

function moveTarget() {
    // Menghitung batas area agar titik tidak keluar kotak
    const maxX = gameArea.clientWidth - target.clientWidth;
    const maxY = gameArea.clientHeight - target.clientHeight;
    
    // Posisi acak
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    timeLeft = 15;
    
    scoreDisplay.innerText = score;
    timeDisplay.innerText = timeLeft;
    
    startBtn.style.display = 'none';
    gameResult.style.display = 'none';
    target.style.display = 'block';
    
    moveTarget();
    
    // Titik berpindah otomatis setiap 1 detik jika tidak diklik
    gameInterval = setInterval(moveTarget, 1000);
    
    // Hitung mundur waktu
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    target.style.display = 'none';
    gameResult.style.display = 'block';
    startBtn.style.display = 'inline-block';
    startBtn.innerText = "Main Lagi";

    let message = "";
    if (score > 20) {
    message = `Skor Kamu ${score}. Fix Orang gila, NPD haha`;
    } else if (score > 15) {
        message = `Skor kamu ${score}! Wow, instingmu setajam pena master! Kamu punya fokus tinggi dan sangat detail.`;
    } else if (score > 8) {
        message = `Skor kamu ${score}. Lumayan stabil! Kepribadianmu seimbang, tenang, dan tahu kapan harus bertindak.`;
    } else if (score > 5) {
        message = `Skor kamu ${score}. Gimana ya bilangnya.. Dongo sih, gitu doang kaga bisa.`;
    } else {
        message = `Skor kamu ${score}. Fix buta. Beli mata sana!`;
    }
    
    finalMessage.innerText = message;
}

// Event Listeners untuk Game
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

target.addEventListener('click', () => {
    if (!isPlaying) return;
    score++;
    scoreDisplay.innerText = score;
    // Pindahkan target langsung setelah diklik
    moveTarget(); 
    // Reset interval agar titik tidak loncat ganda
    clearInterval(gameInterval);
    gameInterval = setInterval(moveTarget, 1000);
});

// --- LOGIKA TOMBOL TUKAR GAME ---
const toggleBtn = document.getElementById('toggle-game-btn');
const game1 = document.getElementById('game-1');
const game2 = document.getElementById('game-2');
let isGame1Active = true;

toggleBtn.addEventListener('click', () => {
    isGame1Active = !isGame1Active;
    if(isGame1Active) {
        game1.style.display = 'block';
        game2.style.display = 'none';
        toggleBtn.innerText = "Mainkan Tic-Tac-Toe (X & O) ➡️";
    } else {
        game1.style.display = 'none';
        game2.style.display = 'block';
        toggleBtn.innerText = "⬅️ Kembali ke Tes Fokus";
        resetTTT(); // Reset papan Tic-Tac-Toe saat dibuka
    }
});

// --- LOGIKA GAME TIC-TAC-TOE ---
const cells = document.querySelectorAll('.ttt-cell');
const turnDisplay = document.getElementById('ttt-turn');
const tttMessage = document.getElementById('ttt-message');
const tttResetBtn = document.getElementById('ttt-reset-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;

// Kombinasi angka kotak untuk bisa menang (Baris, Kolom, Diagonal)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    // Jika kotak sudah terisi atau game selesai, jangan lakukan apa-apa
    if (board[index] !== '' || !isGameActive) return;

    // Isi kotak dengan X atau O
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    checkWin();
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        tttMessage.innerText = `🎉 Pemain ${currentPlayer} Menang! 🎉`;
        tttMessage.style.color = currentPlayer === 'X' ? 'var(--primary-orange)' : 'var(--primary-blue)';
        isGameActive = false;
        return;
    }

    // Jika papan penuh dan tidak ada yang menang (Seri)
    if (!board.includes('')) {
        tttMessage.innerText = 'Permainan Seri! 🤝';
        tttMessage.style.color = 'var(--text-color)';
        isGameActive = false;
        return;
    }

    // Ganti giliran pemain
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnDisplay.innerText = currentPlayer;
    turnDisplay.style.color = currentPlayer === 'X' ? 'var(--primary-orange)' : 'var(--primary-blue)';
}

function resetTTT() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    tttMessage.innerText = '';
    turnDisplay.innerText = currentPlayer;
    turnDisplay.style.color = 'var(--primary-orange)';
    
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
}

// Pasang event listener ke setiap kotak
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
tttResetBtn.addEventListener('click', resetTTT);
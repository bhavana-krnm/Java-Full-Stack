const container = document.getElementById('game-container');
const librarian = document.getElementById('librarian');
const scoreVal = document.getElementById('score-val');
const noiseFill = document.getElementById('noise-fill');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

let gameActive = false;
let score = 0;
let chaos = 0;
let playerX = 375;
const playerSpeed = 15;
const containerWidth = 800;

let keys = {};
let books = [];
let kids = [];
let gameIntervals = [];

window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

function startGame() {
    score = 0;
    chaos = 0;
    playerX = 375;
    books.forEach(b => b.el.remove());
    kids.forEach(k => k.el.remove());
    books = [];
    kids = [];
    scoreVal.textContent = score;
    noiseFill.style.width = '0%';
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameActive = true;

    gameIntervals.push(setInterval(updateGame, 1000 / 60));
    gameIntervals.push(setInterval(spawnBook, 2000));
    gameIntervals.push(setInterval(spawnKid, 4000));
}

function spawnBook() {
    if (!gameActive) return;
    const el = document.createElement('div');
    el.className = 'book';
    el.textContent = '📘';
    const x = Math.random() * (containerWidth - 30);
    el.style.left = x + 'px';
    el.style.top = '50px';
    container.appendChild(el);
    books.push({ el, x, y: 50, speed: 2 + Math.random() * 2 });
}

function spawnKid() {
    if (!gameActive) return;
    const el = document.createElement('div');
    el.className = 'kid';
    el.textContent = '🏃';
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const x = side === 'left' ? -40 : containerWidth;
    const direction = side === 'left' ? 1 : -1;
    el.style.left = x + 'px';
    container.appendChild(el);
    kids.push({ el, x, direction, speed: 1.5 + Math.random() * 1.5 });
}

function updateGame() {
    if (!gameActive) return;

    if (keys['arrowleft'] || keys['a']) playerX -= playerSpeed;
    if (keys['arrowright'] || keys['d']) playerX += playerSpeed;
    
    if (playerX < 0) playerX = 0;
    if (playerX > containerWidth - 50) playerX = containerWidth - 50;
    librarian.style.left = playerX + 'px';

    for (let i = books.length - 1; i >= 0; i--) {
        let b = books[i];
        b.y += b.speed;
        b.el.style.top = b.y + 'px';

        if (b.y >= 410 && b.y <= 480 && b.x + 30 >= playerX && b.x <= playerX + 50) {
            score += 10;
            scoreVal.textContent = score;
            b.el.remove();
            books.splice(i, 1);
            continue;
        }

        if (b.y >= 460) {
            increaseChaos(15);
            b.el.remove();
            books.splice(i, 1);
        }
    }

    for (let i = kids.length - 1; i >= 0; i--) {
        let k = kids[i];
        k.x += k.speed * k.direction;
        k.el.style.left = k.x + 'px';

        if (k.x + 40 >= playerX && k.x <= playerX + 50) {
            score += 20;
            scoreVal.textContent = score;
            k.el.remove();
            kids.splice(i, 1);
            continue;
        }

        if ((k.direction === 1 && k.x > containerWidth) || (k.direction === -1 && k.x < -40)) {
            increaseChaos(10);
            k.el.remove();
            kids.splice(i, 1);
        }
    }
}

function increaseChaos(amount) {
    chaos += amount;
    if (chaos > 100) chaos = 100;
    noiseFill.style.width = chaos + '%';

    if (chaos >= 100) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
    
    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

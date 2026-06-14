const playerDisplay = document.getElementById('player-cards');
const computerDisplay = document.getElementById('computer-cards');
const discardDisplay = document.getElementById('discard');
const deckElement = document.getElementById('deck');
const statusText = document.getElementById('status');
const compCountText = document.getElementById('comp-count');
const colorPicker = document.getElementById('color-picker');
const gameContainer = document.getElementById('game-container');
const cardCountInput = document.getElementById('card-count-input');
const drawPreviewContainer = document.getElementById('draw-preview-container');
const drawnCardPreview = document.getElementById('drawn-card-preview');
const playBtn = document.getElementById('play-btn');

const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', '+2'];

let deck = [];
let discardPile = [];
let playerHand = [];
let computerHand = [];
let currentTurn = 'player';
let activeColor = '';
let activeValue = '';
let pendingWildCard = null;
let currentDrawnCard = null;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const soundEffects = {
    play: () => {
        playTone(300, 'triangle', 0.05);
        setTimeout(() => playTone(450, 'triangle', 0.08), 50);
    },
    draw: () => {
        playTone(200, 'sine', 0.1);
        setTimeout(() => playTone(250, 'sine', 0.1), 60);
    },
    action: () => {
        playTone(400, 'square', 0.08);
        setTimeout(() => playTone(600, 'square', 0.08), 80);
        setTimeout(() => playTone(800, 'square', 0.12), 160);
    },
    uno: () => {
        playTone(523.25, 'sine', 0.15);
        setTimeout(() => playTone(659.25, 'sine', 0.15), 100);
        setTimeout(() => playTone(783.99, 'sine', 0.3), 200);
    },
    win: () => {
        let notes = [523, 659, 783, 1046];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.2), i * 120);
        });
    },
    lose: () => {
        let notes = [400, 350, 300, 220];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sawtooth', 0.25), i * 150);
        });
    }
};

function playTone(frequency, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

deckElement.addEventListener('click', () => {
    if (currentTurn === 'player' && !pendingWildCard && !currentDrawnCard) {
        handlePlayerDrawIntent();
    }
});

function createDeck() {
    deck = [];
    for (let c = 0; c < colors.length; c++) {
        for (let v = 0; v < values.length; v++) {
            deck.push({ color: colors[c], value: values[v] });
            if (values[v] !== '0') {
                deck.push({ color: colors[c], value: values[v] });
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'Wild' });
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function drawCard() {
    if (deck.length === 0) {
        if (discardPile.length <= 1) {
            createDeck();
        } else {
            const topCard = discardPile.pop();
            deck = [...discardPile];
            shuffleDeck();
            discardPile = [topCard];
        }
    }
    return deck.pop();
}

function initGame() {
    let initialCount = parseInt(cardCountInput.value) || 7;
    if (initialCount < 1) initialCount = 1;
    if (initialCount > 15) initialCount = 15;

    createDeck();
    playerHand = [];
    computerHand = [];
    discardPile = [];
    pendingWildCard = null;
    currentDrawnCard = null;
    colorPicker.style.display = 'none';
    drawPreviewContainer.style.display = 'none';

    for (let i = 0; i < initialCount; i++) {
        playerHand.push(drawCard());
        computerHand.push(drawCard());
    }

    let starterCard = drawCard();
    while (starterCard.color === 'wild') {
        deck.unshift(starterCard);
        shuffleDeck();
        starterCard = drawCard();
    }
    discardPile.push(starterCard);
    activeColor = starterCard.color;
    activeValue = starterCard.value;

    currentTurn = 'player';
    statusText.style.display = 'block';
    statusText.textContent = "Your turn! Play a matching card or pick one.";
    gameContainer.style.display = 'flex';
    updateUI();
}

function updateUI() {
    playerDisplay.innerHTML = '';
    playerHand.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = `card ${card.color}`;
        el.textContent = card.value;
        if (currentTurn === 'player' && !pendingWildCard && !currentDrawnCard) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => handlePlayerPlay(index));
        } else {
            el.style.cursor = 'not-allowed';
        }
        playerDisplay.appendChild(el);
    });

    computerDisplay.innerHTML = '';
    for (let i = 0; i < computerHand.length; i++) {
        const el = document.createElement('div');
        el.className = 'card back';
        computerDisplay.appendChild(el);
    }
    compCountText.textContent = computerHand.length;

    discardDisplay.innerHTML = '';
    if (discardPile.length > 0) {
        const topCard = discardPile[discardPile.length - 1];
        const topEl = document.createElement('div');
        topEl.className = `card ${activeColor}`;
        topEl.textContent = topCard.value === 'Wild' ? `Wild` : topCard.value;
        discardDisplay.appendChild(topEl);
    }
}

function isValidMove(card) {
    return card.color === 'wild' || card.color === activeColor || card.value === activeValue;
}

function handlePlayerDrawIntent() {
    soundEffects.draw();
    currentDrawnCard = drawCard();
    drawnCardPreview.innerHTML = '';
    
    const el = document.createElement('div');
    el.className = `card ${currentDrawnCard.color}`;
    el.textContent = currentDrawnCard.value;
    drawnCardPreview.appendChild(el);

    if (isValidMove(currentDrawnCard)) {
        playBtn.style.display = 'block';
        statusText.textContent = "Decide: Keep it or Play it immediately!";
    } else {
        playBtn.style.display = 'none';
        statusText.textContent = "No match. You must keep it.";
    }

    drawPreviewContainer.style.display = 'flex';
}

function resolveDrawDecision(decision) {
    drawPreviewContainer.style.display = 'none';
    const card = currentDrawnCard;
    currentDrawnCard = null;

    if (decision === 'play' && isValidMove(card)) {
        discardPile.push(card);
        activeValue = card.value;

        if (card.color === 'wild') {
            pendingWildCard = card;
            colorPicker.style.display = 'flex';
            statusText.textContent = "Choose a color for your Wild card!";
            updateUI();
            return;
        }

        activeColor = card.color;
        processActionCard(card.value, 'computer');
    } else {
        playerHand.push(card);
        statusText.textContent = "You kept the card. Changing turns...";
        updateUI();
        checkUnoDeclarations();
        currentTurn = 'computer';
        setTimeout(computerTurn, 1200);
    }
}

function handlePlayerPlay(index) {
    if (currentTurn !== 'player' || pendingWildCard || currentDrawnCard) return;

    const card = playerHand[index];
    if (!isValidMove(card)) {
        statusText.textContent = "Invalid move! Match color, number, or play a Wild card.";
        return;
    }

    playerHand.splice(index, 1);
    discardPile.push(card);
    activeValue = card.value;

    if (card.color === 'wild') {
        pendingWildCard = card;
        colorPicker.style.display = 'flex';
        statusText.textContent = "Choose a color!";
        updateUI();
        return;
    }

    activeColor = card.color;
    processActionCard(card.value, 'computer');
}

function selectWildColor(color) {
    activeColor = color;
    pendingWildCard = null;
    colorPicker.style.display = 'none';
    processActionCard('Wild', 'computer');
}

function processActionCard(value, nextPlayer) {
    updateUI();
    if (checkGameOver()) return;
    checkUnoDeclarations();

    if (value === 'Skip' || value === 'Reverse' || value === '+2' || value === 'Wild') {
        soundEffects.action();
    } else {
        soundEffects.play();
    }

    if (value === 'Skip' || value === 'Reverse') {
        statusText.textContent = `${nextPlayer === 'computer' ? 'Player' : 'Computer'} turn skipped!`;
        setTimeout(() => {
            if (nextPlayer === 'computer') {
                currentTurn = 'player';
                statusText.textContent = "Your turn again!";
                updateUI();
            } else {
                currentTurn = 'computer';
                computerTurn();
            }
        }, 1200);
        return;
    }

    if (value === '+2') {
        statusText.textContent = `${nextPlayer === 'computer' ? 'Player' : 'Computer'} played +2!`;
        if (nextPlayer === 'computer') {
            computerHand.push(drawCard(), drawCard());
        } else {
            playerHand.push(drawCard(), drawCard());
        }
        setTimeout(() => {
            updateUI();
            if (nextPlayer === 'computer') {
                currentTurn = 'player';
                statusText.textContent = "Your turn again!";
            } else {
                currentTurn = 'computer';
                computerTurn();
            }
        }, 1200);
        return;
    }

    currentTurn = nextPlayer;
    if (currentTurn === 'computer') {
        statusText.textContent = "Computer is thinking...";
        setTimeout(computerTurn, 1200);
    } else {
        statusText.textContent = "Your turn!";
        updateUI();
    }
}

function computerTurn() {
    if (currentTurn !== 'computer' || pendingWildCard) return;

    let playableIndex = -1;
    for (let i = 0; i < computerHand.length; i++) {
        if (isValidMove(computerHand[i])) {
            playableIndex = i;
            break;
        }
    }

    if (playableIndex !== -1) {
        const card = computerHand[playableIndex];
        computerHand.splice(playableIndex, 1);
        discardPile.push(card);
        activeValue = card.value;

        if (card.color === 'wild') {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            activeColor = randomColor;
            statusText.textContent = `Computer played a Wild Card and chose ${randomColor}!`;
            processActionCard('Wild', 'player');
            return;
        }

        activeColor = card.color;
        statusText.textContent = `Computer played ${activeColor} ${activeValue}.`;
        processActionCard(card.value, 'player');
    } else {
        soundEffects.draw();
        statusText.textContent = "Computer draws a card.";
        computerHand.push(drawCard());
        updateUI();
        checkUnoDeclarations();
        currentTurn = 'player';
        setTimeout(() => {
            statusText.textContent = "Your turn!";
            updateUI();
        }, 1000);
    }
}

function checkUnoDeclarations() {
    if (playerHand.length === 1 || computerHand.length === 1) {
        soundEffects.uno();
        if (playerHand.length === 1) {
            statusText.textContent = "📢 You shouted UNO!";
        } else {
            statusText.textContent = "📢 Computer shouted UNO!";
        }
    }
}

function checkGameOver() {
    if (playerHand.length === 0) {
        soundEffects.win();
        statusText.textContent = "🎉 You win! Game over.";
        return true;
    } else if (computerHand.length === 0) {
        soundEffects.lose();
        statusText.textContent = "💻 Computer wins! Game over.";
        return true;
    }
    return false;
}
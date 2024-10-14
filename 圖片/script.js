const cardGrid = document.getElementById('card-grid');
let firstCard = null;
let secondCard = null;
let lockBoard = false;  // Prevent flipping another card while waiting
let matchedCards = [];  // Store successfully matched cards

// Appliance and sushi theme image paths
const themes = [
    [
        { back: '圖片2/household appliance1.png', front: '圖片2/household appliance1.png' },
        { back: '圖片2/household appliance2.png', front: '圖片2/household appliance2.png' },
        { back: '圖片2/household appliance3.png', front: '圖片2/household appliance3.png' },
        { back: '圖片2/household appliance4.png', front: '圖片2/household appliance4.png' },
        { back: '圖片2/household appliance5.png', front: '圖片2/household appliance5.png' },
        { back: '圖片2/household appliance6.png', front: '圖片2/household appliance6.png' },
        { back: '圖片2/household appliance7.png', front: '圖片2/household appliance7.png' },
        { back: '圖片2/household appliance8.png', front: '圖片2/household appliance8.png' },
        { back: '圖片2/household appliance9.png', front: '圖片2/household appliance9.png' }
    ],
    [
        { back: '圖片/sushi1.png', front: '圖片/sushi1.png' },
        { back: '圖片/sushi2.png', front: '圖片/sushi2.png' },
        { back: '圖片/sushi3.png', front: '圖片/sushi3.png' },
        { back: '圖片/sushi4.png', front: '圖片/sushi4.png' },
        { back: '圖片/sushi5.png', front: '圖片/sushi5.png' },
        { back: '圖片/sushi6.png', front: '圖片/sushi6.png' },
        { back: '圖片/sushi7.png', front: '圖片/sushi7.png' },
        { back: '圖片/sushi8.png', front: '圖片/sushi8.png' },
        { back: '圖片/sushi9.png', front: '圖片/sushi9.png' }
    ]
];

// 添加音效
const matchSound = new Audio('1.mp3');  // 配對成功音效
const noMatchSound = new Audio('2.mp3');  // 配對失敗音效

// Initialize game with selected grid size
function initGame(themeIndex) {
    const gridSize = parseInt(document.getElementById('grid-size-select').value); // Get grid size
    const totalCards = gridSize * gridSize; // Calculate total cards based on selected size
    const selectedImages = [...themes[themeIndex]]; // Select one theme's images
    // Duplicate images to fill the grid, if not enough images available
    let imagesToUse = selectedImages.slice(0, totalCards / 2);
    const cardPairs = [...imagesToUse, ...imagesToUse]; // Create pairs
    cardPairs.sort(() => Math.random() - 0.5); // Shuffle the card pairs
    cardGrid.innerHTML = ''; // Clear card area
    matchedCards = []; // Reset matched cards list
    // Create grid style
    cardGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // Set grid columns
    // Create card elements
    cardPairs.forEach(imageObj => {
        const card = createCard(imageObj);
        cardGrid.appendChild(card);
    });
    cardGrid.style.display = 'grid'; // Show card grid
}

// Create card element
function createCard(imageObj) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.addEventListener('click', () => flipCard(cardElement));
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const frontImg = document.createElement('img');
    frontImg.src = imageObj.front; // Front image
    cardFront.appendChild(frontImg);
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const backImg = document.createElement('img');
    backImg.src = imageObj.back; // Back image
    cardBack.appendChild(backImg);
    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    return cardElement;
}

// Card flipping logic
function flipCard(card) {
    if (lockBoard || card === firstCard || matchedCards.includes(card)) return;
    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    lockBoard = true;
    checkForMatch();
}

// Check for card match
function checkForMatch() {
    const firstImage = firstCard.querySelector('.card-front img').src.split('/').pop(); // 只取文件名
    const secondImage = secondCard.querySelector('.card-front img').src.split('/').pop(); // 只取文件名
    
    // Debugging log to check the image filenames
    console.log('First Image:', firstImage);
    console.log('Second Image:', secondImage);
    
    if (firstImage === secondImage) {
        console.log('Match!');
        matchSound.play();  // 播放配對成功音效
        setTimeout(() => {
            hideMatchedCards();  // 隱藏配對成功的卡片
            resetBoard();
        }, 500);
    } else {
        console.log('No Match!');
        noMatchSound.play();  // 播放配對失敗音效
        setTimeout(() => {
            unflipCards();  // 翻回失敗的卡片
            resetBoard();
        }, 1000);
    }
}

// Hide matched cards
function hideMatchedCards() {
    firstCard.style.visibility = 'hidden';
    secondCard.style.visibility = 'hidden';
}

// Unflip unmatched cards
function unflipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
}

// Reset board for next turn
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Event listener for starting the game
document.getElementById('start-game-btn').addEventListener('click', () => {
    const themeIndex = document.getElementById('theme-select').value;
    initGame(themeIndex);
});

// Add functionality to flip all front/back buttons
document.getElementById('flip-all-front-btn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('flipped'));
});

document.getElementById('flip-all-back-btn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('flipped'));
});

// Reload button to reset the game
document.getElementById('reload-btn').addEventListener('click', () => {
    cardGrid.innerHTML = '';
    firstCard = null;
    secondCard = null;
    matchedCards = [];
    cardGrid.style.display = 'none';
});

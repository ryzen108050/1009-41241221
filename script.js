const cardGrid = document.getElementById('card-grid');
let firstCard = null;
let secondCard = null;
let lockBoard = false;  // Prevent flipping another card while waiting
let matchedCards = [];  // Store successfully matched cards

// Appliance and sushi theme image paths
const themes = [
    [
        { back: '圖片2/household appliance1.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance2.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance3.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance4.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance5.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance6.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance7.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance8.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance11.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance12.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance13.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance14.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance15.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance16.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance17.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance18.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance19.png', front: '圖片2/household appliance9.png' },
        { back: '圖片2/household appliance20.png', front: '圖片2/household appliance9.png' }
    ],
    [
        { back: '圖片/sushi1.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi2.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi3.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi4.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi5.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi6.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi7.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi8.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi11.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi12.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi13.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi14.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi15.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi16.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi17.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi18.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi19.png', front: '圖片/sushi9.png' },
        { back: '圖片/sushi20.png', front: '圖片/sushi9.png' }
    ]
];

// Sound effects
const matchSound = new Audio('1.mp3');  // Match success sound
const noMatchSound = new Audio('2.mp3');  // Match failure sound

// Initialize game with selected grid size
function initGame(themeIndex) {
    const gridSize = parseInt(document.getElementById('grid-size-select').value); // Get grid size
    const totalCards = gridSize * gridSize; // Calculate total cards based on selected size
    const selectedImages = [...themes[themeIndex]]; // Select one theme's images
    let imagesToUse = selectedImages.slice(0, totalCards / 2); // Get enough images
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

    // Show all cards for the selected duration
    const duration = parseInt(document.getElementById('duration-select').value); // Get selected duration
    flipAllCardsFront(duration);
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

// Flip all cards to front for a duration
function flipAllCardsFront(duration) {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped')); // Flip all cards to front
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('flipped')); // Flip back after duration
    }, duration);
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
    const firstImage = firstCard.querySelector('.card-back img').src; // Get full URL of the first image (back)
    const secondImage = secondCard.querySelector('.card-back img').src; // Get full URL of the second image (back)
    
    // Debugging log to check the image filenames
    console.log('First Image:', firstImage);
    console.log('Second Image:', secondImage);
    
    if (firstImage === secondImage) {
        console.log('Match!');
        matchSound.play();  // Play match success sound
        matchedCards.push(firstCard, secondCard); // Store matched cards
        setTimeout(() => {
            hideMatchedCards();  // Hide matched cards
            resetBoard();
        }, 500);
    } else {
        console.log('No Match!');
        noMatchSound.play();  // Play match failure sound
        setTimeout(() => {
            unflipCards();  // Unflip unmatched cards
            resetBoard();
        }, 1000);
    }
}

// Hide matched cards
function hideMatchedCards() {
    matchedCards.forEach(card => {
        card.style.opacity = 0; // Hide matched cards
    });
}

// Unflip unmatched cards
function unflipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
}

// Reset the board
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false]; // Reset variables
}

// Start game button click event
document.getElementById('start-game-btn').addEventListener('click', () => {
    const themeIndex = document.getElementById('theme-select').value; // Get selected theme
    initGame(themeIndex); // Initialize game
});

// Reload button click event
document.getElementById('reload-btn').addEventListener('click', () => {
    window.location.reload(); // Reload the page
});

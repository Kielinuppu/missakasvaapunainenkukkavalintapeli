const gameData = {
    images: [
        'kuva1.png', 'kuva2.png', 'kuva3.png', 'kuva4.png', 'kuva5.png', 
        'kuva6.png', 'kuva7.png', 'kuva8.png', 'kuva9.png', 'kuva10.png', 'kuva11.png'
    ],
    mainImages: [
        'pk1.png', 'pk2.png', 'pk3.png', 'pk4.png', 'pk5.png', 
        'pk6.png', 'pk7.png', 'pk8.png', 'pk9.png', 'pk10.png', 'pk11.png', 'pk12.png'
    ],
    audios: [
        'aani1.mp3', 'aani2.mp3', 'aani3.mp3', 'aani4.mp3', 'aani5.mp3',
        'aani6.mp3', 'aani7.mp3', 'aani8.mp3', 'aani9.mp3', 'aani10.mp3', 'aani11.mp3'
    ],
    finalImage: 'pk12.png'
};

let currentLevel = 0;
let currentAudio;
let selectedImages = new Set();
let shuffledIndices;

// Lisätään puuttuva shuffleArray-funktio
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    shuffledIndices = shuffleArray([...Array(11).keys()]);
    loadLevel();
}

function loadLevel() {
    const mainImage = document.getElementById('main-image');
    mainImage.src = gameData.mainImages[currentLevel];

    document.querySelector('#game-screen h2').style.display = 'block';

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    if (currentLevel < gameData.images.length) {
        for (let i = 0; i < 11; i++) {
            if (!selectedImages.has(shuffledIndices[i])) {
                const img = document.createElement('img');
                img.src = gameData.images[shuffledIndices[i]];
                img.className = 'option-image';
                img.dataset.index = shuffledIndices[i];
                img.onclick = () => selectOption(shuffledIndices[i]);
                optionsContainer.appendChild(img);
            }
        }
    }

    if (currentLevel === 0) {
        playAudio('valitse.mp3', () => {
            playAudio(gameData.audios[currentLevel]);
        });
    } else if (currentLevel < gameData.audios.length) {
        playAudio(gameData.audios[currentLevel]);
    }
}

function selectOption(index) {
    if (index === currentLevel) {
        playAudio('oikein.mp3', () => {
            selectedImages.add(index);
            currentLevel++;
            
            if (currentLevel >= gameData.images.length) {
                showFeedback();
            } else {
                loadLevel();
            }
        });
    } else {
        playAudio('vaarin.mp3');
        const wrongImage = document.querySelector(`.option-image[data-index="${index}"]`);
        if (wrongImage) {
            wrongImage.style.border = '2px solid red';
            setTimeout(() => {
                wrongImage.style.border = 'none';
            }, 1000);
        }
    }
}

function showFeedback() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('feedback-screen').style.display = 'block';
    document.getElementById('final-image').src = gameData.finalImage;
}

function playAgain() {
    currentLevel = 0;
    selectedImages.clear();
    shuffledIndices = shuffleArray([...Array(11).keys()]);
    
    document.getElementById('feedback-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.querySelector('#game-screen h2').style.display = 'block';
    
    document.getElementById('main-image').src = gameData.mainImages[0];
    
    loadLevel();
}

function playAudio(src, callback) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(src);
    currentAudio.play().then(() => {
        if (callback) {
            currentAudio.onended = callback;
        }
    }).catch(error => console.error('Error playing audio:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('play-again-button').addEventListener('click', playAgain);
});
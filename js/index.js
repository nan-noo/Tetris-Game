'use-strict';

import BLOCKS from './blocks.js';
import TetrisGame from './tetris-game.js';

// settings
const ROWS = 20;
const COLS = 10;
const endingScore = 1000;
const duration = 500;
const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
};

// block control functions
function moveBlock(moveType, amount) {
    if(newGame.isPause) return;
    newGame.movingItemNext[moveType] += amount;
    newGame.renderBlock(moveType);
}

function dropBlock() {
    if(newGame.isPause) return;
    newGame.changeInterval(10);
}

function pauseBlock() {
    if(!newGame.isStart) return;
    newGame.isPause = !newGame.isPause;
    if(newGame.isPause){
        clearInterval(newGame.downInterval);
        newGame.showModal("Pause", "CONTINUE");
        newGame.modalBtn.onclick = () => pauseBlock();
    }
    else{
        newGame.modal.style.display = "none";
        newGame.changeInterval();
    } 
}

function rotateBlock() {
    if(newGame.isPause) return;
    newGame.movingItemNext.direction = (newGame.movingItemNext.direction + 1) % 4;
    newGame.renderBlock('rotate');
}

function resetGame() {
    if(!newGame.isStart || newGame.isPause) return;
    newGame.init();
}

// main
const newGame = new TetrisGame(BLOCKS, ROWS, COLS, endingScore, duration, movingItem);
newGame.init();
newGame.modalBtn.onclick = () => {
    newGame.isStart = true;
    newGame.modal.style.display = "none";
    newGame.init();
};

// event handler
document.addEventListener("keydown", e => {
    const codes = {
        "ArrowUp"(){ rotateBlock(); },
        "ArrowDown"(){ moveBlock('top', 1); },
        "ArrowRight"(){ moveBlock('left', 1); },
        "ArrowLeft"(){ moveBlock('left', -1); },
        "Space"(){ dropBlock(); },
        "KeyP"(){ pauseBlock(); },
        "KeyR"(){ resetGame(); },
    }
    if(Object.keys(codes).includes(e.code)) codes[e.code]();
});
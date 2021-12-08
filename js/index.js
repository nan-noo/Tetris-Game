'use-strict';

import BLOCKS from './tetris/blocks.js';
import { ROWS, COLS, endingScore, duration } from './tetris/settings.js';
import TetrisGame from './tetris/tetris-game.js';
import TetrisGameController from './tetris/game-controller.js';

const newGame = new TetrisGame(BLOCKS, ROWS, COLS, endingScore, duration);
const gameCtrl = new TetrisGameController(newGame);
newGame.init();
newGame.modalBtn.onclick = () => {
    newGame.isStart = true;
    newGame.modal.style.display = "none";
    newGame.init();
};

document.addEventListener("keydown", e => {
    const codes = {
        "ArrowUp"(){ gameCtrl.rotateBlock(); },
        "ArrowDown"(){ gameCtrl.moveBlock('top', 1); },
        "ArrowRight"(){ gameCtrl.moveBlock('left', 1); },
        "ArrowLeft"(){ gameCtrl.moveBlock('left', -1); },
        "Space"(){ gameCtrl.dropBlock(); },
        "KeyP"(){ gameCtrl.pauseBlock(); },
        "KeyR"(){ gameCtrl.resetGame(); },
    }
    if(Object.keys(codes).includes(e.code)) codes[e.code]();
});
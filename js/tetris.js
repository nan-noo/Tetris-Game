import BLOCKS from './blocks.js';

// DOM
const container = document.querySelector(".container > ul");
const gameScore = document.querySelector(".score > h3");
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text");
const modalBtn = document.querySelector(".modal-button");

// settings
const ROWS = 20;
const COLS = 10;

let score;
let duration = 500;
let downInterval;
let movingItemNext;
let isPause;

const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
};

// initialize functions
function initializeBlockContainer(numOfRows, numOfColumns) {
    for(let i = 0; i < numOfRows; i++){
        prependRow(numOfColumns);
    }
}

function init() {
    container.innerHTML = '';
    isPause = false;
    score = 0;
    gameScore.innerHTML = score;

    initializeBlockContainer(ROWS, COLS);
    generateNewBlock();
}

function createElement(element) {
    return document.createElement(element);
}

function prependRow (numOfColumns) {
    const row = createElement("li");
    const rowContent = createElement("ul");

    for(let j = 0; j < numOfColumns; j++){
        const cell = createElement("li");
        rowContent.append(cell);
    }
    row.append(rowContent);
    container.prepend(row);
}

// block rendering functions
function changeInterval(interval, duration) {
    clearInterval(interval);
    interval = setInterval(() => {
        moveBlocks('top', 1);
    }, duration);
    return interval;
}

function generateNewBlock() {
    // basic block down
    downInterval = changeInterval(downInterval, duration);

    // new block
    const blockTypes = Object.keys(BLOCKS);
    const type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    movingItem.type = type;
    movingItem.direction = 0;
    movingItem.top = 0;
    movingItem.left = 3;

    movingItemNext = { ...movingItem };
    renderBlock();
}

function stopBlock() {
    // make moving blocks to stop
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove("moving");
        block.classList.add("stop");
    });
    checkLines();
}

function isLineCompleted(row) {
    const cols = row.childNodes[0].childNodes; // cols(li)
    for(let cell of cols){
        if(!cell.classList.contains("stop")) return false;
    }
    return true;
}

function updateScore(score) {
    gameScore.innerHTML = score;
    if(!isEndingScore(score, isStart)) generateNewBlock();
}

function isEndingScore(score, isStart) {
    if(score > 1000 && isStart){
        clearInterval(downInterval);

        showModal("Congratulations!!", "RESTART");
        modalBtn.onclick = () => {
            modal.style.display = "none";
            init();
        };
        return true;
    }
    return false;
}

function checkLines() {
    const rows = container.childNodes;
    rows.forEach(row => {
        if(isLineCompleted(row)) {
            row.remove();
            prependRow(COLS);
            score += 10;
        }
    });
    updateScore(score);
}

function removePreviousMovingBlock(type) {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove(type, "moving");
    });
}

function updateBlockPosition(moveType) {
    const {type, direction, top, left} = movingItemNext;

    BLOCKS[type][direction].some(pos => {
        const nextRow = pos[0] + top;
        const nextCol = pos[1] + left;
        const nextPos = container.childNodes[nextRow]?.childNodes[0].childNodes[nextCol];
            
        if(!!nextPos && !nextPos.classList.contains("stop")) {
            nextPos.classList.add(type, "moving");
        }
        else{
            if(moveType === 're-rendering'){
                gameOver();
                return true;
            }
            // back to previous state
            movingItemNext = { ...movingItem };
            setTimeout(() => { // to avoid 'exceeded maximum stack error'
                renderBlock('re-rendering');
                if(moveType === 'top') stopBlock();
            }, 0);
            return true;
        }
    });

    return [direction, top, left];
}

function renderBlock(moveType = '') {
    removePreviousMovingBlock(movingItemNext.type);

    const [direction, top, left] = updateBlockPosition(moveType);
    movingItem.direction = direction;
    movingItem.left = left;
    movingItem.top = top;
};

// block control functions
const moveBlocks = (moveType, amount) => {
    movingItemNext[moveType] += amount;
    renderBlock(moveType);
};

const dropBlocks = () => {
    if(isPause) return;
    downInterval = changeInterval(downInterval, 10);
};

const pauseBlocks = () => {
    if(!isStart) return;
    isPause = !isPause;
    if(isPause){
        clearInterval(downInterval);
        showModal("Pause", "CONTINUE");
        modalBtn.onclick = () => {
            pauseBlocks();     
        };
    }
    else{
        modal.style.display = "none";
        downInterval = changeInterval(downInterval, duration);
    } 
};

const rotateBlocks = () => {
    if(isPause) return;
    movingItemNext.direction = (movingItemNext.direction + 1) % 4;
    renderBlock();
};

// game view control functions
const gameOver = () => {
    if(!isStart) return;

    clearInterval(downInterval);

    showModal("Game Over", "RESTART");
    modalBtn.onclick = () => {
        modal.style.display = "none";
        init();
    }
};

const showModal = (title, btnTxt) => {
    modalText.innerHTML = title;
    modalBtn.innerHTML = btnTxt;
    modal.style.display = "flex";
};

// start
let isStart = false;
init();
modalBtn.onclick = () => {
    isStart = true;
    modal.style.display = "none";
    init();
};

// event handling
document.addEventListener("keydown", e => {
    const codes = {
        "ArrowUp"(){ rotateBlocks(); },
        "ArrowDown"(){ moveBlocks('top', 1); },
        "ArrowRight"(){ moveBlocks('left', 1); },
        "ArrowLeft"(){ moveBlocks('left', -1); },
        "Space"(){ dropBlocks(); },
        "KeyP"(){ pauseBlocks(); },
        "KeyR"(){ init(); },
    }
    if(Object.keys(codes).includes(e.code)) codes[e.code]();
});
    


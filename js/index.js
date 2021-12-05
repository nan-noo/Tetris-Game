'use-strict';

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

let score = 0;
let duration = 500;
let downInterval;
let movingItemNext;
let isPause = false;
let isStart = false;

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

function initHtml() {
    container.innerHTML = '';
    gameScore.innerHTML = 0;
}

function init() {
    isPause = false;
    score = 0;
    initializeBlockContainer(ROWS, COLS);
    generateNewBlock();
}

function createElement(element) {
    return document.createElement(element);
}

function prependRow(numOfColumns) {
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
        moveBlock('top', 1);
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
    renderBlock('');
}

function isLineCompleted(row) {
    const cols = row.childNodes[0].childNodes; // cols(li)
    for(let cell of cols){
        if(!cell.classList.contains("stop")) return false;
    }
    return true;
}

function updateScore() {
    gameScore.innerHTML = score;
    if(isEndingScore(score, isStart)) gameEnd();
    else generateNewBlock();
}

function isEndingScore(score, isStart) {
    if(score >= 1000 && isStart) return true;
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
    updateScore();
}

function stopBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove("moving");
        block.classList.add("stop");
    });
}

function removePreviousMovingBlock(type) {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove(type, "moving");
    });
}

function isAvailablePosition(pos) {
    if(!pos || pos.classList.contains("stop")) return false;
    else return true;
}

function updateBlockPosition(moveType, reRendering) {
    const {type, direction, top, left} = movingItemNext;

    BLOCKS[type][direction].some(pos => {
        const nextRow = pos[0] + top;
        const nextCol = pos[1] + left;
        const nextPos = container.childNodes[nextRow]?.childNodes[0].childNodes[nextCol];
            
        if(isAvailablePosition(nextPos)) nextPos.classList.add(type, "moving");
        else{
            if(reRendering){
                gameOver();
                return true;
            }
            movingItemNext = { ...movingItem };
            setTimeout(() => { // to avoid 'exceeded maximum stack error
                renderBlock(moveType, true);
                if(moveType === 'top') {
                    stopBlock();
                    checkLines();
                }
            }, 0);
            return true;
        }
    });
    return [direction, top, left];
}

function renderBlock(moveType, reRendering = false) {
    removePreviousMovingBlock(movingItemNext.type);

    const [direction, top, left] = updateBlockPosition(moveType, reRendering);
    movingItem.direction = direction;
    movingItem.left = left;
    movingItem.top = top;
};

// block control functions
function moveBlock(moveType, amount) {
    if(isPause) return;
    movingItemNext[moveType] += amount;
    renderBlock(moveType);
}

function dropBlock() {
    if(isPause) return;
    downInterval = changeInterval(downInterval, 10);
}

function pauseBlock() {
    if(!isStart) return;
    isPause = !isPause;
    if(isPause){
        clearInterval(downInterval);
        showModal("Pause", "CONTINUE");
        modalBtn.onclick = () => {
            pauseBlock();     
        };
    }
    else{
        modal.style.display = "none";
        downInterval = changeInterval(downInterval, duration);
    } 
}

function rotateBlock() {
    if(isPause) return;
    movingItemNext.direction = (movingItemNext.direction + 1) % 4;
    renderBlock('rotate');
}

// game view control functions
function gameOver() {
    clearInterval(downInterval);
    isStart = false;
    showModal("Game Over", "RESTART");
    modalBtn.onclick = () => {
        isStart = true;
        modal.style.display = "none";
        initHtml();
        init();
    }
};

function gameEnd() {
    clearInterval(downInterval);
    showModal("Congratulations!!", "RESTART");
    modalBtn.onclick = () => {
        modal.style.display = "none";
        initHtml();
        init();
    };
}

function showModal(title, btnTxt) {
    modalText.innerHTML = title;
    modalBtn.innerHTML = btnTxt;
    modal.style.display = "flex";
}

function resetGame() {
    if(!isStart || isPause) return;
    initHtml();
    init();
}

// start
initHtml();
init();
modalBtn.onclick = () => {
    isStart = true;
    modal.style.display = "none";
    initHtml();
    init();
};

// event handling
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
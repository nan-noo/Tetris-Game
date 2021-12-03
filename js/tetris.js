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
function initializeBlockContainer(numOfRows) {
    for(let i = 0; i < numOfRows; i++){
        prependRows();
    }
}

function init() {
    container.innerHTML = '';
    isPause = false;
    score = 0;
    gameScore.innerHTML = score;

    initializeBlockContainer(ROWS);
    generateNewBlocks();
}

// block rendering functions
function createElement(element) {
    return document.createElement(element);
}

function prependRows () {
    const row = createElement("li");
    const rowContent = createElement("ul");

    for(let j = 0; j < COLS; j++){
        const cell = createElement("li");
        rowContent.append(cell);
    }
    row.append(rowContent);
    container.prepend(row);
}

const generateNewBlocks = () => {
    // basic block down
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlocks('top', 1);
    }, duration);

    // new block
    const boxArray = Object.keys(BLOCKS);
    const type = boxArray[Math.floor(Math.random() * boxArray.length)];
    movingItem.type = type;
    movingItem.direction = 0;
    movingItem.top = 0;
    movingItem.left = 3;
    movingItemNext = { ...movingItem };
    renderBlocks();
};

const stopBlocks = () => {
    // make moving blocks to stop
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove("moving");
        block.classList.add("stop");
    })
    checkLine();
};

const checkLine = () => {
    // check if some lines are completed
    const childNodes = container.childNodes; // rows(li)
    childNodes.forEach(child => {
        let lineCompleted = true;
        for(let li of child.childNodes[0].childNodes){
            if(!li.classList.contains("stop")){
                lineCompleted = false;
                break;
            }
        }
        if(lineCompleted){
            child.remove();
            prependRows();
            score += 10;
        }
    });
    gameScore.innerHTML = score;
    if(score > 1000 && isStart){
        clearInterval(downInterval);
        showModal("Congratulations!!", "RESTART");
        modalBtn.onclick = () => {
            modal.style.display = "none";
            init();
        };
        return;
    }
    generateNewBlocks();
};

const renderBlocks = (moveType = '') => {
    const {type, direction, top, left} = movingItemNext;

    // remove current moving blocks before update
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove(type, "moving");
    })

    // update block position
    BLOCKS[type][direction].some(pos => {
        const x = pos[0] + top; // row
        const y = pos[1] + left; // col

        const target = container.childNodes[x] 
            && container.childNodes[x].childNodes[0].childNodes[y];
            
        if(!!target && !target.classList.contains("stop")) {
            target.classList.add(type, "moving");
        }
        else{
            if(moveType === 're-rendering'){
                gameOver();
                return true;
            }

            // back to previous state
            movingItemNext = { ...movingItem };
            setTimeout(() => { // to avoid 'exceeded maximum stack error'
                renderBlocks('re-rendering');
                if(moveType === 'top') stopBlocks();
            }, 0);
            return true;
        }
    });
    movingItem.direction = direction;
    movingItem.left = left;
    movingItem.top = top;
};

// block control functions
const moveBlocks = (moveType, amount) => {
    movingItemNext[moveType] += amount;
    renderBlocks(moveType);
};

const dropBlocks = () => {
    if(isPause) return;
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlocks('top', 1); 
    }, 10);
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

        clearInterval(downInterval);
        downInterval = setInterval(() => {
            moveBlocks('top', 1);
        }, duration);
    } 
};

const rotateBlocks = () => {
    if(isPause) return;
    movingItemNext.direction = (movingItemNext.direction + 1) % 4;
    renderBlocks();
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
    


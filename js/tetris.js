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
let isPause;

const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
};

// functions
const init = () => {
    container.innerHTML = '';
    for(let i = 0; i < ROWS; i++){
        prependRows();
    }
    isPause = false;
    generateNewBlocks();
};

const prependRows = () => {
    const row = document.createElement("li");
    const rowContent = document.createElement("ul");
    for(let j = 0; j < COLS; j++){
        const cell = document.createElement("li");
        rowContent.append(cell);
    }
    row.append(rowContent);
    container.prepend(row);
};

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
    if(score > 0){
        clearInterval(downInterval);
        modalText.innerHTML = "Congratulations!!"
        modalBtn.innerHTML = "RESTART"
        modal.style.display = "flex";
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

    // remove current blocks before update
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
        else{ // no target or stop block
            if(moveType === 're-rendering'){
                gameOver();
                return true;
            }

            // back to previous state
            movingItemNext = { ...movingItem };
            setTimeout(() => {
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
    isPause = !isPause;
    if(isPause){
        clearInterval(downInterval);
        modalText.innerHTML = "Pause"
        modalBtn.innerHTML = "CONTINUE"
        modal.style.display = "flex";
        modalBtn.onclick = () => {
            isPause = !isPause;
            modal.style.display = "none";

            clearInterval(downInterval);
            downInterval = setInterval(() => {
                moveBlocks('top', 1);
            }, duration);
        };
    } 
};

const changeDirection = () => {
    if(isPause) return;
    movingItemNext.direction = (movingItemNext.direction + 1) % 4;
    renderBlocks();
};

const gameOver = () => {
    clearInterval(downInterval);
    modalText.innerHTML = "Game Over"
    modalBtn.innerHTML = "RESTART"
    modal.style.display = "flex";
    modalBtn.onclick = () => {
        modal.style.display = "none";
        init();
    }
};

// start
init();
modalBtn.onclick = () => {
    modal.style.display = "none";
    init();
};

// event handling
document.addEventListener("keydown", e => {
    const codes = {
        "ArrowUp"(){ changeDirection(); },
        "ArrowDown"(){ moveBlocks('top', 1); },
        "ArrowRight"(){ moveBlocks('left', 1); },
        "ArrowLeft"(){ moveBlocks('left', -1); },
        "Space"(){ dropBlocks(); },
        "KeyP"(){ pauseBlocks(); },
        "KeyR"(){ init(); },
    }
    if(Object.keys(codes).includes(e.code)) codes[e.code]();
});
    


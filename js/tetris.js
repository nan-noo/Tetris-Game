// DOM
const container = document.querySelector(".container > ul");

// settings
const ROWS = 20;
const COLS = 10;

let score = 0;
let duration = 500;
let downInterval;
let movingItemNext;

// type -> direction -> position
const BLOCKS = {
    tree: [
        [[1,0], [0,1], [1,1], [1,2]],
        [],
        [],
        []
    ],
}

const movingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 3,
};

// functions
const init = () => {
    for(let i = 0; i < ROWS; i++){
        appendRows();
    }

    movingItemNext = { ...movingItem };
    renderBlocks();
}

const appendRows = () => {
    const row = document.createElement("li");
    const rowContent = document.createElement("ul");
    for(let j = 0; j < COLS; j++){
        const cell = document.createElement("li");
        rowContent.append(cell);
    }
    row.append(rowContent);
    container.appendChild(row);
}

const renderBlocks = () => {
    let {type, direction, top, left} = movingItemNext;

    // remove current blocks before update
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove(type, "moving");
    })

    // update next position
    for(let pos of BLOCKS[type][direction]){
        const x = pos[0] + top; // row
        const y = pos[1] + left; // col

        const target = container.childNodes[x] 
            && container.childNodes[x].childNodes[0].childNodes[y];
            
        if(!!target) target.classList.add(type, "moving");
        else{
            // back to last state
            movingItemNext = { ...movingItem };
            renderBlocks();
            break;
        }
    }
    movingItem.direction = movingItemNext.direction;
    movingItem.left = movingItemNext.left;
    movingItem.top = movingItemNext.top;
}

const moveBlocks = (moveType, amount) => {
    movingItemNext[moveType] += amount;
    renderBlocks();
}


//
init();

// event
document.addEventListener("keydown", e => {
    const keys = {
        "ArrowUp"(){ moveBlocks('top', -1); },
        "ArrowDown"(){ moveBlocks('top', 1); },
        "ArrowRight"(){ moveBlocks('left', 1); },
        "ArrowLeft"(){ moveBlocks('left', -1); },
    }

    if(Object.keys(keys).includes(e.key)) keys[e.key]();
})
    


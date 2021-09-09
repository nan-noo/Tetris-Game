// DOM
const container = document.querySelector(".container > ul");

// settings
const ROWS = 20;
const COLS = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

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
    tempMovingItem = { ...movingItem };
    for(let i = 0; i < ROWS; i++){
        appendRows();
    }
    renderBlock();
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

const renderBlock = () => {
    const {type, direction, top, left} = tempMovingItem;

    // remove current blocks before update
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(block => {
        block.classList.remove(type, "moving");
    })

    // update next position
    BLOCKS[type][direction].forEach(pos => {
        const x = pos[0] + top; // row
        const y = pos[1] + left; // col

        const target = container.childNodes[x] 
            && container.childNodes[x].childNodes[0].childNodes[y];
            
        if(!!target) target.classList.add(type, "moving");
        else{
            tempMovingItem = { ...movingItem };
            renderBlock();
        }
    });
    movingItem.direction = direction;
    movingItem.left = left;
    movingItem.top = top;
}

const moveBlock = (moveType, amount) => {
    tempMovingItem[moveType] += amount;
    renderBlock();
}


//
init();

// event
document.addEventListener("keydown", e => {
    const keys = {
        "ArrowUp"(){ moveBlock('top', -1); },
        "ArrowDown"(){ moveBlock('top', 1); },
        "ArrowRight"(){ moveBlock('left', 1); },
        "ArrowLeft"(){ moveBlock('left', -1); },
    }

    if(Object.keys(keys).includes(e.key)) keys[e.key]();
})
    


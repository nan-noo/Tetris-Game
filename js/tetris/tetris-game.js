import TetrisBlock from './tetris-block.js';

export default class TetrisGame {
    constructor(blocks, rows, columns, endingScore, duration) {
        this.blocks = blocks;
        this.rows = rows;
        this.cols = columns;
        this.endingScore = endingScore;
        this.duration = duration;
        this.isPause = false;
        this.isStart = false;
        this.score = 0;
        this.downInterval;
        this.movingItem;
        this.movingItemNext;

        this.container = document.querySelector(".container > ul");
        this.gameScore = document.querySelector(".score > h3");
        this.modal = document.querySelector(".modal");
        this.modalText = document.querySelector(".modal-text");
        this.modalBtn = document.querySelector(".modal-button");
    }

    init() {
        this.initHtml();
        this.initGameSetting();
    }

    initHtml() {
        this.container.innerHTML = '';
        this.gameScore.innerHTML = 0;
    }
    
    initGameSetting() {
        this.isPause = false;
        this.score = 0;
        this.initializeBlockContainer();
        this.generateNewBlock();
    }

    initializeBlockContainer() {
        for(let i = 0; i < this.rows; i++){
            this.prependRow();
        }
    }
    
    createElement(element) {
        return document.createElement(element);
    }
    
    prependRow() {
        const row = this.createElement("li");
        const rowContent = this.createElement("ul");
    
        for(let j = 0; j < this.cols; j++){
            const cell = this.createElement("li");
            rowContent.append(cell);
        }
        row.append(rowContent);
        this.container.prepend(row);
    }

    downBlock() {
        if(this.isPause) return;
        this.movingItemNext.top += 1;
        this.renderBlock('top');
    }
    
    changeInterval(duration = this.duration) {
        clearInterval(this.downInterval);
        this.downInterval = setInterval(() => {
            this.downBlock();
        }, duration);
    }
    
    generateNewBlock() {
        this.changeInterval(this.duration -= 1);
    
        const blockTypes = Object.keys(this.blocks);
        const type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        this.movingItem = new TetrisBlock(type);
        this.movingItemNext = { ...this.movingItem };
        this.renderBlock('');
    }
    
    isLineCompleted(row) {
        const cols = row.childNodes[0].childNodes; // cols(li)
        for(let cell of cols){
            if(!cell.classList.contains("stop")) return false;
        }
        return true;
    }
    
    updateScore() {
        this.gameScore.innerHTML = this.score;
        if(this.isEndingScore()) this.gameEnd();
        else this.generateNewBlock();
    }

    gameEnd() {
        clearInterval(this.downInterval);
        this.showModal("Congratulations!!", "RESTART");
        this.modalBtn.onclick = () => {
            this.modal.style.display = "none";
            this.init();
        };
    }
    
    isEndingScore() {
        if(this.score >= this.endingScore && this.isStart) return true;
        return false;
    }
    
    checkLines() {
        const rows = this.container.childNodes;
        rows.forEach(row => {
            if(this.isLineCompleted(row)) {
                row.remove();
                this.prependRow();
                this.score += 10;
            }
        });
        this.updateScore();
    }
    
    stopBlock() {
        const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach(block => {
            block.classList.remove("moving");
            block.classList.add("stop");
        });
    }
    
    removePreviousMovingBlock(type) {
        const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach(block => {
            block.classList.remove(type, "moving");
        });
    }
    
    isAvailablePosition(pos) {
        if(!pos || pos.classList.contains("stop")) return false;
        else return true;
    }
    
    updateBlockPosition(moveType, reRendering) {
        const {type, direction, top, left} = this.movingItemNext;
    
        this.blocks[type][direction].some(pos => {
            const nextRow = pos[0] + top;
            const nextCol = pos[1] + left;
            const nextPos = this.container.childNodes[nextRow]?.childNodes[0].childNodes[nextCol];
                
            if(this.isAvailablePosition(nextPos)) nextPos.classList.add(type, "moving");
            else{
                if(reRendering){
                    this.gameOver();
                    return true;
                }
                this.movingItemNext = { ...this.movingItem };
                setTimeout(() => { // to avoid 'exceeded maximum stack error
                    this.renderBlock(moveType, true);
                    if(moveType === 'top') {
                        this.stopBlock();
                        this.checkLines();
                    }
                }, 0);
                return true;
            }
        });
        return [direction, top, left];
    }

    gameOver() {
        clearInterval(this.downInterval);
        this.isStart = false;
        this.showModal("Game Over", "RESTART");
        this.modalBtn.onclick = () => {
            this.isStart = true;
            this.modal.style.display = "none";
            this.init();
        }
    }
    
    showModal(title, btnTxt) {
        this.modalText.innerHTML = title;
        this.modalBtn.innerHTML = btnTxt;
        this.modal.style.display = "flex";
    }
    
    renderBlock(moveType, reRendering = false) {
        this.removePreviousMovingBlock(this.movingItemNext.type);
    
        const [direction, top, left] = this.updateBlockPosition(moveType, reRendering);
        this.movingItem.direction = direction;
        this.movingItem.left = left;
        this.movingItem.top = top;
    };
};
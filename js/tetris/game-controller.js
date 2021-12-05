export default class TetrisGameController {
    constructor(game) {
        this.game = game;
    }

    moveBlock(moveType, amount) {
        if(this.game.isPause) return;
        this.game.movingItemNext[moveType] += amount;
        this.game.renderBlock(moveType);
    }
    
    dropBlock() {
        if(this.game.isPause) return;
        this.game.changeInterval(10);
    }
    
    pauseBlock() {
        if(!this.game.isStart) return;
        this.game.isPause = !this.game.isPause;
        if(this.game.isPause){
            clearInterval(this.game.downInterval);
            this.game.showModal("Pause", "CONTINUE");
            this.game.modalBtn.onclick = () => pauseBlock();
        }
        else{
            this.game.modal.style.display = "none";
            this.game.changeInterval();
        } 
    }
    
    rotateBlock() {
        if(this.game.isPause) return;
        this.game.movingItemNext.direction = (this.game.movingItemNext.direction + 1) % 4;
        this.game.renderBlock('rotate');
    }
    
    resetGame() {
        if(!this.game.isStart || this.game.isPause) return;
        else this.game.init();
    }
};
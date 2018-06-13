import * as BlockConsts from '../constants/BlockShapes';
import Block from "./Block";

export default class BlockFactory {
    constructor(cellSize, nextCellSize){
        this.cellSize = cellSize;
        this.nextCellSize = nextCellSize;
        this.currentBlockShape = null;
        this.nextBlockShape = null;
        this.onNextBlockCallBack = undefined;
    }

    setup () {
        this.nextBlockShape = this.createNewBlockShape();
    }

    next(){
        this.currentBlockShape = this.nextBlockShape;
        this.nextBlockShape = this.createNewBlockShape();

        if (this.onNextBlockCallBack)
            this.onNextBlockCallBack(new Block(this.nextBlockShape, this.nextCellSize));
        return new Block(this.currentBlockShape, this.cellSize);
    }

    createNewBlockShape(){
        const possibleBlocks = BlockConsts.BLOCKS;
        const max = possibleBlocks.length - 1;
        const selectedBlockShape = possibleBlocks[Math.floor(Math.random() * (max + 1))];
        return selectedBlockShape;
    }
}



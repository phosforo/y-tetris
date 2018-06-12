import * as BlockConsts from '../constants/BlockShapes';
import Block from "./Block";

export const createBlock = (cellSize) => {
    const possibleBlocks = BlockConsts.BLOCKS;
    const max = possibleBlocks.length - 1;
    const selectedBlockShape = possibleBlocks[Math.floor(Math.random() * (max + 1))];
    return new Block(selectedBlockShape, cellSize);
};

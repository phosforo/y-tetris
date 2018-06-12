import { Container, Graphics } from 'pixi.js';
import * as GameAreaConsts from '../constants/GameArea';
import * as BlockFactory from "./BlockFactory";
import * as BlockShapeConsts from "../constants/BlockShapes";
import * as BlockActionConsts from "../constants/BlockActions";
import * as CollisionResolver from "./ColisionResolver";
import * as CollisionConsts from "../constants/Collision";
import Cell from "./Cell";

export default class GameArea extends Container {

    constructor(width, height) {
        super();
        this.internalWidth = width;
        this.internalHeight = height;
        this.backgroundGrid = new Graphics();
        this.currentGameGrid = GameAreaConsts.INITIAL_GRID;
        this.currentBlock = null;
        this.cellSize = Math.floor(Math.min(this.internalWidth / GameAreaConsts.DEFAULT_COLUMNS, this.internalHeight / GameAreaConsts.DEFAULT_ROWS));
        this.onWallHitCallback = undefined;
        this.onDropCallback = undefined;
        this.onLineCompleteCallback = undefined;
        this.onRotateCallback = undefined;
        this.onMoveCallback = undefined;
        this.onEndCallback = undefined;
        this.invalidateGrid = true;
        this._showGrid = false;
        this.gameEnded = false;
        this.addChild(this.backgroundGrid);
    }

    showGrid() {
        this._showGrid = !this._showGrid;
        this.invalidateGrid = true;
    }

    dropBlock() {
        const position = CollisionResolver.resolveDropPosition(this.currentBlock, this.currentGameGrid);
        this.currentBlock.y = position;
    }

    rotateBlock() {
        const collision = CollisionResolver.resolve(this.currentBlock, this.currentGameGrid, BlockActionConsts.ROTATE);
        switch (collision) {
        case CollisionConsts.NO_COLLISION:
            this.currentBlock.rotate();
            if (this.onRotateCallback)
                this.onRotateCallback();
            break;
        default:
            break;
        }
    }

    moveBlock(direction) {
        const directionMultiplier = direction === BlockActionConsts.MOVE_LEFT ? -1 : 1;
        const currentBlock = this.currentBlock;
        const currentGameGrid = this.currentGameGrid;
        const collision = CollisionResolver.resolve(currentBlock, currentGameGrid, direction);
        switch (collision) {
        case CollisionConsts.NO_COLLISION:
            this.currentBlock.x += this.cellSize * directionMultiplier;
            if (this.onMoveCallback)
                this.onMoveCallback();
            break;
        case CollisionConsts.WALL_COLLISION:
            if (this.onWallHitCallback)
                this.onWallHitCallback();
            break;
        default:
            break;
        }
    }

    moveBlockDown() {
        const currentBlock = this.currentBlock;
        const currentGameGrid = this.currentGameGrid;
        const collision = CollisionResolver.resolve(currentBlock, currentGameGrid, BlockActionConsts.DROP_ONE_ROW);
        switch (collision) {
        case CollisionConsts.NO_COLLISION:
            this.currentBlock.y += this.cellSize;
            if (this.onMoveCallback)
                this.onMoveCallback();
            break;
        case CollisionConsts.BLOCKS_COLLISION:
        case CollisionConsts.BOTTOM_COLLISION:
            if (this.gameOver()) {
                if (this.onEndCallback)
                    this.onEndCallback();
            }
            else {
                if (this.onDropCallback)
                    this.onDropCallback();
                this.lockBlockToGrid();
                this.resolveCompleteLines();
                this.removeCurrentBlock();
                break;
            }
            break;
        default:
            break;
        }
    }

    update() {
        if (this.gameEnded) {
            if (this.onEndCallback)
                this.onEndCallback();
        }
        else if (!this.currentBlock)
            this.createNewBlock();
        else
            this.moveBlockDown();
    }

    clearLines() {
        if (this.onLineCompleteCallback)
            this.onLineCompleteCallback();
        this.invalidateGrid = true;
    }

    createNewBlock() {
        const newBlockToPlay = BlockFactory.createBlock(this.cellSize);
        const blockMatrixSize = this.cellSize * BlockShapeConsts.SHAPE_SIZE;
        const startCol = Math.floor((this.internalWidth - blockMatrixSize) * 0.5);
        const startRow = -newBlockToPlay.blockShape.startRow * this.cellSize;
        this.currentBlock = newBlockToPlay;
        this.currentBlock.x = startCol;
        this.currentBlock.y = startRow;
        this.addChild(this.currentBlock);
    }

    draw() {
        if (this.invalidateGrid) {
            this.drawGrid();
            this.invalidateGrid = false;
        }

        if (this.currentBlock)
            this.currentBlock.draw();

    }

    drawGrid() {
        this.backgroundGrid.clear();
        // start from the bottom
        for (let row = GameAreaConsts.DEFAULT_ROWS - 1; row >= 0; row--)
            for (let col = 0; col < GameAreaConsts.DEFAULT_COLUMNS; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                if (this._showGrid) {
                    this.backgroundGrid.lineStyle(0.5, 0x0000FF, 1);
                    this.backgroundGrid.drawRect(x, y, this.cellSize, this.cellSize);
                }
                const cell = this.currentGameGrid[row][col];
                if (cell !== null)
                    cell.draw();
            }

    }

    lockBlockToGrid() {
        //start from the end
        for (let row = BlockShapeConsts.SHAPE_SIZE - 1; row >= 0; row--)
            for (let col = 0; col < BlockShapeConsts.SHAPE_SIZE - 1; col++) {
                const shape = this.currentBlock.currentShapeState;
                const gridCol = Math.floor(this.currentBlock.x / this.cellSize) + col;
                const gridRow = Math.floor(this.currentBlock.y / this.cellSize) + row;
                if (shape[row][col]) {
                    const cell = new Cell(this.currentBlock.shape.color, this.cellSize);
                    cell.x = gridCol * this.cellSize;
                    cell.y = gridRow * this.cellSize;
                    this.currentGameGrid[gridRow][gridCol] = cell;
                    this.addChild(cell);
                    this.invalidateGrid = true;
                }
            }
    }

    resolveCompleteLines() {
        const rowsToDelete = [];
        let currentRowCompleteCount = 0;
        for (let row = 0; row < BlockShapeConsts.SHAPE_SIZE; row++) {
            for (let col = 0; col < BlockShapeConsts.SHAPE_SIZE; col++)
                if (this.currentGameGrid[col][row]) currentRowCompleteCount++;

            if (currentRowCompleteCount === GameAreaConsts.DEFAULT_COLUMNS) rowsToDelete.push(row);
        }

        const totalRowsToDelete = rowsToDelete.length;
        const currentGrid = this.currentGameGrid.slice();


        if (rowsToDelete > 0) {
            const startIdx = rowsToDelete[0];
            // delete completed rows
            currentGrid.splice(startIdx, totalRowsToDelete);

            const emptyLines = Array.from(Array(rowsToDelete), () => null);
            // add empty rows to top
            currentGrid.unshift(emptyLines);
            this.currentGameGrid = currentGrid;
        }
    }

    removeCurrentBlock() {
        this.removeChild(this.currentBlock);
        this.currentBlock = null;
    }

    gameOver() {
        return this.currentBlock.y <= 0;
    }
}
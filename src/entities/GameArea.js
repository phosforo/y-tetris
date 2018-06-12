import { Container, Graphics } from 'pixi.js';
import * as GameAreaConsts from '../constants/GameArea';
import * as BlockFactory from "./BlockFactory";
import * as BlockShapeConsts from "../constants/BlockShapes";
import * as BlockActionConsts from "../constants/BlockActions";
import * as CollisionResolver from "./ColisionResolver";
import * as CollisionConsts from "../constants/Collision";
import Cell from "./Cell";
import GameOverOverlay from "./GameOverOverlay";

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
        this.isGameOver = false;
        this.gameOverOverlay = new GameOverOverlay(width, height);
        this.addChild(this.backgroundGrid);
        this.addChild(this.gameOverOverlay);
    }

    setup() {
        this.gameOverOverlay.setup();
        this.gameOverOverlay.visible = false;
    }

    showGrid() {
        this._showGrid = !this._showGrid;
        this.invalidateGrid = true;
    }

    dropBlock() {
        if (!this.currentBlock) return;

        const position = CollisionResolver.resolveDropPosition(this.currentBlock, this.currentGameGrid);
        this.currentBlock.y = position;
    }

    rotateBlock() {
        if (!this.currentBlock) return;

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

    keyPressed() {
        if (this.isGameOver) {
            this.restartGameArea();
            this.isGameOver = false;
        }
    }

    moveBlock(direction) {
        if (!this.currentBlock) return;

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
            case CollisionConsts.COLLISION:
                if (this.onWallHitCallback)
                    this.onWallHitCallback();
                break;
            default:
                break;
        }
    }

    moveBlockDown() {
        if (!this.currentBlock) return;

        const currentBlock = this.currentBlock;
        const currentGameGrid = this.currentGameGrid;
        const collision = CollisionResolver.resolve(currentBlock, currentGameGrid, BlockActionConsts.DROP_ONE_ROW);
        switch (collision) {
            case CollisionConsts.NO_COLLISION:
                this.currentBlock.y += this.cellSize;
                if (this.onMoveCallback)
                    this.onMoveCallback();
                break;
            case CollisionConsts.COLLISION:
                if (this.onDropCallback)
                    this.onDropCallback();
                this.lockBlockToGrid();
                this.resolveCompleteLines();
                this.isGameOver = this.currentBlock.y <= 0;
                this.removeCurrentBlock();
                break;

            default:
                break;
        }
    }

    update() {
        if (this.isGameOver){
            if (this.onEndCallback)
                this.onEndCallback();
        }
        else if (!this.currentBlock)
            this.createNewBlock();
        else
            this.moveBlockDown();
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

        this.gameOverOverlay.visible = this.isGameOver;
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
                if (cell) {
                    cell.x = col * this.cellSize;
                    cell.y = row * this.cellSize;
                    cell.draw();
                }
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
        for (let row = GameAreaConsts.DEFAULT_ROWS - 1; row >= 0; row--) {

            for (let col = 0; col < GameAreaConsts.DEFAULT_COLUMNS; col++)
                if (this.currentGameGrid[row][col]) currentRowCompleteCount++;

            if (currentRowCompleteCount === GameAreaConsts.DEFAULT_COLUMNS)
                rowsToDelete.push(row);
            currentRowCompleteCount = 0;
        }

        const totalRowsToDelete = rowsToDelete.length;
        const currentGrid = this.currentGameGrid.slice();

        if (totalRowsToDelete) {
            const startIdx = rowsToDelete[totalRowsToDelete-1];
            // delete completed rows
            const deletedRows = currentGrid.splice(startIdx, totalRowsToDelete);
            // delete displayObjects
            this.clearCellMatrix(deletedRows, totalRowsToDelete, GameAreaConsts.DEFAULT_COLUMNS);
            const emptyLines = new Array(totalRowsToDelete).fill(null);
            // add empty rows to top
            currentGrid.unshift(emptyLines);

            this.currentGameGrid = currentGrid;

            if (this.onLineCompleteCallback)
                this.onLineCompleteCallback();
            this.invalidateGrid = true;
        }
    }

    removeCurrentBlock() {
        this.removeChild(this.currentBlock);
        this.currentBlock = null;
    }

    restartGameArea() {
        this.clearCellMatrix(this.currentGameGrid, GameAreaConsts.DEFAULT_ROWS, GameAreaConsts.DEFAULT_COLUMNS);
        this.currentGameGrid = GameAreaConsts.INITIAL_GRID;
    }

    clearCellMatrix(matrix, numRows, numCols) {
        for (let row = numRows - 1; row >= 0; row--)
            for (let col = 0; col < numCols; col++) {
                let cell = matrix[row][col];
                this.removeChild(cell);
                cell = null;
            }
    }
}
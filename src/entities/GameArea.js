import { Container, Graphics } from 'pixi.js';
import * as GameAreaConsts from '../constants/GameArea';
import * as BlockShapeConsts from "../constants/BlockShapes";
import * as BlockActionConsts from "../constants/BlockActions";
import * as CollisionResolver from "./ColisionResolver";
import * as CollisionConsts from "../constants/Collision";
import Cell from "./BoardBlock";
import GameOverOverlay from "./GameOverOverlay";
import PreviewBlocArea from "./PreviewBlockArea";
import BlockFactory from "./BlockFactory";

export default class GameArea extends Container {

    constructor(width, height, cellSize, previewCellSize) {
        super();
        this.blockFactory = new BlockFactory(cellSize,previewCellSize);
        this.internalWidth = width;
        this.internalHeight = height;
        this.backgroundGrid = new Graphics();
        this.currentGameGrid = null;
        this.currentBlockShape = null;
        this.cellSize = cellSize;
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
        this.boardBlocksContainer = new Container();
        this.previewBlockArea = new PreviewBlocArea(previewCellSize);
        this.previewBlockArea.y = height - BlockShapeConsts.SHAPE_SIZE * cellSize + 2;
        const backgroundBorder = new Graphics().lineStyle(1, 0xFFFFFF, 1).drawRect(1, 1, width-1, GameAreaConsts.DEFAULT_ROWS * cellSize + 1);
        this.addChild(backgroundBorder);
        this.addChild(this.backgroundGrid);
        this.addChild(this.boardBlocksContainer);
        this.addChild(this.previewBlockArea);
        this.addChild(this.gameOverOverlay);
    }

    setup() {
        this.blockFactory.onNextBlockCallBack = (block) => {
            this.previewBlockArea.nextPreviewBlock(block);
        };

        this.blockFactory.setup();
        this.previewBlockArea.setup();
        this.initializeBoardGame();
        this.gameOverOverlay.setup();
        this.gameOverOverlay.visible = false;
    }

    initializeBoardGame() {
        this.currentGameGrid = new Array(GameAreaConsts.DEFAULT_ROWS).fill(null).map(() => {
            return new Array(GameAreaConsts.DEFAULT_COLUMNS).fill(0);
        });

    }

    createNewBlockShape() {
        const newBlockToPlay = this.blockFactory.next();
        const blockMatrixSize = this.cellSize * BlockShapeConsts.SHAPE_SIZE;
        const startCol = Math.floor((this.internalWidth - blockMatrixSize) * 0.5);
        const startRow = -newBlockToPlay.blockShape.startRow * this.cellSize;
        this.currentBlockShape = newBlockToPlay;
        this.currentBlockShape.x = startCol;
        this.currentBlockShape.y = startRow;
        this.boardBlocksContainer.addChild(this.currentBlockShape);
    }

    showGrid() {
        this._showGrid = !this._showGrid;
        this.invalidateGrid = true;
    }

    dropBlock() {
        if (!this.currentBlockShape) return;
        // just get the position to go. lock block will be done on next tick through moveBlock
        const position = CollisionResolver.resolveDropPosition(this.currentBlockShape, this.currentGameGrid);
        this.currentBlockShape.y = position;
    }

    rotateBlock() {
        if (!this.currentBlockShape) return;

        const collision = CollisionResolver.resolve(this.currentBlockShape, this.currentGameGrid, BlockActionConsts.ROTATE);
        switch (collision) {
            case CollisionConsts.NO_COLLISION:
                this.currentBlockShape.rotate();
                if (this.onRotateCallback)
                    this.onRotateCallback();
                break;
            default:
                break;
        }
    }

    moveBlock(direction) {
        if (!this.currentBlockShape) return;

        const directionMultiplier = direction === BlockActionConsts.MOVE_LEFT ? -1 : 1;
        const currentBlock = this.currentBlockShape;
        const currentGameGrid = this.currentGameGrid;
        const collision = CollisionResolver.resolve(currentBlock, currentGameGrid, direction);
        switch (collision) {
            case CollisionConsts.NO_COLLISION:
                this.currentBlockShape.x += this.cellSize * directionMultiplier;
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
        if (!this.currentBlockShape) return;

        const currentBlock = this.currentBlockShape;
        const currentGameGrid = this.currentGameGrid;
        const collision = CollisionResolver.resolve(currentBlock, currentGameGrid, BlockActionConsts.DROP_ONE_ROW);
        switch (collision) {
            case CollisionConsts.NO_COLLISION:
                this.currentBlockShape.y += this.cellSize;
                if (this.onMoveCallback)
                    this.onMoveCallback();
                break;
            case CollisionConsts.COLLISION:
                if (this.onDropCallback)
                    this.onDropCallback();
                this.lockBlockToGrid();
                this.resolveCompleteLines();
                this.isGameOver = this.currentBlockShape.y <= 0;
                this.removeCurrentBlock();
                if (this.isGameOver && this.onEndCallback)
                    this.onEndCallback();
                break;

            default:
                break;
        }
    }

    onKeyPressed() {
        if (this.isGameOver) {
            this.restartGameArea();
            this.isGameOver = false;
            this.invalidateGrid = true;
        }
    }

    update() {
        if (this.isGameOver)
            this.invalidateGrid = true;
        else if (!this.currentBlockShape)
            this.createNewBlockShape();
        else
            this.moveBlockDown();
    }

    draw() {
        this.gameOverOverlay.visible = this.isGameOver;
        this.backgroundGrid.visible = !this.isGameOver;

        if (this.invalidateGrid) {
            this.drawGrid();
            this.invalidateGrid = false;
        }
        if (this.currentBlockShape)
            this.currentBlockShape.draw();
        this.previewBlockArea.draw();
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
            for (let col = 0; col < BlockShapeConsts.SHAPE_SIZE ; col++) {
                const shape = this.currentBlockShape.currentShapeState;
                const gridCol = Math.floor(this.currentBlockShape.x / this.cellSize) + col;
                const gridRow = Math.floor(this.currentBlockShape.y / this.cellSize) + row;
                if (shape[row][col]) {
                    const cell = new Cell(this.currentBlockShape.shape.color, this.cellSize);
                    cell.x = gridCol * this.cellSize;
                    cell.y = gridRow * this.cellSize;
                    this.currentGameGrid[gridRow][gridCol] = cell;
                    this.boardBlocksContainer.addChild(cell);
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
        this.boardBlocksContainer.removeChild(this.currentBlockShape);
        this.currentBlockShape = null;
    }

    restartGameArea() {
        this.clearCellMatrix(this.currentGameGrid, GameAreaConsts.DEFAULT_ROWS, GameAreaConsts.DEFAULT_COLUMNS);
        this.initializeBoardGame();
        this.invalidateGrid = true;
    }

    clearCellMatrix(matrix, numRows, numCols) {
        for (let row = numRows - 1; row >= 0; row--)
            for (let col = 0; col < numCols; col++) {
                let cell = matrix[row][col];
                this.boardBlocksContainer.removeChild(cell);
                cell = null;
            }
    }
}
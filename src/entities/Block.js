import { Graphics, Container } from "pixi.js";
import * as BlockShapeConst from "../constants/BlockShapes";

export default class Block extends Container {
    constructor(shape, cellSize) {
        super();
        this.graphics = new Graphics();
        this.shape = shape;
        this.cellSize = cellSize;
        this.currentState = 0;
        this.addChild(this.graphics);
    }

    get blockShape () {
        return this.shape;
    }

    get currentShapeState() {
        return this.shape.states[this.currentState];
    }

    get nextRotateState() {
        const nextRotationState = this.currentState + 1 >= BlockShapeConst.SHAPE_SIZE - 1  ? 0 : this.currentState + 1;
        return this.shape.states[nextRotationState];
    }

    rotate() {
        this.currentState = this.currentState >= BlockShapeConst.SHAPE_SIZE - 1 ? 0 : this.currentState + 1;
    }

    draw() {
        this.graphics.clear();
        const currentShape = this.currentShapeState;
        for (let row = 0; row < BlockShapeConst.SHAPE_SIZE ; row++)
            for (let col = 0; col < BlockShapeConst.SHAPE_SIZE ; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                if (currentShape[row][col] !== 0) {
                    this.graphics.lineStyle(1, "0x000000", 1);
                    this.graphics.beginFill(this.shape.color, 0.8);
                    this.graphics.drawRect(x + 2 , y + 2, this.cellSize - 2, this.cellSize - 2);
                    this.graphics.endFill();
                }

            }
    }
}
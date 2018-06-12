import { Graphics, Container } from "pixi.js";

export default class Cell extends Container {
    constructor(color, cellSize) {
        super();
        this.graphics = new Graphics();
        this.cellSize = cellSize;
        this.color = color;
        this.addChild(this.graphics);
    }

    draw () {
        this.graphics.clear();
        this.graphics.lineStyle(1, "0x000000", 1);
        this.graphics.beginFill(this.color, 0.8);
        this.graphics.drawRect(2 , 2, this.cellSize - 2, this.cellSize - 2);
        this.graphics.endFill();
    }
}


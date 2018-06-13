import { Container, Text, TextStyle } from 'pixi.js';
import * as TextConsts from "../constants/Text";

export default class PreviewBlockArea extends Container {

    constructor(cellSize) {
        super();
        this.cellSize = cellSize;
        this.nextBlockShape = null;
        this.invalidatePriviewBlock = false;
        this.nextPreviewBlockText = new Text(TextConsts.NEXT_BLOCK);
        this.addChild(this.nextPreviewBlockText);
    }

    setup(){
        const nextPreviewBlockTextStyle = new TextStyle({
            fontFamily: 'Verdana',
            fontSize: 15,
            fontStyle: 'normal',
            fill: '#ffff00', // gradient
            stroke: '#4a1850',
            strokeThickness: 1
        });
        this.nextPreviewBlockText.style = nextPreviewBlockTextStyle;
        this.nextPreviewBlockText.x = 5;
        this.nextPreviewBlockText.y = 5;
    }

    nextPreviewBlock(nextBlock){
        if (this.nextBlockShape)
            this.removeChild(this.nextBlockShape);
        this.nextBlockShape = nextBlock;
        this.nextBlockShape.x = 5;
        this.nextBlockShape.y = 25;
        this.addChild(nextBlock);
        this.invalidatePriviewBlock = true;
    }

    draw(){
        if (this.invalidatePriviewBlock)
            if (this.nextBlockShape)
                this.nextBlockShape.draw();
    }
}

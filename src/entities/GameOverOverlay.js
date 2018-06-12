import { Graphics, Container, Text, TextStyle } from "pixi.js";
import * as TextConsts from "../constants/Text";

// based on pixi examples
export default class GameOverOverlay extends Container {
    constructor(width, height) {
        super();
        this.internalWidth = width;
        this.internalHeight = height;
        const background = new Graphics().beginFill(0x8bc5ff,0.2).drawRect(0,0, width, height).endFill();
        super.mask = background;
        this.gameOverText = new Text(TextConsts.GAME_OVER_TEXT);
        this.hitAnyKeyText = new Text(TextConsts.PRESS_ANY_KEY);
        this.addChild(background);
        this.addChild(this.gameOverText);
        this.addChild(this.hitAnyKeyText);
    }

    setup(){
        const style = new TextStyle({
            fontFamily: 'Symbol',
            fontSize: 36,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: ['#00FFFF', '#ffff00'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: false,
            wordWrapWidth: 440
        });
        this.gameOverText.style = style;
        const gameOverTextWidth = TextMetrics.measureText(TextConsts.GAME_OVER_TEXT, style).width;
        const pressKeyTextWidth = TextMetrics.measureText(TextConsts.PRESS_ANY_KEY, style).width;

        this.gameOverText.x = Math.floor((this.internalWidth - gameOverTextWidth) * 0.5);
        this.gameOverText.y = this.internalHeight * 0.5;

        this.hitAnyKeyText.x = Math.floor((this.internalWidth - pressKeyTextWidth) * 0.5);
        this.hitAnyKeyText.y = this.internalHeight * 0.5 + 20;
    }
}
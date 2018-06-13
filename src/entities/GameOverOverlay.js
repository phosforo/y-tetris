import { Graphics, Container, Text, TextStyle, TextMetrics } from "pixi.js";
import * as TextConsts from "../constants/Text";

// based on pixi examples
export default class GameOverOverlay extends Container {
    constructor(width, height) {
        super();
        this.internalWidth = width;
        this.internalHeight = height;
        const background = new Graphics().beginFill(0x000000,0.5).drawRect(0,0, width, height).endFill();
        this.gameOverText = new Text(TextConsts.GAME_OVER_TEXT);
        this.hitAnyKeyText = new Text(TextConsts.PRESS_ANY_KEY);
        this.addChild(background);
        this.addChild(this.gameOverText);
        this.addChild(this.hitAnyKeyText);
    }

    setup(){
        const gameOverStyle = new TextStyle({
            fontFamily: 'Impact',
            fontSize: 36,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: ['#00ffff', '#ffff00'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        const hitKeyStyle = new TextStyle({
            fontFamily: 'Verdana',
            fontSize: 20,
            fontStyle: 'normal',
            fill: '#ffff00',
            stroke: '#4a1850',
            strokeThickness: 1
        });

        this.gameOverText.style = gameOverStyle;
        this.hitAnyKeyText.style = hitKeyStyle;
        const gameOverTextWidth = TextMetrics.measureText(TextConsts.GAME_OVER_TEXT, gameOverStyle).width;
        const pressKeyTextWidth = TextMetrics.measureText(TextConsts.PRESS_ANY_KEY, hitKeyStyle).width;

        this.gameOverText.x = Math.floor((this.internalWidth - gameOverTextWidth) * 0.5);
        this.gameOverText.y = this.internalHeight * 0.5;

        this.hitAnyKeyText.x = Math.floor((this.internalWidth - pressKeyTextWidth) * 0.5);
        this.hitAnyKeyText.y = this.internalHeight * 0.5 + 40;
    }
}
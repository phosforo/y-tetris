import { Container, Text, TextMetrics, TextStyle } from 'pixi.js';
import * as TextConsts from "../constants/Text";

export default class ScoreArea extends Container {

    constructor(width, height) {
        super();
        this.internalWidth = width;
        this.internalHeight = height;
        this.score = 0;
        this.scoreTextTitle = new Text(TextConsts.SCORE_TEXT);
        this.scoreText = new Text(TextConsts.LARGE_SCORE_TEXT);
        this.addChild(this.scoreText);
        this.addChild(this.scoreTextTitle);
    }

    setup(){
        const scoreTextTitleStyle = new TextStyle({
            fontFamily: 'Verdana',
            fontSize: 15,
            fontStyle: 'normal',
            fill: '#ffff00',
            stroke: '#4a1850',
            strokeThickness: 1,
            wordWrap:true,
            align:'right'
        });

        const scoreTextStyle = new TextStyle({
            fontFamily: 'Verdana',
            fontSize: 45,
            fontStyle: 'normal',
            fill: '#ffff00',
            stroke: '#4a1850',
            strokeThickness: 1,
            wordWrap:true,
            align:'right'
        });

        const scoreTextTitleWidth = TextMetrics.measureText(TextConsts.SCORE_TEXT, scoreTextTitleStyle).width;
        const scoreTextWidth = TextMetrics.measureText(TextConsts.LARGE_SCORE_TEXT, scoreTextStyle).width;

        this.scoreTextTitle.style = scoreTextTitleStyle;
        this.scoreTextTitle.x = this.internalWidth - this.x - scoreTextTitleWidth - 5;
        this.scoreTextTitle.y = 5;

        this.scoreText.style = scoreTextStyle;
        this.scoreText.x = this.internalWidth - this.x - scoreTextWidth - 5;
        this.scoreText.y = 25;

    }

    resetScore(){
        this.score = 0;
    }

    updateScore(newScore){
        this.score += newScore;
        const stringScore = TextConsts.LARGE_SCORE_TEXT + this.score;
        this.scoreText.text = stringScore.substr(stringScore.length - TextConsts.LARGE_SCORE_TEXT.length);
    }
}

import { Container, Text, TextMetrics, TextStyle } from 'pixi.js';
import * as TextConsts from "../constants/Text";

export default class ScoreArea extends Container {

    constructor(scoreResolver, width, height) {
        super();
        this.internalWidth = width;
        this.internalHeight = height;
        this.scoreResolver = scoreResolver;
        this.scoreTextTitle = new Text(TextConsts.SCORE_TEXT);
        this.scoreText = new Text(TextConsts.LARGE_SCORE_TEXT);
        this.linesTextTitle = new Text(TextConsts.LINES_TEXT);
        this.linesText = new Text(TextConsts.LARGE_SCORE_TEXT);
        this.addChild(this.scoreText);
        this.addChild(this.scoreTextTitle);
        this.addChild(this.linesText);
        this.addChild(this.linesTextTitle);
    }

    setup(){
        this.scoreResolver.onScoreUpdateCallback = (score, lines) => {
            this.updateScore(score,lines);
        };
        const titleStyle = new TextStyle({
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

        const scoreTextTitleWidth = TextMetrics.measureText(TextConsts.SCORE_TEXT, titleStyle).width;
        const scoreTextWidth = TextMetrics.measureText(TextConsts.LARGE_SCORE_TEXT, scoreTextStyle).width;
        const linesTextWidth = TextMetrics.measureText(TextConsts.LARGE_SCORE_TEXT, titleStyle).width;

        this.scoreTextTitle.style = titleStyle;
        this.scoreTextTitle.x = this.internalWidth - this.x - scoreTextTitleWidth - 5;
        this.scoreTextTitle.y = 5;

        this.scoreText.style = scoreTextStyle;
        this.scoreText.x = this.internalWidth - this.x - scoreTextWidth - 5;
        this.scoreText.y = 15;

        this.linesTextTitle.style = titleStyle;
        this.linesTextTitle.x = this.internalWidth - this.x - scoreTextTitleWidth - 5;
        this.linesTextTitle.y = 60;

        this.linesText.style = titleStyle;
        this.linesText.x = this.internalWidth - this.x - linesTextWidth - 5;
        this.linesText.y = 75;


    }

    updateScore(score,lines){
        const scoreString = TextConsts.LARGE_SCORE_TEXT + score;
        const lineString = TextConsts.LARGE_SCORE_TEXT + lines;
        this.scoreText.text = scoreString.substr(scoreString.length - TextConsts.LARGE_SCORE_TEXT.length);
        this.linesText.text = lineString.substr(lineString.length - TextConsts.LARGE_SCORE_TEXT.length);
    }
}

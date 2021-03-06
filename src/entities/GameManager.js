import * as KeyActions from '../constants/BlockActions';
import KeyboardManager from "./KeyboardManager";
import SoundManager from "./SoundManager";
import * as SoundConst from "../constants/Sound";
import GameArea from "./GameArea";
import * as GameAreaConsts from "../constants/GameArea";

export default class GameManager {

    constructor(context,application, width, height) {
        this.application = application;
        const gameCellSize = Math.floor(Math.min(width / GameAreaConsts.DEFAULT_COLUMNS, height / GameAreaConsts.DEFAULT_ROWS));
        const previewCellSize = 20;
        this.updateTick = 1000; // 1000/40 = 25 frames per second
        this.time = 0;

        this.keyboardManager = new KeyboardManager(context);
        this.soundManager = new SoundManager();

        this.gameArea = new GameArea(width,height, gameCellSize, previewCellSize);
        application.stage.addChild(this.gameArea);
    }

    setup(){
        this.gameArea.onWallHitCallback = () => {
            this.soundManager.playSound(SoundConst.WALL_HIT);
        };

        this.gameArea.onRotateCallback = () => {
            this.soundManager.playSound(SoundConst.MOVE);
        };

        this.gameArea.onLineCompleteCallback = () => {
            this.soundManager.playSound(SoundConst.LINE_COMPLETE);
        };

        this.gameArea.onDropCallback = () => {
            this.soundManager.playSound(SoundConst.DROP);
        };

        this.gameArea.onMoveCallback = () => {
            this.soundManager.playSound(SoundConst.MOVE);
        };

        this.gameArea.onEndCallback = () => {
            this.soundManager.playSound(SoundConst.END);
        };

        this.keyboardManager.pressCallback = (direction) => {
            this.processingInput = true;
            switch (direction) {
            case KeyActions.MOVE_LEFT:
            case KeyActions.MOVE_RIGHT:
                this.gameArea.moveBlock(direction);
                break;
            case KeyActions.ROTATE:
                this.gameArea.rotateBlock();
                break;
            case KeyActions.DROP:
                this.gameArea.dropBlock();
                break;
            case KeyActions.SHOW_GRID:
                this.gameArea.showGrid();
                break;
            }
            this.gameArea.onKeyPressed();
            this.processingInput = false;
        };
        this.keyboardManager.setup();
        this.gameArea.setup();
    }

    inProcessingState(){
        return this.processingInput;
    }

    run(){
        const timeNow = (new Date()).getTime();
        const timeDiff = timeNow - this.time;
        if (timeDiff < this.updateTick){
            this.gameArea.draw();
            return;
        }

        this.time = timeNow;
        if (!this.inProcessingState()) this.gameArea.update();

    }
}
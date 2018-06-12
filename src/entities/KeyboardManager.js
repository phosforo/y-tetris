import KeyboardKeyHandler from "../handlers/KeyboardKeyHandler";
import * as KeyActions from '../constants/BlockActions';

export default class KeyboardManager {
    constructor(keyboardContext, pressCallback, releaseCallback) {
        this.pressCallback = pressCallback;
        this.releaseCallback = releaseCallback;
        this.leftKeyHandler = new KeyboardKeyHandler(keyboardContext, 37);
        this.rightKeyHandler = new KeyboardKeyHandler(keyboardContext, 39);
        this.upKeyHandler = new KeyboardKeyHandler(keyboardContext, 38);
        this.downKeyHandler = new KeyboardKeyHandler(keyboardContext, 40);
        this.pauseKeyHandler = new KeyboardKeyHandler(keyboardContext, 32);
        this.gridKeyHandler = new KeyboardKeyHandler(keyboardContext, 71);
    }

    setup() {
        if (this.pressCallback) {
            this.leftKeyHandler.press = () => {
                this.pressCallback(KeyActions.MOVE_LEFT);
            };
            this.rightKeyHandler.press = () => {
                this.pressCallback(KeyActions.MOVE_RIGHT);
            };
            this.upKeyHandler.press = () => {
                this.pressCallback(KeyActions.ROTATE);
            };
            this.downKeyHandler.press = () => {
                this.pressCallback(KeyActions.DROP);
            };
            this.pauseKeyHandler.press = () => {
                this.pressCallback(KeyActions.PAUSE);
            };
            this.gridKeyHandler.press = () => {
                this.pressCallback(KeyActions.SHOW_GRID);
            };
        }

        if (this.releaseCallback) {
            this.leftKeyHandler.press = () => {
                this.releaseCallback(KeyActions.MOVE_LEFT);
            };
            this.rightKeyHandler.press = () => {
                this.releaseCallback(KeyActions.MOVE_RIGHT);
            };
            this.upKeyHandler.press = () => {
                this.releaseCallback(KeyActions.ROTATE);
            };
            this.downKeyHandler.press = () => {
                this.releaseCallback(KeyActions.DROP);
            };
            this.pauseKeyHandler.press = () => {
                this.releaseCallback(KeyActions.PAUSE);
            };
            this.gridKeyHandler.press = () => {
                this.releaseCallback(KeyActions.SHOW_GRID);
            };
        }

        this.leftKeyHandler.setup();
        this.rightKeyHandler.setup();
        this.upKeyHandler.setup();
        this.downKeyHandler.setup();
        this.pauseKeyHandler.setup();
        this.gridKeyHandler.setup();
    }
}
// based on the pixi.js examples
export default class KeyboardKeyHandler {
    constructor(keyboardContext, keyCode) {
        this.keyboardContext = keyboardContext;
        this.keyCode = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;
    }

    setup() {
        this.keyboardContext.addEventListener("keydown", this.downHandler.bind(this), false);
        this.keyboardContext.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    downHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isUp && this.press) this.press();
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    }

    upHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isDown && this.release) this.release();
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    }
}
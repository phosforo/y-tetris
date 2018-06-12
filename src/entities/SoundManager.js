import SoundHandler from "../handlers/SoundHandler";
import * as SoundConsts from "../constants/Sound";
import * as PIXI from "pixi-sound";

export default class SoundManager {
    constructor(endPlayCallback) {
        this.pixiSoundContext = PIXI.sound.Sound.from({
            'url': 'resources/sprite.mp3',
            'sprites': SoundConsts.SOUNDS
        });
        this.endPlayCallback = endPlayCallback;
        this.hitWallHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.WALL_HIT);
        this.rotateHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.ROTATE);
        this.dropHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.DROP);
        this.lineCompleteHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.LINE_COMPLETE);
        this.moveHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.MOVE);
        this.endGameHandler = new SoundHandler(this.pixiSoundContext, SoundConsts.END);

    }

    setup() {
        if (this.endPlayCallback) {
            this.hitWallHandler.playEnd = () => {
                this.endPlayCallback(SoundConsts.WALL_HIT);
            };
            this.rotateHandler.playEnd = () => {
                this.endPlayCallback(SoundConsts.MOVE);
            };
            this.dropHandler.playEnd = () => {
                this.endPlayCallback(SoundConsts.DROP);
            };
            this.lineCompleteHandler.playEnd = () => {
                this.endPlayCallback(SoundConsts.LINE_COMPLETE);
            };
            this.lineCompleteHandler.playEnd = () => {
                this.endPlayCallback(SoundConsts.MOVE);
            };
        }
    }

    playSound(soundCode) {
        switch (soundCode){
        case SoundConsts.WALL_HIT:
            this.hitWallHandler.playSound();
            break;
        case SoundConsts.END:
            this.endGameHandler.playSound();
            break;
        case SoundConsts.DROP:
            this.dropHandler.playSound();
            break;
        case SoundConsts.LINE_COMPLETE:
            this.lineCompleteHandler.playSound();
            break;
        default:
            this.moveHandler.playSound();
            break;
        }
    }
}
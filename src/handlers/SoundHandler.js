import * as SoundConst from "../constants/Sound";

export default class SoundHandler {
    constructor(context, soundCode) {
        this.context = context;
        this.soundCode = soundCode;
        this.playEnd = undefined;
    }

    playSound() {
        const playContext = this.context.play(SoundConst.SOUNDS[this.soundCode]);
        if (this.playEnd)
            playContext.on('end', this.playEnd());
    }

}
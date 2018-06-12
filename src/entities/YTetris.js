import GameManager from './GameManager';
import GameArea from './GameArea';

export default class YTetris {

    constructor(context, application, width, height) {
        this.application = application;
        this.gameArea = new GameArea(width,height);
        this.gameManager = new GameManager(context, this.gameArea);
        this.application.stage.addChild(this.gameArea);

    }

    setup() {
        this.gameManager.setup();
    }

    runGame() {
        this.application.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        this.gameManager.run();
    }
}
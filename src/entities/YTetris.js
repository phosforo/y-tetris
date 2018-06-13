import GameManager from './GameManager';

export default class YTetris {

    constructor(context, application, width, height) {
        this.application = application;
        this.gameManager = new GameManager(context, application, width, height);
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
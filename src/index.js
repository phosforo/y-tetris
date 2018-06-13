import { Application } from "pixi.js";
import * as GameConsts from './constants/Game';
import ResourceLoaderHandler from "./handlers/ResourceLoaderHandler";
import * as Resources from "./constants/Resources";
import YTetris from "./entities/YTetris";

/**
 *  Set up the game after the window has finished loading.
 *  Creates the renderer, sets up the stages, and performs the initial render.
 */
const setup = () => {
    const application = new Application({ width: GameConsts.CANVAS_WIDTH, height: GameConsts.CANVAS_HEIGHT });
    document.getElementById("main").appendChild(application.view);
    const game = new YTetris(window, application, GameConsts.CANVAS_WIDTH, GameConsts.CANVAS_HEIGHT);
    game.setup();
    game.runGame();
};

/* ---------- Initialisation ---------- */

// Wait until the page is fully loaded
window.addEventListener("load", () => {
    const resourcesLoaderHandler = new ResourceLoaderHandler(Resources.RESOURCES_MANIFEST);
    resourcesLoaderHandler.loaded = () => {
        setup();
    };
    resourcesLoaderHandler.loadResources();
});

import { Application } from "pixi.js";
/**
 *  Set up the game after the window has finished loading.
 *  Creates the renderer, sets up the stages, and performs the initial render.
 */
const setup = () => {
    const application = new Application({ width: 800, height: 600});
    document.getElementById("main").appendChild(application.view);
};

/* ---------- Initialisation ---------- */

// Wait until the page is fully loaded
window.addEventListener("load", () => {
    setup();
});

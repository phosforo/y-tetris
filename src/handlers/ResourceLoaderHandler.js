import * as PIXI from "pixi.js";

export default class ResourceLoaderHandler {
    constructor(manifest) {
        this.resourceManifest = manifest;
        this.progress = undefined;
        this.loaded = undefined;
    }

    loadResources() {
        const loader = PIXI.loader;
        for (const name in this.resourceManifest)
            loader.add(name, this.resourceManifest[name]);

        if (this.progress)
            loader.on("progress", this.progress);

        if (this.loaded)
            loader.load(this.loaded);
    }
}


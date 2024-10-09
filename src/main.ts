// @ts-ignore
import AmmoLib from "./ammo/ammo.js";
import { Project, Scene } from "./lib/index.js";

import { BasicScene } from "./scenes/BasicScene.js";

AmmoLib()
.then((result: any) => {
    const sceneMap = new Map<string, typeof Scene>([
        ["basic-scene", BasicScene],
    ]);

    //@ts-ignore
    const project = new Project(
        sceneMap,
        "basic-scene",
        "basic-scene",
        {
            physicsEngine: result,
            shadows: true,
            stats: true
        }
    );
})
.catch((error:any) => console.log(error));

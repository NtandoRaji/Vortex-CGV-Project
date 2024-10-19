// @ts-ignore
import AmmoLib from "./ammo/ammo.js";
import { Project, Scene } from "./lib/index.js";

import { BasicScene } from "./scenes/BasicScene.js";
import { Level1 } from "./scenes/Level1.js";

AmmoLib()
.then((result: any) => {
    const sceneMap = new Map<string, typeof Scene>([
        ["level_1", Level1],
        ["basic-scene", BasicScene],
    ]);

    //@ts-ignore
    const project = new Project(
        sceneMap,
        "level_1",
        "basic-scene",
        {
            physicsEngine: result,
            shadows: true,
            stats: true
        }
    );
})
.catch((error:any) => console.log(error));

// @ts-ignore
import AmmoLib from "./ammo/ammo.js";
import { Project, Scene } from "./lib/index.js";

import { MainMenu } from "./scenes/MainMenu.js";
import { BasicScene } from "./scenes/BasicScene.js";
import { Level1 } from "./scenes/Level1.js";
import { Level2 } from "./scenes/Level2.js";

AmmoLib()
.then((result: any) => {
    const sceneMap = new Map<string, typeof Scene>([
        ["main-menu", MainMenu],
        ["level-2",Level2],
        ["level-1", Level1],
        ["basic-scene", BasicScene],
    ]);

    //@ts-ignore
    const project = new Project(
        sceneMap,
        "level-1",
        "basic-scene",
        {
            physicsEngine: result,
            shadows: true,
            stats: true
        }
    );
})
.catch((error:any) => console.log(error));

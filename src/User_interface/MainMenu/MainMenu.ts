import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext";
import { drawHowToPlay } from "./HowToPlay";
import { drawPickLevel } from "./pickLevel";
import { buildButton } from "../utility";
import { drawSettings } from "./Settings";
import { drawCredits } from "./Credits";

export const drawMainMenu = (ui: CustomInterfaceContext) => {
    const { menu: mainMenu, menuId: mainMenuID} = ui.addMenu("Speed Shopper", false);
    
    mainMenu.style.backgroundColor = "#edebebd6";

    const clickSound = new Audio('musicSound/menuClick.mp3');

    const howToPlayID = drawHowToPlay(ui);
    const pickLevelID = drawPickLevel(ui);
    const settingsID = drawSettings(ui);
    const creditsID = drawCredits(ui);

    const playButton = buildButton("Play Game", "#568fc4", () => {
        const event = new CustomEvent("changeScene", {detail: "level-1"});
        document.dispatchEvent(event);
    });

    // --- Create Menu Buttons ---
    const howToPlayButton = buildButton("How to Play", "#d34283", () => {
        clickSound.play();
        ui.showPopup(howToPlayID);
    });

    const levelsButton = buildButton("Levels", "#8e26c6e2", () => {
        clickSound.play();
        ui.showPopup(pickLevelID);
    });

    const settingsButton = buildButton("Settings", "#c64926e2", () => {
        clickSound.play();
        ui.showPopup(settingsID);
    });

    const creditsButton = buildButton("Credits", "#3c7e36e2", () => {
        clickSound.play();
        ui.showPopup(creditsID);
    });
    // --------------------------

    mainMenu.appendChild(playButton);
    mainMenu.appendChild(howToPlayButton);
    mainMenu.appendChild(levelsButton);
    mainMenu.appendChild(settingsButton);
    mainMenu.appendChild(creditsButton);
    ui.showMenu(mainMenuID);
}
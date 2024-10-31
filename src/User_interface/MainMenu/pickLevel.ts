import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext"; 
import { buildButton, popupCloseButton, createHeading } from "../utility";

export const drawPickLevel = (ui: CustomInterfaceContext, clickSound: HTMLAudioElement) : number => {
    const purple = "#8e26c6e2";
    const {popup, popupID} = ui.addPopup("", purple);

    const closeButton = popupCloseButton("x", purple,() => {
        clickSound.play();
        ui.hidePopup(popupID);
    });
    popup.appendChild(closeButton);

    const popupHeading = createHeading("Pick Your Difficulty", purple);
    popupHeading.style.fontSize = "2.5em";
    popupHeading.style.paddingTop = "5px";
    popupHeading.style.textAlign = "center";
    popup.appendChild(popupHeading);

    const levels = ["level-1", "level-2", "level-3"];
    const levelNames = ["Beginner's Basket", "Hidden Haul", "Speed Shopper"];
    const levelDescriptions = [
        "Level 1:",
        "Level 2:",
        "Level 3:"
    ];
    const buttonColours = ["#d5a1f8", "#b97cd9", "#8b4c9e"];

    for (let i = 0; i < levels.length; i++){
        const text = document.createElement("p");
        text.style.textAlign = "center";
        text.style.fontWeight = "bold";
        text.textContent = `${levelDescriptions[i]}`;
        popup.appendChild(text);

        const button = buildButton(levelNames[i], buttonColours[i], () => {
            const event = new CustomEvent("changeScene", {detail: levels[i]});
            document.dispatchEvent(event);
        });

        popup.appendChild(button);
        
        
    }

    return popupID;
}
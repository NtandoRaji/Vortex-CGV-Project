import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext"; 
import { buildButton, popupCloseButton } from "../utility";

export const drawPickLevel = (ui: CustomInterfaceContext) : number => {
    const purple = "#8e26c6e2";
    const {popup, popupID} = ui.addPopup("Pick Your Difficulty", purple);

    const closeButton = popupCloseButton("", purple,() => ui.hidePopup(popupID));
    popup.appendChild(closeButton);

    const levels = ["level-1", "level-2", "level-3"];
    const levelNames = ["Easy Sunday", "Mid-Week Mayhem", "Month-End Disaster"];
    const buttonColours = ["#d5a1f8", "#b97cd9", "#8b4c9e"];

    for (let i = 0; i < levels.length; i++){
        const button = buildButton(levelNames[i], buttonColours[i], () => {
            const event = new CustomEvent("changeScene", {detail: levels[i]});
            document.dispatchEvent(event);
        });

        popup.appendChild(button);
    }

    return popupID;
}
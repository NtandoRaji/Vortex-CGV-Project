import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext";
import { popupCloseButton } from "../utility";

export const drawSettings = (ui: CustomInterfaceContext) : number => {
    const orange = "#c64926e2";
    const {popup, popupID} = ui.addPopup("Settings", orange);

    const closeButton = popupCloseButton("", orange, () => ui.hidePopup(popupID));
    popup.appendChild(closeButton);

    return popupID;
}
import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext";
import { popupCloseButton } from "../utility";

export const drawCredits = (ui: CustomInterfaceContext) : number => {
    const orange = "#3c7e36e2";
    const {popup, popupID} = ui.addPopup("Credits", orange);

    const closeButton = popupCloseButton("", orange, () => ui.hidePopup(popupID));
    popup.appendChild(closeButton);

    return popupID;
}
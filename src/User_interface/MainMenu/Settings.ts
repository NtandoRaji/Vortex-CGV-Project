import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext";
import { popupCloseButton, createHeading  } from "../utility";

export const drawSettings = (ui: CustomInterfaceContext, clickSound: HTMLAudioElement) : number => {
    const orange = "#c64926e2";
    const {popup, popupID} = ui.addPopup("", orange);

    const closeButton = popupCloseButton("x", orange, () => {
        clickSound.play();
        ui.hidePopup(popupID);
    });
    popup.appendChild(closeButton);

    const popupHeading = createHeading("Settings", orange);
    popupHeading.style.fontSize = "2.5em";
    popupHeading.style.paddingTop = "2px";
    popupHeading.style.textAlign = "center";
    popup.appendChild(popupHeading);

    const musicVolumeSection = document.createElement("section");
    musicVolumeSection.style.display = "flex";
    musicVolumeSection.style.justifyContent = "center";
    musicVolumeSection.style.width = "100%";
    musicVolumeSection.style.gap = "10%";

        const musicVolumeLabel = document.createElement("label");
        musicVolumeLabel.textContent = "Music Volume:";
        musicVolumeSection.appendChild(musicVolumeLabel);

        const musicVolumeSlider = document.createElement("input");
        musicVolumeSlider.id = "volume";
        musicVolumeSlider.type = "range";
        musicVolumeSlider.min = "0";
        musicVolumeSlider.max = "100";
        musicVolumeSlider.value = "50";
        musicVolumeSlider.style.color = orange;

        musicVolumeSection.appendChild(musicVolumeSlider);

    popup.appendChild(musicVolumeSection);

    // Set initial volume to 50%
    const volume = Number(musicVolumeSlider.value) / 100;
    localStorage.setItem("vol", volume.toString());
    
    if (musicVolumeSlider instanceof HTMLInputElement) {
        musicVolumeSlider.addEventListener('input', () => {
            const volume = Number(musicVolumeSlider.value) / 100;
            localStorage.setItem("vol", volume.toString());
        });
    }

    return popupID;
}
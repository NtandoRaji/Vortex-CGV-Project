import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext"
import { popupCloseButton } from "../utility";

export const drawHowToPlay = (ui: CustomInterfaceContext, clickSound: HTMLAudioElement) : number => {
    let pink = "#e91e63";
    const {popup, popupID} = ui.addPopup("How to Play", pink);

    const closeButton = popupCloseButton("x", pink,() => {
        clickSound.play();
        ui.hidePopup(popupID);
    });

    popup.appendChild(closeButton);

    let text = document.createElement("p");
    text.style.fontWeight = "bold";
    text.textContent = "(For you first timers...)";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.fontWeight = "bold";
    text.textContent = "No Judgement here:)";
    popup.appendChild(text);

    
    const instructions = [
        { key: 'WASD', action: 'to navigate and control the character.' },
        { key: '"E"', action: 'to interact / pick up an object.' },
        { key: '"P"', action: 'to pause & resume the game.' },
        { key: '"C"', action: 'to change the current scene.' },
        { key: '"Space"', action: 'to jump.' }
    ];
    const howToPlayList = document.createElement('ul');
    instructions.forEach(instruction => {
        const li = document.createElement('li');

        li.innerHTML = `Use the <b> ${instruction.key} </b> keys ${instruction.action}`;
        
        howToPlayList.appendChild(li);
      });
    
    popup.appendChild(howToPlayList);

    return popupID;
}
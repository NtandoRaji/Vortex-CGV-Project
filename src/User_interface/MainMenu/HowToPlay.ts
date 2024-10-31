import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext"
import { popupCloseButton, createHeading } from "../utility";

export const drawHowToPlay = (ui: CustomInterfaceContext, clickSound: HTMLAudioElement) : number => {
    let pink = "#e91e63";
    const {popup, popupID} = ui.addPopup("How to Play", pink);

    const closeButton = popupCloseButton("x", pink,() => {
        clickSound.play();
        ui.hidePopup(popupID);
    });

    popup.appendChild(closeButton);

    const popupHeading = createHeading("How to Play", pink);
    popupHeading.style.fontSize = "2.5em";
    popupHeading.style.paddingTop = "40px";
    popupHeading.style.textAlign = "center";
    popup.appendChild(popupHeading);

    let text = document.createElement("p");
    text.style.fontWeight = "bold";
    text.textContent = "Welcome to Speed Shopper!";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.textContent = "In this game, you'll be presented with a shopping list of items to collect within a time limit.";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.textContent = "As you race against the clock, be mindful of your selections. Each wrong choice will cost you a life.";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.textContent = "If you lose all your lives before completing your list, you’ll fail the round and be forced to restart.";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.textContent = "If you fail to collect all items in the given time, you’ll fail the round and be forced to restart.";
    popup.appendChild(text);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.style.fontWeight = "bold";
    text.textContent = "Your shopping guide lies below:";
    popup.appendChild(text);
   
    const instructions = [
        { key: '"WASD"', action: 'to navigate and control the character.' },
        { key: '"E"', action: 'to select an object.' },
        { key: '"P"', action: 'to pause / resume the game.' },
        { key: '"C"', action: 'to change the current scene.' }
    ];
    
    const howToPlayList = document.createElement('ul');
    instructions.forEach(instruction => {
        const li = document.createElement('li');

        li.innerHTML = `Use the <b> ${instruction.key} </b> keys ${instruction.action}`;
        
        howToPlayList.appendChild(li);
      });
    
    popup.appendChild(howToPlayList);

    text = document.createElement("p");
    text.style.textAlign = "center";
    text.style.fontWeight = "bold";
    text.style.fontStyle = "italic";
    text.textContent = "Can you make it to the checkout before time runs out?";
    popup.appendChild(text);

    return popupID;
}
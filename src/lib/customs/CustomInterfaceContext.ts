import { InteractManager } from "../w3ads/InteractManager";

export class CustomInterfaceContext extends InteractManager{
    root: HTMLDivElement;
    promptRoot: HTMLDivElement;
    menuRoot: HTMLDivElement;
    elements: Array<HTMLElement>;

    constructor() {
        super();
        
        this.root = document.createElement('div');
        this.root.className = 'absolute left-0 top-0 z-10 h-screen w-screen';

        this.menuRoot = document.createElement('div');
        this.menuRoot.className = 'flex flex-row justify-center items-center h-screen w-screen';
        this.root.appendChild(this.menuRoot);

        this.promptRoot = document.createElement('div');
        this.promptRoot.className = 'absolute left-10 top-10 flex flex-col items-center justify-center gap-1 p-2';
        this.root.appendChild(this.promptRoot);

        this.elements = [];
        document.body.appendChild(this.root);
    }

    hideAll() {
        this.menuRoot.replaceChildren();
        this.promptRoot.replaceChildren();
    }

    removeAll() {
        document.body.removeChild(this.root);
    }

    removeElement(elementId: number) {
        this.elements.splice(elementId, 1);
    }

    addPrompt(innerHtml: string): number {
        const promptId = this.elements.length;
        this.elements.push( document.createElement('div') );
        this.elements[promptId].className = 'flex h-10 items-center justify-center rounded-md border-2 border-black bg-gradient-to-r from-sky-400 to-sky-700 p-2 text-white';

        const text = document.createElement('p');
        text.className = 'text-2xl flex justify-center items-center w-full h-full';
        text.innerHTML = innerHtml;

        this.elements[promptId].appendChild(text);

        return promptId;
    }

    showPrompt(promptId: number) {
        this.promptRoot.appendChild(this.elements[promptId]);
    };

    hidePrompt(promptId: number) {
        try {
            this.promptRoot.removeChild(this.elements[promptId]);
        } catch {
            // do nothing if node not found
        }
    }

    addMenu( title: string, row: boolean ): { menu: HTMLElement, menuId: number } {
        const menuId = this.elements.length;
        this.elements.push( document.createElement('div') );
        this.elements[menuId].className = `flex flex-${row ? 'row': 'col' } justify-center gap-5`;
        this.elements[menuId].style.width = "580px";
        this.elements[menuId].style.height = "auto";
        this.elements[menuId].style.backgroundColor;
        this.elements[menuId].style.padding = '30px';
        this.elements[menuId].style.borderRadius = '15px';
        this.elements[menuId].style.boxShadow = '0 20px 20px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.2)'; // Large dark shadow and inner shadow
        this.elements[menuId].style.outline = '10px solid #4e4e4e'; // Outline color
        this.elements[menuId].style.outlineOffset = '5px'; // Outline offset

        const titleElement = document.createElement('h1');
        this.elements[menuId].appendChild(titleElement);
        titleElement.className = 'w-full text-center text-3xl font-bold';
        titleElement.style.fontSize = "4rem";
        titleElement.style.padding = "20px";
        titleElement.textContent = title;

        return {
            menu: this.elements[menuId],
            menuId: menuId,
        }
    }

    showMenu(menuId: number) {
        this.menuRoot.appendChild(this.elements[menuId]);
    }

    hideMenu(menuId: number) {
        try {
            this.menuRoot.removeChild(this.elements[menuId]);
        } catch {
            // do nothing if node not found
        }
    }

    addPopup(innerHtml: string, colour: string = "red") {
        const popupID = this.elements.length;

        const popup = document.createElement('div');
        popup.className = "flex flex-col items-center justify-center gap-5"
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgb(255, 255, 255)';
        popup.style.borderWidth = '10px';
        popup.style.borderStyle = 'solid';
        popup.style.borderRadius = '15px';
        popup.style.borderColor = colour;
        popup.style.padding = '20px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '1000';
        popup.style.width = '500px';
        popup.style.height = 'auto';
        popup.style.maxHeight = '80vh';
        popup.style.overflowY = 'auto';
        popup.style.backgroundClip = 'padding-box';

        this.elements.push(popup);
        
        const title = document.createElement("h1");
        title.className = "w-full text-center text-2xl text-red-700 font-bold"
        title.style.color = colour;
        title.innerHTML = innerHtml;
        this.elements[popupID].appendChild(title);

        return {
            popup: this.elements[popupID],
            popupID: popupID
        }
    }

    showPopup(popupID: number) {
        this.menuRoot.appendChild(this.elements[popupID]);
    }

    hidePopup(popupID: number) {
        try {
            this.menuRoot.removeChild(this.elements[popupID]);
        } catch {
            // do nothing if node not found
        }
    }
}
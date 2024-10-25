export const buildButton = (text: string, colour:string = "white", onclick: Function) => {
    const button = document.createElement('button');

    button.style.width = "100%";
    button.style.height = "11.5%"; 
    button.style.minHeight = "60px";
    button.style.color = "#313131";
    button.style.backgroundColor = colour ; 
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.cursor = 'pointer';
    button.style.transition = 'transform 0.3s, box-shadow 0.3s';
    button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    button.onclick = () => onclick();

    button.style.fontWeight = "bold";
    button.style.fontSize = '1.5rem';
    button.style.margin = "0px";
    button.textContent = text;

    button.addEventListener("mouseover", () => {
        button.style.transform = 'translateY(-5px)';  // Button lift effect
        button.style.boxShadow = `0 15px 50px ${colour}`;  // Increase shadow
        button.style.outline = '5px solid #313131';  // Outline
        button.style.outlineOffset = '5px';  // Outline offset
    });

    button.addEventListener('mouseout', function() {
        button.style.transform = '';  // Reset the transform
        button.style.boxShadow = '0 4px 15px';  // Reset shadow
        button.style.outline = 'none';  // Remove outline
        button.style.outlineOffset = '0';  // Reset outline offset
    });

    return button;
};

export const buildSection = (title: string) => {
    const section = document.createElement('section');
    section.className = 'flex w-full flex-col items-start justify-center text-lg gap-1';

    const titleText = document.createElement('h2');
    titleText.className = 'w-full border-b-2 border-black text-left font-semibold text-2xl';
    titleText.textContent = title;

    section.appendChild(titleText);

    return section;
}

export const popupCloseButton = (text: string, colour: string = "white", onclick: Function) => {
    const button = document.createElement('button');
    button.className = "text-2xl";
    button.style.backgroundColor = colour;
    button.textContent = text;
    button.style.margin = "0px";
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.right = '15px';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.color = '#000';
    button.style.borderRadius = '8px';
    button.style.padding = '0px 6px 6px 6px';
    button.onclick = () => onclick();

    return button;
}

// Helper function to create section headers
export const createHeading = (text: string, colour: string): HTMLHeadingElement => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    heading.style.color = colour;
    heading.style.fontWeight = "bold";
    heading.style.fontSize = "18px";
    return heading;
};

// Helper function to create paragraphs with plain text
export const createParagraph = (text: string): HTMLParagraphElement => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraph.style.marginTop = "5px";
    paragraph.style.marginBottom = "5px";
    paragraph.style.textAlign = "center";
    paragraph.style.width = "45%";
    return paragraph;
};

// Helper function to create link lists
export interface Link {
    name: string;
    url: string;
}

export const createLinkList = (links: Link[]): HTMLUListElement => {
    const list = document.createElement("ul");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.alignItems = "center";

    links.forEach((link) => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link.url;
        // anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.name;
        listItem.appendChild(anchor);
        list.appendChild(listItem);
    });
    return list;
};
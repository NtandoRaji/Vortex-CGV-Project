import { CustomInterfaceContext } from "../../lib/customs/CustomInterfaceContext";
import { popupCloseButton, createHeading, createParagraph, createLinkList, Link } from "../utility";

export const drawCredits = (ui: CustomInterfaceContext, clickSound: HTMLAudioElement): number => {
    const green = "#3c7e36e2";
    const { popup, popupID } = ui.addPopup("Credits", green);
    popup.innerHTML = "";

    // Close Button
    const closeButton = popupCloseButton("x", green, () => {
        clickSound.play();
        ui.hidePopup(popupID);
    });
    popup.appendChild(closeButton);

    const popupHeading = createHeading("Behind the Scenes Magic Awards", green);
    popupHeading.style.fontSize = "2.5em";
    popupHeading.style.paddingTop = "550px";
    popupHeading.style.textAlign = "center";
    popup.appendChild(popupHeading);

    // Section 1: Byte-Sized Builders
    popup.appendChild(createHeading("Byte-Sized Builders", green));

    const developerSection = document.createElement("section");
    developerSection.style.display = "flex";
    developerSection.style.flexWrap = "wrap";
    developerSection.style.justifyContent = "space-between";

    ["Tania Bantam", "Ntando Raji", "Shaneel Kassen", "Yassir Ali", "Jaedon Moodley", "Taruna Naidoo"].forEach((name) => {
        developerSection.appendChild(createParagraph(name));
    });

    popup.appendChild(developerSection);

    // Section 2: Quest Creator
    popup.appendChild(createHeading("Quest Creator (Game Engine)", green));
    const questCreatorParagraph = createParagraph("");
    const link = document.createElement('a');
    link.href = "https://github.com/Wits-SG/CGV-Project/tree/main/src/lib/w3ads";
    link.textContent = "Game Engine Used - Attributed to Brendan Griffiths";
    link.target = "_blank";
    
    questCreatorParagraph.appendChild(link);
    popup.appendChild(questCreatorParagraph);
    // Section 3: Sculpted Spectacles
    popup.appendChild(createHeading("Sculpted Spectacles (Models)", green));
    const modelLinks: Link[] = [
        { name: "Carton by Kenney", url: "https://poly.pizza/m/T2QjC2ZQya" },
        { name: "Peanut Butter by Kenney", url: "https://poly.pizza/m/t3G8zaLjYe" },
        { name: "Orange by Poly by Google [CC-BY]", url: "https://poly.pizza/m/9KbFqwZAqn2" },
        { name: "Banana by Poly by Google [CC-BY]", url: "https://poly.pizza/m/ahOO6wz8sV0" },
        { name: "Soda by Poly by Google [CC-BY]", url: "https://poly.pizza/m/2w4Av7jJ2_B" },
        { name: "Container Bathroom A by Isa Lousberg", url: "https://poly.pizza/m/xddz7Cu53w" },
        { name: "Green Pepper", url: "https://poly.pizza/m/5d6zv4Ow2tO" },
        { name: "Eggplant", url: "https://poly.pizza/m/abKWST5Odkg" },
        { name: "Broccoli", url: "https://poly.pizza/m/3rnhf01rmNh" },
        { name: "Beets", url: "https://poly.pizza/m/f2zAOPFIZnr" }
    ];
    popup.appendChild(createLinkList(modelLinks));

    // Section 4: Heartquake Tokens
    popup.appendChild(createHeading("Heartquake Tokens", green));
    const heartquakeLink: Link[] = [
        { name: "Lives Image via Flaticon", url: "https://cdn-icons-png.flaticon.com/128/210/210545.png" }
    ];
    popup.appendChild(createLinkList(heartquakeLink));

    // Section 5: Soundwave Sizzle
    popup.appendChild(createHeading("Soundwave Sizzle", green));
    const soundLinks: Link[] = [
        { name: "Menu Click sound via Pixabay", url: "https://pixabay.com/users/pixabay-1/" },
        { name: "Menu Music via Pixabay", url: "https://pixabay.com/users/sergequadrado-24990007/" },
        { name: "Game Music via Pixabay", url: "https://pixabay.com/users/xtremefreddy-32332307/" },
        { name: "Item selected sound via Pixabay", url: "https://pixabay.com/users/pixabay-1" },
        { name: "Lost Life sound via Pixabay", url: "https://pixabay.com/users/driken5482-45721595/" },
        { name: "Warning Sound via Pixabay", url: "https://pixabay.com/sound-effects/emergency-alarm-with-reverb-29431/" }
    ];
    popup.appendChild(createLinkList(soundLinks));

    return popupID;
};

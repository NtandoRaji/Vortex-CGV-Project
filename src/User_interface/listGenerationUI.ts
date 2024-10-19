import { Item, getRandomItems,displayItems, items } from '../constructs/itemManager';


// Function to generate and display grocery items
export function generateAndDisplayGroceryItems(containerId: string, count: number): void {
    // Create the list container
    const list = document.createElement("div");
    list.id = containerId;
    list.style.position = "absolute";
    list.style.top = "10%";
    list.style.right = "1%";
    list.style.background = "white";
    list.style.width = "20%";
    list.style.fontFamily = "Arial, sans-serif";
    list.style.borderRadius = "8px";

    // Get random items
    const randomItems: Item[] = getRandomItems(items, count);
    
    // Display the items in the specified container
    displayItems(list.id, randomItems);
    
    // Append the list to the document body
    document.body.appendChild(list);
}

// Function to update the displayed items to have strikethrough when received
export function updateList(containerId: string, receivedItem: string): boolean {
    const container = document.getElementById(containerId);
    let itemFound = false; // Track whether the item was found

    if (container) {
        // Find all item divs in the container
        const itemDivs = container.getElementsByClassName("item");
        Array.from(itemDivs).forEach(itemDiv => {
            // Get the paragraph element within the item div
            const nameElement = itemDiv.querySelector("p");
            if (nameElement && nameElement.textContent) {
                // Check if the item name matches the received item
                if (nameElement.textContent.trim() === receivedItem) { // Compare directly
                    // Apply strikethrough style
                    nameElement.style.textDecoration = 'line-through';
                    itemFound = true; // Mark as found
                }
            }
        });
    }

    return itemFound; // Return whether the item was found
}
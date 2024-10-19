import { Item, getRandomItems,displayItems, items } from './itemManager';

// Function to generate and display grocery items
export function generateAndDisplayGroceryItems(containerId: string, count: number): void {
    // Get a reference to the container where items will be displayed
    const container = document.getElementById(containerId);
    
    if (container) {
        // Get random items
        const randomItems: Item[] = getRandomItems(items, count);
        
        // Display the items in the specified container
        displayItems(containerId,randomItems);
    }
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








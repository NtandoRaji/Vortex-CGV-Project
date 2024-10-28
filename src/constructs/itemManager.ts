// Define the Item type
export type Item = {
    name: string;
    image: string; // Path to the image (PNG)
};

// Create an array to store the items
export const items: Item[] = [
    { name: "Aloe Bodywash", image: "icons/aloe_bodywash.png" },
    {name: "Beet", image:"icons/beet.png"},
    { name: "Banana", image: "icons/banana.png" },
    {name: "Broccoli", image:"icons/broccoli.png"},
    { name: "BBQ Sauce", image: "icons/bbq_sauce.png" },
    { name: "Can of Beans", image: "icons/beans_can.png" },
    { name: "Can of Beets", image: "icons/beets_can.png" },
    { name: "Caramel Cereal", image: "icons/caramel_cereal.png" },
    { name: "Carrot", image: "icons/carrot.png" },
    { name: "Can of Carrots", image: "icons/carrots_can.png" },
    { name: "Cheese Pizza", image: "icons/cheese_pizza.png" },
    { name: "Cola", image: "icons/cola.png" },
    { name: "Can of Corn", image: "icons/corn_can.png" },
    { name: "Cream Soda", image: "icons/cream_soda.png" },
    { name: "Chocolate Ice Cream", image: "icons/chocolate_ice_cream.png" },
    {name: "Eggplant", image:"icons/eggplant.png"},
    { name: "Fish", image: "icons/fish.png" },
    { name: "Fruit Cereal", image: "icons/fruit_cereal.png" },
    { name: "Full Milk", image: "icons/full_milk.png" },
    { name: "Gentle Bodywash", image: "icons/gentle_bodywash.png" },
    { name: "Ginger Ale", image: "icons/ginger_ale.png" },
    { name: "Green Apple", image: "icons/green_apple.png" },
    {name: "Green Pepper", image:"icons/green_pepper.png"},
    { name: "Jelly", image: "icons/jelly.png" },
    { name: "Lemon Bodywash", image: "icons/lemon_bodywash.png" },
    { name: "Lemon Twist", image: "icons/lemon_twist.png" },
    { name: "Low Fat Milk", image: "icons/low_fat_milk.png" },
    { name: "Mayonnaise", image: "icons/mayo_sauce.png" },
    { name: "Meatball Pizza", image: "icons/meatball_pizza.png" },
    { name: "Mens Bodywash", image: "icons/mens_bodywash.png" },
    { name: "Mustard Sauce", image: "icons/mustard_sauce.png" },
    { name: "Mint Ice Cream", image: "icons/mint_ice_cream.png" },
    { name: "Nutella", image: "icons/nutella.png" },
    { name: "Oat Bodywash", image: "icons/oat_bodywash.png" },
    { name: "Oat Milk", image: "icons/oat_milk.png" },
    { name: "Onion", image: "icons/onion.png" },
    { name: "Orange Bodywash", image: "icons/orange_bodywash.png" },
    { name: "Orange Twist", image: "icons/orange_twist.png" },
    { name: "Orange", image: "icons/orange.png" },
    { name: "Orange Pepper", image: "icons/orange_pepper.png" },
    { name: "Peanut Butter", image: "icons/peanut_butter.png" },
    { name: "Pepperoni Pizza", image: "icons/pepperoni_pizza.png" },
    { name: "Peps C", image: "icons/peps_c.png" },
    { name: "Potato", image: "icons/potato.png" },
    { name: "Purple Pepper", image: "icons/purple_pepper.png" },
    { name: "Red Apple", image: "icons/red_apple.png" },
    { name: "Rose Bodywash", image: "icons/rose_bodywash.png" },
    { name: "Red Pepper", image: "icons/red_pepper.png" },
    { name: "Sausage", image: "icons/sausage.png" },
    { name: "Soy Milk", image: "icons/soy_milk.png" },
    { name: "Sparberry", image: "icons/sparberry.png" },
    { name: "Sprite", image: "icons/sprite.png" },
    { name: "Strawberry Ice Cream", image: "icons/strawberry_ice_cream.png" },
    { name: "Strawberry Cereal", image: "icons/strawberry_cereal.png" },
    { name: "Tomato Sauce", image: "icons/tomato_sauce.png" },
    { name: "Tomato", image: "icons/tomato.png" },
    { name: "Vegetarian Pizza", image: "icons/veg_pizza.png" },
    { name: "Vanilla Ice Cream", image: "icons/vanilla_ice_cream.png" },
    { name: "Yeast Spread", image: "icons/yeast_spread.png" },
    { name: "Yellow Pepper", image: "icons/yellow_pepper.png" },
    {name: "Bergamot Bodycream", image:"icons/bergamot_bodycream.png"},
    {name: "Peach Bodycream", image:"icons/peach_bodycream.png"},
    {name: "Mint Bodycream", image:"icons/mint_bodycream.png"},
    {name: "Plum Bodycream", image:"icons/plum_bodycream.png"},
    {name: "Musk Bodycream", image:"icons/musk_bodycream.png"},
    {name: "Lemongrass Bodycream", image:"icons/lemongrass_bodycream.png"},
    {name: "Gentle Bodycream", image:"icons/gentle_bodycream.png"},
    {name: "Cherry Bodycream", image:"icons/cherry_bodycream.png"}
];

// Function to randomize and select a certain number of items
export function getRandomItems(items: Item[], count: number): Item[] {
    if (count > items.length) {
        throw new Error("Count exceeds number of available items.");
    }

    const availableItems = [...items]; // Create a copy to avoid mutating the original array
    const selectedItems: Item[] = [];

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const [selectedItem] = availableItems.splice(randomIndex, 1); // Remove and get the item
        selectedItems.push(selectedItem); // Add to the selected items
    }


    return selectedItems;
}

// Function to display items on the page
export function displayItems(containerId: string, items: Item[]): void {
    const container = document.getElementById(containerId);
    if (container) {
        // Clear any existing items
        container.innerHTML = '';

        items.forEach(item => {
            // Create a div for each item
            //console.log(item.name);
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

               // Set styles for flexbox layout
               itemDiv.style.display = 'flex'; // Enable flexbox
               itemDiv.style.flexDirection = 'row'; // Stack children vertically
               itemDiv.style.gap = '2%';
               itemDiv.style.alignItems = 'center'; // Center children horizontally
               itemDiv.style.margin = '10px'; // Space between items

            // Create an img element for the image
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.style.width= '14%';
            img.style.height= '14%';
            img.style.borderRadius = '8px';


            // Create a p element for the name
            const name = document.createElement("p");
            name.textContent = item.name;

            // Append image and name to the item div
            itemDiv.appendChild(img);
            itemDiv.appendChild(name);

            // Append the item div to the container
            container.appendChild(itemDiv);
        });
    }
}

// { name: "Lilac Bodywash", image: "icons/lilac_bodywash.png" },
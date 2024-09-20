const productContainer = document.getElementById("containerCards");
const API_URL = "https://fakestoreapi.com/products";

const fetchProducts = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
};

let shoppingCart = {};

const addItemToCart = (item, quantity) => {
    if (shoppingCart[item.id]) {
        shoppingCart[item.id].quantity += quantity;
    } else {
        shoppingCart[item.id] = { ...item, quantity };
    }
    updateShoppingCartDisplay();
};

const removeItemFromCart = (itemId) => {
    delete shoppingCart[itemId];
    updateShoppingCartDisplay();
};

const updateShoppingCartDisplay = () => {
    const cartItemsList = document.getElementById("cartItems");
    cartItemsList.innerHTML = "";
    let totalAmount = 0;

    for (const itemId in shoppingCart) {
        const item = shoppingCart[itemId];
        const listItem = document.createElement("div");
        listItem.textContent = `${item.title} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
        
        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.addEventListener("click", () => removeItemFromCart(itemId));
        
        listItem.appendChild(removeButton);
        cartItemsList.appendChild(listItem);
        totalAmount += item.price * item.quantity;
    }

    const totalListItem = document.createElement("div");
    totalListItem.textContent = `Total: $${totalAmount.toFixed(2)}`;
    totalListItem.style.fontWeight = 'bold';
    cartItemsList.appendChild(totalListItem);
};

const clearCart = () => {
    shoppingCart = {};
    updateShoppingCartDisplay();
};

const createProductCard = (item) => {
    const card = document.createElement("div");
    card.classList.add("card-products");

    const productTitle = document.createElement("h1");
    productTitle.textContent = item.title;

    const productImage = document.createElement("img");
    productImage.src = item.image;
    productImage.alt = item.category;

    const productDescription = document.createElement("p");
    productDescription.textContent = item.description;

    const priceButton = document.createElement("button");
    priceButton.classList.add("price-button");
    priceButton.textContent = "$" + item.price;

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = 1;
    quantityInput.min = 1;

    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Agregar al carrito";
    addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value, 10);
        addItemToCart(item, quantity);
    });

    card.append(productTitle, productImage, productDescription, priceButton, quantityInput, addToCartBtn);
    productContainer.appendChild(card);
};

const displayProducts = async () => {
    const products = await fetchProducts(API_URL);
    products.forEach(createProductCard);
};

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (Object.keys(shoppingCart).length > 0) {
        alert(`Has procedido al pago con ${Object.keys(shoppingCart).length} productos en tu carrito.`);
        clearCart();
    } else {
        alert("Tu carrito de compras está vacío.");
    }
});

// Cargar productos al inicio
displayProducts();
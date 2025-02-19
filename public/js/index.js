const socket = io();

const newProductForm = document.getElementById("newProductForm");
const productsList = document.getElementById("productsList");

newProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(newProductForm);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });
    // Enviar el producto al servidor vía websocket
    socket.emit("newProduct", productData);
    newProductForm.reset();
});

// Cuando se añade un producto, se agrega a la lista con un botón de eliminar
socket.on("productAdded", (newProduct) => {
    productsList.innerHTML += `
        <li data-id="${newProduct.id}">
            ${newProduct.title} - ${newProduct.price} 
            <button class="deleteBtn" data-id="${newProduct.id}">Eliminar</button>
        </li>`;
});

// Escuchar el evento de eliminación y remover el elemento del DOM
socket.on("productDeleted", (deletedProductId) => {
    const productElement = document.querySelector(`li[data-id="${deletedProductId}"]`);
    if (productElement) {
        productElement.remove();
    }
});

// Delegación de eventos para manejar la eliminación de productos
productsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        const productId = e.target.dataset.id;
        socket.emit("deleteProduct", parseInt(productId));
    }
});

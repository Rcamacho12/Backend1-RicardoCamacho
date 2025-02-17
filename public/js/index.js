const socket = io();

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const productData = {}
    formData.forEach((value, key) => {
        productData[key] = value;
    });
// enviamos el producto al servidor
    socket.emit("newProduct", product);
    productForm.reset();
});
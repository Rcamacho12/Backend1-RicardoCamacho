const socket = io();

// Formulario para agregar producto
const newProductForm = document.getElementById("newProductForm");
const productsList = document.getElementById("productsList");

newProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(newProductForm);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = value;
  });
  socket.emit("newProduct", productData);
  newProductForm.reset();
});

// Escuchar el evento cuando se agrega un producto en tiempo real
socket.on("productAdded", (newProduct) => {
  const li = document.createElement("li");
  li.dataset.id = newProduct._id;
  li.innerHTML = `
    ${newProduct.title} - $${newProduct.price}
    <button class="deleteBtn" data-id="${newProduct._id}">Eliminar</button>
  `;
  productsList.appendChild(li);
});

// Escuchar el evento de eliminación
socket.on("productDeleted", (deletedProductId) => {
  const liToRemove = document.querySelector(`li[data-id="${deletedProductId}"]`);
  if (liToRemove) {
    liToRemove.remove();
  }
});

// Delegación de eventos para eliminar producto
productsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const productId = e.target.dataset.id;
    socket.emit("deleteProduct", productId);
  }
});

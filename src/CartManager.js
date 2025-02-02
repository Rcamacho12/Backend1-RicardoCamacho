// CartManager.js
import fs from "fs";

class CartManager {
  constructor(pathFile) {
    // Ruta del archivo donde se almacenan los carritos
    this.pathFile = pathFile;
  }

  /**
   * Obtiene todos los carritos desde el archivo JSON.
   * Si el archivo no existe, lo crea con un arreglo vacío.
   */
  getCarts = async () => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      const data = JSON.parse(fileData);
      return data;
    } catch (error) {
      if (error.code === "error al obtener los carritos") {
        await fs.promises.writeFile(this.pathFile, "[]", "utf-8");
        return [];
      }
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  };

  /**
   * Obtiene un carrito por su ID.
   */
  getCartById = async (id) => {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id) || null;
  };

  /**
   * Crea un carrito nuevo con la estructura: { id: <número>, products: [] }
   */
  createCart = async () => {
    try {
      const carts = await this.getCarts();
      const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  };

  /**
   * Agrega un producto a un carrito identificado por cartId.
   * Si el producto ya existe en el carrito, incrementa su cantidad.
   */
  addProductToCart = async (cartId, productId) => {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id === cartId);
      if (index === -1) {
        throw new Error("Carrito no encontrado");
      }
      const cart = carts[index];
      const prodIndex = cart.products.findIndex((p) => p.id === productId);
      if (prodIndex === -1) {
        cart.products.push({ id: productId, quantity: 1 });
      } else {
        cart.products[prodIndex].quantity++;
      }
      carts[index] = cart;
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  };
}

export default CartManager;

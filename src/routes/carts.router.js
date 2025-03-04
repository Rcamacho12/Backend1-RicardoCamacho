// src/routes/carts.routes.js
import express from "express";
import Cart from "../models/cart.moder.js";

const cartsRouter = express.Router();

// POST /api/carts (crear un carrito vacío)
cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/carts/:cid (obtener carrito por ID con populate)
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/carts/:cid/products/:pid (agregar producto al carrito)
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const updatedCart = await cart.save();
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid (actualizar cantidad o eliminar producto)
// Si la cantidad enviada es 0 o menor, se elimina el producto del carrito.
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado en el carrito" });
    }

    if (quantity <= 0) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    const updatedCart = await cart.save();
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid (eliminar un producto específico del carrito)
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado en el carrito" });
    }
    cart.products.splice(productIndex, 1);
    const updatedCart = await cart.save();
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT /api/carts/:cid (actualizar el carrito completo con un nuevo array de productos)
cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // Se espera un array de { product, quantity }
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ status: "error", message: "Se requiere un array de productos" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = products;
    const updatedCart = await cart.save();
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /api/carts/:cid (eliminar carrito completo)
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(cid);
    if (!deletedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: deletedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartsRouter;

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

// POST /api/carts/:cid/product/:pid (agregar producto al carrito)
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
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

// PUT /api/carts/:cid/product/:pid (actualizar cantidad o eliminar)
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
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
      // Eliminar producto del carrito
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

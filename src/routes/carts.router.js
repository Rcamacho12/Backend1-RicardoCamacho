
import express from "express";
import CartManager from "../CartManager.js";

const cartRouter = express.Router();

// Instanciar CartManager pasando la ruta al archivo JSON
const cartManager = new CartManager("./src/data/carts.json");

/**
 * Endpoint: POST "/"
 * Crea un carrito nuevo con la estructura: { id: <número>, products: [] }
 */
cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint: GET "/:cid"
 * Obtiene el carrito cuyo id es :cid
 */
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint: POST "/:cid/product/:pid"
 * Agrega el producto identificado por :pid al carrito identificado por :cid.
 */
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

export default cartRouter;


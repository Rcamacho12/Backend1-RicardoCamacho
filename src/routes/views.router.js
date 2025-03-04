// src/routes/views.router.js
import express from "express";
import Product from "../models/user.model.js";
import Cart from "../models/cart.moder.js";

const viewsRouter = express.Router();

// Vista home con lista de productos
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("home", { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Vista realTimeProducts (websockets)
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva vista para mostrar el carrito por ID
viewsRouter.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Nueva ruta para el detalle de un producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


export default viewsRouter;

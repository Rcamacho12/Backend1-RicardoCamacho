import express from "express";
import Product from "../models/user.model.js";

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

export default viewsRouter;

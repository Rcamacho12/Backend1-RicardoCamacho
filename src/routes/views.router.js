import express from 'express';
import ProductManager from '../ProductManager.js';


const viewsRouter = express.Router();
const productManager = new ProductManager('./src/data/products.json');

viewsRouter.get('/', async (req, res) => {
    try {
        const products =  await productManager.getProducts();
        res.render('Home', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default viewsRouter;
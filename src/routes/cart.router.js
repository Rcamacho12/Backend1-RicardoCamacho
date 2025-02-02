import express from 'express';
import CartManager from '../CartManager.js';

// Instancia del router de Express para manejar las rutas    
const cartRouter = express.Router();    
// Instancia del manejador de carritos        
const cartManager = new CartManager("./src/data/cart.json");    

// Ruta para obtener todos los carritos
cartRouter.get('/', async (req, res) => {
    try {
        const data = await cartManager.getCarts();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los carritos', error: error.message });
    }
});

// Ruta para obtener un carrito por ID
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).send({ message: `Carrito con ID ${req.params.cid} no encontrado` });
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el carrito', error: error.message });
    }
});

// Ruta para agregar un producto al carrito
cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).send({ message: `Carrito con ID ${req.params.cid} no encontrado` });
        }
        res.status(200).send({ message: 'Producto agregado al carrito con éxito', cart });
    } catch (error) {
        res.status(400).send({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
});

// Ruta para eliminar un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).send({ message: `Carrito con ID ${req.params.cid} no encontrado` });
        }
        res.status(200).send({ message: 'Producto eliminado del carrito con éxito', cart });
    } catch (error) {
        res.status(400).send({ message: 'Error al eliminar el producto del carrito', error: error.message });
    }
})

export default cartRouter;
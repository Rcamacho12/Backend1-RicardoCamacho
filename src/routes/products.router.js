import express from 'express';
import ProductManager from '../ProductManager.js';

// Instancia del router de Express para manejar las rutas
const productsRouter = express.Router();
// Instancia del manejador de productos
const productManager = new ProductManager("./src/data/products.json");

// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const data = await productManager.getProducts();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
    }
});

// Ruta para obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send({ message: `Producto con ID ${req.params.pid} no encontrado` });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el producto', error: error.message });
    }
});

// Ruta para agregar un producto
productsRouter.post('/', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).send({ message: 'Producto agregado con éxito', product });
    } catch (error) {
        res.status(400).send({ message: 'Error al agregar el producto', error: error.message });
    }
});

// Ruta para actualizar un producto
productsRouter.put('/:pid', async (req, res) => {
    try {
        const product = await productManager.updateProduct(req.params.pid, req.body);
        if (!product) {
            return res.status(404).send({ message: `Producto con ID ${req.params.pid} no encontrado` });
        }
        res.status(200).send({ message: 'Producto actualizado con éxito', product });
    } catch (error) {
        res.status(400).send({ message: 'Error al actualizar el producto', error: error.message });
    }
});

// Ruta para eliminar un producto
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const product = await productManager.deleteProduct(req.params.pid);
        if (!product) {
            return res.status(404).send({ message: `Producto con ID ${req.params.pid} no encontrado` });
        }
        res.status(200).send({ message: 'Producto eliminado con éxito', product });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el producto', error: error.message });
    }
});

export default productsRouter;

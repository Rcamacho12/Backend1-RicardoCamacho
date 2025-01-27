import express from 'express';
import ProductManager from '../ProductManager';

//instanciamos el router de express para manejar las rutas
const productsRouter = express.Router();
//instanciamos el manejador de nuestro archivo de productos
const productManager = new ProductManager('./src/products.json');

//ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
    //Leer el archivo de productos y devolverlos
    try {
        const data = await productManager.getProducts();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Error al leer el archivo' });
    }
});

//ruta para obtener un producto por id  
productsRouter.get('/:pid', async (req, res) => {
    //Leer el archivo de productos y devolverlos
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);  
});

//ruta para agregar un producto
productsRouter.post('/', async (req, res) => {
    //Leer el archivo de productos y devolverlos
    const product = await productManager.addProduct(req.body);
    res.json(product);  
});

//ruta para modificar un producto 
productsRouter.put('/:pid', async (req, res) => {
    //Leer el archivo de productos y devolverlos
    const product = await productManager.updateProduct(req.params.pid, req.body);
    res.json(product);  
}); 

//ruta para borrar un producto  
productsRouter.delete('/:pid', async (req, res) => {
    //Leer el archivo de productos y devolverlos    
    const product = await productManager.deleteProduct(req.params.pid);
    res.json(product);  
});     

export default productsRouter;

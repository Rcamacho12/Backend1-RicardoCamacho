import express from 'express';
import ProductManager from '../ProductManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

/**
 * Middleware para validar que en el body se envíen los campos obligatorios
 * Obligatorios: title, description, code, price, stock y category
 */
const validateProduct = (req, res, next) => {
  const { title, description, code, price, stock, category } = req.body;
  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).json({
      message: 'Campos obligatorios faltantes. Se requieren: title, description, code, price, stock y category'
    });
  }
  next();
};

// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
  try {
    const data = await productManager.getProducts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});

// Ruta para obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
  try {
    // Convertir el parámetro de la ruta a número
    const product = await productManager.getProductById(Number(req.params.pid));
    if (!product) {
      return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
});

// Ruta para agregar un producto, utilizando el middleware de validación
productsRouter.post('/', validateProduct, async (req, res) => {
  try {
    // Desestructuramos thumbnails y el resto de los campos
    const { thumbnails, ...productData } = req.body;
    
    // Preparamos el objeto del producto a agregar, asignando valores por defecto
    const productToAdd = {
      ...productData,
      status: true, // Valor por defecto
      thumbnails: Array.isArray(thumbnails) ? thumbnails : [] // Si thumbnails no es un arreglo, se asigna un arreglo vacío
    };

    const product = await productManager.addProduct(productToAdd);
    res.status(201).json({ message: 'Producto agregado con éxito', product });
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar el producto', error: error.message });
  }
});

// Ruta para actualizar un producto, utilizando el middleware de validación
productsRouter.put('/:pid', validateProduct, async (req, res) => {
  try {
    // Convertir el parámetro de la ruta a número
    const product = await productManager.setProductById(Number(req.params.pid), req.body);
    if (!product) {
      return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado` });
    }
    res.status(200).json({ message: 'Producto actualizado con éxito', product });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
});

// Ruta para eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
  try {
    // Convertir el parámetro de la ruta a número
    const product = await productManager.deleteProductById(Number(req.params.pid));
    if (!product) {
      return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado` });
    }
    res.status(200).json({ message: 'Producto eliminado con éxito', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});

export default productsRouter;

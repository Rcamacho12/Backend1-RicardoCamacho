// src/routes/products.router.js
import express from 'express';
import Product from '../models/user.model.js'; // Modelo de producto basado en Mongoose

const productsRouter = express.Router();

// GET /api/products: con paginación, ordenamiento y filtrado
productsRouter.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir filtro según query (si es "available" filtra stock > 0; sino, se asume categoría)
    let filter = {};
    if (query) {
      if (query.toLowerCase() === "available") {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    // Construir opciones de ordenamiento
    let sortOptions = {};
    if (sort) {
      sortOptions.price = sort.toLowerCase() === "asc" ? 1 : -1;
    }

    // Opciones de paginación para mongoose-paginate-v2
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      lean: true, // devuelve documentos planos
    };

    const result = await Product.paginate(filter, options);

    // Construir enlaces para navegación (prevLink y nextLink)
    const buildLink = (targetPage) =>
      `/api/products?limit=${limit}&page=${targetPage}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}` : ""}`;

    return res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
});

// GET /api/products/:pid: obtener producto por ID
productsRouter.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${req.params.pid} no encontrado`
      });
    }
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
});

// POST /api/products: agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al agregar el producto",
      error: error.message,
    });
  }
});

// PUT /api/products/:pid: actualizar un producto
productsRouter.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${req.params.pid} no encontrado`
      });
    }
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
});

// DELETE /api/products/:pid: eliminar un producto
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: `Producto con ID ${req.params.pid} no encontrado`
      });
    }
    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el producto",
      error: error.message,
    });
  }
});

export default productsRouter;

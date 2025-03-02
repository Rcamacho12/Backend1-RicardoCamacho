import express from "express";
import Product from "../models/user.model.js";

const productsRouter = express.Router();

// GET /api/products (paginación, filtro, orden)
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir el filtro
    let filter = {};
    if (query) {
      // Si "available", filtramos stock > 0
      if (query.toLowerCase() === "available") {
        filter.stock = { $gt: 0 };
      } else {
        // De lo contrario, asumimos que query es una categoría
        filter.category = query;
      }
    }

    // Ordenamiento
    let sortOptions = {};
    if (sort) {
      sortOptions.price = sort.toLowerCase() === "asc" ? 1 : -1;
    }

    // Opciones de paginación
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    // Construcción de prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const buildLink = (targetPage) =>
      `${baseUrl}?page=${targetPage}&limit=${limit}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}` : ""}`;

    const response = {
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
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/products/:pid (obtener producto detallado)
productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/products (crear un producto)
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT /api/products/:pid (actualizar producto)
productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /api/products/:pid (eliminar producto)
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default productsRouter;


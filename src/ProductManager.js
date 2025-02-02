import fs from "fs";

class ProductManager {
  constructor(pathFile) {
    // Ruta del archivo donde se almacenan los productos
    this.pathFile = pathFile;
  }

  // Método para obtener todos los productos
  getProducts = async () => {
    try {
      // Leer el archivo de productos de manera asíncrona
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      // Parsear el contenido del archivo (string) a objeto JSON
      const data = JSON.parse(fileData);
      return data;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  };

  // Método para obtener un producto por su ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    return products.find(product => product.id === id) || null;
  };

  // Método para agregar un nuevo producto
  addProduct = async (product) => {
    const products = await this.getProducts();
    // Generar un ID autoincremental: si hay productos, asignar el ID del último producto + 1, sino 1
    const newProduct = { id: products.length ? products[products.length - 1].id + 1 : 1, ...product };
    products.push(newProduct);
    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return newProduct;
  };

  // Método para actualizar un producto por su ID
  setProductById = async (id, updatedFields) => {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;
    // Actualizar el producto asegurando que el ID no cambie
    products[index] = { ...products[index], ...updatedFields, id };
    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return products[index];
  };

  // Método para eliminar un producto por su ID
  deleteProductById = async (id) => {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;
    // Eliminar el producto y almacenar el producto eliminado para retornarlo
    const removedProduct = products.splice(index, 1)[0];
    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return removedProduct;
  };
}

export default ProductManager;

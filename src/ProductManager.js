import fs from "fs";

class ProductManager{
    
    constructor(pathFile){
    this.pathFile = pathFile;
    }
    getProducts = async() => {
        try {
            //Leer el archivo de productos y lo guardamos
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            //parseamos el archivo a un objeto
            const data = JSON.parse(fileData);
            return data;

        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    // getProductById = () => {}
    // addProduct = () => {}
    // setProductById = () => {}
    // deleteProductById = () => {}
}

export default ProductManager;
import fs from "fs";
class ProductManager{
    //propiedades y métodos para obtener, crear, editar y eliminar un producto.
    /*
    {
        id: "",
        title: "",
        description: ""
        price: "",
        thumbnail: "",
        code: "",
        stock: 0
    }
    */
    constructor(pathFile){
    this.pathFile = pathFile;
    }
    getProducts = async() => {
        try {
            //Leer el archivo de productos y lo guardamos
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            return fileData;
        } catch (error) {
            console.error("Error al leer el archivo");
        }
    }

    addProduct = () => {}
    getProductById = () => {}
    setProductById = () => {}
    deleteProductById = () => {}
}

export default ProductManager;
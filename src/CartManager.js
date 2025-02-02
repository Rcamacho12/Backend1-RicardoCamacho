
class CartManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }
    getCart = async () => {
        try {
            //Leer el archivo de productos y lo guardamos
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            //parseamos el archivo a un objeto
            const data = JSON.parse(fileData);
            return data;            
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    
    
    }
}
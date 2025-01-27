import express from "express";
import productsRouter from "./routes/product.router";

const app = express();
//puerto de nuestro servidor
const PORT = 8080;

//habilitamos poder recibir informacion en formato json
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
})

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

app.get("/products", (req, res) => {
    //Leer el archivo de productos y devolverlos
    })
    
    app.get("/products/:pid", (req, res) => {
    //Capturar el id del producto, filtrar los productos y retornar solamente el que coincida en id
})
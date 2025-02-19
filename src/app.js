import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//puerto de nuestro servidor
const PORT = 8080;

//habilitamos poder recibir informacion en formato json
app.use(express.json());

//habilitamos la carpeta publica
app.use(express.static("public"));

//endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//websockets
const productManager = new ProductManager("./src/data/products.json");
io.on("connection", (socket) => {
    console.log("usuario conectado");

    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.log("error al agregar producto");
        }
    });
    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProductById(productId);
            // Emitir el id del producto eliminado para que los clientes actualicen su vista
            io.emit("productDeleted", productId);
        } catch (error) {
            console.log("error al eliminar producto", error);
        }
    });
});

//iniciamos nuestro servidor
server.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto http://localhost:${PORT}`);
});
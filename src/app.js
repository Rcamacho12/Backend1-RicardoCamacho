import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";

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

//endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//iniciamos nuestro servidor
app.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto http://localhost:${PORT}`);
});
// app.js
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import path from "path";

import connectDB from "../public/js/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Inicialización
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conexión a la BD
connectDB();

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src/public")));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Websockets
io.on("connection", (socket) => {
  console.log("Usuario conectado vía Socket.IO");

  // Evento para agregar un producto (en tiempo real)
  socket.on("newProduct", async (productData) => {
    try {
      // Importamos dinámicamente el modelo para no tener problemas de scope
      const { default: Product } = await import("./src/models/Product.js");
      const newProduct = await Product.create(productData);
      // Emitimos a todos los clientes el producto recién agregado
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  // Evento para eliminar un producto (en tiempo real), si fuera necesario
  socket.on("deleteProduct", async (productId) => {
    try {
      const { default: Product } = await import("./src/models/Product.js");
      await Product.findByIdAndDelete(productId);
      // Notificamos a todos los clientes que se ha eliminado un producto
      io.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

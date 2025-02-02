import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
//puerto de nuestro servidor
const PORT = 8080;

//habilitamos poder recibir informacion en formato json
app.use(express.json());

//endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//iniciamos nuestro servidor
app.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto http://localhost${PORT}`);
});
import express from "express";
import productsRouter from "./routes/products.router.js";

const app = express();
//puerto de nuestro servidor
const PORT = 8080;

//habilitamos poder recibir informacion en formato json
app.use(express.json());

//endpoints
app.use("/api/products", productsRouter);

//iniciamos nuestro servidor
app.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto http://localhost${PORT}`);
});
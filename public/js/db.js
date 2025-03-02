// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Rcamacho:Rclwdkska12@ecomerce-cluster.xci56.mongodb.net/libreriaTemaUno?retryWrites=true&w=majority&appName=ecomerce-cluster", {
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
  }
};

export default connectDB;

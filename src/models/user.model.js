// src/models/user.model.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, default: "general" },
    thumbnail: { type: String, default: "" }  // Nuevo campo para la imagen
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);


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
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);

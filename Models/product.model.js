const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },  
    subtitle: String,
    image: {
      type:[String],
      required:true,
    },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: String,
    subcategory: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

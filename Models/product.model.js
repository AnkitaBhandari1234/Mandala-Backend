const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subname:{
      type:String,
      required:true,
    },
    slug: { type: String, required: true, unique: true },
    subtitle: String,
    image: {
      type: [String],
      required: true,
    },
    description:[String],
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: {
     type:String,
     required:true,
    },
overview:{
  type:String,
},
    subcategory:{
      type:String,
      required:true,
    },

    stock: {
    type: Number,
    required: true,
    default: 0, // Default to 0 stock if not specified
  },
  tags:{
    type:[String],
    
  },
  materials:{
    type:[String],
  },
    order: String,
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

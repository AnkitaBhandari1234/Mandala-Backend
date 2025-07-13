const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
name: String,
  price: Number,
  image: [String],
  category: String,
  subCategory: String,
  rating: Number,
  subtitle: String
  
},
{
  timestamps:true
}
);

module.exports = mongoose.model("Product", productSchema);

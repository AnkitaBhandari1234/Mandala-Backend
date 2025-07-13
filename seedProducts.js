
require("dotenv").config(); 
const mongoose = require("mongoose");
const Product = require("./Models/product.model");
const products = require("./Data/dummyProducts");

mongoose.connect(`${process.env.MONGODB_URL}`)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Dummy products added!");

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  });

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./Models/product.model");
const products = require("./Data/dummyProducts");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("MongoDB connected");

    // Clear existing data
    await Product.deleteMany({});
    console.log("Existing products deleted");

    // Insert new dummy products
    await Product.insertMany(products);
    console.log("Dummy products added!");

    // Disconnect
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    mongoose.disconnect();
  });

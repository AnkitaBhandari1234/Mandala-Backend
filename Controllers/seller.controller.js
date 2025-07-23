// backend/controllers/seller.controller.js
const Product = require("../Models/product.model");

// Get all products by logged-in seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add new product by seller
exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;
    productData.sellerId = req.user._id;  // assign seller

    // If you handle images via multer, attach req.file info here if needed
    if (req.file) {
      productData.image = [req.file.path]; // or handle multiple images
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: "Failed to add product", error: err.message });
  }
};

// Update product by seller
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    Object.assign(product, req.body);

    // handle image update if any via multer
    if (req.file) {
      product.image = [req.file.path];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Failed to update product", error: err.message });
  }
};

// Delete product by seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

// update stock
exports.updateStock = async (req, res) => {
  try {
       const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = Number(req.body.stock);
    await product.save();
    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

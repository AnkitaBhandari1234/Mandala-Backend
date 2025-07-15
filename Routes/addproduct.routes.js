// routes/product.route.js
const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");
const multer = require("multer");
const path = require("path");

const {
  requireAuth,
  verifyAdminOrSeller
} = require("../Middlewares/auth.middleware");

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/ProductImages/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add new product (only sellers)
router.post(
  "/",
  requireAuth,
  verifyAdminOrSeller,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, category, subcategory, description, stock } = req.body;

      const image = `/ProductImages/${req.file.filename}`;

      const newProduct = new Product({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        subtitle: description,
        image: [image],
        price,
        category,
        subcategory,
        stock,
        sellerId: req.user._id,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("Product upload failed:", err);
      res.status(500).json({ message: "Product creation failed" });
    }
  }
);

module.exports = router;

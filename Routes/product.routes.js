const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");

// GET /api/products?category=Clothing&subcategory=Shirts&minPrice=10&maxPrice=100&minRating=3
router.get("/", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      minRating
    } = req.query;

    const filter = {};

    // Category filter
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // case-insensitive match
    }

    // Subcategory filter
    if (subcategory) {
      filter.subcategory = { $regex: new RegExp(subcategory, "i") };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");

// GET /api/products?category=Clothing&subcategory=Shirts&minPrice=10&maxPrice=100&minRating=3
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, minRating } = req.query;

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

// GET product details by ID 
router.get("/:id", async (req, res) => {
  try {
    const productIdOrSlug = req.params.id;

    // Try finding by MongoDB _id first
    let product = null;
    if (productIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productIdOrSlug);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID :", error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/products/recommend
router.post("/recommend", async (req, res) => {
  try {
      const { tags = [], attributes = [], productId } = req.body;

    const filter = {
      $or: [
        { tags: { $in: tags } },
        { attributes: { $in: attributes } },
      ],
      _id: { $ne: productId }, // ✅ exclude the current product
    };

    const recommended = await Product.find(filter).limit(10); // limit if needed
    res.json(recommended);
  } catch (err) {
    console.error("Error recommending products:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;

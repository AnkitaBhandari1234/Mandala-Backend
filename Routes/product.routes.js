const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");
const { searchProducts} = require("../Controllers/product.controller")




// routes/productRoutes.js
router.get("/search", searchProducts);



router.get('/featured', async (req, res) => {
  try {
    // Find products where 'order' field exists and is not empty string
    const products = await Product.find({ 
      order: { $exists: true, $ne: "" } 
    }).limit(8);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});
// GET /api/products?category=Clothing&subcategory=Shirts&minPrice=10&maxPrice=100&minRating=3
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, minRating } = req.query;

    const filter = {};

    // Category filter
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // case-insensitive match
    }

    // Subcategory filter - supports multiple (comma-separated)
if (subcategory) {
  const subcategoryList = subcategory.split(",").map((s) => s.trim());
  filter.subcategory = { $in: subcategoryList };
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


router.post("/recommend", async (req, res) => {
  try {
    const { tags = [], attributes = [], productId } = req.body;

    // Step 1: Fetch all other products (excluding the current one)
    const allProducts = await Product.find({ _id: { $ne: productId } });

    // Step 2: Score products based on matching tags and attributes
    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // Count matching tags
      const matchingTags = product.tags?.filter((tag) => tags.includes(tag)) || [];
      score += matchingTags.length;

      // Count matching attributes
      const matchingAttributes = product.attributes?.filter((attr) =>
        attributes.includes(attr)
      ) || [];
      score += matchingAttributes.length;

      return { product, score };
    });

    // Step 3: Sort products by similarity score in descending order
    scoredProducts.sort((a, b) => b.score - a.score);

    // Step 4: Return top N (e.g., 10) most similar products
    const topRecommended = scoredProducts
      .filter((item) => item.score > 0) // Only return similar ones
      .slice(0, 10)
      .map((item) => item.product); // Return just the product data

    res.json(topRecommended);
  } catch (err) {
    console.error("Error recommending products:", err);
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;

const express = require('express');
const Product = require('../Models/product.model');
const router = express.Router();

// GET /api/products?category=Jewelry&subCategory=Necklaces&sort=price_asc
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    let query = Product.find(filter);

    // Sorting
    if (sort) {
      if (sort === 'price_asc') query = query.sort({ price: 1 });
      else if (sort === 'price_desc') query = query.sort({ price: -1 });
      else if (sort === 'rating_desc') query = query.sort({ rating: -1 });
      // Add other sorts as needed
    }

    const products = await query.exec();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

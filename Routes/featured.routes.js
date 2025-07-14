const express = require('express');
const Product = require('../Models/product.model');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { order } = req.query;
    const query = order ? { order } : {};
   const products = await Product.find({ order: { $exists: true, $ne: "" } })
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

module.exports = router;

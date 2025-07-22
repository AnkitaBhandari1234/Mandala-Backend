// controllers/productController.js
const Product = require("../Models/product.model");

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    console.log("Search keyword:", keyword);
     const regex = new RegExp(keyword, "i"); // case-insensitive

   const results = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { subcategory: regex }
      ]
       
    });

    console.log("Found products:", results.length);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
    searchProducts
};
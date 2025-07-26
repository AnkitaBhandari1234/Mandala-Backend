const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");
const multer = require("multer");
const path = require("path");

const {
  requireAuth,
  isAdminOrSeller,
  isSeller,
} = require("../Middlewares/auth.middleware");

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/ProductImages")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add new product (only sellers or admin)
router.post(
  "/",
  requireAuth,
  isAdminOrSeller,
  isSeller,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, category, subcategory, description,stock,subname } = req.body;

      if (!name || !price || !category || !description || !subname) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Product image is required" });
      }

      // Construct image URL relative to static folder served by Express
      const image = `ProductImages/${req.file.filename}`;

      // Generate slug, add timestamp suffix to avoid duplicates (optional)
      const slugBase = name.toLowerCase().trim().replace(/\s+/g, "-");
      const slug = `${slugBase}-${Date.now()}`;

      const newProduct = new Product({
        name,
        slug,
        subtitle: description,
        image: [image],  // assuming image is stored as array
        price,
        category,
        subcategory,
        stock,
        subname,
        sellerId: req.user._id,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("Product upload failed:", err.message);
      res.status(500).json({ message: "Product creation failed" });
    }
  }
);
// update product route

router.put(
  "/:id",
  requireAuth,
  isAdminOrSeller,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = { ...req.body };

      if (req.file) {
        updateFields.image = [`ProductImages/${req.file.filename}`];
      }

      const updated = await Product.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("Update error:", err.message);
      res.status(500).json({ message: "Product update failed" });
    }
  }
);


// routes/product.route.js

router.delete("/:id", requireAuth, isAdminOrSeller, async (req, res) => {
  console.log("Attempting to delete ID:", req.params.id); // ✅ ADD THIS
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

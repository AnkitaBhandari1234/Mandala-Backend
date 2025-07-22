// backend/routes/seller.routes.js
const express = require("express");
const router = express.Router();
const sellerController = require("../Controllers/seller.controller");
const { requireAuth, isSeller } = require("../Middlewares/auth.middleware");
const multer = require("multer");

// Multer config to handle image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/ProductImages/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.use(requireAuth, isSeller);

// Get all seller products
router.get("/products", sellerController.getSellerProducts);

// Add new product
router.post("/products", upload.single("image"), sellerController.addProduct);

// Update product
router.put("/products/:id", upload.single("image"), sellerController.updateProduct);

// Delete product
router.delete("/products/:id", sellerController.deleteProduct);

// update stocks
router.put("/products/:id/stock", requireAuth, isSeller,sellerController.updateStock);
module.exports = router;

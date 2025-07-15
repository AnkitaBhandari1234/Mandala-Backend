const express = require("express");
const router = express.Router();
const {
  requireAuth,
  verifySeller,
 
  verifyAdminOrSeller,
  verifyAdmin
} = require("../Middlewares/auth.middleware");

const {
  getDashboardInfo,
  getAllUsers,
  getSellerProducts
} = require("../Controllers/dashboard.controller");

// Dashboard info for admin or seller
router.get("/", requireAuth, verifyAdminOrSeller, getDashboardInfo);

// List of users - only admin can access
router.get("/users", requireAuth, verifyAdmin, getAllUsers);

router.get("/seller/products", requireAuth, verifySeller, getSellerProducts);

module.exports = router;

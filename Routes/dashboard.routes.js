const express = require("express");
const router = express.Router();
const {
  requireAuth,
  isSeller,
 
 isAdminOrSeller,
  isAdmin
} = require("../Middlewares/auth.middleware");

const {
  getDashboardInfo,
  getAllUsers,
  getSellerProducts
} = require("../Controllers/dashboard.controller");

// Dashboard info for admin or seller
router.get("/", requireAuth, isAdminOrSeller, getDashboardInfo);

// List of users - only admin can access
router.get("/users", requireAuth,isAdmin, getAllUsers);

router.get("/seller/products", requireAuth, isSeller, getSellerProducts);

module.exports = router;

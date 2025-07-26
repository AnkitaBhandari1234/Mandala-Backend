const express = require("express");
const router = express.Router();
const User = require("../Models/user.model");
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



// DELETE /api/dashboard/users/:id  (Soft Delete)
router.delete("/users/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Find user by ID first
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    // Mark user as deleted (soft delete)
    user.isDeleted = true;
    await user.save();

    res.json({ message: "User deleted successfully (soft delete)" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

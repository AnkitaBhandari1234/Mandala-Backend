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


// DELETE /api/dashboard/users/:id
router.delete("/dashboard/users/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

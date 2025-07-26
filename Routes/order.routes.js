const express = require("express");
const { getAllOrders, getOrderById,createOrder,getMyOrders,updateOrderStatus,getSellerOrders,deleteOrder, placeEsewaOrderAfterVerification } = require("../Controllers/order.controller.js");
const { requireAuth, isAdmin,isSeller } = require("../Middlewares/auth.middleware.js");

const router = express.Router();
// buyer creates order
router.post("/", requireAuth, createOrder);  

// admin view all orders
router.get("/all", requireAuth, isAdmin, getAllOrders);
// for login user if they purcgased any products 
router.get("/my",requireAuth, getMyOrders); 
// for esewa order placed in myorder
router.post("/esewa/place", requireAuth, placeEsewaOrderAfterVerification);

router.get("/seller", requireAuth, isSeller, getSellerOrders); // Seller
// admin view one order
router.get("/:id", requireAuth, isAdmin, getOrderById);
router.delete("/:id", requireAuth, isAdmin, deleteOrder);

// ** PATCH route to update order status by admin **
router.patch("/:id/status", requireAuth, isAdmin, updateOrderStatus);


module.exports = router;

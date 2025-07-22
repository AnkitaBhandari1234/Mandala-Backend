const express = require("express");
const { getAllOrders, getOrderById,createOrder,getMyOrders } = require("../Controllers/order.controller.js");
const { requireAuth, isAdmin } = require("../Middlewares/auth.middleware.js");

const router = express.Router();
// buyer creates order
router.post("/", requireAuth, createOrder);  
// admin view all orders
router.get("/all", requireAuth, isAdmin, getAllOrders);
// for login user if they purcgased any products
router.get("/my",requireAuth, getMyOrders); 
// admin view one order
router.get("/:id", requireAuth, isAdmin, getOrderById);


module.exports = router;

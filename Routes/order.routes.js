const express = require("express");
const { getAllOrders, getOrderById,createOrder } = require("../Controllers/order.controller.js");
const { requireAuth, isAdmin } = require("../Middlewares/auth.middleware.js");

const router = express.Router();
router.post("/", requireAuth, createOrder);  
router.get("/all", requireAuth, isAdmin, getAllOrders);
router.get("/:id", requireAuth, isAdmin, getOrderById);

module.exports = router;

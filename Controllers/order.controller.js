const Order = require("../Models/order.model");

// 🟩 GET ALL ORDERS (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 GET SINGLE ORDER BY ID (Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// create a new order (Buyer)
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id, // user from token in requireAuth middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      orderStatus: "Pending",
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// 🟩 GET ORDERS FOR LOGGED-IN USER
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user's orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  createOrder,
  getMyOrders,
};

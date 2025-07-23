const Order = require("../Models/order.model");
const Product = require("../Models/product.model");

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
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 CREATE ORDER (Buyer)
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const populatedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");

        return {
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          product: item.product,
          seller: product.seller,
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 GET ORDERS FOR LOGGED-IN USER (Buyer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user's orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 UPDATE ORDER STATUS (Admin or Seller)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const allowedStatuses = ["Pending",  "Shipped", "Delivered"];
  if (!allowedStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 GET ORDERS FOR SELLER
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ "orderItems.seller": sellerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching seller orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ DELETE ORDER (Admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne(); // or use await Order.findByIdAndDelete(req.params.id)

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getSellerOrders,
  deleteOrder,
};

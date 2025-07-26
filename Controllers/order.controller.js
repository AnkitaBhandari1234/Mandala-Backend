const Order = require("../Models/order.model");
const Product = require("../Models/product.model");
const Transaction = require("../Models/transcation.model");


// 🟩 GET ALL ORDERS (Admin) excluding delted user products
const getAllOrders = async (req, res) => {
  try {
    // Find orders with populated user info
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name email isDeleted",
        match: { isDeleted: false }, // This filters out deleted users
      })
      .sort({ createdAt: -1 });

    // Filter out orders with no user due to match condition
    const filteredOrders = orders.filter(order => order.user);

    res.json(filteredOrders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 GET SINGLE ORDER BY ID (Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 CREATE ORDER (COD)
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate and prepare order items + stock check
    const populatedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`
        });
      }
      populatedItems.push({
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: product.image,
        product: product._id,
        seller: product.seller,
      });
    }

    // Create order document
    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item.product,
        seller: item.seller,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Decrement stock for each product
    await Promise.all(
      populatedItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        });
      })
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 GET ORDERS FOR LOGGED-IN USER (Buyer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    
console.log("🟩 My Orders found:", orders.length);
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

  const allowedStatuses = ["Pending", "Shipped", "Delivered"];
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

// 🟩 PLACE ESEWA ORDER AFTER PAYMENT VERIFICATION
const placeEsewaOrderAfterVerification = async (req, res) => {
 console.log("ESewa placing order for user:", req.user); 
  const { transactionId, orderItems, shippingAddress, totalPrice } =
    req.body;

  if (
    !transactionId ||
    !orderItems ||
    !shippingAddress ||
    !totalPrice 
    
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verify transaction record exists and was successful
    const transaction = await Transaction.findOne({
      transaction_id: transactionId,
    });
    if (!transaction || transaction.status !== "Success") {
      return res
        .status(400)
        .json({ message: "Transaction not verified or failed" });
    }

    // Validate products and stock, prepare order items
    const populatedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error("Product not found");
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      populatedItems.push({
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: product.image,
        product: product._id,
        seller: product.seller,
      });
    }
console.log("Placing order for user:", req.user);
    // Create order document for eSewa
    const order = await Order.create({
      user: req.user?._id,
      orderItems: populatedItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item.product,
        seller: item.seller,
      })),
      shippingAddress,
      paymentMethod: "esewa",
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        transactionId: transaction.transaction_id,
        status: transaction.status,
        paidAt: new Date(),
      },
    });
    
console.log("✅ Order successfully placed:", order);


    // Decrement stock for each product
    await Promise.all(
      populatedItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        });
      })
    );

    res
      .status(201)
      .json({ message: "Order placed after eSewa payment", order });
  } catch (error) {
    console.error("Esewa order placement error:", error.message);
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
  placeEsewaOrderAfterVerification,
};

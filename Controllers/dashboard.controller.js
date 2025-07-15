const User = require("../Models/user.model");
const Product = require("../Models/product.model");
// Send logged-in user dashboard info
exports.getDashboardInfo = async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { id: _id, name:name, email:email, role:role } });
};

// Return all normal users (not admin/seller)
exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json({ users });
};
exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
};

const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user){
      console.log("User not found for token:", decoded.userId);
       return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    console.log("req.user populated:", req.user);
    next();
  } catch {
     console.log("Invalid or expired token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admins only" });
};

const isSeller = (req, res, next) => {
  if (req.user.role === "seller") return next();
  return res.status(403).json({ message: "Sellers only" });
};

const isAdminOrSeller = (req, res, next) => {
  if (["admin", "seller"].includes(req.user.role)) return next();
  return res.status(403).json({ message: "Admins or Sellers only" });
};

module.exports = {
  requireAuth,
  isAdmin,
  isSeller,
  isAdminOrSeller,
};

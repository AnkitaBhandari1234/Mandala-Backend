// promoteToAdmin.js
const mongoose = require("mongoose");
const User = require("./Models/user.model"); // Adjust path if different
require("dotenv").config(); // Load DB URI from .env

// Connect to your MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    const email = "abimbhandari@gmail.com"; // Change to your actual user's email

    const updated = await User.updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    if (updated.matchedCount === 0) {
      console.log("No user found with that email");
    } else if (updated.modifiedCount === 0) {
      console.log(" User already has role 'admin'");
    } else {
      console.log("User promoted to admin successfully");
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

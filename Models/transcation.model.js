const mongoose = require("mongoose");

// Define the Transaction schema
const transactionSchema = new mongoose.Schema(
  {
     transaction_id: { type: String, required: true, unique: true },
    product_id: {
      type: String,
     
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Amount should not be negative
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"], // Example statuses
      default: "PENDING",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Transaction model
 module.exports = mongoose.model("Transaction", transactionSchema);


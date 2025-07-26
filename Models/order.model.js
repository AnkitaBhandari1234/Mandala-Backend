const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true ,min: 1 },
  price: { type: Number, required: true,min: 0  },
  image: { type: Array },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }
});

const shippingAddressSchema = new mongoose.Schema({
 
 
 firstName: { type: String, required: true },
 lastName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
 
  country: { type: String, default: "Nepal" }

});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
  type: String,
  required: true,
  enum: ["cod", "esewa"]
},
paymentResult: {
      transactionId: { type: String },
      status: { type: String }, // e.g., 'Success', 'Failed'
      signature: { type: String }, // Optional: for verification
      paidAt: { type: Date }, // For accurate tracking
    },

    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    orderStatus: {
      type: String,
      enum: ["Pending",  "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

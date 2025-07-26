const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require("path");
const nodemailer = require("nodemailer");


const app = express();
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true,                
}));




const userRoute = require('./Routes/user.routes');
const productRoute = require('./Routes/product.routes');
const mongodb = require('./DB/mangooseDb');

const categoryRoutes = require('./Routes/categories.routes');
const dashboardRoutes = require('./Routes/dashboard.routes');
const addProductRoutes=require('./Routes/addproduct.routes');
const orderRoutes=require('./Routes/order.routes');
const reviewRoutes = require("./Routes/review.routes");
const sellerRoutes = require("./Routes/seller.routes");


const sellerRequestRoutes = require('./Routes/sellerRequest.routes');
const { EsewaInitiatePayment, paymentStatus } = require('./Controllers/esewa.controller');
const { requireAuth } = require('./Middlewares/auth.middleware');






// first route in nodejs 
app.get('/', (req, res)=>{
    res.send("welcome to backend")
})
app.use('/api/products', productRoute);


// for user routes
app.use('/api/user', userRoute)
//for dashboard
app.use('/api/dashboard', dashboardRoutes);
//  Mount the order route
app.use("/api/orders", orderRoutes);


// Expose images statically
app.use("/ProductImages", express.static(path.join(__dirname, 'public/ProductImages')));
//categories route
app.use('/api/categories', categoryRoutes);
//for adding product by seller
app.use("/api/addproducts", addProductRoutes);
// Mount routes

app.use("/api/reviews", reviewRoutes);

// for seller
app.use("/api/seller", sellerRoutes);

// for sellerverification
app.use('/api/seller-request', sellerRequestRoutes);

// for deleting user or seller
app.use("/api", dashboardRoutes);

app.post("/api/initiate-payment", EsewaInitiatePayment);
app.post("/api/payment-status",requireAuth, paymentStatus);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// In-memory OTP store per email - for demo only, not production ready
const otpStore = new Map();

/**
 * Send OTP to email endpoint
 * Body: { email }
 */
app.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification Code",
      html: `<h2>Your OTP Code is: <b>${otp}</b></h2><p>This code expires in 10 minutes.</p>`,
    });

    // Save OTP with expiration 10 minutes
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

/**
 * Verify OTP endpoint
 * Body: { email, otp }
 */
app.post("/api/otp/verify", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ success: false, message: "No OTP requested for this email" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (otp === record.otp) {
    otpStore.delete(email);
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
});




// running the backend on the port 
app.listen(process.env.PORT,()=>{
    console.log(` the port is running on http://localhost:${process.env.PORT}`)
})



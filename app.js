const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true,                
}));
app.use(express.json())




const userRoute = require('./Routes/user.routes');
const productRoute = require('./Routes/product.routes');
const mongodb = require('./DB/mangooseDb');
const port = 8000;
const featuredRoute = require("./Routes/featured.routes");
const categoryRoutes = require('./Routes/categories.routes');
const dashboardRoutes = require('./Routes/dashboard.routes');
const addProductRoutes=require('./Routes/addproduct.routes');







// first route in nodejs 
app.get('/', (req, res)=>{
    res.send("welcome to backend")
})
app.use("/api/products/featured", featuredRoute);

// for user routes
app.use('/api/user', userRoute)
//for dashboard
app.use('/api/dashboard', dashboardRoutes);


app.use('/api/products', productRoute);
// Expose images statically
app.use("/ProductImages", express.static(path.join(__dirname, 'public/ProductImages')));
//categories route
app.use('/api/categories', categoryRoutes);
//for adding product by seller
app.use("/api/addproducts", addProductRoutes);


// running the backend on the port 
app.listen(process.env.PORT,()=>{
    console.log(` the port is running on http://localhost:${process.env.PORT}`)
})



const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const path = require("path");




const userRoute = require('./Routes/user.routes');
const productRoute = require('./Routes/product.routes');
const mongodb = require('./DB/mangooseDb');
const port = 8000;


//middleware
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true,                
}));
const categoryRoutes = require('./Routes/categories.routes');

const featuredRoute = require("./Routes/featured.routes");
app.use("/api/products/featured", featuredRoute);

//routes
app.use('/api/user', userRoute)

app.use('/api/products', productRoute);
// Expose images statically
app.use("/ProductImages", express.static(path.join(__dirname, "ProductImages")));
//categories route
app.use('/api/categories', categoryRoutes);


// first route in nodejs 
app.get('/', (req, res)=>{
    res.send("welcome to backend")
})

// running the backend on the port 
app.listen(process.env.PORT,()=>{
    console.log(` the port is running on http://localhost:${process.env.PORT}`)
})



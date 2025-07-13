const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();




const userRoute = require('./Routes/user.routes');
const productRoute = require('./Routes/product.routes');
const mongodb = require('./DB/mangooseDb');
const port = 8000;


//middleware
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,                
}));

//routes
app.use('/api/user', userRoute)

app.use('/api/products', productRoute);



// first route in nodejs 
app.get('/', (req, res)=>{
    res.send("welcome to backend")
})

// running the backend on the port 
app.listen(process.env.PORT,()=>{
    console.log(` the port is running on http://localhost:${process.env.PORT}`)
})



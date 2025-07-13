const mongoose = require('mongoose')

mongoose.connect(`${process.env.MONGODB_URL}`)
.then(()=>{
    console.log("Mongodb Connected Successfully!");
})
.catch((err)=>{
    console.log("Connection failed", err)
})

module.exports = mongoose;
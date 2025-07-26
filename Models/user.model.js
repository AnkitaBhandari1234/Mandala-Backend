const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 4 },
  role:{
    type:String,
    enum:["user","admin","seller"],
    default:"user"
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});


// Method to compare plain password with hashed
userSchema.methods.comparePassword =async function(password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema);

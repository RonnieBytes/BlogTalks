const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName:{type:String},
    email:{type:String,unique:true},
    salt:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    profilePicUrl:{type:String,required:false,default: 'defaultProfile.jpg'} // Set a default image
},{timestamps:true})
const USER = mongoose.model("user",userSchema);
module.exports=USER;

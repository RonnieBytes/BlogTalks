const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    coverImgURl:{type:String,required:false},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
},{timestamps:true})
const BLOG = mongoose.model("blog",blogSchema);
module.exports=BLOG;

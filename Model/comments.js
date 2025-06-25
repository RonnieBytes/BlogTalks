const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    body:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    createdAt:{type:mongoose.Schema.Types.ObjectId,ref:'blog'
    }
},{timestamps:true})
const COMMENT = mongoose.model("comment",commentSchema);
module.exports=COMMENT;

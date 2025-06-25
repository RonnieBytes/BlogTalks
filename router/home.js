const express=require('express');
const router =express.Router();
const {} = require('../Model/blog');
const{blogData} = require('../middlewares/auth');
const {restrictLoggedIn} = require('../middlewares/auth');
const BLOG = require('../Model/blog');

router.get('/dashboard',async(req,res)=>{
    const allBlogs = await BLOG.find({});
    console.log("Rendering dashboard with blogs:", allBlogs.length)
    res.render('dashboard',{user:req.user,allBlogs});
});
//export
module.exports=router;
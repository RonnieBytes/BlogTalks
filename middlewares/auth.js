const {getUser} = require('../diaries/token');
const mongoose = require('mongoose');
const BLOG = require('../Model/blog');
const USER = require('../Model/auth');
function notstrictLoggedIn(req,res,next){
    const token = req.cookies?.uid;
    if(!token){return next()};
    const user = getUser(token);
    if(!user){return next()};
    req.user = user;//gets the user info from cookie to user object
    //res.locals.user = user; // this makes it global for all views
    console.log("user=",req.user)
    return next();    
}
async function restrictLoggedIn (req,res,next){
    const token = req.cookies?.uid;
    if(!token){return res.redirect('/')};
    const tokenUser = getUser(token);
    const user = await USER.findById(tokenUser._id); //  fetch from DB
    if(!user){return res.redirect('/')};
    req.user = user;//gets the user info from cookie to user object
    console.log("user=",req.user)
    return next();    
}


// const blogData = async(req,res,next)=>{
//       if (!req.user) {
//     res.locals.myBlogs = [];
//     return next();
//   }
//     try {
//         const userId = req.user._id;//new mongoose.Types.ObjectId(req.user._id);
//         const blogs = await BLOG.find({createdBy:userId});
//          console.log("Fetched blogs for user:", req.user.name, blogs);
//         res.locals.myBlog = blogs;
//         const indiblog = await BLOG.find({_id:blogs._id});
//         console.log("indiblog",indiblog);
//         res.locals.indiBlog = indiblog;
//     } catch (error) {
//         console.log("Error fetching blog data",error);
//         res.locals.myBlog = [];
//     }
//     console.log("middleware → res.locals.myBlogs =", res.locals.myBlog);
//     next();
// }

const blogData = async (req, res, next) => {
    // Initialize both variables
    res.locals.myBlog = [];
    res.locals.indiBlog = null;

    if (!req.user) {
        return next();
    }
    
    try {
        const userId = req.user._id;
        
        // 1. Fetch all user's blogs for dropdown (myBlog)
        const blogs = await BLOG.find({ createdBy: userId });
        console.log("Fetched blogs for dropdown:", blogs);
        res.locals.myBlog = blogs;
        
        // 2. If on individual blog page, fetch that specific blog
        if (req.params && req.params.id) {
            const indiblog = await BLOG.findById(req.params.id).populate('createdBy');
            console.log("Fetched individual blog:", indiblog);
            res.locals.indiBlog = indiblog;
        }
        
    } catch (error) {
        console.log("Error fetching blog data", error);
        // Keep the empty arrays we initialized earlier
    }
    
    console.log("Middleware results:", {
        myBlog: res.locals.myBlog,
        indiBlog: res.locals.indiBlog
    });
    
    next();
};

module.exports = {
    restrictLoggedIn,
    notstrictLoggedIn,
    blogData
};
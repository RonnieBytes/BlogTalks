require('dotenv').config();
const express = require("express");
const ron = express();
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
//connect db
// mongoUrl=process.env.
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error("MongoDB connection error:", err.message));
//middlewares
ron.use(cookieParser());
//ron.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
ron.use('/uploads', express.static(path.join(__dirname, 'uploads')));

ron.use(express.json())
ron.use(express.urlencoded({extended:false}));
const {restrictLoggedIn} = require("./middlewares/auth");
const{notstrictLoggedIn} = require('./middlewares/auth');
const{blogData} = require('./middlewares/auth');
ron.get('/',notstrictLoggedIn,(req,res)=>{console.log("Being hit!!");res.render('dashboard',{user:req.user})});
//connect routes 
const signuproutes = require('./router/signup');
ron.use('/',signuproutes);
const loginroutes = require('./router/login');
ron.use('/',loginroutes);
const homeroutes =require('./router/home');
ron.use('/home',restrictLoggedIn,blogData,homeroutes);
const pfproutes =require('./router/pfp');
ron.use('/',restrictLoggedIn,blogData,pfproutes);
const blogroutes =require('./router/blog');
ron.use('/',restrictLoggedIn,blogData,blogroutes);
//views
ron.set('view engine','ejs');
ron.set('views',path.resolve('./views'));

const port = process.env.PORT||3000;//process.env.MONGO_URL||process.env.PORT ||  
ron.listen(port,()=>{console.log("Server started successfully at port",port,"!")});

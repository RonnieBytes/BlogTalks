const express=require('express');
const router =express.Router();
const mongoose = require('mongoose');
const BLOG = require('../Model/blog');
const multer = require('multer');
// const USER = require('../Model/auth');
const COMMENT = require('../Model/comments');
const Storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/');
    },
    filename: function (req,file,cb){
        cb(null, `${req.user._id}-${file.originalname}`);//${req.user._id}-
    }
})
const upload = multer({storage:Storage}) //instead of const upload = multer({dest:"uploads/"});
router.get('/addBlog',async(req,res)=>{//mostly whenever you use database you put that function async
    // const myBlogs = await BLOG.find({createdBy:req.user._id});
    res.render('addBlog',{
        user:req.user
    });
})
router.post('/addBlog', upload.single('coverImgURl'), async (req, res) => {
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);

  try {
    const blogData = await BLOG.create({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.user._id,
      coverImgURl: req.file ? req.file.filename : null
    });
    res.redirect('/addBlog');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving blog');
  }
});
router.get('/:id',async(req,res)=>{
  if (req.params.id === 'favicon.ico') return res.status(204).end();
    const indiBlog= await BLOG.findOne({_id:req.params.id}).populate('createdBy');  
    // const authorDetails=await USER.findOne({_id:indiBlog.createdBy});manual populate
     const comments = await COMMENT.find({createdAt:req.params.id}).populate('createdBy').populate('createdAt');

    res.render('indiblog',{user:req.user,indiBlog,comments});
})
router.post('/:id',async(req,res)=>{
    const body = req.body;
   console.log('BODY:', req.body); // debug log
    const indiBlog= await BLOG.findOne({_id:req.params.id}).populate('createdBy');  
     const comments = await COMMENT.find({createdAt:req.params.id}).populate('createdBy').populate('createdAt');
     await COMMENT.create({body:body.commBody,createdAt:req.params.id,createdBy:req.user._id});

    res.redirect(`/${req.params.id}`);
})

module.exports=router;
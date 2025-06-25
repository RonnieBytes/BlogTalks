const express=require('express');
const router =express.Router();
const USER = require('../Model/auth');
// const {restrictLoggedIn} = require('../middlewares/auth');
const multer = require('multer');

const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,`pfp${req.user._id}-${file.originalname}`)
    }
})
const upload = multer({storage:Storage});
router.get('/pfp',async (req,res)=>{
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = req.user;
    const freshUser = await USER.findById(req.user._id);
        if (!freshUser) return res.redirect('/login');
    // const freshUser = await USER.findById(req.user._id); // ✅ Fresh DB data
    // const filename = freshUser.profilePicUrl || null;
    const filename = user.profilePicUrl || null; // null if no image set
    res.render('pfp',{filename,user:freshUser});
})



router.post('/pfp',upload.single('profilePicImg'),async(req,res)=>{
   try {
    if (!req.user) return res.status(401).send("Unauthorized");
     console.log("User ID:", req.user._id);
    console.log("Uploaded file object:", req.file);
    console.log("Updating user:", req.user._id, "with file:", req.file.filename);

     const updatedUser = await USER.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profilePicUrl: req.file.filename } },
            { new: true, runValidators: true } // Important options
        );
     if (!updatedUser) {
      console.log("Update failed: User not found");
      return res.status(404).send("User not found");
    }
    console.log("Updated user from DB:", updatedUser);
    
    // Re-query user to make sure
    // const freshUser = await USER.findById(req.user._id);
    // console.log("Fresh user from DB:", freshUser);
    res.render('pfp',{user:updatedUser});
   } catch (error) {
    console.error("Error updating profile pic:", error);
    res.status(500).send("Internal server error");
   }
})
module.exports= router;

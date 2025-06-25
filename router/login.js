const express=require('express');
const router =express.Router();
const crypto = require('crypto');
const mongoose = require('mongoose');
const USER = require('../Model/auth');
const {setUser} = require('../diaries/token');

router.get('/login',(req,res)=>{res.render('login')});
router.post('/login',async(req,res)=>{
    const {fullName,email,password} = req.body;
    const user = await USER.findOne({email});
    const salt = user.salt;
    const hmac = crypto.createHmac('sha256',salt);
        hmac.update(password);//actually hashes the salt with the pass
        const vhashedPassword = hmac.digest('hex');
        if(vhashedPassword!=user.password){ 
            throw new Error("Incorrect Password!")       
            // return res.redirect('/login');
        };
        const token = setUser(user);
        res.cookie('uid',token);
        res.redirect('/home/dashboard');
})

router.get('/logout',(req,res)=>{
    res.clearCookie("uid").redirect('/');
})
module.exports = router;
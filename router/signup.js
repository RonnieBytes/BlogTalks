const express=require('express');
const router =express.Router();
const crypto = require('crypto');
const mongoose = require('mongoose');
const {setUser} = require('../diaries/token');
const USER = require('../Model/auth');
router.get('/signup',(req,res)=>{res.render('signup')});
router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    // const key = "secret"; secret-key is the salt!!
    const salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha256',salt);
    hmac.update(password);//actually hashes the salt with the pass
    const hashedPassword = hmac.digest('hex');//confirms the hashing and collects the hashed pass
    const user = await USER.create({
        fullName:fullName,
        email:email,
        salt:salt,
        password:hashedPassword
    });
    const token = setUser(user);
    res.cookie('uid',token);
    res.redirect('/home/dashboard');
})
module.exports = router;
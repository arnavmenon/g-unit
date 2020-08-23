const express = require('express');
const router = express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const {registerValidation,loginValidation}=require('../validation');



router.get('/register',(req,res)=>{
    res.render('register');
})

router.get('/login',(req,res)=>{
    res.render('login');
})


router.post('/register', async(req,res)=>{

    const {error}=registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking existing users
    const usernameExists=await User.findOne({username:req.body.username});
    if(usernameExists) return res.status(400).send('Username already exists');
    const emailExists=await User.findOne({email:req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');


    //Hashing and saving

    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password,salt);

    const user=new User({
        username:req.body.username,
        password:hashedPassword,
        email:req.body.email
       
    });
    user.save()
      .then(result => {
        res.redirect('/users/login');
      })
      .catch(err => {
        console.log(err);
      }); 
});


router.post('/login', async(req,res)=>{

    const{error}=loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user=await User.findOne({username:req.body.username});
    if(!user) return res.status(400).send('Username or password is incorrect');

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');

    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

})


module.exports = router;
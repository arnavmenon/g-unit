const express=require('express');
const morgan=require('morgan');
const mongoose = require('mongoose');
const dotenv=require('dotenv');
const axios=require('axios');
const { func, array } = require('@hapi/joi');

let namelist=[];

const PORT = process.env.PORT || 3000;

dotenv.config();

const app=express();
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});





//Database connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },)
    .then(result=>{app.listen(PORT, console.log(`Server started on port ${PORT}`));})
    .catch(err=>console.log(err));

//Import routes
const authRoute=require('./routes/auth.js');

//Route middleware
app.use('/users',authRoute);



//Main routes
/* app.get('/',(req,res)=>{
    res.render('index',{namelist:namelist});
}) */

const gameRoutes = require('./routes/gameRoutes');
app.use('/', gameRoutes);  

app.use((req, res) => {
    res.status(404).render('404');
});





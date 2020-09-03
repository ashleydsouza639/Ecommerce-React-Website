const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');  //see routes requestted in console
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //save user credentials in cookie
const expressValidator = require('express-validator'); //form daata validtions
const cors = require('cors');  //since we have port 8000 and react runs on 3000 port 


require('dotenv').config();

//important routes
const userRoutes= require('./routes/user');
const authRoutes= require('./routes/auth');
const categoryRoutes= require('./routes/category');
const productRoutes= require('./routes/product');
const braintreeRoutes= require('./routes/braintree');


//app
const app = express();

//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=>console.log("Database connected"));   //then is promise/afterwrads

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api",userRoutes);           //localhost:8000/api is ur homepage
app.use("/api",authRoutes);           //localhost:8000/api is ur homepage
app.use("/api",categoryRoutes);           
app.use("/api",productRoutes);           
app.use("/api",braintreeRoutes);           


const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
//http://localhost:8000
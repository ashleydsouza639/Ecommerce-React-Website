const express = require('express');
const router = express.Router();

//import methods signin,..
//const {sayHi} = require("../controllers/user");
const {signin} = require("../controllers/auth");
const {signup} = require("../controllers/auth");
const {signout} = require("../controllers/auth");
const {requireSignin} = require("../controllers/auth");
const {userSignupValidator} = require("../validator/index");

//router.get("/",sayHi)
router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);

router.get('/hello',requireSignin,(req,res)=>{
    res.send("gello");
})

module.exports = router;  //imported in ap.js
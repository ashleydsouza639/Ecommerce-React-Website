const express = require('express');
const router = express.Router();


const {requireSignin,isAuth,isAdmin} = require("../controllers/auth");  //isAuth means only loggedin users can see their profile, not others profile
                                                                       //isAdmin is a middleware which enables only users with role=1 to create products
const {userById,read,update} = require("../controllers/user");

router.get("/secret/:userId",requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({user:req.profile});
})


router.get("/user/:userId",requireSignin,isAuth,read);
router.put("/user/:userId",requireSignin,isAuth,update);

//userbyId method in controllers/user.js finds that user through url and stores user details in req.profile
router.param("userId",userById);//execute userById method when userId is found in route
module.exports = router;  //imported in ap.js
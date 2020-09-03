const express = require('express');
const router = express.Router();

//import methods signin,..
//const {sayHi} = require("../controllers/user");
const {create,read,update,remove,list} = require("../controllers/category");
const {requireSignin,isAuth,isAdmin} = require("../controllers/auth");  //isAuth means only loggedin users can see their profile, not others profile
const {userById} = require("../controllers/user");
const {categoryById} = require("../controllers/category");


router.get("/category/:categoryId",read);
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);
router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,update);
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,remove);
router.get("/categories",list);



router.param("categoryId",categoryById);//exe
router.param("userId",userById);//execute userById method when userId is found in route

module.exports = router;  //imported in ap.js
const express = require('express');
const router = express.Router();

//import methods signin,..
//const {sayHi} = require("../controllers/user");
const {create,read,remove,update} = require("../controllers/product");
const {list,listRelated,listCategories,listBySearch,photo,listSearch} = require("../controllers/product");
const {requireSignin,isAuth,isAdmin} = require("../controllers/auth");  //isAuth means only loggedin users can see their profile, not others profile
const {userById} = require("../controllers/user");
const {productById} = require("../controllers/product");

router.get("/product/:productId",read);
router.post("/product/create/:userId",requireSignin,isAuth,isAdmin,create);           //oonly admin and lggded in user can create/delete product
router.put("/product/:productId/:userId",requireSignin,isAuth,isAdmin,update);
router.delete("/product/:productId/:userId",requireSignin,isAuth,isAdmin,remove);


router.get('/products',list);
router.get('/products/related/:productId',listRelated);
router.get('/products/categories',listCategories);
router.post('/products/by/search',listBySearch);      //filtering 
router.get('/product/photo/:productId',photo);
router.get("/products/search", listSearch);  //search bar


router.param("userId",userById);//execute userById method when userId is found in route
router.param("productId",productById);
module.exports = router;  //imported in ap.js
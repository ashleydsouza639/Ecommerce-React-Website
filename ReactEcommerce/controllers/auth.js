const jwt = require('jsonwebtoken');  //to generate signed token
const expressjwt =require('express-jwt'); //forauthorization check didnt use. requiresignin method
const {errorHandler}= require('../helpers/dbErrorHandler');
const User = require('../models/user'); //module.exports = new mongoose.model("User",userSchema) in models/user;
                                        //user.authenticate

//exporting methods sayHi,signup, signin  . to import in routes. do {methodNAme}=requrie(addresss  of user.js)use and require
//router.get(2 paramas => url,methodmame)
exports.sayHi = (req,res) =>{
    res.send("Hellofdsf");
}

//exporting a method to use in routes
exports.signup = (req,res) => {
    console.log("req.body",req.body);  
    const user = new User(req.body);  ////const newUser = new User({title:req.body.title})
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({err:errorHandler(err)});
        }
        //else
        user.salt=undefined;
        user.hashed_password=undefined;
       res.json({user});//display reguitered user details
        
    });
}

//we need express-jwt and  jsonwebtokrn packsges for sign in. 
//authenticate method is defined in models/user.js
exports.signin = (req,res)=>{
    //find user based on email
    const {email,password}=req.body;   //or const email = req.body.email,passwird = eq.body.password | destructuring of object
    User.findOne({email},(err,user)=>{                 //findone(2 params 1. condition is req.body.email, 2callbackfun)
        if(err || !user){
            return res.status(400).json({err:"User with thay email does not exist . please signup"});
        }
    

    //if user is found make sure that email and password match
    // we get plain password fom req.body, so we need to hash that password first
    // authenticate method is in user model
    if(!user.authenticate(password)){
        return res.status(401).json({                        //401 status code means unauthoruized. 400 means bad req. 404 not found
            error:'Email and password dont match'
        });
    }
    //generate a signed token with user idd and secret
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
    //when we sign in, we put a tokn in response cookie
    //persist the token  as 't' in vcookie with expirtu date
    res.cookie("t",token,{expire:new Date()+9999});    //res.cookie( 3 params )
    //return response with user and token to frontend client / display detail
    const {_id,email,name,role}=user ; //or const _id = user._id
    return res.json({token,user:{_id,email,name,role}});  //display details
    });   //end findone
};


// after sign in , We get token and user keys
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjQ2MjVjYTE0Y2Q0MTA2MzQ4ZWIyZmMiLCJpYXQiOjE1OTg0MzMzMDF9.i8odjvH8bF_mv67PIQhc6efZAj5mrRRKiYZ54J72RWc",
//     "user": {
//         "_id": "5f4625ca14cd4106348eb2fc",
//         "email": "glen12111992@gmail.com",
//         "name": "Glen",
//         "role": 0
//     }
// }

//when we sign in use we put token  in response cookie
//we need to clear cookie from response
exports.signout = (req,res) =>{
	res.clearCookie("t");
	res.json({message:"Signout success"});
};

//make sure only logged in user access page
//cookie-parser required
exports.requireSignin = expressjwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
});

////isAuth method defines means only  a loggedin users can see their profile, not others profile
exports.isAuth = (req,res,next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({error:"Access Denied"});
    }
    next();  //so that web page  is nt stuck move aheaad. core ofmiddleware. iit goes to 
};

//only admin can see certainj pages
exports.isAdmin = (req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({error:"Admin resource . access denied"})
    }
    next(); //so that web page  is nt stuck move aheaad. core ofmiddleware. iit goes to middlename is called bELOW

}
//in routes/user.js call middleware isAdmin
// router.get("/secret/:userId",requireSignin,isAdmin,(req,res)=>{
//     res.json({user:req.profile});
// })

// use controller method in routes  
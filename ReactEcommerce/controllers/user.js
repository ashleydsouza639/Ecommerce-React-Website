const User = require("../models/user");


//userbyid middleware that will populate the user in profile in req object
exports.userById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"user not found"})
        }
        //else
        req.profile = user;  //imp store detauls of user in req.profile. used in routers/user.js
        next();
    });
};

exports.read = (req,res)=>{
    req.profile.hashed_password = undefined;
    req.profile.salt= undefined;
    return res.json(req.profile);
}


exports.update = (req,res)=>{
    User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true},            //3-4 params, condtion/where is=req.prrofile.id ; set new body, and callback fun
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"You  are not authorized to perform this action"
                });
            }
            user.hashed_password = undefined;
            user.salt= undefined;
            return res.json(user);
        }
    );
}
const mongoose = require('mongoose');
const crypto = require('crypto'); //for password
const uuidv1 =require('uuid/v1');  //generate unique strings

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:32
    },
    //imp
    hashed_password:{
        type:String,
        required:true,   
    },
    about:{
        type:String,
        trim:true,
      
    },
    salt:String,   //used later to generate hashed password
    role:{
        type:Number,
        default:0                     //1  is admin , any user sign in is 0
    },
    history:{                 //purchase history
        type:Array,
        default:[]
    }
    
},
{timestamps:true}
);

//ENCRYPTING ENTERED PASSWORD using sha1` encryption, we use virtual method, salted using uuidv1. 
//virtual field
userSchema.virtual('password')
.set(function(password){
    this._password=password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password;
});

//all these methods authenticate , encryptPassword are reusable
userSchema.methods={
    authenticate: function(plainTextPassword){
        return this.encryptPassword(plainTextPassword)==this.hashed_password;
    },
    
    encryptPassword:function(password){
        if(!password)
            return "";
        try{
            return crypto.createHmac("sha1",this.salt).update(password).digest('hex');
        }catch(err){
            return "";
        }
    }
};

module.exports = new mongoose.model("User",userSchema);

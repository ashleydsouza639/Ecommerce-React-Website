exports.userSignupValidator = (req,res,next)=>{
    req.check('name','Name is required').notEmpty();
    req.check('email','Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min:4,
            max:32
        });
        req.check('password','Passwod is equired').notEmpty();
        req.check('password')
            .isLength({min:6})
            .withMessage("Password must contain atleast 6 characters")
            .matches(/\d/)
            .withMessage("Password must contain a number");
            
        const errors = req.validationErrors();  //grab all errors using this method
        if(errors){
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({error:firstError});
        }
        next();  //core of middleware. succeded or failed, move to next
    }
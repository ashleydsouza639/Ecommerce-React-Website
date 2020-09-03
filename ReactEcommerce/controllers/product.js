const Product = require("../models/product");
const formidable = require("formidable");  //for file/image upload
const _ = require("lodash");
const fs = require("fs"); //file system
const { json } = require("body-parser");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { request } = require("http");


//router.param("productId",productById); in controllers/product.js => whenever :prooduct id is there in  route ,productById method is called
//this method stores the specific product details in req.product

exports.productById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({error:"Product not found"});
        }

        req.product = product;
        next();
    });
};

//read specific product
exports.read = (req,res) =>{
    req.product.photo = undefined;
    return res.json(req.product);
};

//need to use form data
exports.create = (req,res)=>{
    //get incoming  form data . fields are name,descriotion etc
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  //img extensions
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"});
        }

        let product = new Product(fields);    ///imp  or new Product(req.body)
     
        if(files.photo){
            //console.log(files.photo)
            if(files.photo.size>1000000){
                return res.status(400).json({msg:"Image could not be uploaded"});
            }

            //check for all fields
            const {name,description,price,category,quantity,shipping} = fields;
            if(!name || !description || !price || !category || !quantity || !shipping){
                return res.status(400).json({error:"All fields are required"});

            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err,result)=>{
            if(err){
                return res.status(400).json({error:errorHandler(err)});
            }
            res.json(result); //result:result
        });
    });
};

exports.remove = (req,res)=>{
    let product =req.product;

    product.remove((err,deletedProduct)=>{                                      //findbyIdandDelete(2) and findByIdAndUpdate(2)
        if(err){
            return  res.status(400).json({error:errorHandler(err)});
        }
        res.json({
            //deletedProduct,
            "message":"Product deleted successfully"
        })
    })
};






exports.update= (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  //img extensions
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"});
        }

        let product = req.product;
        product = _.extend(product,fields);
     
        if(files.photo){
            //console.log(files.photo)
            if(files.photo.size>1000000){
                return res.status(400).json({msg:"Image could not be uploaded"});
            }

            //check for all fields
            const {name,description,price,category,quantity,shipping} = fields;
            if(!name || !description || !price || !category || !quantity || !shipping){
                return res.status(400).json({error:"All fields are required"});

            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err,result)=>{
            if(err){
                return res.status(400).json({error:errorHandler(err)});
            }
            res.json(result);
        });
    });
}


/* 
seell / arrival'
by sell = /products?sortBy=sold&order=desc&limmit=4
by arrival = /products?SoryBy=createdAt&order=desc&limmit=4
if no params are sent, then all products are returned
*/

exports.list =(req,res) =>{
    let order = req.query.order ? req.query.order:'desc';
    let sortBy = req.query.soryBy ? req.query.sortBy:'_id';
    let limit = req.query.limit ? parseInt(req.query.limit):6;

    Product.find()
    .select("-photo")                                                                      //dont show phot details
    .populate('category')                                                                   //populate/show details of cateegory all fields
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error:"Products not found"});
        }
        res.json(products);                                       //res.render(products in ejs:products here)
    })
}

//find category(react) of selected product. show related products of sm ecategory
exports.listRelated =(req,res) =>{

    let limit = req.query.limit ? parseInt(req.query.limit):6;
    
    //find related product based on id ne(not equal to this product)
    Product.find({_id:{$ne:req.product},category:req.product.category})
    .select("-photo")
    .populate('category','_id name')                                     //specift fields off cateoyr
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error:"Products not found"});
        }
        res.json(products)
    })
}

exports.listCategories =(req,res) =>{

    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({error:"Products not found"});
        }
        res.json(categories);
    });
}



/* 
list products by seach
on left ide
we will implement product search in react frontend
we will show categies in checkboxx and price range in rradio buttons
as the user clicks on those checkbox and radio buttions
wewill make api request and show the products to user based on wat he wants

*/

exports.listBySearch =(req,res) =>{
    let order = req.body.order ? req.body.order:'asc';
    let sortBy = req.body.soryBy ? req.body.sortBy:'_id';
    let limit = req.body.limit ? parseInt(req.body.limit):100;
    let skip = parseInt(req.body.skip);
    let findArgs ={};

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=="price"){
                //gte= greater dna price . lte= less than
                findArgs[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                };
            }else{
                findArgs[key]=req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
    .select("-photo")                                                                      //dont show phot details
    .populate('category')                                                                   //populate/show details of cateegory all fields
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error:"Products not found"});
        }
        res.json({size:products.length,products})
    })
}


exports.photo =(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
        next();

    }
}


exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};
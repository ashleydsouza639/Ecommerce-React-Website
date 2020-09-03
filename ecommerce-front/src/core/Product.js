import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import {getProducts,readProduct,listRelated} from './apiCore'
import Card from './Card'

const Product = (props) => {
    const [product,setProduct]=useState({});
    const [error,setError]=useState(false);

    const [relatedProduct,setRelatedProduct]=useState([])
    
    const loadSingleProduct = productId =>{
           readProduct(productId).then(data=>{
               if(data.error){
                   setError(data.error)
               }else{
                   //here u get product id
                   setProduct(data);
                   //fetch related products based on category
                   listRelated(data._id)
                   .then(data=>{
                       if(data.error){
                           setError(data.error)
                       }else{
                            setRelatedProduct(data);
                       }
                   });
               };
           });
    }

    //grab the product id from url
    useEffect(()=>{
        const productId=props.match.params.productId       //:productId mentioned in Routes 
        loadSingleProduct(productId);
    },[props])                               //whenever there is a cange in props or web address execute useEffect

    return (
        <Layout 
            title={product && product.name } 
            description={ product && product.description && product.description.substring(0,100)} 
            className="container-fluid"
         >
        
    
         <h2 className="mb-4"> Single Product</h2>
        <div className="row">
            <div className="col-8">
                {product && product.description &&(
                <Card product={product} showViewProductButton={false}></Card>
                )}
            </div>

            <div className="col-4">
                    <h4>Related Products</h4>
                    {relatedProduct.map((p,i)=>(
                        <div  className="mb-3">                            {/*   or key={i} mention in div  */}
                            <Card key={i} product={p}/>
                        </div>
                    ))}
            </div>
        </div>
        </Layout>
      );
    }

export default Product;
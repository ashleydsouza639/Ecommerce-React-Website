/* eslint-disable */

import React, {useState,useEffect} from "react";
import Layout from '../core/Layout';
import { isAuthenticated } from "../auth";
import {Link} from 'react-router-dom';
import {createProduct,getCategories} from './apiAdmin'




const AddProduct= () =>{
    const [values,setValues]= useState({
        name:'',
        description:'',
        price:'',
        categories:[],
        category:'',
        quantity:'',
        photo:'',
        loading:false,

        error:'',
        createdProduct:'',
        redirectToProfile:false,
        formData:''
    });
    
    //destructure
    const {
        name,
        description,
        price,
        categories,
        category,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    

    //destructure user and token from localstorage
    const {user,token} = isAuthenticated();

     
    //load categories and set form data
    const init = () =>{
        getCategories().then(data =>{
            if(data.error){
                setValues({...values,error:data.error});
            }else{
                setValues({...values,categories:data,formData:new FormData()});
            }
        })
    }


    //use forrmData api as soon aas component mounts.
    useEffect(()=>{
        init();
    },[])
    
    // useEffect(()=>{
    //     setValues({...values,formData:new FormData()});
    // },[])

    const handleChange = name =>event=> {
        const value  = name==='photo' ? event.target.files[0] : event.target.value;
        formData.set(name,value);
        setValues({...values,[name]:value});
    }

    const handleSubmit = event =>{
        event.preventDefault();
        createProduct(user._id,token,formData)
        .then(data =>{
            if(data.error){
                setValues({...values,error:data.error})
            }else{
                setValues({...values,name:'',description:'',photo:'',price:'',quantity:'',loading:false,createdProduct:data.name})
            }
        })
    }

    const newProductForm = ()=>{
        return <form className="mb-3" >
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="text btn-secondary">
                <input onChange={handleChange('photo')}  type="file" name = "photo" accept="image/*"/> 
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} /> 
            </div>
            
            <div className="form-group">
                <label className="text-muted">Description</label>
                <input onChange={handleChange('description')} type="text" className="form-control" value={description} /> 
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} /> 
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select
                    onChange={handleChange('category')}
                    className="form-control"
                >
                    <option>Please select</option>
                    {categories && categories.map((c,i) =>(
                        <option key={i} value ={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select 
                    onChange={handleChange('shipping')} 
                    className="form-control"  
                
                >
                <option>Please Select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>

                </select>

            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} /> 
            </div>


        <button onClick={handleSubmit} className="btn btn-outline-primary">Create Product</button>
        </form>
    }

    const showSuccess = () => {
        <div className="alert alert-info" style={{display:createdProduct  ? '':'none'}}>
            <h2>{`${createdProduct}`} is created !</h2>

         </div>
    } 

    const showError= () => {
         <div className="alert alert-danger" style={{display: error ? '':'none'}}>
         <h2>{error} is created !</h2>

         </div>
        
    }

    const showLoading = () => {
        loading && (<div className="alert alert-success" >
            <h2>Loading...</h2>
         </div>
         )
    } 
    

    return (
        <Layout 
         title="Add a new Product"
         description={`Good Day ${user.name}!`} 
        >
          <div className="row">
            <div className="col-md-8 offset-md-2">
                {showLoading()}
                {showSuccess()}
                {showError()}
                {newProductForm()}
            </div>
          </div>
        </Layout>
      );
};

export default AddProduct;
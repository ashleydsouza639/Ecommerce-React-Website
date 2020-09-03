import React, {useState} from "react";
import Layout from '../core/Layout';
import { isAuthenticated } from "../auth";
import {Link} from 'react-router-dom';
import {createCategory} from './apiAdmin'

const AddCategory = () =>{
    const [name,setName]= useState('')
    const [error,setError]= useState(false)
    const [success,setSuccess]= useState(false)

    //destructure user and token from localstorage
    const {user,token} = isAuthenticated();

    const handleChange = (e)=>{
        setError('');
        setName(e.target.value);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        setError('');
        setSuccess(false);
        //make req to api to create ccategory
        createCategory(user._id,token,{name})
        .then(data=>{
            if(data.error){
                setError(true)
            }else{
                setError("")
                setSuccess("true");
            }
        })
    }

    const newCategoryForm = ()=>{
        return <form  >
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className = "form-control" onChange={handleChange} value={name} autoFocus required> 
                </input>
            </div>
            <button className ="btn btn-outline-primary"  onClick={handleSubmit}  >Create Category</button>
        </form>
    }

    const showSuccess = () => {
        if(success){
            return <h3 className="text-success">Category is created</h3>
        }
    }

    const showError= () => {
        if(error){
            return <h3 className="text-dange">Category should be unique</h3>
        }
    }


    return (
        <Layout 
         title="Add a new Category"
         description={`Good Day ${user.name}!`} 
        >
          <div className="row">
              {showSuccess()}
              {showError()}
            <div className="col-md-8 offset-md-2">{newCategoryForm()}</div>
          </div>
        </Layout>
      );
};

export default AddCategory;
import React from 'react';
import {useState} from 'react';   //imp touse{} for method
import Layout from '../core/Layout';
import {signup} from "../auth";
import {Link} from 'react-router-dom'




//higher  order function . function returning another function



const Signup =()=> {
    /* instead of 4 times [name,setName] dobelow */
    const [values,setValues]=useState({
        name:'',
        email:'',
        password:'',
        error:'',
        success:false
    });

    const {name,email,password,error,success}=values;   //deestructure

    //name is attribute of element   . or event.target.name if name=email in html element
    function handleChange(event){
        const {name,value}=event.target;
        setValues(prevValues=> {
            return {...prevValues,error:false, [name]:value}        ///...values are previous values . [name]: refers to attribute name,email,password
            });
    };


    // function handleChange(event){
    //     const {name,value}=event.target;
    //     setValues({...values,error:false, [name]:value});        ///...values are previous values . [name]: refers to attribute name,email,password
            
    // };
    
/* <input onchange={handleChange("email")}/>
higher order fun. fu returning another fun
 const handleChange = name = event =>{
        setValues({...values,error:false, [name]:event.target.value});           ///...values are previous values

} */





    const handleSubmit = (event) => {
        event.preventDefault(); 
        setValues({...values,error:false});
        signup({name,email,password})
        .then(data =>{
            if(data.error){
                setValues({...values,error:data.error,success:false})
            }else{
                setValues({
                    name:'',
                    email:'',
                    password:'',
                    error:'',
                    success:true
                })
            }
        })
    }

    const signUpForm=()=>(
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input name="name" onChange={handleChange} type="text" className="form-control" value={name}/>
            </div>
    
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input name="email" onChange={handleChange} type="email" className="form-control" value={email}/>
            </div>
    
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input name="password" onChange={handleChange} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={handleSubmit}  className="btn btn-primary">Submit</button>
        </form>
    );  
    
    
    const showError = () => (
        <div className="alert alert-danger" style={{display:error ?'':'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display:success ?'':'none'}}>
            New account is created. please log in 
            <Link className="nav-link" to="/signin"> Here</Link>

            
        </div>
    )
    
    return  (
            <Layout title="Signup Page" description="Sign up to Node react ecommerce app" className="container col-md-8 offset-md-2">
         {/*    {JSON.stringify(values)} */}
            {showSuccess()}
            {showError()}
            {signUpForm()}
            
           
            </Layout>
            
          );
    
};

export default Signup;

import React from 'react';
import {useState} from 'react';   //imp touse{} for method
import Layout from '../core/Layout';
import {signin,authenticate,isAuthenticated} from "../auth";
import {Link,Redirect} from 'react-router-dom'




//higher  order function . function returning another function



const Signin =()=> {
    /* instead of 4 times [name,setName] dobelow */
    const [values,setValues]=useState({
        email:'',
        password:'',
        error:'',
        loading:false,
        redirectToReferrer:false                    //when user succesffully sign it it true and usrer is redirected
    });

    const {email,password,error,loading,redirectToReferrer}=values;   //deestructure imp 
    const {user}=isAuthenticated();  //another desttructiure isAuthenticate() returns {user,token}
    //name is attribute of element   . or event.target.name if name=email in html element

    function handleChange(event){
        const {name,value}=event.target;
        setValues(prevValues=> {
            return {...prevValues,error:false, [name]:value}        ///...values are previous values . [name]: refers to attribute name,email,password. value is itts corres value
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
        setValues({...values,error:false,loading:true});
        signin({email,password})
        .then(data =>{
            if(data.error){
                setValues({...values,error:data.error,loading:false})
            }else{
                authenticate(data, ()=>{
                    setValues({
                        ...values,
                        redirectToReferrer:true
                    });
                });
            }
        })
    }

    const signInForm=()=>(
        <form>

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

    const showLoading = () => (
        loading &&  (<div className = "alert alert-info"><h2>LOADING ... </h2></div>)
    );

    const redirectUser = () => {
        if(redirectToReferrer){
            if(user && user.role==1){
                return <Redirect to="/admin/dashboard"/>;
            }else{
                return <Redirect to="/user/dashboard"/>;
            }
        }
            
    };

    
    return  (
            <Layout title="Signin Page" description="Sign In to Node react ecommerce app" className="container col-md-8 offset-md-2">
         {/*    {JSON.stringify(values)} */}
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}
            
           
            </Layout>
            
          );
    
};

export default Signin;

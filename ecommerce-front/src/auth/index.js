import {API} from "../config";


//use fetch(URL,{}) method ffor register/signup
export const signup = (user)=>{
    //console.log(name,email,password);
    return fetch(`${API}/signup`,{                // //api is the  url used in node app.js
        method:"POST",
        headers:{
            Accept:'application/json',
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)                  //cnvert object to json
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
};

export const signin = (user)=>{
    //console.log(name,email,password)
    return fetch(`${API}/signin`,{
        method:"POST",
        headers:{
            Accept:'application/json',
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)                  //cnvert object to json
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
};

//save user and token obtained after log in in application/local storag
//helper method log/sign in
export const authenticate = (data,next) => {
    if(typeof window !=='undefined'){
        localStorage.setItem('jwt',JSON.stringify(data));
        next();
    }
};

//clear local stoage
//make req to backend
//redirect user to homepage


/* 
if(typeof window == 'undefined') means



1.Code that runs without 'onclick'.


2.Ensure call to server-side function with no browser errors
*/
export const signout = (next)=>{
    //clear token from local storage
    if(typeof window !=='undefined'){
        localStorage.removeItem("jwt");
        next();
    
        //make request to backend for log out
        return fetch(`${API}/signout`,{method:"GET"})
        .then(response => {
            console.log("signout",response);
        })
        .catch(err => console.log(err));
    }
};


//check if user is logged in
//also returns user details such as name,email,role
////isAuthenticated.user.role    
//returns object {{token , user}}. user contains details such as name,role,email
export const isAuthenticated = () =>{
    if(typeof window == 'undefined'){
        return false;
    }

    if(localStorage.getItem("jwt")){                      //if jsonwebtoken exists
        return JSON.parse(localStorage.getItem("jwt"));   //convert object to json form. return in json format
    }else{
        return false;
    }
}
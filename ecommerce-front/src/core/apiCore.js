import {API} from "../config";
import queryString from "query-string";

//use fetch(URL,{}) method ffor register/signup
//list all products based on qury parameter
export const getProducts = (sortBy)=>{
    //console.log(name,email,password);
    return fetch(`${API}/products/?sortBy=${sortBy}&order=desc&limit=6`,{                  //api is the  url used in node app.js
        method:"GET"
                    //cnvert object to json
    })
    .then(response => {
        return response.json();             //get the response. processs the response in AddCategory component
    })
    .catch(err => console.log(err))
};


//retrieve categories form db to be used in product  form
export const getCategories =()=>{
    return fetch(`${API}/categories`,{
        method:"GET"
    })
    .then(response => {
        return response.json();             //get the response. processs the response in AddCategory component
    })
    .catch(err => console.log(err))
};

//make a post req to get all products acc to fitler,kip and limit
export const getFilteredProducts = (skip,limit,filters={})=>{
    const data = {
        limit,skip,filters
    }

    return fetch(`${API}/products/by/search`,{                  //api is the  url used in node app.js
        method:"POST",
        headers:{
            Accept:'application/json',
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)                  //cnvert object to json
    })
    .then(response => {
        return response.json();             //get the response. processs the response in AddCategory component
    })
    .catch(err => console.log(err))
};

export const list = params => {
    const query = queryString.stringify(params);
    console.log("query", query);
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


//retrieve prduct form db to be used to view a single product page
export const readProduct = (productId)=>{
    return fetch(`${API}/product/${productId}`,{
        method:"GET"
    })
    .then(response => {
        return response.json();             //get the response. processs the response in AddCategory component
    })
    .catch(err => console.log(err))
};


//list related products
export const listRelated =(productId)=>{
    return fetch(`${API}/products/related/${productId}`,{
        method:"GET"
    })
    .then(response => {
        return response.json();             //get the response. processs the response in AddCategory component
    })
    .catch(err => console.log(err))
};


//Braintree
export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const createOrder = (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
//FOR FILTERING acc to categories
/*
checkbxo is a child cokmponent. And shop isits parent compoennt
so we need send data to the parent compoentn as ultimmately shop which makesrequest to backend and fetch all products acc to filter
//so creeate a method in shop, and call as props
//send array of categoruy id useing handleFilter method
//handlefilters is a property name that invokes handleFilter method with filter as arg . check shop.js call Checkbox
*/

import React,{useState,useEffect} from 'react';

const Checkbox = ({categories,handleFilters}) =>{              
    const [checked,setChecked]=useState([]);
    

    const handleToggle = category =>()=>{                 //here category is category id
        //check if category is already is alreadu iin array//state
        const currentCategoryId= checked.indexOf(category); //return -1 or indx of alreayd added category
        const newCheckedCategoryId = [...checked]
        //if currently check was not already in checked state, then push
        //else pop
        if(currentCategoryId===-1){
            newCheckedCategoryId.push(category);
        }else{  //uncheck/delete  1 item
            newCheckedCategoryId.splice(category,1);

        }
        //console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);                 //prop method
    }
    
    
    
    
    //or pass props  and props.categories to accept
    return (
        categories.map((c,i)=>(
        <li key={i} className="list-unstyled">
            <input  onChange={handleToggle(c._id)} value={checked.indexOf(c._id===-1)} type="checkbox" className="form-check-input"/>        
            <label className="form-check-label">{c.name}</label>
        </li>
        ))
    );
};

export default Checkbox;

///we need to create a method like handletoggle fo checkboxes
//to grab category id put it in array and seened to backendand display response as books based category
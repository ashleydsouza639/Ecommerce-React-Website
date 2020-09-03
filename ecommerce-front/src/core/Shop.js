//shopping page
import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import Card from './Card'
import {getCategories,getFilteredProducts} from './apiCore'
import Checkbox from './Checkbox'
import Radiobox from './Radiobox'

import {prices} from './fixedPrices';


const Shop =() =>{
    const [myFilters,setMyFilters]=useState({
        filters:{category:[],price:[]}                ////newfiltersOBJECT.filters[price or caegory] to access
    });

    //{"filters":{"category":[],"price":"1"}} 
    //


    const [categories,setCategories]=useState([])
    const [error,setError]=useState(false)
    const [limit,setLimit]=useState(6)
    const [skip,setSkip]=useState(0)
    const [size,setSize]=useState(0)
    const [filteredResults,setFilteredResults]=useState([])


    //load categories and set form data
    const init = () =>{
        getCategories().then(data =>{
            if(data.error){
                setError(data.error);
            }else{
                setCategories(data);
            }
        })
    };
    


    
        //we need to run init when compoennt mounts
    useEffect(()=>{
        init();
        loadFilteredResults(skip,limit,myFilters.filters);
    },[]);

    const handleFilters=(filters,filterBy)=>{
        //console.log("Shop",filters,filterBy)
        //here filters is the id 0 1 2 3 ... etc
        const newFilters= {...myFilters};  //add previous filters
        //filterby=category.   so filter by category
        newFilters.filters[filterBy]=filters;    //newfilters.filters[price or caegory]
         
        //filterby price
        if(filterBy=="price"){ 
            let priceValues=handlePrice(filters);   //priceValues is array [0,9] eg
            newFilters.filters[filterBy]=priceValues;    //newfilters.filters[price or caegory]
            //console.log("fs",filters);  //fs 2 if 2nd option selected
        }

        loadFilteredResults(myFilters.filters);   //{category: ,price}

        setMyFilters(newFilters);
    }

        //get array of price range
    const handlePrice = value =>{
        const data=prices;
        let   array=[];

        for(let key in data){
            if(data[key]._id==parseInt(value)){
                array=data[key].array;
            }
        }
        return array;
    }

    const loadFilteredResults= (newFilters)=>{
        //console.log(newFilters);
        getFilteredProducts(skip,limit,newFilters).then(data=>{
        
            if(data.error){
               
                setError(data.error);
            }else{
                setFilteredResults(data.products);
                setSize(data.size)
                setSkip(0)
            }
        })
    };

    const loadMore= () =>{
        let toSkip =skip+limit;
        getFilteredProducts(toSkip,limit,myFilters.filters).then(data=>{
            if(data.error){
               
                setError(data.error);
            }else{
                setFilteredResults([...filteredResults,...data.products]);  //imp
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    };
    
const  loadMoreButton =()=>{
    return (
        size>0 && size>=limit && 
        <button onClick={loadMore} className="btn btn-warning mb-5">Load More</button>
    )
};

    return (
        <Layout title="Shopping Page" description="Search and find books of your choice" className="container-fluid" >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox 
                            categories={categories}
                            handleFilters={ filters=> 
                                handleFilters(filters,"category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <Radiobox 
                            prices={prices}
                            handleFilters={ filters=> 
                                handleFilters(filters,"price")
                            }
                        />
                    </div>

                </div>
                <div className="col-8">
                    
                    
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product,i)=>(
                            <div key={i} className ="col=4 ,mb-3">
                                <Card  product={product}/>
                             </div>
                        ))}
                    </div>
                    <hr/>
                    {loadMoreButton()}
                    
                 </div>
            </div>
        </Layout>
      );
};


export default Shop;


/* 
with categories we get these categories from ctaetggories so dan checkbox can loop through



     shop  parent compoentn
      |
----       ------
radiobox checkbox has props such as categories and handleFilter method

*/
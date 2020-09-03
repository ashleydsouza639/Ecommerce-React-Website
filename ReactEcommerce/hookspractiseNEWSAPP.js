/*
However if you are new to React Hooks or You haven't found yourself comfortable working with React Hooks yet, then please follow along. In this section, you will also build a simple yet nice HackerNews Client while Learning the basics of React Hooks.

we will use next js for server side

*/


import React,{Component,useState,useEffect} from "react";

//app compoonent or function App
const App = () =>{
	//state
	const [news,setNews] = useState([]);
	const [searchQuery,setSearchQuery] = useState("react");
	const [url,setUrl]= useState("http://hn.algolia.com/api/v1/search?query=react");

	const [loading,setLoading] = useState(false);
	//fetch news 
	const fetchNews = () =>{
		//set loading truel
		setLoading(true);  //inbuilt fetch method of above api url
		fetch(url)                  //returns proomise. then used to hnsdle
		.then(result => result.json())
		.then(data => (setNews(data.hits)))
		.then(data=>setLoading(false)) 
		.catch(error=>console.log(error));
	}

useEffect(()=>{
	fetchNews();
},[url])



const showLoading = () =>{
	loading ? <h2>Loading...</h2> : "";
}



const handleChange = (event)=>{
	setSearchQuery(event.target.value)
}

const handleClick = (event)=>{
	event.preventDefault();
	setUrl(`http://hn.algolia.com/api/v1/search?query=${searchQuery}`)
}



const searchForm = () =>{
	<form onSubmit ={handleClick}>
		<input type="text" value={searchQuery} onChange={handleChange} />
		<button> Search</button>
	</form>
}

//const showNews = () => news.map((n,i) =>
//	(<p key={i} > {n.title} </p>);


	return (
		<div>
		<h2>News</h2>
		{showLoading()}
		{searchForm()}
		{news.map((n,i)=>(<p key={i}>n.title </p>))}
		</div>
	);
};
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Home() {
    const [blog,setBlog]=useState([]);
    const [query,setQuery]=useState('');
    const [searchdata,setSearchdata]=useState([]);
    const [search,setSearch]=useState(false);

    function fetchdata(){
        axios.get('http://localhost:4000/api/blog-stats')
        .then(response=>{
            setBlog(response.data); 
            console.log(response.data);
        })
        .catch(error=>console.error(error));
    }
    async function handleSearch(){
        const encodedQuery = encodeURIComponent(query);
        axios.get(`http://localhost:4000/api/blog-search?query=${encodedQuery}`)
        .then(response=>{setSearchdata(response.data);setSearch(true);})
        .catch(error=>{console.log(error);setSearch(false)});
    }
    useEffect(()=>{
        fetchdata();
    },[]);
  return (
    <>
    <div className="header">
        <div className="head2">
        <h2>Subspace</h2>
        </div>
        <div className="head2">
        <input
        type="text"
        placeholder="Enter"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
        <h4>AboutUs</h4>
        <h4>ContactUs</h4>
        <h4>Login</h4>
        </div>
    </div>
        {!search && (
            <div className="data">
            <>
                <h4>Total Number of Blogs : {blog.total}</h4>
                    <h4>Largest Title : {blog.largestTitle}</h4>
                <h4>Number of Titles having word privary in them : {blog.titleWithPrivacy}</h4>
                <h4>Number of Unique Titles : </h4>
                <div className="container">
                    <div className="row">
                    {blog.uniqueTitle && blog.uniqueTitle.map(item=>(
                    <>
                    <div className="col-md-4">
                    <div className="my-3">
                        <div className="card">
                            <div className="card-body">
                            <img src={item.image_url} width='70px' height='70px'alt="" />
                            <p>Id : {item.id}</p>
                            <p>{item.title}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    </>
                ))}
                    </div>
                </div>
                </>
        </div>
        )}
        {search && (
            <div className="data">
                <div className="container">
                    <div className="row">
                        {searchdata && searchdata.map(item=>(
                            <>
                            <div className="col-md-4">
                                <div className="my-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <img src={item.image_url} width='70px' height='70px'alt="" />
                                            <p>{item.id}</p>
                                            <p>{item.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

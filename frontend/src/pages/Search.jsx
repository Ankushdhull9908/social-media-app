import React, { useEffect, useState } from 'react'
import { asstes } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

import './Search.css'
function Search() {
    const Errorduringsearch=()=> toast('No Such User')
    const navigate = useNavigate()
    const [search, setsearch] = useState('')
    const [searchresult, setsearchresult] = useState([])
    const [loading,setloading] = useState(false)
    console.log(searchresult)

    function submit()
    {
        setloading(true)
        const data = {
            search:search
        }
        async function submitdata() 
        {
            await fetch(`https://social-media-app-0uma.onrender.com/search/${search}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                
                
                if(data.data !== undefined)
                {
                  setsearchresult(prev => [...prev, data.data])
                  setloading(false)
                  
                }
                else
                {
                   // alert('Invalid credentials')
                   Errorduringsearch()
                }
                 
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        submitdata()
    }
  return (
    <div className='search'>
        <ToastContainer/>
        <div className="searchbox">
        <div className="searchbar">
            <div className='inputsearchimg'><input type="text" placeholder='Search' value={search} onChange={(e)=> setsearch(e.target.value)} />
            <img src={asstes.search} alt='search' onClick={()=> submit()}/>
            </div>
            

        
      </div>
      {
           loading===false ? <div className="searchresult">
           <h3>Search Results</h3>
           {
               searchresult.length === 0 ? <p>No recent searches</p> :
               searchresult.map((item, index) => {
                   return (
                       <div className="searchitem" key={index}>
                           <img src={item.userprofile} alt='profilepic' onClick={()=> navigate(`/profile/${item.name}`)}/>
                           <div className="usernameandfullname">
                           <h4>{item.name}</h4>
                           <p>{item.fullname}</p>
                          
   
                           </div>
                           
                       </div>
                   )
               })
               
           }
           
         </div> : <p>Loading....</p>

      }
      

        </div>
      
      
    </div>
  )
}

export default Search

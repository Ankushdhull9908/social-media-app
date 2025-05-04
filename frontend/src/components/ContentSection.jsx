import React, { useEffect, useState } from 'react';
import './ContentSection.css';
import { useNavigate } from 'react-router-dom';
import { asstes } from '../assets/assets';
import { useCart } from '../Context';
import { allpostcollection } from '../assets/Posts';

function ContentSection() {
   const navigate = useNavigate()
  const { myfollowees,logindata } = useCart();
  var x = []

  const [backenddata, setbackenddata] = useState([]);
  const [suggestedaccount,setsuggestedaccount]  =useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://social-media-app-0uma.onrender.com/suggest');
        const data = await res.json();
        console.log("Suggestions received:", data); // For debugging

        
        setbackenddata(data); // Store in local state

        




      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(()=>{
    var x = backenddata.filter((i)=> i.username!==logindata.name)
    setsuggestedaccount(x)

  },[backenddata])

  return (
    <div className='contentsection'>
      {
        myfollowees.length === 0 ? (
          <div className='suggestions'>
            <div className="suggestionheading">
              <h2>Follow Others for Better User Experience</h2>
            </div>

            {
              suggestedaccount.map((account, index) => (
                <div className="suggestionbox" key={index}>
                  <img src={account.userprofile==="empty" ? asstes.noprofile:account.userprofile} alt="dp" onClick={()=> navigate(`/profile/${account.username}`)} />
                  <div className="nameandverified">
                    <h4>{account.username}</h4>
                    <img src={asstes.verified}/>
                  </div>
                  <p>{account.fullname}</p>
                  <button onClick={()=> navigate(`/profile/${account.username}`)}>Visit Profile</button>
                </div>
              ))
            }

          </div>
        ) : (
          <div className='allpostmainpage'>
            {
              allpostcollection.map((i, index) => (
                <div className='post' key={index}>
                  <img src={i.imgurl} alt="post" />
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default ContentSection;

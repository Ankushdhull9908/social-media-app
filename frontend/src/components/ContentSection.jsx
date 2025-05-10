import React, { useEffect, useState } from 'react';
import './ContentSection.css';
import { useNavigate } from 'react-router-dom';
import { asstes } from '../assets/assets';
import { useCart } from '../Context';
//import { allpostcollection } from '../assets/Posts';

function ContentSection() {
   const navigate = useNavigate()
  const { myfollowees,logindata,calculatetime } = useCart();
  var x = []
  const [allpostcollection,setallpostcollections]= useState([])
  const [backenddata, setbackenddata] = useState([]);
  const [suggestedaccount,setsuggestedaccount]  =useState([])


   useEffect(()=>{
    async function fetchData() {
      try {
        const res = await fetch('https://social-media-app-0uma.onrender.com/allpost');
        const data = await res.json();
        console.log("post data:", data); // For debugging
        setallpostcollections(data.data)
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }

    fetchData()

  },[])

   async function givelike(x)
    {
      
        const data = {
           
            likeid:'121',
            username:logindata.name,
            userfullname:logindata.fullname,
            userprofile:logindata.userprofile

        }
        async function submitdata() {
          // alert('it called')
            await fetch(`https://social-media-app-0uma.onrender.com/givelike/${x}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(data => {
      
                if (data) {
                  console.log("post data",data)
                }
                else {
                  alert('Invalid credentials')
                }
      
                console.log('Success:', data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }

          
              submitdata()
          
          
    }

  useEffect(() => {
     if(myfollowees.length!==0) return
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
     if(myfollowees.length===0)
    {
      fetchData();
    }

    
  }, [myfollowees]);

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
        ) :(
          <div className='allpostmainpage'>
            {
              allpostcollection.map((i, index) => {
                var x = i.likes.filter((y=> y.uFullName=== logindata.fullname))

                var time = calculatetime(i.createdAt)
                return(

                <div className='post' key={index}>
                  <div className="postaccount">
                                      
                                  <div className="postaccountdp">
                                  <img src={i.userProfile==="empty" ? asstes.noprofile : i.userProfile} onClick={()=> navigate(`/profile/${i.username}`)}/>
                              </div>
                              <h5 onClick={()=> navigate(`/profile/${i.username}`)}>{i.username}</h5>
                               <p id='time'>{time}</p>
                              </div>
                  <img src={i.imgurl} alt="post" />
                  <div className="totalnooflikesonpost">
                                    <div className="logocollections">
                                        <div className="likecommentsharelogo">
                                          {
                                            <img src={x.length===0 ? asstes.commentlikeicon : asstes.liked} onClick={()=> {
                                               
                                              if(x.length===0) givelike(i.postId)
                                              }}/>
                                          }
                                            
                                            <img src={asstes.commentlogo}/>
                                            <img src={asstes.share}/>
                  
                                        </div>
                                        <div className="savelogo">
                                        <img src={asstes.save}/>
                  
                                        </div>
                                    </div>
                                    <div className="showtotallikesoncomment">
                                    <h4>{i.likes.length} Likes</h4>
                                    </div>  
                                    </div>
                </div>
              )})
            }
          </div>
        )
      }
    </div>
  )
}

export default ContentSection;

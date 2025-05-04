import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Following.css'

function Followers() {

    const navigate = useNavigate()
    const [followers,setfollowers] = useState([])

    const {uid} =useParams()

    useEffect(() => {
        
            if (uid) {
              submitdata()
            }
            async function submitdata() {
              await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${uid}`)
                .then(response => response.json())
                .then(data => {
        
                  if (data) {
                    console.log('user follow stats',data)
                    
                
                    setfollowers(data[0].Follower)
                   
                    console.log('user followers data',data)
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
        
        
          }, [uid])

    
  return (
    <div className='followingpage'>
         <div className="followingheading">
            <h3>Followers</h3>

        </div>
      {
        followers.map((i)=>{
            return(
                <div className='followinguser'>
                    <img src={i.userprofile} alt='profile' onClick={()=> navigate(`/profile/${i.Uname}`)}/>
                    <p>{i.Uname}</p>
                    
                </div>
            )
        })
      }
    </div>
  )
}

export default Followers

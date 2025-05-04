import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Following.css'

function Following() {
    const navigate = useNavigate()
    
    const [following,setfollowing] = useState([])

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
                    
                
                    setfollowing(data[0].Following)
                   
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
            <h3>Following</h3>

        </div>
      {
        following.map((i)=>{
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

export default Following

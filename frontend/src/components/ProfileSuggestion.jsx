import React, { useEffect } from 'react'
import './ProfileSuggestion.css'
import { asstes } from '../assets/assets'
import { useCart } from '../Context'
import { useNavigate } from 'react-router-dom'

function ProfileSuggestion() {
  const navigate = useNavigate()

  const { logindata} = useCart()

  useEffect(()=>{

  },[logindata])

  console.log(logindata)

  //


  return (
    <div className='profilesuggestion'>
        <div className="rightprofilesection">
          <div className="profilebox">
            <div className="dp">
            <img src={logindata.userprofile} onClick={()=> navigate(`/profile/${logindata.name}`)}/>

            </div>
            <div className="idnameanduname">
          <div className="nameandverified">
                              <h5 onClick={()=> navigate(`/profile/${logindata.name}`)}>{logindata.name}</h5>
                              {
                                logindata.name === "instagram" ? <img src={asstes.verified}/> : ''
                              }
          
                              </div>
          <p id='fullname'>{logindata.fullname}</p>

          </div>
          <div className="switch">
            <p id='switch'>switch</p>
          </div>
            
          </div>
          
          
          <div className="footer">
            <div className='footercontent'>
            <li>About</li>
<li>Press</li>
<li>Terms & Conditions</li>
<li>Help</li>
<li>Jobs</li>
<li>Privacy</li>
<li>Locations</li>
<li>Language</li>

            </div>
            <div className='copyright'>
              <p>© 2025 Instagram from Meta</p>
            </div>
            

          </div>
          

        </div>
        
      
    </div>
  )
}

export default ProfileSuggestion

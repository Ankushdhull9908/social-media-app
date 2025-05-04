import React, { useEffect, useState } from 'react'
import { useCart } from '../Context'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import { asstes } from '../assets/assets'

function NavBar() {
    const navigate = useNavigate()
    const {logindata} = useCart()
    
    
  return (
    <div className='navbar'>
        <div className="logo" onClick={()=> navigate('/home')}>
            <img src={asstes.instagram}/>
        </div>
        <ul>
            <div className="element" onClick={()=> navigate('/home')}>
                <img src={asstes.home} alt='home'/>
            <li>Home</li>

            </div>
            
            <div className="element" onClick={()=> navigate('/search')}>
                <img src={asstes.search} alt='search'/>
            <li>Search</li>

            </div>
            <div className="element">
                <img src={asstes.explore} alt='explore'/>
            <li>Explore</li>

            </div>
            <div className="element">
                <img src={asstes.reels} alt='reels'/>
            <li>Reels</li>

            </div>
            <div className="element" onClick={()=> navigate('/chat')}>
                <img src={asstes.messages} alt='messages'/>
            <li>Messages</li>

            </div>
            <div className="element" onClick={()=> navigate('/notifications')}>
                <img src={asstes.notifications} alt='notifications'/>
            <li>Notifications</li>

            </div>
            <div className="element" onClick={()=> navigate('/create')}>
                <img src={asstes.write} alt='home'/>
            <li>Create</li>

            </div>

            <div className="userprofile">
                <img src={logindata.userprofile==="empty" ? asstes.noprofile : logindata.userprofile} alt='notifications'/>
                <p onClick={()=> navigate(`/profile/${logindata.name}`)}>Profile</p>

            </div>
            
        </ul>
        
        <div className="element">
                <img src={asstes.more} alt='notifications'/>
            <p>More</p>
            </div>
        
        
      
    </div>
  )
}

export default NavBar

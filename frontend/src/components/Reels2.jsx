import React from 'react'
import { asstes } from '../assets/assets'
import './Reels.css'
import { useNavigate } from 'react-router-dom'

function Reels(props) {
  const naviagte = useNavigate()
  console.log(props.userreel)
  return (
    <div className='reelscollections'>
     
     {
      props.userreel.map((i)=>{
        return(
          <video onClick={()=> naviagte(`/reeldescription/${i.reelId}`)}>
            <source src={i.reelurl} />
          </video>
        )
      })
     }
    </div>
  )
}

export default Reels

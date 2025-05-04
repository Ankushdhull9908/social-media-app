import React from 'react'
import './StoriesSection.css'
import { asstes } from '../assets/assets'

function StoriesSection() {
  return (
    <div className='stories'>
        <div className="story">
            <img src={asstes.ronaldo} alt='story'/>
            <p>cristiano</p>

        </div>

        <div className="story">
            <img src={asstes.messi} alt='story'/>
            <p>leomessi</p>

        </div>

        
    </div>
  )
}

export default StoriesSection

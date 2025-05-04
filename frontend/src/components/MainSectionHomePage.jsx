import React from 'react'
import StoriesSection from './StoriesSection'
import ContentSection from './ContentSection'
import './MainSection.css'
import { useCart } from '../Context'

function MainSectionHomePage() {
  const {myfollowees} = useCart()


  return (
    <div className='mainsection'>
      {
        myfollowees.length===0 ? '' : <StoriesSection/>
      }
        
        <ContentSection/>
       
      
    </div>
  )
}

export default MainSectionHomePage

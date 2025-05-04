import React from 'react'
import './Home.css'
import MainSectionHomePage from '../components/MainSectionHomePage'
import ProfileSuggestion from '../components/ProfileSuggestion'

function Home() {
  return (
    <div className='home'>
      <div className="main">
        <MainSectionHomePage/>

        </div>
        <div className="profileandsuggestions">
          <ProfileSuggestion/>
        </div>
      
    </div>
  )
}

export default Home

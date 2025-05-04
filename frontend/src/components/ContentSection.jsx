import React, { useEffect } from 'react'
import './ContentSection.css'
import { asstes } from '../assets/assets'
import { useCart } from '../Context'
import { allpostcollection } from '../assets/Posts'

function ContentSection() {
  const {myfollowees} = useCart()



  useEffect(()=>{
    
    console.log(myfollowees.length)
  })


  return (

    <div className='contentsection'>

      {
        myfollowees.length===0 ? <div className='suggestions'><div className="suggestionheading">
          <h2>Follow Others for Better User Experience</h2>
          </div>
        <div className="suggestionbox">
          <img src={asstes.instagramlogo}/>
          <div className="nameandverified">
                              <h4>instagram</h4>
                                <img src={asstes.verified}/>
                              </div>
          <p>Official Instagram</p>
          <button>Follow</button>

          </div>
          <div className="suggestionbox">
          <img src={asstes.ronaldo}/>
          <div className="nameandverified">
                              <h4>cristiano</h4>
                                <img src={asstes.verified}/>
                              </div>
          <p>Suiiiscribe My Channel</p>
          <button>Follow</button>

          </div>
          <div className="suggestionbox">
          <img src={asstes.messi}/>
          <div className="nameandverified">
                              <h4>leomessi</h4>
                                <img src={asstes.verified}/>
                              </div>
          <p>Lorem ipsum dolor sit amet.</p>
          <button>Follow</button>

          </div>
          
          
          </div> : 
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          <div className='allpostmainpage'>

            {
                allpostcollection.map((i)=>{
                  return(
                    <div className='post'>
                      <img src={i.imgurl}/>
                    </div>
                  )
                })
            }
          </div>
      }
      
    </div>
  )
}

export default ContentSection

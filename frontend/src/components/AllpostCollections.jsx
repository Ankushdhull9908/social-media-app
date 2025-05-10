import React, { useState,useEffect } from 'react'
import { allpostcollection } from '../assets/Posts'
import { asstes } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function AllpostCollections(props) {
    const naviagte = useNavigate()
    const [specificpostlikes,setspecificpostlikes] = useState(null)
      const [totalpostlikes,settotalpostlikes] = useState(null)
      const [totalpostcomments,settotalpostlcomments] = useState(null)
       const [isMobile,setisMobile] = useState(false)

      useEffect(() => {
               
                  const checkScreenSize = () => {
                    setisMobile(window.innerWidth <= 480);
                  };
              
                  checkScreenSize();
              
                  window.addEventListener('resize', checkScreenSize);
              
                  return () => window.removeEventListener('resize', checkScreenSize);
                }, []);

    
  return (
    <div className="allpostcolletions">
            {
            
            props.userpost.map((i,index)=>{
                
              
              return(
                <div className="post" key={index} onMouseOver={()=> {
                  setspecificpostlikes(index)
                  }} onMouseLeave={()=> setspecificpostlikes(null)}>
                  {
                    
                  }
                  {
                    isMobile ? '' : (<div className='showlikes' key={index}>
                      {
     specificpostlikes === index ? <div>
     <img src={asstes.posthoverlike} />
     <span>{totalpostlikes}</span>
     <img src={asstes.commenticon} />
     <span>{totalpostcomments}</span>
   </div>
      
     : ''
   }
                      
                      
                    </div>)
                  }
                  
                       
                  
                        
                <img src={i.imgurl} onClick={()=> naviagte(`/postdescription/${i.postId}`)}/>
              </div>
  
              )
              
            })
           
          }
  
            </div>
  )
}

export default AllpostCollections

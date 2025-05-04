import React, { useState } from 'react'
import { allpostcollection } from '../assets/Posts'
import { asstes } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function AllpostCollections(props) {
    const naviagte = useNavigate()
    const [specificpostlikes,setspecificpostlikes] = useState(null)
      const [totalpostlikes,settotalpostlikes] = useState(null)
      const [totalpostcomments,settotalpostlcomments] = useState(null)

    
  return (
    <div className="allpostcolletions">
            {
            
            props.userpost.map((i,index)=>{
                
              
              return(
                <div className="post" key={index} onMouseOver={()=> {
                  setspecificpostlikes(index)
                  //var returnedindex = allpostcollection.findIndex((x)=> x.postId===i.postId)
                  //settotalpostlikes(allpostcollection[returnedindex].likes.length)
                 // settotalpostlcomments(allpostcollection[returnedindex].Comments.length)
                 // console.log(i.postId)
                  }} onMouseLeave={()=> setspecificpostlikes(null)}>
                  {
                    
                  }
                  
                       <div className='showlikes' key={index}>
                       {
      specificpostlikes === index ? <div>
      <img src={asstes.posthoverlike} />
      <span>{totalpostlikes}</span>
      <img src={asstes.commenticon} />
      <span>{totalpostcomments}</span>
    </div>
       
      : ''
    }
                       
                       
                     </div>
                  
                        
                <img src={i.imgurl} onClick={()=> naviagte(`/postdescription/${i.postId}`)}/>
              </div>
  
              )
              
            })
           
          }
  
            </div>
  )
}

export default AllpostCollections

import React, { useEffect, useState } from 'react'
import { asstes } from '../assets/assets'
import { useParams } from 'react-router-dom'
import { allreelscollection } from '../assets/Reels'
import './Postdetails.css'

function ReelsDetails() {


    const [postdetils,setpostdetails]  =useState([])
    const {reelid}=  useParams()

    const finalpostid = parseInt(reelid)
  


    useEffect(()=>{
        const x = allreelscollection.findIndex((i)=> i.reelId===finalpostid)
        console.log('index is',x)
        if(x==-1)
        {
            setpostdetails([])
            return
        }

        setpostdetails([allreelscollection[x]])



    },[finalpostid])

    console.log(postdetils)
  return (
    <div className='postdetails'>
            {
                postdetils.length===0 ? <p>loading</p> : <div className="mainbox">
                <div className="reelurl">
                    <video autoPlay loop>
                        <source src={postdetils[0].reelurl}/>
                    </video>
                </div>
                <div className="imgbioandcomments">
                    <div className="postaccount">
                        <p>ankush</p>
                    </div>
                    <div className="postdescription">
                        <p>{postdetils[0].postbio}</p>
                            
                        
                    </div>
                    <div className="comments">
                        {
                            postdetils.length!==0 ? postdetils[0].Comments.map((i)=>{
                                return(
                                <div className='commentbyuser'>
                                    <div className="commentuserdp">
                                    <img src={i.uProfile}/>
    
                                    </div>
    
                                    <div className="namecommentandnooflikes">
                                    <div className="profilenameandcomment">
                                        <h4>{i.uName}</h4>
                                    <p>{i.comment}</p>
                                    
                                    </div>
                                    <div className="totallikeoncomment">
                                        <p>{i.NumberOflikes} Likes</p>
                                    </div>
    
                                    </div>
                                    
                                    <div className="nooflikesoncomment">
                                        <img src={asstes.commentlikeicon} id='likeoptiononcomment'/>
                                    </div>
                                    
                                    
                                </div>)
                            }) : ''
                        }
                        
                    </div>
                    <div className="totalnooflikesonpost">
                        <div className="logocollections">
                            <div className="likecommentsharelogo">
                                <img src={asstes.commentlikeicon}/>
                                <img src={asstes.commentlogo}/>
                                <img src={asstes.share}/>
    
                            </div>
                            <div className="savelogo">
                            <img src={asstes.save}/>
    
                            </div>
                        </div>
                        <div className="showtotallikesoncomment">
                        <h4>{postdetils[0].likes.length } Likes</h4>
                        </div>
                        <div className="postuploadeddate">
                        <p>30 March</p>
                        </div>
                        
                            
                                
                            
                        </div>
    
                </div>
              </div>
            }
          
        </div>
  )
}

export default ReelsDetails

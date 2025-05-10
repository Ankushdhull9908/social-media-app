import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Postdetails.css'
import { allpostcollection } from '../assets/Posts'
import { asstes } from '../assets/assets'
import { useCart } from '../Context'

function PostDetails() {
    const [postdetils,setpostdetails]  =useState([])
    const [isMobile,setisMobile] = useState(false)
    const {postid}=  useParams()
    const {logindata} =useCart()
    const [postliked,setpostliked] = useState(false)
    

    const finalpostid = parseInt(postid)

    useEffect(()=>{

      if(postdetils.length===0) return
      const x= postdetils[0].likes.filter((i)=> i.uFullName=== logindata.fullname)
                              if(x.length!==0){
                                setpostliked(true)
                              }

    },[postdetils])

    useEffect(() => {
   
      const checkScreenSize = () => {
        setisMobile(window.innerWidth <= 480);
      };
  
      checkScreenSize();
  
      window.addEventListener('resize', checkScreenSize);
  
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    console.log(isMobile)

    async function givelike()
    {
        const data = {
           
            likeid:'121',
            username:logindata.name,
            userfullname:logindata.fullname,
            userprofile:logindata.userprofile

        }
        async function submitdata() {
            await fetch(`https://social-media-app-0uma.onrender.com/givelike/${postdetils[0].postId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(data => {
      
                if (data) {
                  console.log("post data",data)
                }
                else {
                  alert('Invalid credentials')
                }
      
                console.log('Success:', data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
          if(postliked===false)
          {
              submitdata()
          }
          
    }
  


    useEffect(()=>{
    
        async function submitdata() {
          await fetch(`https://social-media-app-0uma.onrender.com/specificpostdetails/${finalpostid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
        })
          })
            .then(response => response.json())
            .then(data => {
    
              if (data.data !== undefined) {
                console.log("post data",data.data)
    
                setpostdetails(data.data)
              }
              else {
                alert('Invalid credentials')
              }
    
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
        submitdata()
    
    
      },[finalpostid])

    console.log(postdetils)

    
  return (
   <div className='postdetails'>
        {
            postdetils.length===0 ? <p>loading</p> : <div className="mainbox">
            <div className="postimg">
              {
                isMobile ? <div className="postaccount">
                    
                <div className="postaccountdp">
                <img src={postdetils[0].userProfile}/>
            </div>
            <h5>{postdetils[0].username}</h5>
            </div> : ''
              }
            
                <img src={postdetils[0].imgurl}/>
                {
                  isMobile ? <div className="totalnooflikesonpost">
                  <div className="logocollections">
                      <div className="likecommentsharelogo">
                        {
                          postliked ? <img src={asstes.liked}/> : <img src={asstes.commentlikeicon} onClick={()=>{
                            givelike()
                     }}/>
                        }
                          
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
                  </div> : ''
                }
            </div>
            <div className="imgbioandcomments">
            <div className="postaccount">
                    
                    <div className="postaccountdp">
                    <img src={postdetils[0].userProfile}/>
                </div>
                <h4>{postdetils[0].username}</h4>
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
                        {
                          postliked ? <img src={asstes.liked}/> : <img src={asstes.commentlikeicon} onClick={()=>{
                            givelike()
                     }}/>
                        }
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

export default PostDetails

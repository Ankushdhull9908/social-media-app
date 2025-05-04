import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../Context'
import { asstes } from '../assets/assets'
import './Profile.css'
import UserDetailsProfile from '../components/UserDetailsProfile'
import { allpostcollection } from '../assets/Posts'
import AllpostCollections from '../components/AllpostCollections'
import Reels from '../components/Reels2.jsx'
import { allreelscollection } from '../assets/Reels'


function Profile() {
  const { logindata, socket} = useCart()
  //console.log(logindata)
  
  const { name } = useParams()
  const naviagte = useNavigate()
  
  const [searchresult, setsearchresult] = useState([])
  
  const [userfolowers, setuserfollowers] = useState([])
  const [userfolowees, setuserfollowees] = useState([])
  const [friendstatus, setfriendstatus] = useState('Follow')
  const [fetchdata, setfetchdata] = useState(false)
  const [acctype,setacctype] = useState('public')
  const [showaccount,setshowaccount] = useState(true)
  const [classnameforsections,setclassnameforsections] = useState('active')
 
  const [userpost,setuserpost] = useState([])
  const [userreel,setuserreel] = useState([])
  const [totalpost,settotalpost] = useState(null)
  
  const [postreelorsaved,setpostreelorsaved] = useState('post')


  useEffect(()=>{

    async function submitdata() {
      await fetch(`https://social-media-app-0uma.onrender.com/allpost/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
      search: name
    })
      })
        .then(response => response.json())
        .then(data => {

          if (data.data) {
            console.log("post data",data.data)

            setuserpost(data.data)
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


  },[name])

  useEffect(()=>{
    
    settotalpost(userpost.length)


  },[userpost])

  
  //console.log(userpost)

  useEffect(() => {
      
          if(name)
          {
      
            submitdata()
          }
          
            
            async function submitdata() {
              await fetch(`https://social-media-app-0uma.onrender.com/search/${name}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
              search: name
            })
              })
                .then(response => response.json())
                .then(data => {
  
                  if (data.data !== undefined) {
                    console.log(data.data)
                    setsearchresult(prev => [...prev, data.data])
                    
      
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
            
          
      
        }, [])
  


  

  useEffect(() => {

    if (searchresult.length !== 0) {
      submitdata()
    }
    async function submitdata() {
      await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${searchresult[0].userId}`)
        .then(response => response.json())
        .then(data => {



          if (data) {
        
            setuserfollowers(data[0].Follower)
            setuserfollowees(data[0].Following)
            setfetchdata(false)
            setacctype(data[0].AccountType)
            //setuserdplink(data[0].userprofile)

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


  }, [searchresult, logindata])

  function privatesendreq()
  {
    socket.emit('privatesendreq',{
      from: logindata.name,
      fromId:logindata.userId,
        requesteduserprofile:logindata.userprofile,
        to: searchresult[0].name,
        toId:searchresult[0].userId
    })

  }


  function sendfriendrequest() {
    if(acctype==='public')
    {
      socket.emit('sendfriendrequest', {
        from: logindata.name,
        to: searchresult[0].name
      })

    }else{
      privatesendreq()
      return

    }
    if(logindata.name===""|| logindata.name===null)
    {
      alert('no logged in user data')
      return
    }else{
      sendData()
    }

    async function sendData() {
      fetch('https://social-media-app-0uma.onrender.com/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          followeeId: searchresult[0].userId,
          followeeName: searchresult[0].name,
          followerId: logindata.userId,
          followerName: logindata.name
        })

      })
        .then(response => response.json())
        .then(data => {
          
          console.log('Success:', data);
          setfetchdata(true)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    
  }

 

  useEffect(()=>{
    

      if(name=== logindata.name)
      {
        setshowaccount(true)
      }else{
       
        
        var x = userfolowers.filter((i)=> i.userId===logindata.userId)
        

        if(x.length!==0 && acctype=== 'private')
        {
          setshowaccount(true)
        }else if(x.length!==0 && acctype==='public'){
          setshowaccount(true)
        }else if(acctype==='public')
        {
          setshowaccount(true)
        }
        else{
          
          setshowaccount(false)
        }
        
      }

  },[logindata,userfolowers])

  useEffect(() => {
    
    var x = userfolowers.filter((i)=> i.userId === logindata.userId)

    if (x.length!==0) {
      setfriendstatus('Following')
    }
    else {
      setfriendstatus('Follow')

    }
  }, [userfolowees])


  
  return (
    <div className='profile'>
     
      
    
      <UserDetailsProfile value={name} totalpost={totalpost}/>
      {
        showaccount=== true ? 
        <div className="reelposttags">
          <p className={classnameforsections==="active" ? "active" : "active"} onClick={()=> {setpostreelorsaved('post') 
            setclassnameforsections('active') }}> Posts</p>
          <p className={classnameforsections==="active" ? "" : "active"} onClick={()=> {setpostreelorsaved('reels')
            setclassnameforsections('active')
          }}>reels</p>
          <p>tags</p>
        </div> : ''
      }
      {
        showaccount===true ? <div className="useruploads">

          {
            postreelorsaved === "post" ? <AllpostCollections userpost={userpost}/> : <Reels userreel={userreel}/>
          }

          
          
        
       
      </div> : <div className='prvtsection'><h5>This account is private</h5><p>Follow To see Post</p> <button id='followbtn' onClick={() => sendfriendrequest()}>{friendstatus}</button></div>
      }

      




    </div>


  )
}

export default Profile

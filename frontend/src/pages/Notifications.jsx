import React, { useEffect, useState } from 'react'
import { useCart } from '../Context'
import './Notifications.css'
import { useNavigate } from 'react-router-dom'

function Notifications() {
   const navigate = useNavigate()
    const { allfriendrequest,socket,logindata,setallfriendrequest} = useCart()
    const [reqconfirmusername,setreqconfirmusername] = useState([])
    console.log(allfriendrequest)

    function requestConfirmed(x)
    {
      console.log('friend request data',x)
      
      if(!socket) return

      socket.emit('requestconfirmed',{
        from:logindata.name,
        to:x.from
      })

      sendData()

      async function sendData() {
        fetch('https://social-media-app-0uma.onrender.com/follow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
             followeeId: x.toId,
            followeeName: x.to,
            followerId: x.fromId,
            followerName: x.from,
            followeeImg:logindata.userprofile,
            followerImg:x.image
          })
  
        })
          .then(response => response.json())
          .then(data => {
            
            console.log('Success:', data);

            var x= allfriendrequest.filter((i)=> i.from !== x.from)
            console.log(x)
            setallfriendrequest(x)

           // setfetchdata(true)
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }




    }

    

    
  
  return (
    <div className='notifications'>

      {
        allfriendrequest.length===0 ? <p>No Notifications</p> : <button onClick={()=> {localStorage.removeItem('friendrequests')
          navigate('/home')
        }}>Clear All Notifications</button>
      }
      
      {

        allfriendrequest.map((i)=>{
          return(
            <div className='notification'>
              <img src={i.image } onClick={()=>navigate(`/profile/${i.from}`)}/>
              <p onClick={()=>navigate(`/profile/${i.from}`)}>{i.from}</p>
              <button onClick={()=> requestConfirmed(i)}>Confirm</button>
              <button>Delete</button>

            </div>
          )
        })
        
      }

      
    </div>
  )
}

export default Notifications

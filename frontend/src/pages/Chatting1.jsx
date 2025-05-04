import { useEffect } from 'react';

import { useState } from 'react';
import { useCart } from '../Context';

import './Chatting.css'
import { asstes } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import Audio from '../components/Audio';

function Chatting() {
  const [msg,setmsg] = useState('')
  const [msgcollection,setmsgcollection] = useState([])
  const [chatwithfollowers,setchatwithfollowers] = useState([])
  const [receiverimg,setreceiverimg] = useState('')
  const [targetedid,settargetedid] = useState([])

  const [receiver,setreceiver] = useState('')
  const [typing,settyping] = useState('')
  const {logindata,socket,isConnected} = useCart()
  const [finaltargetedid,setfinaltargetedid] = useState('')
  const [typername,settypername] = useState('')
  const [loading,setloading]= useState(true)
  const username = logindata.name;
  const navigate = useNavigate()

  console.log('receiver image',receiverimg)

  console.log('chat withothers',chatwithfollowers)

  useEffect(()=>{
    setmsgcollection([])

  },[receiver])

  console.log('receiver is',receiver)


 
 

  


  console.log(msgcollection)



useEffect(() => {

    if(logindata)
    {
        submitdata()
    }
    async function submitdata() {
      await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${logindata.userId}`)
        .then(response => response.json())
        .then(data => {



          if (data) {
           
            setchatwithfollowers(data[0].Following)
            setloading(false)

            
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


  }, [logindata])


// Handle message sending
const sendMsg = () => {
    if (!msg.trim() || !socket || !isConnected) return;
    
    const newMsg = { from: username, message: msg, to: receiver };
    
    setmsgcollection(prev => [...prev, newMsg]);
    
    socket.emit('messagefromuser', newMsg);
    socket.emit('stoptyping', { from: username, to: receiver });
    setmsg('');
};

useEffect(()=>{
    if(!socket) return

    socket.emit('gettargetedid',{
        from:logindata.name,
        to:receiver
    })

    return () => {
        socket.off('gettargetedid');
    };

},[receiver])


useEffect(()=>{
    if(!socket) return

    socket.on('targetedidforcalling',(x)=>{
       settargetedid(x)

       console.log("targeted id data",x)
    })

    return () => {
        socket.off('targetedidforcalling');
    };

},[socket])

// Handle incoming messages
useEffect(() => {
    if (!socket) return;

    const handlePrivateMsg = (message) => {
        setTimeout(()=>{
            if(receiver!==message.to){
                console.log(receiver," ",message.to)
                setmsgcollection(prev => [...prev, message]);
            }else{
                return
            }

        },100)

    };

    socket.on('private-msg', handlePrivateMsg);

    return () => {
        socket.off('private-msg', handlePrivateMsg);
    };
}, [socket]);


useEffect(() => {
    if (!socket || !msg) return;
    
    const typingTimeout = setTimeout(() => {
        socket.emit('typing', { from: username, to: receiver });
    }, 200);

    return () => clearTimeout(typingTimeout);
}, [msg, socket, username, receiver]);

useEffect(() => {
    if (!socket) return;

    const handleSenderTyping = (data) => {
        if (data) {
            settyping(`Typing...`);
            settypername(data.from)

        }
    };

    const handleSenderStoppedTyping = () => {
        settyping('');
    };

    socket.on('sendertyping', handleSenderTyping);
    socket.on('senderstopedtyping', handleSenderStoppedTyping);

    return () => {
        socket.off('sendertyping', handleSenderTyping);
        socket.off('senderstopedtyping', handleSenderStoppedTyping);
    };
}, [socket]);




  return (
      <div className="chatting">
          <div className="contacts">
            <div className="userprofileinsidecontacts">
                <h3>{logindata.name}</h3>
                <img src={asstes.write} alt='setting'/>
            </div>
            <div className="msgandrequest">
                <h4>Messages</h4>
                <p>Requests</p>
            </div>

            {
               
               loading===false ?  chatwithfollowers.map((i,index)=>{
                    return(
                        <div key={index} className='contact' onClick={()=> {setreceiver(i.Uname)
                            setreceiverimg(i.userprofile)
                        }}>
                            <img src={i.userprofile} alt='receiverimg' onClick={()=> {setreceiverimg(i.userprofile==="empty" ? asstes.noprofile : i.userprofile)
                                setreceiver(i.Uname)}
                            }/>
                            <div className="nameandtypingstatus">
                            <p>{i.Uname}</p>
                            
                            <p id='typingstatusincontacts'>{typername.includes(i.Uname) ? typing : ''}</p>  

                            </div>
                            
                            
                        </div>
                    )
                 }) : <p>Loading Contacts....</p>
                 
            }

          </div>
          {

            receiver === "" ? <div className='emptychattingbox'><img src={asstes.messages} alt='chaticon'/><p>Send private photos and messages to a friend</p><button>Send Message</button></div> : <div className="chattingbox">
            <div className="chatuserprofile">
                <div className="dpnameverified">
                <div className="dp">
                <img src={receiverimg} alt='profilepic' onClick={()=> navigate(`/profile/${receiver}`)}/>
                
                </div>
                
                <div className="nameandverified">
                                    <h5>{receiver}</h5>
                                    {
                                       receiver === "instagram" ? <img src={asstes.verified} alt='verified'/> : ''
                                    }
                
                                    </div>
            </div>
                </div>
                
            <div className="chatbox">
                
                <div className="userprofileinsidechatbox">
                    <img src={receiverimg} alt='icon' onClick={()=> navigate(`/profile/${receiver}`)}/>
                    <div className="nameandverified">
                                    <h4>{receiver}</h4>
                                    {
                                       receiver === "instagram" ? <img src={asstes.verified} alt='verified'/> : ''
                                    }
                
                                    </div>
                                    <p>{receiver}</p>
                                    <button onClick={()=> navigate(`/profile/${receiver}`)}>View Profile</button>
            
                    
                </div>
            {msgcollection.map((i, index) => (
                
                  <div key={index} className={i.from === username ? 'mymessage' : 'someonemsg'}>
                    {
                         i.from !== username ? <img src={receiverimg} alt='receiverlogo'/> : ''
                    }
                    
                    
                    <p>{i.from === username ? '' : ''} {i.message}</p>
                        </div>
                       
                      
                  
              ))}
              <div className="someonemsg">
                {
                    <div className={typing==='' ? 'hide' : 'show'}>
                        <img src={receiverimg}/>
                        <p>{typing}</p>
                    </div>
                }
              
              </div>
              
              

            </div>
            
            <div className="inputandsendbtn">
                  <input 
                      type='text' 
                      placeholder='Message...' 
                      value={msg} 
                      onChange={(e) => setmsg(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
                  />
                  <img src={asstes.send} alt="send" onClick={sendMsg} />
              </div>
            
              
          </div>

          }
          
      </div>
  );
}

export default Chatting;

import { createContext,useContext,useState,useEffect} from "react";
import { io } from 'socket.io-client'
import { toast } from "react-toastify";
const Context = createContext();

export const AppContext= (props) => {
    const [logindata,setlogindata]= useState({name:null,fullname:null,userId:null,userprofile:null})

    const [socket,setsocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false);
    const [myfollowers,setmyfollowers] = useState([])
    const [myfollowees,setmyfollowees] = useState([])
    const [allfriendrequest,setallfriendrequest] =useState([])
    const [isFriendRequestLoaded, setIsFriendRequestLoaded] = useState(false);

    
     console.log('all friend request are',allfriendrequest)
     console.log('login data',logindata);

    function calculatetime(postdate)
   {
    const historicdata = new Date(postdate);
    const now = new Date();
    const diffInMs = now - historicdata;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    
    if(diffInSeconds >=31536000)
    {
      return (Math.floor(diffInSeconds/31536000)+`Year ago`)
    }else if(diffInSeconds >=2592000)
    {
      return (Math.floor(diffInSeconds/2592000)+`Month ago`)
    }else if(diffInSeconds >=604800)
    {
      return (Math.floor(diffInSeconds/604800)+`Week ago`)
    }else if(diffInSeconds >=86400)
    {
      return (Math.floor(diffInSeconds/86400)+`day ago`)
    }else if(diffInSeconds >=3600)
    {
      return (Math.floor(diffInSeconds/3600)+`hour ago`)
    }else if(diffInSeconds >=60)
      {
        return (Math.floor(diffInSeconds/60)+`min ago`)
      }else{
        return ('just Now') }
   }
    
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('userdata'));
      if (userData) {
          setlogindata({ name: userData.name, fullname: userData.fullname,userId: userData.userId,email:userData.email,userprofile:userData.userprofile });
      }
  }, []);

    useEffect(()=>{

    },[logindata])

    function changelogindata(x)
    {
        console.log(x)
        setlogindata({name:x.name,userId:x.userId,fullname:x.fullname,userprofile:x.userprofile})
    }

    useEffect(() => {
      if (!socket) return;
  
      // Define the handler outside setTimeout
      const handleFriendRequest = (message) => {
          setTimeout(() => {
              console.log(message);
              
              toast(`${message.from} Started following you`)
          }, 1000);
      };
  
      socket.on('friendrequest', handleFriendRequest);
  
      return () => {
          socket.off('friendrequest', handleFriendRequest);
      };
  }, [socket]);

  useEffect(() => {
    const saved = localStorage.getItem('friendrequests');
    if (saved) {
      setallfriendrequest(JSON.parse(saved));
    }
    setIsFriendRequestLoaded(true); // ✅ Set loaded to true
  }, []);
  
  // 2. Save to localStorage whenever state changes
  useEffect(() => {
    if (!socket || !isFriendRequestLoaded) return; // ✅ Wait for localStorage to load
  
    const handleFriendRequest = (message) => {
      setTimeout(() => {
        const already = allfriendrequest.filter((i) => i.from === message.from);
        if (already.length === 0) {
          const updated = [...allfriendrequest, message];
          setallfriendrequest(updated);
          localStorage.setItem('friendrequests', JSON.stringify(updated));
            toast(`${message.from} requested to Follow you`)
          
        } else {
          toast('Already Sent Request');
        }
      }, 1000);
    };
  
    socket.on('privatefriendrequest', handleFriendRequest);
  
    return () => {
      socket.off('privatefriendrequest', handleFriendRequest);
    };
  }, [socket, allfriendrequest, isFriendRequestLoaded]);


     useEffect(()=>{

      if(!socket) return


        socket.on('requestaccepted',(data)=>{
          console.log(data)
            toast(`${data.from}`+" accepted ur request");
          
        })

        return () => {
          socket.off('requestaccepted');
        };



     },[socket])
  
  

    useEffect(() => {
      let socketInstance;
      
      const connectSocket = () => {
          if (!logindata.name) return;

          socketInstance = io('https://social-media-app-0uma.onrender.com', {
              reconnection: true,
              reconnectionAttempts: 5,
              reconnectionDelay: 1000,
          });

          socketInstance.on('connect', () => {
              console.log('Connected to server');
              setIsConnected(true);
              socketInstance.emit('new-user-joined', logindata.name);
          });

          socketInstance.on('disconnect', () => {
              setIsConnected(false);
          });

          socketInstance.on('connect_error', (err) => {
              console.error('Connection error:', err);
          });

          setsocket(socketInstance);
      };

      connectSocket();

      return () => {
          if (socketInstance) {
              socketInstance.off('connect');
              socketInstance.off('disconnect');
              socketInstance.off('connect_error');
              socketInstance.disconnect();
          }
      };
  }, [logindata.name]);



  useEffect(() => {
  
      if (logindata) {
        submitdata()
      }
      async function submitdata() {
        await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${logindata.userId}`)
          .then(response => response.json())
          .then(data => {
  
  
  
            if (data) {
                console.log(data)
          
              setmyfollowers(data[0])
              setmyfollowees(data[0].Following)

              
              
           
  
            }
            else {
                toast('Invalid credentials');
              
            }
  
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
  
  
      }
  
  
    }, [logindata])


    console.log(myfollowees.length)



   
    return (
        <Context.Provider value={{calculatetime,logindata,changelogindata,socket,isConnected,myfollowees,allfriendrequest,setallfriendrequest,setlogindata}}>

            {props.children}
        </Context.Provider>
    );
};

// Custom hook to use CartContext
export const useCart = () => useContext(Context);

 

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { useCart } from '../Context'
import { asstes } from '../assets/assets'


function UserDetailsProfile(props) {
    const { logindata, changelogindata, socket} = useCart()
    
     // const [userdplink,setuserdplink] = useState(logindata.userprofile)
      const name = props.value
      
      
      const navigate = useNavigate()
      const [searchresult, setsearchresult] = useState([])
    const [loading,setloading] = useState(true)
    const [profilepicchanges,setprofilepicchanges] = useState(false)
      
      const [userfolowers, setuserfollowers] = useState([])
      const [userfolowees, setuserfollowees] = useState([])
      const [friendstatus, setfriendstatus] = useState('Follow')
  
      const [acctype,setacctype] = useState('public')
      const [showaccount,setshowaccount] = useState(true)
      const fileInputRef = useRef(null);
      //const [loading,setloading] = useState(true)
  
 
      const [userdplink,setuserdplink] = useState(null)
      
  
      function logout() {
        localStorage.removeItem('userdata')
        changelogindata({ name: null })
    
        navigate('/')
      }
        
      console.log(searchresult)
    
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
          
        
    
      }, [name])


 
      useEffect(() => {
    
        if (searchresult.length !== 0) {
          submitdata()
        }
        async function submitdata() {
          await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${searchresult[0].userId}`)
            .then(response => response.json())
            .then(data => {
    
    
    
              if (data) {
                console.log('user follow stats',data)
                
            
                setuserfollowers(data[0].Follower)
                setuserfollowees(data[0].Following)
              //  setfetchdata(false)
                setacctype(data[0].AccountType)
             //   setuserdplink(data[0].userprofile)

             setloading(false)

                console.log('user followers data',data)
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
    
    
      }, [logindata,searchresult])
    
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
              followeeImg:searchresult[0].userprofile,
              followerId: logindata.userId,
              followerName: logindata.name,
              followerImg:logindata.userprofile
            })
    
          })
            .then(response => response.json())
            .then(data => {
              
              console.log('Success:', data);
              //setfetchdata(true)
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
        
      }
    
      function unfollow()
      {
        async function sendData() {
          fetch('https://social-media-app-0uma.onrender.com/unfollow', {
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
             // setfetchdata(true)
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
    
        sendData()
    
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
    
    
      const handleClick = () => {
        
        fileInputRef.current.click();
      };
    
      const handleFileChange = async (e) => {
     
        const file = e.target.files[0];
        if (!file) return;
    
        // Show preview of selected image
       // setPreview(URL.createObjectURL(file));
    
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('https://social-media-app-0uma.onrender.com/upload', {
            method: 'POST',
            body: formData,
          });
    
          const data = await res.json();
          console.log('Upload success:', data);
          setuserdplink(data.imageUrl)
          
          alert('Image uploaded successfully!');
        } catch (err) {
          console.error('Upload error:', err);
          alert('Image upload failed.');
        } finally {
         // setUploading(false);
        }
      };
    
    
      useEffect(() => {
        if (userdplink===null || userdplink==="") return;
      
      
        const data = {
          imgurl: userdplink,
          userId: logindata.userId
        };
      
        async function sendData() {
          try {
            const response = await fetch('https://social-media-app-0uma.onrender.com/uploaduserprofile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
      
            const result = await response.json();
            console.log('Success:', result);

              setprofilepicchanges(true)
            //setfetchdata(true);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      
        sendData();
      }, [userdplink]);

    useEffect(()=>{
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

                    //changelogindata({name:data.data.name,fullname:data.data.fullname,userId:data.data.userId,email:data.data.email,userprofile:data.data.userprofile})
                    
      
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

      },[profilepicchanges])
      
      return (
        <div className="userdetails">
          {
            loading === false ? (
              searchresult.length !== 0 ? (
                searchresult[0].name === logindata.name ? (
                  <div className="profileimgandotherdetails">
                    <div className="profilepic">
                      <img src={searchresult[0].userprofile==="empty" ? asstes.noprofile : searchresult[0].userprofile} alt="profilepic" onClick={handleClick} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
      
                    <div className="userdetailsbox">
                      <div className="usernameeditsettings">
                        <div className="nameandverified">
                          <p>{searchresult[0].name}</p>
                          {searchresult[0].name === "instagram" && (
                            <img src={asstes.verified} alt="verified" />
                          )}
                        </div>
                        <button id="editbtn">Edit Profile</button>
                        <button id="logoutbtn" onClick={logout}>Logout</button>
                        <img
                          src={asstes.setting}
                          alt="setting"
                          onClick={() => navigate(`/setting/${searchresult[0].userId}`)}
                        />
                      </div>
      
                      <div className="totalpostfollowerfollowing">
                        <div className="x">
                          <h3>{props.totalpost}</h3>
                          <p>Post</p>
                        </div>
                        <div className="x">
                          <h3>{userfolowers.length}</h3>
                          <p onClick={() => navigate(`/followers/${searchresult[0].userId}`)}>Followers</p>
                        </div>
                        <div className="x">
                          <h3>{userfolowees.length}</h3>
                          <p onClick={() => navigate(`/following/${searchresult[0].userId}`)}>Following</p>
                        </div>
                      </div>
      
                      <div className="userfullname">
                        <h5>{logindata.fullname}</h5>
                      </div>
      
                      <div className="userbio">
                        {searchresult[0].name === "instagram" ? (
                          <p>Discover Whats New on Instagram 🔎✨</p>
                        ) : (
                          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profileimgandotherdetails">
                    <div className="profilepic">
                      <img src={searchresult[0].userprofile==="empty" ? asstes.noprofile : searchresult[0].userprofile} alt="profile" />
                    </div>
      
                    <div className="userdetailsbox">
                      <div className="usernameeditsettings">
                        <div className="nameandverified">
                          <p>{searchresult[0].name}</p>
                          {searchresult[0].name === "instagram" && (
                            <img src={asstes.verified} alt="verified" />
                          )}
                        </div>
      
                        <button
                          id="followbtn"
                          onClick={() =>
                            friendstatus === "Follow" ? sendfriendrequest() : unfollow()
                          }
                        >
                          {friendstatus}
                        </button>
      
                        {showaccount && (
                          <button id="msgbtn" onClick={() => navigate(`/chat/${searchresult[0].name}`)}>
                            Message
                          </button>
                        )}
                      </div>
      
                      <div className="totalpostfollowerfollowing">
                        <div className="x">
                          <h3>{props.totalpost}</h3>
                          <p>Post</p>
                        </div>
                        <div className="x">
                          <h3>{userfolowers.length}</h3>
                          <p onClick={() => navigate(`/followers/${searchresult[0].userId}`)}>Followers</p>
                        </div>
                        <div className="x">
                          <h3>{userfolowees.length}</h3>
                          <p onClick={() => navigate(`/following/${searchresult[0].userId}`)}>Following</p>
                        </div>
                      </div>
      
                      <div className="userfullname">
                        <h5>{searchresult[0].fullname}</h5>
                      </div>
      
                      <div className="userbio">
                        {searchresult[0].name === "instagram" ? (
                          <p>Discover Whats New on Instagram 🔎✨</p>
                        ) : (
                          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <h1>Loading...</h1>
              )
            ) : (
              <h1>Loading...</h1>
            )
          }
      
          { showaccount===true ? ( loading===false ? <div className="highlights">
          <div className="highlight">
            <img src={asstes.messi} alt="" />
            <p>Me</p>
          </div>
          <div className="highlight">
            <img src={asstes.ronaldo} alt="" />
            <p>Celebrations</p>
          </div>
          <div className="highlight">
            <img src={asstes.messi4} alt="" />
            <p>Woww!</p>
          </div>
     
        </div> : <p>Loading</p>)
           : ''
        }
        </div>
      );
      
}



export default UserDetailsProfile

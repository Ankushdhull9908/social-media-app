import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../Context'
import { asstes } from '../assets/assets'
import { toast } from 'react-toastify';

function LoginForm() {
    const navigate= useNavigate()
    const sucessfulllogin = () => toast("Login SuccessFull");
      const Errorduringlogin = () => toast("Login Failed");

  
  const [username,setusername] = useState('')
  const [password,setpassword] = useState('')

  const {changelogindata} = useCart()


  function submit()
  {
    const data = {
      username:username,
      password:password
    }

    async function submitdata() 
    {
        await fetch('https://social-media-app-0uma.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            
            if(data.data !== undefined)
            {

                sucessfulllogin()
                setusername('')
                setpassword('')

                const profileImage = data.data.userprofile === "empty" ? asstes.noprofile : data.data.userprofile;

                setTimeout(() => {
                  localStorage.setItem('userdata',JSON.stringify(data.data))
                  changelogindata({name:data.data.name,fullname:data.data.fullname,userId:data.data.userId,email:data.data.email,userprofile:profileImage})
                  navigate('/home')
                  
                }, 3000);
            }
            else
            {
                //alert('Invalid credentials')
                Errorduringlogin()
            }
             
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    submitdata()

    




  }
  return (
    
      <div className="loginform">
        

<div className="formlogo">
  <img src={asstes.instagram} alt='instagram'/>
</div>
<input type='text' placeholder='username' value={username} onChange={(e)=> setusername(e.target.value) }/>
<input type='password' placeholder='password' value={password} onChange={(e)=> setpassword(e.target.value)}/>
<button onClick={()=> submit()}>Login</button>
<p>Forgot Password?</p>


</div>
    
  )
}

export default LoginForm

import React, { useState } from 'react'

import './Login.css'
import { asstes } from '../assets/assets'

import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'


function Login() {



  const [showlogin,setshowlogin] = useState(false)
  

  function toggle()
  {
    if(showlogin===true)
    {
      setshowlogin(false)
    }else{
      setshowlogin(true)
    }

  }

 
  
  return (
    <div className='loginpage'>
      <div className="loginimage">
       <img src={asstes.loginimage} alt='loginimage'/>
      </div>
      <div className="formsection">
      {
        showlogin===true ? <LoginForm/> : <SignUpForm/>
      }
      <p  id='alreadyhaveanacc' onClick={()=> toggle()}>{showlogin=== true ? 'Dont have an account?': 'Already have an Acoount?'} <b>{showlogin=== true ? 'Sign Up': 'Log In'}</b></p>


      </div>

      
      
      
    </div>
  )
}

export default Login

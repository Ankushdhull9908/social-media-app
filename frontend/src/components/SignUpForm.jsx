import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../Context'
import { asstes } from '../assets/assets'
import { ToastContainer, toast } from 'react-toastify';


function SignUpForm() {
  const sucessfullsignup = () => toast("Signup SuccessFully");
  const Errorduringsignup = () => toast("Error Registering User");
  const imageUploaded = ()=> toast("Image Uploaded SuccessFully")
  const imageuplodFailed= ()=> toast("Image Upload Failed")
    const navigate= useNavigate()
   const [email,setemail] = useState('')
  const [fullname,setfullname] = useState('')
  const [userdplink,setuserdplink] = useState('')
    
  const fileInputRef = useRef(null);
  const [hello,sethello] = useState('')
  
  const [username,setusername] = useState('')
  const [password,setpassword] = useState('')

  const {changelogindata} = useCart()


  function submit()
  {
    const data = {
        email:email,
      fullname:fullname,
      username:username,
      password:password,
      userprofile:"empty"
    }
    

    async function submitdata()
    {
        await fetch('https://social-media-app-0uma.onrender.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            
            console.log('Success:', data);
            if(data.message==="Error registering user")
            {
              Errorduringsignup()
            }else{
              sucessfullsignup()
            }
            
        })
        .catch((error) => {
            console.error('Error:', error);
            Errorduringsignup()
        });
    }
    submitdata()
    




  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview of selected image
    //setPreview(URL.createObjectURL(file));

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
      imageUploaded()
      
     // alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      //hello
      
      imageuplodFailed()
    } finally {
     // setUploading(false);
    }
  };
  return (
    
      <div className="loginform">
      <ToastContainer />

<div className="formlogo">
  <img src={asstes.instagram} alt='instagram'/>
</div>
<input type='email' placeholder='Mobile Number or Email' value={email} onChange={(e)=> setemail(e.target.value) }/>
<input type='password' placeholder='password' value={password} onChange={(e)=> setpassword(e.target.value)}/>
<input type='text' placeholder='Full Name' value={fullname} onChange={(e)=> setfullname(e.target.value) }/>
<input type='text' placeholder='User Name' value={username} onChange={(e)=> setusername(e.target.value)}/>
<input
     type="file"
     ref={fileInputRef}
     onChange={handleFileChange}
     accept="image/*"
/>
<button onClick={()=> submit()}>Sign Up</button>



</div>
    
  )
}

export default SignUpForm

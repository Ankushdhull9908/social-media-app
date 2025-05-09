import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../Context'
import './CreatePost.css'
import { asstes } from '../assets/assets';

function CreatePost() {
  const [userdplink, setuserdplink] = useState('')
  const { logindata, changelogindata, socket } = useCart()
  //const [posturl,setposturl] =useState(null)
  const [isMobile, setIsMobile] = useState(false);
  const [createposttext,setcreateposttext] = useState('next')
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // trigger the hidden input
  };

  const handleFileChange = async (e) => {
    

    const file = e.target.files[0];
    if (!file) return;

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

      //alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed.');
    }
  };

  useEffect(() => {
   
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  async function uploadnewPost() {


    const data = {
      postId: Math.floor(Math.random() * 10000),
      userId: logindata.userId,
      username: logindata.name,
      imgurl: userdplink,
      postbio: '',
      userProfile: logindata.userprofile
    };

    async function sendData() {
      try {
        const response = await fetch('https://social-media-app-0uma.onrender.com/uploadnewpost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Success:', result);
        //setfetchdata(true);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    sendData();

  }





  return (
    <div className='createpost'>
      {
        userdplink === "" ? <div className='selectfilesbox'> <div className="heading"><h4>Create New Post</h4>
        </div>
        <div className="imageandbtns">
          <div className="images">
            <img src={asstes.photosvideos}/>
          </div>
          <div className="dragphotosvideostxt">
          <p>Drag Photos and Videos here </p>

          </div>
          
          
        <div className="btns">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
            <button onClick={handleClick}>Select From Computer</button>

          </div>
        </div>
          
        </div> : 

        <div className="createpostbox">
          <div className="heading">
            {
              isMobile && createposttext==='share' ? <img src={asstes.back} onClick={()=>setcreateposttext('next')}/> : ''
             
            }
           
            <h4>Create New Post</h4>
          <button onClick={() => isMobile===true ? (createposttext==='next'? setcreateposttext('share'): uploadnewPost()) : uploadnewPost()}>
              {isMobile=== true ? createposttext : 'share'}
          </button>
          </div>
          <div className="createpostmainsection">
          <div className={isMobile===true? (createposttext==='next' ? "createpostimg" : 'hide'): 'createpostimg'}>
            <img src={userdplink}/>
          </div>
          <div className={isMobile===true ? (createposttext==='share' ? "userdplocationandpostbio" : 'hide'): 'userdplocationandpostbio'}>
            {
              isMobile ? <img src={userdplink}/> : ''
            }
            
            <textarea placeholder='Post Bio...' rows={8} cols={isMobile? 30 : 53}></textarea>
            <input type='text'placeholder='Location'/>
          

          </div>
            
          </div>
          
          

        </div>
        
        
        
        
      }



    </div>
  )
}

export default CreatePost

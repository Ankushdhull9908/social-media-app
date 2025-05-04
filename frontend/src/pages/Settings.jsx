import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Settings.css'
import { useCart } from '../Context'

function Settings() {
  const { name } = useParams()
  const [toggle, setToggle] = useState(false)
  const [accounttype, setAccountType] = useState('public')
  const { logindata } = useCart()
  console.log(accounttype)

  const handleToggle = async () => {
    const newType = toggle ? 'public' : 'private'
    setToggle(!toggle)
    setAccountType(newType)

    if (!name || !logindata?.userId) return

    try {
      const response = await fetch(`https://social-media-app-0uma.onrender.com/switchtoprvtacc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: logindata.userId,
          accounttype: newType
        })
      })

      const data = await response.json()
      console.log(data)

    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(()=>{
    if(!name) return

    fetchaccountypeData()

    async function fetchaccountypeData(){
        await fetch(`https://social-media-app-0uma.onrender.com/getuserfollowee/${name}`)
        .then(response => response.json())
        .then(data => {

          if (data) {
            
            setAccountType(data[0].AccountType)

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

  },[])

  return (
    <div className='settings'>
      <div className="prvtaccbtn">
        <p>Private Account</p>
        <div
          className={accounttype==='private' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={handleToggle}
        >
          <div className="toggle-circle"></div>
        </div>
      </div>
    </div>
  )
}

export default Settings

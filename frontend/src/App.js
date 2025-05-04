import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Chatting from './pages/Chatting1.jsx';
import { useCart } from './Context.jsx';
import Search from './pages/Search.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import Followers from './pages/Followers.jsx';
import Following from './pages/Following.jsx';
import PostDetails from './pages/PostDetails.jsx';
import ReelsDetails from './pages/ReelsDetails.jsx';
import CreatePost from './pages/CreatePost.jsx';




function App() {

  const {logindata} = useCart()
  
  
  
  return (
    <div className="App">

      {
        logindata.name ===null || logindata.name==="" ? '':<NavBar/> 
      }
      
      
      <Routes>
         <Route path='/' element={<Login/>}/>
      
        <Route path='/chat' element={<Chatting/>}/>
       {/*<Route path='/chat/:name' element={<Chatting/>}/>*/ } 
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile/:name' element={<Profile/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/notifications' element={<Notifications/>}/>
        <Route path='/followers/:uid' element={<Followers/>}/>
        <Route path='/following/:uid' element={<Following/>}/>
        <Route path='/setting/:name' element={<Settings/>}/>
        <Route path='/postdescription/:postid' element={<PostDetails/>}/>
        <Route path='/reeldescription/:reelid' element={<ReelsDetails/>}/>
        <Route path='/create' element={<CreatePost/>}/>
       

        
      </Routes>
      
      
    </div>
  );
}

export default App;

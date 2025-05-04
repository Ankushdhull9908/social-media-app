
import express from "express"
import http from 'http'
import { Server } from "socket.io"
import cors from "cors"
import connectDB from "./dbconnection.js";
import { signup } from "./Schemas/SignUp.js";
import mongoose from "mongoose"
import { userSocialSchema } from "./Schemas/UserSocial.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './Config/Cloudinary.js'
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from "multer"
import path from "path"
import socketHandler from "./Socket/WebSockethandler.js";
import { postschema } from "./Schemas/Posts.js";
//sconst __dirname = path.resolve();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve the static files from the React app


// Set up the upload directory pat



const server = http.createServer(app);

app.use(cors({
  origin: 'https://social-media-app-2-aclu.onrender.com',
  methods: ['GET', 'POST']
}));

connectDB()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static(path.join(__dirname, 'frontend', 'public')));

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your_app_folder', // optional, like 'myAppUploads'
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }], // optional
  },
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html.


app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    console.log("Image uploaded to Cloudinary:", req.file.path);
    res.json({ imageUrl: req.file.path });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

const signupmodel = mongoose.model('signup', signup);
const UserSocial = mongoose.model('UserSocial', userSocialSchema);
const postmodel = mongoose.model('posts',postschema)

app.post('/uploadnewpost', async (req, res) => {
  const { postId, userId, username, imgurl, postbio, userProfile } = req.body;
  console.log(req.body)

  try {
    const post = new postmodel({
      postId:postId,
      userId,
      username,
      imgurl,
      postbio,
      userProfile,
      likes: [],
      Comments: []
    });

    await post.save();

    res.json({ message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
});

app.post('/givelike/:postid',async (req,res)=>{
  const {likeid,username,userfullname,userprofile} = req.body
  const {postid} = req.params
  console.log(req.body,req.params)
  try {
    // Add to FOLLOWING array of the follower
    
      await postmodel.findOneAndUpdate(
      { postId: postid },
      {
        $addToSet: {
          likes: {
            likeid: likeid,
            UName: username,
            uProfile:userprofile,
            uFullName:userfullname
          }
        }
      }
    );

    res.status(200).json({ message: 'Liked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Follow failed' });
  }
})


app.post('/allpost/:name',async (req,res)=>{

  const {name} = req.params
  try{
    const data = await postmodel.find({username:name})
    res.json({data})

  }catch(error)
  {
    console.log(error)

  }
}
)

app.post('/specificpostdetails/:postid',async (req,res)=>{

  const {postid} = req.params
  try{
    const data = await postmodel.find({postId:postid})
    res.json({data})

  }catch(error)
  {
    console.log(error)

  }
}
)



app.post('/signup', async (req, res) => {
  const { email, password, fullname, username,userprofile } = req.body;

  function generaterandomuserid() {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  const uid = "user" + generaterandomuserid();

  const data = {
    userId: uid,
    email,
    password,
    fullname,
    username,
    userprofile
  };

  try {
    const user = new signupmodel(data);
    await user.save();

    const userSocial = new UserSocial({ userId: uid,Uname:username,AccountType:'public',userprofile:userprofile });  // ✅ FIXED HERE
    await userSocial.save();

    

    console.log("User registered successfully");
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post('/uploaduserprofile', async (req, res) => {
  console.log('it worked')
  const { imgurl, userId } = req.body;

  try {
      await signupmodel.updateOne(
      { userId: userId },
      { $set: { userprofile: imgurl } }

      
    );

    await UserSocial.updateOne(
      { userId: userId },
      { $set: { userprofile: imgurl } 
    })

    res.json("Successfully updated");
  } catch (error) {
    res.json(error);
  }
});


app.post('/switchtoprvtacc',async(req,res)=>{
  const {userId,accounttype} = req.body
 
  try{

    await UserSocial.findOneAndUpdate(
      { userId: userId },
      { $set: { AccountType: accounttype }  }
  )

  res.status(200).json({ message: 'Now Ur Account is',accounttype });

  }catch(error)
  {
    res.json({message:error})
  }
})

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    
    
    const user = await signupmodel.find({ username: username, password: password })
    
    
    if(user.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })  
    }
    
    return res.status(200).json({ 
      message: "User logged in successfully",
      data: {
        name: user[0].username,
        fullname: user[0].fullname,
        userId: user[0].userId,
        email: user[0].email,
        userprofile:user[0].userprofile
      }
    })

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})


app.post('/search/:name', async (req, res) => {
  const { name } = req.params;  
  
  const { search } = req.body;
  
  try {
    const user = await signupmodel.find({ username: search })

    
    if(user.length === 0) {
      return res.status(400).json({ message: "No user found" })
    } 

    return res.status(200).json({
      message: "User found",
      data: {
        name: user[0].username,   
        fullname: user[0].fullname,
        email: user[0].email,
        userId: user[0].userId,
        userprofile:user[0].userprofile
      }
    })
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });

  }
})

app.get('/getuserfollowee/:search', async (req, res) => {
  const { search } = req.params;

  try {
    const user = await UserSocial.find({ userId: search })
    //console.log('data is',user)

    if(user.length === 0) {
      return res.status(400).json({ message: "No data" })
    } 

    return res.json(user)
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });

  }
})

// POST /follow
app.post('/follow', async (req, res) => {
  const { followeeId, followeeName, followerId, followerName,followeeImg,followerImg } = req.body;
  console.log(followeeId,followeeName)
  console.log(followerId,followerName)
  console.log(followerImg)
  console.log(followeeImg)

  

  console.log(followerName, 'wants to follow', followeeName);

  try {
    // Add to FOLLOWING array of the follower
    
      await UserSocial.findOneAndUpdate(
      { userId: followerId },
      {
        $addToSet: {
          Following: {
            userId: followeeId,
            Uname: followeeName,
            userprofile:followeeImg,
            

          }
        }
      }
    );

    // Add to FOLLOWER array of the followee
    await UserSocial.findOneAndUpdate(
      { userId: followeeId },
      {
        $addToSet: {
          Follower: {
            userId: followerId,
            Uname: followerName,
            userprofile:followerImg,
          }
        }
      }
    );

    res.status(200).json({ message: 'Followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Follow failed' });
  }
});

app.post('/unfollow', async (req, res) => {
  const { followeeId, followerId } = req.body;

  console.log('FOLLOWER ID:', followerId, 'wants to unfollow FOLLOWEE ID:', followeeId);

  try {
    // Remove from FOLLOWING array of the follower
    await UserSocial.findOneAndUpdate(
      { userId: followerId },
      {
        $pull: {
          Following: { userId: followeeId }
        }
      }
    );

    // Remove from FOLLOWER array of the followee
    await UserSocial.findOneAndUpdate(
      { userId: followeeId },
      {
        $pull: {
          Follower: { userId: followerId }
        }
      }
    );

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unfollow failed' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});



const io = new Server(server, {
  cors: {
    origin: "https://social-media-app-2-aclu.onrender.com",
    methods: ["GET", "POST"]
  }
});


socketHandler(io)

server.listen(8080, () => {
  console.log('Socket.IO server running on http://localhost:8080');
});

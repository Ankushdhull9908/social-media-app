import mongoose from "mongoose"

const LikesSchema = new mongoose.Schema({
    likeid:{
        type:String,
        required:true,
        
    },
    uName:{
        type:String,
        required:true
    },
    uProfile:{
        type:String,
        required:true
    },
    uFullName:{
        type:String,
        required:false
    }
      
})

const commentschema = new mongoose.Schema({
        commentId:{
            type:Number,
            required:true,
           
        },
        comment:{
            type:String,
        required:true

        },uName:{
            type:String,
        required:true
            
        },
        uProfile:{
            type:String,
        required:true

        },
        NumberOflikes:{
            type:Number

        }

    
    })

export const postschema = new mongoose.Schema({
    postId:{
        type:Number,
        required:true,
        unique:true
    },
    userId:{
        type:String,
        required:true,
     
       
    },
    username:{
        type:String,
        required:true,
       
    },
    imgurl:{
        type:String,
        required:true,
    },
    postbio:{
        type:String,
        required:false
        
    },
    userProfile:{
        type:String,
        required:true
    },
    likes:{
        type:[LikesSchema],
        required:false
        
    },
    Comments:{
        type:[commentschema],
        required:false
    }
},{timestamps: true})


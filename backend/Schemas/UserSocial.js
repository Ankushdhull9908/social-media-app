import mongoose from 'mongoose';

// Define Follower structure first
const FollowerStructure = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
     
    },
    Uname: {
        type: String,
        required: true,
        
        
    },
    userprofile:{
        type:String,
        required:false

    },
    uFullname:{
        type:String,
        required:false

    }
}, { _id: false }); // _id: false to prevent creating _id for each subdocument

// Now define main user schema
export const userSocialSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        
    },
    userprofile:{
        type:String,
        required:true

    },
    Uname: {
        type: String,
        required: true,
        unique:true
        
    },
    AccountType: {
        type: String,
        required: true,
    },
    Follower: {
        type: [FollowerStructure],
        default: [],
    },
    Following: {
        type: [FollowerStructure],
        default: [],
    }
});

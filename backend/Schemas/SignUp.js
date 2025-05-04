import mongoose from 'mongoose';

export const signup = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userprofile:{
        type:String,
        required:true

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
   
});



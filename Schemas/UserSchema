const { Timestamp } = require("bson");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

userSchema = new Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    profilePic: {
        type: String,
        default:"/images/profilePic.png"
    },
    coverPic: {
        type: String,
        default:"/images/coverImage.jpg"
    },
    likes:[{
        type: Schema.Types.ObjectId,ref:'Post'
    
    }],
    friends:[{
        type: Schema.Types.ObjectId,ref:'User'
    
    }]
},{timestamps: true});

var User = mongoose.model("User",userSchema);
module.exports = User;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type:String,
        trim:true
    },
    postedBy: {
        type: Schema.Types.ObjectId,ref:'User'
    },
    likes:[{
        type: Schema.Types.ObjectId,ref:'User'
    }],
    comments:[{
        user:{type: Schema.Types.ObjectId,ref:'User'},
        content:String

    }],
    isShared:Boolean,
    orginalPost: {type: Schema.Types.ObjectId,ref:'Post'},

},{timestamps: true});

var Post = mongoose.model("Post",postSchema);
module.exports = Post;
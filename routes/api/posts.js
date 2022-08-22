const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const mongoose = require("mongoose");
const session = require('express-session');



app.use(bodyParser.urlencoded({ extended: false }));



router.get("/", async function(req,res,next){

    var friendsIds = req.session.user.friends;
    friendsIds.push(req.session.user._id);
    Post.find({postedBy:{ $in : friendsIds}})
    .populate("postedBy")
    .populate({
            path: 'orginalPost'
    })
    .sort({"createdAt": -1})

    .then(async function(results){
        results = await User.populate(results,{path:"orginalPost.postedBy"});
                
        res.status(200).send(results);
     })


    
    })

    // Post.find({searchObj})
    // .populate("postedBy")
    // .populate({
    //     path: 'orginalPost',
    //     populate: {
    //         path: 'postedBy'
    //     }})
    // .sort({"createdAt": -1})
    // .then(async function(results){
    //     res.status(200).send(results);
    // })
    // .catch(error => {
    //     console.log(error);
    //     res.sendStatus(400);
    // })
// })

router.get("/user/:id",function(req,res,next){
    Post.find({postedBy: req.params.id})
    .populate("postedBy")
    .populate({
        path: 'orginalPost',
        populate: {
            path: 'postedBy'
        }})
    .sort({"createdAt": -1})
    .then(async function(results){
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/:id",function(req,res,next){
    Post.findOne({_id: req.params.id})
    .populate("postedBy")
    .then(async function(result){
        res.status(200).send(result);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/:id/comment",function(req,res,next){
    Post.findOne({_id:req.params.id})
    .populate({
        path: 'comments',
        populate: {
            path: 'user' 
        }})
    .sort({"createdAt": -1})
    .then(async function(results){
        res.status(200).send(results.comments);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/",function(req,res,next){
    if (!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }
    
    var postData = {
        content: req.body.content,
        postedBy: req.session.user,
        isShared:false
    }
    //insert the new post to the database
    Post.create(postData)
    .then(async function(newPost){
        newPost = await User.populate(newPost, { path: "postedBy" });
        return res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/:id/share", async function(req, res){
    if (!req.body.content) {
        console.log("share Content param not sent with request");
        return res.sendStatus(400);
    }
    
    var postData = {
        content: req.body.content,
        postedBy: req.session.user,
        isShared:true,
        orginalPost: req.params.id
    }

    //insert the new sharedpost to the database
    Post.create(postData)
    .then(async function(newPost){
        newPost = await User.populate(newPost, { path: "postedBy" });
        newPost = await User.populate(newPost, {path: 'orginalPost',populate: {path: 'postedBy'}});
        return res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:id/like", async function(req, res, next){

    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    res.status(200).send(post)
})

router.put("/:id/comment", async function(req, res){

    var postId = req.params.id;
    var userId = req.session.user._id;

    var post = await Post.findByIdAndUpdate(postId, { $push: { comments: {"user": userId , "content":req.body.comment} } }, { new: true})
    .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    Post.findOne({_id:postId})
    .populate({
        path: 'comments',
        populate: {
            path: 'user' 
        }})
    .sort({"createdAt": 1})
    .then(async function(results){
        res.status(200).send(results.comments[results.comments.length-1]);
    })
})


router.delete("/:id", async function(req,res,next){
    Post.findByIdAndDelete(req.params.id)
    .then(function(){
        res.sendStatus(202);
    })
    .catch(function(err){
        console.log(err);
        res.sendStatus(400);
    })
})


module.exports = router;
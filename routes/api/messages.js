const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');
const mongoose = require("mongoose");
const session = require('express-session');



app.use(bodyParser.urlencoded({ extended: false }));



router.post("/", async function(req, res, next){
    if(!req.body.content || !req.body.chatId){console.log("invalid data passed into request")
    return res.sendStatus(400)}
    let newMessage = {
        sender: req.session.user._id,
        content:req.body.content,
        chat:req.body.chatId
    }    
    Message.create(newMessage)
    .then(async function(message){
        message = await Message.populate(message , {path : "sender"});
        message = await Message.populate(message , {path : "chat"});

        Chat.findByIdAndUpdate(req.body.chatId, {latestMessage : message})
        .catch(err=>console.log(err))

        res.send(message)
    })
    .catch(err=>console.log(err))
})


module.exports = router;
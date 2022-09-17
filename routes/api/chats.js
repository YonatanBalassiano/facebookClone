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

router.get("/",async  function(req, res){
    Chat.find({users : {$elemMatch : {$eq : req.session.user._id}}})
    .populate({path: 'users'})
    .populate({
        path: 'latestMessage',
        populate: {
            path: 'sender' 
        }})
    .sort({updatedAt:-1})
    .then(function(result){
        res.send(result)
    })
    .catch(err => console.log(err))
})

router.get("/:chatId/messages",async  function(req, res){
    Message.find({chat :req.params.chatId})
    .populate({path: 'sender'})
    .then(function(result){
        res.send(result)
    })
    .catch(err => console.log(err))
})

router.get("/:id1/:id2",async  function(req, res){
    let id1 = mongoose.Types.ObjectId(req.params.id1)
    let id2 = mongoose.Types.ObjectId(req.params.id2)

    let usersId = [id1,id2]
    
    if(req.session && req.session.user){

        let currChat = await Chat.find({users: {$all : [id1,id2] }})
        currChat = currChat[0]

        if(currChat!=undefined){
            res.send(currChat)
            
        }
        else{
            Chat.create({chatName : "name" , users : usersId, latestMessage :undefined})
            .then((currChat) =>{
                res.send(currChat)
            })
            .catch(err=> console.log(err))
            
        }
    }
    else{
        res.redirect("/Login")
    }
    
})

router.post("/", async function(req, res, next){
    if(!req.params.user){
        console.log("Users params not sent with request");
        return res.sendStatus(400);
    }

    let user = JSON.parse(req.body.user);
    if(users.length == 0){
        console.log("users array is empty");
        return res.sendStatus(400);
    }

    chat.create(chatData)
    .then(function(results){
        res.send(results)
    })
    .catch(function(err){
        res.sendStatus(400);
        console.log(err)
    })

    

    
})


module.exports = router;
const express = require("express");
const Router = express.Router;
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");
const Chat =  require("../schemas/ChatSchema");
const mongoose = require('mongoose');



const app = express();
const router = express.Router();

//initialize 
app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended: false}));

router.get("/", function(req, res){
    if(req.session && req.session.user){
    var payload = {
        pageTitle: "Messages",
        userLoggedIn:req.session.user,
        chat : "",
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.render("inboxPage",payload);
    }
    else{
        res.redirect("/Login")
    }
})


router.get("/:id",async  function(req, res){
    if(req.session && req.session.user){
        if(req.params.id!=undefined){
            let chat = await Chat.findOne({_id: req.params.id})
        .populate({path: 'users'})
        
        
        let payload = {
            pageTitle: "Messages",
            userLoggedIn:req.session.user,
            chat: chat,
            otherUser: chat.users[0]._id == req.session.user ? chat.users[1] : chat.users[0],
            userLoggedInJS: JSON.stringify(req.session.user)
        }
        res.render("chatPage",payload);

        }
        }
        else{
            res.redirect("/Login")
        }
})




module.exports = router;

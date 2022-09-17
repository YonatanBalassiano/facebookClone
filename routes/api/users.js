const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const mongoose = require("mongoose");
const session = require('express-session');



app.use(bodyParser.urlencoded({ extended: false }));

router.get("/" , async function(req, res, next){
    let searchObj = req.query;
    if (req.query.firstName !== undefined || req.query.lastName!== undefined){
        searchObj = {
            $or : [
                {firstName: new RegExp(searchObj.firstName , 'i')},
                {firstName: new RegExp(searchObj.lastName , 'i')},
                {lastName: new RegExp(searchObj.firstName , 'i')},
                {lastName: new RegExp(searchObj.lastName , 'i')}
            ]
        }
    }

    User.find(searchObj)
    .then(function(result){
        res.status(200).send(result)
    })
    .catch(err => console.log(err))
})

router.put("/:id/friends", async function(req, res, next){

    let otherUserId = req.params.id;
    let userId = req.session.user._id;
    let otherUser = await User.findById(otherUserId)

    let isFriends = otherUser.friends && otherUser.friends.includes(userId);

    let option = isFriends ? "$pull" : "$addToSet";


    otherUser= await User.findByIdAndUpdate(otherUserId, { [option]: {friends : userId} }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert to user logged in
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { friends: otherUserId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(req.session.user)
})


module.exports = router;
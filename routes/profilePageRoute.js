const express = require("express");
const Router = express.Router;
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

const app = express();
const router = express.Router();

//initialize 
app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended: false}));

router.get("/", function(req, res){
    if(req.session && req.session.user){
        let payload = {
        pageTitle: "Profile",
        userLoggedIn:req.session.user,
        profileUser:req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.render("profilePage",payload);
    }
    else{
        res.redirect("/Login")
    }
})

router.get("/:id", async function(req, res){
    if(req.session && req.session.user){
        let userDetails = await User.findOne({_id: req.params.id})
    .populate()
    let payload = {
        pageTitle: "Profile",
        userLoggedIn:req.session.user,
        profileUser:userDetails,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.render("profilePage",payload);
    }
    else{
        res.redirect("/Login")
    }
})



module.exports = router;

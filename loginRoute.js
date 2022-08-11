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

router.get("/" ,function(req,res){
    res.render("login");
})

router.post("/",async function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    //password = await bcrypt.hash(password, 5);
    payload = {errorMessage:""}
    if(email && password){
        var user = await User.findOne({email:email})
        .catch(function(err){
            console.log(err);
            payload.errorMessage = "Something went wrong.";
            return res.render("login", payload);
        }) 
        
        if(user!=null){
            var result = await bcrypt.compare(password,user.password)
            if(result==true){
                req.session.user = user;
                return res.redirect("/");
            }
        }
        payload.errorMessage = "login credentials incorrect";
        return res.render("login", payload);
    }
    payload.errorMessage = "Not all fields are filled";
    return res.render("login", payload);
    


})

module.exports = router;
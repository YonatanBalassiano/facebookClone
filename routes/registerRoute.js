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
    res.render("register");
})

router.post("/",async function(req,res){
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.email.trim();
    let password = req.body.password;
    let payload = req.body;

    if(firstName && lastName && email && password){ // if all values are valid
        let user = await User.findOne({email: email})
        .catch(function(err){
            console.log(err);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);
        })
        
        if(user == null){ //no user with that email

            //hashing password
            let cryptpassword = await bcrypt.hash(password, 5);
            User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password:cryptpassword
            })
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else{ //find a user with that email
            payload.errorMessage = "Email already in use.";
            res.status(200).render("register", payload);
        }

    }else{// when we have a missing value

    }

})

module.exports = router;
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
    var payload = createPayload(req.session.user);
    res.render("searchPage",payload);
    }
    else{
        res.redirect("/Login")
    }
})

function createPayload(userLoggedIn){
    return  {
        pageTitle: "Search",
        userLoggedIn:userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    }
}




module.exports = router;

const express = require("express");
const Router = express.Router;
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

const app = express();
const router = express.Router();

router.get("/", function(req,res,next){

    if(req.session){
        req.session.destroy(function(){
            res.redirect("/login");
        })
    }
})


module.exports = router;


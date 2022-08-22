const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");


const app = express();


//database connection
const mongoose = require("mongoose");
const { homedir } = require("os");
mongoose.connect("mongodb://localhost:27017/FacebookCloneDB", {useNewUrlParser: true});


//initialize 
app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))



//port listening
app.listen ("3005", function(){
    console.log("listen on port 3005");
})

//Routes
const loginRoute = require("./routes/loginRoute");
app.use("/login", loginRoute);

const registerRoute = require("./routes/registerRoute");
app.use("/register", registerRoute);

const logoutRoute = require("./routes/logoutRoute");
app.use("/logout", logoutRoute);

const resetRoute = require("./routes/resetRoute");
app.use("/reset", resetRoute);

const profilePageRoute = require("./routes/profilePageRoute");
app.use("/profile", profilePageRoute);

const searchRoute = require("./routes/searchRoute");
app.use("/search", searchRoute);

const postsApiRoutes = require("./routes/api/posts");
app.use("/api/posts", postsApiRoutes);

const usersApiRoutes = require("./routes/api/users");
app.use("/api/users", usersApiRoutes);





app.get("/", function(req, res){
    if(req.session && req.session.user){
    var payload = {
        pageTitle: "Home",
        userLoggedIn:req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }

    res.render("home",payload);
    }
    else{
        res.redirect("/Login")
    }
})







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
const registerRoute = require("./routes/registerRoute");
const logoutRoute = require("./routes/logoutRoute");
const resetRoute = require("./routes/resetRoute");
const profilePageRoute = require("./routes/profilePageRoute");
const searchRoute = require("./routes/searchRoute");
const messagesRoute = require("./routes/messagesRoute");


//API routes
const postsApiRoutes = require("./routes/api/posts");
const usersApiRoutes = require("./routes/api/users");
const ChatsApiRoutes = require("./routes/api/chats");
const MessagesApiRoutes = require("./routes/api/messages");


app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/reset", resetRoute);
app.use("/profile", profilePageRoute);
app.use("/search", searchRoute);
app.use("/messages", messagesRoute);
app.use("/api/posts", postsApiRoutes);
app.use("/api/users", usersApiRoutes);
app.use("/api/Chats", ChatsApiRoutes);
app.use("/api/messages", MessagesApiRoutes);



app.get("/", function(req, res){
    if(req.session && req.session.user){
        let payload = {
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







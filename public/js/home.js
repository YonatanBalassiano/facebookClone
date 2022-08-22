$(document).ready(function(){
    $.get("/api/posts",{friendsOnly:true} ,function(results){
        outputPosts(results , $(".postsContainer"));
    })
})
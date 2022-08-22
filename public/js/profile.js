$(document).ready(function(){
    getUserPosts();
})




function getUserPosts (){
    $.get("/api/posts/user/"+profileUserId,function(results){
        outputPosts(results , $(".postsContainer"));
    })
}
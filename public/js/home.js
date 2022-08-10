$(document).ready(function(){
    $.get("/api/posts", function(results){
        outputPosts(results , $(".postsContainer"));
    })
})


$("#postTextarea").keyup(function(event){
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0 ) return alert("no submit button")

    if(value == ""){
        submitButton.prop("disabled",true)
        return;
    }

    submitButton.prop("disabled",false)
})

$("#submitPostButton").click(function(){
    var button = $(event.target);
    var textbox = $("#postTextarea");


    var data = {
        content: textbox.val()
    }
    
    
    $.post("/api/posts", data, postData => {
        var html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

$(document).on("click",".likeButton", function(event){
    var button = $(event.target);
    var postId = getPostId(button);
    if (postId == undefined){return;}
    $.ajax({
        url:`/api/posts/${postId}/like`,
        type: "PUT",
        success: function(postData){
            button.find("span").text(postData.likes.length || "");
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click",".submitCommentButton", function(event){
    var button = $(event.target);
    var postId = getPostId(button);
    if (postId == undefined){return;}
    if(document.getElementById(`commentArea${postId}`).value.trim() == ""){return}
    $.ajax({
        url:`/api/posts/${postId}/comment`,
        type: "PUT",
        data:{
            postId : postId,
            comment: document.getElementById(`commentArea${postId}`).value
        },
        success: function(postData){
            document.getElementById(postId).innerHTML+=createCommentHtml(postData);
            // document.getElementById(`firstFooter${postData._id}`).value=`${postdata.commentPosts.length}`
        }
    })
})

$(document).on("click",".commendButton", function(event){
    var button = $(event.target);
    var postId = getPostId(button);
    buttonId = `commentPostContainter${postId}`;
    if (postId == undefined){return;}

    var temp = document.getElementById(buttonId).style.display;
    if(temp == "none"){temp = "block"}
    else{temp = "none"}
    document.getElementById(buttonId).style.display = temp;

    
    
})

$(document).on("click",".shareButton", function(event){
    var button = $(event.target);
    var postId = getPostId(button);
    
    
    var data={ content:"some englidh ehere"}
    
    $.post(`/api/posts/${postId}/share`, data, function(postData) {
        console.log("yes we did it")
        
    })
    
})

function createPostHtml(postData){
    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    return `<div class="postContainer" id="${postData._id}">
                <div class="postHeader">
                    <div>
                    <div class=""><button><i class="fa-solid fa-ellipsis"></i></button></div>
                    </div>
                    <div class="postUserInfo"><span> <b>${postData.postedBy.firstName} ${postData.postedBy.lastName}</b></span><span>${timeDifference(new Date(), new Date(postData.createdAt))}</span></div>
                        <div class="userImageContainer"><img src="/images/profilePic.png" alt="" /></div>
                </div>
                <div class="postContent">
                    <p>${postData.content}</p>
                </div>
                <div class="postImg">
                </div>
                <div class="firstFooter">
                    <div class="firstFooterR" id="firstFooter${postData._id}"><span></span></div>
                    <div class="firstFooterL"><span>22</span></div>
                </div>
                <hr />
                <div class="postFooter">
                    <div class="postButtonContainer"><button class="shareButton"><i class="fa-solid fa-share-from-square"> </i></button>
                    </div>
                    <div class="postButtonContainer"><button class="commendButton"><i class="fa-solid fa-message"></i></button>
                    </div>
                    <div class="postButtonContainer"><button class="likeButton ${likeButtonActiveClass}"><i class="fa-solid fa-thumbs-up"></i><span>${postData.likes.length || ""}</span></button>
                    </div>
                </div>
                <hr class="hrDown" id="activeHr"/>
                <div class="commentPostContainter" id="commentPostContainter${postData._id}">
                    <hr/>
                    <div class="commentMain">
                    <button class="submitCommentButton" id="submitComment${postData._id}">post</button>
                    <div class="commentContentContainer">
                            <input id="commentArea${postData._id}" class="commentTypeInput" type='search' placeholder='Search' aria-label='Search'/>
                    </div>
                    <div class="userImageCommentContainer"><img src="/images/profilePic.png" alt="" /></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-3"></div>
        `

}

function createCommentHtml(content){
    return `<div class="commentsContainter">
    <div class="commentMain">
    <div class="commentcontent">
        <span><b>${content.user.firstName} ${content.user.lastName}</b></span>
        <p>${content.content}</p>
    </div>
    <div class="userImageContainer"><img src="/images/profilePic.png" alt="" /></div>
    </div>
</div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPosts(results, container){
    container.html("");

    results.forEach(function(result) {
        var html ="";
        var index = 0;
        

        if(result.isShared == true){
            html = createSharePostHtml(result);
        }else{
            html = createPostHtml(result);
        }
        container.append(html);
        if(result.comments.length!=0){
            $.get(`/api/posts/${result._id}/comment`, function(comments){

                comments.forEach(function(comment){
                    console.log(comment)
                    console.log(result._id)
                    document.getElementById(result._id).innerHTML+=createCommentHtml(comment);
                })
            })
        }
    });
    
    if(results.length == 0){container.append("<span>Nothing posted yet</span>")}
}

function getPostId (element){
    var isRoot = element.hasClass("#postContainer");
    var rootElement = isRoot ? element : element.closest(".postContainer").attr('id');    
    return rootElement;
}

function createSharePostHtml(postData){
    return `<div class="postContainer" id="${postData._id}">
                <div class="postHeader">
                    <div>
                    <div class=""><button><i class="fa-solid fa-ellipsis"></i></button></div>
                    </div>
                    <div class="postUserInfo"><span> <b>${postData.postedBy.firstName} ${postData.postedBy.lastName}</b></span><span>${timeDifference(new Date(), new Date(postData.createdAt))}</span></div>
                        <div class="userImageContainer"><img src="/images/profilePic.png" alt="" /></div>
                </div>
                <div class="postContent">
                    
                <p>${postData.content}</p>

            <!-- start of inside -->
                    <div class="postContainer" id="${postData._id}">
                        <div class="postHeader">
                            <div>
                            <div class=""><button><i class="fa-solid fa-ellipsis"></i></button></div>
                            </div>
                            <div class="postUserInfo"><span> <b>${postData.orginalPost.postedBy.firstName} ${postData.orginalPost.postedBy.lastName}</b></span><span>${timeDifference(new Date(), new Date(postData.orginalPost.createdAt))}</span></div>
                                <div class="userImageContainer"><img src="/images/profilePic.png" alt="" /></div>
                        </div>
                        <div class="postContent">
                            <p>${postData.orginalPost.content}</p>
                        </div>
                        <div class="postImg">
                        </div>
                    </div>
            <!-- end of inside -->







                </div>
                <div class="postImg">
                </div>
                <div class="firstFooter">
                    <div class="firstFooterR" id="firstFooter${postData._id}"><span></span></div>
                    <div class="firstFooterL"><span>22</span></div>
                </div>
                <hr />
                <div class="postFooter">
                    <div class="postButtonContainer"><button class="shareButton"><i class="fa-solid fa-share-from-square"> </i></button>
                    </div>
                    <div class="postButtonContainer"><button class="commendButton"><i class="fa-solid fa-message"></i></button>
                    </div>
                    <div class="postButtonContainer"><button class="likeButton"><i class="fa-solid fa-thumbs-up"></i><span></span></button>
                    </div>
                </div>
                <hr class="hrDown" id="activeHr"/>
                <div class="commentPostContainter" id="commentPostContainter${postData._id}">
                    <hr/>
                    <div class="commentMain">
                    <button class="submitCommentButton" id="submitComment${postData._id}">post</button>
                    <div class="commentContentContainer">
                            <input id="commentArea${postData._id}" class="commentTypeInput" type='search' placeholder='Search' aria-label='Search'/>
                    </div>
                    <div class="userImageCommentContainer"><img src="/images/profilePic.png" alt="" /></div>
                    </div>
                </div>
            </div>

            <div class="mb-3"></div>
        `

}
$("#postTextarea , #shareTextarea").keyup(function(event){
    let textbox = $(event.target);
    let value = textbox.val().trim();

    let isModal = textbox.parents(".modal").length ==1;

    let submitButton = isModal ? $("#submitShareButton") : $("#submitPostButton");

    if(submitButton.length == 0 ) return alert("no submit button")

    if(value == ""){
        submitButton.prop("disabled",true)
        return;
    }

    submitButton.prop("disabled",false)
})

$("#submitPostButton").click(function(){
    let button = $(event.target);
    let textbox = $("#postTextarea");


    let data = {
        content: textbox.val()
    }
    
    
    $.post("/api/posts", data, postData => {
        let html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

$(document).on("click",".likeButton", function(event){
    let button = $(event.target);
    let postId = getPostId(button);
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
    let button = $(event.target);
    let postId = getPostId(button);
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
            document.getElementById(`commentPostContainter${postId}`).style.display = "none";
            document.getElementById(`hr${postId}`).style.display = "block";

        },
        error: function(err){
            console.log(err)
        }
    })
})

$(document).on("click",".commendButton", function(event){
    let button = $(event.target);
    let postId = getPostId(button);
    buttonId = `commentPostContainter${postId}`;
    if (postId == undefined){return;}

    let temp = document.getElementById(buttonId).style.display;
    if(temp == "none"){temp = "block"}
    else{temp = "none"}
    document.getElementById(buttonId).style.display = temp;

    
    
})
//friendButton press - get user ID
$(document).on("click",".friendButton", function(event){
    let button = $(event.target);
    let userId = button.data().id;

    $.ajax({
        url:`/api/users/${userId}/friends`,
        type: "PUT",
        success: function(data){
            
            if (data.friends && data.friends.includes(userId)){
                button.addClass("friends");
                button.text("friends");
            } 
            else{
                button.removeClass("friends");
                button.text("friend request");
            }
        },
        error: function(err){
            console.log(err)
        }
    })
    
    
    
})

$("#shareModal").on("show.bs.modal", function(event){
    let button = $(event.relatedTarget);
    let postId = getPostId(button);
 
    $.get(`/api/posts/${postId}`, function(result){
    addPostToModal(result,$("#orginalPostContainer"))
    })


    $(document).on("click","#submitShareButton", function(event){        
        let data={ content:document.getElementById("shareTextarea").value}
        
        $.post(`/api/posts/${postId}/share`, data, function(postData){
            $(".postsContainer").prepend(createSharePostHtml(postData))
        })
    

    })
    document.getElementById("shareTextarea").value = "";


})

$("#deletePostModal").on("show.bs.modal", function(event){
    let button = $(event.relatedTarget);
    let postId = getPostId(button);

    $(document).on("click","#modalDeleteButton", function(event){        

        $.ajax({
            url:`api/posts/${postId}`,
            type:"DELETE",
            success: ()=>{ location.reload();},
            error: (err)=> console.log(err)
            
        })
    })

})

$(document).on("click",".massegeButton", function(event){
    console.log(userLoggedIn.firstName)
    console.log(profileUserId)

    $.ajax({
        url:`/api/chats/${profileUserId}/${userLoggedIn._id}`,
        type: "get",
        success: function(chat){
           if(! chat || !chat._id) console.log("chats didnt found");
           window.location.href = `/messages/${chat._id}`;

            
        },
        error: function(err){
            console.log(err)
        }
    })
    

})

function createPostHtml(postData){
    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    let deleteButton = "";
    if (postData.postedBy._id == userLoggedIn._id){
        deleteButton = `<button type="button" class="DeletePostButton" data-toggle="modal" data-target="#deletePostModal"><i class="fa-solid fa-xmark"></i></button>`
    }
    return `<div class="postContainer" id="${postData._id}">
                <div class="postHeader">
                    <div>
                    <div class=""><button><i class="fa-solid fa-ellipsis"></i></button>${deleteButton}</div>
                    </div>
                    <div class="postUserInfo"><span><a href="../profile/${postData.postedBy._id}"><b>${postData.postedBy.firstName} ${postData.postedBy.lastName}</b></a></span>
                    <span>${timeDifference(new Date(), new Date(postData.createdAt))}</span></div>
                        <div class="userImageContainer"><img src="${postData.postedBy.profilePic}" alt="" /></div>
                </div>
                <div class="postContent">
                    <p>${postData.content}</p>
                </div>
                <div class="postImg">
                </div>
                <hr />
                <div class="postFooter">
                    <div class="postButtonContainer"><button type="button" class="shareButton" data-toggle="modal" data-target="#shareModal"><i class="fa-solid fa-share-from-square"> </i></button>
                    </div>
                    <div class="postButtonContainer"><button class="commendButton"><i class="fa-solid fa-message"></i></button>
                    </div>
                    <div class="postButtonContainer"><button class="likeButton ${likeButtonActiveClass}"><i class="fa-solid fa-thumbs-up"></i><span>${postData.likes.length || ""}</span></button>
                    </div>
                </div>
                <hr class="hrDown" id="activeHr${postData._id}"/>
                <div class="commentPostContainter" id="commentPostContainter${postData._id}" style="display: none;">
                    <div class="commentMain">
                    <button class="submitCommentButton" id="submitComment${postData._id}">post</button>
                    <div class="commentContentContainer">
                            <input id="commentArea${postData._id}" class="commentTypeInput" type='search' placeholder='Comment here' aria-label='Search'/>
                    </div>
                    <div class="userImageCommentContainer"><img src="${userLoggedIn.profilePic}" alt="" /></div>
                    </div>
                </div>
                <hr class="postHr" id="hr${postData._id}"/>
            </div>
            
            <div class="mb-3"></div>
        `

}

function createSharePostHtml(postData){
    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    let deleteButton = "";
    if (postData.postedBy._id == userLoggedIn._id){
        deleteButton = `<button type="button" class="DeletePostButton" data-toggle="modal" data-target="#deletePostModal"><i class="fa-solid fa-xmark"></i></button>`
    }
    
    return `<div class="postContainer" id="${postData._id}">
                <div class="postHeader">
                    <div>
                    <div class=""><button><i class="fa-solid fa-ellipsis"></i></button>${deleteButton}</div>
                    </div>
                    <div class="postUserInfo"><span><a href="../profile/${postData.postedBy._id}"><b>${postData.postedBy.firstName} ${postData.postedBy.lastName}</b></a></span><span>${timeDifference(new Date(), new Date(postData.createdAt))}</span></div>
                        <div class="userImageContainer"><img src="${postData.postedBy.profilePic}" alt="" /></div>
                </div>
                <div class="postContent">
                    
                <p>${postData.content}</p>

            <!-- start of inside -->
                    <div class="postContainer" id="${postData._id}">
                        <div class="postHeader">
                            <div>
                            <div class=""><button><i class="fa-solid fa-ellipsis"></i></button></div>
                            </div>
                            <div class="postUserInfo"><span> <a href="../profile/${postData.orginalPost.postedBy._id}"><b>${postData.orginalPost.postedBy.firstName} ${postData.orginalPost.postedBy.lastName}</b></a></span><span>${timeDifference(new Date(), new Date(postData.orginalPost.createdAt))}</span></div>
                                <div class="userImageContainer"><img src="${postData.orginalPost.postedBy.profilePic}" alt="" /></div>
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

                <hr />
                <div class="postFooter">
                    <div class="postButtonContainer"><button type="button" class="shareButton" data-toggle="modal" data-target="#shareModal"><i class="fa-solid fa-share-from-square"> </i></button>
                    </div>
                    <div class="postButtonContainer"><button class="commendButton"><i class="fa-solid fa-message"></i></button>
                    </div>
                    <div class="postButtonContainer"><button class="likeButton"><i class="fa-solid fa-thumbs-up"></i><span></span></button>
                    </div>
                </div>
                <hr class="hrDown" id="activeHr"/>
                <div class="commentPostContainter" id="commentPostContainter${postData._id}" style="display: none;">
                    <div class="commentMain">
                    <button class="submitCommentButton" id="submitComment${postData._id}">post</button>
                    <div class="commentContentContainer">
                            <input id="commentArea${postData._id}" class="commentTypeInput" type='search' placeholder='Comment here' aria-label='Search'/>
                    </div>
                    <div class="userImageCommentContainer"><img src="${postData.postedBy.profilePic}" alt="" /></div>
                    </div>
                </div>
                <hr class="postHr" id="hr${postData._id}"/>
            </div>

            <div class="mb-3"></div>
        `

}

function createCommentHtml(content){
    return `<div class="commentsContainter">
    <div class="commentMain">
    <div class="commentcontent">
        <span><a href="../profile/${content.user._id}"><b>${content.user.firstName} ${content.user.lastName}</b></a></span>
        <p>${content.content}</p>
    </div>
    <div class="userImageContainer"><img src="${content.user.profilePic}" alt="" /></div>
    </div>
</div>`
}

function timeDifference(current, previous) {

    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

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
        let html ="";
        let index = 0;
        

        if(result.isShared == true){
            html = createSharePostHtml(result);
        }else{
            html = createPostHtml(result);
        }
        container.append(html);
        if(result.comments.length!=0){
            $.get(`/api/posts/${result._id}/comment`, function(comments){

                comments.forEach(function(comment){
                    document.getElementById(result._id).innerHTML+=createCommentHtml(comment);
                })
            })
            document.getElementById(`hr${result._id}`).style.display = "block";

        }
    });
}

function addPostToModal(result, container){
    container.html("");
    let html = createPostHtml(result);
    container.append(html);
    
}

function getPostId (element){
    let isRoot = element.hasClass("#postContainer");
    let rootElement = isRoot ? element : element.closest(".postContainer").attr('id');    
    return rootElement;
}


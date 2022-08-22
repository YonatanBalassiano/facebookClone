
var timer;
$("#searchBox").keydown(async function(event){
    clearTimeout(timer);
    var textBox = $(event.target);
    var value = textBox.val();
    
    timer = setTimeout(() => {
        value = textBox.val().trim().split(" ");

        if (value.length == 0){
            $("resultsContainer").html("");
        }
        else{
            search(value)
        }
    }, 1000);

    
})

function search(searchTerm){
    if(searchTerm.length == 1){
        searchTerm[1] = searchTerm[0];
    }
    console.log(searchTerm)
    $.get("/api/users" , {firstName : searchTerm[0], lastName : searchTerm[1] }, function(results){
        $(".resultsContainer").html("")
        results.forEach(element => {  
            var html = createUserSearchHtml(element)
            $(".resultsContainer").prepend(html)
        });
    })
    .catch(err=> console.log(err))
}

function createUserSearchHtml(user){

    var isFriends = userLoggedIn.friends.includes(user._id) ? true : false
    var text = isFriends ? "Friends" : "Friend request"
    var buttonClass = isFriends ? "friendButton friends" : "friendButton"

    var friendButtonHtml = `<div class="searchFriendButtonContainer">
    <button class = "${buttonClass}", data-id="${user._id}">${text}</button>`
    
    var friendButtonText = user._id==userLoggedIn._id ? "" :  friendButtonHtml

    return `<div class="userSearchContainer">
                <div class ="userImageContainer">
                    <img src="${user.profilePic}" alt="userProfileImage">
                </div>
                <div class = " userSearchData">
                    <div class="userSearchInfo">
                    <span><a href="../profile/${user._id}"><b>${user.firstName} ${user.lastName}</b></a></span>
                    <span>${user.friends.length} friends</span>
                    </div>
                    
                    ${friendButtonText}

                </div>  
                </div>
                </div>
                <hr>

            </div>`
}
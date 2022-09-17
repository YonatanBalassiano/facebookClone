
var timer;
$("#searchBox").keydown(async function(event){
    clearTimeout(timer);
    let textBox = $(event.target);
    let value = textBox.val();
    
    timer = setTimeout(() => {
        value = textBox.val().trim().split(" ");

        if (value[0].length == 0){
            console.log(value)
            $(".resultsContainer").html(`<span class="searchError">Type Something</span>`)
        }
        else{
            console.log(value)
            search(value)
        }
    }, 1000);

    
})

function search(searchTerm){
    if(searchTerm.length == 1){
        searchTerm[1] = searchTerm[0];
    }
    $.get("/api/users" , {firstName : searchTerm[0], lastName : searchTerm[1] }, function(results){
        $(".resultsContainer").html("")
        results.forEach(element => {  
            let html = createUserSearchHtml(element)
            $(".resultsContainer").prepend(html)
        });
        if($(".resultsContainer").html() == "") $(".resultsContainer").html(`<span class="searchError">No Match Found</span>`)
    })
    .catch(err=> console.log(err))
}

function createUserSearchHtml(user){

    let isFriends = userLoggedIn.friends.includes(user._id) ? true : false
    let text = isFriends ? "Friends" : "Friend request"
    let buttonClass = isFriends ? "friendButton friends" : "friendButton"

    let friendButtonHtml = `<div class="searchFriendButtonContainer">
    <button class = "${buttonClass}", data-id="${user._id}">${text}</button>`
    
    let friendButtonText = user._id==userLoggedIn._id ? "" :  friendButtonHtml

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
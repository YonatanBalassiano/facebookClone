$(document).ready(function(){
    $.get("/api/chats", function(data){
        outputChatList(data, $(".resultsContainer"))
    })
})

function outputChatList(ChatList, container){
    ChatList.forEach(chat => {
        let html = creatChatHtml(chat);
        container.append(html)
       
    });
    if(ChatList.length == 0){
        container.append("<span> Nothing to Show</span")
    }
}

function creatChatHtml(chat){
    let otherUser = chat.users[0]._id == userLoggedIn._id ? chat.users[1] : chat.users[0]
    
    let latestMessage = chat.latestMessage == null ? "No messages yet" : `${chat.latestMessage.sender.firstName} ${chat.latestMessage.sender.lastName} ${chat.latestMessage.content}`
    return `<a href="/messages/${chat._id}" class ="chatListItem">
        <div class="userImageContainer">
        <img  src="${otherUser.profilePic}" alt="user's profile picture">
        </div>

        <div class="chatResultsContainer">
            <span class="header">${otherUser.firstName} ${otherUser.lastName}  </span> 
            <span class="subText">${latestMessage}  </span> 
        </div>
    
    </a>`

}
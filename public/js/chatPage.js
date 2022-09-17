
$(document).ready(function(){
    $.get(`/api/chats/${chatId}/messages`, function(messages){
        let messagesArr = [];
        let last

        messages.forEach(message => {
            let html = createMessageHTML(message);
            messagesArr.push(html)
        });

        let messagesHTML = messagesArr.join(""); 
        $(".chatMessages").append(messagesHTML)
    })

    $.get("/api/chats", function(data){
        outputChatList(data, $(".chatResultsContainer"))
    })
})

$(".sendMessageButton").click(function(){
    messageSubmitted()
})

$(".inputTextbox").keydown(function(event){
    if(event.which === 13 && !event.shiftKey){
        messageSubmitted();
        return false;
    }
})

function messageSubmitted(){
    let content = $(".inputTextbox").val().trim();
    if (content != "" ) {sendMessage(content)};
    $(".inputTextbox").val(""); 
}

function sendMessage(content){
    $.post("/api/messages",{content:content, chatId: chatId}, function(data){
        addChatMessageHTML(data)
    })
}

function addChatMessageHTML(message){
    if(!message || !message._id){console.log("message is not valid")}

    let messageDiv = createMessageHTML(message)

    $(".chatMessages").append(messageDiv)
}



function createMessageHTML(message){
    let isMine = message.sender._id == userLoggedIn._id;
    let liClassName = isMine ? "mine" : "theirs";
    return `<li class="message ${liClassName}">
        <div class="messageContainer">
            <span class="messageBody">
                ${message.content}
            </span>
        </div>
    
    
    </li>`
}



// outputting chats in right side of the page


function outputChatList(ChatList, container){
    ChatList.forEach(chat => {
        let html = creatChatHtml(chat);
        container.append(html)
    });
}

function creatChatHtml(chat){
    let otherUser = chat.users[0]._id == userLoggedIn._id ? chat.users[1] : chat.users[0]
    let isHere = chat._id == chatId ? "currChat" : "";
    
    return `<div class="inChatContainer"><a href="/messages/${chat._id}" class ="chatListItem inChat ${isHere}">
        <div class="userImageContainer">
        <img  src="${otherUser.profilePic}" alt="user's profile picture">
        </div>

        <div class="chatResultsContainer">
            <span class="header">${otherUser.firstName} ${otherUser.lastName}  </span> 
        </div>
    
    </a></div>`

}
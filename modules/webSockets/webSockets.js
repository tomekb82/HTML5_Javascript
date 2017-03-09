(function() {

function Chat(host, port){
    this.host = host;
    this.port = port;
    this.initialize();  
};
    
    
Chat.prototype.initialize = function(){
    if(!window.WebSocket) return;

    this.status = document.querySelector("#status");
    
    this.loginInput = document.querySelector("#login");
    this.joinButton = document.querySelector("#join");
    this.chatWindow = document.querySelector("#chatWindow");
    this.messageInput = document.querySelector("#message");
    this.submitButton = document.querySelector("#submit");
    
    
    this.joinButton.onclick = this.joinToChat.bind(this);

    this.connectToServer(); 
}   

Chat.prototype.updateMessages = function(dataObject) {

    var chatRow = document.createElement("div"),
        date = new Date(),
        time = this.formatTime(date.getHours()) + ":" + this.formatTime(date.getMinutes()) + ":" + this.formatTime(date.getSeconds()),
        message;

    chatRow.classList.add("chatRow");

    if(dataObject.type == "status"){
        message = "<span class='status'>" + dataObject.message + "</span>";
    } else{
        message = "<span class='login'>" + dataObject.login + ": </span><span class='message'>" + dataObject.message + "</span>";
    }
        
    chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message;
    this.chatWindow.appendChild(chatRow);
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
}
    
Chat.prototype.formatTime = function(time){
    return time < 10 ? "0" + time : time;
}    
    
Chat.prototype.joinToChat = function(e) {

    var login = this.loginInput.value;

    if(login !== "") {
        this.sendData({
            type: "join",
            login: login
        });

        e.target.onclick = null;
        e.target.setAttribute("disabled", "disabled");
        this.loginInput.setAttribute("readonly", "readonly");

        this.submitButton.removeAttribute("disabled");
        this.submitButton.onclick = this.sendMessage.bind(this);
    }

}

Chat.prototype.connectToServer = function(){
    this.socket = new WebSocket("ws://" + this.host + ":" + this.port);
    this.socket.onopen = this.checkConnection.bind(this);
    this.socket.onmessage = this.displayMessage.bind(this);
    this.socket.onclose = this.stopApp.bind(this);
}

Chat.prototype.checkConnection = function(){
    this.status.innerHTML = "Połączenie z serwerem nawiązane.";

    //this.socket.send("Witam Cię!");
    //console.log(this.socket);
}

Chat.prototype.sendMessage = function() {

    var message = this.messageInput.value;

    if(message !== "") {
        this.sendData({
            type: "message",
            message: message
        });
        this.messageInput.value = "";
    }
}

Chat.prototype.sendData = function(message) {
    var data = JSON.stringify(message);
    this.socket.send(data);
}

Chat.prototype.displayMessage = function(e){
    
    //this.status.innerHTML = "Wiadomość z serwera: " + e.data;
    
    var dataObject = JSON.parse(e.data);
    this.updateMessages(dataObject);
}
    
Chat.prototype.stopApp = function(){
    this.status.innerHTML = "Połączenie z serwerem zakończone.";
    
    this.joinButton.onclick = null;
    this.joinButton.setAttribute("disabled", "disabled");

    this.submitButton.onclick = null;
    this.submitButton.setAttribute("disabled", "disabled");

    this.updateMessages({
        type: "status",
        message: "Przerwano połączenie z serwerem."
    });
}


var chat1 = new Chat("localhost", "8000");
})();
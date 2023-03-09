export class ChatUIHelper {
    getUserInput() {
        // Get the message of the user from a form in the UI
        var input = document.querySelector(".chat-input");
        var msg = input.value;
        input.value = "";

        return msg;
    }
    
    addMessage(user_name, room_id, msg){
        var messages = document.getElementById("room"+room_id);
        if(msg !=""){
            
            var msgHTML = `
            <p><b>${user_name}:</b>${msg} </p>
            `;
            //add the message to the chat
            messages.innerHTML += msgHTML;
    
            //scroll down to always see the newest message
            messages.scrollTop = 100000;             
        }
    }
    changeRoomChat(from_room, to_room){
        var chat_hide = document.getElementById("room"+from_room);
        var chat_show = document.getElementById("room"+to_room);
        chat_hide.style.display = "none";
        console.log("displaying chat: "+ chat_show);
        chat_show.style.display = "";
    }
}

export class Chat {
    constructor(serverURL) {
        this.userId = null;
        this.serverURL = serverURL;
        this.chatHelper = new ChatUIHelper();
    }
    setUpServer() {
        this.server = my_client;
        this.server.connect( this.serverURL, this.room);

        this.server.on_ready = this.onReadyServer.bind(this);
        this.server.on_init_data = this.onInitData.bind(this);
        this.server.on_message = this.onMessageServer.bind(this);
        this.server.on_user_connected = this.onUserConnected.bind(this);
        this.server.on_user_disconnected = this.onUserDisconnected.bind(this);
        this.server.on_room_info = this.onRoomInfo.bind(this);
    }
    onReadyServer(data) {
        // Send token to the server
        // HARCODED TOKEN!!!!! PLEASE, CHANGE THIS!!!!!!!!!!!!!!!!!!
        const token = "aab44c47-6725-4703-81c9-da13e02516cb";
        // CHANGE!!!!!!!!!!!!!!!!!!!!!!

        let payload = {
            type: "user_request_init_data",
            token: token,
        }

        this.sendMessageToServer(payload);
    }

    onInitData(data) {
        var data = {
            user_id: data["user_id"],
            user: data["user"],
            rooms_data: data["rooms_data"],
            animations_data: data["animations_data"]
        }
        if(this.on_init_data){
            this.on_init_data(data);
        }
    }
    sendMessageToServer(message) {
        this.server.sendMessage(message);
    }
    onMessageServer(author, msg) {
        console.log("received message: " + msg);
        if (msg["type"] == "user_update_position"){
            var user_id = msg["user_id"];
            var target_position = msg["target_position"];
            this.on_user_update_position(user_id, target_position);
        }
        else if(msg["type"] == "user_change_room" && this.on_user_update_room) {
            let user = msg["user"];
            let room_id = msg["room_id"];
            this.on_user_update_room(user, room_id);
        }else {
            var message = msg["message"];
            console.log("received message: " + message);
            var username = msg["username"];
            var room_id = msg["room_id"];
            this.chatHelper.addMessage(username, room_id, message);

        }
    }
    onUserConnected(user_data) {
        this.on_user_connected(user_data);
    }
    onUserDisconnected(user_id) {
        this.on_user_disconnected(user_id);
    }
    onRoomInfo(users) {
        this.on_room_info(users);
    }
    sendMessage(user, room_id, msg){
       var message = {
        type: "msg",
        user_id: user.user_id,
        room_id: room_id,
        username: user.username,
        message: msg
       };
       this.sendMessageToServer(message);

    }
    sendUserData(user) {
        var message = {
            type: "user_connect_room",
            user_data: user
        }

        this.sendMessageToServer(message);
    }
}
import { AppProtocol } from "./sync/appProtocol.js";

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
    constructor(serverURL, loginManager) {
        this.userId = null;
        this.serverURL = serverURL;
        this.chatHelper = new ChatUIHelper();
        this.loginManager = loginManager;
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
        this.server.on_request_user_attitude = this.onRequestUserAttitude.bind(this);
        this.server.on_new_users_attitude = this.onNewUsersAttitude.bind(this);
    }
    onReadyServer(data) {
        let payload = {
            type: "user_connect_world",
        }

        this.sendMessageToServer(payload);
    }

    onInitData(data) {
        var data = {
            user_id: data["user_id"],
            user: data["user"],
            rooms_data: data["rooms_data"],
            users_data: data["users_data"]
        }
        if(this.on_init_data){
            this.on_init_data(data);
        }
    }
    sendMessageToServer(message) {
        const token = this.loginManager.getToken();
        message.token = token;
        
        this.server.sendMessage(message);
    }

    onMessageServer(author, msg) {
        if(msg["type"] == AppProtocol.updateRoomPayload.type && this.on_user_update_room) {
            const data = AppProtocol.parseUpdateRoomPayload(msg);
            const user_id = data["user_id"];
            const room_id = data["room_id"];
            this.on_user_update_room(user, room_id);
        }
        else if (msg["type"] == AppProtocol.messagePaylaod.type){
            const data = AppProtocol.parseMessagePayload(msg);
            const message = data["message"];
            const username = data["username"];
            const room_id = data["room_id"];

            console.log("received message: " + message);

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
       const payload = AppProtocol.composeMessagePayload(
        user.user_id,
        user.username,
        room_id,
        msg
       )

       const token = this.loginManager.getToken();
       payload.token = token;

       this.sendMessageToServer(payload);

    }

    onRequestUserAttitude() {
        if(this.on_request_user_attitude){
            this.on_request_user_attitude();
        }
    }


    onNewUsersAttitude(rooms) {
        const data = AppProtocol.parseUsersUpdatePosition(rooms);
        const rooms_data = data["rooms"];

        if(this.on_new_users_attitude) {
            this.on_new_users_attitude(rooms_data);
        }
    }
}

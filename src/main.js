import App from './app.js';
import { Chat } from './chat.js';
import { DataLoader } from './dataLoaders.js';
import { World } from './dataManagers.js';
import { UserFormUIHelper } from './formHelpers/userForm.js';
import { ServerSynchronizer } from './sync/dataSenders.js';

var world = new World();
var dataLoader = new DataLoader(world);

var serverURL = "localhost:8081";
//var serverURL = "ecv-etic.upf.edu/node/9021/ws/";
var chat = new Chat(serverURL);
chat.setUpServer();
chat.on_user_connected = dataLoader.loadNewUser.bind(dataLoader);
chat.on_user_disconnected = dataLoader.updateUserDisconnected.bind(dataLoader);
chat.on_room_info = dataLoader.loadRoomInfo.bind(dataLoader);
chat.on_user_update_position = dataLoader.updateUserTargetPosition.bind(dataLoader);
chat.on_user_update_room = dataLoader.updateUserRoom.bind(dataLoader);

var chatUIHelper = new UserFormUIHelper(world);

var canvas = document.querySelector("canvas");

var app = null;

var mouse_pos = [0, 0];

var last = performance.now();

var fillFormButton = document.querySelector("#sign-up");
fillFormButton.addEventListener("click", onUserFillForm);

function onUserFillForm() {
    var user = chatUIHelper.sendUserInfoToWorld();
    //chat.sendUserData(user);

    var serverSync = new ServerSynchronizer(chat);

    // Create app with the user data
    app = new App(canvas, chat, world, serverSync);

    // Callbacks
    //document.querySelector(".chat-input").addEventListener("keydown", onKeydown);
    var buttons = document.querySelectorAll("button")
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", onButton);
    }

    app.start();
}

function onButton(e) {
    app.onButton(e);
}

function onKeydown(e){
    app.onKeydown(e);
}

chat.on_ready_server = (data) => {
    console.log("server ready");
    dataLoader.loadDataFromServer(data);
    chatUIHelper.showAvatar();
};

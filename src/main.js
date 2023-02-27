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

var mouse_pos = [0,0];

var last = performance.now();

var fillFormButton = document.querySelector("#sign-up");
fillFormButton.addEventListener("click", onUserFillForm);

function onUserFillForm() {
    var user = chatUIHelper.sendUserInfoToWorld();
    chat.sendUserData(user);

    var serverSync = new ServerSynchronizer(chat);
    
    // Create app with the user data
    app = new App(canvas, chat, world, serverSync);

    // Callbacks
    document.body.addEventListener("mousedown", onMouse);
    document.body.addEventListener("mousemove", onMouse);
    document.body.addEventListener("mouseup", onMouse);
    document.querySelector(".chat-input").addEventListener("keydown", onKeydown);
    var buttons = document.querySelectorAll("button")
    for(var i = 0; i<buttons.length; i++){
        buttons[i].addEventListener("click",onButton);
    }
}

function loop(){
    var isAppNotInitialized = app == null;
    if(isAppNotInitialized) {
        requestAnimationFrame(loop);
        return;
    }

    draw();

    var now = performance.now();

    var elapsed_t = (now - last )/1000;

    last = now; 

    update(elapsed_t);

    requestAnimationFrame(loop);
}

function draw(){
    var parent = canvas.parentNode;
	var rect = parent.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;

    var ctx = canvas.getContext('2d');

    app.draw(ctx);
}

function update(dt){
    app.update(dt);

}

function onMouse(e){
    var rect = canvas.getBoundingClientRect();
    var cx = mouse_pos[0] = e.clientX - rect.left;
    var cy = mouse_pos[1] =  e.clientY - rect.top;
    var mouse_buttons = e.buttons;

    app.onMouse(e,mouse_pos);
}

function onKeydown(e){
    app.onKeydown(e);
}
function onButton(e){
    app.onButton(e);
}

chat.on_ready_server = (data) => {
    console.log("server ready");
    dataLoader.loadDataFromServer(data);
    chatUIHelper.showAvatar();
};

loop();
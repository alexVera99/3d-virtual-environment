import App from './app.js';
import { Chat } from './chat.js';
import { DataLoader } from './dataLoaders.js';
import { World } from './dataManagers.js';
import { LoginManager } from './managers/loginManager.js';
import { RendererScene } from './rendererScene.js';
import { ServerSynchronizer } from './sync/dataSenders.js';

var world = new World();
var rendererScene = new RendererScene(world);
var dataLoader = new DataLoader(world, rendererScene);


var serverURL = "127.0.0.1:8081";

const loginManager = new LoginManager(serverURL);

//var serverURL = "ecv-etic.upf.edu/node/9021/ws/";
var chat = new Chat(serverURL, loginManager);
chat.on_user_connected = dataLoader.loadNewUser.bind(dataLoader);
chat.on_user_disconnected = dataLoader.updateUserDisconnected.bind(dataLoader);
chat.on_room_info = dataLoader.loadRoomInfo.bind(dataLoader);
chat.on_user_update_position = dataLoader.updateUserTargetPosition.bind(dataLoader);
chat.on_user_update_room = dataLoader.updateUserRoom.bind(dataLoader);

var app = null;

var loginFormButton = document.querySelector("#log-in");
loginFormButton.addEventListener("click", onUserFillLoginForm);

async function onUserFillLoginForm() {
    await loginManager.login();
    chat.setUpServer();

    const serverSync = new ServerSynchronizer(chat);

    app = new App(chat, world, serverSync, rendererScene);
}

chat.on_init_data = (data) => {
    console.log("Authorized and got info");
    dataLoader.loadDataFromServer(data);
    app.start();
};

import App from './app.js';
import { Chat } from './chat.js';
import { DataLoader } from './dataLoaders.js';
import { World } from './dataManagers.js';
import { LoginManager } from './managers/loginManager.js';
import { SignUpManager } from './managers/signUpManager.js';
import { RendererScene } from './rendererScene.js';
import { ServerSynchronizer } from './sync/dataSenders.js';

var world = new World();
var rendererScene = new RendererScene(world);
var dataLoader = new DataLoader(world, rendererScene);


var serverURL = "127.0.0.1:8081";
//var serverURL = "ecv-etic.upf.edu/node/9021/ws/";
const httpURL = "http://" + serverURL;
const wsURL = "ws://" + serverURL;

const loginManager = new LoginManager(httpURL);
const signUpManager = new SignUpManager(httpURL);

var chat = new Chat(wsURL, loginManager);

chat.on_user_connected = dataLoader.loadNewUser.bind(dataLoader);
chat.on_user_disconnected = dataLoader.updateUserDisconnected.bind(dataLoader);
chat.on_room_info = dataLoader.loadRoomInfo.bind(dataLoader);
chat.on_new_users_attitude = dataLoader.updateUsersAttitude.bind(dataLoader);
chat.on_user_update_room = dataLoader.updateUserRoom.bind(dataLoader);

const serverSync = new ServerSynchronizer(chat, world);

chat.on_request_user_attitude = serverSync.sendUsersAttitude.bind(serverSync);

var app = null;

var loginFormButton = document.querySelector("#log-in");
loginFormButton.addEventListener("click", onUserFillLoginForm);

async function onUserFillLoginForm() {
    await loginManager.login();
    chat.setUpServer();
}


const signupFormButton = document.querySelector("button#sign-up");
signupFormButton.addEventListener("click", onUserFillSignupForm);

async function onUserFillSignupForm() {
    await signUpManager.signup();
}

chat.on_init_data = (data) => {
    console.log("Authorized and got info");
    dataLoader.loadDataFromServer(data);

    app = new App(chat, world, rendererScene);
    app.start();
};

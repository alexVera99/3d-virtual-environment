import {ChatUIHelper} from "./chat.js";
import {Drawer} from "./draw.js";
import { Renderer } from "./renderer.js";
import { RendererScene } from "./rendererScene.js";

export default class App {
    constructor(chat, world, serverSync) {
        this.world = world;
        this.drawer = new Drawer();
        this.chat = chat;
        this.serverSync = serverSync;
        this.chatHelper = new ChatUIHelper();
        this.scene = new RendererScene(this.world);
        this.renderer = new Renderer(this.scene);
    }

    start(){
        this.renderer.init();
     
        this.scene.loadUserSceneNodes();
        this.scene.loadRoom();

        this.renderer.startRendering()
    }

    update(dt) {
        var curr_user = this.world.getCurrentUser();
        var curr_room = this.world.getCurrentRoom();
        var users = this.world.getAllUsersInRoom(curr_room.room_id);
        var userIsNull = !curr_user;
        if(userIsNull){
            return;
        }
    }

    showOptions(show){
        var not_canvas = document.querySelector(".change-room");  
        var yesbutton = document.querySelector(".yesButton");
      
        if(show){
            var text = not_canvas.querySelector("p")
            var room = this.world.getRoom(yesbutton.id);
            text.innerText = "do you want to go to the "+room.room_name+"?";
            not_canvas.style.display = "block";

        }else{
            
            not_canvas.style.display = "none";
        }   
    }
}

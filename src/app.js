import {ChatUIHelper} from "./chat.js";
import {Drawer} from "./draw.js";
import { Renderer } from "./renderer.js";

export default class App {
    constructor(chat, world, rendererScene) {
        this.world = world;
        this.drawer = new Drawer();
        this.chat = chat;
        this.chatHelper = new ChatUIHelper();
        this.scene = rendererScene;
        this.renderer = new Renderer(this.scene);
    }

    start(){
        this.renderer.init();
     
        this.scene.loadUserSceneNodes();
        this.scene.loadRoom();

        this.renderer.startRendering()
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

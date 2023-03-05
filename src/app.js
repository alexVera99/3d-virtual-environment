import {Chat, ChatUIHelper} from "./chat.js";
import { Room, User } from "./dataContainers.js";
import {Drawer} from "./draw.js";
import { Renderer } from "./renderer.js";
import {UserStateUpdater} from "./userLogic.js";

export default class App {
    constructor(canvas, chat, world, serverSync) {
        this.world = world;
        this.drawer = new Drawer();
        this.chat = chat;
        this.serverSync = serverSync;
        this.chatHelper = new ChatUIHelper();
        this.renderer = new Renderer();
    }

    start(){
        this.renderer.init();
        //let users = this.world.users;
        let user = new User();
        user.fromJSON({
            "user_id": 1,
            "username": "pepe",
            "room_id": 1,
            "scene_node": {
                "id": 1,
                "mesh_uri": "girl/girl.wbin",
                "material": {
                    "id": 1,
                    "name": "girl",
                    "color_texture": "girl/girl.png"
                },
                "scale": 0.3,
                "animations": [
                    {
                        "id": 1,
                        "name": "idle",
                        "uri": "data/girl/idle.skanim"
                    },
                    {
                        "id": 2,
                        "name": "walking",
                        "uri": "data/girl/walking.skanim"
                    },
                    {
                        "id": 3,
                        "name": "dance",
                        "uri": "data/girl/dance.skanim"
                    }
                ],
                "position": [-40, 0, 0]
            }
        })

        let users = [user];

        this.renderer.setUpUserSceneNodes(users);

        // HARDCODED :(
        let room = new Room();
        room.fromJSON({
            "room_id": 1,
            "room_name": "super room",
            "users": {
                "1": {
                    "user_id": 1,
                    "username": "pepe",
                    "room_id": 1,
                    "scene_node": {
                        "id": 1,
                        "mesh_uri": "girl/girl.wbin",
                        "material": {
                            "id": 1,
                            "name": "girl",
                            "uri": "girl/girl.png"
                        },
                        "scale": 0.3,
                        "animations": [
                            {
                                "id": 1,
                                "name": "idle",
                                "uri": "data/girl/idle.skanim"
                            },
                            {
                                "id": 2,
                                "name": "walking",
                                "uri": "data/girl/walking.skanim"
                            },
                            {
                                "id": 3,
                                "name": "dance",
                                "uri": "data/girl/dance.skanim"
                            }
                        ],
                        "position": [-40, 0, 0]
                    }
                }
            },
            "scale": 40,
            "gltf_uri": "data/room.gltf"
        });


        this.renderer.setUpRoom(room);
        this.renderer.startRendering()
    }

    onButton(e) {

        var value = e.target.value;
        if (value === "no") {
            this.showOptions(false);
        } else if (value == "yes") {
            let target_room_id = parseInt(e.target.id);
            this.chatHelper.changeRoomChat(this.world.getCurrentRoom().room_id, target_room_id);
            this.world.changeRoom(target_room_id);
            this.serverSync.updateUserRoom(this.world.getCurrentUser(), target_room_id);
            this.showOptions(false);
        } else if (value == "open") {
            document.querySelector(".chat").style.display = "block";

        } else if (value == "close") {
            document.querySelector(".chat").style.display = "none";
        } else if (value == "send-msg") {
            var curr_user = this.world.getCurrentUser();
            var curr_room = this.world.getCurrentRoom();
            var input = document.querySelector(".chat-input");
            var msg = input.value;
            if (msg != "") {
                input.value = "";
                console.log("sending message: " + msg);
                this.chatHelper.addMessage(curr_user.username, curr_room.room_id, msg);
                this.chat.sendMessage(curr_user, curr_room.room_id, msg);
            }
        }
    }

    onKeydown(event) {
        if (event.key === "Enter") {
            var curr_user = this.world.getCurrentUser();
            var curr_room = this.world.getCurrentRoom();
            var input = document.querySelector(".chat-input");
            var msg = input.value;
            if(msg != "")
            {
                input.value = "";
                this.chatHelper.addMessage(curr_user.username, curr_room.room_id, msg);
                this.chat.sendMessage(curr_user, curr_room.room_id,  msg);
            }
            
		}
    }

    update(dt) {
        var curr_user = this.world.getCurrentUser();
        var curr_room = this.world.getCurrentRoom();
        var users = this.world.getAllUsersInRoom(curr_room.room_id);
        var userIsNull = !curr_user;
        if(userIsNull){
            return;
        }
        //UserStateUpdater.updateUserPosition(curr_user, curr_room, dt);
        UserStateUpdater.updateAllUsersPosition(users, curr_room, dt);
        var img = this.world.imageManager.loadImage(curr_room.image_uri);

        for(var i = 0; i<curr_room.exits.length; i++){
            var epos = curr_room.exits[i].position;
            var eheight = curr_room.exits[i].height;
            var ewidth = curr_room.exits[i].width;
            
            if((curr_user.position+img.width/2)>=epos[0]-10 && (curr_user.position+img.width/2)<=(epos[0]+ewidth-10)){
                document.querySelector(".yesButton").id = curr_room.exits[i].to_room_id;
                this.showOptions(true);
                break;
                
            }
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

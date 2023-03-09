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
        let user1 = new User();
        user1.fromJSON({
            "user_id": 1,
            "isCurrUser": false,
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
        let user2 = new User();
        user2.fromJSON({
            "user_id": 2,
            "isCurrUser": true,
            "username": "pepa",
            "room_id": 1,
            "scene_node": {
                "id": 1,
                "mesh_uri": "man/man.wbin",
                "material": {
                    "id": 1,
                    "name": "man",
                    "color_texture": "man/peopleColors.png"
                },
                "scale": 0.3,
                "animations": [
                    {
                        "id": 1,
                        "name": "idle",
                        "uri": "data/man/idle.abin"
                    },
                    {
                        "id": 2,
                        "name": "walking",
                        "uri": "data/man/walking.abin"
                    }
                ],
                "position": [-10, 0, 0]
            }
        })

        let users = [user1, user2];
        this.renderer.setUpUserSceneNodes(users);

        // HARDCODED :(
        let room = new Room();
        room.fromJSON({
            "room_id": 1,
            "room_name": "super room",
            "users": {
                "1": {
                    "user_id": 1,
                    "isCurrUser": false,
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
                    },
                    "2": {
                        "user_id": 2,
                        "isCurrUser": true,
                        "username": "pepa",
                        "room_id": 1,
                        "scene_node": {
                            "id": 1,
                            "mesh_uri": "man/man.wbin",
                            "material": {
                                "id": 1,
                                "name": "man",
                                "color_texture": "man/peopleColors.png"
                            },
                            "scale": 0.3,
                            "animations": [
                                {
                                    "id": 1,
                                    "name": "idle",
                                    "uri": "data/man/idle.abin"
                                },
                                {
                                    "id": 2,
                                    "name": "walking",
                                    "uri": "data/man/walking.abin"
                                },
                                
                            ],
                            "position": [-10, 0, 0]
                        }
                    }
                }
            },
            "scale": 40,
            "gltf_uri": "data/room.gltf"
        });


        this.renderer.setUpRoom(room);
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

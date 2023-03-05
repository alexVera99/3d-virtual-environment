import { User } from "../dataContainers.js";

export class UserFormUIHelper {

    constructor(world) {
        this.world = world;
        this.formElem = document.querySelector("#user_data_form");
    }

    getUsername() {
        var elem = document.querySelector("#username");
        var username = elem.value;
        return username;
    }

    getRoomId() {
       // var elem = document.querySelector("#room_id");
        //var room_id = parseInt(elem.value);
        //return room_id;
        return 1;
    }

    getAvatar() {
        
        var elem = document.querySelector('input[name="avatar"]:checked');
        //var elem = document.querySelector('#avatar_id');
        var avatar_id = parseInt(elem.value);
        var avatar = this.world.getAnimation(avatar_id);
        return avatar;
    }

    showAvatar(){
        console.log(this.world.animations);
        var avatars = document.querySelector(".avatars");
        for(var i = 1; i < this.world.animations.length; i++){
            var label = document.createElement("label");
            var radio = document.createElement("input");
            radio.type="radio";
            radio.name = "avatar";
            radio.value = i;
            var img = document.createElement("img");
            img.src = this.world.animations[i].show_uri;
            label.appendChild(radio);
            label.appendChild(img);
            avatars.appendChild(label);
        }
    }

    sendUserInfoToWorld() {
        var username = this.getUsername();
        var room_id = this.getRoomId();
        var avatar = this.getAvatar();

        var user_id = this.world.currentUserId;

        var user = new User();
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
        })

        this.world.addUser(user, room_id);
        this.world.currentRoomId = room_id;

        this.formElem.style.display = "none";
        document.querySelector(".container").style.display = "";

        return user;
    }
}
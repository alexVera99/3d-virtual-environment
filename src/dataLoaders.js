import {Room, Animation, User} from "./dataContainers.js";
import { World } from "./dataManagers.js";

export class DataLoader {
    constructor(world) {
        this.world = world || new World();
    }
    loadDataFromServer(data) {
        // Set current user
        this.world.currentUserId = data["user_id"];

        // Add rooms to the world
        var rooms = new Map(Object.entries(data["rooms_data"]));
        rooms.forEach(room_data => {
            if(room_data == null){
                return;
            }
            var room = new Room();
            room.fromJSON(room_data);

            this.world.addRoom(room);
        });

        // Add animations to the world
        var animations = new Map(Object.entries(data["animations_data"]));
        console.log(data["animations_data"]);
        animations.forEach(animation_data => {
            if(animation_data == null) {
                return;
            }
            var animation = new Animation();
            animation.fromJSON(animation_data);

            this.world.addAnimation(animation);
        });
    }

    loadNewUser(data) {
        var user = new User();
        user.fromJSON(data);

        var room_id = user.room_id;

        this.world.addUser(user, room_id);
    }

    loadRoomInfo(users) {
        users = new Map(Object.entries(users));
        var room_id = this.world.currentRoomId;

        console.log(users);

        users.forEach((user, id) => {
            if(user == null){
                return;
            }
            this.world.addUser(user, room_id);
        });
    }

    updateUserDisconnected(user_id) {
        this.world.removeUser(user_id);
    }

    updateUserTargetPosition(user_id, target_position) {
        var user = this.world.getUser(user_id);
        user.target_position = target_position;
    }

    updateUserRoom(user, room_id) {
        this.world.changeUserRoom(user, room_id);
    }
}
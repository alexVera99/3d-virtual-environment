import {Room, User} from "./dataContainers.js";

export class DataLoader {
    constructor(world, rendererScene) {
        this.world = world;
        this.scene = rendererScene;
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

        // Add users to the world
        var users = new Map(Object.entries(data["users_data"]));

        users.forEach(user_data => {
            if(user_data == null) {
                return;
            }
            const user = new User();
            user.fromJSON(user_data);
            const room_id = user.room_id;
            this.world.addUser(user, room_id);
        })

        // Update current user field
        const currUser = this.world.getCurrentUser();
        currUser.isCurrUser = true; 

        this.world.currentRoomId = currUser.room_id;
    }

    loadNewUser(data) {
        var user = new User();
        user.fromJSON(data);

        var room_id = user.room_id;

        this.world.addUser(user, room_id);
        this.scene.addUserToScene(user);
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
        this.scene.removeUser(user_id);
    }

    updateUsersAttitude(rooms) {
        const cur_user_id = this.world.getCurrentUser().user_id;
        rooms.forEach(room => {
            const room_id = room.room_id;
            const users = room.users;

            users.forEach(user => {
                const user_id = user.user_id;

                if(user_id == cur_user_id){
                    return;
                }

                const position = user.position;
                const orientation = user.orientation;
                const current_animation = user.current_animation

                this.world.updateUserAttitude(user_id, position, orientation, current_animation);
            })
        });
    }

    updateUserRoom(user, room_id) {
        this.world.changeUserRoom(user, room_id);
    }
}

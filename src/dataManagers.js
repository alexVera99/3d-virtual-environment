export class ImageManager {
    constructor() {
        this.images = [];
    }

    loadImage(url) {
        var img = this.images[url];
        if(img)
            return img;
            
        var img = this.images[url] = new Image();
        img.src = url;
        return img;
    }
}

export class World{
    constructor(user_id, room_id) {
        this.users = new Map(); //list of users
        this.rooms = []; //list of rooms
        this.animations = []; //list of available animations
        this.imageManager = new ImageManager();
        this.currentRoomId = room_id;
        this.currentUserId = user_id;
    }

    getUser(user_id){
        return this.users.get(user_id);
    }
    getAllUsersInRoom(room_id) {
        return this.rooms[room_id].users;
    }
    getRoom(room_id){
        return this.rooms[room_id];
    }

    getAnimation(id){
        return this.animations[id];
    }
    
    addUser(user, room_id){
        const user_id = user.user_id;
        this.users.set(user_id, user);
        this.rooms[room_id].users.set(user_id, user);
    }
    addRoom(room){
        this.rooms[room.room_id] = room;
    }

    addAnimation(animation){
        this.animations[animation.avatar_id] = animation;
    }

    getUserAttitude(user_id) {
        const user = this.getUser(user_id);
        return user.getAttitude();
    }

    updateUserAttitude(user_id, position, orientation, current_animation) {
        const user = this.getUser(user_id);
        user.updateAttitude(position, orientation, current_animation);
    }

    removeUser(user_id) {
        var user = this.getUser(user_id);
        var room_id = user.room_id;
        // Delete from users list
        this.users.delete(user_id);
        // Delete from users list of the room
        this.rooms[room_id].users.delete(user_id);
    }

    getCurrentRoom(){
        return this.rooms[this.currentRoomId];
    }

    getCurrentUser(){
        return this.users.get(this.currentUserId);
    }
    changeRoom(new_room_id){

        var curr_room = this.getCurrentRoom();
        var curr_user = this.getCurrentUser();

        curr_room.users.delete(this.currentUserId);


        curr_user.room_id = new_room_id;
        this.currentRoomId = new_room_id;

        var new_curr_room= this.getRoom(new_room_id);
        this.addUser(curr_user, new_room_id);

        var img = this.imageManager.loadImage(new_curr_room.image_uri);
        var exitpos = new_curr_room.exits[0].position[0]-(img.width/2);

        curr_user.position = exitpos;
        curr_user.target_position = curr_user.position;
        curr_user.animation = "idle_frames";
        curr_user.facing = curr_user.avatar.facing_front;
    }

    changeUserRoom(user, new_room_id) {
        let user_id = user.user_id;
        this.removeUser(user_id);

        this.addUser(user, new_room_id);
    }
}

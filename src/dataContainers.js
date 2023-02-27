import {ImageManager as ImageManager} from "./dataManagers.js";

export class Animation {
    avatar_id;
    image_uri;
    show_uri;
    scale;
    facing_right;
    facing_front;
    facing_left;
    facing_back;
    walking_frames; //frames of the animation to walk
    idle_frames;
    talking_frames;

    fromJSON(data) {
        this.avatar_id = data["avatar_id"];
        this.image_uri = data["image_uri"];
        this.show_uri = data["show_uri"];
        this.scale = data["scale"];
        this.facing_right = data["facing_right"];
        this.facing_front = data["facing_front"];
        this.facing_left = data["facing_left"];
        this.facing_back = data["facing_back"];
        this.walking_frames = data["walking_frames"] //frames of the animation to walk
        this.idle_frames = data["idle_frames"]
        this.talking_frames = data["talking_frames"]
    }

    getWalkingFrame(i) {
        return i;
    }

    getIdleFrame(i) {
        return i;
    }

    getTalkingFrames(i) {
        return i;
    }
}

export class User {
    constructor(username) {
        this.user_id = null;
        this.username = username || "";
        this.room_id = null; //room name
        this.avatar = null; //avatar name
        this.facing = null;
        this.animation = "idle_frames"; //default animation state
        this.position = null; //random position in the room
        this.target_position = null;
    }

    fromJSON(data) {
        this.user_id = data["user_id"];
        this.username = data["username"];
        this.room_id = data["room_id"]; //room name
        this.avatar = data["avatar"];  //avatar name
        this.facing = data["avatar"]["facing_front"];
        this.animation = data["animation"]; //default animation state
        this.position = data["position"];//random position in the room
        this.target_position = data["target_position"];
    }
}

export class Room {
    constructor(room_name) {
        this.room_id = null;
        this.room_name = room_name || "";
        this.users = new Map();
        this.scale = null;
        this.image_uri = null;
        this.offset = null;
        this.range = null;
        this.exits = null;
    }

    fromJSON(data) {
        this.room_id = data["room_id"];
        this.room_name = data["room_name"];
        this.users = new Map(Object.entries(data["users"]));
        this.scale = data["scale"]
        this.image_uri = data["image_uri"];
        this.offset= data["offset"];
        this.range = data["range"];
        this.exits = data["exits"].map((exit) => {
            return {
                position: exit.position,
                height: exit.height,
                width: exit.width,
                to_room_id:exit.to_room_id
            };
        })
    }
}
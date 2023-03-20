export class Material {
    id;
    name;
    color_texture;

    constructor(name) {
        this.name = name;
    }

    fromJSON(data) {
        this.id = data["id"];
        this.name = data["name"];
        this.color_texture = data["color_texture"];
    }
}

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
}

export class Animation3D {
    id;
    name;
    uri;

    fromJSON(data) {
        this.id = data["id"];
        this.name = data["name"];
        this.uri = data["uri"];
    }
}

export class SceneNode {
    id;
    mesh_uri;
    material;
    scale;
    animations;

    constructor() {
        this.animations = new Object();
    }

    fromJSON(data) {
        this.id = data["id"];
        this.mesh_uri = data["mesh_uri"];
        this.material = new Material();
        this.material.fromJSON(data["material"]);
        
        this.scale = data["scale"];
        this.parseAnimationFromJSON(data["animations"])
    }

    addAnimation(name, anim){
        const isAnim3DInstance = anim instanceof Animation3D;
        if(!isAnim3DInstance) {
            throw Error("anim should be an instance of Animation3D")
        }
        this.animations[name] = anim;
    } 

    parseAnimationFromJSON(data) {
        Object.entries(data).forEach(d =>  {
            const name = d[0];
            const anim = d[1];

            this.animations[name] = anim;
        });
    }
}

export class User {
    constructor(username) {
        this.user_id = null;
        this.isCurrUser = null;
        this.username = username || "";
        this.room_id = null; //room name
        this.scene_node;
        this.position = [0.0, 0.0, 0.0];
    }

    fromJSON(data, isCurrenUser = false) {
        this.user_id = data["user_id"];
        this.isCurrUser = isCurrenUser;
        this.username = data["username"];
        this.room_id = data["room_id"];
        this.scene_node = new SceneNode();
        this.scene_node.fromJSON(data["scene_node"]);
        this.position = data["position"];
    }

    updatePosition(position) {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }
}

export class Room {
    constructor(room_name) {
        this.room_id = null;
        this.room_name = room_name || "";
        this.users = new Map();
        this.scale = null;
        this.gltf_uri = null;
    }

    fromJSON(data) {
        this.room_id = data["room_id"];
        this.room_name = data["room_name"];
        this.users = new Map(Object.entries(data["users"]));
        this.scale = data["scale"]
        this.gltf_uri = data["gltf_uri"];
    }
}
export class RendererScene {
    scene;
    cur_user_character;
    world;

    constructor(world) {
        this.scene = new RD.Scene();
        this.world = world;
    }

    updateScene(dt) {
        this.scene.update(dt);
    }

    getScene() {
        return this.scene;
    }

    getAllNodes() {
        return this.scene.root.getAllChildren();
    }

    getCurUserCharacter() {
        return this.cur_user_character;
    }

    findUserNodeById(user_id) {
        const nodes = this.getAllNodes();

        let node_of_interest;

        for(let i = 0; i < nodes.lenght; i++) {
            const node = nodes[i];

            const is_user_found = node.user_id == user_id;
            if (is_user_found) {
                node_of_interest = node;
                break;
            }
        }
    }

    updateUserPosition(user_id, position) {
        const x = position[0];
        const y = position[1];
        const z = position[2];
        const position_array = [x, y, z];

        this.world.updateUserPosition(user_id, position_array);
    }

    loadAnimation(url) {
        var anim = new RD.SkeletalAnimation();
        anim.load(url);
        return anim;
    }

    loadUserSceneNodes() {
        this.scene.clear();
        const room = this.world.getCurrentRoom();
        const users = this.world.getAllUsersInRoom(room.room_id);

        users.forEach(user => {
            let user_scene_node = user.scene_node;
            let user_material = user_scene_node.material;
            let user_animations = user.scene_node.animations;

            var mat = new RD.Material({
                textures: {
                    color: user_material.color_texture
                }
            })
            mat.register(user_material.name);

            var pivot = new RD.SceneNode({
                position: user.getPosition()
            });

            var scene_node = new RD.SceneNode({
                scaling: user_scene_node.scale,
                mesh: user_scene_node.mesh_uri,
                material: user_material.name
            });

            pivot.addChild(scene_node);

            scene_node.skeleton = new RD.Skeleton();

            let animations = new Object();
            Object.entries(user_animations).forEach(entry => {
                const anim = entry[1];

                animations[anim.name] = this.loadAnimation(anim.uri);
            });

            pivot.animations = animations;
            pivot.user_id = user.user_id;

            if (user.isCurrUser) {
                this.cur_user_character = pivot;
            }
            this.scene.root.addChild(pivot);
        });
    }

    loadRoom() {
        const room = this.world.getCurrentRoom();

        var room_scene_node = new RD.SceneNode({
            scaling: room.scale,
        });

        room_scene_node.loadGLTF(room.gltf_uri);
        this.scene.root.addChild(room_scene_node);
    }

    loadScene() {
        this.loadUserSceneNodes();
        this.loadRoom();
    }
}

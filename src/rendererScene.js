export class RendererScene {
    scene;
    cur_user_character;
    world;
    tex;

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
    changeCurUserAnimation(animation){
        this.cur_user_character.cur
    }

    findUserNodeById(user_id) {
        const nodes = this.getAllNodes();

        let node_of_interest;

        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            const is_user_found = node.user_id == user_id;
            if (is_user_found) {
                node_of_interest = node;
                return node_of_interest
            }
        }

        return null;
    }

    getUserAttitude(user_id) {
        const user_attitude = this.world.getUserAttitude(user_id);

        return user_attitude;
    }
    updateUserAttitude(user_id, position, orientation, current_animation) {
        const x = position[0];
        const y = position[1];
        const z = position[2];
        const position_array = [x, y, z];

        const x_o = orientation[0];
        const y_o = orientation[1];
        const z_o = orientation[2];
        const w_o = orientation[3];
        const orientation_array = [x_o, y_o, z_o, w_o];

        this.world.updateUserAttitude(user_id, position_array, orientation_array, current_animation);
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
            var pivot = this.addUserToScene(user);
            let user_material = user.scene_node.material;

            if (user.isCurrUser) {
                var user_selector = new RD.SceneNode({
                    position: [0,40,0],
                    mesh: "cube",
                    material: user_material.name,
                    scaling: [10,20,10],
                    name: "user_selector",
                    layers: 0b1000
                });
                pivot.addChild( user_selector );
                var dance_mat = new RD.Material({
                    textures: {
                     color: "dance.jpeg" }
                    });
                dance_mat.register("dance_cube");
                var dance = new RD.SceneNode({
                    position: [0,60,0],
                    mesh: "cube",
                    material: "dance_cube",
                    scaling: [5,5,5],
                    name: "dance_selector",
                    layers: 0b1000
                });
                pivot.addChild( dance );
                var wave_mat = new RD.Material({
                    textures: {
                     color: "wave.jpg" }
                    });
                wave_mat.register("wave_cube");
                var wave = new RD.SceneNode({
                    position: [10,55,0],
                    mesh: "cube",
                    material: "wave_cube",
                    scaling: [5,5,5],
                    name: "wave_selector",
                    layers: 0b1000
                });
                pivot.addChild( wave );
                var cheer_mat = new RD.Material({
                    textures: {
                     color: "cheer.jpg" }
                    });
                cheer_mat.register("cheer_cube");
                var cheer = new RD.SceneNode({
                    position: [-10,55,0],
                    mesh: "cube",
                    material: "cheer_cube",
                    scaling: [5,5,5],
                    name: "cheer_selector",
                    layers: 0b1000
                });
                pivot.addChild( cheer );
                this.cur_user_character = pivot;
            }
        });
    }

    addUserToScene(user) {
        let user_scene_node = user.scene_node;
        let user_material = user_scene_node.material;
        let user_animations = user.scene_node.animations;

        var mat = new RD.Material({
            textures: {
                color: user_material.color_texture
            }
        });
        mat.register(user_material.name);

        const user_attitude = user.getAttitude();
        var pivot = new RD.SceneNode({
            position: user_attitude.position,
        });
        pivot.rotation = new Float32Array(user_attitude.orientation);

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

            animations[anim.name] = {
                name: anim.name,
                animation: this.loadAnimation(anim.uri)
            };
        });

        pivot.animations = animations;
        pivot.user_id = user.user_id;

        this.scene.root.addChild(pivot);
        return pivot;
    }

    removeUser(user_id) {
        const node = this.findUserNodeById(user_id);
        
        if(node) {
            this.scene.root.removeChild(node);
        }
    }

    loadStreamVideo() {
        const video = document.querySelector("video#other");

        const isVideoPause = video.paused;
        const isNotVideoReady = !video.readyState === 4;

        if (isVideoPause && isNotVideoReady) {
            return;
        }

        if (video.videoWidth) {
            if (!this.tex) {
                this.tex = GL.Texture.fromVideo(video);
                gl.textures["mytext"] = this.tex;
                const mat = new RD.Material({
                    textures: {
                        color: "mytext"
                    }
                });
                mat.register("mymat");

                const scene_node = new RD.SceneNode({
                    position: [-15, 150, -291],
                    mesh: "cube",
                    material: "mymat",
                    scaling: [235, 180, 0.01],
                    name: "video_stream"
                })

                this.scene.root.addChild(scene_node);
            }
            else
                this.tex.uploadImage(video);
        }

        // Call requestAnimationFrame again to repeat the process
        requestAnimationFrame(this.loadStreamVideo.bind(this));
    }

    loadRoom() {
        const room = this.world.getCurrentRoom();
        var walkarea = new WalkArea();
        walkarea.addRect([-450,0,120],900,450);
        walkarea.addRect([-120,0,120],-330,-200);
        walkarea.addRect([120,0,120],330,-200);
        
        var room_scene_node = new RD.SceneNode({
            scaling: room.scale,
        });
        this.scene.walkarea = walkarea;
       
        room_scene_node.loadGLTF(room.gltf_uri);
        this.scene.root.addChild(room_scene_node);
    }

    loadScene() {
        this.loadUserSceneNodes();
        this.loadRoom();
    }
}

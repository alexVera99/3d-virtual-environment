export class Renderer {
    camera;
    scene;
    renderer;
    bg_color;
    cur_user_character;
    context;
    dom_canvas;
    users_charaters;

    constructor(bg_color) {
        this.scene = new RD.Scene();
        this.camera = new RD.Camera();
        this.bg_color = bg_color || [0.1, 0.1, 0.1, 1];
    }

    init() {
        this.context = GL.create({ width: window.innerWidth, height: window.innerHeight });

        //setup renderer
        this.renderer = new RD.Renderer(this.context);
        this.renderer.setDataFolder("data");
        this.renderer.autoload_assets = true

        //attach canvas to DOM
        this.dom_canvas = document.querySelector("#canvas");
        this.dom_canvas.appendChild(this.renderer.canvas);

        // Set up camera
        this.camera.perspective(60, gl.canvas.width / gl.canvas.height, 0.1, 1000);
        this.camera.lookAt([0, 40, 100], [0, 20, 0], [0, 1, 0]);

        this.context.ondraw = function () {
            gl.canvas.width = this.dom_canvas.offsetWidth;
            gl.canvas.height = this.dom_canvas.offsetHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            var usrpos = this.cur_user_character.localToGlobal([0, 40, 0]);
            var campos = this.cur_user_character.localToGlobal([0, 50, -70]);
            var camtarget = this.cur_user_character.localToGlobal([0, 20, 70]);
            var smoothtarget = vec3.lerp(vec3.create(), this.camera.target, camtarget, 0.05);

            this.camera.perspective(60, gl.canvas.width / gl.canvas.height, 0.1, 1000);
            this.camera.lookAt(campos, smoothtarget, [0, 1, 0]);
            //clear
            this.renderer.clear(this.bg_color);
            //render scene
            this.renderer.render(this.scene, this.camera);
        }.bind(this);

        //main update
        this.context.onupdate = function (dt) {
            let sceneNodes = this.scene.root.getAllChildren();
            //not necessary but just in case...
            this.scene.update(dt);

            sceneNodes.forEach((sceneNode) => {
                var t = getTime();
                let animations = sceneNode.animations;

                let isNotCharacter = !animations;
                if (isNotCharacter) {
                    return;
                }

                var anim = animations.idle;
                var time_factor = 1;

                //control with keys
                if (gl.keys["UP"] && sceneNode == this.cur_user_character) {
                    sceneNode.moveLocal([0, 0, 1]);
                    anim = animations.walking;
                }
                else if (gl.keys["DOWN"] && sceneNode == this.cur_user_character) {
                    sceneNode.moveLocal([0, 0, -1]);
                    anim = animations.walking;
                    time_factor = -1;
                }
                if (gl.keys["LEFT"] && sceneNode == this.cur_user_character)
                    sceneNode.rotate(90 * DEG2RAD * dt, [0, 1, 0]);
                else if (gl.keys["RIGHT"] && sceneNode == this.cur_user_character)
                    sceneNode.rotate(-90 * DEG2RAD * dt, [0, 1, 0]);

                //move bones in the skeleton based on animation
                anim.assignTime(t * 0.001 * time_factor);
                //copy the skeleton in the animation to the character
                let snChild = sceneNode.getAllChildren()[0];
                snChild.skeleton.copyFrom(anim.skeleton);
            });
        }.bind(this);

        //user input ***********************

        //detect clicks
        this.context.onmouseup = function (e) {
            if (e.click_time < 200) //fast click
            {
                //compute collision with floor plane
                var ray = this.camera.getRay(e.canvasx, e.canvasy);
                if (ray.testPlane(RD.ZERO, RD.UP)) //collision
                {
                    console.log("floor position clicked", ray.collision_point);
                }
            }
        }.bind(this);

        this.context.onmousemove = function (e) {
            if (e.dragging) {
                //orbit camera around
                //camera.orbit( e.deltax * -0.01, RD.UP );
                //camera.position = vec3.scaleAndAdd( camera.position, camera.position, RD.UP, e.deltay );
                this.camera.move([-e.deltax * 0.1, e.deltay * 0.1, 0]);
            }
        }.bind(this);

        this.context.onmousewheel = function (e) {
            //move camera forward
            this.camera.moveLocal([0, 0, e.wheel < 0 ? 10 : -10]);
        }.bind(this);

        //capture mouse events
        this.context.captureMouse(true);
        this.context.captureKeys();
    }

    loadAnimation(url) {
        var anim = new RD.SkeletalAnimation();
        anim.load(url);
        return anim;
    }

    setUpUserSceneNodes(users) {
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
                position: user_scene_node.position
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

            if (user.isCurrUser) {
                this.cur_user_character = pivot;
            }
            this.scene.root.addChild(pivot);
        });
    }

    setUpRoom(room) {
        var room_scene_node = new RD.SceneNode({
            scaling: room.scale,
        });

        room_scene_node.loadGLTF(room.gltf_uri);
        this.scene.root.addChild(room_scene_node);
    }

    startRendering() {
        this.context.animate();
    }
}

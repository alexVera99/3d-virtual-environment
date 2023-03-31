import { RendererUserLogic } from "./rendererUserLogic.js";

export class Renderer {
    scene;
    camera;
    renderer;
    bg_color;
    context;
    dom_canvas;
    users_charaters;
    user_logic;
    free_camera;
    attitude;

    constructor(rendererScene) {
        this.scene = rendererScene;
        this.camera = new RD.Camera();
        this.bg_color = [0.1, 0.1, 0.1, 1];
        this.user_logic = null;
        this.free_camera = false;
        this.attitude = "idle";
        this.scene.user_attitude = "idle";

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
        
        this.user_logic = new RendererUserLogic(this.scene);
        
        this.context.ondraw = function () {
            gl.canvas.width = this.dom_canvas.offsetWidth;
            gl.canvas.height = this.dom_canvas.offsetHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            const cur_user_character = this.scene.getCurUserCharacter();
            var usrpos = cur_user_character.localToGlobal([0, 40, 0]);
            var campos = cur_user_character.localToGlobal([0, 50, -70]);
            var camtarget = cur_user_character.localToGlobal([0, 20, 70]);
            var smoothtarget = vec3.lerp(vec3.create(), this.camera.target, camtarget, 0.05);

            this.camera.perspective(60, gl.canvas.width / gl.canvas.height, 0.1, 1500);
            if(!this.free_camera)
                this.camera.lookAt(campos, smoothtarget, [0, 1, 0]);
            //clear
            this.renderer.clear(this.bg_color);
            //render scene
            this.renderer.render(this.scene.getScene(), this.camera, null, 0b11);
        }.bind(this);

        //main update
        this.context.onupdate = function (dt) {
            let sceneNodes = this.scene.getAllNodes();
            //not necessary but just in case...
            this.scene.updateScene(dt);

            sceneNodes.forEach((sceneNode) => {
                let animations = sceneNode.animations;

                let isNotCharacter = !animations;
                if (isNotCharacter) {
                    return;
                }

                const cur_user_character = this.scene.getCurUserCharacter();
                
                //control with keys
                if(cur_user_character == sceneNode) {
                    this.user_logic.moveCurrentUser(sceneNode, dt);
                }
                else{
                    this.user_logic.moveOtherUsers(sceneNode);
                }
            });
        }.bind(this);

        //user input ***********************

        //detect clicks
        this.context.onmouseup = function (e) {
            if (e.click_time < 200) //fast click
            {
                var scene = this.scene.getScene();
                //compute collision with floor plane
                var ray = this.camera.getRay(e.canvasx, e.canvasy);
                var node = scene.testRay( ray, null, 10000, 0b1111 );
                var curr_user_node = this.scene.getCurUserCharacter();
                //get selector
                var user_selector = null;
                var dance_selector = null;
                var wave_selector = null;
                var cheer_selector = null;
                curr_user_node.children.forEach(child =>{
                    if(child.name == "user_selector")
                        user_selector = child;
                    else if(child.name == "dance_selector")
                        dance_selector = child;
                    else if(child.name == "wave_selector")
                        wave_selector = child;
                    else if(child.name == "cheer_selector")
                        cheer_selector = child;
                });
                if(node == user_selector){
                    if(dance_selector.layers == 0b1000 ){
                        dance_selector.layers = 0b11;
                        wave_selector.layers = 0b11;
                        cheer_selector.layers = 0b11;
                    }
                    else{
                        dance_selector.layers = 0b1000;
                        wave_selector.layers = 0b1000;
                        cheer_selector.layers = 0b1000;
                    }
                }
                else if(node == dance_selector){
                    if(this.scene.user_attitude != "dance")
                        this.scene.user_attitude = "dance";
                    else
                        this.scene.user_attitude = "idle";
                }
                else if(node == wave_selector){
                    if(this.scene.user_attitude != "wave")
                        this.scene.user_attitude = "wave";
                    else
                        this.scene.user_attitude = "idle";
                }
                else if(node == cheer_selector){
                    if(this.scene.user_attitude != "cheer")
                        this.scene.user_attitude = "cheer";
                    else
                        this.scene.user_attitude = "idle";
                }
        
                /*if (ray.testPlane(RD.ZERO, RD.UP)) //collision
                {
                    console.log("floor position clicked", ray.collision_point);
                }*/
            }
        }.bind(this);

        this.context.onmousemove = function (e) {
            if (e.dragging) {
                //orbit camera around
                this.camera.orbit( e.deltax * -0.01, RD.UP );
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

    startRendering() {
        this.context.animate();
    }

    freeCamera(){
        var btn = document.querySelector("#cam-btn");
		this.free_camera = !this.free_camera;
		if(this.free_camera)
			btn.innerText = "Free Camera On";
		else if(!this.free_camera)
			btn.innerText = "Free Camera Off";
    }
}

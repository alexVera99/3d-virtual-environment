export class RendererUserLogic {
    constructor(scene) {
        this.scene = scene;
    }

    moveCurrentUser(sceneNode, dt) {
        const t = getTime();
        let time_factor = 1;
        const animations = sceneNode.animations;
        let anim_object = animations.idle; //Contains name and animation
        var anim_name = null;
        if(this.scene.user_attitude == "dance")
            anim_object = animations.dance;
        else if(this.scene.user_attitude == "wave")
            anim_object = animations.wave;
        else if(this.scene.user_attitude == "cheer")
            anim_object = animations.cheer;
        if (gl.keys["UP"]) {
            sceneNode.moveLocal([0, 0, 1]);
            anim_object = animations.walking;
            this.scene.user_attitude = "walk";
        }
        else if (gl.keys["DOWN"]) {
            sceneNode.moveLocal([0, 0, -1]);
            anim_object = animations.walking;
            anim_name = "back";
            time_factor = -1;
            this.scene.user_attitude = "back";
        }
        if (gl.keys["LEFT"]) {
            sceneNode.rotate(90 * DEG2RAD * dt, [0, 1, 0]);
            this.scene.user_attitude = "idle";
        }
        else if (gl.keys["RIGHT"]) {
            sceneNode.rotate(-90 * DEG2RAD * dt, [0, 1, 0]);
            this.scene.user_attitude = "idle";
        }
        var pos = sceneNode.position;
		var nearest_pos = this.scene.scene.walkarea.adjustPosition( pos );
		sceneNode.position = nearest_pos;
        if(anim_name == null)
            anim_name = anim_object.name;
       
        this.scene.updateUserAttitude(sceneNode.user_id,
            sceneNode.position,
            sceneNode.rotation,
            anim_name);

        let anim = anim_object.animation;;
        this.moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode);
    }
    
    moveOtherUsers(sceneNode) {
        const user_id = sceneNode.user_id;
        const position = sceneNode.position;

        const attitude = this.scene.getUserAttitude(user_id);

        const target_position = new Float32Array(attitude.position);
        const orientation = new Float32Array(attitude.orientation);
        const current_animation = attitude.current_animation;
        sceneNode.rotation = orientation;
        const dist_to_target_postition = vec3.dist(position, target_position);
        var time_factor = 1;

        const animations = sceneNode.animations;
        let anim = animations.idle.animation;

        if (dist_to_target_postition < 5.0) {
            if(current_animation == "dance")
                anim = animations.dance.animation;
            else if(current_animation == "cheer")
                anim = animations.cheer.animation;
            else if(current_animation == "wave")
                anim = animations.wave.animation;
            else if(current_animation == "idle")
                anim = animations.idle.animation;
            else {
                anim = animations.walking.animation;
                if(current_animation == "back"){
                    sceneNode.moveLocal([0, 0, -1]);
                    time_factor = -1;
                }
                else
                    sceneNode.moveLocal([0, 0, 1]);
            }
        }

        //PANIC! The object is too far from the target object.
        // Desyncronization chaos!!!!!
        if(dist_to_target_postition > 30) {
            sceneNode.position = target_position;
        }
        
        
        const t = getTime();
        this.moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode)
    }

    moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode) {
        anim.assignTime(t * 0.001 * time_factor);
        //copy the skeleton in the animation to the character
        const snChild = sceneNode.getAllChildren()[0];
        snChild.skeleton.copyFrom(anim.skeleton);
    }

}

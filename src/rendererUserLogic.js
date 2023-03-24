export class RendererUserLogic {
    constructor(scene) {
        this.scene = scene;
    }

    moveCurrentUser(sceneNode, dt) {
        const t = getTime();
        let time_factor = 1;
        const animations = sceneNode.animations;
        let anim_object = animations.idle; //Contains name and animation

        if (gl.keys["UP"]) {
            sceneNode.moveLocal([0, 0, 1]);
            anim_object = animations.walking;
        }
        else if (gl.keys["DOWN"]) {
            sceneNode.moveLocal([0, 0, -1]);
            anim_object = animations.walking;
            time_factor = -1;
        }
        if (gl.keys["LEFT"]) {
            sceneNode.rotate(90 * DEG2RAD * dt, [0, 1, 0]);
        }
        else if (gl.keys["RIGHT"]) {
            sceneNode.rotate(-90 * DEG2RAD * dt, [0, 1, 0]);
        }

        this.scene.updateUserAttitude(sceneNode.user_id,
            sceneNode.position,
            sceneNode.rotation,
            anim_object.name);

        const anim = anim_object.animation;
        this.moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode);
    }
    
    moveOtherUsers(sceneNode) {
        const user_id = sceneNode.user_id;
        const position = sceneNode.position;

        const attitude = this.scene.getUserAttitude(user_id);

        const target_position = new Float32Array(attitude.position);
        const orientation = new Float32Array(attitude.orientation);

        sceneNode.rotation = orientation;

        const dist_to_target_postition = vec3.dist(position, target_position);
        let anim;

        const animations = sceneNode.animations;
        if (dist_to_target_postition < 5.0) {
            anim = animations.idle.animation;
        }
        else {
            anim = animations.walking.animation;
            sceneNode.moveLocal([0, 0, 1]);
        }

        //PANIC! The object is too far from the target object.
        // Desyncronization chaos!!!!!
        if(dist_to_target_postition > 30) {
            sceneNode.position = target_position;
        }
        
        
        const t = getTime();
        const time_factor = 1;
        this.moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode)
    }

    moveBonesBasedOnAnimation(anim, t, time_factor, sceneNode) {
        anim.assignTime(t * 0.001 * time_factor);
        //copy the skeleton in the animation to the character
        const snChild = sceneNode.getAllChildren()[0];
        snChild.skeleton.copyFrom(anim.skeleton);
    }

}

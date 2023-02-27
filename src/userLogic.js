export class UserStateUpdater {
    static clamp(v,min,max){
        return (v < min ? min : (v > max ? max : v)); 
    }
    static updateUserPosition(user, room, dt) {
        user.target_position = this.clamp(user.target_position, room.range[0], room.range[1]);

        if(user.target_position === user.position){
            return;
        }

        var diff = (user.target_position - user.position);
        var delta = diff;
        var avatar = user.avatar;

        if (delta > 0) {
            delta = 30;
        }
        else if (delta < 0) {
            delta = -30;
        }
        else {
            delta = 0;
        }

        if (Math.abs(diff) < 1) {
            delta = 0;
            user.position = user.target_position;
        }

        else
            user.position += delta * dt;

        if (delta == 0) {
            user.animation = "idle_frames";
            user.facing = avatar.facing_front;

        }
        else {
            if (delta > 0)
                user.facing = avatar.facing_right;

            else
                user.facing = avatar.facing_left;
            user.animation = "walking_frames";
        }
    }

    static updateAllUsersPosition(users, room, dt) {
        users.forEach((user, id) => {
            var userIsNull = !user;
            if(userIsNull) {
                return;
            }
            this.updateUserPosition(user, room, dt);
        });
    }
}
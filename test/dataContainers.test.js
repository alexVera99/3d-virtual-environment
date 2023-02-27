import {Animation as Animation, User as User, Room as Room} from "../src/dataContainers.js";
import test from 'unit.js';

var animationData = {
    image_uri: "../img/my_image_test.png",
    scale: 2,
    frames: {
        walking: [1, 2],
        idle: [3, 4, 5],
        talking: [6, 7, 8]
    },
    facing: {
        right: 0,
        left: 2,
        front: 1,
        back: 3
    }
}

var animation = new Animation(animationData);

test.string(animation.image_uri).isIdenticalTo(animationData.image_uri);
test.number(animation.scale).isIdenticalTo(animationData.scale);
test.array(animation.walking).isIdenticalTo(animationData.frames.walking);
test.array(animation.idle).isIdenticalTo(animationData.frames.idle);
test.array(animation.talking).isIdenticalTo(animationData.frames.talking);
test.number(animation.facing_right).isIdenticalTo(animationData.facing.right);
test.number(animation.facing_front).isIdenticalTo(animationData.facing.front);
test.number(animation.facing_left).isIdenticalTo(animationData.facing.left);
test.number(animation.facing_back).isIdenticalTo(animationData.facing.back);

var roomData = {
    room_name: "chatRoom",
    image_uri: "../img/my_bg_image_test.png",
    offset: 3
}

var room = new Room(roomData);

test.string(room.roomName).isIdenticalTo(roomData.room_name);
test.string(room.backgroundImageName).isIdenticalTo(roomData.image_uri);
test.number(room.userAnimationOffset).isIdenticalTo(roomData.offset);

var userData = {
    user_id: 1,
    username: "pepe",
    room: room,
    avatar: animation,
}

var isCurrentUser = false;

var user = new User(userData, isCurrentUser);

test.number(user.userId).isIdenticalTo(userData.user_id);
test.string(user.username).isIdenticalTo(userData.username);
test.object(user.room).isIdenticalTo(userData.room);
test.object(user.avatar).is(userData.avatar);
test.number(user.position).isBetween(room.range[0], room.range[1]);
test.number(user.target_position).isIdenticalTo(user.position);
test.value(user.isCurrentUser).isIdenticalTo(isCurrentUser);

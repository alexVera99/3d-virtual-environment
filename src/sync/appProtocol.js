import { deepCopy } from "../utils.js";

export class AppProtocol {
    static updatePositonPayload = {
        type: "user_update_attitude",
        user_id: undefined,
        position: undefined,
        orientation: undefined,
        current_animation: undefined
    }

    static usersUpdatePositionType = "new_users_attitude";

    static updateRoomPayload = {
        type: "user_change_room",
        user_id: undefined,
        room_id: undefined
    }

    static messagePaylaod = {
        type: "msg",
        user_id: undefined,
        room_id: undefined,
        username: undefined,
        message: undefined
    }

    static streamIdPayload = {
        type: "stream_id",
        stream_id: undefined,
    }

    static composeUpdateAttitudePaylaod(user_id, position, orientation, current_animation) {
        const payload = deepCopy(AppProtocol.updatePositonPayload);

        payload.user_id = user_id;
        payload.position = position;
        payload.orientation = orientation;
        payload.current_animation = current_animation;
        
        return payload;
    }

    static parseUsersUpdatePosition(rooms) {
        rooms.forEach(room => {
            const users = room.users;

            const users_array = [];
            for(let i = 0; i < Object.entries(users).length; i++) {
                users_array.push(users[i]);
            }

            room.users = users;
        });

        return {
            rooms: rooms,
        };
    }

    static composeUpdateUserRoomPayload(user_id, room_id) {
        const payload = deepCopy(AppProtocol.updateRoomPayload);

        payload.user_id = user_id;
        payload.room_id = room_id;

        return payload;
    }

    static parseUpdateRoomPayload(payload) {
        const user_id = payload.user_id;
        const room_id = payload.room_id;

        return {
            user_id: user_id,
            room_id: room_id
        };
    }

    static composeMessagePayload(user_id, username, room_id, message) {
        const payload = deepCopy(AppProtocol.messagePaylaod);

        payload.user_id = user_id;
        payload.username = username;
        payload.room_id = room_id;
        payload.message = message;

        return payload;
    }

    static parseMessagePayload(payload) {
        const username = payload.username;
        const room_id = payload.room_id;
        const message = payload.message;

        return {
            username: username,
            room_id: room_id,
            message: message

        }
    }

    static composeStreamIdPayload(id) {
        const payload = deepCopy(AppProtocol.streamIdPayload);

        payload.stream_id = id;

        return payload;
    }

    static parseStreamIdPayload(payload) {
        const stream_id = payload.stream_id;

        return {
            stream_id: stream_id
        };
    }
}

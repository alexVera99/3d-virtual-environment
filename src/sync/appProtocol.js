import { deepCopy } from "../utils.js";

export class AppProtocol {
    static updatePositonPayload = {
        type: "user_update_position",
        user_id: undefined,
        target_position: undefined
    }

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

    static composeUpdatePositionPaylaod(user_id, target_position) {
        const payload = deepCopy(AppProtocol.updatePositonPayload);

        payload.user_id = user_id;
        payload.target_position = target_position;
        
    }

    static parseUpdatePositionPayload(payload) {
        const user_id = payload.user_id;
        const target_position = payload.target_position;

        return {
            user_id: user_id,
            target_position: target_position
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
}

export class ServerSynchronizer {
    constructor(chat) {
        this.chat = chat;
    }
    updateUserTargetPosition(user_id, target_position){
        var payload = {
            type: "user_update_position",
            user_id: user_id,
            target_position: target_position
        };

        this.chat.sendMessageToServer(payload);
    }

    updateUserRoom(user, room_id) {
        var payload = {
            type: "user_change_room",
            user: user,
            room_id: room_id
        }

        this.chat.sendMessageToServer(payload);
    }
}
import { AppProtocol } from "./appProtocol.js";

export class ServerSynchronizer {
    constructor(chat) {
        this.chat = chat;
    }
    updateUserTargetPosition(user_id, target_position){
        const payload = AppProtocol.composeUpdatePositionPaylaod(user_id, target_position);

        this.chat.sendMessageToServer(payload);
    }

    updateUserRoom(user, room_id) {
        const user_id = user.user_id;

        const payload = AppProtocol.composeUpdateUserRoomPayload(user_id, room_id);

        this.chat.sendMessageToServer(payload);
    }
}
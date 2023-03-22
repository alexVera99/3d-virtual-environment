import { AppProtocol } from "./appProtocol.js";

export class ServerSynchronizer {
    constructor(chat, world) {
        this.chat = chat;
        this.world = world;
    }
    updateUserPosition(){
        const user = this.world.getCurrentUser();
        const user_id = user.user_id;
        const position = user.position;
        console.log(position);

        const payload = AppProtocol.composeUpdatePositionPaylaod(user_id, position);

        this.chat.sendMessageToServer(payload);
    }

    updateUserRoom(user, room_id) {
        const user_id = user.user_id;

        const payload = AppProtocol.composeUpdateUserRoomPayload(user_id, room_id);

        this.chat.sendMessageToServer(payload);
    }
}
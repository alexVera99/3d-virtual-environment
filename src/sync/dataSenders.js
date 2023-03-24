import { AppProtocol } from "./appProtocol.js";

export class ServerSynchronizer {
    constructor(chat, world) {
        this.chat = chat;
        this.world = world;
    }
    sendUsersAttitude(){
        const user = this.world.getCurrentUser();
        const user_id = user.user_id;
        const position = user.position;
        const orientation = user.orientation;
        const current_animation = user.current_animation;

        const payload = AppProtocol.composeUpdateAttitudePaylaod(user_id, position, orientation, current_animation);

        this.chat.sendMessageToServer(payload);
    }

    updateUserRoom(user, room_id) {
        const user_id = user.user_id;

        const payload = AppProtocol.composeUpdateUserRoomPayload(user_id, room_id);

        this.chat.sendMessageToServer(payload);
    }
}
import {Chat, ChatUIHelper} from "./chat.js";
import {Drawer} from "./draw.js";
import {UserStateUpdater} from "./userLogic.js";

export default class App {
    constructor(canvas, chat, world, serverSync) {
        this.world = world;
        this.drawer = new Drawer();
        this.chat = chat;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.display = "block";
        this.serverSync = serverSync;
        this.chatHelper = new ChatUIHelper();

    }

    worldToCanvas(x, y) {
        // world to canvas transformation. It will depend on the transformations applied above
        var room = this.world.getCurrentRoom();
        return[(x + this.canvas.width*2)*room.scale, (y + this.canvas.height*2)*room.scale]
    }
    imageToCanvas(x,y){
        var img = this.world.imageManager.loadImage(curr_room.image_uri);
        return(x-img.width/2, y-img.height/2);
    }
    canvasToImage(x, y){
        var pos = this.canvasToWorld(x,y);
        var curr_room = this.world.getCurrentRoom()
        var img = this.world.imageManager.loadImage(curr_room.image_uri);
        return[pos[0]+img.width/2, pos[1]+img.height/2];
    }

    canvasToWorld(x, y) {
        // canvas to world. The inverse transformation of worldToCanvas()
        var room = this.world.getCurrentRoom();
        return[(x - this.canvas.width/2)/room.scale, (y - this.canvas.height/2)/room.scale];
    }

    draw(ctx){
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        ctx.fillStyle = "red";

        ctx.save();
        
        ctx.translate(this.canvas.width/2, this.canvas.height/2);
        var curr_room = this.world.getCurrentRoom();
        if(curr_room)
            ctx.scale(curr_room.scale,curr_room.scale);

        var curr_user = this.world.getCurrentUser();
        if(curr_user)
        {
            var roomImg = this.world.imageManager.loadImage(curr_room.image_uri);
            this.drawer.drawRoom(ctx, roomImg);  
    
            var users = this.world.getAllUsersInRoom(curr_room.room_id);
            users.forEach((user, id) => {
                var userIsNull = !user;
                if(userIsNull){
                    return
                }
                //console.log(user.avatar);
                var usrImg =  this.world.imageManager.loadImage(user.avatar.image_uri);
                this.drawer.drawUser(ctx,user ,usrImg);
            });
        
        }
       
        ctx.restore();
    }

    onMouse(event, mp) {
        if(event.type == "mousedown")
        {
            var localmouse = this.canvasToWorld(mp[0], mp[1])
            var curr_user = this.world.getCurrentUser();
            var curr_room = this.world.getCurrentRoom();
            
            var imgMouse = this.canvasToImage(mp[0], mp[1])
            var img = this.world.imageManager.loadImage(curr_room.image_uri);

            if( 0 < imgMouse[1] && imgMouse[1] < img.height ){
                curr_user.target_position = localmouse[0];
                this.serverSync.updateUserTargetPosition(curr_user.user_id, curr_user.target_position);

            }

        }
        else if(event.type == "mousemove")
        {

        }
        else
        {

        }
    }

    onButton(e){

        var value = e.target.value;
        if(value === "no"){
            this.showOptions(false);
        }else if( value == "yes"){
            let target_room_id = parseInt(e.target.id);
            this.chatHelper.changeRoomChat(this.world.getCurrentRoom().room_id, target_room_id);
            this.world.changeRoom(target_room_id);
            this.serverSync.updateUserRoom(this.world.getCurrentUser(), target_room_id);
            this.showOptions(false);
        }else if(value == "open"){
            document.querySelector(".chat").style.display = "block";

        }else if(value == "close"){
            document.querySelector(".chat").style.display = "none";
        }else if(value == "send-msg"){
            var curr_user = this.world.getCurrentUser();
            var curr_room = this.world.getCurrentRoom();
            var input = document.querySelector(".chat-input");
            var msg = input.value;
            if(msg != "")
            {
                input.value = "";
                console.log("sending message: " + msg);
                this.chatHelper.addMessage(curr_user.username, curr_room.room_id, msg);
                this.chat.sendMessage(curr_user, curr_room.room_id, msg);
            }
            

        }
        

    }

    onKeydown(event) {
        if (event.key === "Enter") {
            var curr_user = this.world.getCurrentUser();
            var curr_room = this.world.getCurrentRoom();
            var input = document.querySelector(".chat-input");
            var msg = input.value;
            if(msg != "")
            {
                input.value = "";
                this.chatHelper.addMessage(curr_user.username, curr_room.room_id, msg);
                this.chat.sendMessage(curr_user, curr_room.room_id,  msg);
            }
            
		}
    }

    update(dt) {
        var curr_user = this.world.getCurrentUser();
        var curr_room = this.world.getCurrentRoom();
        var users = this.world.getAllUsersInRoom(curr_room.room_id);
        var userIsNull = !curr_user;
        if(userIsNull){
            return;
        }
        //UserStateUpdater.updateUserPosition(curr_user, curr_room, dt);
        UserStateUpdater.updateAllUsersPosition(users, curr_room, dt);
        var img = this.world.imageManager.loadImage(curr_room.image_uri);

        for(var i = 0; i<curr_room.exits.length; i++){
            var epos = curr_room.exits[i].position;
            var eheight = curr_room.exits[i].height;
            var ewidth = curr_room.exits[i].width;
            
            if((curr_user.position+img.width/2)>=epos[0]-10 && (curr_user.position+img.width/2)<=(epos[0]+ewidth-10)){
                document.querySelector(".yesButton").id = curr_room.exits[i].to_room_id;
                this.showOptions(true);
                break;
                
            }
        }
    }

    onUserJoin(data) {
        // Get the data from the Chat.OnUserJoin() and send create a new user and add it to a room
    }

    onMessage(data) {
        // Get the data from the Chat.onMessageServer() and display it on the screen using the Drawer function
    }

    showOptions(show){
        var not_canvas = document.querySelector(".change-room");  
        var yesbutton = document.querySelector(".yesButton");
      
        if(show){
            var text = not_canvas.querySelector("p")
            var room = this.world.getRoom(yesbutton.id);
            text.innerText = "do you want to go to the "+room.room_name+"?";
            not_canvas.style.display = "block";

        }else{
            
            not_canvas.style.display = "none";
        }          
        

        
    }

}
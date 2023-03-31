import {ChatUIHelper} from "./chat.js";
import {Drawer} from "./draw.js";
import { Renderer } from "./renderer.js";
import { StreamConsumer, StreamProducer } from "./videoTransmission/connector.js";

export default class App {
    constructor(chat, world, rendererScene) {
        this.world = world;
        this.drawer = new Drawer();
        this.chat = chat;
        this.chatHelper = new ChatUIHelper();
        this.scene = rendererScene;
        this.renderer = new Renderer(this.scene);
    }

    start(){
        var buttons = document.querySelectorAll("button");
	    buttons.forEach(btn =>{
		    btn.addEventListener("click", this.action.bind(this));
	    })

        this.showStreamButton();

        this.renderer.init();
     
        this.scene.loadUserSceneNodes();
        this.scene.loadRoom();
        this.renderer.startRendering()

        // If there is a stream, use it
        const room = this.world.getCurrentRoom();
        const stream_id = room.stream_id; 
        if(stream_id) {
            this.onStream(stream_id);
        }

        // Stream callback
        this.chat.on_stream_id = this.onStream.bind(this);
    }

    onStream(id) {
        const consumer = new StreamConsumer();

        consumer.connectToID(id);

        const video = document.querySelector("video#other");

        video.addEventListener('loadedmetadata', this.scene.loadStreamVideo.bind(this.scene));

        console.log("Start receiving stream :P");
    }

    showStreamButton() {
        const user = this.world.getCurrentUser();

        //const userIsStreamer = user.isStreamer();
        const userIsStreamer = true;
        if (!userIsStreamer) { alert("You are not a streamer!");
            return;
        }

        const streamButton = document.querySelector("button#stream-btn");
        streamButton.style.display = "block";

        streamButton.addEventListener("click", this.startStream.bind(this));
    }

    startStream() {
        const producer = new StreamProducer();

        producer.on_get_stream_id = function(id) {
            producer.streamWebcam(this.chat.sendStreamIdToServer.bind(this.chat), id);
            console.log("Streaming...");
        }.bind(this);
    }

    action(e){
        var value = e.target.value;
        if(value == "open"){
            var chat = document.querySelector(".chat");
            chat.style.display = "";
        }
        else if(value == "close"){
            var chat = document.querySelector(".chat");
            chat.style.display = "none";
        }
        else if(value == "free-cam")
        {
            this.renderer.freeCamera();
        }
        else if(value == "send-msg"){
            var curr_user = this.world.getCurrentUser();
            var input = document.querySelector(".chat-input");
            var msg = input.value;
            if(msg != "")
            {
                input.value = "";
                console.log("sending message: " + msg);
                this.chatHelper.addMessage(curr_user.username, msg);
                this.chat.sendMessage(curr_user, msg);
            }
        }
    }
}

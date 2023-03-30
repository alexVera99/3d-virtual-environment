import { createEmptyMediaStream } from "./utilsMediaStream.js";

export class P2PConnector {
    constructor() {
        this.peer = new Peer();

        this.id = undefined;
        this.peer.on('open', this.onOpen.bind(this))
        
        // callbacks
        this.on_open = undefined;
    }

    onOpen(id) {
        this.id = id;

        if(this.on_open) {
            this.on_open(id);
        }
    }

    connectToID(id, videoHTMLOther) {
        const mediaStream = createEmptyMediaStream();
        const conn = this.peer.call(id, mediaStream);

        conn.on('open', function () {
            // Receive messages
            conn.on('data', function (data) {
                console.log('Received', data);
                //showMessage( data );
            });

            // Send messages
            conn.send('Hello!');
        });

        // if he answer my call, get his stream and show it
        conn.on('stream', function (remoteStream) {
            videoHTMLOther.srcObject = remoteStream;
        });
    }

    enableIncomingCalls(stream) {
        this.stream = stream;

        //incomming calls
        this.peer.on('call', function (call) {
            console.log("somebody calls me!", call);
            //showMessage( "somebody calls me!" );

            call.answer(this.stream); // Answer the call with an A/V stream.
            /*call.on('stream', function (remoteStream) {
               //Nothing to too 
            });*/
        }.bind(this));
    }
}

export class StreamProducer {
    // Generates the video stream and transmits 
    // to the clients that connect to it
    constructor() {
        this.connector = new P2PConnector();
        this.connector.on_open = (id) => {
            console.log(id);
        }
        this.my_stream = undefined;
    }

    streamWebcam() {
        const getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        const videoHTML = document.querySelector("video#me");

        getUserMedia({ video: true, audio: true }, function (stream) {
            videoHTML.srcObject = stream;
            videoHTML.volume = 0; //avoid audio feedback
            this.my_stream = stream;
            this.connector.enableIncomingCalls(this.my_stream);
        }.bind(this), function (err) {
            console.log('Failed to get camera stream', err);
        });
    }
}

export class StreamConsumer {
    // Connects to a producer and gets the video

    constructor() {
        this.connector = new P2PConnector();
        this.streamHTML = document.querySelector("video#other");
    }

    connectToID(id) {
        console.log("Trying to connect...");
        this.connector.connectToID(id, this.streamHTML);
    }
}

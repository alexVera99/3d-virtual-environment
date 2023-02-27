import { ImageManager } from "./dataManagers.js";
export class CanvasTransformer {
    transform(canvas, ctx, scale) {
        // Apply canvas transformation
    }

    worldToCanvas(x, y) {
        // world to canvas transformation. It will depend on the transformations applied above
    }

    canvasToWorld(x, y) {
        // canvas to world. The inverse transformation of worldToCanvas()
        return[x + canvas.width/2, y + canvas.height/2]
    }
}

export class Drawer {
    constructor() {
        this.canvasTransformer = new CanvasTransformer();
    }
    
    drawRoom(ctx, roomImage) {
        
        ctx.drawImage(roomImage,-roomImage.width/2,-roomImage.height/2);

    }
    drawUser(ctx, user, usrImg) {
        
        var facing = user.facing;
        var anim = user.avatar[user.animation]; //get the frames for the corresponding user animation
        var pos = user.position;
        
        var time = performance.now()*0.001;
        var frame = anim[Math.floor(time*15)%anim.length];

        ctx.drawImage(usrImg,frame*32,facing*64, 32,64, pos, 25, 32, 64);
        
        //draw the username box over the user
        ctx.font='normal 5px monospace';
        var width = ctx.measureText(user.username).width; /// width in pixels
        ctx.fillStyle = "white";
        ctx.fillRect((pos-width/2)+14,20,width+2, 7);
        ctx.fillStyle = "black";
        
        ctx.fillText(user.username, (pos-width/2)+15, 25);
        ctx.beginPath();
        ctx.rect((pos-width/2)+14,20,width+2, 7);
        ctx.stroke();
    }
    drawMessage(msg) {

    }   
}
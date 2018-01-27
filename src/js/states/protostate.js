states.proto = {

    step: function(dt) {
        

        //game update
        platforms.forEach( function(p,i,arr){
        });

        this.updatePlayer();

        
        
    },


    render: function(dt) {
        
        viewY = players[0].y - HEIGHT/2;
        this.drawThings(0);
        this.drawPlayer(0);


        viewY = players[1].y - HEIGHT/2;
        this.drawThings(1);
        this.drawPlayer(1);

    },

    drawThings: function(side) {
        renderTarget = BUFFER; //drawing to RAM page at address BUFFER
        clear(30);
        cursorColor2 = 0;
        backgroundOrbs.forEach(function(orb){
            pat = dither[orb.dither ]; //a dither between half and almost invisible
            fillCircle(orb.x, orb.y-viewY, orb.r, orb.color);
        })
        platforms.forEach( function(p){
            pat = dither[0];
            fillRect(p.x, p.y-viewY, p.x+p.width, p.y+10-viewY, p.color, p.color-1);
        });

        renderTarget = SCREEN;
        let startDrawX = side== 0 ? 0 : WIDTH/2;
        let endDrawX = side== 0 ? WIDTH/2 : WIDTH;
        pat = dither[0]; //solid fill.

        //screen clear for HALF the screen
        fillRect(startDrawX, HEIGHT, endDrawX,  HEIGHT, 30) 
        spr(0,0,WIDTH/2,HEIGHT, side==0 ? 0 : WIDTH/2, 0)

    },

    updatePlayer: function() {
        //console.log(Key._pressed)
        
        var p0 = players[0];
        var p1 = players[1];

        if(Key.isDown(Key.i)){
            console.log(p0);
        }
        console.log(p0)
        // player 0--------------------------- 
        p0.oldX = p0.x;
        p0.oldY = p0.y;
        p0.xvel *= p0.drag;  
        p0.yvel += p0.gravity;
        p0.yvel = p0.yvel.clamp(p0.minYvel, p0.maxYvel);
        p0.xvel = p0.xvel.clamp(p0.minXvel, p0.maxXvel);

        let dx = 1/60 * p0.xvel;
        let dy = 1/60 * p0.yvel;

        p0.x += dx;
        //collision resolution here
        p0.y += dy;
        //collision y resolution here

        if(p0.yvel > 0){
            p0.jumping = false;
        }
        if (Key.isDown(Key.d)) {
            p0.facingLeft = false;
            p0.xvel =  p0.xSpeed;
          }
          if (Key.isDown(Key.a)){
            p0.facingLeft = true;
            p0.xvel =  - p0.xSpeed;
          }
          if(Key.isDown(Key.w)){
            if(!p0.jumping){
              p0.jumping = true;
              p0.yvel = -p0.ySpeed;
            }
          }
        // player 1 keyboard input handling---------- 
        
        
        // gamepad input handling
        
            //have to check, will bail if doesn't exist.
            // if(gp0){
            //     //console.log(gp0.axes[1]);
            //     if(Math.abs(gp0.axes[0]) > .1){
            //         p0.xVelocity += gp0.axes[0] * p0.ySpeed;   
            //     }
            //     if(gp0.buttons[11]){
            //         p0.yVelocity = -jumpVelocity;
            //     }
            // }
            

    },

    drawPlayer: function(player) {
        let p = players[player];
        renderTarget = SCREEN; 
        fillRect(p.x, p.y-viewY, p.x+16, p.y+16-viewY, Math.random()*63, Math.random()*63);
    }

};

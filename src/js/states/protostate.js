states.proto = {

    step: function(dt) {
        

        //game update
        platforms.forEach( function(p,i,arr){
        });

        this.updatePlayer();
    },


    render: function(dt) {

        this.drawThings(0);
        this.drawThings(1);

    },

    drawThings: function(side) {
        viewY = players[side].y;
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
        var p0 = players[0];
        var p1 = players[1];

        p0.yVelocity*= .5;
        p0.xVelocity = 0;
        p1.yVelocity*= .5;
        p1.xVelocity = 0;

        // player 0  keyboard input handling----------    
        if(Key.isDown(Key.w)){
            players[0].y-=2 
        } else if(Key.isDown(Key.s)){
            players[0].y+=2
        }
        // player 1 keyboard input handling---------- 
        if(Key.isDown(Key.i)){
            players[1].y-= players[1].ySpeed * t/60;
        } else if(Key.isDown(Key.k)){
            players[1].y+= players[1].ySpeed * t/60;
        }

        // gamepad input handling
        
            //have to check, will bail if doesn't exist.
            if(gp0){
                //console.log(gp0.axes[1]);
                if(Math.abs(gp0.axes[1]) > .1){
                    p0.y += gp0.axes[1] * p0.ySpeed;   
                }
            }
            if(gp1){
                if(Math.abs(gp1.axes[1]) > .1){
                    p1.y += gp1.axes[1] * p1.ySpeed;
                }
            }
            
        p0.y += p0.yVelocity;
        p1.y += p1.yVelocity;

    },

    drawPlayer: function(player) {
        let p = players[player];
        fillRect(p.x, py, 16, 16);
    }

};

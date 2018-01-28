states.proto = {

    step: function(dt) {
        

        //game update
        platforms.forEach( function(p, index, arr){
            pat = dither[0];
            if(p.y - viewY > HEIGHT + 20){  // Off the screen
                arr.splice(index, 1) // Remove platform
                var platform1 = generatePlatform(arr[arr.length-1].y- platformInterval, difficulty, 19,0) //create new platform
                var platform2 = generatePlatform(arr[arr.length-1].y- platformInterval, difficulty, 3,0) //create new platform
                arr.push(platform1)  //Add new platform
                arr.push(platform2)  //Add new platform
            }
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

        renderTarget = COLLISION; 
        clear(0);
        renderTarget = BUFFER;
        clear(30);
        cursorColor2 = 0;
        backgroundOrbs.forEach(function(orb){
            if(orb.y - viewY < HEIGHT + 100 && orb.y - viewY > 0 - 100){
                renderTarget = BUFFER;
                pat = dither[orb.dither ]; //a dither between half and almost invisible
                fillCircle(orb.x, orb.y-viewY, orb.r, orb.color);
            }
            
        })
        platforms.forEach( function(p){
            if(p.y - viewY < HEIGHT && p.y - viewY > 0){
                renderTarget = BUFFER;
                pat = dither[0];
                fillRect(p.x, p.y-viewY, p.x2, p.y2-viewY, p.color, p.color-1); 
                renderTarget = COLLISION;
                fillRect(p.x, p.y-viewY, p.x2, p.y2-viewY, p.color); 
            }   
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
        //debugger;
        var p0 = players[0];
        var p1 = players[1];

        
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
            // cx = 
            // if(ram[COLLISION + p ])
            platforms.some(function(e){
                if(p0.oldY + 17 <= e.y && p0.y + 17 >= e.y && p0.x + 16 > e.x && p0.x < e.x2)
                {
                    p0.yvel = 0;
                    p0.y = e.y - 17;
                    p0.jumping = false;
                    return true;
                }
            });
        }

        // input
        if (Key.isDown(Key.d)) {

            p0.facingLeft = false;
            p0.xvel =  p0.xSpeed;
            if (p0.x > (WIDTH / 2) - 16)
            {
                p0.xvel = 0;
            }
          }
          if (Key.isDown(Key.a)){

            p0.facingLeft = true;
            p0.xvel =  - p0.xSpeed;
            if (p0.x < 0)
            {
                p0.xvel = 0;
            }
          }
          p0.x.clamp(p0,0,(WIDTH/2) - 16);
          if(Key.isDown(Key.w) || Key.isDown(Key.SPACE)){
            if(!p0.jumping){
              p0.jumping = true;
              p0.yvel = -p0.ySpeed;
            }
          } 
        //----- gamepad input handling
        
            if(gp0){
                if(Math.abs(gp0.axes[0]) > .1){
                    p0.xvel += gp0.axes[0] * p0.maxXvel;   
                }
                if(gp0.buttons[11].pressed){
                    if(!p0.jumping){
                        p0.jumping = true;
                        p0.yvel = -p0.ySpeed;
                      }
                }  
            }
            

    },

    drawPlayer: function(player) {
        let p = players[player];
        renderTarget = SCREEN; 
        fillRect(p.x, p.y-viewY, p.x+16, p.y+16-viewY, Math.random()*63, Math.random()*63);
    }

};

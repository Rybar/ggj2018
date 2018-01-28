states.proto = {

    step: function(dt) {
        

        //game update
        platforms.forEach( function(p, index, arr){
            pat = dither[0];
            if(p.y - viewY > HEIGHT + 200){  // Off the screen
                arr.splice(index, 2) // Remove platform
                let color1 = Math.floor(Math.random() * Math.floor(3));
                let color2 = Math.floor(Math.random() * Math.floor(3));
                while(color1 == color2){
                    color2 = Math.floor(Math.random() * Math.floor(3));
                }
                var platform1 = generatePlatform(arr[arr.length-1].y- platformInterval, difficulty, platformColors[color1],0) //create new platform
                var platform2 = generatePlatform(arr[arr.length-1].y- platformInterval, difficulty, platformColors[color2],0) //create new platform
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
        this.init_player(0);
        this.init_player(1); 

        let dx0 = 1/60 * p0.xvel;
        let dy0 = 1/60 * p0.yvel;

        let dx1 = 1/60 * p1.xvel;
        let dy1 = 1/60 * p1.yvel;

        p0.x += dx0;
        p0.y += dy0;

        p1.x += dx1;
        p1.y += dy1;

        this.collision_detect(0);
        this.collision_detect(1);
        //collision y resolution here

        // input
        if (Key.isDown(Key.d)) {
            this.move_right(0);
        }
        if (Key.isDown(Key.a)){
            this.move_left(0);
        }
        if(Key.isDown(Key.w) || Key.isDown(Key.SPACE)){
            this.jump(0);
        } 

        if (Key.isDown(Key.l)) {
            this.move_right(1);
        }
        if (Key.isDown(Key.j)){
            this.move_left(1);
        }
        if(Key.isDown(Key.i) || Key.isDown(Key.SEMICOLON)){
            this.jump(1);
        } 

        //----- gamepad input handling
        
        if(gp0){
            if(Math.abs(gp0.axes[0]) > .1){
                if(gp0.axes[0] < 0)
                {
                    this.move_left(0);
                }
                if(gp0.axes[0] > 0)
                {
                    this.move_right(0);
                }
            }
            if(gp0.buttons[11].pressed){
                this.jump(0);
            }  
        }

        if(gp1){
            if(Math.abs(gp1.axes[0]) > .1){
                if(gp1.axes[0] < 0)
                {
                    this.move_left(1);
                }
                if(gp1.axes[0] > 0)
                {
                    this.move_right(1);
                }
            }
            if(gp1.buttons[11].pressed){
                this.jump(1);
            }  
        }
        

        p0.x.clamp(p0,0,(WIDTH/2) - 16);
        p1.x.clamp(p1, WIDTH / 2, WIDTH - 16);        
    },

    drawPlayer: function(player) {
        let p = players[player];
        renderTarget = SCREEN; 
        fillRect(p.x, p.y-viewY, p.x+16, p.y+16-viewY, 12,12);
    },

    collision_detect: function(player){
        let p = players[player];
        if(p.yvel > 0){
            var xVal = (p.x < (WIDTH/2)) ? p.x : p.x - (WIDTH/2);
            platforms.some(function(e){
                if(p.oldY + 17 <= e.y && p.y + 17 >= e.y && xVal + 16 > e.x && xVal < e.x2)
                {
                    p.yvel = 0;
                    p.y = e.y - 17;
                    p.jumping = false;
                    return true;
                }
            });
        }
    },

    move_right: function(player){
        let p = players[player];
        p.facingLeft = false;
        p.xvel =  p.xSpeed;
        var xVal = (p.x === players[0].x) ? p.x : p.x - (WIDTH/2);
        if (xVal > (WIDTH / 2) - 16)
        {
            p.xvel = 0;
        }
    },

    move_left: function(player){
        let p = players[player];
        p.facingLeft = true;
        p.xvel =  - p.xSpeed;
        var xVal = (p.x === players[0].x) ? p.x : p.x - (WIDTH / 2);
        if (xVal < 0)
        {
            p.xvel = 0;
        }    
    },

    jump: function(player){
        let p = players[player];

        // if(!p0.jumping){ // this gives you one free jump after falling off a platform
        if(0 === p.yvel && !p.jumping){
            p.jumping = true;
            p.yvel = -p.ySpeed;
        }
    },

    init_player: function(player){
        let p = players[player];

        p.oldX = p.x;
        p.oldY = p.y;
        p.xvel *= p.drag;  
        p.yvel += p.gravity;
        p.yvel = p.yvel.clamp(p.minYvel, p.maxYvel);
        p.xvel = p.xvel.clamp(p.minXvel, p.maxXvel);        
    }
};

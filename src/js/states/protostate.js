states.proto = {

    step: function(dt) {
        //game update
        platforms.forEach( function(p, index, arr){
        });
        this.updatePlayer()
        if(gameStartTime){
            let timeSinceGameStart = Math.floor((t-gameStartTime)/100);
            gameClock = (gameDuration - timeSinceGameStart).pad(2);
            if(gameClock < 10){
                gameClockColor = gameClock%2==1?9:4
            }
            if(gameClock === "00"){
            }
        }

        this.updateFill();      
    },

    render: function(dt) {
        
        viewY = players[0].y - HEIGHT/2;
        this.drawThings(0);
        this.drawPlayer(0);
        text([players[0].score.pad(3), 0, 0, 3, 2,  'left', 'top', 3, 9]);

        viewY = players[1].y - HEIGHT/2;
        this.drawThings(1);
        this.drawPlayer(1);
        text([players[1].score.pad(3), WIDTH, 0, 3, 2,  'right', 'top', 3, 9]);

        text([gameClock, WIDTH/2, 0, 3, 2,  'center', 'top', 3, gameClockColor]);
        if(gameClock === "00"){
            state = 'gameover'
        }
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
        pat = dither[8];
        fillRect(0, 0, WIDTH, fill_y, platformColors[fillColor], 0);
        pat = dither[8];
        fillRect(0, fill_y, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[4];
        fillRect(0, fill_y+5, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[2];
        fillRect(0, fill_y+9, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[8];
        for(let i = 0; i < 100; i++){
            let x = Math.random()*WIDTH;
            pset(x, fill_y+10, 22,22);
            circle(x, fill_y+10, Math.random()*3|0, platformColors[fillColor],22)
        }
        
        if(true === filling)
        {
            pat = dither[8];
            fillRect(0, fill_y + 1, WIDTH, HEIGHT, platformColors[prevFillColor], 0);
        }   

        platforms.forEach( function(p){
            if(p.canCollide[side]){
                if(p.y - viewY < HEIGHT && p.y - viewY > 0){
                    renderTarget = BUFFER;
                    pat = dither[0];
                    fillRect(p.x, p.y-viewY, p.x2, p.y2-viewY, p.color, p.color-1); 
                }   
            }   
        });

        pickups.forEach( function(p){
            if(p.y - viewY < HEIGHT && p.y - viewY > 0){
                renderTarget = BUFFER;
                renderSource = SPRITES;
                let s = sprites.pickup;
                spr(s.x+s.width * ( ( (t%40)/10 )|0 ), s.y, s.width, s.height, p.x, p.y-viewY );
                //console.log( ( (t%40) / 4)|0 )
                //fillRect(p.x, p.y-viewY, p.x+p.width, p.y+p.height-viewY, 22); 
            }   
        });
        

        renderTarget = SCREEN;
        let startDrawX = side== 0 ? 0 : WIDTH/2;
        let endDrawX = side== 0 ? WIDTH/2 : WIDTH;
        pat = dither[0]; //solid fill.

        //screen clear for HALF the screen
        fillRect(startDrawX, HEIGHT, endDrawX,  HEIGHT, 30)
        renderSource = BUFFER; 
        spr(0,0,WIDTH/2,HEIGHT, side==0 ? 0 : WIDTH/2, 0)

        line(WIDTH/2,0,WIDTH/2,HEIGHT,22,22);

    },

    updatePlayer: function() {
        var p0 = players[0];
        var p1 = players[1];

        p0.score = Math.abs(Math.floor(p0.y/platformInterval) - 2) + (p0.coins * coinvalue);
        p1.score = Math.abs(Math.floor(p1.y/platformInterval) - 2) + (p1.coins * coinvalue);

        //Determine who's winning
        if(p0.score > p1.score){
            p0.status = "WINNER";
            p0.statusColor = 13;
            p1.status = "LOSER";
            p1.statusColor = 4;
        }else if(p0.score < p1.score){
            p0.status = "LOSER";
            p0.statusColor = 4;
            p1.status = "WINNER";
            p1.statusColor = 13;
        } else {
            p0.status = "TIE";
            p0.statusColor = 4;
            p1.status = "TIE";
            p1.statusColor = 4;
        }

        
        // player 0---------------------------
        this.init_player(0);
        this.init_player(1); 

        let dx0 = 1/60 * p0.xvel;
        let dy0 = 1/60 * p0.yvel;

        let dx1 = 1/60 * p1.xvel;
        let dy1 = 1/60 * p1.yvel;

        p0.x = (p0.x + dx0).clamp(p0.xMin, p0.xMax);
        p0.y += dy0;

        p1.x = (p1.x + dx1).clamp(p1.xMin, p1.xMax);
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
        if(Key.isDown(Key.w)){
            this.jump(0);
        }
        else
        {
            p0.jumpPressed = false;
        } 

        if (Key.isDown(Key.l)) {
            this.move_right(1);
        }
        if (Key.isDown(Key.j)){
            this.move_left(1);
        }
        if(Key.isDown(Key.i)){
            this.jump(1);
        }
        else
        {
            p1.jumpPressed = false;
        } 

        //----- gamepad input handling
        
        if(gp0){
            let deadzone = .4
            if(Math.abs(gp0.axes[0]) > deadzone){
                if(gp0.axes[0] < -deadzone)
                {
                    this.move_left(0);
                }
                if(gp0.axes[0] > deadzone)
                {
                    this.move_right(0);
                }
            }
            if(gp0.buttons[11].pressed){
                this.jump(0);
            } 
            else
            {
                p0.jumpPressed = false;
            } 
        }

        if(gp1){
            let deadzone = .4
            if(Math.abs(gp1.axes[0]) > deadzone){
                if(gp1.axes[0] < -deadzone)
                {
                    this.move_left(1);
                }
                if(gp1.axes[0] > deadzone)
                {
                    this.move_right(1);
                }
            }
            if(gp1.buttons[11].pressed){
                this.jump(1);
            } 
            else
            {
                p1.jumpPressed = false;
            } 
        }
    },

    drawPlayer: function(player) {
        let p = players[player];
        renderTarget = SCREEN;
        //fillRect(p.x, p.y-viewY, p.x+16, p.y+16-viewY, 12,12);
        renderSource = SPRITES;
        let s = player == 0 ? sprites.player0 : sprites.player1
        spr(s.x,s.y,s.width,s.height,p.x,p.y-viewY, !p.facingLeft)
    },

    collision_detect: function(player){        
        let p = players[player];
        
        pickups.forEach(function(c, i, a){
            let x1check = (p.x <= c.x2 && p.x >= c.x);
            let x2check = (p.x + p.width <= c.x2 && p.x + p.width >= c.x);
            let y1check = (p.y <= c.y2 && p.y >= c.y);
            let y2check = (p.y + p.height <= c.y2 && p.y + p.height >= c.y);

            if ((x1check || x2check) && (y1check || y2check))
            {
                p.coins++;
                a.splice(i, 1);
            }
        });


        if(p.yvel > 0){
            var xVal = (p.x < (WIDTH/2)) ? p.x : p.x - (WIDTH/2);
            platforms.some(function(e){
                if(e.canCollide[player] && (p.oldY + 17 <= e.y && p.y + 17 >= e.y && xVal + 16 > e.x && xVal < e.x2))
                {
                    if(p.yvel > p.gravity)
                    {
                    	playSound(sounds.land, 1, 0, .10, false);
                    }
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
        p.x = p.x.clamp(p.xMin, p.xMax);
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
        p.x = p.x.clamp(p.xMin, p.xMax);
    },

    jump: function(player){
        let p = players[player];

        if (!p.jumpPressed) {
            // if(!p0.jumping){ // this gives you one free jump after falling off a platform
            if(0 === p.yvel && !p.jumping){
                p.jumping = true;
                p.yvel = -p.ySpeed;
                playSound(sounds.jump, 1, 0, .10, false);
            }
        }

        p.jumpPressed = true;
    },

    init_player: function(player){
        let p = players[player];

        p.oldX = p.x;
        p.oldY = p.y;
        p.xvel *= p.drag;  
        p.yvel += p.gravity;
        p.yvel = p.yvel.clamp(p.minYvel, p.maxYvel);
        p.xvel = p.xvel.clamp(p.minXvel, p.maxXvel);        
    },

    updateFill: function(){

        if(per_time(five_div))
        {
            time_left = duration;
            filling = true;
            prevFillColor = fillColor;
            ++fillColor;
            if(3 == fillColor)
            {
                fillColor = 0;
            }
        }
    
        if(true === filling)
        {
          fill_y = (duration - time_left) * HEIGHT / duration;
          --time_left;
          if(0 >= time_left)
          {
            filling = false;
            fill_y = HEIGHT;
          }
        }
        else if(duration != next_duration)
        {
          duration = next_duration;
        }

        players.forEach(function(p, i){
            platforms.forEach(function(e){
                if(((e.y2 - p.y + HEIGHT/2) <= fill_y && e.color === platformColors[fillColor])
                || ((e.y - p.y + HEIGHT/2) > fill_y && e.color === platformColors[prevFillColor])) {
                    e.canCollide[i] = false;
                }
                else{
                    e.canCollide[i] = true;
                }
            })
        });
    }
};

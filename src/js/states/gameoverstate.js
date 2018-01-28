//--------gameoverstate.js-----------

states.gameover = {

    step: function(dt) {

        if(Key.isDown(Key.r)){
          state = 'menu';
        }

    },

    render: function(dt) {

      renderTarget = 0x0;
      // clear(0);
      cursorColor2 = 5;
      text([
        'GAME OVER',
        WIDTH/2,
        80,
        8,
        15,
        'center',
        'top',
        4,
        27,
      ]);

      text([
        players[0].status,
        WIDTH/4,
        180,
        8,
        15,
        'center',
        'top',
        2,
        players[0].statusColor,
      ]);
      text([
        players[1].status,
        WIDTH/2 + WIDTH/4,
        180,
        8,
        15,
        'center',
        'top',
        2,
        players[1].statusColor,
      ]);

    },

};

//---------END gameoverstate.js----------

//--------gameoverstate.js-----------

states.gameover = {

    step: function(dt) {

        if(Key.isDown(Key.r)){
          state = 'menu';
        }

    },

    render: function(dt) {

      renderTarget = 0x0;
      clear(0);
      cursorColor2 = 5;
      text([
        'GAME OVER',
        384/2,
        80,
        8,
        15,
        'center',
        'top',
        4,
        27,
      ]);

    },

};

//---------END gameoverstate.js----------

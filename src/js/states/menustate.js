//--------------menustate.js---------------

states.menu = {//

  step: function(dt) {
      if(Key.isDown(Key.SPACE)){
        state = 'game';
      }
  },

  render: function(dt) {
    
    text([
            'TITLE',
            WIDTH/2,
            50,
            14,
            20,
            'center',
            'top',
            6,
            21,
        ]);

      }

};

//-------END menustate.js-------------

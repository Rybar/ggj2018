states.loading = {

    init: function(dt){
      
       
        
    },

    step: function(dt) {
      if(soundsReady && Key.isDown(Key.SPACE)){
        playSound(sounds.song, 1, 0, .15, true);
        state = 'proto'
      
      }
    },

    render: function(dt) {
      renderTarget = SCREEN; clear(0);
      if(soundsReady = true){
        text([
          "READY",
          WIDTH/2,
          128 + Math.sin(t/60) * 20,
          3,
          2,
          'center',
          'top',
          3,
          9,
        ]);
      }
      else{
        text([
          "LOADING...",
          WIDTH/2,
          128 + Math.sin(t/60) * 20,
          3,
          2,
          'center',
          'top',
          3,
          9,
        ]);
      }
      
    } //end render;

}; //end loading state

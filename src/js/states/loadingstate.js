states.loading = {

    init: function(dt){
      
       
        
    },

    step: function(dt) {
      if(soundsReady && Key.isDown(Key.SPACE)){
        playSound(sounds.song, 1, 0, .5, true);
        state = 'proto'
      
      }
    },

    render: function(dt) {
      renderTarget = SCREEN; clear(0);
      renderTarget = BUFFER; clear(0);
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
        text([
          "HIT SPACE TO PLAY",
          WIDTH/2,
          160 + Math.sin(t/60) * 20,
          2,
          2,
          'center',
          'top',
          2,
          9,
        ]);
        outline(BUFFER, SCREEN, 6,9,6,3);
        renderTarget = SCREEN;
        renderSource = BUFFER;
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

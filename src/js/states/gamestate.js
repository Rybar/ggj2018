//---gamestate.js------------------------------

states.game = {

  

  step(dt) {
    bx = WIDTH/2 + 60*cos(t/2);
    if(Key.isDown(Key.f)){
      state = 'gameover';
    }
  },

  render(dt) {
    renderTarget = SCREEN; clear(0);
    pat = dither[8];
    fillRect(bx-20, 60, bx+20, 140, 4,5);
  }
}





//---END gamestate.js------------------------------

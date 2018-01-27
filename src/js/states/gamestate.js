//---gamestate.js------------------------------

states.game = {

  step(dt) {
    // if(Math.trunc(t) % 4 === 0)
    // {
    //   kev_x = (WIDTH-20)/2 * cos(t/2) + (WIDTH-20)/2;
    // }
    // else if(Math.trunc(t) % 4 === 1)
    // {
    //   kev_y = (HEIGHT-40)/2 - (HEIGHT-40)/2 * cos(t/2);
    // }
    // else if(Math.trunc(t) % 4 === 2)
    // {
    //   kev_x = (WIDTH-20)/2 - (WIDTH-20)/2 * cos(t/2);
    // }
    // else
    // {
    //   kev_y = (HEIGHT-40)/2 + (HEIGHT-40)/2 * cos(t/2);
    // }
    // console.log("("+ kev_x + "," + kev_y + ")");

    if(0 === filling && 0 === Math.trunc(t) % 5)
    {
      time_left = duration;
      filling = 1;
      ++fillColor;
      if(6 == fillColor)
      {
        fillColor = 3;
      }
    }

    if(1 === filling)
    {
      kev_y = (duration - time_left) * HEIGHT / duration;
      console.log(kev_y);
      --time_left;
      if(0 === time_left)
      {
        filling = 0;
        kev_y = HEIGHT;
      }
    }

    if(Key.isDown(Key.f)){
      state = 'gameover';
    }
  },

  render(dt) {
    renderTarget = SCREEN; clear(0);
    pat = dither[8];
    fillRect(0, 0, WIDTH, kev_y, fillColor, fillColor);
  }
}





//---END gamestate.js------------------------------

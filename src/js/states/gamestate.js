//---gamestate.js------------------------------

states.game = {

  step(dt) {
    if(per_time(five_div))
    {
      time_left = duration;
      filling = 1;
      prevFillColor = fillColor;
      ++fillColor;
      if(6 == fillColor)
      {
        fillColor = 3;
      }
    }

    if(1 === filling)
    {
      fill_y = (duration - time_left) * HEIGHT / duration;
      --time_left;
      if(0 >= time_left)
      {
        filling = 0;
        fill_y = HEIGHT;
      }
    }
    else if(duration != next_duration)
    {
      duration = next_duration;
    }

    if(Key.isDown(Key.UP))
    {
      next_duration = (next_duration <= 232) ? next_duration + 18 : next_duration = 250;
      console.log("duration changed to: " + next_duration);
    }
    if(Key.isDown(Key.DOWN))
    {
      next_duration = (next_duration >= 48) ? next_duration - 18 : next_duration = 30;
      console.log("duration changed to: " + next_duration);
    }
    if(Key.isDown(Key.f)){
      state = 'gameover';
    }
  },

  render(dt) {
    renderTarget = SCREEN; clear(0);
    pat = dither[8];
    fillRect(0, 0, WIDTH, fill_y, fillColor, fillColor);
    if(1 === filling)
    {
      fillRect(0, fill_y + 1, WIDTH, HEIGHT, prevFillColor, prevFillColor);
    }
  }
}





//---END gamestate.js------------------------------

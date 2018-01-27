//-----main.js---------------

states = {};

init = () => {
  
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  lcg = new LCG(1019);

  sounds = {};
  soundsLoaded = 0;
  totalSounds = 8;
  score = 0;
  last = 0;
  dt = 0;
  now = 0;
  t = 0;
  bx = 0,
  kev_x = 0,
  kev_y = HEIGHT,
  filling = 0,
  time_left = 0,
  duration = 180,
  fillColor = 3,
  platformInterval = 40;
  platformSpeed = .6;
  playerSpeed = 2;
  state = 'proto';

  players = [{
    x: 0,
    y: 0,
    xVelocity: 0,
    yVelocity: 0,
    ySpeed: playerSpeed
  },

  {
    x: 0,
    y: 0,
    xVelocity: 0,
    yVelocity: 0,
    ySpeed: playerSpeed
  } ]


  platforms = [];
  backgroundOrbs = [];

  for(let i= 0; i < 10; i++){
    platforms.push({
      x: Math.random()*WIDTH/2,
      y: i*platformInterval,
      color: Math.random()*12 + 4|0,
      width: Math.random()*50|0,
    })
  }

  for(let i= 0; i < 20; i++){
    backgroundOrbs.push({
      x: Math.random()*WIDTH/2,
      y: i*10,
      r: Math.random()*30,
      dither: Math.random()*6+7|0,
      color: 29
    })
  }
  


  //FLAGS--------------------------------------------------------------
  paused = false;

  //sound flags--------------------------------------------------------
  

  audioCtx = new AudioContext;
 
   loop();

}

//initialize  event listeners--------------------------
window.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function (event) {
  Key.onKeydown(event);
}, false);
window.addEventListener('blur', function (event) {
  paused = true;
}, false);
window.addEventListener('focus', function (event) {
  paused = false;
}, false);
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length);
});

loop = e => {
  stats.begin();
  gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  gp0 = gamepads[0];
  gp1 = gamepads[1];

  if(paused){

    text([
      'PAUSED',
      WIDTH/2,
      128,
      3,
      1,
      'center',
      'top',
      4,
      21,
      0
    ])

  }else {
    pal = palDefault;
    //game timer
    //let now = new Date().getTime();
    //dt = Math.min(1, (now - last) / 1000);
    t += 1;

    states[state].step(dt);
    //last = now;

    //draw current state to buffer
    states[state].render();

    }
  //draw buffer to screen
  render(e);

  stats.end();
  requestAnimationFrame(loop);
}

//----- END main.js---------------

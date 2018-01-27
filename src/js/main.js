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
  state = 'menu';
  


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

loop = e => {
  stats.begin();

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
    let now = new Date().getTime();
    dt = Math.min(1, (now - last) / 1000);
    t += dt;

    states[state].step(dt);
    last = now;

    //draw current state to buffer
    states[state].render();

    }
  //draw buffer to screen
  render(e);

  stats.end();
  requestAnimationFrame(loop);
}

//----- END main.js---------------

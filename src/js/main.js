//-----main.js---------------

states = {};

init = () => {
  
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  //----------SOUND-------------------------
  audioCtx = new AudioContext;
  audioMaster = audioCtx.createGain();
  audioMaster.connect(audioCtx.destination);
  bufferLoader = new BufferLoader(
    audioCtx,
    [
      'level.mp3',
      'death.mp3',
      'jump.mp3',
      'land.mp3'
    ],
    nameAudioBuffers
    );

    bufferLoader.load();
  
  //---------INIT VARS.  MOAR GLOBALS--------
  lcg = new LCG(1019);
  soundsReady = false;
  sounds = {};
  score = 0;
  last = 0;
  dt = 0;
  now = 0;
  t = 0;

  fill_y = HEIGHT,
  filling = 0,
  time_left = 0,
  duration = 180,
  fillColor = 3,
  prevFillColor = 5,
  five_div = { division:5, next_div:0 },
  thirty_div = { division:30, next_div:0 },
  next_duration = 180,
  platformInterval = 100;
  platformSpeed = .6;

  //---playerVars----------
  playerSpeed = 2;
  gravity = 8;
  drag = .8;
  jumpVelocity = 4;
  state = 'loading';

  players = [{
    x: WIDTH/4,
    xMin:0,
    xMax: WIDTH/2 - 17,
    y: 100,
    xvel: 0,
    yvel: 0,
    xSpeed: 700,
    ySpeed: 600,
    drag: .8,
    gravity: 25,
    maxYvel: 250,
    maxXvel: 250,
    minYvel: -700,
    minXvel: -250,
    facingLeft: false,
    jumping: false,
    jumpCooldown: 0,
    score: 0,
    jumpPressed: false
  },

  {
    x: (WIDTH/4)*3,
    xMin: WIDTH/2,
    xMax: WIDTH - 17,
    y: 100,
    xvel: 0,
    yvel: 0,
    xSpeed: 700,
    ySpeed: 600,
    drag: .8,
    gravity: 25,
    maxYvel: 250,
    maxXvel: 250,
    minYvel: -700,
    minXvel: -250,
    facingLeft: false,
    jumping: false,
    jumpCooldown: 0,
    score: 0,
    jumpPressed: false
  } ]

  difficulties = [ 
    { 
      level:"low", 
      platformMaxSize: WIDTH/2, 
      platformMinSize: 50,
    }, 
    { 
      level:"medium", 
      platformMaxSize: WIDTH/4,  
      platformMinSize: 25,
    }, 
    { 
      level:"high", 
      platformMaxSize:WIDTH/6, 
      platformMinSize: 20,
    } 
  ] 
 
  difficulty = difficulties[2]; 

  platforms = [];
  backgroundOrbs = [];

  platformColors = [3,19, 35]
  
  for(let i= 2; i > -200; i--){
    let color1 = Math.floor(Math.random() * Math.floor(3));
    let color2 = Math.floor(Math.random() * Math.floor(3));
    while(color1 == color2){
      color2 = Math.floor(Math.random() * Math.floor(3));
    }
    var platform1 = generatePlatform(i*platformInterval,difficulty, platformColors[color1], 0)
    var platform2 = generatePlatform(i*platformInterval,difficulty, platformColors[color2], 0)
    platforms.push(platform1)
    platforms.push(platform2)
  }
  platforms.push({
    x: 10, y: HEIGHT-30, x2: WIDTH/2-10, y2: HEIGHT-20, color: 22, color2: 22 
  })

  for(let i= -100; i < 100; i++){
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

generatePlatform = (yIndex,difficulty, color1, color2) =>{ 
  var platformWidth = Math.floor(Math.random() * (difficulty.platformMaxSize-difficulty.platformMinSize)) + difficulty.platformMinSize
  var lowerBounds = platformWidth/2;
  var upperBounds = (WIDTH/2) - (platformWidth/2)
  var centerPoint =Math.floor(Math.random() * upperBounds-lowerBounds) + lowerBounds
  var platform = { 
    x: centerPoint - platformWidth/2, 
    y: yIndex, 
    x2: centerPoint + platformWidth/2, 
    y2: yIndex + 5, 
    color: color1, 
    color2: color2 
  } 
  return platform; 
} 

nameAudioBuffers =(list)=>{
  sounds.song = list[0]
  sounds.death = list[1]
  sounds.jump = list[2]
  sounds.land = list[3]
  soundsReady = true;
},

//----- END main.js---------------

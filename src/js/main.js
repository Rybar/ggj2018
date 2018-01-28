//-----main.js---------------

states = {};

init = () => {
  
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  //------ART---------------
  spritesheet = new Image();
  spritesheet.src = "sprites.png";
  spritesheet.onload = function(){
    imageToRam(spritesheet, SPRITES);
  }
  sprites = {
    player0: {
      x: 0, y:0, width: 16, height: 16,
      frames: 10,
      animations: {
        idle: [0],
        walk: [6,7,8,9],
        jump: [1,2,3,4,5],
        land: [5,4,3,2,1,0],
      }
    },
    player1: {
      x: 0, y:52, width: 16, height: 16,
      frames: 10,
      animations: {
        idle: [0],
        walk: [6,7,8,9],
        jump: [1,2,3,4,5],
        land: [5,4,3,2,1,0],
      }
    },
    ground: {
      x: 0, y:16, width: 300, height: 10
    },
    pickup: {
      x: 0, y:26, width: 10, height: 10,
      frames: 4,
      animations: {
        idle: [0,1,2,3]
      }
    }
      
  },

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
  filling = false,
  time_left = 0,
  duration = 180,
  fillColor = 0,
  prevFillColor = 2,
  five_div = { division:300, next_div:0 },
  thirty_div = { division:1800, next_div:0 },
  next_duration = 180,
  platformInterval = 100;
  platformSpeed = .6;
  gameStartTime = undefined;
  gameDuration = 30;
  gameClock = ""
  gameClockColor= 9;

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
    xSpeed: 300,
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
    jumpPressed: false,
    status: "TIE",
    statusColor: 4
  },

  {
    x: (WIDTH/4)*3,
    xMin: WIDTH/2,
    xMax: WIDTH - 17,
    y: 100,
    xvel: 0,
    yvel: 0,
    xSpeed: 300,
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
    jumpPressed: false,
    status: "TIE",
    statusColor: 4
  } ]

  difficulties = [ 
    { 
      level:"low", 
      platformMaxSize:WIDTH/6, 
      platformMinSize: 20,
      multiplier: 0.01,
      spaceMult: 8,
      spaceDiv: WIDTH/12
    }, 
    { 
      level:"medium",   
      platformMaxSize: WIDTH/8, 
      platformMinSize: 15,
      multiplier: 0.02,
      spaceMult: 12,
      spaceDiv: WIDTH/8
    }, 
    { 
      level:"high", 
      platformMaxSize: WIDTH/10,  
      platformMinSize: 10,
      multiplier: 0.03,
      spaceMult: 16,
      spaceDiv: 3*WIDTH/20
    }
  ] 
 
  difficulty = difficulties[2]; 

  platforms = [];
  pickups = [];
  backgroundOrbs = [];

  platformColors = [3,19, 35]
    platforms.push({
    x: 10, y: HEIGHT-30, x2: WIDTH/2-10, y2: HEIGHT-20, color: 22, color2: 22, canCollide: [true, true]
  })
  for(let i= 2; i > -200; i--){
    let color1 = Math.floor(Math.random() * Math.floor(3));
    let color2 = Math.floor(Math.random() * Math.floor(3));
    while(color1 == color2){
      color2 = Math.floor(Math.random() * Math.floor(3));
    }
    this.generatePlatforms(i*platformInterval, difficulty, color1, color2, i-2);
    // var platform1 = generatePlatform(i*platformInterval,difficulty, platformColors[color1], 0, (i-2))
    // var platform2 = generatePlatform(i*platformInterval,difficulty, platformColors[color2], 0, (i-2))
    // platforms.push(platform1)
    // platforms.push(platform2)
  }
  for(let i= -100; i < 100; i++){
    backgroundOrbs.push({
      x: Math.random()*WIDTH/2,
      y: i*10,
      r: Math.random()*30,
      dither: Math.random()*6+7|0,
      color: 29
    })
  }
//----------fill pickups-----------------
platforms.forEach(function(e,i,arr){
  let px = e.x
  let py = e.y-10;
  pickups.push({
    x: px, y: py, height: 10, width: 10
  })
})
  
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
    muted = true;
    audioMaster.gain.value = 0;
    paused = true;
}, false);
window.addEventListener('focus', function (event) {
    muted = false;
    audioMaster.gain.value = 1;
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

generatePlatform = (yIndex,difficulty, color1, color2, index) =>{ 
  var distanceModifier = (index * difficulty.multiplier)*-1;
  var maxPlatformSize = difficulty.platformMaxSize - distanceModifier;
  var platformWidth = Math.floor(Math.random() * (maxPlatformSize-difficulty.platformMinSize)) + difficulty.platformMinSize
  var lowerBounds = platformWidth/2;
  var upperBounds = (WIDTH/2) - (platformWidth/2)
  var centerPoint =Math.floor(Math.random() * upperBounds-lowerBounds) + lowerBounds
  var platform = { 
    x: centerPoint - platformWidth/2, 
    y: yIndex, 
    x2: centerPoint + platformWidth/2, 
    y2: yIndex + 5, 
    color: color1, 
    color2: color2,
    canCollide: [true, true]
  } 
  return platform; 
} 

generatePlatforms = (yIndex,difficulty, color1, color2, index) =>{ 
  var distanceModifier = (index * difficulty.multiplier)*-1;
  var maxPlatformSize = difficulty.platformMaxSize - distanceModifier;
  var platformWidth1 = Math.floor(Math.random() * (maxPlatformSize-difficulty.platformMinSize)) + difficulty.platformMinSize;
  var platformWidth2 = Math.floor(Math.random() * (maxPlatformSize-difficulty.platformMinSize)) + difficulty.platformMinSize;

  var leftOver = WIDTH/2 - platformWidth1 - platformWidth2;
  var lowerBounds = leftOver / 4;
  var upperBounds = leftOver / 2;
  var s = Math.floor(Math.random() * upperBounds);
  var d = Math.floor(Math.random() * upperBounds-lowerBounds) + lowerBounds;

  var platform1 = { 
    x: s, 
    y: yIndex, 
    x2: s + platformWidth1, 
    y2: yIndex + 5, 
    color: platformColors[color1], 
    color2: 0,
    canCollide: [true, true]
  };

  var platform2 = {
    x: s + platformWidth1 + d, 
    y: yIndex, 
    x2: s + platformWidth1 + d + platformWidth2, 
    y2: yIndex + 5, 
    color: platformColors[color2], 
    color2: 0,
    canCollide: [true, true]
  };

  platforms.push(platform1);
  platforms.push(platform2);
} 

nameAudioBuffers =(list)=>{
  sounds.song = list[0]
  sounds.death = list[1]
  sounds.jump = list[2]
  sounds.land = list[3]
  soundsReady = true;
}

//----- END main.js---------------

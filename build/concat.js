// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
    if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

(function(){

//--------------Engine.js-------------------

const WIDTH =     300;
const HEIGHT =    300;
const PAGES =     10;  //page = 1 screen HEIGHTxWIDTH worth of screenbuffer.
const PAGESIZE = WIDTH*HEIGHT;

const SCREEN = 0;
const BUFFER = PAGESIZE;
const BUFFER2 = PAGESIZE*2;
const BACKGROUND = PAGESIZE*3;
const MIDGROUND = PAGESIZE*4;
const FOREGROUND = PAGESIZE*5;
const COLLISION = PAGESIZE*6;
const SPRITES = PAGESIZE*7;
const UI = PAGESIZE*8;

S=Math.sin;
C=Math.cos;

function cos(x) { // x = 0 - 1
  return Math.cos(x*6.28318531);
};

function sin(x) {
  return Math.sin(-x*6.28318531);
}

// audioCtx = new AudioContext;
// audioMaster = audioCtx.createGain();
// audioMaster.connect(audioCtx.destination);

//relative drawing position and pencolor, for drawing functions that require it.

viewX = 0;
viewY = 0;
cursorX = 0;
cursorY = 0;
cursorColor = 22;
cursorColor2 = 0;

fontString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_!@#.'\"?/<()";

fontBitmap = "11111100011111110001100011111010001111101000111110111111000010000100000111111100100101000110001111101111110000111001000011111111111000"+
"0111001000010000111111000010111100011111110001100011111110001100011111100100001000010011111111110001000010100101111010001100101110010010100011000"+
"0100001000010000111111000111011101011000110001100011100110101100111000101110100011000110001011101111010001100101110010000011101000110001100100111"+
"1111101000111110100011000101111100000111000001111101111100100001000010000100100011000110001100010111010001100011000101010001001000110001101011010"+
"1011101000101010001000101010001100010101000100001000010011111000100010001000111110010001100001000010001110011101000100010001001111111110000010011"+
"0000011111010010100101111100010000101111110000111100000111110011111000011110100010111011111000010001000100001000111010001011101000101110011101000"+
"1011110000101110011101000110001100010111000000000000000000000111110010000100001000000000100111111000110111101011011101010111110101011111010100000"+
"000000000000000000100001100001000100000000000011011010011001000000000000111010001001100000000100000010001000100010001000000010001000100000100000100001000100001000010000010"

 dither = [
        0b1111111111111111,
        0b1111111111110111,
        0b1111110111110111,
        0b1111110111110101,
        0b1111010111110101,
        0b1111010110110101,
        0b1110010110110101,
        0b1110010110100101,
        0b1010010110100101,
        0b1010010110100001,
        0b1010010010100001,
        0b1010010010100000,
        0b1010000010100000,
        0b1010000000100000,
        0b1000000000100000,
        0b1000000000000000,
        0b0000000000000000,
        ];

pat = 0b1111111111111111;

//default palette index
palDefault = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
                    32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];

var
c =               document.getElementById('canvas'),
ctx =             c.getContext('2d'),
renderTarget =    0x00000,
renderSource =    PAGESIZE, //buffer is ahead one screen's worth of pixels

//Adigun Azikiwe Polack's AAP64 Palette.
//ofcourse you can change this to whatever you like, up to 256 colors.
//one GOTCHA: colors are stored 0xAABBGGRR, so you'll have to flop the values from your typical hex colors.

colors =
[
0xff080606,
0xff131014,
0xff25173B,
0xff2D1773,
0xff2A20B4,
0xff233EDF,
0xff0A6AFA,
0xff1BA3F9,
0xff41D5FF,
0xff40FCFF,
0xff64F2D6,
0xff43DB9C,
0xff35C159,
0xff2EA014,
0xff3E7A1A,
0xff3B5224,

0xff202012,
0xff643414,
0xffC45C28,
0xffDE9F24,
0xffC7D620,
0xffDBFCA6,
0xffFFFFFF,
0xffC0F3FE,
0xffB8D6FA,
0xff97A0F5,
0xff736AE8,
0xff9B4ABC,
0xff803A79,
0xff533340,
0xff342224,
0xff1A1C22,

0xff282b32,
0xff3b4171,
0xff4775bb,
0xff63a4db,
0xff9cd2f4,
0xffeae0da,
0xffd1b9b3,
0xffaf938b,
0xff8d756d,
0xff62544a,
0xff413933,
0xff332442,
0xff38315b,
0xff52528e,
0xff6a75ba,
0xffa3b5e9,

0xffffe6e3,
0xfffbbfb9,
0xffe49b84,
0xffbe8d58,
0xff857d47,
0xff4e6723,
0xff648432,
0xff8daf5d,
0xffbadc92,
0xffe2f7cd,
0xffaad2e4,
0xff8bb0c7,
0xff6286a0,
0xff556779,
0xff444e5a,
0xff343942,]

//active palette index. maps to indices in colors[]. can alter this whenever for palette effects.
pal =            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
                  32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];


//paldrk =          [0,0,1,2,3,4,5,6,6,10,11,12,13,14,2,2,15,16,17,18,22,20,23,24,25,26,2,2,27,28,31,13]

ctx.imageSmoothingEnabled = false;
//ctx.mozImageSmoothingEnabled = false;

c.width = WIDTH;
c.height = HEIGHT;
var imageData =   ctx.getImageData(0, 0, WIDTH, HEIGHT),
buf =             new ArrayBuffer(imageData.data.length),
buf8 =            new Uint8Array(buf),
data =            new Uint32Array(buf),
ram =             new Uint8Array(WIDTH * HEIGHT * PAGES);

//--------------graphics functions----------------

  function clear(color = 0){
    ram.fill(color, renderTarget, renderTarget + PAGESIZE);
  }

  function pset(x=cursorX, y=cursorY, color=cursorColor, color2 = cursorColor2) { //an index from colors[], 0-63
    cursorColor2 = color2;
    cursorColor = color;
    x = x|0;
    y = y|0;
    let px = (y % 4) * 4 + (x% 4);
    let mask = pat & Math.pow(2, px);
    color = color|0;
    pcolor = mask ? color : color2;
    if(pcolor == 0)return;
    if(x < 0 | x > WIDTH-1) return;
    if(y < 0 | y > HEIGHT-1) return;

    ram[renderTarget + y * WIDTH + x] = mask ? color : color2;
  }

  function pget(x=cursorX, y=cursorY, page=renderTarget){
    return ram[page + x + y * WIDTH];
  }

  function moveTo(x,y){
    cursorX = x;
    cursorY = y;
  }

  function lineTo(x,y, color=cursorColor, color2 = cursorColor2){
    cursorColor2 = color2;
    cursorColor = color;
    line(cursorX, cursorY, x, y, color, color2);
    cursorX = x;
    cursorY = y;
  }

  function bezier(x0, y0, x1, y1, x2, y2, color=cursorColor, color2 = cursorColor2){
    cursorColor2 = color2;
    cursorColor = color;
    var sx = x2-x1, sy = y2-y1;
    var xx = x0-x1, yy = y0-y1, xy;         /* relative values for checks */
    var dx, dy, err, cur = xx*sy-yy*sx;                    /* curvature */

    //console.assert(xx*sx <= 0 && yy*sy <= 0, 'sign changed!');  /* sign of gradient must not change */

    if (sx*sx+sy*sy > xx*xx+yy*yy) { /* begin with longer part */
      x2 = x0; x0 = sx+x1; y2 = y0; y0 = sy+y1; cur = -cur;  /* swap P0 P2 */
    }
    if (cur != 0) {                                    /* no straight line */
      xx += sx; xx *= sx = x0 < x2 ? 1 : -1;           /* x step direction */
      yy += sy; yy *= sy = y0 < y2 ? 1 : -1;           /* y step direction */
      xy = 2*xx*yy; xx *= xx; yy *= yy;          /* differences 2nd degree */
      if (cur*sx*sy < 0) {                           /* negated curvature? */
        xx = -xx; yy = -yy; xy = -xy; cur = -cur;
      }
      dx = 4.0*sy*cur*(x1-x0)+xx-xy;             /* differences 1st degree */
      dy = 4.0*sx*cur*(y0-y1)+yy-xy;
      xx += xx; yy += yy; err = dx+dy+xy;                /* error 1st step */
      do {
        pset(x0,y0, color);                                     /* plot curve */
        if (x0 == x2 && y0 == y2) return;  /* last pixel -> curve finished */
        y1 = 2*err < dx;                  /* save value for test of y step */
        if (2*err > dy) { x0 += sx; dx -= xy; err += dy += yy; } /* x step */
        if (    y1    ) { y0 += sy; dy -= xy; err += dx += xx; } /* y step */
      } while (dy < dx );           /* gradient negates -> algorithm fails */
    }
    line(x0,y0, x2,y2, color);                  /* plot remaining part to end */
  }


  function line(x1, y1, x2, y2, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;

    x1 = x1|0;
    x2 = x2|0;
    y1 = y1|0;
    y2 = y2|0;

    var dy = (y2 - y1);
    var dx = (x2 - x1);
    var stepx, stepy;

    if (dy < 0) {
      dy = -dy;
      stepy = -1;
    } else {
      stepy = 1;
    }
    if (dx < 0) {
      dx = -dx;
      stepx = -1;
    } else {
      stepx = 1;
    }
    dy <<= 1;        // dy is now 2*dy
    dx <<= 1;        // dx is now 2*dx

    pset(x1, y1, color);
    if (dx > dy) {
      var fraction = dy - (dx >> 1);  // same as 2*dy - dx
      while (x1 != x2) {
        if (fraction >= 0) {
          y1 += stepy;
          fraction -= dx;          // same as fraction -= 2*dx
        }
        x1 += stepx;
        fraction += dy;              // same as fraction -= 2*dy
        pset(x1, y1, color);
      }
      ;
    } else {
      fraction = dx - (dy >> 1);
      while (y1 != y2) {
        if (fraction >= 0) {
          x1 += stepx;
          fraction -= dy;
        }
        y1 += stepy;
        fraction += dx;
        pset(x1, y1, color);
      }
    }

  }

  function circle(xm=cursorX, ym=cursorY, r=5, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    xm = xm|0;
    ym = ym|0;
    r = r|0;
    color = color|0;
    var x = -r, y = 0, err = 2 - 2 * r;
    /* II. Quadrant */
    do {
      pset(xm - x, ym + y, color);
      /*   I. Quadrant */
      pset(xm - y, ym - x, color);
      /*  II. Quadrant */
      pset(xm + x, ym - y, color);
      /* III. Quadrant */
      pset(xm + y, ym + x, color);
      /*  IV. Quadrant */
      r = err;
      if (r <= y) err += ++y * 2 + 1;
      /* e_xy+e_y < 0 */
      if (r > x || err > y) err += ++x * 2 + 1;
      /* e_xy+e_x > 0 or no 2nd y-step */

    } while (x < 0);
  }

  function fillCircle(xm, ym, r=5, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    xm = xm|0;
    ym = ym|0;
    r = r|0;
    color = color|0;

    if(r < 0) return;
    xm = xm|0; ym = ym|0, r = r|0; color = color|0;
    var x = -r, y = 0, err = 2 - 2 * r;
    /* II. Quadrant */
    do {
      line(xm-x, ym-y, xm+x, ym-y, color);
      line(xm-x, ym+y, xm+x, ym+y, color);
      r = err;
      if (r <= y) err += ++y * 2 + 1;
      if (r > x || err > y) err += ++x * 2 + 1;
    } while (x < 0);
  }

  function ellipse(x0=cursorX, y0=cursorY, width, height, color=cursorColor, color2 = cursorColor2){
    cursorColor2 = color2;
    cursorColor = color;
    x0 = x0|0;
    let x1 = x0+width|0;
    y0 = y0|0;
    let y1 = y0+height|0;
     let a = Math.abs(x1-x0), b = Math.abs(y1-y0), b1 = b&1; /* values of diameter */
     let dx = 4*(1-a)*b*b, dy = 4*(b1+1)*a*a; /* error increment */
     let err = dx+dy+b1*a*a, e2; /* error of 1.step */

     if (x0 > x1) { x0 = x1; x1 += a; } /* if called with swapped points */
     if (y0 > y1) y0 = y1; /* .. exchange them */
     y0 += (b+1)/2; y1 = y0-b1;   /* starting pixel */
     a *= 8*a; b1 = 8*b*b;

     do {
         pset(x1, y0, color); /*   I. Quadrant */
         pset(x0, y0, color); /*  II. Quadrant */
         pset(x0, y1, color); /* III. Quadrant */
         pset(x1, y1, color); /*  IV. Quadrant */
         e2 = 2*err;
         if (e2 <= dy) { y0++; y1--; err += dy += a; }  /* y step */
         if (e2 >= dx || 2*err > dy) { x0++; x1--; err += dx += b1; } /* x step */
     } while (x0 <= x1);

     while (y0-y1 < b) {  /* too early stop of flat ellipses a=1 */
         pset(x0-1, y0, color); /* -> finish tip of ellipse */
         pset(x1+1, y0++, color);
         pset(x0-1, y1, color);
         pset(x1+1, y1--, color);
     }
  }


  function rect(x, y, x2=16, y2=16, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    x1 = x|0;
    y1 = y|0;
    x2 = x2|0;
    y2 = y2|0;


    line(x1,y1, x2, y1, color);
    line(x2, y1, x2, y2, color);
    line(x1, y2, x2, y2, color);
    line(x1, y1, x1, y2, color);
  }

  function fillRect(x, y, x2=16, y2=16, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    x1 = x|0;
    y1 = y|0;
    x2 = x2|0;
    y2 = y2|0;
    color = color|0;

    var i = Math.abs(y2 - y1);
    line(x1, y1, x2, y1, color);

    if(i > 0){
      while (--i) {
        line(x1, y1+i, x2, y1+i, color);
      }
    }

    line(x1,y2, x2, y2, color);
  }

  function cRect(x,y,w,h,c,color=cursorColor, color2 = cursorColor2){
    x = x|0;
    y = y|0;
    w = w|0;
    h = h|0;
    c = c|0;
    color = color|0;
    for(let i = 0; i <= c; i++){
      fillRect(x+i,y-i,w-i*2,h+i*2,color);
    }
  }

  function outline(renderSource, renderTarget, color=cursorColor, color2=cursorColor2, color3=color, color4=color){
    cursorColor2 = color2;
    cursorColor = color;
    for(let i = 0; i <= WIDTH; i++ ){
      for(let j = 0; j <= HEIGHT; j++){
        let left = i-1 + j * WIDTH;
        let right = i+1 + j * WIDTH;
        let bottom = i + (j+1) * WIDTH;
        let top = i + (j-1) * WIDTH;
        let current = i + j * WIDTH;

        if(ram[renderSource + current]){
          if(!ram[renderSource + left]){
            ram[renderTarget + left] = color;
          };
          if(!ram[renderSource + right]){
            ram[renderTarget + right] = color3;
          };
          if(!ram[renderSource + top]){
            ram[renderTarget + top] = color2;
          };
          if(!ram[renderSource + bottom]){
            ram[renderTarget + bottom] = color4;
          };
        }
      }
    }
  }

  function triangle(x1, y1, x2, y2, x3, y3, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    line(x1,y1, x2,y2, color);
    line(x2,y2, x3,y3, color);
    line(x3,y3, x1,y1, color);
  }

  function fillTriangle( x1, y1, x2, y2, x3, y3, color=cursorColor , color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;
    //I don't pretend to know how this works exactly; I know it uses barycentric coordinates.
    //Might replace with simpler line-sweep; haven't perf tested yet.
    var canvasWidth = WIDTH;
    // http://devmaster.net/forums/topic/1145-advanced-rasterization/
    // 28.4 fixed-point coordinates
    var x1 = Math.round( 16 * x1 );
    var x2 = Math.round( 16 * x2 );
    var x3 = Math.round( 16 * x3 );
    var y1 = Math.round( 16 * y1 );
    var y2 = Math.round( 16 * y2 );
    var y3 = Math.round( 16 * y3 );
    // Deltas
    var dx12 = x1 - x2, dy12 = y2 - y1;
    var dx23 = x2 - x3, dy23 = y3 - y2;
    var dx31 = x3 - x1, dy31 = y1 - y3;
    // Bounding rectangle
    var minx = Math.max( ( Math.min( x1, x2, x3 ) + 0xf ) >> 4, 0 );
    var maxx = Math.min( ( Math.max( x1, x2, x3 ) + 0xf ) >> 4, WIDTH );
    var miny = Math.max( ( Math.min( y1, y2, y3 ) + 0xf ) >> 4, 0 );
    var maxy = Math.min( ( Math.max( y1, y2, y3 ) + 0xf ) >> 4, HEIGHT );
    // Block size, standard 8x8 (must be power of two)
    var q = 8;
    // Start in corner of 8x8 block
    minx &= ~(q - 1);
    miny &= ~(q - 1);
    // Constant part of half-edge functions
    var c1 = -dy12 * x1 - dx12 * y1;
    var c2 = -dy23 * x2 - dx23 * y2;
    var c3 = -dy31 * x3 - dx31 * y3;
    // Correct for fill convention
    if ( dy12 > 0 || ( dy12 == 0 && dx12 > 0 ) ) c1 ++;
    if ( dy23 > 0 || ( dy23 == 0 && dx23 > 0 ) ) c2 ++;
    if ( dy31 > 0 || ( dy31 == 0 && dx31 > 0 ) ) c3 ++;

    c1 = (c1 - 1) >> 4;
    c2 = (c2 - 1) >> 4;
    c3 = (c3 - 1) >> 4;
    // Set up min/max corners
    var qm1 = q - 1; // for convenience
    var nmin1 = 0, nmax1 = 0;
    var nmin2 = 0, nmax2 = 0;
    var nmin3 = 0, nmax3 = 0;
    if (dx12 >= 0) nmax1 -= qm1*dx12; else nmin1 -= qm1*dx12;
    if (dy12 >= 0) nmax1 -= qm1*dy12; else nmin1 -= qm1*dy12;
    if (dx23 >= 0) nmax2 -= qm1*dx23; else nmin2 -= qm1*dx23;
    if (dy23 >= 0) nmax2 -= qm1*dy23; else nmin2 -= qm1*dy23;
    if (dx31 >= 0) nmax3 -= qm1*dx31; else nmin3 -= qm1*dx31;
    if (dy31 >= 0) nmax3 -= qm1*dy31; else nmin3 -= qm1*dy31;
    // Loop through blocks
    var linestep = (canvasWidth-q);
    for ( var y0 = miny; y0 < maxy; y0 += q ) {
      for ( var x0 = minx; x0 < maxx; x0 += q ) {
        // Edge functions at top-left corner
        var cy1 = c1 + dx12 * y0 + dy12 * x0;
        var cy2 = c2 + dx23 * y0 + dy23 * x0;
        var cy3 = c3 + dx31 * y0 + dy31 * x0;
        // Skip block when at least one edge completely out
        if (cy1 < nmax1 || cy2 < nmax2 || cy3 < nmax3) continue;
        // Offset at top-left corner
        var offset = (x0 + y0 * canvasWidth);
        // Accept whole block when fully covered
        if (cy1 >= nmin1 && cy2 >= nmin2 && cy3 >= nmin3) {
          for ( var iy = 0; iy < q; iy ++ ) {
            for ( var ix = 0; ix < q; ix ++, offset ++ ) {
              ram[renderTarget + offset] = color;
            }
            offset += linestep;
          }
        } else { // Partially covered block
          for ( var iy = 0; iy < q; iy ++ ) {
            var cx1 = cy1;
            var cx2 = cy2;
            var cx3 = cy3;
            for ( var ix = 0; ix < q; ix ++ ) {
              if ( (cx1 | cx2 | cx3) >= 0 ) {
                ram[renderTarget + offset] = color;
              }
              cx1 += dy12;
              cx2 += dy23;
              cx3 += dy31;
              offset ++;
            }
            cy1 += dx12;
            cy2 += dx23;
            cy3 += dx31;
            offset += linestep;
          }
        }
      }
    }
  }

  function spr(sx = 0, sy = 0, sw = WIDTH, sh = HEIGHT, x=0, y=0, flipx = false, flipy = false, palette=pal){

    sx = sx|0
    sy = sy|0
    sw = sw|0
    sh = sh|0
    x = x|0
    y = y|0

    for(var i = 0; i < sh; i++){

      for(var j = 0; j < sw; j++){

        if(y+i < HEIGHT && x+j < WIDTH && y+i > -1 && x+j > -1){
          if(flipx & flipy){

            if(ram[(renderSource + ( ( sy + (sh-i) )*WIDTH+sx+(sw-j)))] > 0) {

              ram[ (renderTarget + ((y+i)*WIDTH+x+j)) ] = palette[ ram[(renderSource + ((sy+(sh-i-1))*WIDTH+sx+(sw-j-1)))] ];

            }

          }
          else if(flipy && !flipx){

            if(ram[(renderSource + ( ( sy + (sh-i) )*WIDTH+sx+j))] > 0) {

              ram[ (renderTarget + ((y+i)*WIDTH+x+j)) ] = palette[ ram[(renderSource + ((sy+(sh-i-1))*WIDTH+sx+j))] ];

            }

          }
          else if(flipx && !flipy){

            if(ram[(renderSource + ((sy+i)*WIDTH+sx+(sw-j-1)))] > 0) {

              ram[ (renderTarget + ((y+i)*WIDTH+x+j)) ] = palette[ ram[(renderSource + ((sy+i)*WIDTH+sx+(sw-j-1)))] ];

            }

          }
          else if(!flipx && !flipy){

            if(ram[(renderSource + ((sy+i)*WIDTH+sx+j))] > 0) {

              ram[ (renderTarget + ((y+i)*WIDTH+x+j)) ] = palette [ ram[(renderSource + ((sy+i)*WIDTH+sx+j))] ] ;

            }

          }
        }
      }
    }
  }

  function sspr(sx = 0, sy = 0, sw = 16, sh = 16, x=0, y=0, dw=16, dh=16, palette=pal){

    sx = sx|0
    sy = sy|0
    sw = sw|0
    sh = sh|0
    x = x|0
    y = y|0
    dw = dw|0
    dh = dh|0

    var xratio = sw / dw;
    var yratio = sh / dh;

    for(var i = 0; i < dh; i++){
      for(var j = 0; j < dw; j++){

        px = (j*xratio)|0;
        py = (i*yratio)|0;

        if(y+i < HEIGHT && x+j < WIDTH && y+i > -1 && x+j > -1) {
          if (ram[(renderSource + ((sy + py) * WIDTH + sx + px))] > 0) {
            ram[(renderTarget + ((y + i) * WIDTH + x + j))] = palette[ ram[(renderSource + ((sy + py) * WIDTH + sx + px))] ]
          }
        }

      }
    }


  }

  function rspr( sx, sy, sw, sh, destCenterX, destCenterY, scale, angle, palette=pal ){

    //angle = angle * 0.0174533 //convert to radians in place
    let sourceCenterX = (sw / 2)|0;
    let sourceCenterY = (sh / 2)|0;

   let destWidth = sw * scale;
    let destHeight = sh * scale;

   let halfWidth = (destWidth / 2 * 1.41421356237)|0 + 5;  //area will always be square, hypotenuse trick
    let halfHeight = (destHeight / 2 * 1.41421356237)|0 + 5;

   let startX = -halfWidth;
    let endX = halfWidth;

   let startY = -halfHeight;
    let endY = halfHeight;

   let scaleFactor = 1.0 / scale;

   let cos = Math.cos(-angle) * scaleFactor;
   let sin = Math.sin(-angle) * scaleFactor;

   for(let y = startY; y < endY; y++){
      for(let x = startX; x < endX; x++){

       let u = sourceCenterX + Math.round(cos * x + sin * y);
        let v = sourceCenterY + Math.round(-sin * x + cos * y);

       let drawX = (x + destCenterX)|0;
        let drawY = (y + destCenterY)|0;

       //screen check. otherwise drawn pix will wrap to next line due to 1D nature of buffer array
       if(drawX > 0 && drawX < WIDTH && drawY > 0 && drawY < HEIGHT){

          if(u >= 0 && v >= 0 && u < sw && v < sh){
          if( ram[renderSource + (u+sx) + (v+sy) * WIDTH] > 0) {
            ram[renderTarget + drawX + drawY * WIDTH] = palette[ ram[renderSource + (u+sx) + (v+sy) * WIDTH] ]
          }

        }

       }


     } //end x loop

   } //end outer y loop
  }

  function checker(x, y, w, h, nRow, nCol, color=cursorColor, color2 = cursorColor2) {
    cursorColor2 = color2;
    cursorColor = color;

    nRow = nRow || 8;    // default number of rows
    nCol = nCol || 8;    // default number of columns

    w /= nCol;            // width of a block
    h /= nRow;            // height of a block

    for (var i = 0; i < nRow; ++i) {
      for (var j = 0, col = nCol / 2; j < col; ++j) {
        let bx = x + (2 * j * w + (i % 2 ? 0 : w) );
        let by = i * h;
        fillRect(bx, by, w-1, h-1, color);
      }
    }
  }

  function imageToRam(image, address) {

         //var image = E.smallcanvas.toDataURL("image/png");
          let tempCanvas = document.createElement('canvas');
         tempCanvas.width = WIDTH;
         tempCanvas.height = HEIGHT;
         let context = tempCanvas.getContext('2d');
         //draw image to canvas
         context.drawImage(image, 0, 0);

         //get image data
         var imageData = context.getImageData(0,0, WIDTH, HEIGHT);

         //set up 32bit view of buffer
         let data = new Uint32Array(imageData.data.buffer);

         //compare buffer to palette (loop)
         for(var i = 0; i < data.length; i++) {

             ram[address + i] = colors.indexOf(data[i]);
         }
  }

function render() {

  var i = PAGESIZE;  // display is first page of ram

  while (i--) {
    /*
    data is 32bit view of final screen buffer
    for each pixel on screen, we look up it's color and assign it
    */
    data[i] = colors[pal[ram[i]]];

  }

  imageData.data.set(buf8);

  ctx.putImageData(imageData, 0, 0);

}

//-----------txt.js----------------
//forked from Jack Rugile's text renderer in Radius Raid: https://github.com/jackrugile/radius-raid-js13k/blob/master/js/text.js

//o is an array of options with the following structure:
/*
0: text
1: x
2: y
3: hspacing
4: vspacing
5: halign
6: valign
7: scale
8: color
//options 9-11 are for animating the text per-character. just sin motion
9: per character offset
10: delay, higher is slower
11: frequency
*/
function textLine(o) {

 //o 9,10,11 are 6,7,8 here

 if(!o[7])o[7]=1
 if(!o[8])o[8]=1

 var textLength = o[0].length,
   size = 5;

 for (var i = 0; i < textLength; i++) {

   var letter = [];
   letter = getCharacter( o[0].charAt(i) );

   for (var y = 0; y < size; y++) {
     for (var x = 0; x < size; x++) {
       //if (letter[y][x] == 1) {
       if (letter[y*size+x] == 1){
         if(o[4] == 1){
           pset(
             o[1] + ( x * o[4] ) + ( ( size * o[4] ) + o[3] ) * i,
             ( o[2] + ( o[6] ? Math.sin((t+i*o[8])*1/o[7])*o[6] : 0 ) + (y * o[4]) )|0,
             o[5]
           );
         }

         else {
           let tx = o[1] + ( x * o[4] ) + ( ( size * o[4] ) + o[3] ) * i;
           let ty = ( o[2] + ( o[6] ? Math.sin((t+i*o[8])*1/o[7])*o[6] : 0 ) + (y * o[4]) )|0;
           fillRect(
           tx,
           ty,
           tx-1 + o[4],
           ty-1 + o[4],
           o[5]);
         }

       } //end draw routine
     }  //end x loop
   }  //end y loop
 }  //end text loop
}  //end textLine()

function text(o) {
 var size = 5,
 letterSize = size * o[7],
 lines = o[0].split('\n'),
 linesCopy = lines.slice(0),
 lineCount = lines.length,
 longestLine = linesCopy.sort(function (a, b) {
   return b.length - a.length;
 })[0],
 textWidth = ( longestLine.length * letterSize ) + ( ( longestLine.length - 1 ) * o[3] ),
 textHeight = ( lineCount * letterSize ) + ( ( lineCount - 1 ) * o[4] );

 if(!o[5])o[5] = 'left';
 if(!o[6])o[6] = 'bottom';

 var sx = o[1],
   sy = o[2],
   ex = o[1] + textWidth,
   ey = o[2] + textHeight;

 if (o[5] == 'center') {
   sx = o[1] - textWidth / 2;
   ex = o[1] + textWidth / 2;
 } else if (o[5] == 'right') {
   sx = o[1] - textWidth;
   ex = o[1];
 }

 if (o[6] == 'center') {
   sy = o[2] - textHeight / 2;
   ey = o[2] + textHeight / 2;
 } else if (o[6] == 'bottom') {
   sy = o[2] - textHeight;
   ey = o[2];
 }

 var cx = sx + textWidth / 2,
   cy = sy + textHeight / 2;

   for (var i = 0; i < lineCount; i++) {
     var line = lines[i],
       lineWidth = ( line.length * letterSize ) + ( ( line.length - 1 ) * o[3] ),
       x = o[1],
       y = o[2] + ( letterSize + o[4] ) * i;

     if (o[5] == 'center') {
       x = o[1] - lineWidth / 2;
     } else if (o[5] == 'right') {
       x = o[1] - lineWidth;
     }

     if (o[6] == 'center') {
       y = y - textHeight / 2;
     } else if (o[6] == 'bottom') {
       y = y - textHeight;
     }

     textLine([
       line,
       x,
       y,
       o[3] || 0,
       o[7] || 1,
       o[8],
       o[9],
       o[10],
       o[11]
     ]);
   }

 return {
   sx: sx,
   sy: sy,
   cx: cx,
   cy: cy,
   ex: ex,
   ey: ey,
   width: textWidth,
   height: textHeight
 }
}

function getCharacter(char){
 index = fontString.indexOf(char);
 return fontBitmap.substring(index * 25, index*25+25).split('') ;
}

//-----------END txt.js----------------




Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

Number.prototype.map = function(old_bottom, old_top, new_bottom, new_top) {
  return (this - old_bottom) / (old_top - old_bottom) * (new_top - new_bottom) + new_bottom;
};

Number.prototype.pad = function(size, char="0") {
  var s = String(this);
  while (s.length < (size || 2)) {s = char + s;}
  return s;
};
//---audio handling-----------------
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

function playSound(buffer, playbackRate = 1, pan = 0, volume = .5, loop = false) {

  var source = audioCtx.createBufferSource();
  var gainNode = audioCtx.createGain();
  var panNode = audioCtx.createStereoPanner();

  source.buffer = buffer;
  source.connect(panNode);
  panNode.connect(gainNode);
  gainNode.connect(audioMaster);

  source.playbackRate.value = playbackRate;
  source.loop = loop;
  gainNode.gain.value = volume;
  panNode.pan.value = pan;
  source.start();
  return {volume: gainNode, sound: source};
}

//--------keyboard input--------------
Key = {

    _pressed: {},
    _released: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    SEMICOLON: 59,
    a: 65,
    c: 67,
    w: 87,
    s: 83,
    d: 68,
    z: 90,
    x: 88,
    f: 70,
    p: 80,
    r: 82,
    i: 73,
    j: 74,
    k: 75,
    l: 76,

    isDown(keyCode) {
        return this._pressed[keyCode];
    },

    justReleased(keyCode) {
        return this._released[keyCode];
    },

    onKeydown(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup(event) {
        this._released[event.keyCode] = true;
        delete this._pressed[event.keyCode];

    },

    update() {
        this._released = {};
    }
};

function LCG(seed = Date.now(), a = 1664525, c = 1013904223, m = Math.pow(2,32) ){
  this.seed = seed;
  this.a= a;
  this.c = c;
  this.m = m;
}


  LCG.prototype.setSeed =  function(seed) {
    this.seed = seed;
  },

  LCG.prototype.nextInt = function() {
    // range [0, 2^32)
    this.seed = (this.seed * this.a + this.c) % this.m;
    return this.seed;
  },

  LCG.prototype.nextFloat = function() {
    // range [0, 1)
    return this.nextInt() / this.m;
  },

  LCG.prototype.nextBool = function(percent) {
    // percent is chance of getting true
    if(percent == null) {
      percent = 0.5;
    }
    return this.nextFloat() < percent;
  },

  LCG.prototype.nextFloatRange = function(min, max) {
    // range [min, max)
    return min + this.nextFloat() * (max - min);
  },

  LCG.prototype.nextIntRange = function(min, max) {
    // range [min, max)
    return Math.floor(this.nextFloatRange(min, max));
  },

  LCG.prototype.nextColor = function() {
    // range [#000000, #ffffff]
    var c = this.nextIntRange(0, Math.pow(2, 24)).toString(16).toUpperCase();
    while(c.length < 6) {
      c = "0" + c;
    }
    return "#" + c;
  }

function per_time(div_obj) {
  var isDivision = false;
  if((0 === Math.trunc(t) % Math.trunc(div_obj.division)) && (t >= div_obj.next_div))
  {
    div_obj.next_div = Math.trunc(t) + Math.trunc(div_obj.division);
    isDivision = true;
  } 
  return isDivision;
}

//--------END Engine.js-------------------

//---------SONANT-X---------
/*
// Sonant-X
//
// Copyright (c) 2014 Nicolas Vanhoren
//
// Sonant-X is a fork of js-sonant by Marcus Geelnard and Jake Taylor. It is
// still published using the same license (zlib license, see below).
//
// Copyright (c) 2011 Marcus Geelnard
// Copyright (c) 2008-2009 Jake Taylor
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
//
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
//
// 3. This notice may not be removed or altered from any source
//    distribution.
*/

var sonantx = {};

var WAVE_SPS = 44100;                    // Samples per second
var WAVE_CHAN = 2;                       // Channels
var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively

var audioCtx = null;

// Oscillators
function osc_sin(value){
    return Math.sin(value * 6.283184);
}

function osc_square(value){
    if(osc_sin(value) < 0) return -1;
    return 1;
}

function osc_saw(value){
    return (value % 1) - 0.5;
}

function osc_tri(value){
    var v2 = (value % 1) * 4;
    if(v2 < 2) return v2 - 1;
    return 3 - v2;
}

// Array of oscillator functions
var oscillators = [
    osc_sin,
    osc_square,
    osc_saw,
    osc_tri
];

function getnotefreq(n){
    return 0.00390625 * Math.pow(1.059463094, n - 128);
}

function genBuffer(waveSize, callBack) {
    setTimeout(function() {
        // Create the channel work buffer
        var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
        var b = buf.length - 2;
        var iterate = function() {
            var begin = new Date();
            var count = 0;
            while(b >= 0)
            {
                buf[b] = 0;
                buf[b + 1] = 128;
                b -= 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
                    setTimeout(iterate, 0);
                    return;
                }
            }
            setTimeout(function() {callBack(buf);}, 0);
        };
        setTimeout(iterate, 0);
    }, 0);
}

function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
    var p1 = (instr.fx_delay_time * rowLen) >> 1;
    var t1 = instr.fx_delay_amt / 255;

    var n1 = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while(n1 < waveSamples - p1)
        {
            var b1 = 4 * n1;
            var l = 4 * (n1 + p1);

            // Left channel = left + right[-p1] * t1
            var x1 = chnBuf[l] + (chnBuf[l+1] << 8) +
                (chnBuf[b1+2] + (chnBuf[b1+3] << 8) - 32768) * t1;
            chnBuf[l] = x1 & 255;
            chnBuf[l+1] = (x1 >> 8) & 255;

            // Right channel = right + left[-p1] * t1
            x1 = chnBuf[l+2] + (chnBuf[l+3] << 8) +
                (chnBuf[b1] + (chnBuf[b1+1] << 8) - 32768) * t1;
            chnBuf[l+2] = x1 & 255;
            chnBuf[l+3] = (x1 >> 8) & 255;
            ++n1;
            count += 1;
            if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(callBack, 0);
    };
    setTimeout(iterate, 0);
}

sonantx.AudioGenerator = function(mixBuf) {
    this.mixBuf = mixBuf;
    this.waveSize = mixBuf.length / WAVE_CHAN / 2;
};

sonantx.AudioGenerator.prototype.getAudioBuffer = function(callBack) {
    if (audioCtx === null)
        audioCtx = new AudioContext();
    var mixBuf = this.mixBuf;
    var waveSize = this.waveSize;

    var waveBytes = waveSize * WAVE_CHAN * 2;
    var buffer = audioCtx.createBuffer(WAVE_CHAN, this.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
    var lchan = buffer.getChannelData(0);
    var rchan = buffer.getChannelData(1);
    var b = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while (b < (waveBytes / 2)) {
            var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            lchan[b] = y / 32768;
            y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            rchan[b] = y / 32768;
            b += 1;
            count += 1;
            if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(function() {callBack(buffer);}, 0);
    };
    setTimeout(iterate, 0);
};

sonantx.SoundGenerator = function(instr, rowLen) {
    this.instr = instr;
    this.rowLen = rowLen || 5605;

    this.osc_lfo = oscillators[instr.lfo_waveform];
    this.osc1 = oscillators[instr.osc1_waveform];
    this.osc2 = oscillators[instr.osc2_waveform];
    this.attack = instr.env_attack;
    this.sustain = instr.env_sustain;
    this.release = instr.env_release;
    this.panFreq = Math.pow(2, instr.fx_pan_freq - 8) / this.rowLen;
    this.lfoFreq = Math.pow(2, instr.lfo_freq - 8) / this.rowLen;
};

sonantx.SoundGenerator.prototype.genSound = function(n, chnBuf, currentpos) {
    var marker = new Date();
    var c1 = 0;
    var c2 = 0;

    // Precalculate frequencues
    var o1t = getnotefreq(n + (this.instr.osc1_oct - 8) * 12 + this.instr.osc1_det) * (1 + 0.0008 * this.instr.osc1_detune);
    var o2t = getnotefreq(n + (this.instr.osc2_oct - 8) * 12 + this.instr.osc2_det) * (1 + 0.0008 * this.instr.osc2_detune);

    // State variable init
    var q = this.instr.fx_resonance / 255;
    var low = 0;
    var band = 0;
    for (var j = this.attack + this.sustain + this.release - 1; j >= 0; --j)
    {
        var k = j + currentpos;

        // LFO
        var lfor = this.osc_lfo(k * this.lfoFreq) * this.instr.lfo_amt / 512 + 0.5;

        // Envelope
        var e = 1;
        if(j < this.attack)
            e = j / this.attack;
        else if(j >= this.attack + this.sustain)
            e -= (j - this.attack - this.sustain) / this.release;

        // Oscillator 1
        var t = o1t;
        if(this.instr.lfo_osc1_freq) t += lfor;
        if(this.instr.osc1_xenv) t *= e * e;
        c1 += t;
        var rsample = this.osc1(c1) * this.instr.osc1_vol;

        // Oscillator 2
        t = o2t;
        if(this.instr.osc2_xenv) t *= e * e;
        c2 += t;
        rsample += this.osc2(c2) * this.instr.osc2_vol;

        // Noise oscillator
        if(this.instr.noise_fader) rsample += (2*Math.random()-1) * this.instr.noise_fader * e;

        rsample *= e / 255;

        // State variable filter
        var f = this.instr.fx_freq;
        if(this.instr.lfo_fx_freq) f *= lfor;
        f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
        low += f * band;
        var high = q * (rsample - band) - low;
        band += f * high;
        switch(this.instr.fx_filter)
        {
            case 1: // Hipass
                rsample = high;
                break;
            case 2: // Lopass
                rsample = low;
                break;
            case 3: // Bandpass
                rsample = band;
                break;
            case 4: // Notch
                rsample = low + high;
                break;
            default:
        }

        // Panning & master volume
        t = osc_sin(k * this.panFreq) * this.instr.fx_pan_amt / 512 + 0.5;
        rsample *= 39 * this.instr.env_master;

        // Add to 16-bit channel buffer
        k = k * 4;
        if (k + 3 < chnBuf.length) {
            var x = chnBuf[k] + (chnBuf[k+1] << 8) + rsample * (1 - t);
            chnBuf[k] = x & 255;
            chnBuf[k+1] = (x >> 8) & 255;
            x = chnBuf[k+2] + (chnBuf[k+3] << 8) + rsample * t;
            chnBuf[k+2] = x & 255;
            chnBuf[k+3] = (x >> 8) & 255;
        }
    }
};

sonantx.SoundGenerator.prototype.getAudioGenerator = function(n, callBack) {
    var bufferSize = (this.attack + this.sustain + this.release - 1) + (32 * this.rowLen);
    var self = this;
    genBuffer(bufferSize, function(buffer) {
        self.genSound(n, buffer, 0);
        applyDelay(buffer, bufferSize, self.instr, self.rowLen, function() {
            callBack(new sonantx.AudioGenerator(buffer));
        });
    });
};

// sonantx.SoundGenerator.prototype.createAudio = function(n, callBack) {
//     this.getAudioGenerator(n, function(ag) {
//         callBack(ag.getAudio());
//     });
// };

sonantx.SoundGenerator.prototype.createAudioBuffer = function(n, callBack) {
    this.getAudioGenerator(n, function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

sonantx.MusicGenerator = function(song) {
    this.song = song;
    // Wave data configuration
    this.waveSize = WAVE_SPS * song.songLen; // Total song size (in samples)
};
sonantx.MusicGenerator.prototype.generateTrack = function (instr, mixBuf, callBack) {
    var self = this;
    genBuffer(this.waveSize, function(chnBuf) {
        // Preload/precalc some properties/expressions (for improved performance)
        var waveSamples = self.waveSize,
            waveBytes = self.waveSize * WAVE_CHAN * 2,
            rowLen = self.song.rowLen,
            endPattern = self.song.endPattern,
            soundGen = new sonantx.SoundGenerator(instr, rowLen);

        var currentpos = 0;
        var p = 0;
        var row = 0;
        var recordSounds = function() {
            var beginning = new Date();
            while (true) {
                if (row === 32) {
                    row = 0;
                    p += 1;
                    continue;
                }
                if (p === endPattern - 1) {
                    setTimeout(delay, 0);
                    return;
                }
                var cp = instr.p[p];
                if (cp) {
                    var n = instr.c[cp - 1].n[row];
                    if (n) {
                        soundGen.genSound(n, chnBuf, currentpos);
                    }
                }
                currentpos += rowLen;
                row += 1;
                if (new Date() - beginning > MAX_TIME) {
                    setTimeout(recordSounds, 0);
                    return;
                }
            }
        };

        var delay = function() {
            applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
        };

        var b2 = 0;
        var finalize = function() {
            var beginning = new Date();
            var count = 0;
            // Add to mix buffer
            while(b2 < waveBytes)
            {
                var x2 = mixBuf[b2] + (mixBuf[b2+1] << 8) + chnBuf[b2] + (chnBuf[b2+1] << 8) - 32768;
                mixBuf[b2] = x2 & 255;
                mixBuf[b2+1] = (x2 >> 8) & 255;
                b2 += 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                    setTimeout(finalize, 0);
                    return;
                }
            }
            setTimeout(callBack, 0);
        };
        setTimeout(recordSounds, 0);
    });
};
sonantx.MusicGenerator.prototype.getAudioGenerator = function(callBack) {
    var self = this;
    genBuffer(this.waveSize, function(mixBuf) {
        var t = 0;
        var recu = function() {
            if (t < self.song.songData.length) {
                t += 1;
                self.generateTrack(self.song.songData[t - 1], mixBuf, recu);
            } else {
                callBack(new sonantx.AudioGenerator(mixBuf));
            }
        };
        recu();
    });
};

sonantx.MusicGenerator.prototype.createAudioBuffer = function(callBack) {
    this.getAudioGenerator(function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

//---------END SONANT-X-----

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

  coinvalue = 1,
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
    y: HEIGHT-60,
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
    statusColor: 4,
    height: 16,
    coins: 0
  },

  {
    x: (WIDTH/4)*3,
    xMin: WIDTH/2,
    xMax: WIDTH - 17,
    y: HEIGHT-60,
    xvel: 0,
    yvel: 0,
    xSpeed: 300,
    ySpeed: 600,
    drag: .8,
    gravity: 25,
    maxYvel: 250,
    maxXvel: 180,
    minYvel: -700,
    minXvel: -180,
    facingLeft: false,
    jumping: false,
    jumpCooldown: 0,
    score: 0,
    jumpPressed: false,
    status: "TIE",
    statusColor: 4,
    height: 16,
    coins: 0
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

  platformColors = [7,13,27]
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
    x: px, y: py, height: 10, width: 10, x2: px + 10, y2: py + 10 
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

//--------gameoverstate.js-----------

states.gameover = {

    step: function(dt) {

        if(Key.isDown(Key.r)){
          init();
          
        }

    },

    render: function(dt) {

      renderTarget = 0x0;
      // clear(0);
      cursorColor2 = 5;
      text([
        'GAME OVER',
        WIDTH/2,
        80,
        8,
        15,
        'center',
        'top',
        4,
        27,
      ]);

      text([
        players[0].status,
        WIDTH/4,
        180,
        8,
        15,
        'center',
        'top',
        2,
        players[0].statusColor,
      ]);
      text([
        players[1].status,
        WIDTH/2 + WIDTH/4,
        180,
        8,
        15,
        'center',
        'top',
        2,
        players[1].statusColor,
      ]);

    },

};

//---------END gameoverstate.js----------

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

states.proto = {

    step: function(dt) {
        //game update
        platforms.forEach( function(p, index, arr){
        });
        this.updatePlayer()
        if(gameStartTime){
            let timeSinceGameStart = Math.floor((t-gameStartTime)/100);
            gameClock = (gameDuration - timeSinceGameStart).pad(2);
            if(gameClock < 10){
                gameClockColor = gameClock%2==1?9:4
            }
            if(gameClock === "00"){
            }
        }

        this.updateFill();      
    },

    render: function(dt) {
        
        viewY = players[0].y - HEIGHT/2;
        this.drawThings(0);
        this.drawPlayer(0);
        text([players[0].score.pad(3), 0, 0, 3, 2,  'left', 'top', 3, 9]);

        viewY = players[1].y - HEIGHT/2;
        this.drawThings(1);
        this.drawPlayer(1);
        text([players[1].score.pad(3), WIDTH, 0, 3, 2,  'right', 'top', 3, 9]);

        text([gameClock, WIDTH/2, 0, 3, 2,  'center', 'top', 3, gameClockColor]);
        if(gameClock === "00"){
            state = 'gameover'
        }
    },

    drawThings: function(side) {

        renderTarget = COLLISION; 
        clear(0);
        renderTarget = BUFFER;
        clear(30);
        cursorColor2 = 0;
        backgroundOrbs.forEach(function(orb){
            if(orb.y - viewY < HEIGHT + 100 && orb.y - viewY > 0 - 100){
                renderTarget = BUFFER;
                pat = dither[orb.dither ]; //a dither between half and almost invisible
                fillCircle(orb.x, orb.y-viewY, orb.r, orb.color);
            }
        })
        pat = dither[8];
        fillRect(0, 0, WIDTH, fill_y, platformColors[fillColor], 0);
        pat = dither[8];
        fillRect(0, fill_y, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[4];
        fillRect(0, fill_y+5, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[2];
        fillRect(0, fill_y+9, WIDTH, fill_y+10, platformColors[prevFillColor], 0);
        pat = dither[8];
        for(let i = 0; i < 100; i++){
            let x = Math.random()*WIDTH;
            pset(x, fill_y+10, 22,22);
            circle(x, fill_y+10, Math.random()*3|0, platformColors[fillColor],22)
        }
        
        if(true === filling)
        {
            pat = dither[8];
            fillRect(0, fill_y + 1, WIDTH, HEIGHT, platformColors[prevFillColor], 0);
        }   

        platforms.forEach( function(p){
            if(p.canCollide[side]){
                if(p.y - viewY < HEIGHT && p.y - viewY > 0){
                    renderTarget = BUFFER;
                    pat = dither[0];
                    fillRect(p.x, p.y-viewY, p.x2, p.y2-viewY, p.color, p.color-1); 
                }   
            }   
        });

        pickups.forEach( function(p){
            if(p.y - viewY < HEIGHT && p.y - viewY > 0){
                renderTarget = BUFFER;
                renderSource = SPRITES;
                let s = sprites.pickup;
                spr(s.x+s.width * ( ( (t%40)/10 )|0 ), s.y, s.width, s.height, p.x, p.y-viewY );
                //console.log( ( (t%40) / 4)|0 )
                //fillRect(p.x, p.y-viewY, p.x+p.width, p.y+p.height-viewY, 22); 
            }   
        });
        

        renderTarget = SCREEN;
        let startDrawX = side== 0 ? 0 : WIDTH/2;
        let endDrawX = side== 0 ? WIDTH/2 : WIDTH;
        pat = dither[0]; //solid fill.

        //screen clear for HALF the screen
        fillRect(startDrawX, HEIGHT, endDrawX,  HEIGHT, 30)
        renderSource = BUFFER; 
        spr(0,0,WIDTH/2,HEIGHT, side==0 ? 0 : WIDTH/2, 0)

        line(WIDTH/2,0,WIDTH/2,HEIGHT,22,22);

    },

    updatePlayer: function() {
        var p0 = players[0];
        var p1 = players[1];

        p0.score = Math.abs(Math.floor(p0.y/platformInterval) - 2) + (p0.coins * coinvalue);
        p1.score = Math.abs(Math.floor(p1.y/platformInterval) - 2) + (p1.coins * coinvalue);

        //Determine who's winning
        if(p0.score > p1.score){
            p0.status = "WINNER";
            p0.statusColor = 13;
            p1.status = "LOSER";
            p1.statusColor = 4;
        }else if(p0.score < p1.score){
            p0.status = "LOSER";
            p0.statusColor = 4;
            p1.status = "WINNER";
            p1.statusColor = 13;
        } else {
            p0.status = "TIE";
            p0.statusColor = 4;
            p1.status = "TIE";
            p1.statusColor = 4;
        }

        
        // player 0---------------------------
        this.init_player(0);
        this.init_player(1); 

        let dx0 = 1/60 * p0.xvel;
        let dy0 = 1/60 * p0.yvel;

        let dx1 = 1/60 * p1.xvel;
        let dy1 = 1/60 * p1.yvel;

        p0.x = (p0.x + dx0).clamp(p0.xMin, p0.xMax);
        p0.y += dy0;

        p1.x = (p1.x + dx1).clamp(p1.xMin, p1.xMax);
        p1.y += dy1;

        
        this.collision_detect(0);
        this.collision_detect(1);
        //collision y resolution here

        // input
        if (Key.isDown(Key.d)) {
            this.move_right(0);
        }
        if (Key.isDown(Key.a)){
            this.move_left(0);
        }
        if(Key.isDown(Key.w)){
            this.jump(0);
        }
        else
        {
            p0.jumpPressed = false;
        } 

        if (Key.isDown(Key.l)) {
            this.move_right(1);
        }
        if (Key.isDown(Key.j)){
            this.move_left(1);
        }
        if(Key.isDown(Key.i)){
            this.jump(1);
        }
        else
        {
            p1.jumpPressed = false;
        } 

        //----- gamepad input handling
        
        if(gp0){
            let deadzone = .4
            if(Math.abs(gp0.axes[0]) > deadzone){
                if(gp0.axes[0] < -deadzone)
                {
                    this.move_left(0);
                }
                if(gp0.axes[0] > deadzone)
                {
                    this.move_right(0);
                }
            }
            if(gp0.buttons[11].pressed){
                this.jump(0);
            } 
            else
            {
                p0.jumpPressed = false;
            } 
            if (gp0.buttons[3].pressed) {
                this.move_right(0);
            }
            if (gp0.buttons[2].pressed){
                this.move_left(0);
            }
        }

        if(gp1){
            let deadzone = .4
            if(Math.abs(gp1.axes[0]) > deadzone){
                if(gp1.axes[0] < -deadzone)
                {
                    this.move_left(1);
                }
                if(gp1.axes[0] > deadzone)
                {
                    this.move_right(1);
                }
            }
            if(gp1.buttons[11].pressed){
                this.jump(1);
            } 
            else
            {
                p1.jumpPressed = false;
            }
            if (gp1.buttons[3].pressed) {
                this.move_right(1);
            }
            if (gp1.buttons[2].pressed){
                this.move_left(1);
            } 
        }
    },

    drawPlayer: function(player) {
        let p = players[player];
        renderTarget = SCREEN;
        //fillRect(p.x, p.y-viewY, p.x+16, p.y+16-viewY, 12,12);
        renderSource = SPRITES;
        let s = player == 0 ? sprites.player0 : sprites.player1
        spr(s.x,s.y,s.width,s.height,p.x,p.y-viewY, !p.facingLeft)
    },

    collision_detect: function(player){        
        let p = players[player];
        
        pickups.forEach(function(c, i, a){
            var xVal = (p.x < (WIDTH/2)) ? p.x : p.x - (WIDTH/2);
            let x1check = (xVal <= c.x2 && xVal >= c.x);
            let x2check = (xVal + p.width <= c.x2 && xVal + p.width >= c.x);
            let y1check = (p.y <= c.y2 && p.y >= c.y);
            let y2check = (p.y + p.height <= c.y2 && p.y + p.height >= c.y);

            if ((x1check || x2check) && (y1check || y2check))
            {
                p.coins++;
                a.splice(i, 1);
            }
        });


        if(p.yvel > 0){
            var xVal = (p.x < (WIDTH/2)) ? p.x : p.x - (WIDTH/2);
            platforms.some(function(e){
                if(e.canCollide[player] && (p.oldY + 17 <= e.y && p.y + 17 >= e.y && xVal + 16 > e.x && xVal < e.x2))
                {
                    if(p.yvel > p.gravity)
                    {
                    	playSound(sounds.land, 1, 0, .10, false);
                    }
                    p.yvel = 0;
                    p.y = e.y - 17;
                    p.jumping = false;
                    return true;
                }
            });
        }
    },

    move_right: function(player){
        let p = players[player];
        p.facingLeft = false;
        p.xvel =  p.xSpeed;
        var xVal = (p.x === players[0].x) ? p.x : p.x - (WIDTH/2);
        if (xVal > (WIDTH / 2) - 16)
        {
            p.xvel = 0;
        }
        p.x = p.x.clamp(p.xMin, p.xMax);
    },

    move_left: function(player){
        let p = players[player];
        p.facingLeft = true;
        p.xvel =  - p.xSpeed;
        var xVal = (p.x === players[0].x) ? p.x : p.x - (WIDTH / 2);
        if (xVal < 0)
        {
            p.xvel = 0;
        }    
        p.x = p.x.clamp(p.xMin, p.xMax);
    },

    jump: function(player){
        let p = players[player];

        if (!p.jumpPressed) {
            // if(!p0.jumping){ // this gives you one free jump after falling off a platform
            if(0 === p.yvel && !p.jumping){
                p.jumping = true;
                p.yvel = -p.ySpeed;
                playSound(sounds.jump, 1, 0, .10, false);
            }
        }

        p.jumpPressed = true;
    },

    init_player: function(player){
        let p = players[player];

        p.oldX = p.x;
        p.oldY = p.y;
        p.xvel *= p.drag;  
        p.yvel += p.gravity;
        p.yvel = p.yvel.clamp(p.minYvel, p.maxYvel);
        p.xvel = p.xvel.clamp(p.minXvel, p.maxXvel);        
    },

    updateFill: function(){

        if(per_time(five_div))
        {
            time_left = duration;
            filling = true;
            prevFillColor = fillColor;
            ++fillColor;
            if(3 == fillColor)
            {
                fillColor = 0;
            }
        }
    
        if(true === filling)
        {
          fill_y = (duration - time_left) * HEIGHT / duration;
          --time_left;
          if(0 >= time_left)
          {
            filling = false;
            fill_y = HEIGHT;
          }
        }
        else if(duration != next_duration)
        {
          duration = next_duration;
        }

        players.forEach(function(p, i){
            platforms.forEach(function(e){
                if(((e.y2 - p.y + HEIGHT/2) <= fill_y && e.color === platformColors[fillColor])
                || ((e.y - p.y + HEIGHT/2) > fill_y && e.color === platformColors[prevFillColor])) {
                    e.canCollide[i] = false;
                }
                else{
                    e.canCollide[i] = true;
                }
            })
        });
    }
};

states.loading = {

    init: function(dt){
      
       
        
    },

    step: function(dt) {
      if(soundsReady && Key.isDown(Key.SPACE)){
        playSound(sounds.song, 1, 0, .15, true);
        state = 'proto'
        gameStartTime = t;
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

window.onload = init()}())

var Stats=function(){function h(a){return c.appendChild(a.dom),a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",c.addEventListener("click",function(a){a.preventDefault(),k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));return k(0),{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();if(f.update(c-g,200),c>e+1e3&&(r.update(1e3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};Stats.Panel=function(h,k,l){var c=1/0,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r,q.height=f,q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");return b.font="bold "+9*a+"px Helvetica,Arial,sans-serif",b.textBaseline="top",b.fillStyle=l,b.fillRect(0,0,r,f),b.fillStyle=k,b.fillText(h,t,u),b.fillRect(d,m,n,p),b.fillStyle=l,b.globalAlpha=.9,b.fillRect(d,m,n,p),{dom:q,update:function(f,v){c=Math.min(c,f),g=Math.max(g,f),b.fillStyle=l,b.globalAlpha=1,b.fillRect(0,0,r,m),b.fillStyle=k,b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u),b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p),b.fillRect(d+n-a,m,a,p),b.fillStyle=l,b.globalAlpha=.9,b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}},"object"==typeof module&&(module.exports=Stats),function(){function cos(x){return Math.cos(6.28318531*x)}function clear(color=0){ram.fill(color,renderTarget,renderTarget+PAGESIZE)}function pset(x=cursorX,y=cursorY,color=cursorColor,color2=cursorColor2){cursorColor2=color2,cursorColor=color;let px=(y|=0)%4*4+(x|=0)%4,mask=pat&Math.pow(2,px);color|=0,pcolor=mask?color:color2,0!=pcolor&&(x<0|x>WIDTH-1||y<0|y>HEIGHT-1||(ram[renderTarget+y*WIDTH+x]=mask?color:color2))}function line(x1,y1,x2,y2,color=cursorColor,color2=cursorColor2){cursorColor2=color2,cursorColor=color;var stepx,stepy,dy=(y2|=0)-(y1|=0),dx=(x2|=0)-(x1|=0);if(dy<0?(dy=-dy,stepy=-1):stepy=1,dx<0?(dx=-dx,stepx=-1):stepx=1,dy<<=1,dx<<=1,pset(x1,y1,color),dx>dy)for(var fraction=dy-(dx>>1);x1!=x2;)fraction>=0&&(y1+=stepy,fraction-=dx),fraction+=dy,pset(x1+=stepx,y1,color);else for(fraction=dx-(dy>>1);y1!=y2;)fraction>=0&&(x1+=stepx,fraction-=dy),fraction+=dx,pset(x1,y1+=stepy,color)}function fillCircle(xm,ym,r=5,color=cursorColor,color2=cursorColor2){if(cursorColor2=color2,cursorColor=color,xm|=0,ym|=0,r|=0,color|=0,!(r<0)){xm|=0,ym|=0,color|=0;var x=-(r|=0),y=0,err=2-2*r;do{line(xm-x,ym-y,xm+x,ym-y,color),line(xm-x,ym+y,xm+x,ym+y,color),(r=err)<=y&&(err+=2*++y+1),(r>x||err>y)&&(err+=2*++x+1)}while(x<0)}}function fillRect(x,y,x2=16,y2=16,color=cursorColor,color2=cursorColor2){cursorColor2=color2,cursorColor=color,x1=0|x,y1=0|y,x2|=0,y2|=0,color|=0;var i=Math.abs(y2-y1);if(line(x1,y1,x2,y1,color),i>0)for(;--i;)line(x1,y1+i,x2,y1+i,color);line(x1,y2,x2,y2,color)}function spr(sx=0,sy=0,sw=WIDTH,sh=HEIGHT,x=0,y=0,flipx=!1,flipy=!1,palette=pal){sx|=0,sy|=0,sw|=0,sh|=0,x|=0,y|=0;for(var i=0;i<sh;i++)for(var j=0;j<sw;j++)y+i<HEIGHT&&x+j<WIDTH&&y+i>-1&&x+j>-1&&(flipx&flipy?ram[renderSource+((sy+(sh-i))*WIDTH+sx+(sw-j))]>=0&&(ram[renderTarget+((y+i)*WIDTH+x+j)]=palette[ram[renderSource+((sy+(sh-i-1))*WIDTH+sx+(sw-j-1))]]):flipy&&!flipx?ram[renderSource+((sy+(sh-i))*WIDTH+sx+j)]>=0&&(ram[renderTarget+((y+i)*WIDTH+x+j)]=palette[ram[renderSource+((sy+(sh-i-1))*WIDTH+sx+j)]]):flipx&&!flipy?ram[renderSource+((sy+i)*WIDTH+sx+(sw-j-1))]>=0&&(ram[renderTarget+((y+i)*WIDTH+x+j)]=palette[ram[renderSource+((sy+i)*WIDTH+sx+(sw-j-1))]]):flipx||flipy||ram[renderSource+((sy+i)*WIDTH+sx+j)]>=0&&(ram[renderTarget+((y+i)*WIDTH+x+j)]=palette[ram[renderSource+((sy+i)*WIDTH+sx+j)]]))}function render(){for(var i=PAGESIZE;i--;)data[i]=colors[pal[ram[i]]];imageData.data.set(buf8),ctx.putImageData(imageData,0,0)}function textLine(o){o[7]||(o[7]=1),o[8]||(o[8]=1);for(var textLength=o[0].length,i=0;i<textLength;i++){var letter=[];letter=getCharacter(o[0].charAt(i));for(var y=0;y<5;y++)for(var x=0;x<5;x++)if(1==letter[5*y+x])if(1==o[4])pset(o[1]+x*o[4]+(5*o[4]+o[3])*i,o[2]+(o[6]?Math.sin(1*(t+i*o[8])/o[7])*o[6]:0)+y*o[4]|0,o[5]);else{let tx=o[1]+x*o[4]+(5*o[4]+o[3])*i,ty=o[2]+(o[6]?Math.sin(1*(t+i*o[8])/o[7])*o[6]:0)+y*o[4]|0;fillRect(tx,ty,tx-1+o[4],ty-1+o[4],o[5])}}}function text(o){var letterSize=5*o[7],lines=o[0].split("\n"),linesCopy=lines.slice(0),lineCount=lines.length,longestLine=linesCopy.sort(function(a,b){return b.length-a.length})[0],textWidth=longestLine.length*letterSize+(longestLine.length-1)*o[3],textHeight=lineCount*letterSize+(lineCount-1)*o[4];o[5]||(o[5]="left"),o[6]||(o[6]="bottom");var sx=o[1],sy=o[2],ex=o[1]+textWidth,ey=o[2]+textHeight;"center"==o[5]?(sx=o[1]-textWidth/2,ex=o[1]+textWidth/2):"right"==o[5]&&(sx=o[1]-textWidth,ex=o[1]),"center"==o[6]?(sy=o[2]-textHeight/2,ey=o[2]+textHeight/2):"bottom"==o[6]&&(sy=o[2]-textHeight,ey=o[2]);for(var cx=sx+textWidth/2,cy=sy+textHeight/2,i=0;i<lineCount;i++){var line=lines[i],lineWidth=line.length*letterSize+(line.length-1)*o[3],x=o[1],y=o[2]+(letterSize+o[4])*i;"center"==o[5]?x=o[1]-lineWidth/2:"right"==o[5]&&(x=o[1]-lineWidth),"center"==o[6]?y-=textHeight/2:"bottom"==o[6]&&(y-=textHeight),textLine([line,x,y,o[3]||0,o[7]||1,o[8],o[9],o[10],o[11]])}return{sx:sx,sy:sy,cx:cx,cy:cy,ex:ex,ey:ey,width:textWidth,height:textHeight}}function getCharacter(char){return index=fontString.indexOf(char),fontBitmap.substring(25*index,25*index+25).split("")}function BufferLoader(context,urlList,callback){this.context=context,this.urlList=urlList,this.onload=callback,this.bufferList=new Array,this.loadCount=0}function LCG(seed=Date.now(),a=1664525,c=1013904223,m=Math.pow(2,32)){this.seed=seed,this.a=a,this.c=c,this.m=m}function osc_sin(value){return Math.sin(6.283184*value)}function getnotefreq(n){return.00390625*Math.pow(1.059463094,n-128)}function genBuffer(waveSize,callBack){setTimeout(function(){var buf=new Uint8Array(waveSize*WAVE_CHAN*2),b=buf.length-2,iterate=function(){for(var begin=new Date,count=0;b>=0;)if(buf[b]=0,buf[b+1]=128,b-=2,(count+=1)%1e3==0&&new Date-begin>MAX_TIME)return void setTimeout(iterate,0);setTimeout(function(){callBack(buf)},0)};setTimeout(iterate,0)},0)}function applyDelay(chnBuf,waveSamples,instr,rowLen,callBack){var p1=instr.fx_delay_time*rowLen>>1,t1=instr.fx_delay_amt/255,n1=0,iterate=function(){for(var beginning=new Date,count=0;n1<waveSamples-p1;){var b1=4*n1,l=4*(n1+p1),x1=chnBuf[l]+(chnBuf[l+1]<<8)+(chnBuf[b1+2]+(chnBuf[b1+3]<<8)-32768)*t1;if(chnBuf[l]=255&x1,chnBuf[l+1]=x1>>8&255,x1=chnBuf[l+2]+(chnBuf[l+3]<<8)+(chnBuf[b1]+(chnBuf[b1+1]<<8)-32768)*t1,chnBuf[l+2]=255&x1,chnBuf[l+3]=x1>>8&255,++n1,(count+=1)%1e3==0&&new Date-beginning>MAX_TIME)return void setTimeout(iterate,0)}setTimeout(callBack,0)};setTimeout(iterate,0)}const WIDTH=320,HEIGHT=180,PAGESIZE=WIDTH*HEIGHT,SCREEN=0,BUFFER=PAGESIZE;S=Math.sin,C=Math.cos,audioCtx=new AudioContext,audioMaster=audioCtx.createGain(),audioMaster.connect(audioCtx.destination),viewX=0,viewY=0,cursorX=0,cursorY=0,cursorColor=22,cursorColor2=0,fontString="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_!@#.'\"?/<()",fontBitmap="11111100011111110001100011111010001111101000111110111111000010000100000111111100100101000110001111101111110000111001000011111111111000011100100001000011111100001011110001111111000110001111111000110001111110010000100001001111111111000100001010010111101000110010111001001010001100001000010000100001111110001110111010110001100011000111001101011001110001011101000110001100010111011110100011001011100100000111010001100011001001111111101000111110100011000101111100000111000001111101111100100001000010000100100011000110001100010111010001100011000101010001001000110001101011010101110100010101000100010101000110001010100010000100001001111100010001000100011111001000110000100001000111001110100010001000100111111111000001001100000111110100101001011111000100001011111100001111000001111100111110000111101000101110111110000100010001000010001110100010111010001011100111010001011110000101110011101000110001100010111000000000000000000000111110010000100001000000000100111111000110111101011011101010111110101011111010100000000000000000000000100001100001000100000000000011011010011001000000000000111010001001100000000100000010001000100010001000000010001000100000100000100001000100001000010000010",dither=[65535,65527,65015,65013,62965,62901,58805,58789,42405,42401,42145,42144,41120,40992,32800,32768,0],pat=65535,palDefault=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];var c=document.getElementById("canvas"),ctx=c.getContext("2d"),renderTarget=0,renderSource=PAGESIZE,colors=[4278715910,4279439380,4280620859,4281145203,4280950964,4280499935,4278872826,4280001529,4282504703,4282449151,4284805846,4282637212,4281712985,4281245716,4282284570,4282077732,4280295442,4284757012,4291058728,4292779812,4291286560,4292607142,4294967295,4290835454,4290303738,4288127221,4285754088,4288367292,4286593657,4283642688,4281606692,4279901218,4280822578,4282073457,4282873275,4284720347,4288467700,4293583066,4291934643,4289696651,4287460717,4284634186,4282464563,4281541698,4281872731,4283585166,4285167034,4288919017,4294960867,4294688697,4293172100,4290678104,4286938439,4283328291,4284777522,4287475549,4290436242,4293064653,4289385188,4287344839,4284647072,4283787129,4282666586,4281612610];pal=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],ctx.imageSmoothingEnabled=!1,c.width=WIDTH,c.height=HEIGHT;var imageData=ctx.getImageData(0,0,WIDTH,HEIGHT),buf=new ArrayBuffer(imageData.data.length),buf8=new Uint8Array(buf),data=new Uint32Array(buf),ram=new Uint8Array(WIDTH*HEIGHT*10);Number.prototype.clamp=function(min,max){return Math.min(Math.max(this,min),max)},Number.prototype.map=function(old_bottom,old_top,new_bottom,new_top){return(this-old_bottom)/(old_top-old_bottom)*(new_top-new_bottom)+new_bottom},Number.prototype.pad=function(size,char="0"){for(var s=String(this);s.length<(size||2);)s=char+s;return s},BufferLoader.prototype.loadBuffer=function(url,index){var request=new XMLHttpRequest;request.open("GET",url,!0),request.responseType="arraybuffer";var loader=this;request.onload=function(){loader.context.decodeAudioData(request.response,function(buffer){buffer?(loader.bufferList[index]=buffer,++loader.loadCount==loader.urlList.length&&loader.onload(loader.bufferList)):alert("error decoding file data: "+url)},function(error){console.error("decodeAudioData error",error)})},request.onerror=function(){alert("BufferLoader: XHR error")},request.send()},BufferLoader.prototype.load=function(){for(var i=0;i<this.urlList.length;++i)this.loadBuffer(this.urlList[i],i)},Key={_pressed:{},_released:{},LEFT:37,UP:38,RIGHT:39,DOWN:40,SPACE:32,ONE:49,TWO:50,THREE:51,FOUR:52,a:65,c:67,w:87,s:83,d:68,z:90,x:88,f:70,p:80,r:82,i:73,j:74,k:75,l:76,isDown(keyCode){return this._pressed[keyCode]},justReleased(keyCode){return this._released[keyCode]},onKeydown(event){this._pressed[event.keyCode]=!0},onKeyup(event){this._released[event.keyCode]=!0,delete this._pressed[event.keyCode]},update(){this._released={}}},LCG.prototype.setSeed=function(seed){this.seed=seed},LCG.prototype.nextInt=function(){return this.seed=(this.seed*this.a+this.c)%this.m,this.seed},LCG.prototype.nextFloat=function(){return this.nextInt()/this.m},LCG.prototype.nextBool=function(percent){return null==percent&&(percent=.5),this.nextFloat()<percent},LCG.prototype.nextFloatRange=function(min,max){return min+this.nextFloat()*(max-min)},LCG.prototype.nextIntRange=function(min,max){return Math.floor(this.nextFloatRange(min,max))},LCG.prototype.nextColor=function(){for(var c=this.nextIntRange(0,Math.pow(2,24)).toString(16).toUpperCase();c.length<6;)c="0"+c;return"#"+c};var sonantx={},WAVE_CHAN=2,MAX_TIME=33,audioCtx=null,oscillators=[osc_sin,function(value){return osc_sin(value)<0?-1:1},function(value){return value%1-.5},function(value){var v2=value%1*4;return v2<2?v2-1:3-v2}];sonantx.AudioGenerator=function(mixBuf){this.mixBuf=mixBuf,this.waveSize=mixBuf.length/WAVE_CHAN/2},sonantx.AudioGenerator.prototype.getAudioBuffer=function(callBack){null===audioCtx&&(audioCtx=new AudioContext);var mixBuf=this.mixBuf,waveBytes=this.waveSize*WAVE_CHAN*2,buffer=audioCtx.createBuffer(WAVE_CHAN,this.waveSize,44100),lchan=buffer.getChannelData(0),rchan=buffer.getChannelData(1),b=0,iterate=function(){for(var beginning=new Date,count=0;b<waveBytes/2;){var y=4*(mixBuf[4*b]+(mixBuf[4*b+1]<<8)-32768);if(y=y<-32768?-32768:y>32767?32767:y,lchan[b]=y/32768,y=4*(mixBuf[4*b+2]+(mixBuf[4*b+3]<<8)-32768),y=y<-32768?-32768:y>32767?32767:y,rchan[b]=y/32768,b+=1,(count+=1)%1e3==0&&new Date-beginning>MAX_TIME)return void setTimeout(iterate,0)}setTimeout(function(){callBack(buffer)},0)};setTimeout(iterate,0)},sonantx.SoundGenerator=function(instr,rowLen){this.instr=instr,this.rowLen=rowLen||5605,this.osc_lfo=oscillators[instr.lfo_waveform],this.osc1=oscillators[instr.osc1_waveform],this.osc2=oscillators[instr.osc2_waveform],this.attack=instr.env_attack,this.sustain=instr.env_sustain,this.release=instr.env_release,this.panFreq=Math.pow(2,instr.fx_pan_freq-8)/this.rowLen,this.lfoFreq=Math.pow(2,instr.lfo_freq-8)/this.rowLen},sonantx.SoundGenerator.prototype.genSound=function(n,chnBuf,currentpos){new Date;for(var c1=0,c2=0,o1t=getnotefreq(n+12*(this.instr.osc1_oct-8)+this.instr.osc1_det)*(1+8e-4*this.instr.osc1_detune),o2t=getnotefreq(n+12*(this.instr.osc2_oct-8)+this.instr.osc2_det)*(1+8e-4*this.instr.osc2_detune),q=this.instr.fx_resonance/255,low=0,band=0,j=this.attack+this.sustain+this.release-1;j>=0;--j){var k=j+currentpos,lfor=this.osc_lfo(k*this.lfoFreq)*this.instr.lfo_amt/512+.5,e=1;j<this.attack?e=j/this.attack:j>=this.attack+this.sustain&&(e-=(j-this.attack-this.sustain)/this.release);var t=o1t;this.instr.lfo_osc1_freq&&(t+=lfor),this.instr.osc1_xenv&&(t*=e*e),c1+=t;var rsample=this.osc1(c1)*this.instr.osc1_vol;t=o2t,this.instr.osc2_xenv&&(t*=e*e),c2+=t,rsample+=this.osc2(c2)*this.instr.osc2_vol,this.instr.noise_fader&&(rsample+=(2*Math.random()-1)*this.instr.noise_fader*e),rsample*=e/255;var f=this.instr.fx_freq;this.instr.lfo_fx_freq&&(f*=lfor);var high=q*(rsample-band)-(low+=(f=1.5*Math.sin(3.141592*f/44100))*band);switch(band+=f*high,this.instr.fx_filter){case 1:rsample=high;break;case 2:rsample=low;break;case 3:rsample=band;break;case 4:rsample=low+high}if(t=osc_sin(k*this.panFreq)*this.instr.fx_pan_amt/512+.5,rsample*=39*this.instr.env_master,(k*=4)+3<chnBuf.length){var x=chnBuf[k]+(chnBuf[k+1]<<8)+rsample*(1-t);chnBuf[k]=255&x,chnBuf[k+1]=x>>8&255,x=chnBuf[k+2]+(chnBuf[k+3]<<8)+rsample*t,chnBuf[k+2]=255&x,chnBuf[k+3]=x>>8&255}}},sonantx.SoundGenerator.prototype.getAudioGenerator=function(n,callBack){var bufferSize=this.attack+this.sustain+this.release-1+32*this.rowLen,self=this;genBuffer(bufferSize,function(buffer){self.genSound(n,buffer,0),applyDelay(buffer,bufferSize,self.instr,self.rowLen,function(){callBack(new sonantx.AudioGenerator(buffer))})})},sonantx.SoundGenerator.prototype.createAudioBuffer=function(n,callBack){this.getAudioGenerator(n,function(ag){ag.getAudioBuffer(callBack)})},sonantx.MusicGenerator=function(song){this.song=song,this.waveSize=44100*song.songLen},sonantx.MusicGenerator.prototype.generateTrack=function(instr,mixBuf,callBack){var self=this;genBuffer(this.waveSize,function(chnBuf){var waveSamples=self.waveSize,waveBytes=self.waveSize*WAVE_CHAN*2,rowLen=self.song.rowLen,endPattern=self.song.endPattern,soundGen=new sonantx.SoundGenerator(instr,rowLen),currentpos=0,p=0,row=0,recordSounds=function(){for(var beginning=new Date;;)if(32!==row){if(p===endPattern-1)return void setTimeout(delay,0);var cp=instr.p[p];if(cp){var n=instr.c[cp-1].n[row];n&&soundGen.genSound(n,chnBuf,currentpos)}if(currentpos+=rowLen,row+=1,new Date-beginning>MAX_TIME)return void setTimeout(recordSounds,0)}else row=0,p+=1},delay=function(){applyDelay(chnBuf,waveSamples,instr,rowLen,finalize)},b2=0,finalize=function(){for(var beginning=new Date,count=0;b2<waveBytes;){var x2=mixBuf[b2]+(mixBuf[b2+1]<<8)+chnBuf[b2]+(chnBuf[b2+1]<<8)-32768;if(mixBuf[b2]=255&x2,mixBuf[b2+1]=x2>>8&255,b2+=2,(count+=1)%1e3==0&&new Date-beginning>MAX_TIME)return void setTimeout(finalize,0)}setTimeout(callBack,0)};setTimeout(recordSounds,0)})},sonantx.MusicGenerator.prototype.getAudioGenerator=function(callBack){var self=this;genBuffer(this.waveSize,function(mixBuf){var t=0,recu=function(){t<self.song.songData.length?(t+=1,self.generateTrack(self.song.songData[t-1],mixBuf,recu)):callBack(new sonantx.AudioGenerator(mixBuf))};recu()})},sonantx.MusicGenerator.prototype.createAudioBuffer=function(callBack){this.getAudioGenerator(function(ag){ag.getAudioBuffer(callBack)})},states={},init=(()=>{stats=new Stats,stats.showPanel(1),document.body.appendChild(stats.dom),lcg=new LCG(1019),sounds={},soundsLoaded=0,totalSounds=8,score=0,last=0,dt=0,now=0,t=0,bx=0,platformInterval=40,platformSpeed=.6,playerSpeed=2,state="proto",players=[{x:0,y:0,xVelocity:0,yVelocity:0,ySpeed:playerSpeed},{x:0,y:0,xVelocity:0,yVelocity:0,ySpeed:playerSpeed}],platforms=[],backgroundOrbs=[];for(let i=0;i<10;i++)platforms.push({x:Math.random()*WIDTH/2,y:i*platformInterval,color:12*Math.random()+4|0,width:50*Math.random()|0});for(let i=0;i<20;i++)backgroundOrbs.push({x:Math.random()*WIDTH/2,y:10*i,r:30*Math.random(),dither:6*Math.random()+7|0,color:29});paused=!1,audioCtx=new AudioContext,loop()}),window.addEventListener("keyup",function(event){Key.onKeyup(event)},!1),window.addEventListener("keydown",function(event){Key.onKeydown(event)},!1),window.addEventListener("blur",function(event){paused=!0},!1),window.addEventListener("focus",function(event){paused=!1},!1),window.addEventListener("gamepadconnected",function(e){console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",e.gamepad.index,e.gamepad.id,e.gamepad.buttons.length,e.gamepad.axes.length)}),loop=(e=>{stats.begin(),gamepads=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads:[],gp0=gamepads[0],gp1=gamepads[1],paused?text(["PAUSED",WIDTH/2,128,3,1,"center","top",4,21,0]):(pal=palDefault,t+=1,states[state].step(dt),states[state].render()),render(),stats.end(),requestAnimationFrame(loop)}),states.gameover={step:function(dt){Key.isDown(Key.r)&&(state="menu")},render:function(dt){renderTarget=0,clear(0),cursorColor2=5,text(["GAME OVER",192,80,8,15,"center","top",4,27])}},states.menu={step:function(dt){Key.isDown(Key.SPACE)&&(state="game")},render:function(dt){text(["TITLE",WIDTH/2,50,14,20,"center","top",6,21])}},states.game={step(dt){bx=WIDTH/2+60*cos(t/2),Key.isDown(Key.f)&&(state="gameover")},render(dt){renderTarget=SCREEN,clear(0),pat=dither[8],fillRect(bx-20,60,bx+20,140,4,5)}},states.proto={step:function(dt){platforms.forEach(function(p,i,arr){}),this.updatePlayer()},render:function(dt){this.drawThings(0),this.drawThings(1)},drawThings:function(side){viewY=players[side].y,renderTarget=BUFFER,clear(30),cursorColor2=0,backgroundOrbs.forEach(function(orb){pat=dither[orb.dither],fillCircle(orb.x,orb.y-viewY,orb.r,orb.color)}),platforms.forEach(function(p){pat=dither[0],fillRect(p.x,p.y-viewY,p.x+p.width,p.y+10-viewY,p.color,p.color-1)}),renderTarget=SCREEN;let startDrawX=0==side?0:WIDTH/2,endDrawX=0==side?WIDTH/2:WIDTH;pat=dither[0],fillRect(startDrawX,HEIGHT,endDrawX,HEIGHT,30),spr(0,0,WIDTH/2,HEIGHT,0==side?0:WIDTH/2,0)},updatePlayer:function(){var p0=players[0],p1=players[1];p0.yVelocity*=.5,p0.xVelocity=0,p1.yVelocity*=.5,p1.xVelocity=0,Key.isDown(Key.w)?players[0].y-=2:Key.isDown(Key.s)&&(players[0].y+=2),Key.isDown(Key.i)?players[1].y-=players[1].ySpeed*t/60:Key.isDown(Key.k)&&(players[1].y+=players[1].ySpeed*t/60),gp0&&Math.abs(gp0.axes[1])>.1&&(p0.y+=gp0.axes[1]*p0.ySpeed),gp1&&Math.abs(gp1.axes[1])>.1&&(p1.y+=gp1.axes[1]*p1.ySpeed),p0.y+=p0.yVelocity,p1.y+=p1.yVelocity},drawPlayer:function(player){fillRect(players[player].x,py,16,16)}},states.loading={init:function(dt){},step:function(dt){},render:function(dt){renderTarget=SCREEN,clear(0),text(["LOADING...",WIDTH/2,128+20*Math.sin(t),3,2,"center","top",3,9])}},window.onload=init()}();
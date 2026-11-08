import {beginDrawing,finishDrawing,INK,PAPER,PALE} from './drawing-kit.mjs';
import {drawChef} from './chef-art.mjs';
import {currentPhase} from './daytime.mjs';
// Lamps each scene adds for the night-time glow (see finishDrawing).
let lights=[];
const light=(x,y,r=70)=>lights.push([x,y,r]);
const pane=(x,y,w,h)=>lights.push(['rect',x,y,w,h]);

// All art is original Canvas geometry. Scene coordinates and interaction anchors
// are the same 640×420 world used by the existing customer journey and camera.
const frameOf=time=>Math.floor(time/120);
function cup(d,x,y,s=1,frame=0){
 d.oval(x,y+5*s,7*s,2*s,PAPER,.7);d.poly([[x-4*s,y-5*s],[x+4*s,y-5*s],[x+3*s,y+4*s],[x-3*s,y+4*s]],PAPER,.8);
 d.oval(x,y-5*s,4*s,1.5*s,'#b1b8c4',.7);d.oval(x+5*s,y-1*s,2*s,2.7*s,null,.8);if(frame)d.steam(x-3*s,y-8*s,frame);
}
function bread(d,x,y,w=35,s=1,bite=0){
 const end=x+w*(1-bite*.24);d.oval((x+end)/2,y+9*s,(end-x)/2,3*s,'#9d8d7233',0);
 d.poly([[x,y+5*s],[x+3*s,y-2*s],[end-5*s,y-4*s],[end,y+1*s],[end-1*s,y+7*s],[x+3*s,y+9*s]],'#d9bd8b',1);
 d.line([x+2*s,y+4*s],[end-1*s,y+3*s],1.5);d.line([x+3*s,y+6*s],[end-2*s,y+6*s],1,'#7a8192');
 for(let i=0;i<3;i++)d.line([x+7*s+i*(end-x-14*s)/3,y-1*s],[x+10*s+i*(end-x-14*s)/3,y+2*s],.7);
}
function plant(d,x,y,s=1){
 d.poly([[x-7*s,y],[x+7*s,y],[x+5*s,y+12*s],[x-5*s,y+12*s]],PALE,1);d.oval(x,y,7*s,2*s,PAPER,.8);d.line([x,y],[x,y-28*s]);
 for(let i=0;i<5;i++){let yy=y-(6+i*5)*s,dx=(i%2?1:-1)*10*s;d.poly([[x,yy],[x+dx,yy-7*s],[x+dx*.8,yy],[x,yy+3*s]],i%2?'#b1becb':'#d0d4ce',.8);d.line([x,yy+1*s],[x+dx*.8,yy-4*s],.5);}
}
function flag(d,x,y,w=18,h=24){
 d.rect(x,y,w,h,PAPER,.7);d.rect(x,y,w/3,h,'#9baaab',0);d.rect(x+w*2/3,y,w/3,h,'#b58075',0);d.line([x+w/3,y],[x+w/3-1,y+h],.6);d.line([x+w*2/3,y],[x+w*2/3+1,y+h],.6);
}
function windowFront(d,x,y,w,h){
 d.rect(x-3,y-3,w+6,h+6,PALE,1);d.rect(x,y,w,h,'#e5e2d6',1.3);d.rect(x+3,y+3,w-6,h-6,'#dce1df',.6);d.line([x+w/2,y],[x+w/2,y+h],1.4);d.line([x,y+h*.48],[x+w,y+h*.48],1);
 d.line([x+5,y+7],[x+19,y+29],.6,'#fff9e8');d.line([x+w-9,y+14],[x+w-22,y+37],.7,'#fff9e8');d.rect(x-7,y+h+2,w+14,4,PAPER,.7);
}
function exterior(g,{time=0}){
 const d=beginDrawing(g),f=frameOf(time);
 const NAVY='#24366c',FRAME='#3a5a93',CREAM='#efe3bb',WOOD='#b5804f',GRAIN='#86562f',IRON='#2a2e42',TILE_R='#c47b63',TILE_D='#44475a';
 // Neighbours: pale render on the left, the shop's brick upper floors, a black door at no. 93 on the right.
 d.rect(0,0,640,355,'#e4ddd0',0);d.rect(104,0,410,355,'#d9b48f',0);
 for(let y=10,row=0;y<120;y+=11,row++)for(let x=104+(row%2?-12:4);x<514;x+=30){d.line([Math.max(104,x),y],[Math.min(514,x+26),y],.4,'#7a4f2e55');d.line([x+26,y],[x+26,y+9],.35,'#7a4f2e40');}
 d.line([104,0],[104,354],1.4);d.line([514,0],[514,354],1.4);
 windowFront(d,160,18,72,86);windowFront(d,384,18,72,86);windowFront(d,22,92,58,82);
 d.rect(10,196,86,150,'#dcdcd6',1.1);d.rect(18,206,70,130,'#cfd4d6',.8);d.line([53,206],[53,336],.8);
 d.rect(520,0,120,355,'#e9e6df',0);d.rect(566,226,62,128,'#26283a',1.2);d.rect(574,236,46,52,'#30334a',.6);d.rect(574,296,46,50,'#30334a',.6);d.text('93',597,224,9);d.oval(612,300,1.6,1.6,'#c9b98a',0);
 // White scroll corbels either side of the fascia.
 for(const x of [100,508]){d.poly([[x,118],[x+12,118],[x+12,192],[x+4,196],[x,186]],'#f4f1ea',1);d.oval(x+6,128,4,4,null,.8);d.oval(x+6,128,1.6,1.6,null,.6);d.line([x+3,140],[x+4,182],.6);d.line([x+9,140],[x+8,182],.6);}
 // Fascia: serif capitals, the shop number twice and the phone number.
 d.rect(114,124,392,58,CREAM,1.4);d.rect(119,129,382,48,null,.5,'#17307f60');
 d.text('ITALIA UNO',310,162,31,'#2443a0',0,'center');
 d.text('91',127,142,9,'#2443a0',0,'left');d.text('91',494,142,9,'#2443a0',0,'right');
 d.text('020 763 75326',310,175,8.5,'#2443a0',0,'center');
 // Navy awning with its faded name and printed valance.
 d.poly([[108,184],[512,184],[528,214],[92,214]],NAVY,1.2);
 for(let i=0;i<14;i++)d.line([128+i*28,186],[118+i*28,212],.5,'#ffffff1c');
 d.text('ITALIA UNO',310,207,14,'#d8ceb055',0,'center');
 d.rect(92,214,436,24,'#1f2f61',1.2);d.line([94,236],[526,236],.8,'#d8ceb080');
 d.text('PANINOTECA',112,230,10.5,CREAM);d.text('SANDWICH BAR',258,230,10.5,CREAM);d.text('EAT IN OR TAKE AWAY',512,230,10.5,CREAM,0,'right');
 // Slate-blue shopfront: left door, two big panes, the open right door.
 d.rect(112,238,396,116,FRAME,1.2);
 d.rect(120,244,58,108,'#c3c9d1',1);d.rect(184,244,108,96,'#c3c9d1',1);d.rect(298,244,108,96,'#c3c9d1',1);d.rect(412,244,56,110,'#3a3e54',1);d.rect(474,244,28,96,'#c3c9d1',1);
 // Through the glass: each pane shows a different corner of the café.
 const bunting=(x,w)=>{d.line([x+2,249],[x+w-2,251],.5);for(let i=0;i<5;i++){const fx=x+6+i*20;d.rect(fx,249,5,9,'#8fae8f',0);d.rect(fx+5,249,5,9,'#f2efe6',0);d.rect(fx+10,249,5,9,'#c98a7c',0);}};
 // Left pane: the deli counter side-on, with the blue boards behind.
 g.save();g.beginPath();g.rect(185,245,106,94);g.clip();
 d.rect(184,244,108,96,'#e9dfcb',0);bunting(184,108);
 d.rect(196,262,26,18,'#1f3b8c',.6);d.rect(226,262,26,18,'#1f3b8c',.6);d.rect(256,262,26,18,'#1f3b8c',.6);
 for(const bx of [199,229,259])for(let k=0;k<4;k++)d.line([bx+2,266+k*3.4],[bx+16-k*2,266+k*3.4],.35,'#f4efe2');
 d.rect(188,312,100,28,'#c95b4c',.8);d.rect(188,306,100,7,'#f4f1ec',.7);
 g.beginPath();g.moveTo(198,306);g.quadraticCurveTo(200,288,216,286);g.lineTo(288,286);g.lineTo(288,306);g.closePath();g.fillStyle='#e4f0f466';g.fill();g.strokeStyle=INK;g.lineWidth=.9;g.stroke();
 d.oval(226,301,8,3,'#a1514a',.5);d.oval(244,301,6,4,'#e3a49a',.5);d.oval(262,302,7,2.6,'#e9d7a4',.5);d.oval(276,301,4,3.4,'#e3c44a',.5);
 d.line([212,290],[224,304],.5,'#ffffffaa');
 g.restore();
 // Right pane: a table and two chairs side-on, a Napoli shirt and a flag on the wall.
 g.save();g.beginPath();g.rect(299,245,106,94);g.clip();
 d.rect(298,244,108,96,'#ece2cf',0);bunting(298,108);
 d.poly([[384,262],[389,259],[392,260],[395,259],[400,262],[398,266],[396,265],[396,276],[388,276],[388,265],[386,266]],'#8fbfe8',.6);
 d.rect(310,262,14,10,'#f2efe6',.5);d.rect(310,262,4.6,10,'#8fae8f',0);d.rect(319.4,262,4.6,10,'#c98a7c',0);d.line([310,262],[310,284],.6);
 const sideChair=(x,flip)=>{const f=flip?-1:1;d.line([x,312],[x,338],1.1,'#2a2e42');d.line([x+10*f,312],[x+10*f,338],1.1,'#2a2e42');d.rect(Math.min(x,x+11*f)-.5,309,11.5,3.4,'#b5804f',.6);d.line([x,310],[x-1*f,288],1.1,'#2a2e42');for(let k=0;k<3;k++)d.line([x-.6*f,292+k*5],[x+3*f,292+k*5],.9,'#b5804f');};
 sideChair(322,false);sideChair(384,true);
 d.oval(353,304,20,3,'#b5804f',.8);d.line([353,306],[353,336],1.2,'#2a2e42');d.line([345,338],[361,338],1.2,'#2a2e42');cup(d,348,300,.6);
 g.restore();
 d.rect(180,340,232,14,FRAME,.8);
 // Laser-cut leaf screen in front of the left door: fine stems and leaves.
 d.rect(124,250,52,104,IRON,1);g.save();g.beginPath();g.rect(127,253,46,98);g.clip();g.strokeStyle='#c9d1db';g.fillStyle='#c9d1db';g.lineWidth=.6;
 for(let i=0;i<7;i++){const sx=124+i*8,sy=356;g.beginPath();g.moveTo(sx,sy);g.bezierCurveTo(sx+8,sy-30,sx-4,sy-62,sx+10,sy-104);g.stroke();
  for(let k=0;k<9;k++){const t=k/9,lx=sx+8*t*(1-t)*3+(t*10),ly=sy-t*104;g.save();g.translate(lx,ly);g.rotate((k%2?.9:-.9)+i*.1);g.beginPath();g.ellipse(k%2?3:-3,0,3.4,1.1,0,0,Math.PI*2);g.fill();g.restore();}}
 g.restore();
 // Hanging sign on the right pilaster.
 d.line([514,140],[522,140],1.2);d.rect(520,132,40,96,'#f7f5ef',1.2);d.text('ITALIA',540,160,10,'#2443a0',0,'center');d.text('UNO',540,184,10,'#2443a0',0,'center');d.text('CAFFE',540,208,10,'#2443a0',0,'center');
 // Red and black chequered terrace, square tiles in gentle perspective.
 d.rect(0,354,640,58,'#d9d2c4',0);g.save();g.beginPath();g.rect(56,354,486,57);g.clip();
 const rows=[354,361,368.4,376.2,384.4,393,402,411];
 const px=(x,y)=>320+(x-320)*(.78+(y-354)*.0062);
 for(let r=0;r<rows.length-1;r++)for(let c=-20;c<20;c++){const x0=320+c*17,x1=x0+17,y0=rows[r],y1=rows[r+1];
  g.beginPath();g.moveTo(px(x0,y0),y0);g.lineTo(px(x1,y0),y0);g.lineTo(px(x1,y1),y1);g.lineTo(px(x0,y1),y1);g.closePath();g.fillStyle=(r+c)%2?TILE_R:TILE_D;g.fill();g.strokeStyle='#d9d2c455';g.lineWidth=.5;g.stroke();}
 g.restore();d.line([56,354],[542,354],1);d.line([0,411],[640,411],1);d.rect(0,411,640,9,'#b9bcc2',0);
 // Folding chairs: slatted black metal, and a wooden one.
 const ironChair=(x,y,s=1)=>{const k=v=>v*s;
  d.line([x-k(7),y-k(42)],[x+k(9),y],1.5,IRON);d.line([x+k(7),y-k(42)],[x-k(9),y],1.5,IRON);
  d.poly([[x-k(8),y-k(44)],[x+k(8),y-k(44)],[x+k(7),y-k(28)],[x-k(7),y-k(28)]],IRON,.8);
  for(let i=1;i<4;i++)d.line([x-k(7),y-k(44)+i*k(4)],[x+k(7),y-k(44)+i*k(4)],.45,'#6d7290');
  d.poly([[x-k(10),y-k(21)],[x+k(10),y-k(21)],[x+k(12),y-k(16)],[x-k(12),y-k(16)]],IRON,.8);
  d.line([x-k(11),y],[x-k(6),y],1.2,IRON);d.line([x+k(6),y],[x+k(11),y],1.2,IRON);};
 const woodChair=(x,y)=>{d.line([x-7,y-42],[x+9,y],1.4,GRAIN);d.line([x+7,y-42],[x-9,y],1.4,GRAIN);for(let i=0;i<3;i++)d.rect(x-8,y-44+i*5,16,3.4,WOOD,.55);d.poly([[x-10,y-21],[x+10,y-21],[x+12,y-16],[x-12,y-16]],WOOD,.7);for(let i=-1;i<2;i++)d.line([x-9+i*0,y-19.5+i*1.2],[x+9,y-19.5+i*1.2],.35,GRAIN);};
 // Round wooden bistro tables: grain, a worn edge, folding iron legs.
 const table=(x,y,r=31)=>{d.line([x-10,y+6],[x+16,y+62],1.7,IRON);d.line([x+10,y+6],[x-16,y+62],1.7,IRON);d.line([x-21,y+62],[x-10,y+62],1.4,IRON);d.line([x+10,y+62],[x+21,y+62],1.4,IRON);d.line([x-7,y+30],[x+7,y+30],.8,IRON);
  d.oval(x,y+3.2,r,8,'#8f5f38',1);d.oval(x,y,r,8,WOOD,1.1);for(let k=1;k<5;k++)d.oval(x-3+k*.8,y-.2,r*k/5.4,8*k/5.6,null,.4,GRAIN);d.line([x-r+6,y-2],[x-r+14,y-4.4],.6,'#e9c79a');d.line([x+8,y+3],[x+20,y+2],.4,GRAIN);};
 woodChair(186,392);table(222,330);ironChair(262,396);table(318,338,29);ironChair(362,402,1.02);
 cup(d,212,324,.85);d.rect(229,318,6,8,'#c8ccd3',.6);d.oval(232,318,3,1.2,'#e3e6ea',.5);cup(d,312,332,.85,f);d.rect(324,326,5,7,'#c8ccd3',.6);
 ironChair(96,404,1.12);
 // A-board, wide enough for its lettering.
 d.poly([[468,302],[514,302],[522,370],[460,370]],'#8f6a45',1);d.poly([[472,308],[510,308],[515,356],[467,356]],'#23315f',1);
 d.text('Caffè',491,327,11,'#f3ead9',-.03,'center');d.text('& panini',491,343,9,'#f3ead9',.02,'center');d.line([461,370],[457,377],1.2);d.line([521,370],[525,377],1.2);
 plant(d,62,352,1.15);
 // Black railing round the terrace, as on Charlotte Street.
 d.line([540,300],[640,300],1.6,IRON);for(let x=546;x<640;x+=14)d.line([x,300],[x,354],1.1,IRON);d.line([540,300],[540,354],1.6,IRON);d.line([540,322],[640,322],.8,IRON);
 // The host in the doorway, doing his thumbs-up.
 d.oval(440,362,20,4,'#17307f18',0);drawChef(g,440-48*102/128,360-126*102/128,{scale:102/128,frame:f,pose:'wave'});
 pane(186,262,104,76);pane(300,262,104,76);pane(476,246,24,92);pane(162,20,68,82);light(238,300,95);light(352,300,95);light(310,152,110);light(440,300,60);light(540,180,46);light(240,360,70);light(350,360,70);
 return {welcome:[339,255]};
}
function interior(g,{time=0,served=false,action='',mealProgress=0,dining=false}){
 const d=beginDrawing(g),f=frameOf(time),p=(x,z,y=0)=>[284+(x-z)*25,154+(x+z)*12.5-y*29];
 const q=(a,fill,width=1)=>d.poly(a.map(v=>p(...v)),fill,width);
 const cube=(x,z,y,w,dep,h,fill=PAPER)=>{q([[x,z,y+h],[x+w,z,y+h],[x+w,z+dep,y+h],[x,z+dep,y+h]],fill,.8);const front=[[x,z+dep,y],[x+w,z+dep,y],[x+w,z+dep,y+h],[x,z+dep,y+h]].map(v=>p(...v));d.poly(front,fill,.9);d.hatch(front,6,'#17307f1a');q([[x+w,z,y],[x+w,z+dep,y],[x+w,z+dep,y+h],[x+w,z,y+h]],PALE,.9);};
 const wall=(face,u,y,w,h,c=PAPER)=>face==='back'?q([[u,0,y],[u+w,0,y],[u+w,0,y+h],[u,0,y+h]],c,.8):q([[0,u,y],[0,u+w,y],[0,u+w,y+h],[0,u,y+h]],c,.8);
 // A chunky dollhouse slab with a soft shadow, like a cosy game room.
 {const c=p(5.5,4,-.7);d.oval(c[0]+6,c[1]+14,190,58,'#17307f14',0);}
 const T=.28;
 q([[-T,8.2,-.6],[11.2,8.2,-.6],[11.2,8.2,0],[-T,8.2,0]],'#d9b98d',1.3);
 q([[11.2,-T,-.6],[11.2,8.2,-.6],[11.2,8.2,0],[11.2,-T,0]],'#c7a273',1.3);
 for(let i=1;i<6;i++)d.line(p(-T+i*1.9,8.2,-.55),p(-T+i*1.9,8.2,-.05),.5,'#8a6440');
 q([[-T,-T,0],[11.2,-T,0],[11.2,8.2,0],[-T,8.2,0]],'#f3e3c4',1.2);
 for(let x=0;x<11;x++)for(let z=0;z<8;z++)q([[x,z,0],[x+1,z,0],[x+1,z+1,0],[x,z+1,0]],(x+z)%2?'#c9d3ea':'#fbf3e3',.3);
 q([[0,0,0],[0,8,0],[0,8,4.5],[0,0,4.5]],'#f1e4cc',1.25);q([[0,0,0],[11,0,0],[11,0,4.5],[0,0,4.5]],'#f7edd9',1.25);
 // Thick wall edges and caps so the room reads as a solid little box.
 q([[0,8,0],[-T,8,0],[-T,8,4.5],[0,8,4.5]],'#e3d2b2',1.1);q([[11,0,0],[11,-T,0],[11,-T,4.5],[11,0,4.5]],'#e9d9bb',1.1);
 q([[-T,-T,4.5],[11,-T,4.5],[11,0,4.5],[0,0,4.5],[0,8,4.5],[-T,8,4.5]],'#fbf6ec',1.2);
 // Skirting board.
 q([[0,0,0],[11,0,0],[11,0,.22],[0,0,.22]],'#d9b98d',.8);q([[0,0,0],[0,8,0],[0,8,.22],[0,0,.22]],'#cfae82',.8);
 for(let y=.1;y<1.9;y+=.42){d.line(p(0,0,y),p(11,0,y),.4,'#17307f40');for(let x=0;x<11;x++)d.line(p(x,0,y),p(x,0,y+.4),.35,'#17307f40');}
 const board=(x,title,rows)=>{wall('back',x,2.05,2.95,2.2,INK);let a=p(x+.1,0,4.12);g.save();g.transform(1,.5,0,1,...a);d.text(title,0,0,10,PAPER);d.line([0,4],[65,4],.5,PAPER);rows.forEach((row,i)=>{d.text(row,0,15+i*6,6.2,PAPER);});g.restore();};
 board(.3,'Panini italiani',['Italia','Campagnolo','Cotoletta','Pescatore','Piccante','Bondola','Barese','Puglia','Veneziano']);board(3.45,'Oggi in cucina',['Lasagne','Pasta del giorno','Parmigiana','Arancini','Insalate','Panini','Dolci']);board(6.62,'Caffè e colazione',['Uova sul pane','Colazione italiana','Vegetariana','Espresso','Cappuccino','Caffellatte','Tè e cioccolata']);
 const shirt=(face,u,y,col)=>{wall(face,u,y,.62,.86,col);wall(face,u-.15,y+.53,.18,.3,col);wall(face,u+.6,y+.53,.18,.3,col);wall(face,u+.2,y+.73,.2,.1,PAPER);for(let j=0;j<3;j++)wall(face,u+.1+j*.18,y+.08,.035,.57,PAPER);};
 [2.7,3.8,4.9,6].forEach((u,i)=>shirt('left',u,3.25,i%2?'#bcc4d0':'#8295b6'));
 [1.3,4,6.7].forEach((u,i)=>shirt('back',u,4.18,i%2?'#d1c6b0':'#95a7c1'));
 const tv=(face,u,y,w,h)=>{wall(face,u,y,w,h,INK);wall(face,u+.07,y+.07,w-.14,h-.14,'#bec9c9');wall(face,u+w/2,y+.1,.025,h-.2,PAPER);for(let i=0;i<5;i++)wall(face,u+.18+(i*.17+(f%20)*.007)%(w-.3),y+.2+(i*.11)%(h-.3),.04,.07,INK);};tv('left',1,3.3,1.25,.9);
 // Wall-mounted TV, top right, showing a football match.
 {wall('back',9.66,3.08,1.28,1.08,'#20243a');const o=p(9.72,0,4.1),u=25,v=29,W=1.16*u,H=.96*v;g.save();g.transform(1,.5,0,1,o[0],o[1]);
  g.fillStyle='#4f9a5c';g.fillRect(0,0,W,H);for(let i=0;i<6;i++){g.fillStyle=i%2?'#58a465':'#4a9256';g.fillRect(i*W/6,0,W/6,H);}
  g.strokeStyle='#f3f6ef';g.lineWidth=.7;g.strokeRect(2,2,W-4,H-4);g.beginPath();g.moveTo(W/2,2);g.lineTo(W/2,H-2);g.stroke();g.beginPath();g.arc(W/2,H/2,4.2,0,Math.PI*2);g.stroke();g.strokeRect(2,H/2-5,6,10);g.strokeRect(W-8,H/2-5,6,10);
  const t=f*.12;for(let i=0;i<5;i++){const px=W*(.18+.16*i)+Math.sin(t+i*1.7)*5,py=H*(.3+.12*(i%3))+Math.cos(t*1.3+i)*3;g.fillStyle=i%2?'#f4f1ea':'#2f57c2';g.beginPath();g.arc(px,py,1.6,0,Math.PI*2);g.fill();}
  const bx=W/2+Math.sin(t*1.6)*W*.3,by=H/2+Math.cos(t*2.1)*H*.25;g.fillStyle='#ffffff';g.beginPath();g.arc(bx,by,1.1,0,Math.PI*2);g.fill();
  g.fillStyle='#17307fcc';g.fillRect(2.5,2.5,17,5.4);g.fillStyle='#f4efe2';g.font="600 3.8px 'IU Serif', Georgia, serif";g.fillText('NAP 2–1',4,6.6);
  g.restore();light(...p(10.3,.4,3.6),52);}
 const ck=p(0,5.85,3.57);d.oval(...ck,7,8,PAPER,.9);d.line(ck,[ck[0],ck[1]-5]);d.line(ck,[ck[0]+4,ck[1]+2]);
 const boss=p(8.9,1.15,0);d.oval(boss[0],boss[1],16,4,'#17307f1b',0);drawChef(g,boss[0]-28.5,boss[1]-74.8,{scale:76/128,frame:f});
 cube(.55,1.6,0,7.75,1.2,1.15,'#c95b4c');q([[.55,2.8,.86],[8.3,2.8,.86],[8.3,2.8,1.15],[.55,2.8,1.15]],'#f7f3ec',.7);q([[.55,2.81,.93],[8.3,2.81,.93],[8.3,2.81,1.04],[.55,2.81,1.04]],PAPER,.6);
 for(let i=0;i<7;i++){cube(.65+i*.72,1.73,1.18,.62,.85,.06,PAPER);for(let j=0;j<4;j++){const a=p(.8+i*.72+(j%2)*.22,1.86+Math.floor(j/2)*.25,1.26);if(i<2)bread(d,a[0]-4,a[1],8,.3);else d.oval(a[0],a[1],3,1.7,['#9aabc3','#cdb58d','#bac4c3'][i%3],.5);}}
 q([[.5,2.83,1.24],[5.85,2.83,1.24],[5.85,2.83,2],[.5,2.83,2]],'#f0f0e72e',.8);q([[.5,1.58,2],[5.85,1.58,2],[5.85,2.83,2],[.5,2.83,2]],'#fff7e729',.8);for(const x of [.5,3.17,5.85])d.line(p(x,2.83,1.2),p(x,2.83,2),.9);
 cube(6,1.72,1.19,1.54,.82,.76,'#6f83a7');cube(6.02,2.5,1.25,1.5,.25,.09);for(const x of [6.25,6.95]){const a=p(x,2.63,1.45);cup(d,...a,.55,f);d.line(p(x,2.56,1.83),p(x,2.56,1.55),1.6);}
 for(let i=0;i<5;i++){const a=p(6.15+i*.25,1.97,2.12);cup(d,...a,.3);}cube(7.78,1.81,1.2,.5,.56,.44,'#b9c2cb');cube(7.76,1.8,1.68,.53,.55,.44,'#9aabc3');
 cube(9.7,.2,0,1.05,.75,2.77);wall('back',0,0,0,0);q([[9.79,.96,.3],[10.66,.96,.3],[10.66,.96,2.53],[9.79,.96,2.53]],'#aab9c9',.8);
 for(let row=0;row<5;row++){for(let j=0;j<4;j++){let a=p(9.88+j*.19,.98,.45+row*.4);d.rect(a[0],a[1]-8,3,8,PAPER,.5);d.line([a[0]+1,a[1]-10],[a[0]+1,a[1]-8],.7);}d.line(p(9.8,.98,.33+row*.4),p(10.65,.98,.33+row*.4),.6);}d.line(p(10.6,.99,.9),p(10.6,.99,1.65),1.5);
 cube(.03,4.95,1.56,.4,2.25,.09);for(let i=0;i<8;i++)cube(.08,5.01+i*.27,1.65,.22,.2,.39,i%2?'#b4c0d0':'#dfceb0');
 cube(8.58,1.98,.88,.65,.6,.31,PALE);cube(8.6,2,1.22,.57,.38,.35,'#b1bdcc');for(let i=0;i<3;i++)cube(8.64+i*.19,1.62,1.12,.12,.12,.35,'#c4cbd1');
 const chair=(x,z)=>{cube(x,z,.58,.7,.65,.08,'#c99464');for(const dx of [0,.7])for(const dz of [0,.65])d.line(p(x+dx,z+dz,0),p(x+dx,z+dz,.6),.9);q([[x,z,.86],[x+.7,z,.86],[x+.7,z,1.26],[x,z,1.26]],'#d9a675',.8);for(const dx of [0,.7])d.line(p(x+dx,z,.58),p(x+dx,z,1.3),.8);};
 const table=(x,z)=>{for(const dx of [0,1.6])for(const dz of [0,1])d.line(p(x+dx,z+dz,0),p(x+dx,z+dz,1.05),1);cube(x-.08,z-.08,1.06,1.76,1.16,.08,'#ddb07c');const a=p(x+.55,z+.5,1.28);cup(d,...a,.55);};
 const sideChair=(x,z,back)=>{cube(x,z,.58,.65,.7,.08,'#c99464');for(const dx of [0,.65])for(const dz of [0,.7])d.line(p(x+dx,z+dz,0),p(x+dx,z+dz,.6),.9);const bx=back==='west'?x:x+.65;q([[bx,z,.86],[bx,z+.7,.86],[bx,z+.7,1.26],[bx,z,1.26]],'#d9a675',.8);for(const dz of [0,.7])d.line(p(bx,z+dz,.58),p(bx,z+dz,1.3),.8);};
 chair(3.55,4.22);sideChair(2.45,5.2,'west');chair(4.58,6.57);table(3.3,5.05);sideChair(5.12,5.25,'east');
 chair(7.35,4.18);sideChair(6.25,5.17,'west');chair(8.45,6.55);table(7.1,5.02);sideChair(8.92,5.2,'east');
 if(served){let a=p(4.15,5.6,1.29);d.oval(a[0],a[1]+4,14,5,PAPER,.7);if(!dining||mealProgress<.95)bread(d,a[0]-10,a[1]-4,20,.55,dining?Math.floor(mealProgress*3):0);else for(let i=0;i<4;i++)d.oval(a[0]-6+i*4,a[1]+2,1,.7,INK,0);}
 d.line(p(.2,2.25,4.6),p(8.8,.65,4.6),.6);for(let i=0;i<4;i++){let a=p(.5+i*2.2,2.2-i*.35,4.48);flag(d,a[0],a[1],13,22);let b=p(1.3+i*2.2,2.2-i*.35,4.57);d.oval(b[0],b[1],1.5,2,f%28<14?'#dec898':PAPER,.5);}
 wall('left',7.25,1.31,.64,.74,PALE);const map=p(0,7.5,1.72);d.oval(...map,3,2,PAPER,.6);
 // Pendant lamps over the tables and counter: soft cream by day, glowing at night.
 const lit=currentPhase()==='night'||currentPhase()==='dusk';
 for(const [lx,lz] of [[4.1,5.55],[7.9,5.52],[3.2,2.2],[6.4,2.2]]){const top=p(lx,lz,4.5),b=p(lx,lz,3.05);d.line(top,b,.6);d.poly([[b[0]-9,b[1]+5],[b[0]-5,b[1]-2],[b[0]+5,b[1]-2],[b[0]+9,b[1]+5]],lit?'#ffe2a0':'#f7efe0',.9);d.oval(b[0],b[1]+5,9,2.4,lit?'#fff3c8':'#efe2c8',.7);light(b[0],b[1]+6,lz>4?46:40);const fl=p(lx,lz,1.1);light(fl[0],fl[1],62);}
 const anchors={menu:p(4.85,0,3.15),football:p(0,4.25,3.4),coffee:p(7.1,5.02,1.15),map:p(0,7.5,1.92),boss:[boss[0]+30,boss[1]-34]};
 if(action){let a=anchors[action]||anchors.boss;for(let i=0;i<3;i++)d.line([a[0]-12+i*10,a[1]-7-(f+i*3)%12],[a[0]-10+i*10,a[1]-12-(f+i*3)%12],.8);}
 return anchors;
}
function windowRoom(d,x,y,w,h){
 d.rect(x-5,y-5,w+10,h+12,PALE,1);d.rect(x,y,w,h,'#d9dfe0',1);for(let i=0;i<5;i++){let bx=x+6+i*(w-12)/5,bh=37+i*8%28;d.rect(bx,y+h-bh,30,bh,'#d9d3c2',.5);for(let j=0;j<3;j++)for(let k=0;k<3;k++)d.rect(bx+4+j*8,y+h-bh+6+k*11,3,5,'#a7b7c8',.3);}d.line([x+w/2,y],[x+w/2,y+h],2);d.line([x,y+h*.4],[x+w,y+h*.4],1.6);d.rect(x-8,y+h,w+16,5,PAPER,.9);d.line([x+13,y+9],[x+44,y+h-9],.7,'#fff6e5');
}
function frontGlass(d,x,y,w,h){
 // The café's own front: slate-blue frames, the street and parked cars beyond.
 d.rect(x-6,y-6,w+12,h+14,'#3a5a93',1.2);d.rect(x,y,w,h,'#d3dbe0',1);
 d.rect(x,y+h*.52,w,h*.48,'#c2c8cc',0);d.rect(x+4,y+8,w*.55,h*.5,'#d9c9b4',.5);for(let i=0;i<3;i++)d.rect(x+12+i*30,y+18,18,24,'#bfc7cf',.4);
 d.poly([[x+18,y+h-14],[x+30,y+h-30],[x+84,y+h-30],[x+98,y+h-16],[x+98,y+h-8],[x+16,y+h-8]],'#5c6276',.8);d.oval(x+34,y+h-8,6,6,'#2a2e42',0);d.oval(x+84,y+h-8,6,6,'#2a2e42',0);d.rect(x+38,y+h-28,22,10,'#c9d3dc',.4);
 d.poly([[x+120,y+h-12],[x+132,y+h-26],[x+188,y+h-26],[x+204,y+h-12],[x+204,y+h-6],[x+118,y+h-6]],'#8e98a8',.8);d.oval(x+134,y+h-6,5,5,'#2a2e42',0);d.oval(x+188,y+h-6,5,5,'#2a2e42',0);
 d.line([x+w*.55,y],[x+w*.55,y+h],2.2,'#3a5a93');d.line([x,y+h*.2],[x+w,y+h*.2],1.6,'#3a5a93');
 d.rect(x,y,w,h*.12,'#24366c',.8);d.line([x+4,y+h*.1],[x+w-4,y+h*.1],.6,'#efe3bb80');
 d.rect(x+6,y+h*.24,30,20,'#2f9c5a',.6);d.text('EXIT',x+21,y+h*.24+13,6,'#ffffff',0,'center');
 d.line([x+16,y+26],[x+44,y+h-20],.7,'#ffffff90');d.rect(x-10,y+h+8,w+20,6,'#c49a6c',.9);
}
function vignette(g,{view='counter',time=0,progress=0,reaction=false,postcardOff=false}={}){
 const d=beginDrawing(g),f=frameOf(time);d.rect(0,0,640,420,'#f0e2c9',0);for(let i=0;i<18;i++)d.line([i*39,305],[i*39+3,420],.45,'#17307f2d');
 if(view==='counter'){
  const BOARD='#1f3b8c',FRAMEW='#8a5d3b',CHALK='#f4efe2',RED='#b4483c';
  // Cream wall and ceiling line.
  d.rect(0,0,640,300,'#efe4cf',0);d.line([0,14],[640,14],.8,'#17307f40');
  // Three blue menu boards from the café's own blackboards, lettered with room to breathe.
  const TOP=26,H=148;
  const board=(x,w,blocks)=>{
   d.rect(x-4,TOP-4,w+8,H+8,FRAMEW,1);d.rect(x,TOP,w,H,BOARD,.8);
   g.save();g.fillStyle=CHALK;if('letterSpacing' in g)g.letterSpacing='0px';let y=TOP+13;
   for(const [kind,a,b2] of blocks){
    if(kind==='h'){g.font="600 10px 'IU Serif', Georgia, serif";if('letterSpacing' in g)g.letterSpacing='.8px';g.fillText(a,x+7,y,w-14);if('letterSpacing' in g)g.letterSpacing='0px';
     g.strokeStyle='#f4efe266';g.lineWidth=.5;g.beginPath();g.moveTo(x+7,y+2.6);g.lineTo(x+w-7,y+2.6);g.stroke();y+=12.4;}
    else if(kind==='i'){// numbered panino: name on one line, filling beneath
     const [name,fill]=b2.split(' · ');
     g.font="600 7.6px 'IU Serif', Georgia, serif";g.fillText(a,x+7,y+3);g.font="600 6.6px 'IU Serif', Georgia, serif";if('letterSpacing' in g)g.letterSpacing='.4px';g.fillText(name,x+17,y,w-24);if('letterSpacing' in g)g.letterSpacing='0px';
     g.font="400 5.9px 'IU Serif', Georgia, serif";g.fillText(fill,x+17,y+6.2,w-24);y+=13.1;}
    else if(kind==='l'){g.font="400 7.2px 'IU Serif', Georgia, serif";g.fillText(a,x+9,y,w-16);y+=10.2;}
    else if(kind==='gap'){y+=3;}
   }
   g.restore();
  };
  board(84,150,[
   ['h','PANINI ITALIANI'],
   ['i','1','ITALIA · Parma ham + mozzarella'],
   ['i','2','CAMPAGNOLO · aubergines, sun-dried tomatoes, artichoke'],
   ['i','3','COTOLETTA · chicken escalope + salad'],
   ['i','4','PESCATORE · insalata di mare + salad'],
   ['i','5','PICCANTE · spicy salame, pecorino + salad'],
   ['i','6','BONDOLA · mortadella, cheese + salad'],
   ['i','7','BARESE · tuna, mozzarella + salad'],
   ['i','8','PUGLIA · 1 cheese + aubergines, tomatoes or artichoke'],
   ['i','9','VENEZIANO · pancetta, dolcelatte + salad']
  ]);
  g.save();g.fillStyle=CHALK;g.font="400 4.8px 'IU Serif', Georgia, serif";g.textAlign='right';g.fillText('TAKE AWAY · EAT IN',227,TOP+11);g.restore();
  board(245,150,[
   ['h','HOT FOOD'],
   ['l','Vegetable or tomato soup'],['l','Meat or vegetable lasagne'],['l','Pasta of the day'],['l','Melanzane alla parmigiana'],['l','Arancine di riso'],
   ['gap'],['h','LARGE SALADS'],
   ['l','Insalata di pollo · vegetariana'],['l','Insalata di mare · affettato misto'],['l','Antipasto grande'],
   ['gap'],['l','Dolci · ask staff what’s available']
  ]);
  board(406,150,[
   ['h','BREAKFASTS'],
   ['l','Scrambled eggs on toast'],['l','Parma ham + scrambled eggs'],['l','Italian · vegetarian breakfast'],
   ['gap'],['h','HOT DRINKS'],
   ['l','Espresso · doppio'],['l','Cappuccino · grande · doppio'],['l','Caffelatte · cioccolata calda'],['l','Tea · Earl Grey · camomile · mint'],['l','Croissant · Danish · cantucci'],['l','Gelati · spremuta d’arancia']
  ]);
  // Fairy-light wire over the boards, the food-allergy card.
  g.save();g.strokeStyle='#17307f70';g.lineWidth=.6;g.beginPath();g.moveTo(80,19);for(let x=80;x<560;x+=12)g.quadraticCurveTo(x+6,23,x+12,19);g.stroke();g.restore();
  d.rect(482,184,52,22,'#faf7ef',.6);g.save();g.fillStyle=INK;g.textAlign='center';g.font="500 4.6px 'IU Serif', Georgia, serif";g.fillText('FOOD ALLERGIES',508,193);g.fillText('AND INTOLERANCES',508,200);g.restore();
  // Football shirts: the azzurri on the left, Napoli blues and a yellow away kit on the right.
  const shirt=(cx,cy,w,c,label)=>{d.line([cx-4,cy-6],[cx,cy-11],.6);d.line([cx+4,cy-6],[cx,cy-11],.6);d.poly([[cx-w,cy],[cx-w*.35,cy-5],[cx,cy-2],[cx+w*.35,cy-5],[cx+w,cy],[cx+w*.82,cy+w*.55],[cx+w*.55,cy+w*.42],[cx+w*.55,cy+w*1.6],[cx-w*.55,cy+w*1.6],[cx-w*.55,cy+w*.42],[cx-w*.82,cy+w*.55]],c,1);if(label)d.text(label,cx,cy+w*.8,6,'#f4efe2',0,'center');};
  shirt(52,52,24,'#2f57c2','');d.rect(60,58,6,7,'#f4efe2',.4);
  shirt(572,48,20,'#8fbfe8','MSC');shirt(618,44,18,'#e6c64a','');
  d.poly([[548,40],[556,36],[596,112],[588,116]],'#8fbfe8',.8);d.text('CLUB NAPOLI',570,74,5,INK,1.08,'center');
  // Italian flag bunting across the ceiling, tricolore in soft pastel.
  d.line([0,3],[640,9],.7);for(let i=0;i<11;i++){const fx=8+i*58,fy=3.6+i*.55;d.rect(fx,fy,6,13,'#8fae8f',.5);d.rect(fx+6,fy,6,13,'#f7f3ea',.5);d.rect(fx+12,fy,6,13,'#cf7e6e',.5);}
  // Back shelving: Balocco boxes and a wire rack with a NAPOLI FANS scarf.
  d.rect(6,212,84,4,'#c9ccd3',.6);for(let i=0;i<3;i++){d.rect(10+i*26,193,22,19,'#c54a3e',.7);d.line([14+i*26,200],[28+i*26,200],1.1,'#f7f3ea');d.oval(21+i*26,206,2.8,1.8,'#e9c56a',0);}
  d.rect(110,186,60,3,'#c9ccd3',.5);d.line([110,186],[110,240],.6);d.line([170,186],[170,240],.6);
  d.poly([[96,204],[190,200],[192,214],[98,218]],'#24366c',.8);d.text('NAPOLI FANS',144,212,6.4,'#f4efe2',-.04,'center');
  // A meat slicer at the right end of the back counter.
  d.oval(588,214,18,18,'#d6d9de',1);d.oval(588,214,6,6,'#b7bcc4',.6);d.poly([[566,226],[612,226],[618,240],[560,240]],'#c9ccd3',.9);
  // The owner behind the counter.
  drawChef(g,322-48*1.25,150,{scale:1.25,frame:f,pose:reaction?'present':'idle'});
  // Deli counter: a softly curved glass case on a base of exactly the same width.
  const L=70,R=570;
  d.rect(L-6,236,R-L+12,8,'#e9ebee',1);
  d.rect(L,244,R-L,92,'#e6edf0',0);
  // Food inside: salami, mortadella, a cheese wheel, a melon, jars of peppers.
  for(let i=0;i<4;i++){d.oval(118+i*34,312,15,6,'#a1514a',.8);for(let k=-2;k<3;k++)d.line([110+i*34+k*4,307],[114+i*34+k*4,317],.35,'#f2d6cf');}
  d.oval(288,306,18,13,'#e3a49a',1);d.oval(288,306,11,8,'#efc3b9',.5);
  d.oval(350,312,20,8,'#e9d7a4',1);d.oval(350,309,20,6,'#f1e5bf',.6);
  d.oval(404,314,12,9,'#e3c44a',1);d.line([396,311],[401,309],.6,'#fff2b0');
  for(let i=0;i<3;i++){d.rect(440+i*18,300,14,22,'#b9473b',.8);d.rect(440+i*18,297,14,4,'#e9ebee',.6);}
  d.oval(228,286,9,5,'#c8524a',.8);d.oval(380,284,9,5,'#c8524a',.8);
  d.rect(L,322,R-L,10,'#d8dde2',.6);
  // The glass: a big rounded curve on the front, bowed at each end like the real case.
  g.save();g.beginPath();g.moveTo(L,336);g.lineTo(L,262);g.quadraticCurveTo(L,244,L+22,244);g.lineTo(R-22,244);g.quadraticCurveTo(R,244,R,262);g.lineTo(R,336);g.closePath();
  g.fillStyle='#dfeef42e';g.fill();g.strokeStyle=INK;g.lineWidth=1.4;g.stroke();g.restore();
  d.line([L+6,262],[R-6,262],.6,'#17307f60');
  for(const x of [L+30,R-40])d.line([x,250],[x+18,326],.8,'#ffffffaa');
  d.line([L+60,252],[L+74,320],.5,'#ffffff88');
  d.rect(L+250-1,244,2,92,'#17307f30',0);
  // Base: a white band and the red front panel, same width as the glass.
  d.rect(L,336,R-L,16,'#f3f1ec',1.1);d.rect(L,352,R-L,52,RED,1.2);d.line([L+4,356],[R-4,356],.6,'#ffffff55');
  d.rect(L+2,404,R-L-4,6,'#3a3d4c',0);
  // Order slip taped to the glass.
  d.rect(452,250,32,26,'#faf7ef',.6);for(let i=0;i<4;i++)d.line([456,256+i*5],[480,256+i*5],.4,'#17307f80');
  light(160,44,120);light(320,44,120);light(482,44,120);light(320,290,170);light(322,210,70);
  d.rect(103,362,40,20,'#faf7ef',.7);d.text('grazie!',123,376,10,INK,-.03,'center');
  return {};
 }
 frontGlass(d,30,26,206,160);d.line([0,243],[640,243],1);d.rect(0,290,640,130,'#e2cfad',0);for(let row=0;row<6;row++)for(let col=-2;col<17;col++){let x=col*47+row*9,y=290+row*23;d.poly([[x,y],[x+45,y],[x+54,y+22],[x+9,y+22]],(row+col)%2?'#c4cad0':PAPER,.4);}
 d.rect(22,192,222,7,PALE,.7);plant(d,246,221,.65);d.rect(65,217,151,21,'#afb9ca',1);for(let x=78;x<210;x+=24)d.line([x,220],[x,236],.5);for(const x of [74,209])d.line([x,239],[x,306],1.6);d.line([78,263],[207,263]);
 // Original hand-sketched wall map; its rectangle matches the clickable overlay.
 d.rect(333,47,262,195,PALE,1.6);d.rect(339,53,250,183,'#dcc6a1',.6);d.rect(353,68,100,139,PAPER,.9);d.rect(358,73,90,124,'#c7d5da',.5);
 d.poly([[386,84],[401,86],[401,105],[412,118],[409,132],[422,142],[418,152],[405,148],[396,135],[385,126],[382,107]],PAPER,.9);d.poly([[412,153],[426,159],[419,164],[405,160]],PAPER,.7);flag(d,392,60,18,21);d.oval(399,66,2,2,INK,0);d.text('Italia, con amore',363,191,9,INK,-.02);
 // The "Un piccolo mondo." card is the swinging postcard (app/visit-vignette.tsx draws it while it swings); its pin stays.
 if(postcardOff)d.oval(518,80,2.5,2.5,INK,0);else{d.rect(470,76,96,58,PAPER,.8);d.text('Un piccolo',478,94,13,INK,-.04);d.text('mondo.',483,112,16,INK,.02);}d.rect(472,149,91,61,'#e5dbc4',.8);bread(d,483,177,66,1);d.text('Buon appetito!',480,202,12,INK,-.03);
 d.poly([[30,258],[274,258],[369,420],[106,420]],PAPER,1.5);d.hatch([[30,262],[106,420],[115,420],[36,262]],4);d.poly([[333,277],[566,277],[630,420],[403,420]],PAPER,1.3);d.line([24,258],[277,258],1.4);d.line([329,277],[568,277],1.4);
 d.oval(178,284,61,16,PAPER,1);if(progress<.95)bread(d,139,275,78,1.45,Math.floor(progress*3));else for(let i=0;i<7;i++)d.oval(151+i*8,284+(i%3)*2,1.5,.8,INK,0);cup(d,279,265,2.2,f);d.line([104,277],[121,318],1.3);for(let i=0;i<4;i++)d.line([101+i*3,273],[105+i*3,284],.6);d.line([243,275],[229,318],1.3);d.line([246,272],[239,290],2);
 d.rect(399,356,130,48,'#e9ddc7',.6);d.text('La dolce pausa.',414,376,19,INK,-.025);d.text('Take your time.',420,393,12,INK,.02);
 light(180,250,150);light(462,140,120);light(279,250,60);
 return {board:[333,47,262,195],postcard:[470,76,96,58]};
}
export function drawCafe(g,options={}) { lights=[];const anchors=options.inside?interior(g,options):exterior(g,options);finishDrawing(g,lights);return anchors; }
export function drawVisitVignette(g,options={}) { lights=[];const anchors=vignette(g,options);finishDrawing(g,lights);return anchors; }

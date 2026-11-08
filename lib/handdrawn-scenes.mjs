import {beginDrawing,finishDrawing,INK,PAPER,PALE} from './drawing-kit.mjs';
import {drawChef} from './chef-art.mjs';

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
 // Neighbouring sash windows, brickwork, broad pavement and the blue awning.
 d.rect(0,0,640,355,'#e7d6ba',0);d.rect(108,0,402,355,'#efe2cb',0);
 for(let y=12,row=0;y<345;y+=13,row++)for(let x=(row%2?-13:4);x<640;x+=34){if(x>105&&x<510&&y>130)continue;d.line([x,y],[x+27,y+Math.sin(x)*.4],.45,'#7e80945c');d.line([x+27,y],[x+27,y+10],.4,'#7e809438');}
 d.line([107,0],[107,354],1.5);d.line([510,0],[510,354],1.5);d.rect(108,119,402,11,PALE,.8);
 windowFront(d,156,24,75,80);windowFront(d,361,24,75,80);windowFront(d,24,120,55,74);windowFront(d,550,68,53,72);windowFront(d,550,195,53,69);
 d.rect(13,246,78,97,'#d5dce0',1.3);d.line([52,246],[52,343],1.1);d.poly([[0,222],[105,222],[116,240],[-8,240]],PAPER,1);for(let i=0;i<7;i++)d.line([i*17,222],[i*17+10,239],4,'#2c3e832d');
 d.rect(114,134,384,46,PAPER,1.5);d.rect(119,139,374,36,null,.55);d.text('Italia Uno',305,164,35,INK,-.018,'center');d.text('91',126,152,11);d.text('paninoteca · caffè · un piccolo mondo',306,176,9,INK,.005,'center');
 d.rect(117,206,370,139,INK,1);d.rect(123,213,218,125,'#ddd1b6',1);d.rect(350,213,127,126,'#aaaeb0',1);
 for(const x of [126,236]){d.rect(x,220,100,117,'#e9d2aa',.8);d.line([x+3,265],[x+96,265]);d.line([x+3,305],[x+96,305],.8);d.line([x+50,220],[x+50,337],1.4);d.line([x+8,231],[x+33,281],.8,'#fff8df');d.line([x+13,231],[x+38,281],.6,'#fff8df');for(let i=0;i<4;i++)d.rect(x+8+i*21,286,13,18,['#b9c0c7','#d7bc94','#c3bead','#a4aebf'][i],.55);cup(d,x+25,318,1.2);}
 d.rect(359,222,69,116,'#d7c7a9',.9);d.rect(436,221,34,116,'#d7dfe0',1);d.line([437,220],[437,339],1.4);d.line([445,274],[445,290],2);d.line([444,275],[444,288],.6,PAPER);
 d.poly([[110,184],[500,184],[518,211],[92,211]],'#7385ad',1.4);d.rect(92,211,426,22,INK,1.2);for(let i=0;i<17;i++)d.line([115+i*23,185],[103+i*23,210],.65,'#e7e6db88');
 d.text('SANDWICH BAR',112,226,10,PAPER);d.text('EAT IN OR TAKE AWAY',493,226,10,PAPER,0,'right');d.line([95,231],[515,231],1.3,PAPER);
 d.rect(370,236,36,15,PAPER,.7);d.text('aperto',388,247,11,INK,-.04,'center');flag(d,457,146,15,20);
 d.rect(0,354,640,66,'#e9d9bd',0);for(let y=357,row=0;y<413;y+=15,row++){d.line([0,y],[640,y],.55,'#2c3e8340');for(let x=(row%2?-25:0);x<640;x+=57)d.line([x,y],[x+2,y+14],.5,'#2c3e8336');}d.rect(0,411,640,9,'#b2b6bd',0);d.line([0,411],[640,411],1);
 const chair=(x,y)=>{d.rect(x-11,y-28,23,17,PAPER,1);d.line([x-11,y-10],[x-12,y+20]);d.line([x+12,y-10],[x+14,y+20]);d.line([x-11,y-28],[x-10,y+20]);d.line([x+12,y-28],[x+10,y+20]);d.line([x-12,y+1],[x+14,y+1],2);d.line([x-10,y+1],[x+10,y+19],.7);};chair(171,344);chair(277,353);
 d.poly([[190,315],[251,315],[267,327],[203,327]],PAPER,1);for(const x of [203,260])d.line([x,328],[x,369],1.4);cup(d,231,315,1.3,f);
 d.poly([[310,302],[342,302],[349,367],[302,367]],PALE,1);d.poly([[314,307],[338,307],[343,351],[307,351]],PAPER,1);d.text('Caffè',325,324,12,INK,-.04,'center');d.text('& panini',325,340,10,INK,.035,'center');d.line([303,367],[300,373]);d.line([347,367],[350,372]);
 plant(d,82,350,1.2);plant(d,509,350,1);
 // Fictional host is sized to the doorway; no decorative visitor character.
 d.oval(418,361,20,4,'#2c3e8318',0);drawChef(g,418-48*102/128,360-126*102/128,{scale:102/128,frame:f,pose:'wave'});
 for(const x of [552,595])d.oval(x,380,14,14,null,1.1);d.poly([[552,380],[565,354],[579,380]],null,1);d.poly([[565,354],[585,354],[579,380]],null,1);d.line([585,354],[595,380]);d.line([584,354],[588,343]);d.line([583,343],[594,343]);d.line([565,354],[561,346]);d.line([555,346],[568,346],2);
 d.line([617,140],[617,360],3);d.rect(611,119,13,22,'#eddfba',1);d.poly([[607,119],[617,109],[628,119]],PAPER,1);d.line([607,143],[628,143]);
 return {welcome:[339,255]};
}
function interior(g,{time=0,served=false,action='',mealProgress=0,dining=false}){
 const d=beginDrawing(g),f=frameOf(time),p=(x,z,y=0)=>[284+(x-z)*25,154+(x+z)*12.5-y*29];
 const q=(a,fill,width=1)=>d.poly(a.map(v=>p(...v)),fill,width);
 const cube=(x,z,y,w,dep,h,fill=PAPER)=>{q([[x,z,y+h],[x+w,z,y+h],[x+w,z+dep,y+h],[x,z+dep,y+h]],fill,.8);const front=[[x,z+dep,y],[x+w,z+dep,y],[x+w,z+dep,y+h],[x,z+dep,y+h]].map(v=>p(...v));d.poly(front,fill,.9);d.hatch(front,6,'#2c3e831a');q([[x+w,z,y],[x+w,z+dep,y],[x+w,z+dep,y+h],[x+w,z,y+h]],PALE,.9);};
 const wall=(face,u,y,w,h,c=PAPER)=>face==='back'?q([[u,0,y],[u+w,0,y],[u+w,0,y+h],[u,0,y+h]],c,.8):q([[0,u,y],[0,u+w,y],[0,u+w,y+h],[0,u,y+h]],c,.8);
 q([[0,0,-.2],[11,0,-.2],[11,8,-.2],[0,8,-.2]],PALE,1.3);cube(0,0,-.2,11,8,.2);
 for(let x=0;x<11;x++)for(let z=0;z<8;z++)q([[x,z,0],[x+1,z,0],[x+1,z+1,0],[x,z+1,0]],(x+z)%2?'#bbc3d1':PAPER,.3);
 q([[0,0,0],[0,8,0],[0,8,4.5],[0,0,4.5]],'#eee2cb',1.25);q([[0,0,0],[11,0,0],[11,0,4.5],[0,0,4.5]],'#f5ebd7',1.25);
 for(let y=.1;y<1.9;y+=.42){d.line(p(0,0,y),p(11,0,y),.4,'#2c3e8340');for(let x=0;x<11;x++)d.line(p(x,0,y),p(x,0,y+.4),.35,'#2c3e8340');}
 const board=(x,title,rows)=>{wall('back',x,2.05,2.95,2.2,INK);let a=p(x+.1,0,4.12);g.save();g.transform(1,.5,0,1,...a);d.text(title,0,0,10,PAPER);d.line([0,4],[65,4],.5,PAPER);rows.forEach((row,i)=>{d.text(row,0,15+i*6,6.2,PAPER);});g.restore();};
 board(.3,'Panini italiani',['Italia','Campagnolo','Cotoletta','Pescatore','Piccante','Bondola','Barese','Puglia','Veneziano']);board(3.45,'Oggi in cucina',['Lasagne','Pasta del giorno','Parmigiana','Arancini','Insalate','Panini','Dolci']);board(6.62,'Caffè e colazione',['Uova sul pane','Colazione italiana','Vegetariana','Espresso','Cappuccino','Caffellatte','Tè e cioccolata']);
 const shirt=(face,u,y,col)=>{wall(face,u,y,.62,.86,col);wall(face,u-.15,y+.53,.18,.3,col);wall(face,u+.6,y+.53,.18,.3,col);wall(face,u+.2,y+.73,.2,.1,PAPER);for(let j=0;j<3;j++)wall(face,u+.1+j*.18,y+.08,.035,.57,PAPER);};
 [2.7,3.8,4.9,6].forEach((u,i)=>shirt('left',u,3.25,i%2?'#bcc4d0':'#8295b6'));
 [1.3,4,6.7].forEach((u,i)=>shirt('back',u,4.18,i%2?'#d1c6b0':'#95a7c1'));
 const tv=(face,u,y,w,h)=>{wall(face,u,y,w,h,INK);wall(face,u+.07,y+.07,w-.14,h-.14,'#bec9c9');wall(face,u+w/2,y+.1,.025,h-.2,PAPER);for(let i=0;i<5;i++)wall(face,u+.18+(i*.17+(f%20)*.007)%(w-.3),y+.2+(i*.11)%(h-.3),.04,.07,INK);};tv('left',1,3.3,1.25,.9);tv('back',9.9,3,1.02,.9);
 const ck=p(0,5.85,3.57);d.oval(...ck,7,8,PAPER,.9);d.line(ck,[ck[0],ck[1]-5]);d.line(ck,[ck[0]+4,ck[1]+2]);
 const boss=p(8.9,1.15,0);d.oval(boss[0],boss[1],16,4,'#2c3e831b',0);drawChef(g,boss[0]-28.5,boss[1]-74.8,{scale:76/128,frame:f});
 cube(.55,1.6,0,7.75,1.2,1.15,'#8a9bb9');for(let i=0;i<12;i++){d.line(p(.7+i*.6,2.81,.15),p(.7+i*.6,2.81,.92),.55,'#2c3e8370');}q([[.55,2.81,.93],[8.3,2.81,.93],[8.3,2.81,1.04],[.55,2.81,1.04]],PAPER,.6);
 for(let i=0;i<7;i++){cube(.65+i*.72,1.73,1.18,.62,.85,.06,PAPER);for(let j=0;j<4;j++){const a=p(.8+i*.72+(j%2)*.22,1.86+Math.floor(j/2)*.25,1.26);if(i<2)bread(d,a[0]-4,a[1],8,.3);else d.oval(a[0],a[1],3,1.7,['#9aabc3','#cdb58d','#bac4c3'][i%3],.5);}}
 q([[.5,2.83,1.24],[5.85,2.83,1.24],[5.85,2.83,2],[.5,2.83,2]],'#f0f0e72e',.8);q([[.5,1.58,2],[5.85,1.58,2],[5.85,2.83,2],[.5,2.83,2]],'#fff7e729',.8);for(const x of [.5,3.17,5.85])d.line(p(x,2.83,1.2),p(x,2.83,2),.9);
 cube(6,1.72,1.19,1.54,.82,.76,'#6f83a7');cube(6.02,2.5,1.25,1.5,.25,.09);for(const x of [6.25,6.95]){const a=p(x,2.63,1.45);cup(d,...a,.55,f);d.line(p(x,2.56,1.83),p(x,2.56,1.55),1.6);}
 for(let i=0;i<5;i++){const a=p(6.15+i*.25,1.97,2.12);cup(d,...a,.3);}cube(7.78,1.81,1.2,.5,.56,.44,'#b9c2cb');cube(7.76,1.8,1.68,.53,.55,.44,'#9aabc3');
 cube(9.7,.2,0,1.05,.75,2.77);wall('back',0,0,0,0);q([[9.79,.96,.3],[10.66,.96,.3],[10.66,.96,2.53],[9.79,.96,2.53]],'#aab9c9',.8);
 for(let row=0;row<5;row++){for(let j=0;j<4;j++){let a=p(9.88+j*.19,.98,.45+row*.4);d.rect(a[0],a[1]-8,3,8,PAPER,.5);d.line([a[0]+1,a[1]-10],[a[0]+1,a[1]-8],.7);}d.line(p(9.8,.98,.33+row*.4),p(10.65,.98,.33+row*.4),.6);}d.line(p(10.6,.99,.9),p(10.6,.99,1.65),1.5);
 cube(.03,4.95,1.56,.4,2.25,.09);for(let i=0;i<8;i++)cube(.08,5.01+i*.27,1.65,.22,.2,.39,i%2?'#b4c0d0':'#dfceb0');
 cube(8.58,1.98,.88,.65,.6,.31,PALE);cube(8.6,2,1.22,.57,.38,.35,'#b1bdcc');for(let i=0;i<3;i++)cube(8.64+i*.19,1.62,1.12,.12,.12,.35,'#c4cbd1');
 const chair=(x,z)=>{cube(x,z,.58,.7,.65,.08);for(const dx of [0,.7])for(const dz of [0,.65])d.line(p(x+dx,z+dz,0),p(x+dx,z+dz,.6),.9);q([[x,z,.86],[x+.7,z,.86],[x+.7,z,1.26],[x,z,1.26]],PAPER,.8);for(const dx of [0,.7])d.line(p(x+dx,z,.58),p(x+dx,z,1.3),.8);};
 const table=(x,z)=>{for(const dx of [0,1.6])for(const dz of [0,1])d.line(p(x+dx,z+dz,0),p(x+dx,z+dz,1.05),1);cube(x-.08,z-.08,1.06,1.76,1.16,.08,PAPER);const a=p(x+.55,z+.5,1.28);cup(d,...a,.55);};
 chair(3.55,4.22);chair(4.58,6.57);table(3.3,5.05);chair(7.35,4.18);chair(8.45,6.55);table(7.1,5.02);
 if(served){let a=p(4.15,5.6,1.29);d.oval(a[0],a[1]+4,14,5,PAPER,.7);if(!dining||mealProgress<.95)bread(d,a[0]-10,a[1]-4,20,.55,dining?Math.floor(mealProgress*3):0);else for(let i=0;i<4;i++)d.oval(a[0]-6+i*4,a[1]+2,1,.7,INK,0);}
 d.line(p(.2,2.25,4.6),p(8.8,.65,4.6),.6);for(let i=0;i<4;i++){let a=p(.5+i*2.2,2.2-i*.35,4.48);flag(d,a[0],a[1],13,22);let b=p(1.3+i*2.2,2.2-i*.35,4.57);d.oval(b[0],b[1],1.5,2,f%28<14?'#dec898':PAPER,.5);}
 wall('left',7.25,1.31,.64,.74,PALE);const map=p(0,7.5,1.72);d.oval(...map,3,2,PAPER,.6);
 const anchors={menu:p(4.85,0,3.15),football:p(0,4.25,3.4),coffee:p(7.2,2.85,2.15),map:p(0,7.5,1.92),boss:[boss[0]+40,boss[1]-20]};
 if(action){let a=anchors[action]||anchors.boss;for(let i=0;i<3;i++)d.line([a[0]-12+i*10,a[1]-7-(f+i*3)%12],[a[0]-10+i*10,a[1]-12-(f+i*3)%12],.8);}
 return anchors;
}
function windowRoom(d,x,y,w,h){
 d.rect(x-5,y-5,w+10,h+12,PALE,1);d.rect(x,y,w,h,'#d9dfe0',1);for(let i=0;i<5;i++){let bx=x+6+i*(w-12)/5,bh=37+i*8%28;d.rect(bx,y+h-bh,30,bh,'#d9d3c2',.5);for(let j=0;j<3;j++)for(let k=0;k<3;k++)d.rect(bx+4+j*8,y+h-bh+6+k*11,3,5,'#a7b7c8',.3);}d.line([x+w/2,y],[x+w/2,y+h],2);d.line([x,y+h*.4],[x+w,y+h*.4],1.6);d.rect(x-8,y+h,w+16,5,PAPER,.9);d.line([x+13,y+9],[x+44,y+h-9],.7,'#fff6e5');
}
function vignette(g,{view='counter',time=0,progress=0,reaction=false}={}){
 const d=beginDrawing(g),f=frameOf(time);d.rect(0,0,640,420,'#f0e2c9',0);for(let i=0;i<18;i++)d.line([i*39,305],[i*39+3,420],.45,'#2c3e832d');
 if(view==='counter'){
  windowRoom(d,32,41,169,141);d.rect(22,213,194,8,PALE,.8);for(let i=0;i<5;i++){d.rect(35+i*29,191,17,21,'#c3cbd2',.6);d.rect(35+i*29,187,17,4,PAPER,.5);d.text('olio',38+i*29,207,7);}plant(d,189,195,.43);
  d.line([238,24],[398,24],1);[250,304,358].forEach((x,i)=>{d.poly([[x-7,36],[x+6,29],[x+19,29],[x+33,36],[x+29,49],[x+23,45],[x+23,88],[x+1,88],[x+1,45],[x-3,49]],i%2?'#d8dcd9':'#9faec4',1);d.line([x+10,32],[x+10,86],.7,PAPER);d.line([x+16,32],[x+16,86],.7,PAPER);d.text('UNO',x+5,65,8);});
  d.rect(427,32,181,129,PALE,1.3);d.rect(432,37,171,119,INK,.8);d.text('Panini e caffè',444,56,18,PAPER,-.015);['Italia','Cotoletta','Piccante','Pasta del giorno','Espresso','Cappuccino'].forEach((s,i)=>{d.text(s,444,75+i*12,11,PAPER);d.line([562,74+i*12],[591,74+i*12],.4,PAPER);});
  for(let i=0;i<4;i++)flag(d,89+i*117,17,18,27+(i%2)*4);d.line([15,16],[621,22],.7);
  drawChef(g,253,136,{scale:1.45,frame:f,pose:reaction?'present':'idle'});
  d.rect(451,197,130,83,'#8498b6',1.5);d.rect(457,210,118,29,'#bac5cf',1);d.oval(471,224,8,7,PAPER,.7);d.line([471,224],[475,220],.6);for(let i=0;i<5;i++){d.oval(492+i*15,221,2,2,PAPER,.7);d.line([490+i*15,230],[494+i*15,230],1.4);}d.rect(453,266,129,10,PAPER,.8);for(let i=0;i<17;i++)d.line([459+i*7,269],[461+i*7,274],.5);
  for(let i=0;i<4;i++)cup(d,471+i*28,194,.75);cup(d,479,257,1.2,f);cup(d,545,257,1.2,f+7);d.rect(590,205,25,67,'#b4c0cc',1);d.rect(588,181,29,23,PALE,1);d.oval(602,184,14,4,PAPER,.8);
  d.poly([[16,288],[553,288],[632,320],[73,320]],PAPER,1.4);d.poly([[16,288],[73,320],[73,411],[16,378]],'#b5c0d1',1.2);const front=[[73,320],[632,320],[632,411],[73,411]];d.poly(front,'#a6b4cb',1.5);d.hatch(front,5,'#2c3e8326');for(let x=85;x<630;x+=25)d.rect(x,343,19,53,null,.6);d.line([75,333],[630,333],2,PAPER);
  for(let i=0;i<5;i++)d.poly([[78+i*88,281],[151+i*88,281],[160+i*88,302],[84+i*88,302]],PAPER,.9);bread(d,85,278,58,1);bread(d,175,277,52,1);
  for(let i=0;i<8;i++)d.oval(275+i%4*14,284+Math.floor(i/4)*9,6,4,'#c4b090',.6);for(let i=0;i<14;i++)d.poly([[358+i%5*12,283+Math.floor(i/5)*7],[362+i%5*12,276+Math.floor(i/5)*7],[368+i%5*12,281+Math.floor(i/5)*7],[366+i%5*12,288+Math.floor(i/5)*7]],'#bdc7c5',.5);for(let i=0;i<5;i++)d.rect(443+i*9,279,9,17,'#c9c2b4',.5);
  d.poly([[48,243],[504,243],[561,275],[76,275]],'#e4ece51a',.9);d.poly([[76,275],[561,275],[561,317],[76,317]],'#e4ece52c',.8);for(const x of [48,288,504])d.line([x,243],[x+28,317],1);d.line([76,317],[561,317],1.5);d.line([104,246],[128,305],.7,'#fff8e7');
  d.rect(103,342,31,23,PAPER,.7);d.text('grazie!',106,355,10,INK,-.03);return {};
 }
 windowRoom(d,30,30,203,149);d.line([0,243],[640,243],1);d.rect(0,290,640,130,'#e2cfad',0);for(let row=0;row<6;row++)for(let col=-2;col<17;col++){let x=col*47+row*9,y=290+row*23;d.poly([[x,y],[x+45,y],[x+54,y+22],[x+9,y+22]],(row+col)%2?'#c4cad0':PAPER,.4);}
 d.rect(22,192,222,7,PALE,.7);plant(d,246,221,.65);d.rect(65,217,151,21,'#afb9ca',1);for(let x=78;x<210;x+=24)d.line([x,220],[x,236],.5);for(const x of [74,209])d.line([x,239],[x,306],1.6);d.line([78,263],[207,263]);
 // Original hand-sketched wall map; its rectangle matches the clickable overlay.
 d.rect(333,47,262,195,PALE,1.6);d.rect(339,53,250,183,'#dcc6a1',.6);d.rect(353,68,100,139,PAPER,.9);d.rect(358,73,90,124,'#c7d5da',.5);
 d.poly([[386,84],[401,86],[401,105],[412,118],[409,132],[422,142],[418,152],[405,148],[396,135],[385,126],[382,107]],PAPER,.9);d.poly([[412,153],[426,159],[419,164],[405,160]],PAPER,.7);flag(d,392,60,18,21);d.oval(399,66,2,2,INK,0);d.text('Italia, con amore',363,191,9,INK,-.02);
 d.rect(470,76,96,58,PAPER,.8);d.text('Un piccolo',478,94,13,INK,-.04);d.text('mondo.',483,112,16,INK,.02);d.rect(472,149,91,61,'#e5dbc4',.8);bread(d,483,177,66,1);d.text('Buon appetito!',480,202,12,INK,-.03);
 d.poly([[30,258],[274,258],[369,420],[106,420]],PAPER,1.5);d.hatch([[30,262],[106,420],[115,420],[36,262]],4);d.poly([[333,277],[566,277],[630,420],[403,420]],PAPER,1.3);d.line([24,258],[277,258],1.4);d.line([329,277],[568,277],1.4);
 d.oval(178,284,61,16,PAPER,1);if(progress<.95)bread(d,139,275,78,1.45,Math.round(progress*4));else for(let i=0;i<7;i++)d.oval(151+i*8,284+(i%3)*2,1.5,.8,INK,0);cup(d,279,265,2.2,f);d.line([104,277],[121,318],1.3);for(let i=0;i<4;i++)d.line([101+i*3,273],[105+i*3,284],.6);d.line([243,275],[229,318],1.3);d.line([246,272],[239,290],2);
 d.rect(399,356,130,48,'#e9ddc7',.6);d.text('La dolce pausa.',414,376,19,INK,-.025);d.text('Take your time.',420,393,12,INK,.02);
 return {board:[333,47,262,195]};
}
export function drawCafe(g,options={}) { const anchors=options.inside?interior(g,options):exterior(g,options);finishDrawing(g);return anchors; }
export function drawVisitVignette(g,options={}) { const anchors=vignette(g,options);finishDrawing(g);return anchors; }

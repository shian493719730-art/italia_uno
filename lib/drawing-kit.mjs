import {currentPhase} from './daytime.mjs';
// Original pen-and-pastel tools: soft, rounded, chunky lines (cosy game style),
// with only a whisper of hand wobble so shapes read finished, not drafted.
export const INK='#17307f', PAPER='#f3e7cf', PALE='#e6d5b7', WASH='#d0d1ea';
const papers=new Map();
export function sketch(g) {
 const jitter=(x,y,n=0)=>Math.sin(x*1.73+y*2.19+n*4.13)*.22;
 // Chunkier, rounder strokes everywhere; hairlines are lifted to a soft minimum.
 const W=w=>w?Math.max(.7,w*1.45):0;
 const line=(a,b,width=1,color=INK)=>{
  g.save();g.strokeStyle=color;g.lineWidth=W(width);g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(...a);const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
  g.quadraticCurveTo(mx+jitter(mx,my),my+jitter(my,mx),...b);g.stroke();g.restore();
 };
 const poly=(pts,fill=null,width=1,color=INK)=>{
  g.save();g.beginPath();const first=pts[0];g.moveTo(...first);for(let i=1;i<=pts.length;i++){const a=pts[i-1],b=pts[i%pts.length],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;g.quadraticCurveTo(mx+jitter(mx,my)*.65,my+jitter(my,mx)*.65,...b);}g.closePath();
  if(fill){g.fillStyle=fill;g.fill();}if(width){g.strokeStyle=color;g.lineWidth=W(width);g.lineJoin='round';g.stroke();}
  g.restore();
 };
 // Rectangles get soft rounded corners, scaled to their size.
 const rect=(x,y,w,h,fill=null,width=1,color=INK)=>{
  const r=Math.max(0,Math.min(5,Math.abs(w)/4,Math.abs(h)/4));
  g.save();g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);
  if(fill){g.fillStyle=fill;g.fill();}if(width){g.strokeStyle=color;g.lineWidth=W(width);g.lineJoin='round';g.stroke();}g.restore();
 };
 const oval=(x,y,rx,ry,fill=null,width=1,color=INK,rot=0)=>{
  g.save();g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(width){g.strokeStyle=color;g.lineWidth=W(width);g.stroke();}g.restore();
 };
 const text=(str,x,y,size=12,color=INK,angle=0,align='left')=>{
  // Capitals and numbers read best as a printed sign; everything else is handwritten.
  const printed=size<9||/^[^a-z]*$/.test(str);
  const font=printed?`500 ${Math.max(7,size*.86)}px 'IU Serif', Georgia, serif`:`400 ${size>=24?size*.82:size*.8}px 'IU Brush', cursive`;
  g.save();g.translate(x,y);g.rotate(angle);g.fillStyle=color;g.font=font;g.textAlign=align;
  if(printed&&'letterSpacing' in g)g.letterSpacing=`${(size*.1).toFixed(1)}px`;
  g.fillText(str,0,0);g.restore();
 };
 const hatch=(pts,gap=5,color='#17307f26')=>{
  gap*=2.2;color='#17307f12';
  g.save();g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();
  const x=pts.map(p=>p[0]),y=pts.map(p=>p[1]),minX=Math.min(...x),maxX=Math.max(...x),minY=Math.min(...y),maxY=Math.max(...y);
  for(let z=minX-(maxY-minY);z<maxX;z+=gap)line([z,minY],[z+maxY-minY,maxY],.45,color);g.restore();
 };
 const steam=(x,y,frame)=>{g.save();g.strokeStyle='#17307f52';g.lineWidth=.8;for(let i=0;i<3;i++){let lift=(frame+i*7)%22;g.beginPath();g.moveTo(x+i*4,y-lift/4);g.bezierCurveTo(x-4+i*4,y-7-lift/4,x+5+i*4,y-11-lift/4,x+i*4,y-18-lift/4);g.stroke();}g.restore();};
 return {line,poly,rect,oval,text,hatch,steam};
}
export function beginDrawing(g) {
 const ratio=g.canvas.width/640;g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,640,420);g.imageSmoothingEnabled=true;
 if(!papers.has('paper')){const c=document.createElement('canvas');c.width=640;c.height=420;const p=c.getContext('2d');p.fillStyle=PAPER;p.fillRect(0,0,640,420);let n=8123;for(let i=0;i<11000;i++){n=(n*1664525+1013904223)>>>0;const x=(n>>>9)%640;n=(n*1664525+1013904223)>>>0;const y=(n>>>11)%420;p.fillStyle=i%3?'#6b503b09':'#fffaf337';p.fillRect(x,y,i%5===0?1.8:.7,.7);}papers.set('paper',c);}
 return sketch(g);
}
// Time-of-day light: a wash over everything drawn, then warm lamp glows at night.
const GRADE={dawn:['#fff1dc',.22],day:null,dusk:['#e9935f',.26],night:['#151d4e',.6]};
export function finishDrawing(g,lights=[]) {
 if(!papers.has('grain')){const c=document.createElement('canvas');c.width=640;c.height=420;const p=c.getContext('2d');let n=5041;for(let i=0;i<33000;i++){n=(n*1664525+1013904223)>>>0;const x=(n>>>9)%640;n=(n*1664525+1013904223)>>>0;const y=(n>>>11)%420;p.fillStyle=i%4?'#5448370d':'#fff9e938';p.fillRect(x,y,i%7===0?1.6:.7,.7);}papers.set('grain',c);}
 g.save();g.globalCompositeOperation='source-atop';g.drawImage(papers.get('grain'),0,0);
 const phase=currentPhase(),grade=GRADE[phase];
 if(grade){g.globalAlpha=grade[1];g.fillStyle=grade[0];g.fillRect(0,0,640,420);g.globalAlpha=1;}
 if(phase==='night'||phase==='dusk'){
  const k=phase==='night'?1:.45;
  for(const l of lights){
   if(l[0]==='rect'){// a lit pane of glass
    const [,x,y,w,h]=l;const pane=g.createLinearGradient(0,y,0,y+h);pane.addColorStop(0,`rgba(255,214,130,${.5*k})`);pane.addColorStop(1,`rgba(255,180,95,${.38*k})`);g.fillStyle=pane;g.beginPath();g.roundRect?g.roundRect(x,y,w,h,3):g.rect(x,y,w,h);g.fill();continue;}
   const [x,y,r=60]=l;const glow=g.createRadialGradient(x,y,0,x,y,r);glow.addColorStop(0,`rgba(255,226,160,${.7*k})`);glow.addColorStop(.3,`rgba(255,205,130,${.32*k})`);glow.addColorStop(1,'rgba(255,190,110,0)');g.fillStyle=glow;g.fillRect(x-r,y-r,r*2,r*2);}
 }
 if(phase==='dawn'){const sun=g.createLinearGradient(0,0,640,420);sun.addColorStop(0,'rgba(255,248,230,.28)');sun.addColorStop(1,'rgba(255,248,230,0)');g.fillStyle=sun;g.fillRect(0,0,640,420);}
 g.restore();
}

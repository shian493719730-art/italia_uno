import assert from 'node:assert/strict';
import {cameraLayout} from '../lib/scene-camera.mjs';
const close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} ≈ ${b}`);
const corners=[[68,8],[588,8],[68,413],[588,413]];
const inside=(camera,points,width=camera.worldWidth,height=camera.worldHeight)=>{
 for(const [x,y]of points){
  const sx=camera.x+x*camera.scale,sy=camera.y+y*camera.scale;
  assert(sx>=-1e-7&&sx<=width+1e-7,`x ${sx} outside ${width}`);
  assert(sy>=-1e-7&&sy<=height+1e-7,`y ${sy} outside ${height}`);
 }
};
for(const [width,height]of [[1280,650],[700,740],[390,470],[320,320]]){
 const c=cameraLayout({width,height,overview:true});
 close(c.worldWidth,width);close(c.worldHeight,height);inside(c,corners,width,height);
}
const portrait=cameraLayout({width:390,height:470});
const overview=cameraLayout({width:390,height:470,overview:true});
assert(portrait.scale>overview.scale,'portrait detail is actually larger than overview');
assert(portrait.worldWidth>390,'portrait detail provides horizontal exploration');
inside(portrait,corners);
// Actual full-room interaction anchors: menu, football, coffee, map, boss.
const anchors=[[405,123],[178,109],[393,217],[97,192],[478,232]];
inside(portrait,anchors);inside(overview,anchors);
for(const [width,height]of [[1280,650],[1024,600],[700,500]]){
 const c=cameraLayout({width,height});
 close(c.worldWidth,width);inside(c,corners,width,height);
}
for(const kind of ['street','table']){
 const tall=cameraLayout({width:390,height:720,kind});
 assert(tall.worldWidth<=390*1.8+1e-7,'portrait travel is capped');
 assert(tall.worldWidth>390,'portrait uses an enlarged scene');
 close(tall.worldHeight,720);
 const wide=cameraLayout({width:1280,height:600,kind});
 close(wide.worldWidth,1280);close(wide.worldHeight,600);
 if(kind==='street')assert(wide.scale*640>=1280-24-1e-7,'landscape street fills available width');
 // The table opens a little zoomed out on wide screens: at most 12% taller than fitting the height.
 else assert(wide.scale<=(600-24)/420*1.12+1e-7&&wide.scale*640<1280-24,'landscape table is zoomed out a bit');
}
const resized=cameraLayout({width:844,height:390});
assert(resized.worldWidth===844&&resized.scale!==portrait.scale,'resize recomputes a fitted landscape camera');
for(const args of [{},{width:0,height:0},{width:NaN,height:Infinity},{width:-2,height:-1},{width:2,height:3},{width:390,height:470,kind:'unknown'}]){
 const c=cameraLayout(args);for(const value of Object.values(c))assert(Number.isFinite(value),'all camera values are finite');
 assert(c.scale>0&&c.worldWidth>=1&&c.worldHeight>=1);
}
console.log('Scene camera passed: tight room overview, enlarged portrait exploration, reachable hotspots, landscape fit, capped street/table travel, resize and empty dimensions.');

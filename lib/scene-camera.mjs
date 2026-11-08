// Canvas and HTML hotspots share this camera. x/y are the native canvas origin
// inside a horizontally scrollable world; the world never adds vertical scroll.
const BOUNDS = {
 room: {x:68,y:8,width:520,height:405},
 street: {x:0,y:0,width:640,height:420},
 table: {x:0,y:0,width:640,height:420}
};
const dimension = value => Number.isFinite(value) && value > 0 ? Math.max(1,value) : 1;
const padding = (desired,size) => Math.min(desired,Math.max(0,(size-1)/2));

export function cameraLayout({width,height,kind='room',overview=false}={}) {
 const w=dimension(width),h=dimension(height),bounds=BOUNDS[kind]||BOUNDS.room;
 const room=kind==='room'||!BOUNDS[kind];
 const px=padding(room?32:12,w),py=padding(room?24:12,h);
 const availableWidth=w-2*px,availableHeight=h-2*py;
 const fitWidth=availableWidth/bounds.width,fitHeight=availableHeight/bounds.height;
 let scale;
 if(overview) scale=Math.min(fitWidth,fitHeight);
 else if(room) scale=w/h<1.15?fitHeight:Math.min(fitWidth,fitHeight);
 // Wide desktop windows: the table opens a little zoomed out instead of filling the full width.
 else if(kind==='table'&&w/h>=1.15) scale=Math.min(Math.max(fitWidth,fitHeight),fitHeight*1.12);
 else {
  // Cover the viewport, except on tall phones where a full-height cover would
  // produce several screens of horizontal travel. The cap keeps travel useful.
  scale=Math.min(Math.max(fitWidth,fitHeight),Math.max(fitWidth,(w*1.8-2*px)/bounds.width));
 }
 const worldWidth=Math.max(w,bounds.width*scale+2*px);
 return {
  scale,
  x:(worldWidth-bounds.width*scale)/2-bounds.x*scale,
  y:(h-bounds.height*scale)/2-bounds.y*scale,
  worldWidth,
  worldHeight:h
 };
}

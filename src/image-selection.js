/* ElektroPlan SM: touch/mouse crop selection for camera and gallery photos.
   No electrical identification is inferred from a crop. */
(function(root){
'use strict';
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function normalize(a,b,w,h){
 const x1=clamp(Math.min(a.x,b.x),0,w),y1=clamp(Math.min(a.y,b.y),0,h);
 const x2=clamp(Math.max(a.x,b.x),0,w),y2=clamp(Math.max(a.y,b.y),0,h);
 return {x:x1,y:y1,width:x2-x1,height:y2-y1};
}
function crop(image,box,maxSide){
 if(!image||!image.naturalWidth||!image.naturalHeight)throw Error('image_missing');
 const rect=normalize({x:box.x,y:box.y},{x:box.x+box.width,y:box.y+box.height},image.naturalWidth,image.naturalHeight);
 if(rect.width<8||rect.height<8)throw Error('selection_too_small');
 const scale=Math.min(1,(maxSide||1800)/Math.max(rect.width,rect.height));
 const canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(rect.width*scale));canvas.height=Math.max(1,Math.round(rect.height*scale));
 const context=canvas.getContext('2d');if(!context)throw Error('canvas_unavailable');
 context.drawImage(image,rect.x,rect.y,rect.width,rect.height,0,0,canvas.width,canvas.height);
 return canvas.toDataURL('image/jpeg',0.9);
}
function attach(image,overlay,onSelection){
 if(!image||!overlay||typeof onSelection!=='function')throw Error('invalid_arguments');
 let start=null;
 function coords(e){
  const r=overlay.getBoundingClientRect();
  return {x:clamp((e.clientX-r.left)/r.width*image.naturalWidth,0,image.naturalWidth),
          y:clamp((e.clientY-r.top)/r.height*image.naturalHeight,0,image.naturalHeight)};
 }
 function down(e){if(!image.naturalWidth)return;start=coords(e);overlay.setPointerCapture?.(e.pointerId);e.preventDefault()}
 function move(e){if(!start)return;const r=normalize(start,coords(e),image.naturalWidth,image.naturalHeight);draw(r)}
 function up(e){if(!start)return;const r=normalize(start,coords(e),image.naturalWidth,image.naturalHeight);start=null;draw(r);onSelection(r);e.preventDefault()}
 function draw(r){
  const c=overlay.getContext('2d');if(!c)return;
  overlay.width=image.clientWidth*devicePixelRatio;overlay.height=image.clientHeight*devicePixelRatio;
  c.clearRect(0,0,overlay.width,overlay.height);
  if(r){const sx=overlay.width/image.naturalWidth,sy=overlay.height/image.naturalHeight;
   c.strokeStyle='#00e0ff';c.lineWidth=3*devicePixelRatio;c.strokeRect(r.x*sx,r.y*sy,r.width*sx,r.height*sy)}
 }
 overlay.addEventListener('pointerdown',down);overlay.addEventListener('pointermove',move);
 overlay.addEventListener('pointerup',up);overlay.addEventListener('pointercancel',()=>{start=null});
 return {clear:()=>draw(null),destroy:()=>{overlay.removeEventListener('pointerdown',down);overlay.removeEventListener('pointermove',move);overlay.removeEventListener('pointerup',up)}};
}
const api={normalize,crop,attach};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanImageSelection=api;
})(typeof globalThis!=='undefined'?globalThis:this);

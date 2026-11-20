/* Read-only SVG rendering of safely parsed DXF geometry; no project conversion. */
(function(root){'use strict';
function renderPreview(result){
 if(!result||!Array.isArray(result.entities))throw Error('Invalid DXF preview');
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shapes=[],bounds=[];
 const coord=(x,y)=>{if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>1e9||Math.abs(y)>1e9)throw Error('Invalid geometry');bounds.push([x,-y]);return [x,-y]};
 for(const e of result.entities.slice(0,10000)){
  const [x,y]=coord(e[10],e[20]),layer=escape(e.layer||'0');
  if(e.type==='LINE'){const [x2,y2]=coord(e[11],e[21]);shapes.push('<line data-layer="'+layer+'" x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" stroke="currentColor" stroke-width="1.5"/>')}
  if(e.type==='CIRCLE'){const r=e[40];if(!Number.isFinite(r)||r<=0||r>1e8)continue;bounds.push([x-r,y-r],[x+r,y+r]);shapes.push('<circle data-layer="'+layer+'" cx="'+x+'" cy="'+y+'" r="'+r+'" stroke="currentColor" fill="none" stroke-width="1.5"/>')}
  if(e.type==='TEXT'){shapes.push('<text data-layer="'+layer+'" x="'+x+'" y="'+y+'" font-size="6" fill="currentColor">'+escape(e.text||'')+'</text>')}
 }
 const xs=bounds.map(p=>p[0]),ys=bounds.map(p=>p[1]);
 const minX=Math.min(0,...xs),maxX=Math.max(1,...xs),minY=Math.min(0,...ys),maxY=Math.max(1,...ys);
 const pad=20,w=Math.max(40,maxX-minX+2*pad),h=Math.max(40,maxY-minY+2*pad);
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DXF Geometrievorschau" viewBox="'+(minX-pad)+' '+(minY-pad)+' '+w+' '+h+'" style="width:100%;height:auto;max-height:360px;border:1px solid #888;background:#fff;color:#111">'+shapes.join('')+'</svg>';
}
const api={renderPreview};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanDxfSvgPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this);

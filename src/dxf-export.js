/* Minimal ASCII DXF R12 schematic export: geometry only, no electrical semantics. */
(function(root){'use strict';
const geometry=(typeof module!=='undefined'&&module.exports)?require('./terminal-geometry'):root.ElektroPlanTerminalGeometry;
function exportDxf(project){
 if(!project||!Array.isArray(project.symbols)||!Array.isArray(project.wires))throw Error('Invalid project');
 if(project.symbols.length>10000||project.wires.length>50000)throw Error('Project exceeds DXF export safety limits');
 const out=['0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC','0','SECTION','2','ENTITIES'];
 const add=(type,fields)=>{out.push('0',type,...fields.flatMap(([k,v])=>[String(k),String(v)]));};
 const clean=x=>String(x??'').replace(/[\r\n\0-\x1f]/g,' ').slice(0,80);
 const byId=new Map();
 const ids=new Set();
 for(const s of project.symbols){
  if(!s||typeof s.id!=='string'||!Number.isFinite(s.x)||!Number.isFinite(s.y))throw Error('Invalid symbol');
  if(!s.id.trim()||ids.has(s.id))throw Error('Invalid or duplicate symbol ID');
  ids.add(s.id);
  if(s.manualTerminals!==undefined){
   if(!Array.isArray(s.manualTerminals)||s.manualTerminals.length>8)throw Error('Invalid terminal list for DXF export');
   const seen=new Set();
   for(const t of s.manualTerminals){
    if(typeof t!=='string'||!t.trim()||t.length>40||seen.has(t))throw Error('Invalid or duplicate terminal label');
    seen.add(t);
   }
  }
  byId.set(s.id,s);
  add('CIRCLE',[[8,'SYMBOLS'],[10,s.x],[20,-s.y],[30,0],[40,8]]);
  if(Array.isArray(s.manualTerminals)){
   for(const label of s.manualTerminals){
    const p=geometry?.terminalPosition(s,label);
    if(!p)continue;
    add('CIRCLE',[[8,'TERMINALS'],[10,p.x],[20,-p.y],[30,0],[40,2]]);
    add('TEXT',[[8,'TERMINAL_LABELS'],[10,p.x+(p.side<0?-22:5)],[20,-p.y+3],[30,0],[40,3],[1,clean(label)]]);
   }
  }
  add('TEXT',[[8,'LABELS'],[10,s.x+10],[20,-s.y],[30,0],[40,5],[1,clean(s.type)+' '+clean(s.id)]]);
 }
 for(const w of project.wires){
  const a=byId.get(w?.a),b=byId.get(w?.b);
  if(!a||!b)throw Error('Wire endpoint not found');
  const from=w.fromTerminal?geometry?.terminalPosition(a,w.fromTerminal):null;
  const to=w.toTerminal?geometry?.terminalPosition(b,w.toTerminal):null;
  if(!w.fromTerminal||!w.toTerminal)throw Error('DXF export requires complete terminal assignments');
  if(!from||!to)throw Error('Terminal position not available for DXF export');
  const p=from||a,q=to||b;
  add('LINE',[[8,'WIRES'],[10,p.x],[20,-p.y],[30,0],[11,q.x],[21,-q.y],[31,0]]);
 }
 out.push('0','ENDSEC','0','EOF');
 return out.join('\n')+'\n';
}
const api={exportDxf};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanDxf=api;
})(typeof globalThis!=='undefined'?globalThis:this);

/* Review of manually assigned multipole device terminal pairs.
   Illustrative structural diagnostics only; not a manufacturer pinout or safety approval. */
(function(root){'use strict';
const PAIRS={
 KM:[['1','2'],['3','4'],['5','6'],['A1','A2']],
 MSS:[['1','2'],['3','4'],['5','6']]
};
function inspect(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const wires=Array.isArray(project?.wires)?project.wires:[];
 const warnings=[];
 for(const symbol of symbols){
  const pairs=PAIRS[symbol?.type];if(!pairs)continue;
  const manual=new Set(Array.isArray(symbol.manualTerminals)?symbol.manualTerminals:[]);
  for(const [a,b] of pairs){
   if(!manual.has(a)||!manual.has(b)){
    warnings.push({kind:'missing-pair',symbol:symbol.id,terminals:[a,b]});continue;
   }
   const used=t=>wires.some(w=>(w.a===symbol.id&&w.fromTerminal===t)||(w.b===symbol.id&&w.toTerminal===t));
   if(used(a)!==used(b))warnings.push({kind:'partially-wired-pair',symbol:symbol.id,terminals:[a,b]});
  }
 }
 return {warnings,approved:false,disclaimer:'Nur manuelle Mehrpol-Paarprüfung; keine Herstellerverifikation oder elektrische Freigabe.'};
}
const api={inspect};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanMultipoleAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this);

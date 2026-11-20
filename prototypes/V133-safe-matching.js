/* ElektroPlan SM V133 – conservative manufacturer/model matching.
   Search suggestions are never electrical wiring approvals. */
(function(root){
'use strict';
function normalize(value){return String(value??'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('de');}
function compare(query,component){
 const qb=normalize(query?.brand),qm=normalize(query?.model);
 const b=normalize(component?.brand),m=normalize(component?.model);
 if(!qb||!qm||!b||!m)return {category:'incomplete',selectable:false,rank:99,reason:'Hersteller oder Modell fehlt'};
 if(b!==qb){
   return {category:'manufacturer-conflict',selectable:false,rank:90,reason:m===qm?'Gleiche Modellbezeichnung bei anderem Hersteller':'Hersteller stimmt nicht überein'};
 }
 if(m===qm)return {category:'exact-text-match',selectable:true,rank:0,reason:'Hersteller und Modellbezeichnung stimmen textlich überein – keine Anschlussfreigabe'};
 if(m.includes(qm)||qm.includes(m))return {category:'partial-model',selectable:false,rank:10,reason:'Modell nur teilweise ähnlich – exakte Artikelnummer prüfen'};
 return {category:'different-model',selectable:false,rank:20,reason:'Anderes Modell beim selben Hersteller'};
}
function search(query,items){
 if(!Array.isArray(items))return [];
 return items.map((item,index)=>({item,index,...compare(query,item)}))
   .filter(result=>result.category!=='incomplete')
   .sort((a,b)=>a.rank-b.rank||a.index-b.index);
}
const api={normalize,compare,search,warning:'Keine elektrische Freigabe. Herstellerdatenblatt, exakte Artikelnummer und Anschlussbelegung separat prüfen.'};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanV133=api;
})(typeof globalThis!=='undefined'?globalThis:this);

/* ElektroPlan SM: reversible bounded project snapshots, independent of browser DOM. */
(function(root){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
function create(limit=60){
 if(!Number.isInteger(limit)||limit<1||limit>1000)throw Error('INVALID_HISTORY_LIMIT');
 const past=[],future=[];
 return {
  checkpoint(project){past.push(copy(project));if(past.length>limit)past.shift();future.length=0},
  undo(current){if(!past.length)return null;future.push(copy(current));return past.pop()},
  redo(current){if(!future.length)return null;past.push(copy(current));if(past.length>limit)past.shift();return future.pop()},
  clear(){past.length=0;future.length=0},
  state(){return {undo:past.length,redo:future.length}}
 };
}
const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanHistory=api;
})(typeof globalThis!=='undefined'?globalThis:this);

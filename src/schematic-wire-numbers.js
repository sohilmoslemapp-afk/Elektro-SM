/* Consistent wire identifiers, preserving their order in the project model. */
(function(root){'use strict';
function numberWires(project){
 const wires=Array.isArray(project?.wires)?project.wires:[];
 return wires.map((wire,index)=>({id:'W'+(index+1),index,from:wire?.a??'',fromTerminal:wire?.fromTerminal??'',to:wire?.b??'',toTerminal:wire?.toTerminal??'',complete:!!(wire?.fromTerminal&&wire?.toTerminal)}));
}
const api={numberWires};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanWireNumbers=api;
})(typeof globalThis!=='undefined'?globalThis:this);

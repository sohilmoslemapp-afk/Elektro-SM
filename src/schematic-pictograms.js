/* Visual IEC-inspired pictograms. Illustrative only, not certified symbols. */
(function(root){
'use strict';
const shapes={
 LS:[['line',-19,9,-6,-4],['line',-6,-4,7,9],['line',7,9,19,9]],
 RCD:[['rect',-18,-13,36,26],['line',-10,-5,10,5],['circle',0,0,4]],
 SW:[['line',-20,10,-7,10],['line',-7,10,12,-9],['line',12,10,20,10]],
 LAMP:[['circle',0,0,14],['line',-10,-10,10,10],['line',-10,10,10,-10]],
 KM:[['line',-20,-8,-8,-8],['line',-8,-8,8,8],['line',8,8,20,8],['rect',-12,-17,24,8]],
 MSS:[['rect',-19,-14,38,28],['line',-12,-7,12,7],['line',-12,7,12,-7]],
 KLEMME:[['circle',-12,0,5],['circle',12,0,5],['line',-7,0,7,0]]
};
function get(type){return (shapes[type]||[]).map(parts=>parts.slice())}
const api={get,types:Object.keys(shapes)};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanPictograms=api;
})(typeof globalThis!=='undefined'?globalThis:this);

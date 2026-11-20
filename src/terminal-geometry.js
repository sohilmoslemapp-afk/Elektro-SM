/* ElektroPlan SM — display geometry for explicitly entered terminal labels.
   Only the first eight manually entered terminals are drawn; no manufacturer pin inference. */
(function(root){
'use strict';
function terminalPosition(symbol,label){
 const terminals=symbol?.manualTerminals;
 if(!Array.isArray(terminals)||typeof label!=='string')return null;
 const index=terminals.indexOf(label);
 if(index<0||index>=8)return null;
 const side=index%2===0?-1:1,row=Math.floor(index/2);
 return {x:symbol.x+side*43,y:symbol.y-17+row*11,side};
}
const api={terminalPosition};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanTerminalGeometry=api;
})(typeof globalThis!=='undefined'?globalThis:this);

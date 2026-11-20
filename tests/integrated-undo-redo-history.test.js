'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'),'utf8');
for(const [button,stack,other] of [['undoEdit','undoStack','redoStack'],['redoEdit','redoStack','undoStack']]){
 const start=html.indexOf("$('"+button+"').onclick=()=>{");
 const end=html.indexOf('};',start);
 assert.ok(start>=0&&end>start);
 const handler=html.slice(start,end);
 assert.match(handler,new RegExp(stack+'\\['+stack+'\\.length-1\\]'));
 assert.match(handler,/if\(!restoreSnapshot\((previous|next)\)\)return/);
 assert.ok(handler.indexOf('restoreSnapshot(')<handler.indexOf(stack+'.pop()'),'do not discard history on failed restore');
 assert.match(handler,new RegExp(other+'\\.push\\(lastSnapshot\\)'));
}
console.log('Undo/redo invalid snapshot history preservation: 8 static assertions passed');

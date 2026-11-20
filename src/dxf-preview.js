/* Strict, read-only ASCII DXF R12 entity preview. Never turns geometry into electrical connectivity. */
(function(root){'use strict';
function previewDxf(source){
 if(typeof source!=='string'||source.length>2000000)throw Error('DXF text invalid or too large');
 if(source.includes('\0'))throw Error('Binary DXF is not supported');
 const lines=source.replace(/\r\n?/g,'\n').split('\n');
 if(lines.length>100000)throw Error('DXF entity limit exceeded');
 const pairs=[];
 for(let i=0;i+1<lines.length;i+=2){
  const code=lines[i].trim(),value=lines[i+1].trim();
  if(!/^\d{1,3}$/.test(code))throw Error('Invalid DXF group code');
  pairs.push([Number(code),value]);
 }
 if(lines.length%2===1&&lines.at(-1)!=='')throw Error('Truncated DXF pair');
 const entities=[];let section='',current=null,awaitSection=false,unsupportedEntities=0,hasEntities=false,hasEof=false;
 const flush=()=>{if(current){entities.push(current);if(entities.length>10000)throw Error('Too many DXF entities');current=null}};
 for(const [code,value] of pairs){
  if(code===0&&value==='SECTION'){if(section||awaitSection)throw Error('Nested or malformed DXF SECTION');flush();awaitSection=true;continue}
  if(awaitSection&&code===2){section=value;awaitSection=false;if(section==='ENTITIES')hasEntities=true;continue}
  if(code===0&&value==='ENDSEC'){if(!section||awaitSection)throw Error('Unexpected DXF ENDSEC');flush();section='';continue}
  if(code===0&&value==='EOF'){if(section||awaitSection)throw Error('DXF EOF before ENDSEC');flush();hasEof=true;break}
  if(section!=='ENTITIES')continue;
  if(code===0){flush();if(['LINE','CIRCLE','TEXT'].includes(value))current={type:value,layer:'0'};else if(++unsupportedEntities>10000)throw Error('Too many unsupported DXF entities');continue}
  if(!current)continue;
  if(code===8)current.layer=value.slice(0,80);
  if([10,20,11,21,40].includes(code)){
   const n=Number(value);if(!Number.isFinite(n)||Math.abs(n)>1e9)throw Error('Invalid DXF coordinate');
   current[code]=n;
  }
  if(code===1&&current.type==='TEXT')current.text=value.slice(0,160);
 }
 flush();
 if(!hasEntities||!hasEof||section||awaitSection)throw Error('Incomplete DXF ENTITIES section or EOF marker');
 const supported=entities.filter(e=>Number.isFinite(e[10])&&Number.isFinite(e[20])&&(e.type==='TEXT'||(e.type==='CIRCLE'&&e[40]>0)||(e.type==='LINE'&&Number.isFinite(e[11])&&Number.isFinite(e[21]))));
 return {entities:supported,unsupportedCount:unsupportedEntities+entities.length-supported.length,note:'Geometrie-Vorschau, keine elektrischen Verbindungen oder editierbare Projektkonvertierung.'};
}
const api={previewDxf};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanDxfPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this);

// Executes the actual V107 JSON import handler with mocked browser dependencies.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('prototypes/integrated-titleblock-schematic-v107.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const handler=script.match(/\$\('loadplan'\)\.onchange=async e=>\{[\s\S]*?return false\}\};\$\('papersize'\)\.onchange=/);
assert.ok(handler,'Import handler not found');
const source=handler[0].replace(/;\$\('papersize'\)\.onchange=$/,'');
const fields={};for(const id of ['paperwidth','paperheight','papersize','printfit','mmperunit','tbmode','tbcompany','tbproject','tbnumber'])fields[id]={value:'original-'+id};
let currentParts=[{id:'OLD',x:10,y:20}],currentEdges=[],currentFixedEnds=[],currentSeq=7,currentImage='original-image',currentCrop={x:0,y:0,w:1,h:1},currentUndo=['keep'];
let drawCalls=0,reportText='';
const context={Number,JSON,Set,Object,Array,Error,parts:currentParts,edges:currentEdges,fixedEnds:currentFixedEnds,seq:currentSeq,tbImage:currentImage,tbCrop:currentCrop,undo:currentUndo,
  $:id=>fields[id]||(fields[id]={value:''}),draw:()=>{drawCalls++;throw Error('Injected draw failure')},report:x=>{reportText=x},
  validateProjectSnapshot:d=>{const ids=new Set();for(const p of d.parts){if(ids.has(p.id))return ['Duplicate'];ids.add(p.id)}return []}};
vm.createContext(context);vm.runInContext(source,context);
const before=()=>JSON.stringify({parts:context.parts,edges:context.edges,fixedEnds:context.fixedEnds,seq:context.seq,tbImage:context.tbImage,tbCrop:context.tbCrop,undo:context.undo,fields:Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value]))});
const initial=before();
const good={kind:'UNVERIFIED_SCHEMATIC_WITH_TITLEBLOCK',version:1,parts:[{id:'NEW',x:50,y:50}],edges:[],fixedEnds:[],seq:8,paper:{widthMm:210,heightMm:297},titleBlock:{company:'TEST',project:'TEST',number:'1'}};
(async()=>{const result=await fields.loadplan.onchange({target:{files:[{size:300,text:async()=>JSON.stringify(good)}]}});assert.equal(result,false,'Injected draw error must reject import');assert.equal(before(),initial,'Import failure must restore original application state');assert.ok(drawCalls>=1);assert.match(reportText,/nicht sicher geladen/);console.log('PASS: Executed import rollback restores original diagram, form fields, and undo state after draw failure')})().catch(e=>{console.error(e);process.exitCode=1});

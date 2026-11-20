'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('#inspectFormatFile').setInputFiles({name:'installation.DXF',mimeType:'application/octet-stream',buffer:Buffer.from('0\nSECTION\n')});
  const result=await page.locator('#formatInspectionResult').innerText();
  if(!result.includes('Format: dxf')||!result.includes('Import: planned')||!result.includes('keine Datei geöffnet'))throw Error('Misleading DXF status: '+result);
  await page.locator('#inspectFormatFile').setInputFiles({name:'unknown.xyz',mimeType:'application/octet-stream',buffer:Buffer.from('test')});
  if(!(await page.locator('#formatInspectionResult').innerText()).includes('Import: unsupported'))throw Error('Unknown file incorrectly supported');
  if(errors.length)throw Error(errors.join(' | '));
  console.log('Mobile format inspection reports capability without reading or importing files');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

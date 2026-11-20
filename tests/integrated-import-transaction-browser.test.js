'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('[data-add="LS"]').click();
  const before=await page.locator('#symbols > g').first().getAttribute('transform');
  const project=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('ElektroPlan'))||localStorage.key(0))));
  if(!project?.symbols?.length)throw Error('Current project not persisted');
  const candidate=structuredClone(project);candidate.symbols.push({...candidate.symbols[0],id:'import-test-symbol',x:500,y:150});
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw Error('QuotaExceededError simulated')}});
  await page.locator('[data-tab="project"]').click();
  await page.locator('#importJson').setInputFiles({name:'storage-failure.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'ElektroPlan-SM-1',data:candidate}))});
  await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Import abgebrochen'));
  if(!(await page.locator('#message').innerText()).includes('bisheriges Projekt bleibt erhalten'))throw Error('Missing explicit rollback warning');
  await page.locator('[data-tab="plan"]').click();
  if(await page.locator('#symbols > g').count()!==1)throw Error('Failed import replaced current diagram');
  if(await page.locator('#symbols > g').first().getAttribute('transform')!==before)throw Error('Failed import modified original symbol');
  await page.locator('#undoEdit').click();
  if(await page.locator('#symbols > g').count()!==0)throw Error('Failed import damaged prior undo history');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Chromium: storage failure rolls back project import and preserves undo history');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

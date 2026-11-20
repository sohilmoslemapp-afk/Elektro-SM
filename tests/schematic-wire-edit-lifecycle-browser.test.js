'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  for(const type of ['RCD','LS','SW'])await page.locator('[data-add="'+type+'"]').click();
  for(const [a,b] of [[0,1],[1,2]]){
   await page.locator('#wireMode').click();
   await page.locator('#symbols > g').nth(a).tap();
   await page.locator('#symbols > g').nth(b).tap();
  }
  const count=()=>page.locator('#wires > path').count();
  if(await count()!==2)throw Error('Expected two wires before deletion');
  page.once('dialog',d=>d.accept('1'));
  await page.locator('#deleteWire').click();
  if(await count()!==1)throw Error('Wire deletion did not refresh drawing');
  if(!(await page.locator('#wires').textContent()).includes('W1'))throw Error('Wire numbering not refreshed');
  await page.locator('#undoEdit').click();
  if(await count()!==2)throw Error('Undo did not restore deleted wire');
  await page.locator('#redoEdit').click();
  if(await count()!==1)throw Error('Redo did not remove wire again');
  page.once('dialog',d=>d.accept('invalid'));
  await page.locator('#deleteWire').click();
  if(await count()!==1)throw Error('Invalid wire number removed a wire');
  await page.locator('#checkPlan').click();
  if(!(await page.locator('#planCheckResult').innerText()).includes('nicht auswertbare Netzverbindungen'))throw Error('Connectivity analysis absent after wire edit');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: wire deletion, undo, redo, invalid input and net check passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

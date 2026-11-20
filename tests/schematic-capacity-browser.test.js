'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  const add=page.locator('[data-add="LS"]');
  for(let i=0;i<20;i++)await add.click();
  if(await page.locator('#symbols > g').count()!==20)throw Error('Expected 20 symbols');
  const points=await page.locator('#symbols > g').evaluateAll(elements=>elements.map(el=>el.getAttribute('transform')));
  if(new Set(points).size!==20)throw Error('Overlapping placement coordinates');
  await add.click();
  if(await page.locator('#symbols > g').count()!==20)throw Error('Full canvas should reject extra symbol');
  await page.locator('#addTerminalStrip').click();
  if(await page.locator('#symbols > g').count()!==20)throw Error('Full canvas should reject terminal strip');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: auto-placement capacity and rejection passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

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
  const symbol=page.locator('#symbols > g').first();
  const before=await symbol.getAttribute('transform');
  const rect=await symbol.boundingBox();
  if(!rect)throw Error('Symbol not visible');
  const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x+65,y+35,{steps:6});
  const moved=await symbol.getAttribute('transform');
  if(moved===before)throw Error('Pointer movement did not change symbol position');
  await symbol.evaluate(el=>el.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1,pointerType:'mouse'})));
  const after=await page.locator('#symbols > g').first().getAttribute('transform');
  if(after!==before)throw Error('Interrupted drag failed to roll back: '+JSON.stringify({before,moved,after}));
  await page.mouse.up();
  await page.reload();
  const persisted=await page.locator('#symbols > g').first().getAttribute('transform');
  if(persisted!==before)throw Error('Cancelled drag leaked into persistent project');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: interrupted pointer drag restores coordinates and leaves storage unchanged');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

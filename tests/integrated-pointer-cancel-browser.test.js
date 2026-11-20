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
  const result=await page.evaluate(()=>{
   const symbol=document.querySelector('#symbols > g');
   const drawing=document.querySelector('#drawing');
   const rect=symbol.getBoundingClientRect();
   const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
   symbol.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:8,pointerType:'touch',clientX:x,clientY:y}));
   symbol.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:8,pointerType:'touch',clientX:x+65,clientY:y+35}));
   const moved=symbol.getAttribute('transform');
   symbol.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:8,pointerType:'touch'}));
   return {moved,after:document.querySelector('#symbols > g').getAttribute('transform'),drawing:!!drawing};
  });
  if(result.moved===before)throw Error('Pointer movement did not change symbol position');
  if(result.after!==before)throw Error('Interrupted touch drag failed to roll back: '+JSON.stringify({before,...result}));
  await page.reload();
  const persisted=await page.locator('#symbols > g').first().getAttribute('transform');
  if(persisted!==before)throw Error('Cancelled drag leaked into persistent project');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: interrupted touch drag restores coordinates and leaves storage unchanged');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

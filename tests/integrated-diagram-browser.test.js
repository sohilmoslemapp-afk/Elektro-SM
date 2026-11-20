'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('[data-add="RCD"]').click();
  await page.locator('[data-add="LS"]').click();
  await page.locator('#checkDiagram').click();
  if(!(await page.locator('#validationResults').innerText()).includes('Keine Strukturfehler'))throw Error('Valid diagram rejected');
  await page.evaluate(()=>{
   const old=window.ElektroPlanValidation.validate;
   window.ElektroPlanValidation.validate=project=>old({...project,symbols:project.symbols.map((s,i)=>i===1?{...s,id:project.symbols[0].id}:s)});
  });
  await page.locator('#checkDiagram').click();
  const invalid=await page.locator('#validationResults').innerText();
  if(!invalid.includes('Strukturfehler')||!invalid.includes('Doppelte Symbolkennung'))throw Error('Diagram checker ignored core duplicate-ID rejection: '+invalid);
  await page.evaluate(()=>{delete window.ElektroPlanValidation});
  await page.locator('#checkDiagram').click();
  const missing=await page.locator('#validationResults').innerText();
  if(!missing.includes('Prüfmodul nicht geladen')||missing.includes('Keine Strukturfehler'))throw Error('Missing validator did not fail closed: '+missing);
  if(errors.length)throw Error('Browser JavaScript errors: '+errors.join(' | '));
  console.log('Mobile Chromium: unified schematic validation and missing-module fail-closed passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

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
  await page.locator('#wireMode').click();
  for(const [a,b] of [[0,1],[1,2]]){
   await page.locator('#symbols > g').nth(a).tap();
   await page.locator('#symbols > g').nth(b).tap();
  }
  const labels=await page.locator('#wires text').allTextContents();
  if(!labels.some(x=>x.includes('W1'))||!labels.some(x=>x.includes('W2')))throw Error('Missing sequential wire labels: '+labels.join(' | '));
  if(await page.locator('#wires > path').count()!==2)throw Error('Expected two diagram wires');
  await page.locator('#checkPlan').click();
  if(!(await page.locator('#planCheckResult').innerText()).includes('offene Leitungszuordnungen'))throw Error('Missing open terminal assignment warning');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: two wire labels and structural check passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('[data-add="RCD"]').click();await page.locator('[data-add="LS"]').click();
  await page.locator('#wireMode').click();await page.locator('#symbols > g').nth(0).tap();await page.locator('#symbols > g').nth(1).tap();
  const wire=page.locator('#wires > path').first();
  if(await wire.getAttribute('stroke')!=='#a34516'||await wire.getAttribute('stroke-dasharray')!=='6 4')throw Error('Unassigned terminals should show dashed amber warning wire');
  if(!(await page.locator('#wires').innerText()).includes('⚠'))throw Error('Missing terminal warning marker');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Chromium: incomplete terminal wiring is visibly amber and dashed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

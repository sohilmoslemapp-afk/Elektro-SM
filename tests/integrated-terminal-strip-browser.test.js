'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('#addTerminalStrip').click();
  if(!(await page.locator('#symbols').evaluate(el=>el.textContent)).includes('KLEMME X1'))throw Error('X1 strip label not rendered');
  if(await page.locator('#symbols [data-terminal="1"]').count()!==2)throw Error('Number and marker must both be selectable');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#exportTerminalList').click();
  const download=await downloadPromise;
  if(download.suggestedFilename()!=='ElektroPlan-Klemmenplan.csv')throw Error('Unexpected terminal schedule filename');
  const netPromise=page.waitForEvent('download');
  await page.locator('#exportNetList').click();
  const net=await netPromise;
  if(net.suggestedFilename()!=='ElektroPlan-Verbindungsgruppen.csv')throw Error('Unexpected net schedule filename');
  await page.locator('#supplyRails').click();
  if(await page.locator('#supplyRails').getAttribute('aria-pressed')!=='true')throw Error('Supply overlay not enabled');
  if(!(await page.locator('#supplyReference').evaluate(el=>el.textContent)).includes('nicht elektrisch verbunden'))throw Error('Safety disclaimer missing');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: terminal strip, exports and supply reference overlay passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

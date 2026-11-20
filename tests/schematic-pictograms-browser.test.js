'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  for(const type of ['RCD','LS','SW','LAMP','KLEMME'])await page.locator('[data-add="'+type+'"]').click();
  for(const type of ['RCD','LS','SW','LAMP','KLEMME'])if(await page.locator('#symbols [data-pictogram="'+type+'"] > *').count()===0)throw Error('Missing rendered pictogram '+type);
  const exportPromise=page.waitForEvent('download');
  await page.locator('#exportSvg').click();
  const file=await exportPromise;
  if(!file.suggestedFilename().endsWith('.svg'))throw Error('SVG export filename missing');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Mobile Chromium: schematic pictograms and SVG export passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

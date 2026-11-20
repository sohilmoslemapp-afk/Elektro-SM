'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('[data-add="LS"]').click();
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#exportPng').click();
  const download=await downloadPromise;
  if(download.suggestedFilename()!=='ElektroPlan-Schaltplan.png')throw Error('Unexpected PNG filename');
  const stream=await download.createReadStream();let bytes=Buffer.alloc(0);for await(const chunk of stream)bytes=Buffer.concat([bytes,chunk]);
  if(bytes.length<100||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('PNG export not a valid PNG signature');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Chromium: schematic PNG export downloads valid PNG image');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

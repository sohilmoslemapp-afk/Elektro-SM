'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  for(const [lang,contactor,motor] of [['de','Schütz KM','Motorschutz MSS'],['en','Contactor KM','Motor protection MSS'],['ar','كونتاكتور KM','حماية المحرك MSS']]){
   await page.locator('#appLanguage').selectOption(lang);
   if(await page.locator('#addContactor').innerText()!==contactor||await page.locator('#addMotorProtection').innerText()!==motor)throw Error('Translation '+lang);
  }
  await page.locator('#addContactor').click();
  await page.locator('#addMotorProtection').click();
  for(const type of ['KM','MSS'])if(await page.locator('#symbols [data-pictogram="'+type+'"] > *').count()===0)throw Error('Missing '+type+' pictogram');
  const terms=await page.locator('#symbols [data-terminal]').count();if(terms<14)throw Error('Expected manual contactor and motor-protection terminals');
  if(errors.length)throw Error(errors.join('; '));
  console.log('Contactor and motor-protection mobile diagram test passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

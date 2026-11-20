'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const device of [{name:'phone',width:390,height:844,touch:true},{name:'tablet',width:820,height:1180,touch:true},{name:'desktop',width:1440,height:900,touch:false}]){
   const page=await browser.newPage({viewport:{width:device.width,height:device.height},isMobile:device.touch,hasTouch:device.touch});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
   for(const [lang,command] of [['de','Klemmleiste hinzufügen'],['en','add terminal strip'],['ar','أضف شريط بورنات']]){
    await page.locator('#appLanguage').selectOption(lang);
    const before=await page.locator('#symbols > g').count();
    await page.locator('#commandInput').fill(command);
    await page.locator('#runCommand').click();
    if(await page.locator('#symbols > g').count()!==before+1)throw Error(device.name+' '+lang+': typed command failed');
    await page.locator('#commandInput').fill('delete all projects');
    await page.locator('#commandInput').press('Enter');
    if(await page.locator('#symbols > g').count()!==before+1)throw Error(device.name+' '+lang+': unsupported command changed project');
    await page.evaluate(()=>{delete window.SpeechRecognition;delete window.webkitSpeechRecognition});
    await page.locator('#voiceCommand').click();
    if(!(await page.locator('#commandStatus').innerText()).trim())throw Error(device.name+' '+lang+': missing voice fallback');
   }
   if(errors.length)throw Error(device.name+': '+errors.join(' | '));
   console.log(device.name+': typed commands, safety fallback and trilingual control passed');
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

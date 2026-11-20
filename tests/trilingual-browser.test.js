'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const device of [{name:'mobile',width:390,height:844},{name:'tablet',width:820,height:1180},{name:'desktop',width:1440,height:900}]){
   const page=await browser.newPage({viewport:{width:device.width,height:device.height}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
   for(const [lang,dir,nav,warning] of [['ar','rtl','المخطط','لا يوجد تعرّف تلقائي'],['en','ltr','Circuit diagram','No automatic photo identification'],['de','ltr','Schaltplan','Keine automatische Bilderkennung']]){
    await page.locator('#appLanguage').selectOption(lang);
    if(await page.locator('html').getAttribute('lang')!==lang)throw Error(device.name+': wrong language '+lang);
    if(await page.locator('html').getAttribute('dir')!==dir)throw Error(device.name+': wrong direction '+lang);
    if((await page.locator('[data-tab="plan"]').innerText())!==nav)throw Error(device.name+': wrong nav '+lang);
    await page.locator('[data-tab="camera"]').click();
    if(!(await page.locator('#cameraSafetyNotice').innerText()).includes(warning))throw Error(device.name+': camera safety translation missing '+lang);
    await page.locator('[data-tab="parts"]').click();
    if(!(await page.locator('#librarySafetyNotice').innerText()).trim())throw Error(device.name+': library safety warning missing '+lang);
    await page.locator('[data-tab="plan"]').click();
    const expectedSave={ar:'حفظ المشروع',en:'Save project',de:'Projekt speichern'}[lang];
    if((await page.locator('#savePlan').innerText())!==expectedSave)throw Error(device.name+': save button not translated '+lang);
    const expectedCheck={ar:'فحص البنية',en:'Check structure',de:'Struktur prüfen'}[lang];
    if((await page.locator('#checkPlan').innerText())!==expectedCheck)throw Error(device.name+': structure button not translated '+lang);

   }
   await page.locator('#appLanguage').selectOption('ar');
   await page.reload();
   if(await page.locator('#appLanguage').inputValue()!=='ar')throw Error(device.name+': language did not persist');
   if(await page.locator('html').getAttribute('dir')!=='rtl')throw Error(device.name+': RTL did not persist');
   if(errors.length)throw Error(device.name+': '+errors.join('; '));
   await page.close();
   console.log(device.name+': German, English, Arabic and persistence passed');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

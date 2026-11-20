'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const devices=[{name:'iPhone viewport',width:390,height:844,touch:true},{name:'Android viewport',width:412,height:915,touch:true},{name:'tablet viewport',width:820,height:1180,touch:true},{name:'desktop viewport',width:1440,height:900,touch:false}];
  const expectations={de:['Klemmleiste X hinzufügen','Klemmenplan CSV','Verbindungsgruppen CSV'],en:['Add X terminal strip','Terminal schedule CSV','Connection groups CSV'],ar:['إضافة شريط بورنات X','تصدير جدول البورنات CSV','تصدير مجموعات التوصيل CSV']};
  for(const device of devices){
   const page=await browser.newPage({viewport:{width:device.width,height:device.height},hasTouch:device.touch,isMobile:device.touch});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
   for(const lang of ['de','en','ar']){
    await page.locator('#appLanguage').selectOption(lang);
    const ids=['addTerminalStrip','exportTerminalList','exportNetList'];
    for(let i=0;i<ids.length;i++)if((await page.locator('#'+ids[i]).innerText())!==expectations[lang][i])throw Error(device.name+' '+lang+' '+ids[i]+' untranslated');
    if(await page.locator('html').getAttribute('dir')!==(lang==='ar'?'rtl':'ltr'))throw Error(device.name+' '+lang+' wrong direction');
    await page.locator('#addTerminalStrip').click();
    if(await page.locator('#symbols > g').count()===0)throw Error(device.name+' '+lang+' add strip failed');
   }
   if(errors.length)throw Error(device.name+' browser errors: '+errors.join(' | '));
   console.log(device.name+': all three languages and terminal editor passed');
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

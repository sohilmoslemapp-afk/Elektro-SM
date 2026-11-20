'use strict';
const { chromium }=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const scenarios=[
   {name:'Android tablet landscape',viewport:{width:1280,height:800},isMobile:true,hasTouch:true},
   {name:'Desktop computer',viewport:{width:1440,height:900},isMobile:false,hasTouch:false}
  ];
  for(const scenario of scenarios){
   const context=await browser.newContext({viewport:scenario.viewport,isMobile:scenario.isMobile,hasTouch:scenario.hasTouch,acceptDownloads:true});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
   await page.locator('[data-add="RCD"]').click();
   await page.locator('[data-add="LS"]').click();
   if(await page.locator('#symbols > g').count()!==2)throw Error(scenario.name+': symbols missing');
   await page.locator('#wireMode').click();
   if(scenario.hasTouch){
    await page.locator('#symbols > g').nth(0).tap();
    await page.locator('#symbols > g').nth(1).tap();
   }else{
    await page.locator('#symbols > g').nth(0).click();
    await page.locator('#symbols > g').nth(1).click();
   }
   if(await page.locator('#wires > path').count()!==1)throw Error(scenario.name+': wiring failed');
   await page.locator('#savePlan').click();
   await page.reload();
   if(await page.locator('#symbols > g').count()!==2||await page.locator('#wires > path').count()!==1)throw Error(scenario.name+': persistence failed');
   await page.locator('[data-tab="camera"]').click();
   if(!await page.locator('#choosePhoto').count())throw Error(scenario.name+': photo picker missing');
   if(errors.length)throw Error(scenario.name+': '+errors.join(' | '));
   await context.close();
   console.log(scenario.name+': basic editor, wiring and persistence passed');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

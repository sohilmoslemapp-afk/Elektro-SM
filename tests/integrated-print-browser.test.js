'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1024,height:768}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
  await page.locator('[data-add="RCD"]').click();
  await page.locator('[data-add="LS"]').click();
  const svg=await page.locator('#drawing').evaluate(el=>new XMLSerializer().serializeToString(el));
  if(!svg.includes('RCD')||!svg.includes('LS'))throw Error('Schematic not rendered');
  await page.evaluate(()=>{window.__printView=null;const realOpen=window.open;window.open=()=>{const view={html:'',printed:false,focused:false,document:{open(){},write(text){view.html+=text},close(){}},focus(){view.focused=true},print(){view.printed=true}};window.__printView=view;return view}});
  await page.locator('#printPlan').click();
  const view=await page.evaluate(()=>({html:window.__printView?.html,printed:window.__printView?.printed}));
  if(!view.printed||!view.html.includes('RCD')||!view.html.includes('LS'))throw Error('Print preview missing symbols or print action');
  if(!view.html.includes('keine elektrische Freigabe'))throw Error('Safety notice missing from printed document');
  if(!view.html.includes('@page{size:landscape'))throw Error('Landscape print stylesheet missing');
  await page.evaluate(()=>{window.open=()=>null});
  await page.locator('#printPlan').click();
  if(!(await page.locator('#message').innerText()).includes('Druckfenster blockiert'))throw Error('Blocked pop-up lacks actionable warning');
  if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
  console.log('Chromium print preview: diagram, safety notice, landscape layout and blocked-popup feedback passed');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

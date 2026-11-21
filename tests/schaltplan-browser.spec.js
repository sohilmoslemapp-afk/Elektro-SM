'use strict';
const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const {resolve}=require('node:path');
const url=pathToFileURL(resolve(__dirname,'../schaltplan.html')).href;
for(const device of [{name:'desktop',viewport:{width:1280,height:800},hasTouch:false},{name:'phone',viewport:{width:390,height:844},hasTouch:true},{name:'tablet',viewport:{width:820,height:1180},hasTouch:true}]){
 test(device.name+' loads editor and switches all languages',async({browser})=>{
  const context=await browser.newContext({viewport:device.viewport,hasTouch:device.hasTouch,isMobile:device.hasTouch});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.locator('.eps-toolbar button')).toHaveCount(11);
  await expect(page.locator('svg.eps-canvas')).toBeVisible();
  await page.locator('select').selectOption('ar');
  await expect(page.locator('#editor')).toHaveAttribute('dir','rtl');
  await expect(page.getByRole('button',{name:'إضافة قطعة'})).toBeVisible();
  await page.locator('select').selectOption('en');
  await expect(page.getByRole('button',{name:'Add component'})).toBeVisible();
  await page.locator('select').selectOption('de');
  await expect(page.getByRole('button',{name:'Bauteil hinzufügen'})).toBeVisible();
  expect(errors).toEqual([]);
  await context.close();
 });
}
test('editor adds, validates, undoes and exports JSON',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>{await d.accept(d.message().includes('Kennung')?'X1':'1,2')});
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 await expect(page.locator('svg [data-id="X1"]')).toHaveCount(1);
 await page.getByRole('button',{name:'Anschlüsse prüfen'}).click();
 await expect(page.locator('.eps-state')).toContainText('electricallyApproved');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'JSON speichern'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('elektroplan.json');
 await page.getByRole('button',{name:'Rückgängig'}).click();
 await expect(page.locator('svg [data-id="X1"]')).toHaveCount(0);
});

test('keyboard selection and movement work without losing focus',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'K1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 const item=page.locator('svg [data-id="K1"]');
 await item.focus();
 const before=await item.locator('rect').getAttribute('x');
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('svg [data-id="K1"] rect')).toHaveAttribute('x',String(Number(before)+10));
 await expect(page.locator('svg [data-id="K1"]')).toBeFocused();
 await page.keyboard.press('ControlOrMeta+z');
 await expect(page.locator('svg [data-id="K1"] rect')).toHaveAttribute('x',before);
});
test('exports SVG and DXF without browser errors',async({page})=>{
 await page.goto(url);
 for(const [button,filename] of [['SVG exportieren','elektroplan.svg'],['DXF exportieren','elektroplan.dxf']]){
  const pending=page.waitForEvent('download');
  await page.getByRole('button',{name:button}).click();
  expect((await pending).suggestedFilename()).toBe(filename);
 }
});

'use strict';
const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const {resolve}=require('node:path');
const url=pathToFileURL(resolve(__dirname,'../schaltplan.html')).href;
for(const device of [{name:'desktop',viewport:{width:1280,height:800},hasTouch:false},{name:'phone',viewport:{width:390,height:844},hasTouch:true},{name:'tablet',viewport:{width:820,height:1180},hasTouch:true}]){
 test(device.name+' loads editor and switches all languages',async({browser})=>{
  const context=await browser.newContext({viewport:device.viewport,hasTouch:device.hasTouch,isMobile:device.hasTouch && browser.browserType().name()!=='firefox'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.locator('.eps-toolbar button')).toHaveCount(11);
  await expect(page.locator('.eps-canvas')).toBeVisible();
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

test('pointer drag moves a component and undo restores its position',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'D1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 const rect=page.locator('svg [data-id="D1"] rect');
 const initial=Number(await rect.getAttribute('x'));
 const bounds=await rect.boundingBox();
 expect(bounds).toBeTruthy();
 const x=bounds.x+bounds.width/2,y=bounds.y+bounds.height/3;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+60,y+20,{steps:5});await page.mouse.up();
 await expect.poll(async()=>Number(await page.locator('svg [data-id="D1"] rect').getAttribute('x'))).toBeGreaterThan(initial);
 await page.getByRole('button',{name:'Rückgängig'}).click();
 await expect(page.locator('svg [data-id="D1"] rect')).toHaveAttribute('x',String(initial));
});

test('touch input selects a component on mobile viewport',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:browser.browserType().name()!=='firefox'});
 const page=await context.newPage();
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'T1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 await page.locator('svg [data-id="T1"] rect').tap();
 await page.getByRole('button',{name:'Auswahl löschen'}).click();
 await expect(page.locator('svg [data-id="T1"]')).toHaveCount(0);
 await context.close();
});

test('JSON save and reload preserve components',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'R1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 const save=page.waitForEvent('download');
 await page.getByRole('button',{name:'JSON speichern'}).click();
 const file=await save;
 const saved=await file.path();
 expect(saved).toBeTruthy();
 await page.locator('svg [data-id="R1"] rect').click();
 await page.getByRole('button',{name:'Auswahl löschen'}).click();
 await expect(page.locator('svg [data-id="R1"]')).toHaveCount(0);
 await page.locator('input[type="file"]').setInputFiles(saved);
 await expect(page.locator('svg [data-id="R1"]')).toHaveCount(1);
});
test('invalid JSON import leaves existing schematic unchanged',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'S1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 await page.locator('input[type="file"]').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"version":999}')});
 await expect(page.locator('svg [data-id="S1"]')).toHaveCount(1);
});

test('exported SVG is valid XML and DXF includes required sections',async({page})=>{
 await page.goto(url);
 const svgPending=page.waitForEvent('download');
 await page.getByRole('button',{name:'SVG exportieren'}).click();
 const svgFile=await svgPending;
 const fs=require('node:fs');
 const svg=fs.readFileSync(await svgFile.path(),'utf8');
 expect(svg).toMatch(/<svg[\s>]/);
 expect(svg).toContain('</svg>');
 const dxfPending=page.waitForEvent('download');
 await page.getByRole('button',{name:'DXF exportieren'}).click();
 const dxfFile=await dxfPending;
 const dxf=fs.readFileSync(await dxfFile.path(),'utf8');
 expect(dxf).toContain('SECTION');
 expect(dxf).toContain('EOF');
});

test('rejects structurally invalid imported projects without losing the drawing',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'SAFE1':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 const duplicate={version:1,symbols:[{id:'A',x:0,y:0,manualTerminals:['1']},{id:'A',x:100,y:0,manualTerminals:['2']}],wires:[]};
 await page.locator('input[type="file"]').setInputFiles({name:'duplicate.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(duplicate))});
 await expect(page.locator('svg [data-id="SAFE1"]')).toHaveCount(1);
 await expect(page.locator('svg [data-id="A"]')).toHaveCount(0);
});
test('rejects oversized JSON import and preserves schematic',async({page})=>{
 await page.goto(url);
 page.on('dialog',async d=>d.accept(d.message().includes('Kennung')?'SAFE2':'1,2'));
 await page.getByRole('button',{name:'Bauteil hinzufügen'}).click();
 await page.locator('input[type="file"]').setInputFiles({name:'oversized.json',mimeType:'application/json',buffer:Buffer.alloc(2000001,32)});
 await expect(page.locator('svg [data-id="SAFE2"]')).toHaveCount(1);
});

test('keyboard movement at coordinate boundary does not consume undo history',async({page})=>{
 await page.goto(url);
 const boundary={version:1,symbols:[{id:'EDGE',x:9990,y:0,manualTerminals:['1','2']}],wires:[]};
 await page.locator('input[type="file"]').setInputFiles({name:'boundary.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(boundary))});
 const item=page.locator('svg [data-id="EDGE"]');
 await expect(item).toHaveCount(1);
 await item.focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('svg [data-id="EDGE"] rect')).toHaveAttribute('x','9990');
 await page.getByRole('button',{name:'Rückgängig'}).click();
 await expect(page.locator('svg [data-id="EDGE"]')).toHaveCount(0);
});

test('terminal connections survive JSON round-trip and are removed with their component',async({page})=>{
 await page.goto(url);
 const project={version:1,symbols:[{id:'A1',x:100,y:100,manualTerminals:['1','2']},{id:'B1',x:350,y:100,manualTerminals:['L','N']}],wires:[]};
 await page.locator('input[type="file"]').setInputFiles({name:'connection.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
 await expect(page.locator('svg [data-id="A1"]')).toHaveCount(1);
 await page.getByRole('button',{name:'Leitung verbinden'}).click();
 await page.locator('svg [data-component="A1"][data-terminal="1"]').click();
 await page.locator('svg [data-component="B1"][data-terminal="L"]').click();
 await expect(page.locator('svg path')).toHaveCount(1);
 const saved=page.waitForEvent('download');
 await page.getByRole('button',{name:'JSON speichern'}).click();
 const file=await saved;
 const fs=require('node:fs');
 const data=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
 expect(data.wires).toEqual([{a:'A1',b:'B1',fromTerminal:'1',toTerminal:'L'}]);
 await page.locator('input[type="file"]').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
 await expect(page.locator('svg path')).toHaveCount(1);
 await page.locator('svg [data-id="A1"] rect').click();
 await page.getByRole('button',{name:'Auswahl löschen'}).click();
 await expect(page.locator('svg path')).toHaveCount(0);
 await page.getByRole('button',{name:'Rückgängig'}).click();
 await expect(page.locator('svg path')).toHaveCount(1);
});


test('camera manual capture transfers reviewed component to schematic without inferred wires',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.locator('#type').selectOption('Relais');
 await page.locator('#brand').fill('Testhersteller');
 await page.locator('#model').fill('R-42');
 await page.locator('#record').click();
 await expect(page.locator('#component-list li')).toHaveCount(1);
 page.on('dialog',async dialog=>{await dialog.accept(dialog.message().includes('Bauteilkennung')?'K1':'A1,A2');});
 await page.getByRole('button',{name:'Im Schaltplan verwenden'}).click();
 await expect(page.locator('svg [data-id="K1"]')).toBeVisible();
 const saved=page.waitForEvent('download');
 await page.getByRole('button',{name:'JSON speichern'}).click();
 const download=await saved;
 const fs=require('node:fs');
 const project=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 expect(project.symbols[0]).toMatchObject({id:'K1',manufacturer:'Testhersteller',model:'R-42',manualTerminals:['A1','A2'],origin:'manual'});
 expect(project.wires).toEqual([]);
 expect(errors).toEqual([]);
});

test('camera photo preview and unsupported OCR remain safe',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.locator('#gallery').setInputFiles({name:'sample.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/B2sAAAAASUVORK5CYII=','base64')});
 await expect(page.locator('#preview')).toBeVisible();
 await page.locator('#read-image-text').click();
 await expect(page.locator('#image-text-result')).toContainText(/manuell|prüfen|erkannt|fehlgeschlagen|verfügbar/i);
 expect(errors).toEqual([]);
});


test('final acceptance: saved component survives reload and rejects duplicate terminals',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.evaluate(()=>localStorage.removeItem('elektroplan-components'));
 await page.reload();
 await page.locator('#type').selectOption('Relais');
 await page.locator('#brand').fill('Pruefhersteller');
 await page.locator('#model').fill('SAFE-17');
 await page.locator('#record').click();
 await expect(page.locator('#component-list li')).toHaveCount(1);
 await page.reload();
 await expect(page.locator('#component-list li')).toContainText(['Pruefhersteller']);
 page.on('dialog',async d=>d.accept(d.message().includes('Bauteilkennung')?'SAFE1':'A1,A1'));
 await page.getByRole('button',{name:'Im Schaltplan verwenden'}).click();
 await expect(page.locator('#result')).toContainText('Anschlüsse prüfen');
 await expect(page).toHaveURL(/index\.html$/);
 expect(await page.evaluate(()=>sessionStorage.getItem('elektroplan-schematic-import'))).toBeNull();
 expect(errors).toEqual([]);
});
test('final acceptance: transferred component survives JSON export and re-import',async({page})=>{
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.evaluate(()=>localStorage.removeItem('elektroplan-components'));
 await page.reload();
 await page.locator('#type').selectOption('Relais');
 await page.locator('#brand').fill('Pruefhersteller');
 await page.locator('#model').fill('SAFE-18');
 await page.locator('#record').click();
 page.on('dialog',async d=>d.accept(d.message().includes('Bauteilkennung')?'SAFE2':'A1,A2'));
 await page.getByRole('button',{name:'Im Schaltplan verwenden'}).click();
 await expect(page.locator('svg [data-id="SAFE2"]')).toHaveCount(1);
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'JSON speichern'}).click();
 const file=await downloadPromise;
 const fs=require('node:fs');
 const project=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
 expect(project.symbols[0]).toMatchObject({id:'SAFE2',manualTerminals:['A1','A2'],manufacturer:'Pruefhersteller',model:'SAFE-18'});
 expect(project.wires).toEqual([]);
 await page.reload();
 await page.locator('input[type="file"]').setInputFiles({name:'acceptance.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
 await expect(page.locator('svg [data-id="SAFE2"]')).toHaveCount(1);
});


test('final acceptance: camera file input previews an image on mobile viewport',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:browser.browserType().name()!=='firefox'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.locator('#camera').setInputFiles({name:'camera-sample.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/B2sAAAAASUVORK5CYII=','base64')});
 await expect(page.locator('#preview')).toBeVisible();
 await expect(page.locator('#status')).toContainText('Bild erfolgreich angezeigt');
 expect(errors).toEqual([]);
 await context.close();
});
test('final acceptance: invalid schematic transfer cannot inject a component',async({page})=>{
 await page.goto(url);
 await page.evaluate(()=>sessionStorage.setItem('elektroplan-schematic-import',JSON.stringify({id:'BAD',manualTerminals:['A1','A1'],manufacturer:'Unsafe'})));
 await page.reload();
 await expect(page.locator('svg [data-id="BAD"]')).toHaveCount(0);
 await expect(page.locator('.eps-canvas')).toBeVisible();
});


test('release gate: rejected schematic import does not erase a valid project',async({page})=>{
 await page.goto(url);
 const valid={version:1,symbols:[{id:'KEEP1',x:100,y:100,manualTerminals:['A1','A2']}],wires:[]};
 await page.locator('input[type="file"]').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))});
 await expect(page.locator('svg [data-id="KEEP1"]')).toHaveCount(1);
 const invalid={version:1,symbols:[{id:'BROKEN',x:100,y:100,manualTerminals:['A1','A1']}],wires:[]};
 await page.locator('input[type="file"]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
 await expect(page.locator('svg [data-id="KEEP1"]')).toHaveCount(1);
 await expect(page.locator('svg [data-id="BROKEN"]')).toHaveCount(0);
});
test('release gate: image OCR never fills manufacturer or model without review',async({page})=>{
 await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
 await page.locator('#gallery').setInputFiles({name:'sample.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/B2sAAAAASUVORK5CYII=','base64')});
 await expect(page.locator('#preview')).toBeVisible();
 await page.locator('#read-image-text').click();
 await expect(page.locator('#brand')).toHaveValue('');
 await expect(page.locator('#model')).toHaveValue('');
});

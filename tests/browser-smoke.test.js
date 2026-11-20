const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('file://'+path.resolve(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'));
    await page.locator('[data-add="RCD"]').click();
    await page.locator('[data-add="LS"]').click();
    if(await page.locator('#symbols > g').count()!==2)throw Error('Adding symbols failed');
    await page.locator('#undoEdit').click();
    if(await page.locator('#symbols > g').count()!==1)throw Error('Undo failed');
    await page.locator('#redoEdit').click();
    if(await page.locator('#symbols > g').count()!==2)throw Error('Redo failed');
    await page.locator('#wireMode').click();
    await page.locator('#symbols > g').nth(0).tap();
    await page.locator('#symbols > g').nth(1).tap();
    if(await page.locator('#wires > path').count()!==1)throw Error('Touch wiring failed');
    await page.locator('#checkPlan').click();
    if(!await page.locator('#planCheckResult').isVisible())throw Error('Structural validation not displayed');
    await page.locator('[data-tab="camera"]').click();
    if(!await page.locator('#takePhoto').count() || !await page.locator('#choosePhoto').count())throw Error('Camera inputs missing');
    await page.locator('[data-tab="plan"]').click();
    await page.locator('#savePlan').click();
    if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
    console.log('Mobile Chromium smoke test passed: add, undo, redo, tabs, camera controls, save');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

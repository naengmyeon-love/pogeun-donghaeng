/* Isolated offline browser QA for the self-contained presentation. */
const {chromium}=require('/Users/beomjun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline=process.argv.includes('--baseline');
const output=path.join(root,'qa',baseline?'baseline':'.');
fs.mkdirSync(output,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const main=manifest.slides,appendix=manifest.slideSequences.flatMap(s=>s.slides),slides=[...main,...appendix];
const duration=main.reduce((n,s)=>n+s.endTime-s.startTime,0);
if(!baseline){assert.equal(main.length,21);assert.equal(appendix.length,5);assert.equal(duration,900);}
const screenshotPaths=[];
const pageScene=page=>page.evaluate(()=>document.querySelector('hyperframes-slideshow').controller.currentSlide.sceneId);
async function seek(page,id){
  await page.waitForFunction(()=>document.querySelector('hyperframes-slideshow')?.controller);
  await page.waitForFunction(id=>document.querySelector('hyperframes-slideshow').controller.currentSlide.sceneId===id,id);
}
function contactSheet(){
  const script=`from PIL import Image, ImageDraw
from pathlib import Path
import sys, math
files=[Path(x) for x in sys.argv[2:]]
w,h,gap,label,cols=480,270,6,28,4
sheet=Image.new('RGB',(cols*(w+gap)+gap,math.ceil(len(files)/cols)*(h+label+gap)+gap),'#d3d8e1')
draw=ImageDraw.Draw(sheet)
for i,f in enumerate(files):
 x=gap+(i%cols)*(w+gap);y=gap+(i//cols)*(h+label+gap)
 im=Image.open(f).convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
 sheet.paste(im,(x,y));draw.text((x+7,y+h+6),f.stem,fill='#1b293e')
sheet.save(sys.argv[1],quality=93)
`;
  execFileSync('python3',['-c',script,path.join(output,'contact-sheet.jpg'),...screenshotPaths]);
}

(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const context=await browser.newContext({viewport:{width:1920,height:1080},offline:true});
  const errors=[],externalRequests=[],layout=[];
  context.on('page',p=>{p.on('pageerror',error=>errors.push(error.message));p.on('request',r=>{if(/^https?:/i.test(r.url()))externalRequests.push(r.url());});});
  try{
    const composition=await context.newPage();
    await composition.goto('file://'+path.join(root,'composition/index.html'));
    await composition.waitForFunction(()=>typeof window.__hfSetTime==='function');
    await composition.evaluate(()=>document.fonts.ready);
    for(let i=0;i<slides.length;i++){
      const slide=slides[i];
      await composition.evaluate(t=>window.__hfSetTime(t),slide.startTime+0.25);
      const result=await composition.evaluate(id=>{
        const scene=document.getElementById('scene-'+id),body=scene.querySelector('.slide-body'),footer=scene.querySelector('.footer');
        const bounds=scene.getBoundingClientRect(),out=[];
        for(const el of scene.querySelectorAll('*')){
          const style=getComputedStyle(el),r=el.getBoundingClientRect();
          if(!r.width||!r.height||style.display==='none'||style.visibility==='hidden')continue;
          if(r.left<bounds.left-1||r.right>bounds.right+1||r.top<bounds.top-1||r.bottom>bounds.bottom+1){
            let clipped=false;
            for(let p=el.parentElement;p&&p!==scene;p=p.parentElement){const css=getComputedStyle(p);if(['hidden','clip'].includes(css.overflow)||['hidden','clip'].includes(css.overflowY)||['hidden','clip'].includes(css.overflowX)){clipped=true;break;}}
            if(!clipped)out.push({tag:el.tagName,class:el.className,text:el.textContent.trim().slice(0,90),rect:{x:r.x,y:r.y,width:r.width,height:r.height}});
          }
        }
        return {scene:id,bodyBottom:body.getBoundingClientRect().bottom,footerTop:footer.getBoundingClientRect().top,out};
      },slide.sceneId);
      layout.push(result);
      const screenshot=path.join(output,`slide-${String(i+1).padStart(2,'0')}.png`);
      await composition.screenshot({path:screenshot});screenshotPaths.push(screenshot);
    }
    contactSheet();
    const page=await context.newPage();
    await page.goto('file://'+path.join(root,'포근동행-15분-발표.html'));
    await seek(page,main[0].sceneId);
    const sequence=[await pageScene(page)];
    for(let i=1;i<main.length;i++){
      await page.locator('[data-hf-next]').click();await seek(page,main[i].sceneId);sequence.push(await pageScene(page));
    }
    assert.deepEqual(sequence,main.map(s=>s.sceneId));
    await page.keyboard.press('ArrowLeft');await seek(page,main.at(-2).sceneId);
    const backwards=await pageScene(page);
    await page.keyboard.press('ArrowRight');await seek(page,main.at(-1).sceneId);
    await page.locator('[data-hotspot-id]').click();await seek(page,appendix[0].sceneId);
    const appendixSequence=[await pageScene(page)];
    for(let i=1;i<appendix.length;i++){
      await page.locator('[data-hf-next]').click();await seek(page,appendix[i].sceneId);appendixSequence.push(await pageScene(page));
    }
    assert.deepEqual(appendixSequence,appendix.map(s=>s.sceneId));
    // The shared deck controller returns to the originating main slide after the final appendix.
    await page.locator('[data-hf-next]').click();await seek(page,main.at(-1).sceneId);
    const popupPromise=page.waitForEvent('popup');
    await page.locator('[data-hf-present]').click();
    const audience=await popupPromise;
    await seek(audience,main.at(-1).sceneId);
    const notes=page.locator('[data-hf-presenter-notes]');await notes.waitFor();
    const presenterNotes=await notes.inputValue();assert.ok(presenterNotes.includes(main.at(-1).notes.slice(0,30)));
    await notes.fill(presenterNotes+'\nQA 저장 확인');
    await page.locator('hyperframes-slideshow').focus();await page.keyboard.press('ArrowLeft');
    await seek(page,main.at(-2).sceneId);await seek(audience,main.at(-2).sceneId);
    const audienceSync=await pageScene(audience);
    await page.locator('[data-hf-next]').click();await seek(page,main.at(-1).sceneId);
    assert.ok((await page.locator('[data-hf-presenter-notes]').inputValue()).endsWith('QA 저장 확인'));
    await page.locator('[data-hf-presenter-notes]').fill(presenterNotes);
    await page.screenshot({path:path.join(output,'presenter.png')});
    const badLayout=layout.filter(s=>s.out.length||s.bodyBottom>s.footerTop-8);
    const ui={checkedAt:new Date().toISOString(),offline:true,mainSlides:main.length,appendixSlides:appendix.length,durationSeconds:duration,errors,externalRequests,sequence,appendixSequence,backwards,presenterNotes:presenterNotes.slice(0,180),presenterNotePersistence:true,audienceSync};
    fs.writeFileSync(path.join(output,'layout.json'),JSON.stringify({errors:badLayout,results:layout},null,2));
    fs.writeFileSync(path.join(output,'ui-check.json'),JSON.stringify(ui,null,2));
    assert.deepEqual(errors,[]);assert.deepEqual(externalRequests,[]);assert.deepEqual(badLayout,[]);
    console.log(JSON.stringify({pass:true,mainSlides:main.length,appendixSlides:appendix.length,durationSeconds:duration,offlineRequests:externalRequests.length,layoutIssues:badLayout.length,contactSheet:path.join(output,'contact-sheet.jpg')}));
  }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});

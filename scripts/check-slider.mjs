import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const js=fs.readFileSync('assets/scripts/app.js','utf8');
const slider=js.split('// Home photographic hero slider')[1].split('// Subtle scroll depth')[0];
function element(names=[]) { const classes=new Set(names); return {classList:{contains:n=>classes.has(n),toggle:(n,on)=>on?classes.add(n):classes.delete(n)},attributes:{},setAttribute(n,v){this.attributes[n]=v},addEventListener(n,fn){this[n]=fn}}; }
const slides=[element(),element(['hero-logo-collage']),element(),element()];
const dots=slides.map(()=>element());
const copy=element();
const hero=element();hero.querySelectorAll=s=>s==='[data-hero-slide]'?slides:dots;hero.querySelector=()=>copy;
let tick;
const document={querySelector:()=>hero,addEventListener(){},hidden:false};
vm.runInNewContext(slider,{document,setInterval(fn){tick=fn;return 1},clearInterval(){}});
assert.equal(copy.inert,false);assert.equal(copy.attributes['aria-hidden'],'false');
dots[1].click();assert(hero.classList.contains('is-logo-slide'));assert.equal(copy.inert,true);assert.equal(copy.attributes['aria-hidden'],'true');assert.equal(dots[1].attributes['aria-current'],'true');
dots[2].click();assert(!hero.classList.contains('is-logo-slide'));assert.equal(copy.inert,false);assert.equal(copy.attributes['aria-hidden'],'false');
dots[0].click();tick();assert(hero.classList.contains('is-logo-slide'));tick();assert(!hero.classList.contains('is-logo-slide'));
console.log('OK: slider 1 → 2 → 3 and automatic advance toggle copy and keep controls.');

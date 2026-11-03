import fs from 'node:fs';
import assert from 'node:assert/strict';
const css=fs.readFileSync('assets/styles/main.css','utf8');
const js=fs.readFileSync('assets/scripts/app.js','utf8');
assert(!/page-(?:leaving|ready|entered)/.test(css+js),'No hidden-page or curtain lifecycle');
assert(!css.includes('body::before'),'No full-page curtain');
assert(css.includes('@view-transition{navigation:auto}'));
assert(css.includes('@view-transition{navigation:none}'),'Reduced-motion opt-out');
assert(css.includes('::view-transition-old(root){animation:none;opacity:1;'),'Outgoing page stays visible');
assert(css.includes('::view-transition{pointer-events:none}'),'Transition does not trap clicks');
assert(!js.includes('event.preventDefault()'),'Navigation remains native');
for(const file of ['index.html','productos/index.html','catalogo/index.html','nosotros/index.html','contacto/index.html','productos/ptr-cuadrado/index.html']){
 const page=fs.readFileSync(file,'utf8');
 const cssVersion=file==='index.html' ? 'logos-20261103' : file==='catalogo/index.html' ? 'chulavista-20261103' : 'crossfade-20261102';
 const jsVersion=file==='index.html' ? 'logos-20261103' : 'crossfade-20261102';
 assert(page.includes(`main.css?v=${cssVersion}`),`CSS cache version: ${file}`);
 assert(page.includes(`app.js?v=${jsVersion}`),`JS cache version: ${file}`);
 assert(page.includes('defer blocking="render"'),'Header ready for incoming capture');
}
const catalog=fs.readFileSync('catalogo/index.html','utf8');
for(const slug of ['serviacero-electroforjados','integrinox-2026','aceros-innova-nord-steel','steelpark','plafimsa','abinox']){
 for(const kind of ['logo','cover']){
  const path=`assets/catalogo/portadas/${slug}-${kind}.webp`;
  assert(fs.statSync(path).size>100);assert(catalog.includes(path));
 }
}
assert(catalog.includes('chulavista-captura.jpeg'),'User-supplied cover screenshot is linked');
assert(fs.statSync('assets/catalogo/portadas/chulavista-captura.jpeg').size>100);
assert.equal((catalog.match(/class="supplier-cover(?: chulavista-cover)?"/g)||[]).length,7);
console.log('OK: native crossfade, reduced-motion opt-out, cache versions, six logo/cover pairs plus user-supplied Chulavista cover.');

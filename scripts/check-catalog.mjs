import fs from 'node:fs';
import assert from 'node:assert/strict';
const products = fs.readFileSync('productos/index.html','utf8');
const home = fs.readFileSync('index.html','utf8');
const catalog = fs.readFileSync('catalogo/index.html','utf8');
const ids = [...products.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Product IDs must be unique');
assert.equal((products.match(/data-product\s/g)||[]).length,26,'All 26 existing products must be preserved');
for(const area of ['aceros','valvulas','tuberias','conexiones','ferreteria','contra-incendio']){
 assert(ids.includes(area),`Missing area ${area}`);
 assert(home.includes(`productos/#${area}`),`Home lacks ${area}`);
 assert(catalog.includes(`productos/#${area}`),`Catalog lacks ${area}`);
}
for(const provider of ['Villacero','Miller','Worcester','Emsa','Truper','Milwaukee','Urrea'])assert(products.includes(provider),`Missing provider ${provider}`);
assert.equal((products.match(/<span>Acero al carbón<\/span>/g)||[]).length,2);
assert.equal((products.match(/<span>Acero inoxidable<\/span>/g)||[]).length,2);
assert.equal((products.match(/<details\b/g)||[]).length,(products.match(/<\/details>/g)||[]).length);
for(const s of [products,home,catalog]) assert(!s.includes('drive.google.com'),'No unverified private Drive link');
assert(fs.statSync('assets/catalogo/catalogo-ainsa-2026.pdf').size>1000,'Original catalog retained');
console.log('OK: 26 products, 6 area destinations, 7 requested providers, steel hierarchy and original PDF preserved.');

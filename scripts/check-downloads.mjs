import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const originals = {
  "serviacero-electroforjados.pdf": "06e12227d08fd8b1cb3ac7fc49171a1320b2ed4759925f3d90030f596a3a1ace",
  "integrinox-2026.pdf": "c1bb7b3617efa3d4226399781725a88c469b1caf66a828d3e25cf9fd990da0e4",
  "aceros-innova-nord-steel.pdf": "334baccfe16739c74646605ade99c4fd428d01421343d7b8db53b808ec68bbfa",
  "steelpark.pdf": "f095bf22595e98a8102f825c4cc41de54fa74d09c68ef59b09e6fe3bd6fc7927",
  "plafimsa.pdf": "f7cdeb2a4b5b3fdd875c811dd57af5d8ce5bc071f74dc042946a9f05abc81996",
  "chulavista.pdf": "7e753c50ad112dfa4817f883f0a2ebc57551089294f9fdfb57cedf87b0835d6c",
  "abinox.ppsx": "06562459e6494149851027dfca3e14d5d962a7bf6a42d8a79215e3a4b8fbbbe8"
};
const catalog=fs.readFileSync('catalogo/index.html','utf8');
const products=fs.readFileSync('productos/index.html','utf8');
for (const [name,sha] of Object.entries(originals)) {
 const path='assets/catalogo/proveedores/'+name;
 assert.equal(createHash('sha256').update(fs.readFileSync(path)).digest('hex'),sha,`Original altered: ${name}`);
 assert(catalog.includes('../'+path),`Missing library download: ${name}`);
 assert(products.includes('../'+path),`Missing contextual download: ${name}`);
}
assert.equal((catalog.match(/class="supplier-card download-card"/g)||[]).length,7);
assert(!products.split('id="contra-incendio"')[1].split('</section>')[0].includes('/proveedores/'),'No unsupported fire-protection association');
assert(catalog.includes('Descargar PPSX'),'Slideshow must not be labeled PDF');
console.log('OK: 7 original provider files, library/context links and file-type labels verified.');

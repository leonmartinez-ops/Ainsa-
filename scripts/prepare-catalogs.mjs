// Reassemble large original downloads for Netlify; never convert or re-save them.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const originals = {
 'steelpark.pdf': 'f095bf22595e98a8102f825c4cc41de54fa74d09c68ef59b09e6fe3bd6fc7927',
 'abinox.ppsx': '06562459e6494149851027dfca3e14d5d962a7bf6a42d8a79215e3a4b8fbbbe8'
};
for (const [name,expected] of Object.entries(originals)) {
 const data=Buffer.concat([1,2,3].map(n=>fs.readFileSync(`catalog-source-chunks/${name}.${n}.part`)));
 const actual=createHash('sha256').update(data).digest('hex');
 if(actual!==expected) throw new Error(`Original catalog integrity check failed: ${name}`);
 fs.writeFileSync(`assets/catalogo/proveedores/${name}`,data);
 console.log(`Verified original: ${name} (${data.length} bytes)`);
}
// The public deployment contains original documents, not packaging fragments.
fs.rmSync('catalog-source-chunks',{recursive:true});

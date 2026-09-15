import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const html=[];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{const p=path.join(d,e.name);e.isDirectory()?(!['node_modules','.git'].includes(e.name)&&walk(p)):e.name.endsWith('.html')&&html.push(p)});walk(root);
let errors=[];
for(const file of html){const text=fs.readFileSync(file,'utf8');for(const m of text.matchAll(/(?:src|href)="([^"#]+)"/g)){const value=m[1];if(/^(https?:|mailto:|tel:)/.test(value)||value.startsWith('?'))continue;const clean=value.split('?')[0];const target=path.resolve(path.dirname(file),clean);if(!fs.existsSync(target))errors.push(`${path.relative(root,file)} -> ${value}`)}}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`OK: ${html.length} páginas HTML; enlaces locales verificados.`);

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(here, f), 'utf8');
const html = read('animation.template.html')
  .replace('<!--STAGE_KIT-->', read('stage-kit.txt'))
  .replace('<!--SOUND_KIT-->', read('sound-kit.txt'));
writeFileSync(join(here, 'pickle-line.html'), html, 'utf8');
console.log('pickle-line.html written:', html.length, 'bytes');

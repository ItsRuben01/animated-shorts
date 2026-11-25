import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(here, f), 'utf8');
const stage = read('stage-kit.txt');
const sound = read('sound-kit.txt');
const html = read('storyboard.template.html')
  .replace('<!--STAGE_KIT-->', stage)
  .replace('<!--SOUND_KIT-->', sound);
writeFileSync(join(here, 'storyboard.html'), html, 'utf8');
console.log('storyboard.html written:', html.length, 'bytes');

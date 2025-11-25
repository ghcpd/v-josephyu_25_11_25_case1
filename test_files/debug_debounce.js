import { FileWatcher } from '../filewatcher.js';
import path from 'path';
import fs from 'fs';

const testDir = path.resolve('./test_files/features/debug_debounce');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

const watcher = new FileWatcher(testDir, {});
watcher.debounceEvents(200);
watcher.on('change', (e)=> console.log('change raw', e));
watcher.on('debouncedChange', (e)=> console.log('debouncedChange', e));
watcher.start();

setTimeout(()=>{
  fs.writeFileSync(`${testDir}/a.txt`, '1');
  fs.writeFileSync(`${testDir}/b.txt`, '2');
  console.log('written two files');
}, 200);

setTimeout(()=>{watcher.stop(); process.exit(0);}, 1000);

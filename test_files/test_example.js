import { FileWatcher } from '../filewatcher.js';
import fs from 'fs';

const dir = './tmp_watch';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const watcher = new FileWatcher(dir, { recursiveMode: true, logFile: './tmp_watch/log.txt' });
watcher.on('change', (e) => console.log('change', e));
watcher.on('debouncedChange', (e) => console.log('debounced', e));
watcher.on('stopped', () => console.log('stopped'));

watcher.debounceEvents(200);
watcher.start();

setTimeout(() => {
  fs.writeFileSync(`${dir}/file1.txt`, 'hello');
}, 500);

setTimeout(async () => {
  try {
    const r = await watcher.waitForFile('file1.txt', 2000);
    console.log('waitForFile resolved:', r);
  } catch (err) {console.error('waitForFile error', err.message)}
  watcher.stop();
}, 1500);

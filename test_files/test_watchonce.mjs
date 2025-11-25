import fs from 'fs';
import path from 'path';
import { FileWatcher } from '../filewatcher.js';

const dir = path.resolve('./tmp_watch2');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const watcher = new FileWatcher(dir, { logFile: './tmp_watch2/log.txt' });

watcher.on('change', (e) => console.log('change', e));
watcher.start();

setTimeout(() => {
  fs.writeFileSync(path.join(dir, 'once.txt'), 'data');
}, 400);

watcher.watchOnce('once.txt').then(r => console.log('watchOnce resolved', r)).catch(e => console.error(e));

setTimeout(() => watcher.stop(), 1000);

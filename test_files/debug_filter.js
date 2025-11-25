import { FileWatcher } from '../filewatcher.js';
import path from 'path';
import fs from 'fs';

const testDir = path.resolve('./test_files/features/debug');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

const watcher = new FileWatcher(testDir, {filter: /\.txt$/});
watcher.on('change',(e)=>{console.log('RAW change', e);});
watcher.start();

fs.writeFileSync(`${testDir}/a.log`,`log`);
fs.writeFileSync(`${testDir}/a.txt`,`txt`);

setTimeout(()=>{watcher.stop(); process.exit(0);}, 500);

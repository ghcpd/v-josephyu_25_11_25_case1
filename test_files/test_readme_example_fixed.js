import { FileWatcher } from '../filewatcher.js';
import path from 'path';
import fs from 'fs';

const logsDir = path.resolve('./test_files/logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const watcher = new FileWatcher(logsDir, { recursive: true, usePolling: true });

watcher.on('change', (event) => {
  console.log('File changed:', event.filename, 'type:', event.eventType);
});

watcher.start();

// Create a file to trigger change
setTimeout(() => {
  const filePath = `${logsDir}/example.log`;
  fs.writeFileSync(filePath, 'test');
  console.log('Wrote file to trigger event');
}, 500);

// Stop after a brief delay
setTimeout(() => {
  watcher.stop();
  console.log('Stopped watcher');
}, 2000);

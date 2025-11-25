import { FileWatcher } from '../filewatcher.js';
import path from 'path';

const logsDir = path.resolve('./test_files/logs');
const watcher = new FileWatcher(logsDir, { recursiveMode: true });

watcher.on('change', (event) => {
  console.log('File changed:', event.filename, 'type:', event.eventType);
});

watcher.start();

// Create a file to trigger change
setTimeout(() => {
  const fs = require('fs');
  const filePath = `${logsDir}/example.log`;
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  fs.writeFileSync(filePath, 'test');
  console.log('Wrote file to trigger event');
}, 500);

// Stop after a brief delay
setTimeout(() => {
  watcher.stop();
  console.log('Stopped watcher');
}, 2000);

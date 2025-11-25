import fs from 'fs';
import assert from 'assert';
import { FileWatcher } from '../filewatcher.js';

(async () => {
  // ensure logs dir
  const logsDir = './logs';
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

  // Use README example (incorrect option name `recursiveMode`)
  const watcher1 = new FileWatcher(logsDir, { recursiveMode: true });
  console.log('watcher1.recursive:', watcher1.recursive);
  watcher1.on('change', (e) => console.log('watcher1 change:', e));
  watcher1.on('stopped', () => console.log('watcher1 stopped'));
  watcher1.start();

  // Use correct option name `recursive`
  const watcher2 = new FileWatcher(logsDir, { recursive: true });
  console.log('watcher2.recursive:', watcher2.recursive);
  watcher2.on('change', (e) => console.log('watcher2 change:', e));
  watcher2.start();

  // Test debounceEvents and waitForFile
  watcher2.debounceEvents(200);
  watcher2.on('debouncedChange', (e) => console.log('debouncedChange:', e));

  // Touch a file to trigger events
  const fileNameOnly = 'testfile_' + Date.now() + '.txt';
  const fullPath = `${logsDir}/${fileNameOnly}`;
  fs.writeFileSync(fullPath, 'hello');
  console.log('Wrote file:', fullPath);

  // Wait for waitForFile to succeed
  try {
    // waitForFile expects a filename relative to the watcher's targetDir
    const ok = await watcher2.waitForFile(fileNameOnly, 3000);
    console.log('waitForFile result:', ok);
    assert.ok(ok === true, 'waitForFile should resolve true');
  } catch (err) {
    console.error('waitForFile error:', err.message);
    process.exitCode = 1;
  }

  // Stop watchers after short delay
  setTimeout(() => {
    watcher1.stop();
    watcher2.stop();
  }, 1000);
})();
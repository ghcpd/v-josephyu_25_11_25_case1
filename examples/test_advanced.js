import fs from 'fs';
import assert from 'assert';
import { FileWatcher } from '../filewatcher.js';

(async () => {
  const logsDir = './logs';
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
  const logFilePath = './watch.log';
  if (fs.existsSync(logFilePath)) fs.unlinkSync(logFilePath);

  // Create watcher with filter and logFile
  const watcher = new FileWatcher(logsDir, { filter: /\.log$/i, logFile: logFilePath, usePolling: true });
  console.log('watcher.filter:', watcher.filter);
  console.log('watcher.logFile:', watcher.logFile);
  watcher.on('change', (e) => console.log('change:', e));
  watcher.on('debouncedChange', (e) => console.log('debouncedChange:', e));
  watcher.debounceEvents(50);
  watcher.start();

  // Create a file that should be ignored by filter
  const ignored = `${logsDir}/ignored.txt`;
  fs.writeFileSync(ignored, 'ignored');
  console.log('Wrote ignored file:', ignored);

  // Create a file that should match filter
  const match = `${logsDir}/match.LOG`;
  fs.writeFileSync(match, 'match');
  console.log('Wrote match file:', match);

  // Test waitForFile with correct input (filename only)
  try {
    const ok = await watcher.waitForFile('match.LOG', 2000);
    console.log('waitForFile result for match.LOG:', ok);
    assert.ok(ok === true, 'waitForFile should resolve true for match.LOG');
  } catch (err) {
    console.error('waitForFile error:', err.message);
    process.exitCode = 1;
  }

  // Test watchOnce (deprecated)
  // create the file for watchOnce *before* awaiting the watcher
  fs.writeFileSync(`${logsDir}/once.txt`, 'once');
  try {
    await watcher.watchOnce('once.txt');
    console.log('watchOnce succeeded for once.txt');
  } catch (err) {
    console.error('watchOnce failed', err.message);
    process.exitCode = 1;
  }

  // wait a bit and stop
  setTimeout(() => {
    watcher.stop();
    const logfileExists = fs.existsSync(logFilePath);
    console.log('log file created?', logfileExists);
    try {
      assert.ok(logfileExists, 'log file should be created when logFile option is set');
      console.log('log file contents:\n', fs.readFileSync(logFilePath, 'utf8'));
    } catch (err) {
      console.error('log-file check failed:', err.message);
      process.exitCode = 1;
    }
  }, 1000);
})();
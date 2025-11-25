import { FileWatcher } from '../filewatcher.js';
import path from 'path';
import fs from 'fs';

const testDir = path.resolve('./test_files/features');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

function wait(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

async function testDebounce(){
  const subdir = path.resolve(`${testDir}/debounce`);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const watcher = new FileWatcher(subdir, { recursive: false, usePolling: true });
  let debouncedCount = 0;
  watcher.debounceEvents(200);
  watcher.on('debouncedChange', (e) => {
    console.log('debouncedChange event', e.filename);
    debouncedCount++;
  });
  watcher.start();
  await wait(100);
  fs.writeFileSync(`${subdir}/a_${Date.now()}.txt`,'1');
  fs.writeFileSync(`${subdir}/b_${Date.now()}.txt`,'2');
  await wait(500);
    await wait(200);
  return debouncedCount >= 1; // expect at least 1
}
    await wait(1500);
async function testWaitForFile(){
  const subdir = path.resolve(`${testDir}/wait`);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const watcher = new FileWatcher(subdir, { recursive: false, usePolling: true });
  watcher.start();
  await wait(100);
  // waitForFile should resolve when file is created
  const name = `wait_for_me_${Date.now()}.txt`;
  const p = watcher.waitForFile(name, 2000);
    setTimeout(()=> fs.writeFileSync(`${subdir}/${name}`, 'x'), 500);
  const result = await p.then(()=>true).catch(()=>false);
  watcher.stop();
  return result;
}

async function testFilterAndLog(){
  const subdir = path.resolve(`${testDir}/filter`);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const logFile = `${subdir}/events_${Date.now()}.log`;
  const watcher = new FileWatcher(subdir, { filter: /\.txt$/, logFile, usePolling: true });
  let events=0;
  watcher.on('change', (e)=> events++);
  watcher.start();
  await wait(100);
  fs.writeFileSync(`${subdir}/a.log`, 'not match'); // should be filtered out
  fs.writeFileSync(`${subdir}/a.txt`, 'match'); // should count
    await wait(1500);
  watcher.stop();
  const logContents = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
  return {events, logContentsIncluded: logContents.includes('Event:')};
}

async function testWatchOnceDeprecated(){
  const subdir = path.resolve(`${testDir}/once`);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const watcher = new FileWatcher(subdir, { usePolling: true });
  watcher.start();
  await wait(100);
  const name = `one_${Date.now()}.txt`;
  const p = watcher.watchOnce(name);
    setTimeout(()=> fs.writeFileSync(`${subdir}/${name}`,'x'), 500);
  const ok = await p.then(()=> true).catch(()=> false);
  watcher.stop();
  return ok;
}

async function testLogsHistory(){
  const subdir = path.resolve(`${testDir}/logs`);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const logFile = `${subdir}/events_${Date.now()}.log`;
  const watcher = new FileWatcher(subdir, { logFile, usePolling: true });
  watcher.start();
  await wait(100);
  fs.writeFileSync(`${subdir}/x.txt`, 'x');
    await wait(1500);
  watcher.stop();
  return watcher.logs.length > 0 && fs.existsSync(logFile);
}

(async ()=>{
  console.log('Starting feature tests');
  const d = await testDebounce();
  console.log('Debounce test:', d);
  const w = await testWaitForFile();
  console.log('WaitForFile test:', w);
  const f = await testFilterAndLog();
  console.log('Filter and log test:', f);
  const ow = await testWatchOnceDeprecated();
  console.log('WatchOnce (deprecated) test:', ow);
  const lh = await testLogsHistory();
  console.log('Logs history (logFile) test:', lh);
  // allow 1 or more events for filtered file since platforms may emit multiple event types
  console.log('raw values: ', {d, w, f, ow, lh});
  console.log('raw types: ', {d: typeof d, w: typeof w, f_events: typeof f.events, f_logIncluded: typeof f.logContentsIncluded, ow: typeof ow, lh: typeof lh});
  const allPass = d && w && f.events >= 1 && f.logContentsIncluded && ow && lh;
  console.log('ALL PASS:', allPass);
  process.exit(allPass?0:1);
})();

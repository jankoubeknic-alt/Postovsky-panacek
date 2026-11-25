// Projde obec v headless Chromu přes CDP: kroky jsou [karta|?, cil] a po vybraných krocích uloží snímek.
import { spawn } from 'node:child_process';
const [,, obec, krokyJson, vystup] = process.argv;
const kroky = JSON.parse(krokyJson);
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9333', `--user-data-dir=${vystup}/profil`, '--window-size=390,844', 'about:blank'], { stdio: 'ignore' });
const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, cislo = 0; const cekajici = new Map(); const logy = [];
for (let i = 0; i < 50; i++) { try { const r = await fetch('http://127.0.0.1:9333/json/list'); const t = (await r.json()).find((x) => x.type === 'page'); if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); break; } } catch {} await cekej(200); }
await new Promise((r) => ws.addEventListener('open', r));
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && cekajici.has(m.id)) { cekajici.get(m.id)(m); cekajici.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logy.push('VÝJIMKA ' + JSON.stringify(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logy.push('console.error ' + JSON.stringify(m.params.args.map((a) => a.value))); });
const cdp = (method, params = {}) => new Promise((r) => { const id = ++cislo; cekajici.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const snimek = async (jmeno) => { const r = await cdp('Page.captureScreenshot', { format: 'png' }); (await import('node:fs')).writeFileSync(`${vystup}/${jmeno}.png`, Buffer.from(r.result.data, 'base64')); };
await cdp('Runtime.enable'); await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await cdp('Page.navigate', { url: (process.env.POSTAK_URL || 'http://127.0.0.1:8765/') + '#debug' });
for (let i = 0; i < 100 && !(await js(`[...document.querySelectorAll('.zastavka__tlacitko')].some(b => b.textContent.includes(${JSON.stringify(obec)}))`)); i++) await cekej(200);
await js(`[...document.querySelectorAll('.zastavka__tlacitko')].find(b => b.textContent.includes(${JSON.stringify(obec)})).click()`); await cekej(700);
for (let i = 0; i < 50 && !(await js(`[...document.querySelectorAll('.arch button')].some(b => /Vyrazit|Pokračovat/.test(b.textContent))`)); i++) await cekej(200);
await snimek('0-uvod');
// Před první obcí kapitoly může být mezihra (taky s tlačítkem Pokračovat), pak teprve úvod obce.
for (let i = 0; i < 4 && (await js(`!!document.querySelector('.arch')`)); i++) {
  await js(`[...document.querySelectorAll('.arch button')].find(b => /Vyrazit|Pokračovat/.test(b.textContent))?.click()`); await cekej(700);
}
await cekej(200);
await snimek('1-start');
let n = 2;
for (const [karta, cil, foto] of kroky) {
  if (karta !== '?') await js(`document.querySelector('.zasilka[data-id="${karta}"]').click()`);
  await cekej(150);
  const ok = await js(`(() => { const c = document.querySelector('.cil[data-id="${cil}"]'); if (!c || c.hidden) return 'NEVIDITELNÝ ${cil}'; c.click(); return document.querySelector('.panel__text')?.textContent || 'bez panelu'; })()`);
  console.log(`${karta} → ${cil}: ${ok}`);
  await cekej(400);
  if (foto) await snimek(`${n++}-${foto}-panel`);
  await js(`document.querySelector('.panel')?.click()`); await cekej(1200);
  if (foto) await snimek(`${n++}-${foto}`);
}
await cekej(800); await snimek(`${n}-konec`);
console.log('stav:', await js(`document.querySelector('.ladeni')?.textContent`));
console.log(logy.length ? logy.join('\n') : 'bez chyb v konzoli');
ws.close(); chrome.kill();

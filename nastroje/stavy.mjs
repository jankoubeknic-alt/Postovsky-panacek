// Najde všechny stavy obce, ve kterých scéna vypadá jinak (vrstvy, viditelné cíle, změněné ikony a portréty),
// a každý vyfotí ve skutečné hře v headless Chromu. Výsledek je galerie k prohlédnutí.
//
//   node nastroje/stavy.mjs <obec> [<obec> ...]        vyfotí obce do nahledy_stavu/<obec>/ a obnoví nahledy_stavu/index.html
//   node nastroje/stavy.mjs --pocet <obec> [...]       jen vypíše, kolik různých vzhledů obec má
//
// Stavy prochází stejně jako over.mjs (všechny tahy od startu), navíc sleduje ikony cílů. Pro každý vzhled
// použije nejkratší cestu a uloží ho hře do localStorage jako rozehranou obec. Potřebuje server s webem
// (POSTAK_URL, výchozí http://127.0.0.1:8765/) a google-chrome. Vlajky světa z jiných obcí se nezapínají.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const KOREN = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const args = process.argv.slice(2);
const jenPocet = args[0] === '--pocet';
const obce = args.filter((a) => !a.startsWith('--'));
const URL_HRY = process.env.POSTAK_URL || 'http://127.0.0.1:8765/';
const VYSTUP = path.join(KOREN, 'nahledy_stavu');
const MAX_VZHLEDU = 80;

const csv = (dir, f) => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) return [];
  const r = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'));
  const h = r[0].split(';');
  return r.slice(1).map((l) => { const x = l.split(';'); return Object.fromEntries(h.map((k, i) => [k, (x[i] || '').trim()])); });
};
const sl = (s) => (s || '').split(/\s+/).filter(Boolean);
const etapy = csv(path.join(KOREN, 'data'), 'etapy.csv');

function vzhledy(obec) {
  const dir = path.join(KOREN, 'data', obec);
  const et = Object.fromEntries(csv(dir, 'etapa.csv').map((r) => [r.klic, r.hodnota]));
  const cile = csv(dir, 'cile.csv'), karty = csv(dir, 'karty.csv'), vrstvy = csv(dir, 'vrstvy.csv'), tahy = csv(dir, 'kazdy_tah.csv');
  const pr = [...csv(dir, 'kombinace.csv'), ...csv(path.join(KOREN, 'data'), 'spolecne.csv')];
  const PRIB = new Set(karty.filter((k) => k.druh === 'pribeh').map((k) => k.id)), SPEC = new Set(['?', 'napoveda']);
  const ukaz = sl(et.ukazatele).map((t) => { const [id, , max] = t.split(':'); return { id, max: Number(max) || 0 }; });
  const POR = /^([a-z_][a-z0-9_]*)(>=|<=|>|<|=)(-?\d+)$/i, ZM = /^([a-z_][a-z0-9_]*)([+\-=])(\d+)$/i;
  const platiVse = (s, slova) => slova.every((t) => {
    const n = t.startsWith('!'); const v = n ? t.slice(1) : t; let a; const m = v.match(POR);
    if (m) { const h = m[1] === 'karet' ? s.ruka.filter((k) => !PRIB.has(k)).length : s.poc[m[1]] || 0, x = +m[3]; a = { '>=': h >= x, '<=': h <= x, '>': h > x, '<': h < x, '=': h === x }[m[2]]; }
    else a = v.startsWith('@') ? s.ruka.includes(v.slice(1)) : s.vlajky.includes(v);
    return n ? !a : a;
  });
  const plati = (s, pod) => { const g = [[]]; for (const t of sl(pod)) t === 'nebo' ? g.push([]) : g[g.length - 1].push(t); return g.filter((x) => x.length || g.length === 1).some((x) => platiVse(s, x)); };
  const najdi = (s, k, c) => pr.find((p) => (p.karta === k || (p.karta === '*' && !SPEC.has(k) && !PRIB.has(k))) && (p.cil === c || p.cil === '*') && plati(s, p.podminka));
  const proved = (s, ef) => {
    for (const t of sl(ef)) {
      if (t === 'razitko' || t === 'cekej' || t.startsWith('svet:')) continue;
      if (t.startsWith('ikona:')) { const [, c, ...h] = t.split(':'); if (h.join(':')) s.ikony[c] = h.join(':'); else delete s.ikony[c]; }
      else if (t[0] === '+') { if (!s.ruka.includes(t.slice(1))) s.ruka.push(t.slice(1)); }
      else if (t[0] === '-') s.ruka = s.ruka.filter((x) => x !== t.slice(1));
      else if (t[0] === '!') s.vlajky = s.vlajky.filter((x) => x !== t.slice(1));
      else if (ZM.test(t)) { const [, nm, op, c] = t.match(ZM); const h = s.poc[nm] || 0; let v = op === '+' ? h + +c : op === '-' ? h - +c : +c; const u = ukaz.find((x) => x.id === nm); if (u) v = Math.max(0, u.max ? Math.min(u.max, v) : v); s.poc[nm] = v; }
      else if (!s.vlajky.includes(t)) s.vlajky.push(t);
    }
  };
  const uplyn = (n) => { const texty = []; if (et.kazdy_tah && plati(n, et.kazdy_tah_kdyz)) proved(n, et.kazdy_tah); for (const r of tahy) if (plati(n, r.podminka)) { proved(n, r.efekt); if (r.text) texty.push(r.text); } return texty; };
  const cekej = (p) => sl(p && p.efekt).includes('cekej');
  const klic = (s) => [...s.ruka].sort().join(',') + '|' + [...s.vlajky].sort().join(',') + '|' + JSON.stringify(Object.entries(s.poc).sort()) + '|' + JSON.stringify(Object.entries(s.ikony).sort());
  const cil = sl(et.cil);
  const konec = (s) => (cil.every((v) => s.vlajky.includes(v)) ? 'vyhra' : et.prohra && plati(s, et.prohra) ? 'prohra' : null);
  const poc0 = {}; for (const t of sl(et.pocitadla)) { const [k, v] = t.split('='); poc0[k] = +v || 0; }
  const viditelne = (s) => cile.filter((c) => !(c.skryt_kdyz && plati(s, c.skryt_kdyz)));
  const vzhled = (s) => ({ vrstvy: vrstvy.filter((v) => plati(s, v.podminka)).map((v) => v.obrazek.split('/').pop()), cile: viditelne(s).map((c) => `${c.id}=${s.ikony[c.id] || c.ikona}`) });

  const s0 = { ruka: sl(et.start), vlajky: [], poc: poc0, ikony: {} };
  const stavy = [s0], id = new Map([[klic(s0), 0]]), odkud = [null], fronta = [0];
  const pridej = (i, n, tah) => { const kn = klic(n); if (id.has(kn)) return; id.set(kn, stavy.length); stavy.push(n); odkud.push({ i, ...tah }); fronta.push(stavy.length - 1); };
  while (fronta.length) {
    const i = fronta.shift(), s = stavy[i];
    if (konec(s)) continue;
    for (const c of viditelne(s)) {
      const p = najdi(s, '?', c.id); if (!p || !sl(p.efekt).length) continue;
      const n = structuredClone(s); proved(n, p.efekt); const t = cekej(p) ? uplyn(n) : [];
      pridej(i, n, { karta: '?', cil: c.id, text: [p.text, ...t].join(' ') });
    }
    for (const k of s.ruka) for (const c of viditelne(s)) {
      const p = najdi(s, k, c.id); const n = structuredClone(s); if (p) proved(n, p.efekt);
      const t = !PRIB.has(k) || cekej(p) ? uplyn(n) : [];
      pridej(i, n, { karta: k, cil: c.id, text: [p ? p.text : '', ...t].filter(Boolean).join(' ') });
    }
  }
  // Pro každý vzhled první (nejkratší) stav a popis, čím se liší od startu.
  const vz0 = vzhled(s0), videne = new Map();
  stavy.forEach((s, i) => { const v = vzhled(s), k = JSON.stringify(v); if (!videne.has(k)) videne.set(k, { i, v }); });
  const cesta = (i) => { const c = []; while (odkud[i]) { c.unshift(odkud[i]); i = odkud[i].i; } return c; };
  const ikony0 = Object.fromEntries(vz0.cile.map((x) => x.split('=')));
  return [...videne.values()].map(({ i, v }) => {
    const zmeny = [];
    for (const x of v.vrstvy) if (!vz0.vrstvy.includes(x)) zmeny.push(`+vrstva ${x}`);
    for (const x of vz0.vrstvy) if (!v.vrstvy.includes(x)) zmeny.push(`−vrstva ${x}`);
    const ik = Object.fromEntries(v.cile.map((x) => x.split('=')));
    for (const [c, e] of Object.entries(ik)) { if (!(c in ikony0)) zmeny.push(`+cíl ${c} ${e}`); else if (ikony0[c] !== e) zmeny.push(`ikona ${c} ${e}`); }
    for (const c of Object.keys(ikony0)) if (!(c in ik)) zmeny.push(`−cíl ${c}`);
    const s = stavy[i];
    return { zmeny, cesta: cesta(i), stav: { ruka: s.ruka, vlajky: s.vlajky, pocitadla: s.poc, ikony: s.ikony, konec: null }, konec: konec(s) };
  });
}

if (jenPocet) {
  for (const o of obce) { const v = vzhledy(o); console.log(`${o}: ${v.length} vzhledů`); }
  process.exit(0);
}

// ---------- Focení ve hře ----------
const cekejMs = (ms) => new Promise((r) => setTimeout(r, ms));
const VERZE = (fs.readFileSync(path.join(KOREN, 'hra.js'), 'utf8').match(/const VERZE = '([^']+)'/) || [])[1] || 'v1';
// Profil Chromu leží v projektu: v dlouhé dočasné cestě by Chrome nezaložil svůj socket.
const profil = path.join(VYSTUP, '.profil');
fs.rmSync(profil, { recursive: true, force: true }); fs.mkdirSync(profil, { recursive: true });
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9336', `--user-data-dir=${profil}`, '--window-size=390,844', 'about:blank'], { stdio: 'ignore' });
let ws, cislo = 0; const cekajici = new Map();
for (let i = 0; i < 150 && !ws; i++) { try { const r = await fetch('http://127.0.0.1:9336/json/list'); const t = (await r.json()).find((x) => x.type === 'page' && x.url === 'about:blank'); if (t) ws = new WebSocket(t.webSocketDebuggerUrl); } catch {} if (!ws) await cekejMs(200); }
if (!ws) { console.log('Chrome se nespustil'); chrome.kill(); process.exit(1); }
await new Promise((r) => ws.addEventListener('open', r));
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && cekajici.has(m.id)) { cekajici.get(m.id)(m); cekajici.delete(m.id); } });
const cdp = (method, params = {}) => new Promise((r) => { const n = ++cislo; cekajici.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const js = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

async function vyfot(obec, nazev, stav, soubor) {
  await cdp('Page.navigate', { url: URL_HRY + '#debug' });
  for (let i = 0; i < 50 && !(await js('document.readyState === "complete"')); i++) await cekejMs(100);
  const klic = `postak:${VERZE}:stav:${obec}`;
  await js(`(() => { localStorage.clear(); ${stav ? `localStorage.setItem(${JSON.stringify(klic)}, ${JSON.stringify(JSON.stringify(stav))});` : ''} return 1; })()`);
  await cdp('Page.reload');
  const najdiObec = `[...document.querySelectorAll('.zastavka__tlacitko')].filter(b => b.textContent.includes(${JSON.stringify(nazev)})).sort((a, b) => a.textContent.length - b.textContent.length)[0]`;
  for (let i = 0; i < 100 && !(await js(`!!${najdiObec}`)); i++) await cekejMs(100);
  await js(`${najdiObec}.click()`); await cekejMs(500);
  // Úvod obce, případně mezihra před kapitolou. Když okno nemá tlačítko pro pokračování, dál se nečeká.
  for (let i = 0; i < 6 && (await js(`!!document.querySelector('.arch')`)); i++) {
    let tlacitko = false;
    for (let j = 0; j < 30 && !(tlacitko = await js(`[...document.querySelectorAll('.arch button')].some(b => /Vyrazit|Pokračovat/.test(b.textContent))`)); j++) await cekejMs(100);
    if (!tlacitko) break;
    await js(`[...document.querySelectorAll('.arch button')].find(b => /Vyrazit|Pokračovat/.test(b.textContent))?.click()`); await cekejMs(400);
  }
  await js(`document.fonts.ready.then(() => Promise.all([...document.querySelectorAll('.naves img')].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })))).then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))`);
  await cekejMs(300);
  const r = await js(`(() => { const b = document.querySelector('.naves').getBoundingClientRect(); return { x: b.left, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
  const shot = await cdp('Page.captureScreenshot', { format: 'png', clip: { ...r, scale: 1 } });
  fs.writeFileSync(soubor, Buffer.from(shot.result.data, 'base64'));
}

for (const obec of obce) {
  const nazev = (etapy.find((e) => e.id === obec) || {}).nazev;
  if (!nazev) { console.log(`${obec}: není v etapy.csv`); continue; }
  let seznam = vzhledy(obec);
  if (seznam.length > MAX_VZHLEDU) { console.log(`${obec}: ${seznam.length} vzhledů, fotím prvních ${MAX_VZHLEDU}`); seznam = seznam.slice(0, MAX_VZHLEDU); }
  const dir = path.join(VYSTUP, obec);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (const [n, v] of seznam.entries()) {
    v.soubor = `${String(n).padStart(2, '0')}.png`;
    await vyfot(obec, nazev, n === 0 ? null : v.stav, path.join(dir, v.soubor));
  }
  fs.writeFileSync(path.join(dir, 'stavy.json'), JSON.stringify({ obec, nazev, vzhledy: seznam }, null, 1));
  console.log(`${obec}: ${seznam.length} vzhledů vyfoceno`);
}
ws.close(); const konecChromu = new Promise((r) => chrome.on('exit', r)); chrome.kill(); await konecChromu;
fs.rmSync(profil, { recursive: true, force: true, maxRetries: 5 });

// ---------- Galerie ----------
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hotove = fs.existsSync(VYSTUP) ? fs.readdirSync(VYSTUP).filter((d) => fs.existsSync(path.join(VYSTUP, d, 'stavy.json'))) : [];
const poradi = new Map(etapy.map((e, i) => [e.id, i]));
hotove.sort((a, b) => (poradi.get(a) ?? 999) - (poradi.get(b) ?? 999));
let html = `<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vzhledy obcí</title>
<style>body{font-family:system-ui,sans-serif;margin:16px;background:#f4efe6;color:#2b2118}h2{margin:32px 0 8px}nav a{margin-right:10px}
.mriz{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}figure{margin:0;background:#fff;border-radius:8px;padding:8px;box-shadow:0 1px 3px #0002}
figure img{width:100%;border-radius:4px}figcaption{font-size:13px;margin-top:6px}figcaption b{display:block}figcaption small{color:#6b5a48;display:block;margin-top:4px}</style>
<h1>Vzhledy obcí</h1><p>Každý obrázek je jeden stav, ve kterém scéna vypadá jinak: vrstva, cíl, který se objeví nebo zmizí, nebo změněná ikona či portrét. Pod obrázkem je, co se změnilo proti začátku, a poslední tah, který k tomu vedl.</p><nav>`;
html += hotove.map((o) => `<a href="#${o}">${esc((etapy.find((e) => e.id === o) || {}).nazev || o)}</a>`).join('') + '</nav>';
for (const o of hotove) {
  const d = JSON.parse(fs.readFileSync(path.join(VYSTUP, o, 'stavy.json'), 'utf8'));
  html += `<h2 id="${o}">${esc(d.nazev)}</h2><div class="mriz">`;
  for (const v of d.vzhledy) {
    const posledni = v.cesta[v.cesta.length - 1];
    const tah = posledni ? `${posledni.karta === '?' ? 'klepnutí' : posledni.karta} → ${posledni.cil} (tah ${v.cesta.length})` : 'začátek';
    html += `<figure><img src="${o}/${v.soubor}" loading="lazy" alt=""><figcaption><b>${esc(v.zmeny.join(', ') || 'začátek')}${v.konec ? ` · ${v.konec}` : ''}</b>${esc(tah)}${posledni ? `<small>${esc(posledni.text)}</small>` : ''}</figcaption></figure>`;
  }
  html += '</div>';
}
fs.mkdirSync(VYSTUP, { recursive: true });
fs.writeFileSync(path.join(VYSTUP, 'index.html'), html);

// Ověří tabulky jedné obce: odkazy, dosažitelnost všech stavů, zaseknutí, dohratelnost a nedosažitelné reakce.
import fs from 'node:fs';
const dir = process.argv[2];
const csv = (f) => { if (!fs.existsSync(dir + f)) return []; const r = fs.readFileSync(dir + f, 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#')); const h = r[0].split(';'); return r.slice(1).map(l => { const p = l.split(';'); return Object.fromEntries(h.map((k, i) => [k, (p[i] || '').trim()])); }); };
const et = Object.fromEntries(csv('etapa.csv').map(r => [r.klic, r.hodnota]));
const cile = csv('cile.csv'), karty = csv('karty.csv'), pr = csv('kombinace.csv'), vrstvy = csv('vrstvy.csv'), tahy = csv('kazdy_tah.csv');
const K = new Set(karty.map(k => k.id)), C = new Set(cile.map(c => c.id)), SPEC = new Set(['?', 'napoveda']);
const sl = s => (s || '').split(/\s+/).filter(Boolean);
const chyby = [];
pr.forEach((p, i) => {
  if (!(K.has(p.karta) || SPEC.has(p.karta) || p.karta === '*')) chyby.push(`řádek ${i}: neznámá karta ${p.karta}`);
  if (!(C.has(p.cil) || p.cil === '*')) chyby.push(`řádek ${i}: neznámý cíl ${p.cil}`);
  for (const t of sl(p.efekt)) if (/^[+-]/.test(t) && !K.has(t.slice(1))) chyby.push(`řádek ${i}: efekt s neznámou kartou ${t}`);
  if (!p.text) chyby.push(`řádek ${i}: chybí text`);
});
tahy.forEach((r, i) => { for (const t of sl(r.efekt)) if (/^[+-]/.test(t) && !K.has(t.slice(1))) chyby.push(`kazdy_tah ${i}: neznámá karta ${t}`); });
for (const id of sl(et.start)) if (!K.has(id)) chyby.push(`start: neznámá karta ${id}`);
for (const v of vrstvy) if (!fs.existsSync(dir + '../../' + v.obrazek)) chyby.push(`vrstva: chybí soubor ${v.obrazek}`);
if (et.pozadi && !fs.existsSync(dir + '../../' + et.pozadi)) chyby.push(`chybí pozadí ${et.pozadi}`);
const ukaz = sl(et.ukazatele).map(t => { const [id, , max] = t.split(':'); return { id, max: Number(max) || 0 }; });
const POR = /^([a-z_][a-z0-9_]*)(>=|<=|>|<|=)(-?\d+)$/i, ZM = /^([a-z_][a-z0-9_]*)([+\-=])(\d+)$/i;
const plati = (s, pod) => { const g = [[]]; for (const t of sl(pod)) t === 'nebo' ? g.push([]) : g[g.length - 1].push(t); return g.filter(x => x.length || g.length === 1).some(x => platiVse(s, x)); };
const platiVse = (s, slova) => slova.every(t => { const n = t.startsWith('!'); const v = n ? t.slice(1) : t; let a; const m = v.match(POR);
  if (m) { const h = m[1] === 'karet' ? s.ruka.length : s.poc[m[1]] || 0, x = +m[3]; a = { '>=': h >= x, '<=': h <= x, '>': h > x, '<': h < x, '=': h === x }[m[2]]; }
  else a = v.startsWith('@') ? s.ruka.includes(v.slice(1)) : s.vlajky.includes(v); return n ? !a : a; });
const najdi = (s, k, c) => pr.find(p => (p.karta === k || (p.karta === '*' && !SPEC.has(k))) && (p.cil === c || p.cil === '*') && plati(s, p.podminka));
const proved = (s, ef) => { for (const t of sl(ef)) { if (t === 'razitko' || t === 'cekej' || t.startsWith('ikona:')) continue;
  if (t[0] === '+') { if (!s.ruka.includes(t.slice(1))) s.ruka.push(t.slice(1)); } else if (t[0] === '-') s.ruka = s.ruka.filter(x => x !== t.slice(1));
  else if (t[0] === '!') s.vlajky = s.vlajky.filter(x => x !== t.slice(1));
  else if (ZM.test(t)) { const [, nm, op, c] = t.match(ZM); const h = s.poc[nm] || 0; let v = op === '+' ? h + +c : op === '-' ? h - +c : +c; const u = ukaz.find(x => x.id === nm); if (u) v = Math.max(0, u.max ? Math.min(u.max, v) : v); s.poc[nm] = v; }
  else if (!s.vlajky.includes(t)) s.vlajky.push(t); } };
const uplyn = (n) => { if (et.kazdy_tah && plati(n, et.kazdy_tah_kdyz)) proved(n, et.kazdy_tah); for (const r of tahy) if (plati(n, r.podminka)) proved(n, r.efekt); };
const cekej = (p) => sl(p && p.efekt).includes('cekej');
const klic = s => [...s.ruka].sort().join(',') + '|' + [...s.vlajky].sort().join(',') + '|' + JSON.stringify(Object.entries(s.poc).sort());
const cil = sl(et.cil);
const konec = s => cil.every(v => s.vlajky.includes(v)) ? 'vyhra' : (et.prohra && plati(s, et.prohra)) ? 'prohra' : null;
const poc0 = {}; for (const t of sl(et.pocitadla)) { const [k, v] = t.split('='); poc0[k] = +v || 0; }
const s0 = { ruka: sl(et.start), vlajky: [], poc: poc0 };
const stitky = []; const stavy = [s0], id = new Map([[klic(s0), 0]]), hrany = [], fronta = [0], pouzite = new Set();
const viditelne = s => cile.filter(c => !(c.skryt_kdyz && plati(s, c.skryt_kdyz)));
while (fronta.length) { const i = fronta.shift(), s = stavy[i]; hrany[i] = []; stitky[i] = []; if (konec(s)) continue;
  for (const c of viditelne(s)) { const p = najdi(s, '?', c.id); pouzite.add(pr.indexOf(p)); if (!p || !sl(p.efekt).length) continue;
    const n = structuredClone(s); proved(n, p.efekt); if (cekej(p)) uplyn(n); const kn = klic(n); if (kn === klic(s)) continue;
    if (!id.has(kn)) { id.set(kn, stavy.length); stavy.push(n); fronta.push(stavy.length - 1); } hrany[i].push(id.get(kn)); stitky[i].push(['?', c.id]); }
  pouzite.add(pr.indexOf(najdi(s, 'napoveda', '')));
  for (const k of s.ruka) for (const c of viditelne(s)) { const p = najdi(s, k, c.id); pouzite.add(pr.indexOf(p));
    const n = structuredClone(s); proved(n, p.efekt); uplyn(n);
    const kn = klic(n); if (!id.has(kn)) { id.set(kn, stavy.length); stavy.push(n); fronta.push(stavy.length - 1); } hrany[i].push(id.get(kn)); stitky[i].push([k, c.id]); } }
const dosahne = (cilovy) => { const ok = new Set(stavy.map((s, i) => konec(s) === cilovy ? i : -1).filter(i => i >= 0)); let z = true; while (z) { z = false; hrany.forEach((h, i) => { if (!ok.has(i) && h.some(j => ok.has(j))) { ok.add(i); z = true; } }); } return ok; };
const kVyhre = dosahne('vyhra'), kProhre = dosahne('prohra');
const zaseknute = stavy.filter((s, i) => !konec(s) && !kVyhre.has(i) && !kProhre.has(i)).map(klic);
const odsouzene = stavy.filter((s, i) => !konec(s) && !kVyhre.has(i)).length;
const par = new Map([[0, null]]); const q = [0]; let cilovy = null;
while (q.length) { const i = q.shift(); if (konec(stavy[i]) === 'vyhra') { cilovy = i; break; } hrany[i].forEach((j, n) => { if (!par.has(j)) { par.set(j, [i, stitky[i][n]]); q.push(j); } }); }
const cesta = []; for (let x = cilovy; par.get(x); x = par.get(x)[0]) cesta.unshift(par.get(x)[1]);
console.log(JSON.stringify(cesta));

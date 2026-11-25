/*
  Pošťák – prototyp karetní adventury pro mobil.

  Obsah hry je v tabulkách:
    data/hra.csv          název a úvod celé hry
    data/etapy.csv        obce na trase (pořadí = pořadí odemykání)
    data/<obec>/          tabulky jedné obce: etapa.csv, cile.csv, karty.csv, kombinace.csv
    data/<obec>.json      totéž sbalené do jednoho souboru (nastroje/sbal.py), použije se, když složka chybí
    data/kapitoly.csv     kapitoly trasy a mezihry (nepovinné)
    data/pribeh.csv       zápisy do deníku podle vlajek světa (nepovinné)
    data/spolecne.csv     pravidla platná ve všech obcích, po pravidlech obce (nepovinné)

  Tento soubor tabulky čte, kreslí scénu, řeší tahání karet a ukládá postup.
*/
'use strict';
(() => {
  const DATA = 'data/';
  const VERZE = 'v1';
  const klicStavu = (id) => `postak:${VERZE}:stav:${id}`;
  const klicAlba = (id) => `postak:${VERZE}:album:${id}`;
  const KLIC_TRASY = `postak:${VERZE}:trasa`;
  // Svět = co platí napříč obcemi: vlajky světa (svet:x v podmínkách a efektech) a viděné mezihry.
  const KLIC_SVETA = `postak:${VERZE}:svet`;
  // Grafika: 'obrazky' (kreslené obrázky z obrazky.csv, kde obec nějaké má) nebo 'jednoducha' (emoji a SVG).
  const KLIC_GRAFIKY = `postak:${VERZE}:grafika`;
  const ZVLASTNI_KARTY = new Set(['?', 'napoveda']);
  const POROVNANI = /^([a-z_][a-z0-9_]*)(>=|<=|>|<|=)(-?\d+)$/i;
  const ZMENA = /^([a-z_][a-z0-9_]*)([+\-=])(\d+)$/i;
  const POPISY_STAVU = { hotovo: 'Doručeno', otevrena: 'Na řadě', rozehrana: 'Rozehráno', zamcena: 'Zamčeno', pripravujeme: 'Připravujeme' };

  const koren = document.getElementById('hra');
  const $ = (sel, kde = document) => kde.querySelector(sel);
  const slova = (text) => (text || '').split(/\s+/).filter(Boolean);
  const vibruj = (vzor) => { try { navigator.vibrate?.(vzor); } catch { /* telefon to neumí */ } };
  const ladeni = () => location.hash === '#debug';
  // Příběhová karta (druh=pribeh): neuplyne po ní tah, nechytá se na *, nepočítá se do brašny ani do alba.
  const jePribeh = (id) => karty[id]?.druh === 'pribeh';

  // Celá hra
  let hra = {};
  let etapy = [];
  let trasa = { hotovo: [] };
  let svet = { vlajky: [], videno: [] };
  let kapitoly = [], pribeh = [], spolecna = [];
  let noveZapisy = [];
  // Právě hraná obec
  let etapa = null;
  let cile = [], cilePodleId = {}, karty = {}, pravidla = [], objevitelna = [], vrstvy = [], tahy = [];
  let obrazkyObce = [];
  let stav = null;
  let album = new Set();
  let vybrana = null;
  let novePoZavreni = [];
  let potlacitKlikDo = 0;
  const mezipamet = {};
  // Obrázky z balíků obcí (data/<obec>.json) mají místo cesty adresu blob:. Jinak se použije cesta, jak je.
  const obrazky = {};
  const cestaObrazku = (cesta) => obrazky[cesta] || cesta;
  // Cesta k souboru obce s vyřešeným „..“, aby obec mohla použít obrázky jiné obce (../lhotka/obrazky/pes.webp).
  function spojCestu(...casti) {
    const kusy = [];
    for (const kus of casti.join('/').split('/')) {
      if (kus === '..') kusy.pop();
      else if (kus && kus !== '.') kusy.push(kus);
    }
    return kusy.join('/');
  }

  // ---------- Kreslené obrázky (obrazky.csv ve složce obce) ----------
  // Řádek: druh (pozadi, cil, karta) ; id ; ikona (jen u cíle: obrázek pro změněnou ikonu) ; soubor (cesta od složky obce).
  // Kde obrázek chybí, zůstane emoji. Hráč to přepíná tlačítkem v liště.
  const obrazkyZapnute = () => (precti(KLIC_GRAFIKY) || 'obrazky') !== 'jednoducha';

  function obrazekCile(c, ikona) {
    if (!obrazkyZapnute() || !c) return '';
    const radky = obrazkyObce.filter((r) => r.druh === 'cil' && r.id === c.id);
    const presny = radky.find((r) => r.ikona && r.ikona === ikona);
    if (presny) return presny.cesta;
    // Výchozí obrázek patří jen k výchozí ikoně. Po změně ikony (pes spí) bez vlastního obrázku zůstane emoji.
    if (ikona && ikona !== c.ikona) return '';
    return radky.find((r) => !r.ikona)?.cesta || '';
  }

  const obrazekKarty = (id) => (obrazkyZapnute() && obrazkyObce.find((r) => r.druh === 'karta' && r.id === id)?.cesta) || '';
  const obrazekPozadi = () => (obrazkyZapnute() && obrazkyObce.find((r) => r.druh === 'pozadi')?.cesta) || '';
  const ikonaKarty = (id) => obrazekKarty(id) || karty[id]?.ikona || '';

  // Ikona cíle: obrázek, když ho obec má, jinak emoji (při reakci emoji výrazu).
  const ikonaCile = (c, ikona, vyraz) => vytvorIkonu(obrazekCile(c, ikona) || vyraz || ikona, c?.jmeno);

  // Výraz při reakci se k obrázku přidá jako odznak, místo aby obrázek nahradil.
  function odznakVyrazu(c, ikona, vyraz) {
    if (!vyraz || vyraz === ikona || !obrazekCile(c, ikona)) return null;
    const odznak = prvek('span', 'odznak', vyraz);
    odznak.setAttribute('aria-hidden', 'true');
    return odznak;
  }

  function prepniGrafiku() {
    zapis(KLIC_GRAFIKY, obrazkyZapnute() ? 'jednoducha' : 'obrazky');
    if (!etapa) return;
    postavNaves();
    aktualizuj();
  }

  // ---------- Pomocníci ----------

  function prvek(tag, trida, text) {
    const el = document.createElement(tag);
    if (trida) el.className = trida;
    if (text != null) el.textContent = dosad(text);
    return el;
  }

  // ---------- Jméno pošťáka ----------
  // V textech tabulek: {jmeno} = jméno pošťáka (Pospíšil), {osloveni} = jak ho oslovují (Pospíšile).
  const VYCHOZI_JMENO = 'Pospíšil';
  const jmenoHrace = () => svet.hrac?.jmeno || VYCHOZI_JMENO;
  const osloveniHrace = () => svet.hrac?.osloveni || osloveniZe(jmenoHrace());
  function dosad(text) {
    const s = String(text);
    if (!s.includes('{')) return s;
    return s.replace(/\{jmeno\}/g, jmenoHrace()).replace(/\{osloveni\}/g, osloveniHrace());
  }

  // Odhad 5. pádu pro předvyplnění. Hráč ho může opravit.
  function osloveniZe(jmeno) {
    const j = (jmeno || '').trim();
    if (!j) return '';
    const mala = j.toLowerCase();
    const konci = (...k) => k.some((x) => mala.endsWith(x));
    if (konci('ová', 'á', 'ý', 'í', 'é', 'o', 'u', 'e', 'i', 'y')) return j;
    if (konci('a')) return `${j.slice(0, -1)}o`;
    if (konci('ěk')) {
      const zaklad = j.slice(0, -2);
      const mekke = { d: 'ď', t: 'ť', n: 'ň' }[zaklad.slice(-1)];
      return mekke ? `${zaklad.slice(0, -1)}${mekke}ku` : `${zaklad}ku`;
    }
    if (konci('ek')) return `${j.slice(0, -2)}ku`;
    if (konci('ec')) return `${j.slice(0, -2)}če`;
    if (konci('el') && j.length > 3 && !/[aeiouyáéíóúůýě]/i.test(j.slice(-3, -2))) return `${j.slice(0, -2)}le`;
    if (konci('k', 'h', 'g', 'ch')) return `${j}u`;
    if (konci('r') && !/[aeiouyáéíóúůýě]/i.test(j.slice(-2, -1))) return `${j.slice(0, -1)}ře`;
    if (konci('s', 'z', 'š', 'ž', 'č', 'ř', 'j', 'ď', 'ť', 'ň', 'x', 'c')) return `${j}i`;
    return `${j}e`;
  }

  const ocisti = (s, max = 40) => (s || '').replace(/[{}<>|;]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);

  // Formulář se jménem do archu. Vrátí funkci, která jméno uloží (nebo false, když chybí).
  function formularJmena(arch) {
    const obal = prvek('div', 'jmeno');
    const pole = (popis, hodnota) => {
      const l = prvek('label', 'jmeno__pole');
      const i = prvek('input', 'jmeno__vstup');
      i.type = 'text';
      i.value = hodnota;
      i.maxLength = 40;
      i.autocomplete = 'off';
      i.spellcheck = false;
      l.append(prvek('span', 'jmeno__popis', popis), i);
      obal.append(l);
      return i;
    };
    const jmeno = pole('Tvoje jméno', jmenoHrace());
    const osloveni = pole('Jak tě oslovují (5. pád)', osloveniHrace());
    let rucne = !!svet.hrac?.osloveni && svet.hrac.osloveni !== osloveniZe(svet.hrac.jmeno);
    jmeno.addEventListener('input', () => { if (!rucne) osloveni.value = osloveniZe(ocisti(jmeno.value)); });
    osloveni.addEventListener('input', () => { rucne = true; });
    const ukazka = prvek('p', 'arch__statistika jmeno__ukazka');
    const obnovUkazku = () => { ukazka.textContent = `„Tak co, ${ocisti(osloveni.value) || '…'}?“ zeptá se poštmistrová.`; };
    jmeno.addEventListener('input', obnovUkazku);
    osloveni.addEventListener('input', obnovUkazku);
    obnovUkazku();
    obal.append(ukazka);
    arch.append(obal);
    return () => {
      const j = ocisti(jmeno.value);
      if (!j) { jmeno.focus(); return false; }
      svet.hrac = { jmeno: j, osloveni: ocisti(osloveni.value) || osloveniZe(j) };
      uloz();
      return true;
    };
  }

  function ukazJmeno() {
    zavriReakci(true);
    const arch = otevriArch('arch--jmeno', { zavritKlepnutim: true });
    arch.append(prvek('h2', '', 'Tvoje jméno'), prvek('p', '', 'Jak se jmenuješ? Postavy tě tak budou oslovovat.'));
    const ulozJmeno = formularJmena(arch);
    arch.append(radaTlacitek(tlacitko('Uložit', () => { if (ulozJmeno()) ukazTrasu(); }), tlacitko('Zpět na trasu', ukazTrasu, true)));
  }

  const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('cs', { granularity: 'grapheme' }) : null;
  const pocetZnaku = (s) => (segmenter ? [...segmenter.segment(s)].length : [...s].length);

  // Ikona je emoji, nebo cesta k obrázku (img/kovar.png).
  function vytvorIkonu(hodnota, popis = '') {
    hodnota = hodnota || '';
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(hodnota)) {
      const img = prvek('img', 'obrazek');
      img.src = cestaObrazku(hodnota);
      img.alt = popis;
      img.draggable = false;
      return img;
    }
    const span = prvek('span', 'emoji', hodnota);
    if (pocetZnaku(hodnota) > 1) span.classList.add('male');
    span.setAttribute('aria-hidden', 'true');
    return span;
  }

  const odstavce = (text) => (text || '').split('|').map((t) => t.trim()).filter(Boolean).map((t) => prvek('p', '', t));

  function sklonuj(n, jedna, dve, pet) {
    if (n === 1) return jedna;
    if (n >= 2 && n <= 4) return dve;
    return pet;
  }

  // ---------- Tabulky ----------

  async function nactiTabulku(cesta) {
    const odpoved = await fetch(DATA + cesta, { cache: 'no-cache' });
    if (!odpoved.ok) throw new Error(`${DATA + cesta}: HTTP ${odpoved.status}`);
    const data = await odpoved.arrayBuffer();
    let text;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(data);
    } catch {
      text = new TextDecoder('windows-1250').decode(data); // CSV uložené z českého Excelu
    }
    return parsujCSV(text);
  }

  // Středník i čárka jako oddělovač (Excel / Google Sheets), uvozovky, řádky s # jsou komentáře.
  function parsujCSV(text) {
    text = text.replace(/^﻿/, '');
    const radkyTextu = text.split(/\r?\n/);
    const hlavicka = radkyTextu.find((r) => r.trim() && !r.trim().startsWith('#')) || '';
    const oddelovac = hlavicka.split(';').length >= hlavicka.split(',').length ? ';' : ',';

    const radky = [];
    let radek = [], pole = '', vUvozovkach = false;
    for (let i = 0; i < text.length; i++) {
      const z = text[i];
      if (vUvozovkach) {
        if (z === '"') {
          if (text[i + 1] === '"') { pole += '"'; i++; } else vUvozovkach = false;
        } else pole += z;
      } else if (z === '"' && pole.trim() === '') {
        vUvozovkach = true;
        pole = '';
      } else if (z === oddelovac) {
        radek.push(pole);
        pole = '';
      } else if (z === '\n' || z === '\r') {
        if (z === '\r' && text[i + 1] === '\n') i++;
        radek.push(pole);
        radky.push(radek);
        radek = [];
        pole = '';
      } else pole += z;
    }
    if (pole !== '' || radek.length) { radek.push(pole); radky.push(radek); }

    const platne = radky.filter((r) => r.some((p) => p.trim()) && !r[0].trim().startsWith('#'));
    if (!platne.length) return [];
    const klice = platne[0].map((k) => k.trim().toLowerCase());
    return platne.slice(1).map((r) => Object.fromEntries(klice.map((k, i) => [k, (r[i] ?? '').trim()])));
  }

  // Obec je složka s tabulkami (data/<obec>/etapa.csv …). Když složka chybí, načte se balík data/<obec>.json,
  // ve kterém jsou všechny tabulky i obrázky obce v jednom souboru (pro hostingy s limitem počtu souborů).
  async function nactiBalik(id) {
    const odpoved = await fetch(`${DATA}${id}.json`, { cache: 'no-cache' });
    if (!odpoved.ok) throw new Error(`${DATA}${id}.json: HTTP ${odpoved.status}`);
    const soubory = await odpoved.json();
    for (const [nazev, obsah] of Object.entries(soubory)) {
      if (nazev.endsWith('.svg')) obrazky[`${DATA}${id}/${nazev}`] = URL.createObjectURL(new Blob([obsah], { type: 'image/svg+xml' }));
      // Kreslené obrázky jsou v balíku jako data: URL pod cestou z obrazky.csv (i ../jina_obec/…).
      else if (obsah.startsWith?.('data:image/')) obrazky[spojCestu(DATA, id, nazev)] = obsah;
    }
    return (soubor) => (soubor in soubory ? parsujCSV(soubory[soubor]) : null);
  }

  async function nactiEtapu(id) {
    if (!mezipamet[id]) {
      let tabulka;
      try {
        const etapaCsv = await nactiTabulku(`${id}/etapa.csv`);
        tabulka = (soubor, povinna) => (soubor === 'etapa.csv' ? etapaCsv
          : nactiTabulku(`${id}/${soubor}`).catch((chyba) => { if (povinna) throw chyba; return []; }));
      } catch (chyba) {
        const zBaliku = await nactiBalik(id).catch(() => { throw chyba; });
        tabulka = (soubor, povinna) => {
          const t = zBaliku(soubor);
          if (!t && povinna) throw new Error(`${DATA}${id}.json: chybí ${soubor}`);
          return t || [];
        };
      }
      // vrstvy a pravidla po každém tahu jsou nepovinné
      const [nastaveni, c, k, p, v, t, obr] = await Promise.all([
        tabulka('etapa.csv', true), tabulka('cile.csv', true), tabulka('karty.csv', true), tabulka('kombinace.csv', true),
        tabulka('vrstvy.csv', false), tabulka('kazdy_tah.csv', false), tabulka('obrazky.csv', false),
      ]);
      const o = obr.filter((r) => r.druh && r.soubor).map((r) => ({ ...r, cesta: spojCestu(DATA, id, r.soubor) }));
      mezipamet[id] = { nastaveni: Object.fromEntries(nastaveni.map((r) => [r.klic, r.hodnota])), cile: c, karty: k, pravidla: p, vrstvy: v, tahy: t, obrazky: o };
    }
    return mezipamet[id];
  }

  // ---------- Uložený postup ----------

  function precti(klic) {
    try { return JSON.parse(localStorage.getItem(klic)); } catch { return null; }
  }

  function zapis(klic, hodnota) {
    try { localStorage.setItem(klic, JSON.stringify(hodnota)); } catch { /* soukromé okno apod. */ }
  }

  // ---------- Přenos postupu mezi zařízeními ----------
  // Kód obsahuje všechny klíče postak:* z localStorage jako JSON, zabalený do base64url.
  // POSTAK1. = zkomprimovaný (deflate-raw), POSTAK0. = nezkomprimovaný (prohlížeč bez CompressionStream).

  const PREDPONA_KLICU = 'postak:';
  const KLIC_PLATNY = /^postak:[\w:.-]+$/;

  function ulozeneKlice() {
    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREDPONA_KLICU)) data[k] = localStorage.getItem(k);
      }
    } catch { /* úložiště nedostupné */ }
    return data;
  }

  const doBase64 = (bajty) => {
    let s = '';
    for (let i = 0; i < bajty.length; i += 0x8000) s += String.fromCharCode(...bajty.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const zBase64 = (text) => {
    const s = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(s, (z) => z.charCodeAt(0));
  };
  const prozen = async (bajty, proud) => new Uint8Array(await new Response(new Blob([bajty]).stream().pipeThrough(proud)).arrayBuffer());

  async function kodPostupu() {
    const bajty = new TextEncoder().encode(JSON.stringify({ v: 1, d: ulozeneKlice() }));
    if (typeof CompressionStream === 'function') {
      try { return `POSTAK1.${doBase64(await prozen(bajty, new CompressionStream('deflate-raw')))}`; } catch { /* zkusíme bez komprese */ }
    }
    return `POSTAK0.${doBase64(bajty)}`;
  }

  // Vrátí { klice, hotovo } nebo vyhodí chybu se srozumitelnou zprávou.
  async function prectiKod(text) {
    const kod = (text || '').replace(/\s+/g, '');
    const shoda = /^POSTAK([01])\.([A-Za-z0-9_-]+)$/.exec(kod);
    if (!shoda) throw new Error('Tohle nevypadá jako kód postupu. Má začínat POSTAK.');
    let bajty;
    try { bajty = zBase64(shoda[2]); } catch { throw new Error('Kód je poškozený. Zkopíruj ho celý.'); }
    if (shoda[1] === '1') {
      if (typeof DecompressionStream !== 'function') throw new Error('Tenhle prohlížeč kód neumí rozbalit.');
      try { bajty = await prozen(bajty, new DecompressionStream('deflate-raw')); } catch { throw new Error('Kód je poškozený. Zkopíruj ho celý.'); }
    }
    let obsah;
    try { obsah = JSON.parse(new TextDecoder().decode(bajty)); } catch { throw new Error('Kód je poškozený. Zkopíruj ho celý.'); }
    if (!obsah || obsah.v !== 1 || typeof obsah.d !== 'object' || !obsah.d) throw new Error('Kód je z jiné verze hry.');
    const klice = {};
    for (const [k, v] of Object.entries(obsah.d)) {
      if (!KLIC_PLATNY.test(k) || typeof v !== 'string') continue;
      try { JSON.parse(v); } catch { continue; }
      klice[k] = v;
    }
    let hotovo = 0;
    try { hotovo = (JSON.parse(klice[KLIC_TRASY] || 'null')?.hotovo || []).length; } catch { /* bez trasy */ }
    return { klice, hotovo };
  }

  function prepisPostup(klice) {
    try {
      for (const k of Object.keys(ulozeneKlice())) localStorage.removeItem(k);
      for (const [k, v] of Object.entries(klice)) localStorage.setItem(k, v);
    } catch {
      throw new Error('Postup se nepodařilo uložit. Prohlížeč nepovoluje úložiště (soukromé okno?).');
    }
    const t = precti(KLIC_TRASY);
    trasa = t && Array.isArray(t.hotovo) ? t : { hotovo: [] };
    svet = nactiSvet();
    etapa = null;
    stav = null;
    vybrana = null;
  }

  function nactiSvet() {
    const s = precti(KLIC_SVETA);
    const hrac = s?.hrac && typeof s.hrac.jmeno === 'string' && s.hrac.jmeno
      ? { jmeno: ocisti(s.hrac.jmeno), osloveni: ocisti(typeof s.hrac.osloveni === 'string' ? s.hrac.osloveni : '') }
      : null;
    return {
      vlajky: Array.isArray(s?.vlajky) ? s.vlajky.filter((v) => typeof v === 'string') : [],
      videno: Array.isArray(s?.videno) ? s.videno.filter((v) => typeof v === 'string') : [],
      ...(hrac ? { hrac } : {}),
    };
  }

  function novyStav() {
    const pocitadla = {};
    for (const t of slova(etapa.pocitadla)) {
      const [k, v] = t.split('=');
      if (k) pocitadla[k] = Number(v) || 0;
    }
    return { ruka: slova(etapa.start), vlajky: [], pocitadla, ikony: {}, konec: null };
  }

  function nactiStav(id) {
    const s = precti(klicStavu(id));
    stav = s && Array.isArray(s.ruka) ? { vlajky: [], pocitadla: {}, ikony: {}, konec: null, ...s } : null;
    album = new Set(precti(klicAlba(id)) || []);
  }

  function uloz() {
    if (etapa && stav) {
      zapis(klicStavu(etapa.id), stav);
      zapis(klicAlba(etapa.id), [...album]);
    }
    zapis(KLIC_TRASY, trasa);
    zapis(KLIC_SVETA, svet);
  }

  function jeRozehrana(id) {
    const s = precti(klicStavu(id));
    return !!(s && !s.konec && Array.isArray(s.vlajky) && s.vlajky.length);
  }

  // ---------- Pravidla ----------

  // Podmínka je seznam slov, která musí platit všechna. Slovo „nebo“ ji dělí na možnosti, z nichž stačí jedna.
  function plati(podminka) {
    const moznosti = [[]];
    for (const t of slova(podminka)) {
      if (t === 'nebo') moznosti.push([]);
      else moznosti[moznosti.length - 1].push(t);
    }
    return moznosti.filter((m) => m.length || moznosti.length === 1).some(platiVse);
  }

  function platiVse(slovaPodminky) {
    return slovaPodminky.every((t) => {
      const negace = t.startsWith('!');
      const vyraz = negace ? t.slice(1) : t;
      let ano;
      const m = vyraz.match(POROVNANI);
      if (m) {
        // karet = kolik věcí je právě v brašně (pro obce s malou brašnou)
        const h = m[1] === 'karet' ? stav.ruka.filter((k) => !jePribeh(k)).length : stav.pocitadla[m[1]] || 0;
        const n = Number(m[3]);
        ano = { '>=': h >= n, '<=': h <= n, '>': h > n, '<': h < n, '=': h === n }[m[2]];
      } else if (vyraz.startsWith('@')) {
        ano = stav.ruka.includes(vyraz.slice(1));
      } else if (vyraz.startsWith('svet:')) {
        ano = svet.vlajky.includes(vyraz.slice(5));
      } else {
        ano = stav.vlajky.includes(vyraz);
      }
      return negace ? !ano : ano;
    });
  }

  function najdiPravidlo(karta, cil) {
    return pravidla.find((p) =>
      (p.karta === karta || (p.karta === '*' && !ZVLASTNI_KARTY.has(karta) && !jePribeh(karta))) &&
      (p.cil === cil || p.cil === '*') &&
      plati(p.podminka));
  }

  const jeObjevitelne = (p) => !p.spolecne && p.karta !== '*' && p.cil !== '*' && !ZVLASTNI_KARTY.has(p.karta) && !jePribeh(p.karta);
  const klicPravidla = (p) => `${p.karta}>${p.cil}>${p.podminka}`;
  const pocetObjevu = () => objevitelna.filter((p) => album.has(klicPravidla(p))).length;

  function proved(efekt) {
    const vysledek = { nove: [], razitko: false };
    for (const t of slova(efekt)) {
      if (t === 'razitko') {
        vysledek.razitko = true;
      } else if (t === 'cekej') {
        vysledek.cekej = true; // nechá uběhnout jeden tah, i když hráč jen čekal nebo se rozhlížel
      } else if (t.startsWith('+')) {
        const id = t.slice(1);
        if (!stav.ruka.includes(id)) { stav.ruka.push(id); vysledek.nove.push(id); }
      } else if (t.startsWith('-')) {
        stav.ruka = stav.ruka.filter((k) => k !== t.slice(1));
      } else if (t.startsWith('ikona:')) {
        const [, cil, ...hodnota] = t.split(':');
        if (hodnota.join(':')) stav.ikony[cil] = hodnota.join(':');
        else delete stav.ikony[cil];
      } else if (t.startsWith('svet:')) {
        const v = t.slice(5);
        if (v && !svet.vlajky.includes(v)) {
          svet.vlajky.push(v);
          if (pribeh.some((z) => z.id === v)) noveZapisy.push(v);
        }
      } else if (t.startsWith('!svet:')) {
        svet.vlajky = svet.vlajky.filter((v) => v !== t.slice(6));
      } else if (t.startsWith('!')) {
        stav.vlajky = stav.vlajky.filter((v) => v !== t.slice(1));
      } else if (ZMENA.test(t)) {
        const [, nazev, op, cislo] = t.match(ZMENA);
        const h = stav.pocitadla[nazev] || 0;
        const n = Number(cislo);
        let hodnota = op === '+' ? h + n : op === '-' ? h - n : n;
        const u = ukazatele().find((x) => x.id === nazev);
        if (u) hodnota = Math.max(0, u.max ? Math.min(u.max, hodnota) : hodnota);
        stav.pocitadla[nazev] = hodnota;
      } else if (!stav.vlajky.includes(t)) {
        stav.vlajky.push(t);
      }
    }
    return vysledek;
  }

  function ukazatele() {
    return slova(etapa?.ukazatele).map((t) => {
      const [id, nazev, max] = t.split(':');
      return { id, nazev: (nazev || id).replace(/_/g, ' '), max: Number(max) || 0 };
    });
  }

  // ---------- Kostra obrazovky ----------

  const SVG = {
    zarovka: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>',
    kniha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
    obraz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg>',
    mapa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  };

  function postavKostru() {
    koren.innerHTML = `
      <header class="lista">
        <div class="lista__nazev"><b></b><span class="lista__stav" aria-live="polite"></span></div>
        <button type="button" class="ikonka" data-akce="grafika" aria-label="Kreslené obrázky" hidden>${SVG.obraz}</button>
        <button type="button" class="ikonka" data-akce="napoveda" aria-label="Nápověda" title="Nápověda">${SVG.zarovka}</button>
        <button type="button" class="ikonka" data-akce="album" aria-label="Album objevů" title="Album objevů">${SVG.kniha}</button>
        <button type="button" class="ikonka" data-akce="trasa" aria-label="Trasa" title="Trasa">${SVG.mapa}</button>
      </header>
      <div class="naves-obal"><div class="naves"></div></div>
      <p class="popisek" aria-live="polite"></p>
      <section class="brasna" aria-label="Brašna">
        <div class="brasna__hlavicka"><span>Brašna</span><span class="brasna__pocet"></span></div>
        <div class="ruka"></div>
      </section>`;
    $('[data-akce="napoveda"]').addEventListener('click', napoveda);
    $('[data-akce="grafika"]').addEventListener('click', prepniGrafiku);
    $('[data-akce="album"]').addEventListener('click', ukazAlbum);
    $('[data-akce="trasa"]').addEventListener('click', ukazTrasu);
  }

  // Zástupná vesnice, dokud obec nemá vlastní obrázek (klíč pozadi v etapa.csv).
  function kresbaVesnice() {
    let praporky = '';
    const n = 13;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, u = 1 - t;
      const x = u * u * 18 + 2 * u * t * 150 + t * t * 282;
      const y = u * u * 120 + 2 * u * t * 156 + t * t * 120;
      praporky += `<path class="v-prapor-${i % 3}" d="M${(x - 5).toFixed(1)} ${y.toFixed(1)}L${(x + 5).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y + 11).toFixed(1)}Z"/>`;
    }
    return `
<svg class="naves__pozadi" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect class="v-nebe" width="300" height="400"/>
  <circle class="v-slunce" cx="250" cy="48" r="20"/>
  <path class="v-kopec" d="M0 150C40 112 95 118 140 138S240 98 300 126V400H0Z"/>
  <g class="v-strom"><circle cx="16" cy="128" r="20"/><circle cx="292" cy="158" r="18"/></g>
  <path class="v-louka" d="M0 186C70 168 210 170 300 182V400H0Z"/>
  <path class="v-cesta" d="M120 400C132 330 178 298 162 242S140 150 144 112H156C162 150 186 205 178 244S162 330 184 400Z"/>
  <g class="v-dum">
    <rect class="v-zed" x="98" y="50" width="104" height="64"/>
    <path class="v-strecha" d="M90 52L150 16L210 52Z"/>
    <circle class="v-hodiny" cx="150" cy="37" r="7"/>
    <path class="v-rucicky" d="M150 37V32M150 37H154"/>
  </g>
  <path class="v-snura" d="M18 120Q150 156 282 120"/>
  ${praporky}
  <g class="v-dum">
    <rect class="v-komin" x="78" y="140" width="9" height="20"/>
    <rect class="v-zed" x="26" y="166" width="68" height="60"/>
    <path class="v-strecha" d="M18 170L60 136L102 170Z"/>
  </g>
  <g class="v-dym"><circle cx="262" cy="128" r="6"/><circle cx="268" cy="115" r="8"/><circle cx="277" cy="100" r="10"/></g>
  <g class="v-dum">
    <rect class="v-komin" x="252" y="138" width="10" height="22"/>
    <rect class="v-zed" x="206" y="166" width="68" height="60"/>
    <path class="v-bridlice" d="M198 170L240 136L282 170Z"/>
  </g>
  <g class="v-strom"><circle cx="282" cy="268" r="22"/><circle cx="14" cy="372" r="24"/></g>
  <g class="v-dum">
    <rect class="v-zed" x="52" y="282" width="64" height="54"/>
    <path class="v-doskova" d="M42 288L84 248L126 288Z"/>
  </g>
  <g class="v-kvet"><circle cx="40" cy="348" r="3"/><circle cx="48" cy="356" r="3"/><circle cx="126" cy="344" r="3"/></g>
  <ellipse class="v-kasna" cx="216" cy="346" rx="42" ry="11"/>
</svg>`;
  }

  function postavNaves() {
    const naves = $('.naves');
    naves.removeAttribute('style');
    for (const t of slova(etapa.barvy)) {
      const [k, v] = t.split('=');
      if (k && v) naves.style.setProperty(`--${k}`, v);
    }
    const pozadi = obrazekPozadi() || etapa.pozadi;
    naves.innerHTML = pozadi ? '' : kresbaVesnice();
    if (pozadi) {
      const img = prvek('img', 'naves__pozadi');
      img.src = cestaObrazku(pozadi);
      img.alt = '';
      img.draggable = false;
      naves.append(img);
    }
    for (const v of vrstvy) {
      if (!v.obrazek) continue;
      const img = prvek('img', 'vrstva');
      img.src = cestaObrazku(v.obrazek);
      img.alt = '';
      img.draggable = false;
      img.dataset.podminka = v.podminka || '';
      naves.append(img);
    }
    for (const c of cile) {
      const tl = prvek('button', 'cil');
      tl.type = 'button';
      tl.dataset.id = c.id;
      tl.style.left = `${parseFloat(c.x) || 50}%`;
      tl.style.top = `${parseFloat(c.y) || 50}%`;
      tl.setAttribute('aria-label', c.jmeno);
      tl.append(prvek('span', 'medailon'), prvek('span', 'jmenovka', c.jmeno));
      tl.addEventListener('click', () => klikNaCil(c.id));
      naves.append(tl);
    }
  }

  // ---------- Vykreslení stavu ----------

  const aktualniIkona = (c) => stav.ikony[c.id] || c.ikona;

  function cip(text, trida) {
    return prvek('span', `cip ${trida}`, text);
  }

  function vykresliListu() {
    $('.lista__nazev b').textContent = etapa ? etapa.nazev : hra.nazev || '';
    const stavEl = $('.lista__stav');
    stavEl.replaceChildren();
    for (const b of koren.querySelectorAll('[data-akce="napoveda"], [data-akce="album"]')) b.disabled = !etapa;
    const grafika = $('[data-akce="grafika"]');
    if (grafika) {
      grafika.hidden = !etapa || !obrazkyObce.length;
      grafika.setAttribute('aria-pressed', String(obrazkyZapnute()));
      grafika.title = obrazkyZapnute() ? 'Kreslené obrázky (zapnuto)' : 'Kreslené obrázky (vypnuto)';
    }
    if (!etapa) return;
    const cil = slova(etapa.cil);
    const hotovo = cil.filter((v) => stav.vlajky.includes(v)).length;
    stavEl.append(cip(`${hotovo}/${cil.length} doručeno`, 'cip--doruceno'));
    for (const u of ukazatele()) {
      const h = stav.pocitadla[u.id] || 0;
      const c = cip(`${u.nazev} ${h}${u.max ? `/${u.max}` : ''}`, 'cip--ukazatel');
      if (u.max && h >= u.max * 0.75) c.classList.add('cip--varovani');
      stavEl.append(c);
    }
  }

  function aktualizujNaves() {
    for (const v of koren.querySelectorAll('.vrstva')) v.classList.toggle('viditelna', plati(v.dataset.podminka));
    for (const tl of koren.querySelectorAll('.cil')) {
      const c = cilePodleId[tl.dataset.id];
      tl.hidden = !!c.skryt_kdyz && plati(c.skryt_kdyz);
      tl.querySelector('.medailon').replaceChildren(ikonaCile(c, aktualniIkona(c)));
      tl.querySelector('.odznak')?.remove();
    }
    $('.naves').classList.toggle('vyber', !!vybrana);
  }

  function vykresliRuku(nove = []) {
    const ruka = $('.ruka');
    ruka.replaceChildren();
    const obsah = stav.ruka.filter((id) => karty[id] && !jePribeh(id));
    const pribehove = stav.ruka.filter((id) => karty[id] && jePribeh(id));
    const kapacita = Number(etapa?.brasna) || 0;
    if (!obsah.length && !kapacita && !pribehove.length) ruka.append(prvek('p', 'ruka__prazdna', 'Brašna je prázdná.'));
    for (const id of obsah) ruka.append(vytvorKartu(id, nove.includes(id)));
    // Malá brašna: volná místa jsou vidět jako čárkované rámečky.
    for (let i = obsah.length; i < kapacita; i++) ruka.append(prvek('span', 'ruka__misto'));
    // Příběhové karty leží v podšívce, na konci a mimo počet míst.
    for (const id of pribehove) ruka.append(vytvorKartu(id, nove.includes(id)));
    $('.brasna__pocet').textContent = kapacita
      ? `${obsah.length} z ${kapacita} míst`
      : obsah.length ? `${obsah.length} ${sklonuj(obsah.length, 'věc', 'věci', 'věcí')}` : '';
  }

  function vytvorKartu(id, nova) {
    const k = karty[id];
    const druh = ['dopis', 'balik', 'pohled', 'vec', 'pribeh'].includes(k.druh) ? k.druh : 'vec';
    const el = prvek('button', `zasilka zasilka--${druh}`);
    el.type = 'button';
    el.dataset.id = id;
    if (id === vybrana) el.classList.add('vybrana');
    if (nova) el.classList.add('nova');
    el.setAttribute('aria-label', k.adresa ? `${k.nazev}, ${k.adresa}` : k.nazev);
    el.setAttribute('aria-pressed', String(id === vybrana));
    const hore = prvek('span', 'zasilka__hore');
    hore.append(vytvorIkonu(ikonaKarty(id), k.nazev));
    if (obrazekKarty(id)) el.classList.add('zasilka--obrazek');
    if (druh === 'pribeh') hore.append(prvek('span', 'pecet'));
    else if (druh !== 'vec') hore.append(prvek('span', 'znamka'));
    el.append(hore, prvek('span', 'zasilka__nazev', k.nazev));
    if (k.adresa) el.append(prvek('span', 'zasilka__adresa', k.adresa));
    napojTah(el, id);
    return el;
  }

  function vykresliPopisek(text) {
    const p = $('.popisek');
    p.replaceChildren();
    if (text) { p.textContent = dosad(text); return; }
    const k = vybrana && karty[vybrana];
    if (!k) { p.textContent = dosad(etapa?.navod || 'Přetáhni zásilku na adresáta.'); return; }
    const obsah = prvek('span');
    obsah.append(prvek('b', '', k.nazev));
    if (k.adresa) obsah.append(' ', prvek('span', 'popisek__adresa', k.adresa));
    if (k.popis) obsah.append(document.createElement('br'), dosad(k.popis));
    obsah.append(' ', prvek('em', '', 'Klepni na adresáta.'));
    p.append(obsah);
  }

  function vykresliLadeni() {
    let el = $('.ladeni');
    if (!ladeni() || !etapa) { el?.remove(); return; }
    if (!el) { el = prvek('pre', 'ladeni'); document.body.append(el); }
    const pocitadla = Object.entries(stav.pocitadla).map(([k, v]) => `${k}=${v}`).join(' ');
    el.textContent = `obec: ${etapa.id}\nvlajky: ${stav.vlajky.join(' ') || '–'}\npočítadla: ${pocitadla || '–'}\nbrašna: ${stav.ruka.join(' ') || '–'}\nalbum: ${pocetObjevu()}/${objevitelna.length}`;
  }

  function aktualizuj(nove = []) {
    vykresliListu();
    if (!etapa) return;
    aktualizujNaves();
    vykresliRuku(nove);
    vykresliPopisek();
    vykresliLadeni();
  }

  // ---------- Tahání a klepání ----------

  function cilPod(x, y) {
    let nejblizsi = null, nejmensi = Infinity;
    for (const tl of koren.querySelectorAll('.cil:not([hidden])')) {
      const r = tl.querySelector('.medailon').getBoundingClientRect();
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < r.width * 0.95 && d < nejmensi) { nejmensi = d; nejblizsi = tl.dataset.id; }
    }
    return nejblizsi;
  }

  function zvyrazni(id) {
    for (const tl of koren.querySelectorAll('.cil')) tl.classList.toggle('nad', tl.dataset.id === id);
  }

  function napojTah(el, id) {
    let start = null, duch = null, nad = null;

    const uklid = () => {
      duch?.remove();
      duch = null;
      start = null;
      nad = null;
      el.classList.remove('zvednuta');
      $('.naves').classList.remove('tahani');
      zvyrazni(null);
    };

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      try { el.setPointerCapture(e.pointerId); } catch { /* nevadí */ }
    });

    el.addEventListener('pointermove', (e) => {
      if (!start || e.pointerId !== start.id) return;
      if (!duch) {
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
        duch = el.cloneNode(true);
        duch.classList.remove('vybrana', 'nova');
        duch.classList.add('duch');
        duch.style.width = `${el.offsetWidth}px`;
        duch.style.height = `${el.offsetHeight}px`;
        duch.setAttribute('aria-hidden', 'true');
        document.body.append(duch);
        el.classList.add('zvednuta');
        $('.naves').classList.add('tahani');
        vibruj(8);
      }
      // Karta visí nad prstem, aby ji prst nezakrýval.
      duch.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -115%) rotate(-4deg) scale(1.06)`;
      const novy = cilPod(e.clientX, e.clientY - duch.offsetHeight * 0.65);
      if (novy !== nad) {
        nad = novy;
        zvyrazni(nad);
        if (nad) vibruj(5);
      }
    });

    el.addEventListener('pointerup', (e) => {
      if (!start || e.pointerId !== start.id) return;
      const tahl = !!duch;
      const cil = nad;
      uklid();
      if (!tahl) return;
      potlacitKlikDo = performance.now() + 400;
      if (cil) {
        vybrana = null;
        vibruj(15);
        pouzij(id, cil);
      }
    });

    el.addEventListener('pointercancel', uklid);

    el.addEventListener('click', () => {
      if (performance.now() < potlacitKlikDo) return;
      vybrana = vybrana === id ? null : id;
      vibruj(5);
      aktualizuj();
    });
  }

  function klikNaCil(id) {
    if (vybrana) {
      const karta = vybrana;
      vybrana = null;
      pouzij(karta, id);
    } else {
      pouzij('?', id);
    }
  }

  // ---------- Reakce ----------

  function pouzij(karta, cilId) {
    if (stav.konec) return;
    const cil = cilePodleId[cilId];
    const predtim = { ...stav.pocitadla };
    const pravidlo = najdiPravidlo(karta, cilId);
    let vysledek = { nove: [], razitko: false };
    let objev = false;
    if (pravidlo) {
      vysledek = proved(pravidlo.efekt);
      if (jeObjevitelne(pravidlo)) {
        const klic = klicPravidla(pravidlo);
        if (!album.has(klic)) { album.add(klic); objev = true; }
      }
    }
    let mezitim = [];
    if ((!ZVLASTNI_KARTY.has(karta) && !jePribeh(karta)) || vysledek.cekej) {
      const t = uplynTah();
      for (const id of t.nove) if (!vysledek.nove.includes(id)) vysledek.nove.push(id);
      mezitim = t.texty;
    }
    const zmeny = ukazatele()
      .map((u) => ({ ...u, hodnota: stav.pocitadla[u.id] || 0, rozdil: (stav.pocitadla[u.id] || 0) - (predtim[u.id] || 0) }))
      .filter((u) => u.rozdil);
    uloz();
    ukazReakci({
      cil,
      kdo: cil.jmeno,
      vyraz: pravidlo?.vyraz || aktualniIkona(cil),
      text: pravidlo?.text || (karta === '?' ? cil.jmeno : 'Nic se nestane.'),
      nove: vysledek.nove,
      razitko: vysledek.razitko,
      objev,
      zmeny,
      mezitim,
      zapisy: noveZapisy.splice(0),
    });
  }

  // Co se stane „mezitím“ po každém podání zásilky: klíč kazdy_tah v etapa.csv a řádky kazdy_tah.csv (všechny, které platí, popořadě).
  function uplynTah() {
    const nove = [], texty = [];
    if (etapa.kazdy_tah && plati(etapa.kazdy_tah_kdyz)) nove.push(...proved(etapa.kazdy_tah).nove);
    for (const r of tahy) {
      if (!plati(r.podminka)) continue;
      nove.push(...proved(r.efekt).nove);
      if (r.text) texty.push(r.text);
    }
    return { nove, texty };
  }

  function napoveda() {
    if (!etapa) return;
    const p = najdiPravidlo('napoveda', '');
    ukazReakci({ kdo: 'Nápověda', vyraz: p?.vyraz || '💡', text: p?.text || 'Zkus různé zásilky na různé lidi.', nove: [], razitko: false, objev: false });
  }

  function vytvorRazitko() {
    const r = prvek('div', 'razitko');
    r.setAttribute('aria-label', 'Doručeno');
    r.append(
      prvek('span', 'razitko__obec', (etapa?.nazev || '').toUpperCase()),
      prvek('span', 'razitko__hlavni', 'DORUČENO'),
      prvek('span', 'razitko__datum', etapa?.datum || ''),
    );
    return r;
  }

  function ukazReakci({ cil, kdo, vyraz, text, nove, razitko, objev, zmeny = [], mezitim = [], zapisy = [] }) {
    zavriReakci(true);
    if (cil) {
      const tl = $(`.cil[data-id="${CSS.escape(cil.id)}"]`);
      if (tl) {
        tl.querySelector('.medailon').replaceChildren(ikonaCile(cil, aktualniIkona(cil), vyraz));
        tl.querySelector('.odznak')?.remove();
        const odznak = odznakVyrazu(cil, aktualniIkona(cil), vyraz);
        if (odznak) tl.append(odznak);
        tl.classList.remove('reaguje');
        void tl.offsetWidth; // restart animace
        tl.classList.add('reaguje');
      }
    }

    const clona = prvek('div', 'clona');
    const panel = prvek('div', 'panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', kdo);
    panel.tabIndex = -1;

    const portret = prvek('span', 'panel__portret');
    if (cil) {
      portret.append(ikonaCile(cil, aktualniIkona(cil), vyraz));
      const odznak = odznakVyrazu(cil, aktualniIkona(cil), vyraz);
      if (odznak) portret.append(odznak);
    } else portret.append(vytvorIkonu(vyraz, kdo));
    panel.append(portret, prvek('span', 'panel__kdo', kdo), prvek('p', 'panel__text', text));
    for (const t of mezitim) panel.append(prvek('p', 'panel__mezitim', t));

    const nalezene = nove.filter((id) => karty[id]);
    if (nalezene.length) {
      const radek = prvek('p', 'panel__nove');
      radek.append(prvek('span', 'panel__stitek', 'Do brašny'));
      for (const id of nalezene) {
        const s = prvek('span', 'panel__vec');
        s.append(vytvorIkonu(ikonaKarty(id)), ` ${karty[id].nazev}`);
        radek.append(s);
      }
      panel.append(radek);
    }

    if (zmeny.length) {
      const radek = prvek('p', 'panel__zmeny');
      for (const z of zmeny) {
        const c = prvek('span', 'panel__zmena', `${z.nazev} ${z.rozdil > 0 ? '▲' : '▼'} ${z.hodnota}${z.max ? `/${z.max}` : ''}`);
        if (z.max && z.hodnota >= z.max * 0.75) c.classList.add('panel__zmena--varovani');
        radek.append(c);
      }
      panel.append(radek);
    }

    for (const id of zapisy) {
      const z = pribeh.find((x) => x.id === id);
      const radek = prvek('p', 'panel__denik');
      radek.append(prvek('span', 'panel__stitek', 'Do deníku'), ` ${z?.nadpis || ''}`);
      panel.append(radek);
    }

    const pata = prvek('p', 'panel__pata');
    pata.append(
      prvek('span', '', objev ? `Nový zápis v albu · ${pocetObjevu()}/${objevitelna.length}` : ''),
      prvek('span', '', 'Klepni kamkoli'),
    );
    panel.append(pata);
    if (razitko) panel.append(vytvorRazitko());

    koren.append(clona, panel);
    novePoZavreni = nove;
    const otevreno = performance.now();
    const zavri = () => { if (performance.now() - otevreno > 250) zavriReakci(); };
    clona.addEventListener('click', zavri);
    panel.addEventListener('click', zavri);
    panel.focus({ preventScroll: true });
    if (razitko) vibruj([10, 60, 30]);
  }

  function zavriReakci(potichu = false) {
    const panel = $('.panel');
    if (!panel) return;
    panel.remove();
    $('.clona')?.remove();
    koren.querySelectorAll('.cil.reaguje').forEach((t) => t.classList.remove('reaguje'));
    if (potichu) return;
    aktualizuj(novePoZavreni);
    novePoZavreni = [];
    zkontrolujKonec();
  }

  function zkontrolujKonec() {
    if (stav.konec) return;
    const cil = slova(etapa.cil);
    if (cil.length && cil.every((v) => stav.vlajky.includes(v))) {
      stav.konec = 'vyhra';
      if (!trasa.hotovo.includes(etapa.id)) trasa.hotovo.push(etapa.id);
      uloz();
      setTimeout(ukazVyhru, 350);
    } else if (etapa.prohra && plati(etapa.prohra)) {
      stav.konec = 'prohra';
      uloz();
      setTimeout(ukazProhru, 350);
    }
  }

  // ---------- Archy přes celou obrazovku ----------

  function otevriArch(trida, { zavritKlepnutim = false } = {}) {
    zavriArch();
    const prekryv = prvek('div', 'prekryv');
    const arch = prvek('div', `arch ${trida}`);
    arch.setAttribute('role', 'dialog');
    arch.setAttribute('aria-modal', 'true');
    arch.tabIndex = -1;
    if (zavritKlepnutim) {
      prekryv.dataset.zavritelny = '1';
      prekryv.addEventListener('click', (e) => { if (e.target === prekryv) zavriArch(); });
    }
    prekryv.append(arch);
    koren.append(prekryv);
    requestAnimationFrame(() => arch.focus({ preventScroll: true }));
    return arch;
  }

  function zavriArch() {
    $('.prekryv')?.remove();
  }

  function tlacitko(text, akce, vedlejsi = false) {
    const b = prvek('button', vedlejsi ? 'tlacitko tlacitko--vedlejsi' : 'tlacitko', text);
    b.type = 'button';
    b.addEventListener('click', akce);
    return b;
  }

  function radaTlacitek(...tlacitka) {
    const r = prvek('div', 'tlacitka');
    r.append(...tlacitka);
    return r;
  }

  function postmark() {
    const obal = prvek('div', 'postmark');
    obal.setAttribute('aria-hidden', 'true');
    obal.innerHTML = `<svg viewBox="0 0 100 100">
      <defs><path id="pm-oblouk" d="M20 52A30 30 0 0 1 80 52"/></defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <text class="pm-obec"><textPath href="#pm-oblouk" startOffset="50%" text-anchor="middle"></textPath></text>
      <text class="pm-datum" x="50" y="64" text-anchor="middle"></text>
      <path d="M26 72H74" stroke="currentColor" stroke-width="1.2"/>
    </svg>`;
    obal.querySelector('textPath').textContent = (etapa?.nazev || '').toUpperCase();
    obal.querySelector('.pm-datum').textContent = etapa?.datum || '';
    return obal;
  }

  function stavZastavky(e, i) {
    if (trasa.hotovo.includes(e.id)) return 'hotovo';
    if ((e.pripraveno || '').toLowerCase() !== 'ano') return 'pripravujeme';
    const predchozi = etapy[i - 1];
    if (ladeni() || !predchozi || trasa.hotovo.includes(predchozi.id)) return jeRozehrana(e.id) ? 'rozehrana' : 'otevrena';
    return 'zamcena';
  }

  function ukazTrasu() {
    zavriReakci(true);
    const arch = otevriArch('arch--trasa', { zavritKlepnutim: !!etapa && !stav?.konec });
    arch.append(prvek('h1', '', hra.nazev), prvek('p', 'podtitul', hra.podtitul), ...odstavce(hra.uvod));
    const prenos = tlacitko('Přenést postup', ukazPrenos, true);
    prenos.classList.add('tlacitko--male');
    const jmeno = tlacitko(`Jméno: ${jmenoHrace()}`, ukazJmeno, true);
    jmeno.classList.add('tlacitko--male');
    const male = [jmeno, prenos];
    if (kapitoly.length || pribeh.length) {
      const denik = tlacitko('Deník', ukazDenik, true);
      denik.classList.add('tlacitko--male');
      male.unshift(denik);
    }
    arch.append(radaTlacitek(...male));
    const seznam = prvek('ol', 'trasa');
    etapy.forEach((e, i) => {
      if (e.kapitola && e.kapitola !== etapy[i - 1]?.kapitola) {
        const k = kapitoly.find((x) => x.id === e.kapitola);
        if (k) {
          const hlava = prvek('li', 'trasa__kapitola');
          hlava.append(prvek('b', '', k.nazev), prvek('span', '', k.obdobi || ''));
          seznam.append(hlava);
        }
      }
      const s = stavZastavky(e, i);
      const polozka = prvek('li', `zastavka zastavka--${s}`);
      const b = prvek('button', 'zastavka__tlacitko');
      b.type = 'button';
      b.disabled = s === 'zamcena' || s === 'pripravujeme';
      const text = prvek('span', 'zastavka__text');
      text.append(prvek('b', '', e.nazev), prvek('span', 'zastavka__podtitul', e.podtitul));
      if (e.upoutavka) text.append(prvek('span', 'zastavka__upoutavka', e.upoutavka));
      b.append(prvek('span', 'zastavka__cislo', String(i + 1)), text, prvek('span', 'zastavka__stav', POPISY_STAVU[s]));
      if (!b.disabled) b.addEventListener('click', () => { zavriArch(); spustEtapu(e.id); });
      polozka.append(b);
      seznam.append(polozka);
    });
    arch.append(seznam);
    if (etapa && !stav.konec) arch.append(radaTlacitek(tlacitko(`Zpět do obce ${etapa.nazev}`, zavriArch, true)));
  }

  function ukazPrenos() {
    zavriReakci(true);
    const arch = otevriArch('arch--prenos', { zavritKlepnutim: true });
    arch.append(
      prvek('h2', '', 'Přenést postup'),
      prvek('p', '', 'Postup se ukládá jen v tomhle prohlížeči. Chceš hrát jinde? Zkopíruj si kód a na druhém zařízení ho vlož.'),
    );

    const vystup = prvek('textarea', 'prenos__kod');
    vystup.readOnly = true;
    vystup.rows = 3;
    vystup.setAttribute('aria-label', 'Kód tvého postupu');
    vystup.value = 'Chvilku…';
    const zprava = prvek('p', 'arch__statistika prenos__zprava');
    const kopirovat = tlacitko('Zkopírovat kód', async () => {
      vystup.focus();
      vystup.select();
      try {
        await navigator.clipboard.writeText(vystup.value);
        zprava.textContent = 'Kód je ve schránce.';
      } catch {
        zprava.textContent = 'Kód je označený. Zkopíruj ho ručně.';
      }
    });
    kopirovat.disabled = true;
    kodPostupu().then((kod) => { vystup.value = kod; kopirovat.disabled = false; })
      .catch(() => { vystup.value = ''; zprava.textContent = 'Kód se nepodařilo vytvořit.'; });
    arch.append(prvek('h3', 'prenos__nadpis', 'Tvůj kód'), vystup, radaTlacitek(kopirovat), zprava);

    const vstup = prvek('textarea', 'prenos__kod');
    vstup.rows = 3;
    vstup.placeholder = 'Sem vlož kód POSTAK…';
    vstup.setAttribute('aria-label', 'Vložit kód postupu');
    vstup.spellcheck = false;
    vstup.autocapitalize = 'off';
    const zpravaVstupu = prvek('p', 'arch__statistika prenos__zprava');
    const potvrzeni = prvek('div', 'prenos__potvrzeni');
    const nacist = tlacitko('Nahrát postup', async () => {
      potvrzeni.replaceChildren();
      try {
        const { klice, hotovo } = await prectiKod(vstup.value);
        zpravaVstupu.textContent = `V kódu ${sklonuj(hotovo, 'je doručená %d obec', 'jsou doručené %d obce', 'je doručeno %d obcí').replace('%d', hotovo)}. Současný postup v tomhle prohlížeči se tím přepíše.`;
        potvrzeni.append(radaTlacitek(
          tlacitko('Přepsat postup', () => {
            try {
              prepisPostup(klice);
              postavKostru();
              vykresliListu();
              ukazTrasu();
            } catch (chyba) {
              zpravaVstupu.textContent = chyba.message;
            }
          }),
          tlacitko('Nechat, jak je', () => { potvrzeni.replaceChildren(); zpravaVstupu.textContent = ''; }, true),
        ));
      } catch (chyba) {
        zpravaVstupu.textContent = chyba.message;
      }
    }, true);
    arch.append(prvek('h3', 'prenos__nadpis', 'Nahrát kód z jiného zařízení'), vstup, radaTlacitek(nacist), zpravaVstupu, potvrzeni);
    arch.append(radaTlacitek(tlacitko('Zpět na trasu', ukazTrasu, true)));
  }

  function ukazMezihru(kapitola, dal) {
    zavriReakci(true);
    const arch = otevriArch('arch--mezihra');
    arch.append(prvek('p', 'arch__nadtitul', 'Z okresní pošty'), prvek('h1', '', kapitola.nazev), prvek('p', 'podtitul', kapitola.obdobi || ''), ...odstavce(kapitola.mezihra));
    // Před první mezihrou se pošťák představí.
    const ulozJmeno = svet.hrac ? null : formularJmena(arch);
    arch.append(radaTlacitek(tlacitko('Pokračovat', () => {
      if (ulozJmeno && !ulozJmeno()) return;
      if (!svet.videno.includes(kapitola.id)) svet.videno.push(kapitola.id);
      uloz();
      dal();
    })));
  }

  function ukazDenik() {
    zavriReakci(true);
    const arch = otevriArch('arch--denik', { zavritKlepnutim: true });
    const ziskane = pribeh.filter((z) => svet.vlajky.includes(z.id));
    arch.append(prvek('h2', '', 'Deník'), prvek('p', 'podtitul', jmenoHrace()), prvek('p', 'arch__statistika', `Zápisů o Vrbovi: ${ziskane.length} z ${pribeh.length}`));
    let nic = true;
    for (const k of kapitoly) {
      const zapisy = ziskane.filter((z) => z.kapitola === k.id);
      const videl = svet.videno.includes(k.id);
      if (!videl && !zapisy.length) continue;
      nic = false;
      const skupina = prvek('section', 'denik__kapitola');
      skupina.append(prvek('h3', 'denik__nadpis', k.nazev));
      if (videl && k.mezihra) {
        const posta = prvek('details', 'denik__mezihra');
        posta.append(prvek('summary', '', 'Z okresní pošty'), ...odstavce(k.mezihra));
        skupina.append(posta);
      }
      for (const z of zapisy) {
        const polozka = prvek('div', 'denik__zapis');
        polozka.append(prvek('b', '', z.nadpis), prvek('span', 'denik__obec', z.obec || ''), prvek('p', '', z.text));
        skupina.append(polozka);
      }
      arch.append(skupina);
    }
    const bezKapitoly = ziskane.filter((z) => !kapitoly.some((k) => k.id === z.kapitola));
    for (const z of bezKapitoly) {
      nic = false;
      const polozka = prvek('div', 'denik__zapis');
      polozka.append(prvek('b', '', z.nadpis), prvek('span', 'denik__obec', z.obec || ''), prvek('p', '', z.text));
      arch.append(polozka);
    }
    if (nic) arch.append(prvek('p', '', 'Deník je zatím prázdný.'));
    arch.append(radaTlacitek(tlacitko('Zpět na trasu', ukazTrasu, true)));
  }

  function ukazUvod() {
    const arch = otevriArch('arch--uvod');
    arch.append(postmark(), prvek('h1', '', etapa.nazev), prvek('p', 'podtitul', etapa.podtitul), ...odstavce(etapa.uvod));
    const rozehrano = stav.vlajky.length > 0 || stav.ruka.join(' ') !== slova(etapa.start).join(' ');
    if (rozehrano) {
      arch.append(radaTlacitek(
        tlacitko('Pokračovat', zavriArch),
        tlacitko('Začít znovu', () => { restart(); zavriArch(); }, true),
      ));
    } else {
      arch.append(radaTlacitek(tlacitko('Vyrazit na pochůzku', zavriArch)));
    }
  }

  function textAlba() {
    const n = pocetObjevu(), z = objevitelna.length;
    if (n >= z) return `V albu máš všech ${z} reakcí. Máš objeveno úplně všechno.`;
    return `V albu máš ${n} z ${z} reakcí. Další objevíš, když budeš zásilky zkoušet i na nesprávné adresy.`;
  }

  function ukazVyhru() {
    const arch = otevriArch('arch--konec');
    arch.append(vytvorRazitko(), prvek('h1', '', etapa.konec_nadpis || 'Doručeno!'), ...odstavce(etapa.konec_text), prvek('p', 'arch__statistika', textAlba()));
    const index = etapy.findIndex((e) => e.id === etapa.id);
    const dalsi = etapy[index + 1];
    const tlacitka = [];
    if (dalsi && (dalsi.pripraveno || '').toLowerCase() === 'ano') {
      tlacitka.push(tlacitko(`Další obec: ${dalsi.nazev}`, () => { zavriArch(); spustEtapu(dalsi.id); }));
    } else {
      if (dalsi) arch.append(prvek('p', 'arch__statistika', `Další obce na trase se teprve připravují. Příští zastávka: ${dalsi.nazev}.`));
      tlacitka.push(tlacitko('Na trasu', ukazTrasu));
    }
    tlacitka.push(tlacitko('Album', ukazAlbum, true), tlacitko('Hrát znovu', () => { restart(); zavriArch(); ukazUvod(); }, true));
    arch.append(radaTlacitek(...tlacitka));
  }

  function ukazProhru() {
    const arch = otevriArch('arch--konec');
    arch.append(prvek('h1', '', 'Tentokrát to nevyšlo'), ...odstavce(etapa.prohra_text || 'Pochůzka se nepovedla.'));
    arch.append(radaTlacitek(
      tlacitko('Zkusit znovu', () => { restart(); zavriArch(); ukazUvod(); }),
      tlacitko('Na trasu', ukazTrasu, true),
    ));
  }

  function ukazAlbum() {
    if (!etapa) return;
    zavriReakci(true);
    const arch = otevriArch('arch--album', { zavritKlepnutim: true });
    arch.append(prvek('h2', '', `Album · ${etapa.nazev}`), prvek('p', 'arch__statistika', `Objeveno ${pocetObjevu()} z ${objevitelna.length} reakcí`));
    for (const c of cile) {
      const jeho = objevitelna.filter((p) => p.cil === c.id);
      if (!jeho.length) continue;
      const nalezena = jeho.filter((p) => album.has(klicPravidla(p)));
      const skupina = prvek('section', 'album__skupina');
      const hlava = prvek('div', 'album__hlava');
      const ikona = prvek('span', 'album__ikona');
      ikona.append(ikonaCile(c, c.ikona));
      hlava.append(ikona, prvek('span', '', c.jmeno), prvek('span', 'album__pocet', `${nalezena.length}/${jeho.length}`));
      skupina.append(hlava);
      for (const p of nalezena) {
        const polozka = prvek('div', 'album__polozka');
        const karta = prvek('span', 'album__karta');
        karta.append(vytvorIkonu(ikonaKarty(p.karta)));
        polozka.append(karta, prvek('span', '', p.text));
        skupina.append(polozka);
      }
      const zbyva = jeho.length - nalezena.length;
      if (zbyva) skupina.append(prvek('p', 'album__zbyva', `Ještě ${zbyva} ${sklonuj(zbyva, 'neobjevená reakce', 'neobjevené reakce', 'neobjevených reakcí')}`));
      arch.append(skupina);
    }
    arch.append(radaTlacitek(tlacitko('Zavřít', () => (stav.konec === 'vyhra' ? ukazVyhru() : zavriArch()))));
  }

  function ukazChybu(chyba) {
    console.error(chyba);
    const arch = otevriArch('arch--chyba');
    arch.append(
      prvek('h2', '', 'Hra se nenačetla'),
      prvek('p', '', 'Nepodařilo se načíst tabulky ze složky data. Když hru otevřeš přímo ze souboru, prohlížeč jejich čtení zakáže. Ve složce hry spusť python3 -m http.server 8000 a otevři http://localhost:8000.'),
      prvek('p', 'arch__statistika', String(chyba?.message || chyba)),
    );
  }

  // ---------- Průběh ----------

  function restart() {
    stav = novyStav();
    vybrana = null;
    uloz();
    aktualizuj();
  }

  async function spustEtapu(id) {
    const radek = etapy.find((e) => e.id === id);
    if (!radek) return;
    let data;
    try {
      data = await nactiEtapu(id);
    } catch (e) {
      ukazChybu(e);
      return;
    }
    etapa = { ...data.nastaveni, ...radek };
    cile = data.cile;
    cilePodleId = Object.fromEntries(cile.map((c) => [c.id, c]));
    karty = Object.fromEntries(data.karty.map((k) => [k.id, k]));
    pravidla = [...data.pravidla, ...spolecna].filter((p) => p.karta && p.cil);
    objevitelna = pravidla.filter(jeObjevitelne);
    vrstvy = data.vrstvy;
    tahy = data.tahy || [];
    obrazkyObce = data.obrazky || [];
    vybrana = null;
    nactiStav(id);
    if (!stav || stav.konec) stav = novyStav();
    uloz();
    postavNaves();
    aktualizuj();
    const kapitola = kapitoly.find((k) => k.id === radek.kapitola);
    if (kapitola?.mezihra && !svet.videno.includes(kapitola.id)) ukazMezihru(kapitola, ukazUvod);
    else ukazUvod();
  }

  document.addEventListener('keydown', (e) => {
    if ($('.panel') && ['Escape', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      zavriReakci();
    } else if (e.key === 'Escape' && $('.prekryv[data-zavritelny]')) {
      zavriArch();
    } else if (e.key === 'Escape' && vybrana) {
      vybrana = null;
      aktualizuj();
    }
  });

  window.addEventListener('hashchange', vykresliLadeni);

  async function start() {
    postavKostru();
    try {
      const volitelna = (cesta) => nactiTabulku(cesta).catch(() => []);
      const [hraRadky, etapyRadky, k, p, s] = await Promise.all([
        nactiTabulku('hra.csv'), nactiTabulku('etapy.csv'), volitelna('kapitoly.csv'), volitelna('pribeh.csv'), volitelna('spolecne.csv'),
      ]);
      hra = Object.fromEntries(hraRadky.map((r) => [r.klic, r.hodnota]));
      etapy = etapyRadky.filter((e) => e.id);
      kapitoly = k.filter((x) => x.id);
      pribeh = p.filter((x) => x.id);
      spolecna = s.filter((x) => x.karta && x.cil).map((x) => ({ ...x, spolecne: true }));
    } catch (e) {
      ukazChybu(e);
      return;
    }
    const ulozenaTrasa = precti(KLIC_TRASY);
    if (ulozenaTrasa && Array.isArray(ulozenaTrasa.hotovo)) trasa = ulozenaTrasa;
    svet = nactiSvet();
    vykresliListu();
    ukazTrasu();
  }

  start();
})();

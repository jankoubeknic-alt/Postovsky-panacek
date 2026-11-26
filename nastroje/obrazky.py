# Převede obrázky (např. PNG z ChatGPT) do obce: zmenší je, uloží jako WebP do data/<obec>/obrazky/
# a doplní data/<obec>/obrazky.csv.
#
#   python3 nastroje/obrazky.py <obec> <složka s obrázky>
#
# Jména souborů určují, kam obrázek patří:
#   pozadi.png        scéna obce (ořízne se na 3:4, 900 × 1200)
#   <id cíle>.png     portrét cíle z cile.csv (ořízne se na čtverec, 320 × 320)
#   <vrstva>.png      kreslená náhrada vrstvy z vrstvy.csv (samota.png za samota.svg). Ořízne se jako scéna
#                     na 3:4, 900 × 1200. Bez řádku ve vyrez.csv zakryje celou scénu (světnice). S řádkem
#                     z ní zůstane jen výřez s měkkým okrajem, třeba upravená scéna s vypitým rybníkem.
#   <id karty>.png    obrázek karty z karty.csv (čtverec, 320 × 320). Jednobarevné pozadí kolem věci
#                     se zprůhlední (stín zůstane jako poloprůhledný), aby na barevné kartě nebyl vidět čtverec.
#                     Postava nakreslená v barevném kruhu zůstane celá jako kulatý medailon.
#   <id cíle>_<cokoli>.png   portrét pro změněnou ikonu cíle. Když má cíl v kombinace.csv jen jednu změnu
#                     ikony (ikona:pes:🐕💤), přiřadí se sám. Jinak nástroj vypíše řádek k ručnímu doplnění.
# Ve vstupní složce můžou být ještě tři seznamy (všechny nepovinné, oddělené středníkem):
#   kopie.csv  soubor;zdroj   obrázek z jiné obce (zdroj je cesta od obrazky_vstup, např. lhotka/vrbuv_dopis.png).
#                             Nástroj ho zkopíruje, jakmile zdroj existuje.
#   mapa.csv   soubor;druh;id;ikona   jeden obrázek pro další cíl, kartu nebo změněnou ikonu cíle.
#   vyrez.csv  soubor;x1;y1;x2;y2     z obrázku vrstvy zůstane jen obdélník (procenta scény), zbytek je průhledný.
# Vrstvu, kterou kreslená scéna už má nakreslenou, skryje ruční řádek v obrazky.csv se souborem „-“
# (vrstva;voda;;-).
# Ručně doplněné řádky v obrazky.csv zůstanou. Potřebuje Pillow (python3 -m pip install pillow).
import csv, math, os, re, shutil, sys

from PIL import Image, ImageDraw, ImageFilter, ImageOps

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRIPONY = ('.png', '.jpg', '.jpeg', '.webp')
HLAVICKA = ['druh', 'id', 'ikona', 'soubor']


def tabulka(cesta):
    if not os.path.exists(cesta):
        return []
    with open(cesta, encoding='utf-8') as f:
        radky = [r for r in f if r.strip() and not r.lstrip().startswith('#')]
    return list(csv.DictReader(radky, delimiter=';'))


def orizni(obr, pomer):
    # Vystředěný ořez na poměr šířka/výška.
    s, v = obr.size
    if s / v > pomer:
        nova = round(v * pomer)
        return obr.crop(((s - nova) // 2, 0, (s - nova) // 2 + nova, v))
    nova = round(s / pomer)
    return obr.crop((0, (v - nova) // 2, s, (v - nova) // 2 + nova))


def zpruhledni(obr, prah=80, cisto=3):
    # Pozadí = barva okraje obrázku. Průhledné je jen pozadí spojené s okrajem, takže světlá místa
    # uvnitř věci zůstanou. Odstín pozadí se odečte (jako „barva do průhlednosti“ v GIMPu): stín
    # a vyhlazené hrany jsou pak poloprůhledné a tmavé, bez krémového lemu.
    obr = obr.convert('RGB')
    s, v = obr.size
    px = obr.load()
    okraj = [px[x, y] for x in range(s) for y in (0, 1, v - 2, v - 1)] + [px[x, y] for y in range(v) for x in (0, 1, s - 2, s - 1)]
    pozadi = tuple(sorted(p[i] for p in okraj)[len(okraj) // 2] for i in range(3))
    rozdil = lambda p: max(abs(p[i] - pozadi[i]) for i in range(3))
    maska = Image.new('L', (s, v))
    mp = maska.load()
    for y in range(v):
        for x in range(s):
            mp[x, y] = 255 if rozdil(px[x, y]) <= prah else 0
    kresli = ImageDraw.Draw(maska)
    for x, y in [(x, y) for x in range(s) for y in (0, v - 1)] + [(x, y) for y in range(v) for x in (0, s - 1)]:
        if mp[x, y] == 255:
            ImageDraw.floodfill(maska, (x, y), 128)
    vysledek = Image.new('RGBA', (s, v))
    vp = vysledek.load()
    for y in range(v):
        for x in range(s):
            p = px[x, y]
            if mp[x, y] != 128:
                vp[x, y] = (*p, 255)
                continue
            if rozdil(p) <= cisto:
                vp[x, y] = (*pozadi, 0)
                continue
            a = max((pozadi[i] - p[i]) / pozadi[i] if p[i] < pozadi[i] else (p[i] - pozadi[i]) / max(1, 255 - pozadi[i]) for i in range(3))
            a = min(1.0, a)
            barva = tuple(max(0, min(255, round((p[i] - pozadi[i]) / a + pozadi[i]))) for i in range(3))
            vp[x, y] = (*barva, round(a * 255))
    return vysledek


def kruh(obr):
    # Postava nakreslená v barevném kruhu na světlém pozadí (prompt pro medailon použitý u karty).
    # Vrátí obrázek s průhledným okolím kruhu, nebo None, když v obrázku žádný kruh není.
    obr = obr.convert('RGB')
    s, v = obr.size
    px = obr.load()
    roh = tuple(sorted(c[i] for c in (px[2, 2], px[s - 3, 2], px[2, v - 3], px[s - 3, v - 3]))[1] for i in range(3))
    rozdil = lambda p, q: max(abs(p[i] - q[i]) for i in range(3))
    cx, cy, m = s / 2, v / 2, min(s, v)
    prsten = [px[int(cx + 0.47 * m * math.cos(a / 90 * math.pi)), int(cy + 0.47 * m * math.sin(a / 90 * math.pi))] for a in range(180)]
    stred = tuple(sorted(p[i] for p in prsten)[90] for i in range(3))
    if rozdil(stred, roh) < 8 or sum(rozdil(p, stred) <= 10 for p in prsten) < 0.6 * len(prsten):
        return None
    polomery = []
    for a in range(0, 360, 10):
        for r in range(int(0.3 * m), int(0.52 * m)):
            x, y = int(cx + r * math.cos(math.radians(a))), int(cy + r * math.sin(math.radians(a)))
            if not (0 <= x < s and 0 <= y < v):
                break
            if rozdil(px[x, y], roh) <= 6:
                polomery.append(r)
                break
    if len(polomery) < 18:
        return None
    r = sorted(polomery)[len(polomery) // 2] - 1
    maska = Image.new('L', (s * 4, v * 4))
    ImageDraw.Draw(maska).ellipse(((cx - r) * 4, (cy - r) * 4, (cx + r) * 4, (cy + r) * 4), fill=255)
    vysledek = obr.convert('RGBA')
    vysledek.putalpha(maska.resize((s, v), Image.LANCZOS))
    return vysledek


def vyrizni(obr, ramecek):
    # Z obrázku zůstane jen obdélník (x1, y1, x2, y2 v procentech) s měkkým okrajem. Strana u kraje obrázku zůstane ostrá.
    s, v = obr.size
    mekce = round(s * 0.03)
    x1, y1, x2, y2 = (float(c) for c in ramecek)
    ven = 3 * mekce
    box = (-ven if x1 <= 0 else x1 / 100 * s, -ven if y1 <= 0 else y1 / 100 * v,
           s + ven if x2 >= 100 else x2 / 100 * s, v + ven if y2 >= 100 else y2 / 100 * v)
    maska = Image.new('L', (s, v))
    ImageDraw.Draw(maska).rectangle(box, fill=255)
    maska = maska.filter(ImageFilter.GaussianBlur(mekce))
    vysledek = obr.convert('RGBA')
    vysledek.putalpha(maska)
    return vysledek


def preved(zdroj, cil, rozmer, pruhledne=False, ramecek=None):
    obr = ImageOps.exif_transpose(Image.open(zdroj))
    obr = obr.convert('RGBA' if 'A' in obr.getbands() else 'RGB')
    obr = orizni(obr, rozmer[0] / rozmer[1]).resize(rozmer, Image.LANCZOS)
    if ramecek:
        obr = vyrizni(obr, ramecek)
    # Obrázek, který už průhlednost má (třeba z ChatGPT s „transparent background“), zůstane, jak je.
    if pruhledne and not (obr.mode == 'RGBA' and obr.getchannel('A').getextrema()[0] < 250):
        obr = kruh(obr) or zpruhledni(obr)
    obr.save(cil, 'WEBP', quality=82, method=6)
    return os.path.getsize(cil)


def main():
    if len(sys.argv) != 3:
        sys.exit('python3 nastroje/obrazky.py <obec> <složka s obrázky>')
    obec, vstup = sys.argv[1], sys.argv[2]
    slozka = os.path.join(KOREN, 'data', obec)
    if not os.path.isfile(os.path.join(slozka, 'etapa.csv')):
        sys.exit(f'Obec {obec} neexistuje (chybí data/{obec}/etapa.csv).')
    cile = {r['id'] for r in tabulka(os.path.join(slozka, 'cile.csv'))}
    karty = {r['id'] for r in tabulka(os.path.join(slozka, 'karty.csv'))}
    vrstvy = {os.path.splitext(os.path.basename(r['obrazek']))[0].lower() for r in tabulka(os.path.join(slozka, 'vrstvy.csv')) if r.get('obrazek')}
    zmeny = {}
    for tab in ('kombinace.csv', 'kazdy_tah.csv'):
        for r in tabulka(os.path.join(slozka, tab)):
            for m in re.finditer(r'ikona:([a-z0-9_]+):([^\s;]+)', r.get('efekt') or ''):
                zmeny.setdefault(m.group(1), set()).add(m.group(2))
    bez_vs = lambda t: t.replace('\ufe0f', '')

    # kopie.csv: obrázky z jiných obcí (soubor;zdroj, zdroj je cesta od složky obrazky_vstup).
    # Chybějící kopie se doplní, jakmile zdroj existuje.
    for r in tabulka(os.path.join(vstup, 'kopie.csv')):
        cil_kopie = os.path.join(vstup, r['soubor'])
        zdroj = os.path.join(vstup, '..', r['zdroj'])
        if not os.path.exists(cil_kopie) and os.path.exists(zdroj):
            shutil.copyfile(zdroj, cil_kopie)
            print(f'kopie: {r["zdroj"]} -> {r["soubor"]}')

    # mapa.csv: jeden obrázek pro další cíle, karty nebo stavy (soubor;druh;id;ikona).
    mapa = {}
    for r in tabulka(os.path.join(vstup, 'mapa.csv')):
        ikona = r.get('ikona') or ''
        if ikona:
            presna = [z for z in zmeny.get(r['id'], ()) if bez_vs(z) == bez_vs(ikona)]
            if not presna:
                print(f'  mapa.csv: {r["id"]} nemá změnu ikony {ikona}, řádek přeskočen')
                continue
            ikona = presna[0]
        mapa.setdefault(os.path.splitext(r['soubor'])[0].lower(), []).append({'druh': r['druh'], 'id': r['id'], 'ikona': ikona})

    # vyrez.csv: z obrázku vrstvy zůstane jen obdélník (soubor;x1;y1;x2;y2 v procentech scény).
    vyrezy = {os.path.splitext(r['soubor'])[0].lower(): (r['x1'], r['y1'], r['x2'], r['y2']) for r in tabulka(os.path.join(vstup, 'vyrez.csv'))}

    os.makedirs(os.path.join(slozka, 'obrazky'), exist_ok=True)
    cesta_csv = os.path.join(slozka, 'obrazky.csv')
    radky = tabulka(cesta_csv)
    klic = lambda r: (r['druh'], r['id'], r.get('ikona') or '')
    zname = {klic(r): r for r in radky}
    rucne = []

    for nazev in sorted(os.listdir(vstup)):
        jmeno, pripona = os.path.splitext(nazev)
        if pripona.lower() not in PRIPONY:
            continue
        jmeno = jmeno.lower()
        soubor = f'obrazky/{jmeno}.webp'
        nove = [dict(m) for m in mapa.get(jmeno, [])]
        rozmer = (320, 320)
        if jmeno == 'pozadi':
            nove.append({'druh': 'pozadi', 'id': '', 'ikona': ''})
            rozmer = (900, 1200)
        elif jmeno in cile:
            nove.append({'druh': 'cil', 'id': jmeno, 'ikona': ''})
        elif jmeno in karty:
            nove.append({'druh': 'karta', 'id': jmeno, 'ikona': ''})
        elif jmeno in vrstvy:
            nove.append({'druh': 'vrstva', 'id': jmeno, 'ikona': ''})
            rozmer = (900, 1200)
        elif not nove:
            cil = next((c for c in sorted(cile, key=len, reverse=True) if jmeno.startswith(c + '_')), None)
            if cil and len(zmeny.get(cil, ())) == 1:
                nove.append({'druh': 'cil', 'id': cil, 'ikona': next(iter(zmeny[cil]))})
            else:
                navrh = ' nebo '.join(sorted(zmeny.get(cil, ()))) if cil else ''
                rucne.append(f'  {nazev}: doplň do mapa.csv řádek {nazev};cil;{cil or "<id cíle>"};{navrh or "<ikona>"}')
        # Věci na kartě mají průhledné pozadí, portréty a scéna ne.
        pruhledne = bool(nove) and all(r['druh'] == 'karta' for r in nove)
        ramecek = vyrezy.get(jmeno) if jmeno in vrstvy else None
        velikost = preved(os.path.join(vstup, nazev), os.path.join(slozka, soubor), rozmer, pruhledne, ramecek)
        print(f'{nazev} -> data/{obec}/{soubor} ({velikost // 1024} kB)')
        for radek in nove:
            radek['soubor'] = soubor
            zname[klic(radek)] = radek

    poradi = {'pozadi': 0, 'vrstva': 1, 'cil': 2, 'karta': 3}
    with open(cesta_csv, 'w', encoding='utf-8', newline='') as f:
        f.write('# Kreslené obrázky obce. druh: pozadi, vrstva, cil, karta. ikona: jen u cíle, obrázek pro změněnou ikonu.\n')
        f.write('# soubor: cesta od složky obce (může vést i do jiné obce, ../lhotka/obrazky/pes.webp). U vrstvy „-“: kreslená scéna ji skryje.\n')
        zapis = csv.DictWriter(f, HLAVICKA, delimiter=';', lineterminator='\n', extrasaction='ignore')
        zapis.writeheader()
        for r in sorted(zname.values(), key=lambda r: (poradi.get(r['druh'], 9), r['id'], r.get('ikona') or '')):
            zapis.writerow({k: r.get(k) or '' for k in HLAVICKA})
    print(f'data/{obec}/obrazky.csv: {len(zname)} řádků')
    if rucne:
        print('Nepřiřazené obrázky:')
        print('\n'.join(rucne))


if __name__ == '__main__':
    main()

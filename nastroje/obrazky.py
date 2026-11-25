# Převede obrázky (např. PNG z ChatGPT) do obce: zmenší je, uloží jako WebP do data/<obec>/obrazky/
# a doplní data/<obec>/obrazky.csv.
#
#   python3 nastroje/obrazky.py <obec> <složka s obrázky>
#
# Jména souborů určují, kam obrázek patří:
#   pozadi.png        scéna obce (ořízne se na 3:4, 900 × 1200)
#   <id cíle>.png     portrét cíle z cile.csv (ořízne se na čtverec, 320 × 320)
#   <id karty>.png    obrázek karty z karty.csv (čtverec, 320 × 320). Jednobarevné pozadí kolem věci
#                     se zprůhlední (stín zůstane jako poloprůhledný), aby na barevné kartě nebyl vidět čtverec.
#   <id cíle>_<cokoli>.png   portrét pro změněnou ikonu cíle. Když má cíl v kombinace.csv jen jednu změnu
#                     ikony (ikona:pes:🐕💤), přiřadí se sám. Jinak nástroj vypíše řádek k ručnímu doplnění.
# Ve vstupní složce můžou být ještě dva seznamy (oba nepovinné, oddělené středníkem):
#   kopie.csv  soubor;zdroj   obrázek z jiné obce (zdroj je cesta od obrazky_vstup, např. lhotka/vrbuv_dopis.png).
#                             Nástroj ho zkopíruje, jakmile zdroj existuje.
#   mapa.csv   soubor;druh;id;ikona   jeden obrázek pro další cíl, kartu nebo změněnou ikonu cíle.
# Ručně doplněné řádky v obrazky.csv zůstanou. Potřebuje Pillow (python3 -m pip install pillow).
import csv, os, re, shutil, sys

from PIL import Image, ImageDraw, ImageOps

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


def preved(zdroj, cil, rozmer, pruhledne=False):
    obr = ImageOps.exif_transpose(Image.open(zdroj))
    obr = obr.convert('RGBA' if 'A' in obr.getbands() else 'RGB')
    obr = orizni(obr, rozmer[0] / rozmer[1]).resize(rozmer, Image.LANCZOS)
    # Obrázek, který už průhlednost má (třeba z ChatGPT s „transparent background“), zůstane, jak je.
    if pruhledne and not (obr.mode == 'RGBA' and obr.getchannel('A').getextrema()[0] < 250):
        obr = zpruhledni(obr)
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
        elif not nove:
            cil = next((c for c in sorted(cile, key=len, reverse=True) if jmeno.startswith(c + '_')), None)
            if cil and len(zmeny.get(cil, ())) == 1:
                nove.append({'druh': 'cil', 'id': cil, 'ikona': next(iter(zmeny[cil]))})
            else:
                navrh = ' nebo '.join(sorted(zmeny.get(cil, ()))) if cil else ''
                rucne.append(f'  {nazev}: doplň do mapa.csv řádek {nazev};cil;{cil or "<id cíle>"};{navrh or "<ikona>"}')
        # Věci na kartě mají průhledné pozadí, portréty a scéna ne.
        pruhledne = bool(nove) and all(r['druh'] == 'karta' for r in nove)
        velikost = preved(os.path.join(vstup, nazev), os.path.join(slozka, soubor), rozmer, pruhledne)
        print(f'{nazev} -> data/{obec}/{soubor} ({velikost // 1024} kB)')
        for radek in nove:
            radek['soubor'] = soubor
            zname[klic(radek)] = radek

    poradi = {'pozadi': 0, 'cil': 1, 'karta': 2}
    with open(cesta_csv, 'w', encoding='utf-8', newline='') as f:
        f.write('# Kreslené obrázky obce. druh: pozadi, cil, karta. ikona: jen u cíle, obrázek pro změněnou ikonu.\n')
        f.write('# soubor: cesta od složky obce (může vést i do jiné obce, ../lhotka/obrazky/pes.webp).\n')
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

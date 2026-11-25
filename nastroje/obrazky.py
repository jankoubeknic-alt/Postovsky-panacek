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
# Ručně doplněné řádky v obrazky.csv zůstanou. Potřebuje Pillow (python3 -m pip install pillow).
import csv, os, re, sys

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
        sys.exit(__doc__ or 'python3 nastroje/obrazky.py <obec> <složka s obrázky>')
    obec, vstup = sys.argv[1], sys.argv[2]
    slozka = os.path.join(KOREN, 'data', obec)
    if not os.path.isfile(os.path.join(slozka, 'etapa.csv')):
        sys.exit(f'Obec {obec} neexistuje (chybí data/{obec}/etapa.csv).')
    cile = {r['id'] for r in tabulka(os.path.join(slozka, 'cile.csv'))}
    karty = {r['id'] for r in tabulka(os.path.join(slozka, 'karty.csv'))}
    zmeny = {}
    for r in tabulka(os.path.join(slozka, 'kombinace.csv')):
        for m in re.finditer(r'ikona:([a-z0-9_]+):(\S+)', r.get('efekt') or ''):
            zmeny.setdefault(m.group(1), set()).add(m.group(2))

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
        if jmeno == 'pozadi':
            radek, rozmer = {'druh': 'pozadi', 'id': '', 'ikona': ''}, (900, 1200)
        elif jmeno in cile:
            radek, rozmer = {'druh': 'cil', 'id': jmeno, 'ikona': ''}, (320, 320)
        elif jmeno in karty:
            radek, rozmer = {'druh': 'karta', 'id': jmeno, 'ikona': ''}, (320, 320)
        else:
            cil = next((c for c in sorted(cile, key=len, reverse=True) if jmeno.startswith(c + '_')), None)
            rozmer = (320, 320)
            if cil and len(zmeny.get(cil, ())) == 1:
                radek = {'druh': 'cil', 'id': cil, 'ikona': next(iter(zmeny[cil]))}
            else:
                radek = None
                navrh = ' nebo '.join(sorted(zmeny.get(cil, ()))) if cil else ''
                rucne.append(f'  {nazev}: doplň do obrazky.csv řádek cil;{cil or "<id cíle>"};{navrh or "<ikona>"};{soubor}')
        pruhledne = bool(radek) and radek['druh'] == 'karta'
        velikost = preved(os.path.join(vstup, nazev), os.path.join(slozka, soubor), rozmer, pruhledne)
        print(f'{nazev} -> data/{obec}/{soubor} ({velikost // 1024} kB)')
        if radek:
            radek['soubor'] = soubor
            zname.setdefault(klic(radek), radek)['soubor'] = soubor

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

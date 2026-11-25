# Pomocník pro psaní tabulek obce: řádky kombinací se řadí podle obecnosti (konkrétní, *;cíl, karta;*, *;*).
import os, subprocess, json
SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SP)
HLAVICKA = '''# Co se stane, když hráč použije kartu na cíl.
# Řádky se čtou shora dolů a platí PRVNÍ, který sedí. Konkrétní řádky patří nad obecné.
# karta: id karty | ? = klepnutí na cíl bez karty | napoveda = tlačítko nápovědy | * = jakákoli karta
# cil: id cíle | * = jakýkoli cíl
# podminka: slova oddělená mezerou, musí platit všechna. vlajka = je nastavená | !vlajka = není | @karta = hráč ji má v brašně
# vyraz: emoji, nebo cesta k obrázku. Ukáže se u postavy a v okénku s textem.
# efekt: +karta přidá kartu | -karta odebere | vlajka nastaví | !vlajka zruší | ikona:cil:emoji změní ikonu cíle | razitko ukáže razítko DORUČENO | cekej nechá uběhnout tah
# počítadla: v efektu x=1, x+1, x-1 | v podmínce x=1, x>0, !x=1'''
SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">\n  <!-- {} -->\n{}\n</svg>\n'

class Obec:
    def __init__(s, oid):
        s.id = oid; s.R = []; s.dir = f'{ROOT}/data/{oid}'
        os.makedirs(s.dir, exist_ok=True)
    def r(s, karta, cil, podminka, vyraz, text, efekt='', prio=None):
        for x in (karta, cil, podminka, vyraz, text, efekt):
            assert ';' not in x and '\n' not in x, x
        if prio is None:
            prio = 3 if (karta == '*' and cil == '*') else 2 if cil == '*' and karta not in ('napoveda',) else 1 if karta == '*' else 0
        s.R.append((prio, len(s.R), ';'.join([karta, cil, podminka, vyraz, text, efekt])))
    def zapis(s, nazev, obsah):
        open(f'{s.dir}/{nazev}', 'w').write(obsah)
    def etapa(s, datum, start, cil, uvod, navod, konec_nadpis, konec_text, pocitadla='', ukazatele='', brasna='', prohra='', prohra_text=''):
        radky = [('datum', datum), ('start', start), ('cil', cil), ('uvod', uvod), ('navod', navod), ('konec_nadpis', konec_nadpis),
                 ('konec_text', konec_text), ('pozadi', f'data/{s.id}/pozadi.svg'), ('barvy', ''), ('pocitadla', pocitadla),
                 ('kazdy_tah', ''), ('kazdy_tah_kdyz', ''), ('ukazatele', ukazatele), ('prohra', prohra), ('prohra_text', prohra_text)]
        if brasna: radky.append(('brasna', brasna))
        for k, v in radky: assert ';' not in v, (k, v)
        s.zapis('etapa.csv', 'klic;hodnota\n' + '\n'.join(f'{k};{v}' for k, v in radky) + '\n')
    def cile(s, radky):
        s.zapis('cile.csv', '# x, y: pozice ve scéně v procentech šířky a výšky. skryt_kdyz: podmínka, kdy cíl ve scéně není (může obsahovat „nebo“).\nid;jmeno;ikona;x;y;skryt_kdyz\n' + '\n'.join(';'.join(map(str, x)) for x in radky) + '\n')
    def karty(s, radky):
        for x in radky: assert all(';' not in str(v) for v in x), x
        s.zapis('karty.csv', 'id;nazev;druh;ikona;adresa;popis\n' + '\n'.join(';'.join(x) for x in radky) + '\n')
    def tahy(s, komentar, radky):
        s.zapis('kazdy_tah.csv', f'# {komentar}\npodminka;efekt;text\n' + '\n'.join(';'.join(x) for x in radky) + '\n')
    def vrstvy(s, komentar, radky):
        if not radky: return  # prázdný vrstvy.csv se nezapisuje, artefakt má limit souborů
        s.zapis('vrstvy.csv', f'# {komentar}\nobrazek;podminka\n' + '\n'.join(f'data/{s.id}/{a};{b}' for a, b in radky) + '\n')
    def svg(s, nazev, popis, telo):
        s.zapis(nazev, SVG.format(popis, telo))
    def uloz(s, popis):
        rr = [x[2] for x in sorted(s.R)]
        s.zapis('kombinace.csv', HLAVICKA + '\n' + '\n'.join(f'# {p}' for p in popis) + '\nkarta;cil;podminka;vyraz;text;efekt\n' + '\n'.join(rr) + '\n')
    def over(s):
        out = subprocess.run(['node', f'{SP}/over.mjs', f'data/{s.id}/'], cwd=ROOT, capture_output=True, text=True).stdout
        print(' '.join(out.split()))

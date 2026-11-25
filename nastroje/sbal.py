# Sbalí každou obec (všechny CSV a SVG ze složky data/<obec>/) do jednoho souboru data/<obec>.json.
# Výsledek je celý web ve složce, kterou zadáš: index.html, hra.js, hra.css, tabulky data/*.csv a balíky obcí.
# Engine si balík načte, když složka obce chybí. Hodí se pro hostingy s limitem počtu souborů (artefakt).
#
#   python3 nastroje/sbal.py /cesta/k/vystupu
import json, os, shutil, sys

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vystup = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(KOREN, 'sbaleno'))
if vystup == KOREN or vystup == os.path.join(KOREN, 'data'):
    sys.exit('Výstup nesmí být kořen projektu ani složka data.')
shutil.rmtree(vystup, ignore_errors=True)
os.makedirs(os.path.join(vystup, 'data'))
for soubor in ('index.html', 'hra.js', 'hra.css'):
    if os.path.exists(os.path.join(KOREN, soubor)):
        shutil.copy(os.path.join(KOREN, soubor), vystup)
# Tabulky celé hry (hra.csv, etapy.csv, kapitoly.csv, pribeh.csv, spolecne.csv…) jdou beze změny.
for soubor in sorted(os.listdir(os.path.join(KOREN, 'data'))):
    if soubor.endswith('.csv'):
        shutil.copy(os.path.join(KOREN, 'data', soubor), os.path.join(vystup, 'data'))
pocet = 0
for obec in sorted(os.listdir(os.path.join(KOREN, 'data'))):
    slozka = os.path.join(KOREN, 'data', obec)
    if not os.path.isfile(os.path.join(slozka, 'etapa.csv')):
        continue
    balik = {}
    for nazev in sorted(os.listdir(slozka)):
        if nazev.endswith(('.csv', '.svg')):
            with open(os.path.join(slozka, nazev), encoding='utf-8') as f:
                balik[nazev] = f.read()
    with open(os.path.join(vystup, 'data', f'{obec}.json'), 'w', encoding='utf-8') as f:
        json.dump(balik, f, ensure_ascii=False, separators=(',', ':'))
    pocet += 1
print(f'{pocet} obcí sbaleno do {vystup}')

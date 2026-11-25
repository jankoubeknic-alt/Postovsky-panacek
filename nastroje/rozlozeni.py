# Najde dvojice cílů, jejichž medailony se můžou překrývat (blíž než 20 % vodorovně a 19 % svisle), a cíle mimo scénu.
import csv, os, itertools
for oid in sorted(os.listdir('data')):
    p = f'data/{oid}/cile.csv'
    if not os.path.exists(p): continue
    rows = [r for r in csv.reader((l for l in open(p) if not l.startswith('#')), delimiter=';')][1:]
    c = [(r[0], float(r[3]), float(r[4]), r[5] if len(r) > 5 else '') for r in rows if len(r) >= 5]
    for a, b in itertools.combinations(c, 2):
        if (a[1], a[2]) == (b[1], b[2]): continue
        if abs(a[1] - b[1]) < 20 and abs(a[2] - b[2]) < 19:
            print(f'{oid}: {a[0]}({a[1]:.0f},{a[2]:.0f}) skryt[{a[3]}]  ~  {b[0]}({b[1]:.0f},{b[2]:.0f}) skryt[{b[3]}]')
    for x in c:
        if not (8 <= x[1] <= 92 and 8 <= x[2] <= 92): print(f'{oid}: {x[0]} u okraje ({x[1]:.0f},{x[2]:.0f})')

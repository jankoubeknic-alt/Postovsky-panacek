# Smaže z kombinace.csv řádky, které validátor označil jako nedosažitelné (shoda karta;cil;podminka).
import sys, subprocess, re, ast
import os; SP = os.path.dirname(os.path.abspath(__file__))
oid = sys.argv[1]
root = os.path.dirname(SP)
out = subprocess.run(['node', f'{SP}/over.mjs', f'data/{oid}/'], cwd=root, capture_output=True, text=True).stdout
m = re.search(r"nedosazitelna_pravidla: \[(.*?)\]", out, re.S)
bad = set(re.findall(r"'([^']*)'", m.group(1))) if m else set()
p = f'{root}/data/{oid}/kombinace.csv'
L = open(p).read().split('\n'); keep = []; n = 0
for l in L:
    parts = l.split(';')
    if len(parts) >= 3 and ';'.join(parts[:3]) in bad: n += 1; continue
    keep.append(l)
open(p, 'w').write('\n'.join(keep)); print('smazano', n, 'z', len(bad))

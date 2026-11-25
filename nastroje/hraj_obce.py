import json, subprocess, os, shutil, time, sys
SP = sys.argv[1]
obce = [x.split('=') for x in sys.argv[2:]]
for oid, jm in obce:
    subprocess.run(['pkill', '-f', '[r]emote-debugging-port=9333']); time.sleep(2)
    cesta = json.loads(subprocess.run(['node', f'{SP}/cesta.mjs', f'data/{oid}/'], capture_output=True, text=True).stdout.strip().split('\n')[-1])
    kroky = [list(k) for k in cesta]
    kroky[len(kroky) // 2].append('pul')
    out = f'{SP}/hra_{oid}'
    shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
    r = subprocess.run(['node', f'{SP}/hraj.mjs', jm, json.dumps(kroky), out], capture_output=True, text=True, timeout=300)
    radky = r.stdout.strip().split('\n')
    neviditelne = [x for x in radky if 'NEVIDITELNÝ' in x or 'JMENOVKA' in x]
    print(oid, len(kroky), 'kroků |', radky[-2][:160], '|', radky[-1], '|', neviditelne[:6], flush=True)
    fotky = sorted([f for f in os.listdir(out) if f.endswith('.png')], key=lambda f: int(f.split('-')[0]))
    vyber = [f for f in fotky if f == '1-start.png' or 'pul' in f or 'konec' in f]
    subprocess.run(['convert'] + [f'{out}/{f}' for f in vyber] + ['+append', '-resize', '50%', f'{SP}/souhrn_{oid}.png'])

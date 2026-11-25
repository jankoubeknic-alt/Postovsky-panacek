# Vypíše místa v textech obcí, která můžou určovat pohlaví hráče (minulý čas ve 2. osobě, oslovení, sám/rád).
# Jde o kandidáty k ruční kontrole, repliky mezi postavami jsou v pořádku. Použití: python3 nastroje/rod.py [kořen projektu]
import glob, os, re, sys
root = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = [
 r'\b\w+l(?:a|o)?\s+(?:jsi|sis|ses|jste)\b',
 r'\b(?:jsi|sis|ses|bys|kdybys|abys|žes|cos|tys|jste|byste|kdybyste)\b(?:\s+[^\s.,!?“„]+){0,4}?\s+\w+l(?:a|i)?\b',
 r'\b(?:chlap[čc]e|hochu|synku|mladíku|kluku|pošťáku|hošku|chlapíku|holka|děvče|panáčku)\b',
 r'\b(?:jsi|jste|budeš|buď|byl jsi)\s+(?:moc\s+|tak\s+|celý\s+|úplně\s+)?\w+(?:ý|á|ný|ná|vý|vá)\b',
 r'\b(?:sám|sama)\b',
 r'\b(?:rád|ráda)\b',
]
for f in sorted(glob.glob(f'{root}/data/*/*.csv') + glob.glob(f'{root}/data/*.csv')):
    for i, l in enumerate(open(f, encoding='utf-8'), 1):
        if l.startswith('#'): continue
        for pat in P:
            for m in re.finditer(pat, l, re.I):
                print(f"{os.path.relpath(f, root + '/data')}:{i} [{m.group(0)}] …{l[max(0, m.start()-70):m.end()+30].strip()}")

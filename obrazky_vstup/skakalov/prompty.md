# Skákalov: obrázky z ChatGPT

Obec je na trase 27. VIII. Postup je stejný jako u Lhotky a podrobně je popsaný v `grafika.md` v kořeni projektu.

1. Založ v ChatGPT nový chat. Do první zprávy nahraj ze Lhotky `obrazky_vstup/lhotka/pozadi.png` a `obrazky_vstup/lhotka/starosta.png` a napiš: `These are style references for all following images. Match their style exactly.`
2. Pak zadávej prompty níže jeden po druhém: napřed scénu, pak postavy, pak věci.
3. Každý obrázek ulož do téhle složky pod jménem z nadpisu.
   Pokud tu soubor s tímhle jménem už leží, nepřepisuj ho. Je to obrázek zkopírovaný z jiné obce.
4. Napiš mi. Převedu je, otestuju a pushnu. Nemusí být všechny najednou, chybějící zůstanou jako emoji.

## Poznámky k obci

- Pes Alík a myslivec běhají po třech řadách (oves, louka, les). Generuješ jen obrázky pro první řadu (`pes1`, `mys1` a jejich změněný stav). Druhá a třetí řada použije stejné obrázky (zapsané v `mapa.csv`).
- Obyčejné dopisy mají obálku z Krakonošova (`dopis_uhlir.png`), už je ve složce.

## Soubory

Vygeneruj (12): `pozadi.png`, `sedlak.png`, `pes1.png`, `pes1_obojek.png`, `mys1.png`, `mys1_pero.png`, `pasacek.png`, `hajny.png`, `dopis_pasacek.png`, `obojek.png`, `burt.png`, `pero.png`

Už jsou ve složce, zkopírované z jiných obcí (2): `dopis_sedlak.png`, `dopis_hajny.png`

Prompty jsou jen pro obrázky ke generování.

## Scéna

### pozadi.png

```
Create an image in portrait orientation, aspect ratio 2:3.
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Scene: Skákalov, the countryside of a Czech folk song about a dog jumping over oats, on a late August afternoon, seen from slightly above. The picture is split into three horizontal bands:
- the top band (from about 12 % to 38 % of the height): a golden field of ripe oats, a farm cart at its left edge;
- the middle band (38 % to 62 %): a bright green meadow with daisies, a small shepherd's hut on the left;
- the bottom band (62 % to 92 %): a cool green spruce forest with ferns, a gamekeeper's log lodge on the left;
- narrow dirt paths separate the bands, and a trail of dog paw prints zigzags from the oat field across the meadow into the forest.
No people and no animals anywhere. Keep the top and bottom edges calm, they will be cropped.
```

## Postavy

### sedlak.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: a farmer standing in his oat field: sunburnt, a straw hat, a scythe over his shoulder, an oat stalk between his teeth.
```

### pes1.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Centred composition, the whole figure inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Alík, a lively shaggy black-and-white hunting dog running happily with a long pheasant feather in his mouth, ears flying, cheeky eyes.
```

### pes1_obojek.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Centred composition, the whole figure inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same dog Alík (shaggy, black and white) sitting calmly and proudly, a new brown leather collar with a round blank tin tag around his neck, no feather.
```

### mys1.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: a hunter in a green hunting coat with a moustache, out of breath and sweaty, pointing crossly at his green hat, which has no feather.
```

### mys1_pero.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same hunter (green hunting coat, moustache), now happy and proud, a long pheasant feather back in his green hat.
```

### pasacek.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: a young shepherd boy on a meadow: straw-blond hair, a shepherd's crook, a cloth bag with a sausage sticking out, cheerful.
```

### hajny.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: an old gamekeeper in the forest: grey beard, a green uniform jacket with brass buttons, a pipe, a stern but kind face.
```

## Zásilky a věci

### dopis_pasacek.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a picture postcard with a white border showing a fluffy white sheep with a red bow on a green hill, one corner slightly bent.
```

### obojek.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a brown leather dog collar with a brass buckle and a round blank tin name tag.
```

### burt.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a fat short Czech sausage (buřt) with scorch marks from a campfire, on a piece of brown paper.
```

### pero.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a long pheasant tail feather, slightly chewed and bent at the tip.
```

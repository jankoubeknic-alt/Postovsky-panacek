# Kamenice: obrázky z ChatGPT

Obec je na trase 24. I. Postup je stejný jako u Lhotky a podrobně je popsaný v `grafika.md` v kořeni projektu.

1. Založ v ChatGPT nový chat. Do první zprávy nahraj ze Lhotky `obrazky_vstup/lhotka/pozadi.png` a `obrazky_vstup/lhotka/starosta.png` a napiš: `These are style references for all following images. Match their style exactly.`
2. Pak zadávej prompty níže jeden po druhém: napřed scénu, pak postavy, pak věci.
3. Každý obrázek ulož do téhle složky pod jménem z nadpisu.
   Pokud tu soubor s tímhle jménem už leží, nepřepisuj ho. Je to obrázek zkopírovaný z jiné obce.
4. Napiš mi. Převedu je, otestuju a pushnu. Nemusí být všechny najednou, chybějící zůstanou jako emoji.

## Poznámky k obci

- Kočka Uhlíčka se zkopíruje i na hrad Strachov jako kocour Šmouha.
- Noc je celá scéna v noci (upravená scéna bez výřezu), přepíná se klepnutím na hodiny. Frantovo okno má přes den zavřené okenice, Franta spí po noční.

## Soubory

Vygeneruj (2): `okno.png`, `noc.png`

Už máš vygenerované (12): `pozadi.png`, `hodiny.png`, `reditel.png`, `hvezdar.png`, `franta.png`, `hostinsky.png`, `marie.png`, `franta_den.png`, `kometa.png`, `harmonika.png`, `balicek.png`, `kocka.png`

Už jsou ve složce, zkopírované z jiných obcí (3): `uredni.png`, `prsten.png`, `zadost.png`

Prompty jsou jen pro obrázky ke generování.

## Scéna

### pozadi.png

```
Create an image in portrait orientation, aspect ratio 2:3.
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Scene: Kamenice, a small mining town in winter daylight, seen from slightly above like a stage set. Layout: at about 19 % in the centre a clock tower; at about 25–40 % on the left the mine director's office with a small observatory dome and telescope on the roof; at about 40 % on the right a tall wooden mine headframe with a wheel; at about 52 % in the centre an inn with a miner's lamp sign; at about 66 % on the left a tobacco kiosk; at about 62 % on the right a little miner's cottage with one window; at the bottom (about 80 %) a cobbled square.
No people and no animals anywhere. Keep the top and bottom edges calm, they will be cropped.
```

## Upravená scéna

Ke každému z těchhle promptů přilož svůj `pozadi.png` z téhle složky. ChatGPT má změnit jen popsané místo. Ze scény se použije jen výřez kolem něj, a ten musí navázat na původní obrázek.

### noc.png

```
Edit the attached picture. Keep everything exactly the same: the composition, the style, the colours, the light and the position and size of every object. Change only this: the whole town at night: a deep blue night sky full of stars with a thin crescent moon and a small bright comet with a long tail above the observatory dome; the director's office is dark, only the observatory dome on its roof glows faintly; warm golden light shines from all the windows of the inn and from its miner's lamp sign; a lamp glows at the top of the mine headframe; the tobacco kiosk is shut and dark; the little miner's cottage on the right is dark. Snow glows softly in the moonlight. Everything else stays as it is.
Keep the same portrait size and aspect ratio. No people and no animals. No text, no letters, no numbers, no signature, no frame.
```

## Postavy a místa

### hodiny.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object or place, centred, the whole object inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: an old town clock tower with a big white clock face.
```

### reditel.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Hronek the mine director in a suit and a bowler hat, yawning at his desk.
```

### hvezdar.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same mine director in a dressing gown and a nightcap, excitedly looking through a brass telescope.
```

### franta.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Franta, a young coal miner with a helmet lamp and a sooty face, tired after the night shift.
```

### hostinsky.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Vávra the innkeeper, a bearded man with an accordion on a shelf behind him, pouring beer.
```

### marie.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Marie, a young woman, a tobacconist with dark curls, smiling from a kiosk window.
```

### okno.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object or place, centred, the whole object inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: a small cottage window with its wooden shutters closed tight, a small blank wooden sign hanging on the shutters and a flower pot on the sill, quiet as if someone is sleeping inside.
```

### franta_den.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same young miner Franta in daylight with a clean face and his Sunday jacket, smiling shyly.
```

### kocka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Uhlíčka, a sleek black cat with yellow eyes and one white whisker.
```

## Zásilky a věci

### kometa.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: an envelope with a little comet with a tail drawn on it.
```

### harmonika.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a large square parcel in brown paper with the bellows of an accordion peeking out.
```

### balicek.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small gift box from a jeweller with a red wax seal and a ribbon.
```

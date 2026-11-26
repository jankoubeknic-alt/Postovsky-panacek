# Hlínov: obrázky z ChatGPT

Obec je na trase 9. II. Postup je stejný jako u Lhotky a podrobně je popsaný v `grafika.md` v kořeni projektu.

1. Založ v ChatGPT nový chat. Do první zprávy nahraj ze Lhotky `obrazky_vstup/lhotka/pozadi.png` a `obrazky_vstup/lhotka/starosta.png` a napiš: `These are style references for all following images. Match their style exactly.`
2. Pak zadávej prompty níže jeden po druhém: napřed scénu, pak postavy, pak věci.
3. Každý obrázek ulož do téhle složky pod jménem z nadpisu.
   Pokud tu soubor s tímhle jménem už leží, nepřepisuj ho. Je to obrázek zkopírovaný z jiné obce.
4. Napiš mi. Převedu je, otestuju a pushnu. Nemusí být všechny najednou, chybějící zůstanou jako emoji.

## Soubory

Vygeneruj (12): `pozadi.png`, `ohen.png`, `rabi.png`, `golem.png`, `lazebnik.png`, `pekar.png`, `studna.png`, `drevnik.png`, `sem.png`, `nos_vodu.png`, `nos_drevo.png`, `dost.png`

Už jsou ve složce, zkopírované z jiných obcí (3): `dopis_rabi.png`, `pohled_lazebnik.png`, `noviny_pekar.png`

Prompty jsou jen pro obrázky ke generování.

## Scéna

### pozadi.png

```
Create an image in portrait orientation, aspect ratio 2:3.
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Scene: Hlínov, narrow lanes of an old town in winter, seen from slightly above like a stage set. Layout: at about 25 % on the left an old house with a round window and a door with a carved frame; at about 28 % on the right a bathhouse with a big wooden tub inside a wide doorway; in the middle (about 40 %) an empty cobbled square; at about 60 % on the left a stone well; at about 60 % on the right a bakery with a big brick oven, the oven is cold and dark inside, no fire and no bread anywhere; at the bottom (about 77 %) a simple lean-to woodshed built against a low stone wall: one sloping plank roof resting on the wall at the back and on two posts in front, firewood stacked neatly from the ground up to the roof along its whole length.
No people and no animals anywhere. Keep the top and bottom edges calm, they will be cropped.
```

## Upravená scéna

Ke každému z těchhle promptů přilož svůj `pozadi.png` z téhle složky. ChatGPT má změnit jen popsané místo. Ze scény se použije jen výřez kolem něj, a ten musí navázat na původní obrázek.

### ohen.png

```
Edit the attached picture. Keep everything exactly the same: the composition, the style, the colours, the light and the position and size of every object. Change only this: the cold bakery oven on the right is lit: a bright fire burns inside the oven mouth and the bricks around it glow warm orange. Everything else stays as it is.
Keep the same portrait size and aspect ratio. No people and no animals. No text, no letters, no numbers, no signature, no frame.
```

## Postavy a místa

### rabi.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Rabbi Löw, the wise rabbi of the Prague Jewish Town around 1600 from the Golem legend: an old man with a long white beard, a black skullcap under a tall dark hat with a fur brim, a long plain dark robe without any gold or embroidery, a white prayer shawl with black stripes over his shoulders, holding a small slip of paper. He must look like a Jewish rabbi, not like a Renaissance nobleman or a scholar in a beret.
```

### golem.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Centred composition, the whole figure or group inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the Golem, a huge gentle giant made of brown clay with rough features and a slot-like mouth, standing still.
```

### lazebnik.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the bath attendant with a towel over his shoulder and rolled sleeves, waiting by an empty tub.
```

### pekar.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the baker with flour on his apron, looking at a cold oven.
```

### studna.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object or place, centred, the whole object inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: an old stone well with a wooden bucket on a rope.
```

### drevnik.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object or place, centred, the whole object inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: a simple lean-to woodshed against a low stone wall: one sloping plank roof on two wooden posts, firewood stacked neatly from the ground up to the roof, a chopping block with an axe in front.
```

## Zásilky a věci

### sem.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small rolled parchment slip tied with a thread, with faint symbols (no readable letters).
```

### nos_vodu.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small slip of old paper with two short lines of black ink handwriting (illegible scribbles, no readable letters) and under them a tiny black ink sketch of a water bucket.
```

### nos_drevo.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small slip of old paper with two short lines of black ink handwriting (illegible scribbles, no readable letters) and under them a tiny black ink sketch of a bundle of firewood.
```

### dost.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small slip of old paper with one short line of black ink handwriting (illegible scribbles, no readable letters) and under it a tiny black ink sketch of a raised open hand meaning stop.
```

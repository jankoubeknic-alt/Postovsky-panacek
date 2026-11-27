# Hodinov: obrázky z ChatGPT

Obec je na trase 15. XI. Postup je stejný jako u Lhotky a podrobně je popsaný v `grafika.md` v kořeni projektu.

1. Založ v ChatGPT nový chat. Do první zprávy nahraj ze Lhotky `obrazky_vstup/lhotka/pozadi.png` a `obrazky_vstup/lhotka/starosta.png` a napiš: `These are style references for all following images. Match their style exactly.`
2. Pak zadávej prompty níže jeden po druhém: napřed scénu, pak postavy, pak věci.
3. Každý obrázek ulož do téhle složky pod jménem z nadpisu.
   Pokud tu soubor s tímhle jménem už leží, nepřepisuj ho. Je to obrázek zkopírovaný z jiné obce.
4. Napiš mi. Převedu je, otestuju a pushnu. Nemusí být všechny najednou, chybějící zůstanou jako emoji.

## Poznámky k obci

- Bílá paní se zkopíruje i na hrad Strachov.
- Hospoda po desáté zhasne a pekárna se rozsvítí až ve dvě, proto dvě upravené scény (hospoda_tma, pekarna_tma).

## Soubory

Vygeneruj (8): `ponocny.png`, `marka.png`, `pekar.png`, `lavicka.png`, `koralka.png`, `pani.png`, `hospoda_tma.png`, `pekarna_tma.png`

Už máš vygenerované (2): `pozadi.png`, `hospodsky.png`

Už jsou ve složce, zkopírované z jiných obcí (6): `prsten.png`, `dopis_hospodsky.png`, `dopis_marka.png`, `dopis_pani.png`, `dopis_pekar.png`, `vrbuv_dopis.png`

Prompty jsou jen pro obrázky ke generování.

## Scéna

### pozadi.png

```
Create an image in portrait orientation, aspect ratio 2:3.
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Scene: Hodinov at night in late autumn, seen from slightly above like a stage set, deep blue night colours with warm lamp light. A round moon above a castle ruin on a hill at the top. Layout: at about 27 % on the left an inn with lit windows; at about 27 % in the centre the village green with a stone column; at about 42 % on the right a big old linden tree with a bench; at about 50 % in the centre an open space by a wall; at about 62 % on the left a bakery; at about 73 % on the right a bench under a lantern.
No people and no animals anywhere. Keep the top and bottom edges calm, they will be cropped.
```

## Upravená scéna

Ke každému z těchhle promptů přilož svůj `pozadi.png` z téhle složky. ChatGPT má změnit jen popsané místo. Ze scény se použije jen výřez kolem něj, a ten musí navázat na původní obrázek.

### hospoda_tma.png

```
Edit the attached picture. Keep everything exactly the same: the composition, the style, the colours, the light and the position and size of every object. Change only this: the inn on the upper left is closed for the night: all its windows are dark, the lamp by its door is out and the door is shut. Only moonlight on its walls. Everything else stays as it is.
Keep the same portrait size and aspect ratio. No people and no animals. No text, no letters, no numbers, no signature, no frame.
```

### pekarna_tma.png

```
Edit the attached picture. Keep everything exactly the same: the composition, the style, the colours, the light and the position and size of every object. Change only this: the bakery at the bottom left is asleep: its shop window is dark, no light inside, the bread in the window only faintly visible in the moonlight. Everything else stays as it is.
Keep the same portrait size and aspect ratio. No people and no animals. No text, no letters, no numbers, no signature, no frame.
```

## Postavy a místa

### hospodsky.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the innkeeper, a man, closing up for the night, a candle in one hand and a big key in the other.
```

### ponocny.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the old village night watchman (ponocný) around 1930, a long grey moustache and kind eyes, a plain wide black felt hat without feathers, a long dark woollen coat. He holds a plain old iron halberd (a simple axe blade with a spike and a small back hook, no ornaments or holes) on a long wooden shaft and a lit lantern. A curved natural cow horn (creamy brown with a darker tip, a small mouthpiece at the narrow end) hangs on a leather strap across his chest.
```

### marka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Mařka, a young woman with a shawl, waiting under a linden tree at night, hopeful.
```

### pekar.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the baker at two in the morning, sleepy, in a white cap, rubbing his eyes.
```

### lavicka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object or place, centred, the whole object inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: a wooden bench under a street lantern at night.
```

### pani.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the White Lady, a shy translucent ghost of a young noblewoman in a flowing white gown and veil, hiding half her face behind her hand.
```

## Zásilky a věci

### koralka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small flat glass flask of plum brandy with a cork.
```

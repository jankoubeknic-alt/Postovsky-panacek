# Kreslená grafika z ChatGPT

Hra umí ke každé obci kreslené obrázky místo emoji: scénu, portréty postav a obrázky zásilek. Kde obrázek chybí, zůstane emoji. Hráč to přepíná tlačítkem s obrázkem v liště (vidí ho jen v obci, která obrázky má). Technický popis je v README v části „Kreslené obrázky“.

První obec s obrázky je Lhotka. Je první na trase a její postavy se vracejí ve finále Lhotka po roce, takže se obrázky použijí dvakrát.

## Postup

1. Otevři v ChatGPT nový chat a zadávej prompty níže jeden po druhém, všechny ve stejném chatu. Styl tak zůstane jednotný.
2. Začni scénou, pak postavy, pak věci. Když se ti první portrét (starosta) líbí, ostatní budou podle něj.
3. Když styl ujede, nahraj do chatu obrázek, který se povedl, a napiš: `Match the style of the attached image exactly.` Pak zopakuj prompt.
4. Obrázek stáhni a ulož pod jménem z nadpisu (`pozadi.png`, `starosta.png` …) do složky `obrazky_vstup/lhotka/` v projektu. Git tu složku ignoruje.
5. Napiš mi. Spustím `python3 nastroje/obrazky.py lhotka obrazky_vstup/lhotka`. Nástroj obrázky ořízne, zmenší na WebP a zapíše `data/lhotka/obrazky.csv`. Pak to otestuju a pushnu.

Jméno souboru musí přesně odpovídat id v datech, i když je pravopisně zvláštní (`brile.png`, ne `bryle.png`). Rozměr ani formát nevadí, nástroj si poradí. Nemusí být hotové všechny obrázky najednou, chybějící zůstanou emoji.

Prompty jsou anglicky, protože ChatGPT podle nich drží styl přesněji. Každý je samostatný, takže funguje i v novém chatu.

## Stav

- Lhotka: hotovo, všech 16 obrázků.
- Lhotka po roce: hotovo. Nové jsou babka s brýlemi, poštmistrová, poutník a páska, zbytek jsou kopie obrázků ze Lhotky.

## Další obce

Prompty pro další obce jsou přímo ve složkách `obrazky_vstup/<obec>/prompty.md`, obrázky se ukládají vedle nich. Git ignoruje jen obrázky, prompty se commitují.

| Obec | Složka | Obrázků | Stav |
| --- | --- | --- | --- |
| Hluchov | `obrazky_vstup/hluchov/` | 15 | hotovo |
| Krakonošov | `obrazky_vstup/krakonosov/` | 15 | prompty připravené |
| Skákalov | `obrazky_vstup/skakalov/` | 12 | prompty připravené |
| Myší Lhota | `obrazky_vstup/mysi/` | 12 | prompty připravené |
| Kramářov | `obrazky_vstup/kramarov/` | 15 | prompty připravené |

Obrázek, který se hodí i jinde, se nekreslí znovu. Zkopíruje se do složky další obce pod jménem podle jejích dat a prompt pro něj tam není. Tak je to s Vrbovým dopisem, poutníkem (Krakonoš z finále Lhotky), obyčejnou obálkou (`dopis_uhlir.png` z Krakonošova) a se psem a myslivcem ve třech řadách Skákalova. Co se zkopírovat dá až po vygenerování předlohy, je v `prompty.md` obce vypsané zvlášť.

## Pravidla pro další obce

- Styl je vždy stejný (blok „Style“ v každém promptu).
- Scéna je na výšku 2:3. Hra ji ořízne na 3:4, takže horních a dolních zhruba 8 % se ztratí. Rozložení budov odpovídá pozicím postav v `cile.csv` (x, y v procentech), postavy stojí v medailonech přes scénu. Ve scéně nejsou lidé ani zvířata.
- Portrét je čtverec, hlava uprostřed, hra ho ořízne do kruhu. Pozadí je hladké, světlé (#F2F3EC, barva papíru ve hře).
- Věc je čtverec s jedním předmětem na stejném světlém pozadí. Převodní nástroj pozadí kolem věci zprůhlední a stín nechá poloprůhledný. Funguje to jen s hladkým jednobarevným pozadím, proto ho prompty chtějí.
- Žádné texty, písmena ani čísla v obrázcích. Žádné postavy, kresby ani styl z cizích her, filmů a seriálů.
- Změněná ikona postavy (třeba spící pes) má vlastní obrázek `<id cíle>_<něco>.png`, například `pes_spi.png`.

## Lhotka: scéna

### pozadi.png

```
Create an image in portrait orientation, aspect ratio 2:3.
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Scene: the village green of Lhotka on a sunny August afternoon, the day before the village fair, seen from slightly above like a stage set. Layout from top to bottom:
- a narrow strip of blue sky with a round sun at the top right;
- at the top centre, a small white town hall with a red roof and a little clock tower;
- a sandy path winds from the town hall down through the middle of the picture;
- strings of colourful triangular pennants hang across the square;
- at mid-height on the left, a bakery with a red tiled roof and a smoking chimney;
- at mid-height on the right, a blacksmith's forge with a dark slate roof and an anvil by the door;
- in the lower left, a small thatched cottage with a herb garden and bunches of herbs drying under the eaves;
- in the lower right, a round stone fountain with red geraniums around it;
- linden trees and grass between the buildings.
No people and no animals anywhere. Keep the top and bottom edges calm, they will be cropped.
```

## Lhotka: postavy

### starosta.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the mayor of a small village, a portly kind man in his fifties with a big curled moustache, rosy cheeks, a black suit and a red-white-blue mayor's sash, a proud but slightly nervous smile.
```

### pes.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Portrait of an animal facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Punťa, a scruffy medium-sized village mutt, white with brown spots, one floppy ear, head and front paws visible, an alert and suspicious watchdog expression.
```

### pes_spi.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Centred composition, the whole animal inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same dog Punťa (scruffy, white with brown spots, one floppy ear) curled up fast asleep, eyes closed, a blissful smile, a sprig of chamomile by its nose. Do not draw any "Z" letters.
```

### pekarka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the village baker, a cheerful young woman with rosy cheeks and a little flour on her nose, a white headscarf and apron, holding up a round fruit pastry.
```

### kovar.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: Vojta, the young village blacksmith, broad shoulders, sooty cheeks, a leather apron, rolled-up sleeves, a hammer on his shoulder and a shy, lovestruck smile.
```

### babka.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the old village herbalist, a tiny wrinkled grandmother in a flowered headscarf holding a bunch of chamomile, squinting hard because her glasses are broken, kind and a little mischievous. She is not wearing glasses.
```

### kasna.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
One object, centred, inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Object: a round stone village fountain with a cast-iron spout, water splashing into the basin, red geraniums on its rim.
```

## Lhotka: zásilky a věci

### dopis.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a pink envelope sealed with a little red heart, a smudge of soot on one corner, no writing on it.
```

### balik.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a small heavy parcel wrapped in brown paper, tied crosswise with string, a red wax blob on the knot, no writing on it.
```

### pohled.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a picture postcard with a white border showing a blue sea, a sandy beach and one palm tree, one corner slightly bent.
```

### brile.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: old round wire-rimmed spectacles, one temple broken off and lying next to them.
```

### spravene_brile.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: the same old round wire-rimmed spectacles, now repaired with a tiny rivet on the temple, polished, with little sparkles on the lenses.
```

### kolac.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: one round Czech koláč pastry with a sweet white cheese filling in the middle and crumble on the edge, still warm with a little steam.
```

### bylinky.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a bunch of fresh chamomile flowers and lemon balm leaves tied together with twine.
```

### vrbuv_dopis.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a very old yellowed envelope with worn, softened edges, sealed with a dark red wax seal, no address and no writing at all.
```

## Navíc pro finále Lhotka po roce (nepovinné)

Scénu, starostu, psa, pekařku, kováře, kašnu a obálky převezme finále ze Lhotky. Tyhle čtyři obrázky ulož do `obrazky_vstup/lhotka2/`.

### babka.png (do lhotka2, babka už má brýle)

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the same old village herbalist grandmother in a flowered headscarf, now wearing her repaired round wire-rimmed glasses, eyes shining, holding an old yellowed envelope to her heart, a soft happy smile.
```

### kosova.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: the district postmistress, a sturdy woman in her sixties with a grey bun and round cheeks, an old-fashioned dark blue postal uniform jacket and cap, holding a steaming cup of coffee, a wise and teasing look.
```

### krakonos.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour, a small Czech village around 1930. Not photorealistic, not 3D, not anime. No text, no letters, no numbers, no signature, no frame.
Head-and-shoulders portrait facing the viewer, centred, the whole head inside the central circle of the picture (it will be cut into a circle). Plain flat off-white background (#F2F3EC), no scenery.
Character: a mysterious very old wanderer, tall, a long grey-green beard, a wide-brimmed hat with a sprig of mountain pine, a weathered cloak and a walking staff, kind but stern eyes. A quiet hint that he is a mountain spirit in disguise.
```

### paska.png

```
Create a square image (1:1).
Style: hand-painted picture-book illustration for a cozy mobile card game, gouache and watercolour on textured paper, soft dark-brown ink outlines, warm summer palette (ochre, brick red, sage green, cream, sky blue), rounded friendly shapes, gentle humour. Not photorealistic, not 3D. No text, no letters, no numbers, no signature, no frame.
One single object, centred, seen slightly from above, filling about 70 % of the picture, plain flat off-white background (#F2F3EC), a small soft shadow under it, nothing else.
Object: a new ceremonial ribbon in red, white and blue rolled on a wooden spool, with a neat bow.
```

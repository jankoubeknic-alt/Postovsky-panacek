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

Každá obec má složku `obrazky_vstup/<obec>/` (id obce je v `data/etapy.csv`). Ve složce je `prompty.md` s postupem, poznámkami a prompty, obrázky se ukládají vedle. Git ignoruje jen obrázky, prompty se commitují.

Obrázek, který se hodí i jinde, se nekreslí znovu. Obyčejná obálka, Vrbův dopis, úřední listina, noviny, telegram, pohlednice, balík, prsten nebo klíč se generují jednou a ostatní obce je dostanou kopií. Seznam kopií je v `kopie.csv` ve složce obce a převodní nástroj chybějící kopie doplní sám, jakmile předloha existuje. Sdílený obrázek generuje ta obec, jejíž složka je v abecedě první, protože obce se kreslí v pořadí složek. Kopie tak čeká na předlohu jen výjimečně. Jeden obrázek pro víc postav nebo stavů ve stejné obci (čtyři židle, políčka, světýlka) zapisuje `mapa.csv`.

Čistá změna výrazu (😊, 🥰) se negeneruje. Hra nechá portrét a výraz ukáže jako odznak. Vlastní portrét dostane změna jen tehdy, když by starý portrét stavu odporoval (spící student, který se probudil, hořící kovárna po uhašení, ležící máj po postavení).

Vrstva, která ve hře zakryje celou scénu (světnice v Bludičkově, nádvoří v Neumětelích, hřeben ve Sněžné, důl ve Štolově), má vlastní obrázek ve formátu scény, pojmenovaný jako soubor vrstvy (`samota.png`). Vrstvy, které jen něco přikreslí nebo scénu ztmaví (bouřka, mlha, noc), zůstávají jako SVG. Když se má změnit něco, co je v kresbě namalované (vypitý rybník, rozbitý balvan v Dlouhé Široké), nahraješ do ChatGPT svůj `pozadi.png` a necháš ho upravit jen na tom místě. Z upraveného obrázku se použije jen výřez kolem změny. Prompty pro to jsou v `prompty.md` pod nadpisem „Upravená scéna“. Upravená scéna může vycházet i z jiné upravené scény (hořící hranice z obrázku s postaveným májem), pak to u promptu stojí. Když je chyba přímo ve scéně (déšť namalovaný napevno), opraví se úpravou `pozadi.png` podle sekce „Oprava scény“ a upravené scény se dělají až z opravené scény.

Galerii všech vzhledů kreslených obcí vyrobí `node nastroje/stavy.mjs <obec> ...` do `nahledy_stavu/index.html`: každý stav, ve kterém scéna vypadá jinak, je tam jako snímek ze hry s popisem změny a tahu, který k ní vedl.

### Doplnit do hotových obcí

Kontrola všech vzhledů (listopad 2026) ukázala místa, kde scéna neodpovídá příběhu. Prompty jsou v `prompty.md` jednotlivých obcí, do té doby hra ukazuje náhradní kresbu nebo odznak. Bezvětří, Brodek, Čertovina, Cylindrov, Faustův dům a Floriánov už jsou doplněné. Zbývá:

- Floriánov: `kovarna_ohorela.png` (ohořelá střecha kovárny po uhašení, aby scéna seděla na portrét `kovarna_uhasena.png`).
- Hejrupov: `maj_stoji.png`, pak z něj `hori.png` (hořící hranice), portréty `maj_vztycen.png` a `hranice_hori.png`.
- Krakonošov: `bourka.png` (celá scéna v bouřce).
- Myší Lhota: `slapoty.png` (obří šlápota a rozšlápnutý plot).
- Spáčov pod Blaníkem: `otevreno.png` (otevřená skála).

| Obec | Kapitola | Ke generování | Stav |
| --- | --- | --- | --- |
| Lhotka | Léto | 16 | hotovo (prompty v této stránce) |
| Hluchov | Léto | 15 | hotovo |
| Krakonošov | Léto | 15 | hotovo |
| Skákalov | Léto | 12 | hotovo |
| Myší Lhota | Podzim | 12 | hotovo |
| Kramářov | Podzim | 15 | hotovo |
| Třířečí | Podzim | 11 | prompty připravené |
| Cylindrov | Podzim | 20 | hotovo |
| Spáčov pod Blaníkem | Podzim | 10 | hotovo |
| Bezvětří | Podzim | 9 | hotovo |
| Koláčov | Podzim | 8 | prompty připravené |
| Mlhov | Podzim | 9 | prompty připravené |
| Výlovice | Podzim | 13 | prompty připravené |
| Hrad Strachov | Podzim | 10 | prompty připravené |
| Bludičkov | Podzim | 10 | hotovo |
| Martinov | Podzim | 13 | prompty připravené |
| Faustův dům | Podzim | 10 | hotovo |
| Hodinov | Podzim | 10 | rozpracováno, hotová scéna a hospodský, chybí ponocny.png (přegenerovat s kravským rohem), marka, pekar, lavicka, koralka, pani, hospoda_tma, pekarna_tma |
| Sněžná | Podzim | 14 | prompty připravené |
| Barborov | Zima | 11 | hotovo |
| Mikulášov | Zima | 12 | prompty připravené |
| Lucín | Zima | 10 | prompty připravené |
| Ježíškova Lhota | Zima | 15 | prompty připravené |
| Václavice | Zima | 9 | prompty připravené |
| Pozpátkov | Zima | 11 | prompty připravené |
| Měsíčkov | Zima | 19 | prompty připravené |
| Kozí Hřbítek | Zima | 11 | prompty připravené |
| Trubkovice | Zima | 10 | prompty připravené |
| Kamenice | Zima | 13 | prompty připravené |
| Čertovina pod Kotlem | Zima | 11 | hotovo |
| Kašovice | Zima | 9 | prompty připravené |
| Hlínov | Zima | 12 | hotovo |
| Maškarovice | Zima | 8 | prompty připravené |
| Pecnov | Zima | 12 | prompty připravené |
| Pošta o půlnoci | Zima | 12 | prompty připravené |
| Razítkov | Jaro | 11 | prompty připravené |
| Holubník | Jaro | 15 | prompty připravené |
| Štolov | Jaro | 13 | prompty připravené |
| Loutkov nad Nití | Jaro | 11 | prompty připravené |
| Straky nad Blýskavou | Jaro | 8 | prompty připravené |
| Lhářov | Jaro | 11 | prompty připravené |
| Pomlázkov | Jaro | 16 | prompty připravené |
| Brodek | Jaro | 10 | hotovo |
| Štírovice | Jaro | 12 | prompty připravené |
| Hejrupov | Jaro | 11 | hotovo |
| Šnekov | Jaro | 12 | prompty připravené |
| Floriánov | Jaro | 11 | hotovo |
| Dolní Zapomněnice | Jaro | 11 | prompty připravené |
| Jelení Hráz | Jaro | 10 | prompty připravené |
| Jánský Brod | Jaro | 10 | prompty připravené |
| Ťukov | Zase léto | 7 | prompty připravené |
| Kočičí Lhota | Zase léto | 14 | prompty připravené |
| Lázně Bílá | Zase léto | 10 | prompty připravené |
| Nová Ves u Staré Vsi | Zase léto | 9 | prompty připravené |
| Koníkov | Zase léto | 9 | prompty připravené |
| Ozvěnov | Zase léto | 7 | prompty připravené |
| Prokopov | Zase léto | 8 | prompty připravené |
| Neumětely | Zase léto | 15 | prompty připravené |
| Dlouhá Široká | Zase léto | 16 | hotovo |
| Mňoukov | Zase léto | 10 | prompty připravené |
| Kocourkov | Zase léto | 14 | prompty připravené |
| Lhotka po roce | Zase léto | 4 | hotovo (prompty v této stránce) |

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

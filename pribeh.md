# Příběh: Rok na poště

Pracovní podklad pro příběhovou linku přes všechny obce. Obce samotné zůstávají samostatné hádanky, příběh je tenká nit nad nimi.

## Rámec

Nový pošťák nastoupí 14. srpna v Lhotce, den před poutí, a celý rok chodí po okrese. Trasa jde podle kalendáře, takže zvyky a svátky přicházejí ve svůj čas. Rok končí zase v Lhotce, zase den před poutí.

Hra má pět kapitol. Mezi nimi jsou krátké mezihry na okresní poště, kde poštmistrová Kosová vaří kávu, komentuje, co pošťák zažil, a posílá ho dál.

| Kapitola | Období | Obce |
| --- | --- | --- |
| Léto | 14.–31. VIII. | Lhotka, Hluchov, Krakonošov, Skákalov |
| Podzim | IX.–XI. | Myší Lhota až Sněžná (15 obcí) |
| Zima | XII.–II. | Barborov až Pošta o půlnoci (16 obcí) |
| Jaro | III.–V. | Razítkov až Jánský Brod (15 obcí) |
| Zase léto | VI.–VIII. | Ťukov až Kocourkov (11 obcí) a finále Lhotka po roce |

Mezihry jsou čtyři mezi kapitolami, dále prolog před Lhotkou a epilog po finále.

## Hlavní linka: Vrbův dopis

Pošťák dostane brašnu po Josefu Vrbovi, pošťákovi, který před třiceti lety zmizel na pochůzce. V podšívce je zapečetěný dopis bez adresy a lístek „Doručit, až budeš vědět komu. J. V.“

Celý rok pošťák skládá, kdo byl Vrba, kam zmizel a komu dopis patří. Rozuzlení: dopis je milostný a patří babce Kořenářce z Lhotky. Vrba se ji nikdy neodvážil oslovit. V Lhotce jí pošťák na začátku hry nosí spravené brýle, takže po roce dopis konečně přečte.

## Pravidla dopisu

Dopis se nesmí muset ukazovat plošně všem. Proto:

- Karta Vrbova dopisu je v brašně jen v obcích, kde Vrbu někdo zná. V ostatních obcích v brašně není.
- Kdo Vrbu zná, je poznat. Když se na něj hráč podívá a dopis má v brašně, postava sama zmíní brašnu nebo Vrbu.
- Ukázat dopis je zadarmo. Neuplyne tah, voda nestoupá a ponocný netroubí.
- Kdo Vrbu nezná, odpoví jednou obecnou větou ze společných pravidel.
- Reakce na dopis se nepočítají do alba. Sběratele alba tak nic nenutí zkoušet dopis na každého.
- Střípek příběhu se uloží do deníku. Deník je mezi obcemi společný a přenáší se s postupem.
- Většina střípků je nepovinná. Finále jde dohrát i bez nich, jen se v něm méně dozvíš.

## Střípky

Tři dějství: kdo byl Vrba a kam zmizel (do Dušiček), komu dopis psal (zima) a kde ta osoba je (jaro a léto).

| Obec | Kdo Vrbu zná | Co prozradí |
| --- | --- | --- |
| Lhotka | babka Kořenářka (až má brýle) | Prohlédne obálku, zbledne a řekne, že adresa tu není. Nic víc. |
| Hluchov | telegrafistka Ťuková | Vrba jí kdysi nadiktoval telegram a pak ho nechtěl odeslat. |
| Krakonošov | Krakonoš | Vrba mu kdysi v bouřce donesl psaní. Pán hor mu dluží službu. |
| Kramářov | kramářka | Vrba si tu každý rok kupoval perníkové srdce a nikdy ho nikomu nedal. |
| Mlhov | pastýř Matěj | Vrba chodil přes slatě zkratkou a Matěj ho varoval. Za slatěmi prý svítí okno, ke kterému stojí za to dojít. |
| Hrad Strachov | Bílá paní | Vrba s ní hrával karty. Říkala mu, že kdo nese dopis třicet let, je taky trochu strašidlo. |
| Bludičkov | dušička starého pošťáka | Je to Vrba. Šel za světýlkem, protože myslel, že svítí její okno. Nad brašnou zašeptá: Doruč to. Já nedošel. Střípek přijde sám, protože dušička je součást výhry. |
| Hodinov | ponocný | Vrba chodil v jedenáct pod lípu a četl pořád jeden a ten samý dopis. Do schránky ho nikdy nehodil. |
| Barborov | hajný | Vrba si každý rok uřízl barborku, nechal ji rozkvést a o Štědrém dni ji nesl k vrátkům jedné chalupy. Dál nedošel. |
| Pošta o půlnoci | skřítek Pečetítko | Pozná dopis po hmatu. Tenhle hřeje, je zamilovaný a voní heřmánkem a meduňkou. |
| Štolov | permoník | Vrba mu nosil tabák a dostával valouny. Z jednoho chtěl nechat udělat prstýnek pro jednu, co zná každou bylinku. |
| Holubník | pan Hrdlička | Nejstaršího holuba si Vrba vycvičil, aby létal k jedné chalupě v Lhotce. S psaním ho tam nikdy neposlal. |
| Ozvěnov | ozvěna | Po třiceti letech se z údolí vrátí věta, kterou tu Vrba kdysi zakřičel. Je v ní jméno Kořenářka. |

## Finále: Lhotka po roce

Je zase 14. srpna a zítra je pouť. Babka Kořenářka má brýle, které jí pošťák před rokem přinesl spravené. Finále je klidná obec: doručit poslední poštu před poutí a nakonec Vrbův dopis. Podle toho, kolik střípků hráč má, babka ví víc. Konec je u kašny, kde si babka dopis přečte.

## Co umí engine

Hotovo od 2026-11-25, popis je i v README.


- Vlajky světa s předponou `svet:` platí ve všech obcích. Fungují v podmínkách i efektech (`svet:vrba_krakonos`, `!svet:vrba_krakonos`).
- `karty.csv` sloupec `druh=pribeh`: příběhová karta. Neodečítá tah, nechytá se na zástupné `*`, nepočítá se do `karet` a reakce s ní nejsou v albu.
- `data/spolecne.csv`: společná pravidla ve stejném formátu jako `kombinace.csv`. Platí ve všech obcích až po pravidlech obce.
- `data/pribeh.csv`: texty deníku. Řádek se ukáže, když je nastavená stejnojmenná vlajka světa.
- `data/kapitoly.csv` a sloupec `kapitola` v `etapy.csv`: kapitoly na trase a mezihry, které se ukážou před první obcí kapitoly.

## Stav

- Hotovo: engine, kapitoly, mezihry všech pěti kapitol, všech třináct střípků z tabulky výše a finále Lhotka po roce (`data/lhotka2`).
- Ve finále jsou ještě dva zápisy: Krakonoš splatí dluh (když hráč má jeho střípek) a doručení dopisu.
- Finále jde dohrát i bez střípků. Adresu pak prozradí pekařka nebo poštmistrová, když přičichnou k obálce.
- Úředník Pospíšil (vedlejší komická linka) zatím ve hře není.

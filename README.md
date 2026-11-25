# Pošťák

Prototyp karetní adventury pro mobil. Pošťák projíždí obce a v každé řeší zápletku tím, že přetahuje zásilky a věci na postavy.

## Spuštění

Hra je statický web (HTML, CSS, JS a tabulky CSV), žádný server s logikou nepotřebuje.

```sh
python3 -m http.server 8000
```

Pak otevři `http://localhost:8000`. Na telefonu ve stejné Wi-Fi otevři `http://<IP počítače>:8000`.
Přímé otevření `index.html` ze souboru nefunguje, protože prohlížeč pak nedovolí načíst tabulky.

Když na konec adresy přidáš `#debug`, ukážou se vlajky, počítadla a obsah brašny a odemknou se všechny hratelné obce.

## Uložený postup

Postup se ukládá v prohlížeči (`localStorage`, klíče `postak:v1:*`) a mezi zařízeními se sám nepřenáší. Na trase je tlačítko **Přenést postup**: ukáže kód, který si hráč zkopíruje, a na druhém zařízení ho vloží. Kód začíná `POSTAK1.` (zkomprimovaný JSON se všemi klíči `postak:*`, base64url) nebo `POSTAK0.` (bez komprese, pro prohlížeče bez `CompressionStream`). Nahrání kódu přepíše celý postup v daném prohlížeči a před tím se hra zeptá.

## Nasazení na VPS

Celou složku nahraj na server, například `rsync -av --delete ./ uzivatel@server:/var/www/postak/`, a nech ji obsluhovat libovolný webový server jako statické soubory. Pro Caddy stačí:

```
postak.example.cz {
    root * /var/www/postak
    file_server
}
```

## Nasazení na GitHub Pages

Hra funguje na GitHub Pages tak, jak je: cesty jsou relativní a stačí statické soubory. Prázdný soubor `.nojekyll` vypíná zpracování přes Jekyll a `.gitignore` drží výstupy testů mimo repozitář. V nastavení repozitáře zapni Pages z větve `main` a kořenové složky. Pages zdarma vyžaduje veřejný repozitář.

## Sbalená verze

Hostingy s limitem počtu souborů (například artefakt na claude.ai) dostanou sbalenou verzi: `python3 nastroje/sbal.py <složka>` vytvoří celý web, kde je každá obec jeden soubor `data/<obec>.json` místo složky s tabulkami a obrázky. Místo zhruba 500 souborů je jich kolem 70.

## Obsah hry

Všechno, co hráč vidí, je v tabulkách ve složce `data/`. Dají se upravovat v LibreOffice nebo Google Sheets. Ukládej je jako CSV v kódování UTF-8. Oddělovač může být středník i čárka.

| Soubor | Co obsahuje |
| --- | --- |
| `data/hra.csv` | název a úvodní text celé hry |
| `data/etapy.csv` | obce na trase v pořadí odemykání, `pripraveno=ano` je hratelná. Trasa jde podle kalendáře: Lhotka 14. srpna a pak rok dokola, zhruba pět obcí na měsíc. Datum obce je klíč `datum` v jejím `etapa.csv`. |
| `data/<obec>/etapa.csv` | nastavení obce: startovní karty, cíl, texty úvodu a konce, pozadí, barvy, počítadla, prohra |
| `data/<obec>/cile.csv` | postavy a předměty ve scéně a jejich pozice v procentech (`x`, `y`) |
| `data/<obec>/karty.csv` | zásilky a věci v brašně |
| `data/<obec>/kombinace.csv` | co se stane, když hráč použije kartu na cíl |
| `data/<obec>/vrstvy.csv` | nepovinné: obrázky přes scénu, které se ukážou podle stavu hry (voda, déšť, noc) |
| `data/<obec>/kazdy_tah.csv` | nepovinné: co se stane „mezitím“ po každém podání zásilky (podmínka, efekt, text do okénka) |
| `data/<obec>/obrazky.csv` | nepovinné: kreslené obrázky obce (scéna, portréty, zásilky), viz „Kreslené obrázky“ |
| `data/<obec>.json` | jen ve sbalené verzi: všechny tabulky a obrázky obce v jednom souboru. Vyrobí ho `nastroje/sbal.py` a hra ho použije, jen když složka obce chybí. Upravuj vždy tabulky, ne balík. |

Popis sloupců a zápisu podmínek a efektů je přímo v hlavičce `kombinace.csv` a `etapa.csv`.

### Příběh přes celou hru

Nad obcemi běží příběh „Rok na poště“ (podklad je v `pribeh.md`). Engine na něj má obecné prvky:

| Soubor nebo prvek | Co dělá |
| --- | --- |
| `data/kapitoly.csv` | kapitoly trasy (`id`, `nazev`, `obdobi`) a mezihra z okresní pošty, která se ukáže před první obcí kapitoly |
| sloupec `kapitola` v `data/etapy.csv` | do které kapitoly obec patří. Na trase se nad první obcí kapitoly ukáže její název. |
| `data/pribeh.csv` | zápisy do deníku. Zápis `id` se ukáže, když platí vlajka světa `svet:<id>`. |
| `data/spolecne.csv` | pravidla platná ve všech obcích (stejné sloupce jako `kombinace.csv`). Použijí se až po pravidlech obce. |
| vlajky světa `svet:x` | platí napříč obcemi. Fungují v podmínkách (`svet:x`, `!svet:x`) i v efektech (`svet:x` nastaví, `!svet:x` zruší). Nezruší je ani „Začít znovu“. |
| `druh=pribeh` v `karty.csv` | příběhová karta, třeba Vrbův dopis. Neuplyne po ní tah, nechytá se na zástupnou `*`, nepočítá se do `karet` ani do míst v brašně a reakce s ní nejsou v albu. |
| `{jmeno}`, `{osloveni}` v textech | jméno hráče a jeho 5. pád (Pospíšil, Pospíšile). Hráč je zadá v prologu nebo tlačítkem Jméno na trase. Hra pátý pád odhadne a hráč ho může opravit. |

Texty se píšou tak, aby neurčovaly pohlaví hráče. Vyprávění je ve 2. osobě přítomného nebo budoucího času („Neseš starostovi dopis“), bez minulého času („přišel jsi“), bez oslovení „chlapče“ nebo „pošťáku“ a bez slov jako „sám“ nebo „rád“ o hráči. Kdo má hráče oslovit, použije `{osloveni}`. Podezřelá místa vypíše `python3 nastroje/rod.py`.

Vrbův dopis je v brašně jen v obcích, kde Vrbu někdo zná. Obec ho přidá do `start`, nadefinuje kartu `vrbuv_dopis` v `karty.csv` a přidá své řádky do `kombinace.csv`. Na ostatní postavy odpoví řádek ze `spolecne.csv`. Úvod obce nebo rozhlédnutí prozradí, kdo Vrbu znal, aby hráč nemusel dopis ukazovat všem.

Deník (tlačítko na trase) ukazuje mezihry a získané zápisy po kapitolách. Vlajky světa a viděné mezihry jsou v `localStorage` pod klíčem `postak:v1:svet` a přenášejí se s kódem postupu.

Obce se můžou lišit i pravidly. Brodek používá počítadlo `voda`: každé podání zásilky zvedne hladinu (`kazdy_tah`), hladina se ukazuje v liště (`ukazatele`), při 12 hráč prohraje (`prohra`) a podle hladiny se mění scéna (`vrstvy.csv`) i to, kdo je dosažitelný (`skryt_kdyz` v `cile.csv`).

Kamenice střídá den a noc. Klepnutí na věžní hodiny je rozhlédnutí (`?`) s efektem, který přepne vlajku `noc` a změní ikony hodin a kočky. Noční vrstva ztmaví scénu a postavy se ukazují podle `skryt_kdyz`. Na jednom místě se tak střídá třeba spící Franta ve dne a ředitel, který se v noci promění v hvězdáře. Podmínky můžou obsahovat slovo `nebo`, například `noc nebo denni_smena`.

Lázně Bílá jsou detektivka. Počítadlo `drby` přibývá jen za chyby: když zásilku uvidí někdo, kdo neumí mlčet. Stopy jsou vlajky a při rozhlédnutí se podle nich ukáže víc (řádky `?` s podmínkou `stopa_inkoust stopa_fialka`). Podle drbů přibývají ve scéně bubliny se šuškáním (`vrstvy.csv`).

Sněžná má malou brašnu (`brasna;3` v `etapa.csv`), volná místa jsou v brašně vidět jako čárkované rámečky. V podmínkách funguje `karet`, počet věcí v brašně, například `karet<3` nebo `karet=0`. Zásilky leží na pultu jako cíle a klepnutím se berou do brašny. Hřeben je druhá scéna: vrstva `hreben.svg` přes celé údolí, zapnutá vlajkou `nahore`.

Po každém podání zásilky se provedou všechny řádky `kazdy_tah.csv`, jejichž podmínka platí, popořadě. Jejich `text` se ukáže v okénku reakce jako „mezitím“. Tak fungují odpočty, zapomínání nebo krádeže. Efekt `cekej` nechá jeden tah uběhnout i při rozhlédnutí, třeba na lavičce. Název ukazatele v `etapa.csv` nesmí obsahovat mezeru (`cas:Čas:14`, ne `cas:Do poledne:14`).

| Obec | Mechanika |
| --- | --- |
| Dolní Zapomněnice | Po každém třetím podání odbije zvon a vymaže vlajky `*_vi`. Kapesník s uzlíkem jednu chrání natrvalo. |
| Kozí Hřbítek | Řetězec bez počítadla. Kozel Bořek hlídá urnu, dokud nedostane zelí. |
| Ozvěnov | Co kdo řekne nahlas, nastaví `ozvena_nova_*` a ozvěna vydrží do dalšího podání. Záleží na pořadí návštěv. |
| Čertovina pod Kotlem | Kotel stydne o 1 po každém podání. Uhlí za doručené důchody ho ohřeje. |
| Bezvětří | Vítr otevřený na špatném místě rozfouká papíry z brašny po vsi (`vichr` v `kazdy_tah.csv`). |
| Mlhov | Lucerna přepíná mlhu 0, 1 a 2 a v každé hustotě jsou vidět jiní lidé. |
| Nová Ves u Staré Vsi | Dvě strany čáry (vlajka `vpravo`). Přechod u celníka zvýší napětí. |
| Šnekov | Odpočty v `kazdy_tah.csv` (podpis, probouzení, pistole) a čas do poledne. Na lavičce se čeká. |
| Myší Lhota | Dokud pošťák nemá návleky, každé podání přidá škodu. Velké věci se musí zmenšit. |
| Straky nad Blýskavou | Straka každé druhé podání ukradne lesklou věc. Žebřík na věž vrátí ukradené. |
| Hluchov | Přepis telegramu drží tři počítadla (`kdo`, `kdy`, `s`). Každá postava přepíše svá slova, poslední vyhrává. Text na tabuli kreslí vrstvy podle hodnot. |
| Pozpátkov | Odpověď bez adresáta dostane ten, kdo se teprve zeptá. Ten pak napíše otázku. Odpověď zároveň způsobí, co se v ní píše (koza přeskočí plot, žebřík praskne). |
| Lhářov | Všechny adresy a řeči jsou naopak, pravdu mluví jen činy a paní učitelka. Hostinská je schovaná (`skryt_kdyz`), dokud na hospodu nepověsíš ZAVŘENO. |
| Razítkov | Dvě okénka chtějí papír jedno od druhého. Řízky pošlou úřednici na oběd (`obed=4` a odpočet v `kazdy_tah.csv`) a zástupce sedí na obou. |
| Ježíškova Lhota | Dítě a jeho stromeček stojí na stejném místě a střídají se přes `skryt_kdyz`. Dárek jde pod stromek, jen když dítě nekouká. |
| Kočičí Lhota | Dort se staví po patrech (počítadla `p1`, `p2`, `p3`) a každé patro jí někdo jiný. Nepozvaný zlý pes hotový dort ukradne (`kazdy_tah.csv`). |
| Kašovice | Slova jsou karty. Hrnec se zastaví jen oslovením „Hrnečku!“ a pak „Dost!“. Kaše stoupá s každým podáním a schovává hospodu a školu (`skryt_kdyz`). |
| Mňoukov | S kocourem v brašně (`@kocour`) rozumíš zvířatům. Kocour se bojí psa a uteče na hrušku, dokud pes nehryže kost. |
| Kocourkov | Adresy jsou rčení a každý je dělá doslova. Hospodský nalije čistého vína, jen když drbna zametá před vlastním prahem. |
| Cylindrov | Co spadne do cylindru, vyleze jako rým (lžíce–svíce, klíč–míč). Kost, host a most jdou dokola, takže na most je třeba dvakrát. |
| Loutkov nad Nití | Zamotané nitě: pekařova ruka zvoní zvonem, babčina noha zvedá žebřík, Špalíčkova ruka kývá Hoblíkovou hlavou. Kývnutí trvá jen chvíli (`kyva` v `kazdy_tah.csv`). |
| Dlouhá Široká | Pomocníci jsou karty, které se nespotřebují. Některé úkoly potřebují dva (Bystrozraký najde prsten, Dlouhý ho vytáhne). |
| Měsíčkov | Komu z bratrů dáš hůl, ten vládne (počítadlo `obdobi`). Co nepatří do období, se po podání zkazí. Led na léto se ukládá v zimě do ledárny. |
| Hrad Strachov | Prohlídka obchází hrad (počítadlo `pokoj`) a strašidlo v její místnosti je schované. Strašení začne, když prohlídka vejde do sálu. |
| Krakonošov | Krakonoš se po každém podání převleče za někoho jiného (počítadlo `k`). Poznáš ho po mokrém šosu. Stížnost přijme jen od toho, kdo mu dal chleba. |
| Pošta o půlnoci | Klepnutí na poštu přepíná den a noc. Skřítkové hmatem poznají, co je v dopise bez adresy, a podle tří stop se najde ta pravá z pěti Marušek. |
| Koníkov | Hráč řídí dostavník, který jede dokola (počítadlo `stanice`). Každé podání ho posune o zastávku, doručit jde jen tam, kde stojí. Ve voze jsou dvě místa. |
| Holubník | Holub letí jen domů. Dopis odejde, když holubáři dáš holuba z místa adresáta. Holubi se získávají krátkými řetězy. |
| Ťukov | Telegraf neumí háčky a čárky. Šest balíků s nápisy ROZE, KURE, KOS a ke každému slovu dva adresáti. Rozhoduje popis balíku. |
| Trubkovice | Potrubní pošta s výhybkami, které se po každé patroně přehodí (vlajky `a_r`, `b_r`, `c_r`). Šipky ve scéně ukazují, kam poletí příští. |
| Spáčov pod Blaníkem | Skála s rytíři se otevře jen v nejhorší chvíli (počítadlo `bida=3`). Hráč musí nejdřív doručit všechny špatné zprávy. Rytíři pak dají listiny, které je napraví. |
| Hlínov | Golem se šémem plní lísteček NOS VODU nebo NOS DŘÍVÍ a po každém podání přinese jedno (`kazdy_tah.csv`). Lísteček DOST musí přijít přesně při plné kádi nebo peci. |
| Neumětely | Venku a uvnitř hradu jsou vidět jiní lidé (vlajka `uvnitr`). Šemík přeskočí hradbu, když zná heslo a je nakrmený. Horymírovo poslední přání je skok do řeky. |
| Faustův dům | Schody jsou zazděné, zásilky jezdí košem dírou ve stropě. Spící student nic nechytí, zvědavá vdova vytáhne všechno, pokud zrovna nečte (počítadlo `cte`). |
| Pecnov | Pec se staví po vrstvách (počítadlo `faze`) a každou vrstvu pecař umí až po dopisu s radou. Materiál na vyšší vrstvu pec shodí na nulu. |
| Skákalov | Pes běží po každém podání oves, louka, les (počítadlo `pes`) a myslivec je o krok za ním (`m`). Buřt nastražený tam, kam pes doběhne, ho zastaví. |
| Maškarovice | Kdo je pod kterou maskou, se pozná z chování masek a z řečí lidí. Dopis špatné masce přidá ostudu (`ostuda`, prohra při 3). |
| Pomlázkov | Postel posouvá den (počítadlo `den` 1 až 4, po pondělí zase čtvrtek). Každý den dovoluje něco jiného a kraslice přes noc uschnou (`kazdy_tah.csv` s vlajkou `noc`). |
| Hejrupov | Kdo dostane poštu, čeká u máje jen pár podání (`p1` až `p4`). Máj se postaví, když čekají všichni naráz. |
| Mikulášov | Nůše je zásobník: balíky leží v `s1` až `s3`, `top` je počet a anděl vytahuje shora. Družina obchází domy v pevném pořadí. |
| Koláčov | Zasedací pořádek: jmenovky na židlích (`z1` až `z4`) a hospodyně zkontroluje, jestli se nikdo nepohádá. |
| Třířečí | Adresy a přání v nářečí, která se schválně pletou (jablóška jsou brambory, ogar je kluk, bača není každý ovčák). |
| Jelení Hráz | Balíky plavou kanálem o stanici níž po každém podání (`l`, `t`, `s`). Kdo dostal avízo, čeká na břehu a vyloví i cizí balík. |
| Výlovice | Tři rybníky nad sebou (`h1` až `h3`) se stavidly. Voda teče po každém podání, plný rybník nesmí dostat další vodu a lov sítí jde jen při vodě na jedné. |
| Štolov | Klec jede na patro podle počtu zazvonění (`zvon`, `patro`). Vidět jsou jen lidé z patra, kde klec stojí. Sfouknutý kahan (`tma`) ukáže permoníka. |
| Bludičkov | Bludičky přeskakují po každém tahu (`b`), lucerna stojí. Bahno stojí dopis, který hastrman schová do hrnku. Pokličky jdou zvednout, jen když hastrman kouří (`kouri`). |
| Kramářov | Výměnný řetěz na jarmarku. Každá koupě stojí krejcar a dva krejcary jsou dvě různé karty, protože brašna drží každou kartu jen jednou. |
| Hodinov | Čas dělá ponocný (`h`, každý tah hodina, prohra ráno). Každý je venku jen v určitou hodinu. Po kořalce ponocný zatroubí o dvě hodiny zpátky. |
| Martinov | Voják rozetne mečem plášť a pecen napůl (dvě karty). Půlky dostanou potřební, celé věci nikdo nevezme. |
| Barborov | Barborky rostou po každém tahu jen ve vodě a v teple (`ra`, `rb`, `rk`) a do Vánoc je jedenáct tahů. |
| Václavice | Václav jde po tahu dál (`v`), šlépěje vydrží čtyři tahy (`f1` až `f5`). Pošťák (`p`) smí jen do šlépějí a jinde mrzne (`zima`). |
| Floriánov | Oheň přeskakuje po větru o dům za tah (`o1` až `o4`), polité domy (`m2` až `m4`) nechytnou. Hasiči potřebují poplach a klíč. |
| Lucín | Luciin stoleček z přesně třinácti druhů dřeva (`druhy`). Svazky se v druzích překrývají a počítají se jen nové. Hromádka vrátí všechny svazky. |
| Prokopov | Čert v pluhu táhne rovně, dokud nenarazí na kraj, kámen nebo zoranou brázdu (poloha `r`, `c`, vlajky `o00` až `o23`). Pole se musí zorat celé. |
| Štírovice | Pexeso z kamenů: první odvalený kámen drží `a`, stejná zvířátka pod druhým kamenem uvolní pár a věc pod ním. |
| Jánský Brod | Převážení loďkou jako vlk, koza a zelí (`pv`, `dv`, `kv`, `lv`). Dopis nesmí zůstat s drbnou ani s kozou. |
| Lhotka po roce | Finále příběhu. Komu patří Vrbův dopis, prozradí zápisy v deníku (podmínky `svet:`), nebo v obci přičichne k obálce pekařka či poštmistrová (vlajka `adresa`). Krakonoš stojí ve scéně, jen když platí `svet:vrba_krakonos` (`skryt_kdyz`). |

### Nástroje pro kontrolu obcí

Ve složce `nastroje/` jsou pomocné skripty (potřebují Node.js, Python 3, a pro hraní v prohlížeči Google Chrome a ImageMagick):

- `node nastroje/over.mjs data/<obec>/` projde všechny stavy obce a vypíše chyby, zaseknuté stavy, nedosažitelné řádky a počet objevů do alba. Vlajky světa začínají prázdné. Druhý argument (`vrba_lhotka,vrba_hluchov`) je nastaví předem, třeba pro finále.
- `node nastroje/cesta.mjs data/<obec>/` vypíše nejkratší výherní cestu.
- `python3 nastroje/hraj_obce.py nastroje "<obec>=<Název>"` obec odehraje v headless Chromu a uloží snímky (potřebuje běžící `python3 -m http.server 8765 --bind 127.0.0.1` v kořeni projektu).
- `python3 nastroje/rozlozeni.py` hledá cíle, které jsou ve scéně moc blízko sebe.
- `nastroje/kontrola_vse.sh` projede všechny hratelné obce validátorem i Chromem.
- `nastroje/obec.py` je pomocník pro psaní tabulek obce v Pythonu.
- `python3 nastroje/rod.py` vypíše místa v textech, která můžou určovat pohlaví hráče.
- `python3 nastroje/sbal.py <složka>` vyrobí sbalenou verzi webu.
- `python3 nastroje/obrazky.py <obec> <složka>` převede obrázky (třeba PNG z ChatGPT) do obce, viz „Kreslené obrázky“.
- `hraj_obce.py` hraje proti `http://127.0.0.1:8765/`, jinou adresu nastavíš proměnnou `POSTAK_URL`.

### Nová obec

1. Přidej řádek do `data/etapy.csv` na místo podle data obce a vyplň mu `kapitola`.
2. Zkopíruj složku `data/lhotka` pod novým id a přepiš tabulky.
3. Až bude hratelná, nastav `pripraveno` na `ano`.

### Obrázky

Kdekoli se zadává ikona nebo výraz (`ikona` v `cile.csv` a `karty.csv`, `vyraz` v `kombinace.csv`), můžeš místo emoji napsat cestu k obrázku, třeba `img/lhotka/kovar_zrudly.png`. Pozadí scény se nastavuje klíčem `pozadi` v `etapa.csv` a má poměr stran 3:4 (na výšku). Takový obrázek platí napořád a nedá se vypnout.

### Kreslené obrázky

Obec může mít vedle emoji i kreslenou grafiku, kterou si hráč zapne nebo vypne tlačítkem s obrázkem v liště. Tlačítko je vidět jen v obci, která obrázky má. Výchozí je zapnuto, volba platí pro celou hru a přenáší se s postupem.

Obrázky jsou ve složce `data/<obec>/obrazky/` a seznam v `data/<obec>/obrazky.csv`:

| sloupec | význam |
| --- | --- |
| `druh` | `pozadi` (scéna), `cil` (portrét v medailonu) nebo `karta` (obrázek zásilky) |
| `id` | id cíle nebo karty, u pozadí prázdné |
| `ikona` | jen u cíle: obrázek pro změněnou ikonu (`ikona:pes:🐕💤`). Prázdné = výchozí ikona. |
| `soubor` | cesta od složky obce, i do jiné obce (`../lhotka/obrazky/pes.webp`) |

Kde obrázek chybí, zůstane emoji. Když cíl změní ikonu a pro novou ikonu obrázek nemá, ukáže se emoji, aby změna nezapadla. Výraz při reakci (`vyraz` v `kombinace.csv`) se u portrétu ukáže jako malý odznak vedle medailonu. Sbalená verze má obrázky v balíku obce.

Obrázky z ChatGPT převede `python3 nastroje/obrazky.py <obec> <složka>`: scénu ořízne na 3:4 (900 × 1200), ostatní na čtverec 320 × 320, u zásilek zprůhlední jednobarevné pozadí, uloží WebP a doplní `obrazky.csv`. Prompty, styl a postup jsou v `grafika.md`.

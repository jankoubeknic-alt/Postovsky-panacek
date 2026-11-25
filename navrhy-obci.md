# Návrhy dalších obcí

Původní návrhy deseti obcí. Všechny jsou už hratelné (2026-11-23). Hotové zápletky se od návrhů místy liší, platí to, co je v tabulkách ve složce `data/`. Úpravy enginu pro Zapomněnice a Šnekov řeší tabulka `kazdy_tah.csv` a efekt `cekej`.

## Dolní Zapomněnice – Kdo jsem a proč mám dopis?

Obecní studna má zvláštní vodu, a tak si tu nikdo nic nepamatuje déle než pár minut. Lidé nosí na krku cedulky se jménem, jenže v noci je vítr přeházel. Mlynář si teď myslí, že je farář, a farář mele mouku. Odpoledne má být svatba, ale ženich zapomněl, koho si bere, a nevěsta zapomněla, že se vdává.

**Mechanika:** počítadlo Paměť. Po každých třech podáních všichni zapomenou, co se stalo, a vlajky se vymažou. Řetězec akcí se proto musí stihnout najednou. Pomůže uzlík na kapesníku, který jedné postavě paměť podrží.

**Engine:** potřebuje drobnou úpravu, víc pravidel „po každém tahu“ s vlastními podmínkami, například tabulku `kazdy_tah.csv`.

## Kozí Hřbítek – Volby

Starostkou je už osm let koza Róza a nikdo si nestěžuje. Letos proti ní kandiduje kozel Bořek a voliče podplácí jetelem. Volební lístky chodí poštou, jenže jsou z papíru a kozy papír žerou.

**Mechanika:** kozy se pasou na různých místech a sežerou každý papír, který jim podáš. Náhradní lístek si jde vyzvednout na obecním úřadě, ale stojí to čas. Hráč musí doručit lístky a odhalit, kdo podplácí.

**Engine:** bez změny.

## Ozvěnov – Co do lesa volá

Ozvěna tu opakuje všechno, co kdo řekne, a nejraději tajemství. V lomu nad vsí bydlí osamělá stará paní Ozvěna. Opakuje cizí slova, protože jí nikdo nepíše. Pošťák nese milostný dopis a celá ves si ho může přečíst nahlas dřív než adresát.

**Mechanika:** co pošťák ukáže jedné postavě, uslyší i ta, ke které jde potom. Záleží na pořadí návštěv. Nakonec musí pošťák napsat dopis Ozvěně sám.

**Engine:** bez změny, stačí vlajky typu „naposledy u“.

## Čertovina pod Kotlem – Čerti v penzi

Ves vysloužilých čertů. Pekelná penzijní správa jim posílá důchody v sirných obálkách. Čert Bonifác chce chovat včely, ale ke včelařskému spolku potřebuje doporučení od anděla z vedlejší farnosti. Ostatní čerti se mu smějí.

**Mechanika:** počítadlo Síra. Kotel na návsi s každým tahem stydne, a když vystydne, čertům ztuhnou kopyta a přestanou mluvit. Uhlí do kotle zabírá místo v brašně.

**Engine:** bez změny.

## Bezvětří – Vítr v krabici

Mlýny stojí, prádlo neschne a draci nelétají. Obec si objednala vítr poštou. Balík tiše hučí a je nadepsaný NEOTVÍRAT UVNITŘ.

**Mechanika:** jedna nebezpečná zásilka. Když ji otevřeš na nesprávném místě, rozfouká ves: klobouky, prádlo i ostatní dopisy se rozletí k jiným lidem. Hráč musí přijít na to, kde vítr pustit, aby roztočil mlýn.

**Engine:** bez změny.

## Mlhov – Ves, která tu není

Mlhov se objevuje jen v mlze. Když se mlha zvedne, je tu jen louka a pošťák s dopisy pro lidi, kteří tu možná nejsou. Mlhovští se v mlze ztratili někdy kolem roku 1910 a pořád čekají na poštu. Až dostanou poslední dopisy, budou si moct konečně odpočinout. Smutně vtipná obec.

**Mechanika:** lucernou se mění hustota mlhy ve třech stupních a v každém jsou vidět jiní lidé. Je to rozšířený princip dne a noci z Kamenice.

**Engine:** bez změny.

## Nová Ves u Staré Vsi – Hraniční spor

Ulicí vede bílá čára už od roku 1921, kdy se obě vsi pohádaly kvůli hrušni, která rostla přesně na hranici. Každá strana má svého starostu, svou hospodu a svou poštovní schránku. Dopis přes čáru potřebuje dvě razítka. Syn jednoho starosty si teď chce vzít dceru druhého.

**Mechanika:** přecházení přes čáru u celníka a počítadlo Napětí. Napětí roste, když někdo uvidí poštu od druhé strany. Svatební oznámení musí přes čáru tak, aby se nikdo neurazil.

**Engine:** bez změny.

## Šnekov – Pomalé město

Ve Šnekově se nikdo nikam nežene. Starosta podepisuje jeden dopis od pondělí. Zítra jsou závody šneků, ale startovní pistole je pořád na cestě. Pošťák je jediný rychlý člověk ve městě.

**Mechanika:** efekty přicházejí se zpožděním. Postava, které dáš zásilku, odpoví až za pár tahů. Hráč musí plánovat dopředu a mezitím dělat něco jiného.

**Engine:** potřebuje úpravu, odložené efekty (například `za3:vlajka`).

## Myší Lhota – Pošťák obrem

Nejmenší ves v okrese. Domy jsou velké jako krabice od bot a starostou je myš. Pošťák je tu obr: každý krok může rozšlápnout plot a dopisy jsou větší než domy.

**Mechanika:** počítadlo Škody, které roste s každým neopatrným krokem. Dopisy se musí nejdřív zmenšit: krejčová je ustřihne, hodinář je složí. Obrácený svět, kde je hlavní hádankou šikovnost.

**Engine:** bez změny.

## Straky nad Blýskavou – Kdo krade lžičky

Ve vsi mizí všechno, co se blýská: lžičky, brýle, snubní prsten a teď i poštovní známky. Lidé se podezírají navzájem. Pachatelem je straka a hnízdo má na kostelní věži.

**Mechanika:** straka po každém tahu ukradne z brašny věc, která se blýská, a odnese ji na jedno z několika míst. Hráč musí sledovat, kam letí, a lesklé věci schovávat, třeba zabalit do novin.

**Engine:** bez změny, pokud straka krade podle pevného pořadí. Náhodná krádež by potřebovala náhodu, kterou engine zatím nemá.

# Druhá várka

Pět dalších obcí, hratelné od 2026-11-24. Engine je beze změny, vše řeší vlajky, počítadla, `kazdy_tah.csv` a `skryt_kdyz`.

## Hluchov – Tichá pošta

Nikdo tu pořádně neslyší a hluchá telegrafistka zapsala telegram jako PŘIJEDE HEJTMAN V BOTU S KOZOU. Každý ve vsi slyší, co chce slyšet: hostinský kapelu a sobotu, malý Pepík bratrance Jendu a dechovku, švadlena nevěstu, kostelník neděli a myslivec medvěda v noci. Kdo telegram přečte, přepíše svá slova a poslední slovo má ten, kdo četl poslední. Správné pořadí je hostinský, Pepík, švadlena.

## Pozpátkov – Odpovědi chodí dřív

Čas tu běží obráceně a odpovědi přicházejí dřív než otázky. Pošťák nese souhlas se sňatkem, omluvu za kozu a dodací list na žebřík, všechno bez adresáta. Kdo odpověď dostane, tomu se stane, co v ní stojí, a napíše otázku. Koza přeskočí plot k faráři a kominíkovi praskne žebřík. Starosta ti už ráno poděkoval za to, co teprve uděláš.

## Lhářov – Vítejte v Pravdíně

Všichni lžou, a proto i adresy píše svět naopak: dopis pro nejmladší patří nejstarší babce, šle pro nejhubenějšího tlustému řezníkovi. Pravdu mluví jen činy. Kdo zásilku chce, řekne, že ji nechce, a nechá si ji. Jedinou výjimkou je nová paní učitelka, o které všichni tvrdí, že je největší lhářka. Hospoda s cedulí OTEVŘENO je zavřená a otevře ji cedule ZAVŘENO z kostela.

## Razítkov – Bez razítka ani ránu

Bez povolení k doručování nikdo nic nepřevezme. Okénko 1 chce potvrzení z okénka 2 a okénko 2 chce povolení z okénka 1. Smyčku rozbije polední přestávka: řízky od maminky pošlou paní Razítkovou na oběd a pan Kulatý ji zastoupí, takže sedí na obou okénkách najednou. Babka potřebuje potvrzení o žití a nakonec přijde dopis z ministerstva, který ruší razítka. Neplatí ale, dokud ho někdo neorazítkuje.

## Ježíškova Lhota – Štědrý den

Pošťák tu dělá Ježíška. Tři děti hlídají své stromečky. Pepíka, který se celý den postí, odláká zlaté prasátko od perníkáře. Anča odběhne hrát anděla do betléma, až dostane křídla, a Toník usne u babiččiny pohádky. Pod jeho stromkem ale zůstane past se zvonečkem. Tím zvonečkem se nakonec zvoní u stromu na návsi.

# Třetí várka: pohádky

Jedenáct obcí inspirovaných pohádkami, hratelné od 2026-11-24. Engine je beze změny.

Lidové pohádky a díla autorů, kteří zemřeli před víc než 70 lety, jsou volná: Krakonoš jako pověst, Karel Čapek, Josef Čapek, Erben, Němcová a Kocourkov. Ty můžou nést i původní jména. Kocour Mikeš (Josef Lada, volný až od 1. 1. 2028), Spejbl a Hurvínek, Bob a Bobek, O zvířátkách pana Krbce a seriál Krkonošské pohádky jsou chráněné. Proto jsou tu jen jako pocta s vlastními jmény a postavami. Pro obrázky z ChatGPT platí totéž: nekreslit podle filmů a seriálů, jen podle popisu.

## Kočičí Lhota – Dort k svátku (Josef Čapek: Povídání o pejskovi a kočičce)

Pejsek a kočička pečou dort ze všeho, co mají nejradši. Pejsek jí odspodu, kočička olizuje vršek a prostředek je pro hosta. Celá ves radí: zahradník chce okurku, myška nabízí sýr, jen aby nemusela do dortu sama. Zlý pes za plotem hotový dort ukradne, dokud ho nepozveš. Správně je dole buřt, uprostřed suchý rohlík kvůli psímu bříšku a navrchu šlehačka.

## Kašovice – Hrnečku, vař! (lidová pohádka)

Hrnec vaří kaši a nikdo si nepamatuje zaklínadlo. Slova jsou karty: maminka zná „Hrníčku“ a „Vař“, Bručoun „Hrnci“ a „Stačí“, pan řídící „Přestaň“ a hospodská Dostálová „Dost“. Hrnec se urazí na hrníček i na hrnce. Pan řídící s Pravidly opraví oslovení na „Hrnečku“. Kaše mezitím stoupá a Honza ji jí lžící z katalogu.

## Mňoukov – Kocour v brašně (pocta Kocourovi Mikešovi)

Zvířata mluví, ale rozumí jim jen ten, kdo má s sebou kocoura Fouska. Fousek utekl z domu, protože si všichni myslí, že snědl nedělní pečínku. Slepice a prase viděli psa Hafana. Fousek se psa bojí a uteče na hrušku, dokud Hafan nehryže kost. Kozel Mečoun, který jí noviny, sepíše psaní pro babičku.

## Kocourkov – Doslova (lidové Kocourkovské příběhy)

Adresy jsou rčení a Kocourkovští je dělají doslova. Koš je pro tu, která dává košem, koště pro drbnu, co si nezametá před vlastním prahem, zajíc pro sedláka, co koupil zajíce v pytli a doma vyndal kocoura. Flinta leží v žitě. Čisté víno nalije hospodský, až drbna zametá, a pak je jasné, že máslo na hlavě má starosta pod kloboukem.

## Cylindrov – Čáry máry (pocta Bobovi a Bobkovi)

Kouzelníku Pokustónovi vypadl cylindr a králíci Čáry a Máry v něm rýmují. Co spadne dovnitř, vyleze jako rým: lžíce jako svíce, kytka jako nitka, křídlo jako mýdlo, klíč jako míč, hůlka jako půlka. Každý ve vsi má přesně ten rým, který nepotřebuje. Kost, host a most jdou dokola, takže na most přes potok je potřeba kost protáhnout dvakrát.

Původní návrh byl řetěz proměn dopis, holubice, šátek, králík. Rýmy víc sedí k hádankám se slovy.

## Loutkov nad Nití – Kdo za co tahá (pocta Spejblovi a Hurvínkovi)

Loutkář usnul a nitě se zamotaly. Kdykoli pekař po něčem sáhne, zazvoní zvon. Zvon vzbudí babku a vyleká hasiče, který pustí žebřík. Babčina noha zvedá žebřík k lávce, kde spí loutkář. Táta Hoblík podepisuje kývnutím hlavy, ale jeho hlava visí na niti syna Špalíčka. Špalíček zvedne ruku, jen když se něco stane, a ptá se „Tati, a proč?“.

## Dlouhá Široká – Tři pomocníci (K. J. Erben: Dlouhý, Široký a Bystrozraký)

Dlouhý, Široký a Bystrozraký jsou karty, které se nespotřebují. Dlouhý dosáhne na věž k zamčenému zvoníkovi i na dno studny. Široký vypije rybník, takže se k poustevníkovi dojde po dně, a vodu pak vypustí do mlýnského náhonu. Bystrozraký uvidí prsten ve tmě studny a pohledem rozbije balvan na cestě. Vytáhnout prsten umí jen Dlouhý.

## Měsíčkov – Dvanáct měsíčků (Božena Němcová: O dvanácti měsíčkách)

Je leden a Holena chce fialky, jahody a jablka. Komu z bratrů dáš hůl, ten vládne a ves se promění. Co nepatří do období, se po dalším podání zkazí. Hostinský potřebuje v létě led, a ten se dá uchovat jen v ledárně, kam se musí uložit ještě v zimě. Nakonec se hůl vrací Lednu.

## Hrad Strachov – Strašidelná pošta (pocta O zvířátkách pana Krbce)

Kastelán Klíčník s kocourem Šmouhou a sovou Hůhů potřebuje návštěvnost, jinak hrad zavřou. Strašidla odebírají poštu, ale před prohlídkou se schovávají. Prohlídka obchází sál, kapli, sklep a nádvoří a strašidlu v její místnosti nic nepředáš. Kocour si hraje s rytířovou hlavou. Až jsou všichni připravení, kastelán je svolá a strašení začne, jakmile prohlídka vejde do sálu.

## Krakonošov – Stížnost na počasí (pověst o Krakonošovi)

Statkář Šrajtofle si stěžuje, že mu prší. Krakonoš se po každém podání převleče za houbaře, uhlíře nebo poutníka a pravý houbař, uhlíř nebo poutník mezitím sedí v hospodě. Poznáš ho po mokrém šosu. Stížnost přijme jen od toho, kdo se s ním rozdělil o chleba, jinak přijde bouřka. Odpověď zní: bude pršet jen vám, a jen na pole.

## Pošta o půlnoci – Pošťácká pohádka (Karel Čapek)

V noci hrají na poště skřítkové karty s dopisy a hmatem poznají, co v nich stojí. Mezi dopisy je jeden bez adresy a bez známky. Pečetítko pozná, že ho psal šofér autobusu, který ji vídá v okně u silnice, Obálka uslyší modré oči a Známka písničku. Ve vsi je pět Marušek a tyhle tři stopy sedí jen na Marušku z hospody. Skřítkové pak dostanou mariášky, aby přestali hrát s dopisy.

# Čtvrtá várka: oblasti

Obce podle oblastí, které uživatel vybral 2026-11-24: historie pošty, pověsti, lidové písničky, zvyky v roce, nářečí a kraje, česká strašidla a jarmark. Engine je beze změny.

## Historie pošty

### Koníkov – Dostavník jede v pět

Pošťák zastupuje nemocného postiliona. Dostavník jezdí dokola: pošta, hostinec, mlýn, zámek. Každé podání ho posune o zastávku a doručit jde jen tam, kde zrovna stojí, takže se plánuje, co se doručí kde. Ve voze jsou dvě místa a babka s husou zaberou obě. Student na zámek nastoupí, jen když je volno.

### Holubník – Holub letí jen domů

Voda vzala mosty a na hájovnu, na salaš ani do balónu se nedá dojít. Holubář pošle dopis jen s holubem z místa adresáta. Holub z hájovny sedí na kostelní střeše, dokud ho hlídá kocour. Holuba ze salaše chce hostinský do polévky. Toulavka se odstěhovala do balónu, ale sedí na vejcích, dokud je nezahřeje babčina kvočna.

### Ťukov – Telegraf neumí háčky

Ťukovští objednávají zboží z Prahy telegrafem bez háčků a čárek. Přijde šest balíků: dvakrát ROZE (růže pro nevěstu a rože neboli parohy pro myslivce), dvakrát KURE (kuře pro kuchaře a kůra pro koželuha) a dvakrát KOS (kos pro sbormistra a koš pro houbařku). Kdo co chtěl, řeknou lidé, co je uvnitř, prozradí popis balíku.

### Trubkovice – Potrubní pošta

Pěšky se doručovat nesmí, jen potrubím. Výhybky A, B a C se po každé patroně přehodí, takže cíle jdou dokola: radnice, hospoda, škola, fara. Farář po dopisu napíše žádost na radnici a učitel po křídách pozvánku do hospody. Obojí se vrací na poštu a musí znovu do potrubí. Prázdná patrona jen přehodí výhybky.

## Pověsti (Alois Jirásek a lidová podání)

### Spáčov pod Blaníkem – Nejhorší chvíle

Strážce pustí prosbu dětí k rytířům jen v nejhorší chvíli. Ve Spáčově je ale dobře, a tak musí pošťák nejdřív doručit všechny špatné zprávy: daňový výměr starostovi, hlášení o krupobití sedlákovi a dopis, kterým ženich ruší svatbu. Pohled z lázní je jen dobrá zpráva a skálu neotevře. Rytíři pak dají listiny, které všechno napraví.

### Hlínov – Golem nosí

Rabi Löw dá šém a lístečky NOS VODU, NOS DŘÍVÍ a DOST. Golem po každém podání přinese jedno vědro nebo otýpku a sám nepřestane. Kád pojme tři vědra a pec dvě otýpky. Co je navíc, to se vylije a nosí se znovu. Mezi příkazy se dá doručovat, takže se počítají tahy.

### Neumětely – Šemíkův skok

Horymír je zavřený na hradě a vrátný bez propustky nikoho nepustí. Šemík poslechne heslo „Šemíku, hop!“ od Horymírové, ale až se nají ovsa. Přeskočí hradbu a uvnitř kníže po prosbě sedláků povolí Horymírovi poslední přání. Horymír objede nádvoří třikrát a Šemík s ním skočí do řeky. Ven se odchází bránou s propustkou.

### Faustův dům – Díra ve stropě

Schodiště je zazděné kvůli čertovi a zásilky do pater jezdí košem dírou ve stropě. Student v prvním patře spí, zvědavá vdova ve druhém vytáhne všechno, co jede kolem, a kominík v podkroví tahá provaz. Vdovu zaměstná dopis od sestry nebo drb od domovnice. Pak dojedou štětky ke kominíkovi a saze z komína vzbudí studenta.

## Lidové písničky

Písnička je zároveň nápověda. Kdo zná text, zná i řešení.

### Pecnov – Pec nám spadla

Mladý pecař staví pec po vrstvách: kámen, hlína, cihly a roura. Každou vrstvu umí, jen když mu přijde dopis s radou od starého pecaře z Vídně, Brna, Lince nebo Prahy. Pořadí dopisů je pořadí stavby. Když přineseš materiál na vyšší vrstvu, než pec má, pec nám spadla a staví se od nuly. Hotová pec upeče chleba pro babičku.

### Skákalov – Skákal pes přes oves

Pes Alík ukradl myslivci péro z klobouku a po každém podání skočí o kus dál: přes oves, přes zelenou louku, do lesa a zase do ovsa. Myslivec doběhne vždycky tam, kde pes byl, takže je pořád o krok pozadu. Pasáček dá buřt a ten se musí nastražit tam, kam pes doběhne. Buřt u psa nebo u myslivce se ztratí. Chycený pes pustí péro a dostane obojek se jmenovkou.

## Zvyky v roce

Vánoce už má Ježíškova Lhota, tady jsou ostatní svátky roku.

### Maškarovice – Kdo je pod maskou

Masopustní úterý, celá ves v průvodu. Dokud strakáč nedostane povolení k obchůzce, průvod se nikde nezastaví. Pak se dají masky obejít: kobyla má pravé podkovy, Turek opravuje češtinu, medvěd i kominík mají mouku. Hospodská ví, že medvěd šlape po nohou, kdežto pekař tancuje jako pírko. Dopis špatné masce se přečte nahlas celé vsi a přidá ostudu. Tři ostudy jsou prohra.

### Pomlázkov – Čtyři dny Velikonoc

Klepnutím na postel začne další den: Zelený čtvrtek, Velký pátek, Bílá sobota, pondělí a pak zase čtvrtek o rok později. Pohled od zvonů z Říma dává smysl jen v pátek a sobotu. Na Velký pátek hospodyně nic nedá. Kluci s dědovou řehtačkou v sobotu vyhrkají vajíčka, babička je obarví ve slupkách a přes noc uschnou. V pondělí musí mít kluci pomlázku a děvčata kraslice.

### Hejrupov – Máj a čarodějnice

Máj se postaví, jen když u něj čekají všichni čtyři naráz. Dědové vydrží čtyři podání, hasiči tři, kovář dvě a kluci jen to jedno. Pošta je přivolá a v liště se ukazuje, jak dlouho ještě vydrží. Kdo se nedočká, jde domů a musí se zavolat znovu. Na hranici pak patří čarodějnice, kterou kluci udělají ze sedlákovy slámy.

### Mikulášov – Nůše se plní odspodu

Anděl vytahuje dárky z nůše shora, takže co se dá dovnitř poslední, dostane první dům. Pan farář prozradí, že družina chodí od nejmenších dětí k největším, a věk prozradí děti samy. Maminky dají dárky za poštu. Špatně naplněná nůše znamená uhlí a pláč, ale anděl ji umí vysypat a začít znovu.

### Koláčov – Kdo sedí vedle koho

Posvícení u Dvořáků a čtyři židle, jedna u kamen a jedna u okna. Jmenovky se kladou na židle a každý host řekne, kde sedět nechce. Děda chce ke kamnům, teta Bára nechce k oknu ani ke strýci Lojzovi a kmotr nechce vedle dědy. Hospodyně přinese koláče, až když se nikdo nepohádá. Řešení je jediné.

## Nářečí a kraje

### Třířečí – Tři kraje, tři řeči

Nádražní restaurace, kde se potká Haná, Valašsko a Ostravsko. Adresy a přání jsou po hanácku, valašsku a ostravsku a schválně se pletou. Hanák chce jablóška, což jsou brambory, kdežto holčička chce jablíčka ze stromu. Ogar je po ostravsku kluk, takže dopis „na ranní šichtu“ patří mladému horníkovi, ne tomu v penzi. Bača je šéf salaše, ovce pase valach Jura. Nářeční slova jsou vybraná z těch nejznámějších. Kdo zná nářečí líp, může repliky v `kombinace.csv` klidně upravit.

### Jelení Hráz – Plavení dřeva

Šumavský plavební kanál. Těžké balíky se spouštějí u hráze a po každém podání poplují o stanici níž: pila, hájovna, ves a nakonec jez. Kdo dostane avízo, čeká na břehu s bidlem a vyloví všechno, co jde kolem, i cizí balík. Nejdřív se proto posílá to, co má doplout nejdál, a avízo se dává až ve chvíli, kdy kolem nepoplave nic cizího. Co nikdo nechytí, vyloví vorař u jezu a dá se poslat znovu.

### Výlovice – Výlov rybníka

Tři rybníky nad sebou, každý se stavidlem. Otevřené stavidlo pustí po každém podání jednu míru vody do rybníka pod ním, dolní teče do řeky. Do plného rybníka se voda pustit nesmí, jinak praskne hráz, a rybník nesmí vyschnout, než se v něm lovilo. Síť loví jen při vodě na jedné. Výlov se tedy dělá odspodu a stavidla se zavírají ve správnou chvíli.

## Česká strašidla

### Štolov – Permoník v dole

Důl o třech patrech a klec, kterou strojník pouští podle zvonku: kolikrát zazvoníš, na to patro klec sjede, čtyřikrát znamená nahoru. Klec jede po každém podání nebo po klepnutí na Jet, takže se dá zazvonit předem a cestou doručovat. Vidět jsou jen lidé z patra, kde stojí klec. Na trojce dá štajger chleba pro permoníka a po sfouknutí kahanu se v tmě rozsvítí zelená očka. Permoník za chleba přečte svůj dopis a napíše varování pro vozače na dvojce, kde se za chvíli sesype strop.

### Bludičkov – Světla na slatích

Přes slatě k samotě hajné vede jediná pevná stezka. Nad slatěmi svítí světýlka a všechna vypadají stejně: bludičky po každém tahu přeskočí jinam, lucerna hajné stojí. Kdo jde za bludičkou, zapadne do bahna a hastrman Šplíchal ho vytáhne, ale nechá si za to dopis a schová ho do hrnku pod pokličku. Pokličky se dají zvednout, jen když hastrman kouří kořenářčin tabák. Pod jednou z nich sedí od nepaměti dušička starého pošťáka.

## Řemesla a jarmark

### Kramářov – Jarmark

Babiččin hrnec cestou praskl a dráteník by ho sešil, jenže mu došel drát a má hlad. Pošťák má jediný krejcar a za ten koupí buď perník, nebo jednu ránu na střelnici. Kramářka dá drát za papírovou růži ze střelnice a druhý krejcar hodí do klobouku flašinetář, až mu přijdou nové válce z Vídně. Kolotoč a hrnčíř jsou pokušení, za která krejcar utratit nejde.

### Hodinov – Co ponocný zatroubí

V Hodinově nejsou hodiny, čas dělá ponocný a po každém podání vytroubí další hodinu. Hospoda je otevřená do desáté, Mařka čeká pod lípou v jedenáct, Bílá paní je venku jen o půlnoci a pekař vstává ve dvě. Bílá paní dá o půlnoci prsten, který Mařka potřebuje už v jedenáct. Pomůže kořalka od hospodského: ponocný se po ní splete o dvě hodiny zpátky a celá ves mu to věří. V osm troubení je ráno a s ním prohra.

## Světci

Návrh uživatele: stylizované legendy o svatých v malebných vesnicích. Mikuláš už má Mikulášov.

### Martinov – Plášť napůl

Svatý Martin rozťal plášť napůl a půlku dal žebrákovi. U brány stojí voják na bílém koni a jeho meč rozpůlí pošťácký plášť i pecen pro chudé. Žebrák a babka chtějí každý půlku pláště, celý plášť nevezmou. Dva sirotci chtějí každý půlku pecnu. Husa pro faráře se nepůlí. Když jsou všichni zahřátí a nasycení, padá první sníh.

### Barborov – Barborky do Vánoc

Třešňové větvičky z Barbory musí do Štědrého dne rozkvést a rostou jen ve vodě a v teple. Anča má všechno připravené, Bára nemá vázu (hrnčíř ji dá za poštu) a Káča má studenou světničku (dříví od hajného). Každá barborka potřebuje čtyři pochůzky a do Vánoc jich je jedenáct, takže záleží na pořadí.

### Václavice – Šlépěje ve sněhu

Legenda o knížeti Václavovi, který nosil v noci dříví chudým a jehož šlépěje byly teplé. Václav jde po každém tahu o místo dál a u vdovy a uhlíře se zdrží. Šlépěje vydrží čtyři tahy. Pošťák smí jen tam, kde šlépěje jsou, a kde zmizí, mrznou mu nohy. Doručit jde jen na místě, kde pošťák stojí, takže se pořád střídá krok a doručení. Ke kapli se jde až s prázdnou brašnou.

### Floriánov – Svatý Floriáne, chraň náš dům

Patron hasičů a známé rčení „Svatý Floriáne, ochraňuj náš dům, zapal jiný“. Kovárna hoří a vítr nese oheň o dům dál za každý tah. Polité vědrem dům tři tahy nechytne. Hasiči slaví v hospodě: zvon je vyburcuje, klíč od zbrojnice dá starosta za poštu a stříkačka pak hasí do dvou tahů. Chalupa Vávrových shořet nesmí.

### Lucín – Stoleček ze třinácti dřev

Svatá Lucie, lucky v bílém se zobákem a Luciin stoleček, ze kterého je o půlnoční vidět čarodějnice. Musí být z přesně třinácti druhů dřeva. Truhlář má buk a dub a lidé ze vsi dávají celé svazky, ve kterých se druhy opakují: hajný má mezi jehličnany buk, kolář dub a javor má kolář i mlynář. Počítají se jen nové druhy a truhlář svazek, se kterým by to přesáhlo třináct, nevezme. Hromádka dřeva vrátí všechny svazky a počítá se znovu. Třináct se dá složit víc způsoby.

### Prokopov – Čert v pluhu

Svatý Prokop zapřáhl čerta do pluhu. Čert táhne rovně, dokud nenarazí na kraj pole, kámen nebo zoranou brázdu, přes kterou nejde. Šipkami se volí směr a pole o deseti políčkách se dvěma kameny se musí zorat celé. Řešení je jediné na sedm tahů pluhem. Když se čert zasekne, Prokop pole pokřižuje a začíná se znovu.

### Štírovice – Hadi a štíři

Na svatého Jiří vylézají hadi a štíři. U cesty leží osm kamenů a pod nimi po dvou užovky, štíři, ještěrky a ropuchy. Kameny se odvalují po dvou jako pexeso: stejná zvířátka vylezou spolu a nechají tam, co ves přes zimu ztratila, jinak zalezou a kameny se položí zpátky. Mezi ztracenými věcmi je i provázek od draka malého Jiříka.

### Jánský Brod – Listovní tajemství

Svatý Jan Nepomucký, patron mostů a tajemství. Velká voda vzala most a loďka uveze pošťáka a jednoho dalšího. Převáží se drbna, koza a dopis s pečetí jako vlk, koza a zelí: drbna dopis přečte a koza ho sežere, když s ním zůstanou bez pošťáka. Porušené tajemství je prohra.

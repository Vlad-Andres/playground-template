# Energia în mișcare: de la pendulul lui Newton la bobina Tesla

Note de fizică pentru vârsta de 14–16 ani. Trei lecții. Peste tot folosim g = 9,8 N/kg (la fel ca 9,8 m/s²).

Ideea principală a acestor note: **energia nu se creează și nu se pierde — ea se mută.** Trece dintr-o formă de stocare în alta (un pendul), de la un corp la altul (bilele pendulului lui Newton) și de la un circuit la altul (o bobină Tesla). De fiecare dată, o parte din ea se împrăștie în mediul înconjurător sub formă de căldură și sunet.

---

## Lecția 1 — Formele de energie și pendulul

### 1.1 Unde se stochează energia

Energia poate fi stocată în moduri diferite. Când se întâmplă ceva, energia trece dintr-o formă de stocare în alta.

| Formă de stocare | Unde o găsești | Exemplu |
|---|---|---|
| Cinetică | La orice corp în mișcare | O minge de fotbal care se rostogolește |
| Potențială gravitațională | La orice corp ridicat deasupra solului | O minge ținută în vârful unui tobogan |
| Potențială elastică | La orice corp întins sau comprimat | Un resort întins |
| Termică | La orice corp cald | O cană de ceai |
| Chimică | În mâncare, combustibili, baterii | Bateria unui telefon |
| Magnetică | La magneți și la bobinele parcurse de curent | Doi magneți împinși unul spre altul |
| Electrostatică | La sarcini electrice separate | Un balon electrizat; un condensator încărcat |

### 1.2 Două formule

**Energia cinetică:** E_c = ½ · m · v²

- E_c = energia cinetică, în jouli (J)
- m = masa, în kilograme (kg)
- v = viteza, în metri pe secundă (m/s)

**Energia potențială gravitațională:** E_p = m · g · h

- E_p = energia potențială gravitațională, în jouli (J)
- m = masa, în kilograme (kg)
- g = accelerația gravitațională, 9,8 N/kg pe Pământ
- h = înălțimea deasupra celui mai de jos punct, în metri (m)

Observă că dacă dublezi viteza, energia cinetică devine de **patru ori** mai mare, pentru că viteza este la pătrat. Dacă dublezi înălțimea, energia potențială doar se dublează.

### 1.3 Cum oscilează un pendul

Un pendul este o bilă mică și grea (*corpul pendulului*) atârnată de un fir. Trage-o într-o parte și las-o liberă. Cadru cu cadru, iată ce se întâmplă:

1. **În punctul de lansare** bila stă pe loc și este cât se poate de sus. Toată energia ei este energie potențială gravitațională. Energia cinetică este zero.
2. **La coborâre** bila accelerează. Energia potențială se transformă în energie cinetică.
3. **În cel mai de jos punct** bila se mișcă cel mai repede. Toată energia este acum cinetică. Energia potențială este zero (măsurăm înălțimea de aici).
4. **La urcarea pe partea cealaltă** bila încetinește. Energia cinetică se transformă din nou în energie potențială.
5. **La celălalt capăt** bila se oprește pentru o clipă aproape la aceeași înălțime de la care a pornit, apoi se întoarce.

Dacă n-ar exista rezistența aerului și frecarea în punctul de suspensie, energia totală ar rămâne exact aceeași la nesfârșit: **E_p + E_c = constant.**

### 1.4 Exemplu rezolvat: viteza în punctul de jos

O bilă de 0,20 kg este lăsată liberă de la 0,45 m deasupra celui mai de jos punct. Cu ce viteză trece prin punctul de jos?

1. Energia potențială la început: E_p = 0,20 × 9,8 × 0,45 = **0,882 J**
2. Jos, toată această energie este cinetică: ½ × 0,20 × v² = 0,882
3. v² = 0,882 ÷ 0,10 = 8,82
4. v = √8,82 ≈ **2,97 m/s**

Observă că masa se simplifică: v = √(2gh). O bilă grea și una ușoară, lăsate de la aceeași înălțime, ajung jos cu aceeași viteză.

### 1.5 Energia în fiecare punct al oscilației

Pentru aceeași bilă (0,20 kg, lăsată de la 0,45 m):

| Înălțimea deasupra punctului de jos (m) | E_p (J) | E_c (J) | Total (J) | Viteza (m/s) |
|---|---|---|---|---|
| 0,45 (lansare) | 0,882 | 0,000 | 0,882 | 0,00 |
| 0,30 | 0,588 | 0,294 | 0,882 | 1,71 |
| 0,225 (la jumătate) | 0,441 | 0,441 | 0,882 | 2,10 |
| 0,10 | 0,196 | 0,686 | 0,882 | 2,62 |
| 0,00 (jos) | 0,000 | 0,882 | 0,882 | 2,97 |

Un mod util de a-ți imagina asta sunt două bare una lângă alta, câte una pentru fiecare formă de energie. Pe măsură ce bila oscilează, o bară scade exact cât crește cealaltă, iar totalul rămâne același.

### 1.6 Unde se duce energia? Disiparea

Un pendul real oscilează din ce în ce mai jos. La fiecare oscilație, puțină energie trece în energia termică a aerului și a punctului de suspensie, iar o parte pleacă sub formă de sunet. Spunem că energia este **disipată**: ea există în continuare, dar este împrăștiată și nu mai poate fi folosită.

Să presupunem că un pendul păstrează 95% din energie la fiecare oscilație. Pentru că E_p = mgh, cel mai înalt punct al fiecărei oscilații scade și el la 95% din cel precedent:

| Numărul oscilației | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Cel mai înalt punct (m) | 0,450 | 0,428 | 0,406 | 0,386 | 0,367 | 0,348 |

După aproximativ 14 oscilații, pendulul mai urcă doar până la jumătate din înălțimea de pornire.

### 1.7 Cât durează o oscilație?

**Perioada** T este timpul unei oscilații complete, dus și întors. Pentru oscilații mici, ea depinde doar de lungimea L a firului:

T = 2π · √(L / g)

| Lungimea L (m) | 0,25 | 0,50 | 1,00 | 2,00 |
|---|---|---|---|---|
| Perioada T (s) | 1,00 | 1,42 | 2,01 | 2,84 |

Două rezultate surprinzătoare: perioada **nu** depinde de masa bilei și, pentru oscilații mici, **nu** depinde nici de cât de mult tragi bila într-o parte. Ca să dublezi perioada, ai nevoie de un fir de **patru** ori mai lung.

### 1.8 Lucrare practică: măsurarea perioadei unui pendul

1. Leagă un obiect mic și greu de un fir și atârnă-l de un suport, astfel încât să poată oscila liber.
2. Măsoară lungimea de la punctul de suspensie până la centrul bilei.
3. Trage bila într-o parte cu un unghi mic (sub aproximativ 10°) și las-o liberă — nu o împinge.
4. Pornește cronometrul când bila trece prin punctul de jos și numără 10 oscilații complete.
5. Împarte timpul total la 10. Dacă măsori multe oscilații, rezultatul este mai precis decât dacă măsori una singură.
6. Repetă pentru cel puțin patru lungimi diferite și reprezintă grafic perioada în funcție de lungime.

**Prezice mai întâi:** dacă înlocuiești bila cu una de două ori mai grea, perioada va crește, va scădea sau va rămâne la fel?

---

## Lecția 2 — Impulsul și pendulul lui Newton

### 2.1 Impulsul

Impulsul îți spune cât de greu este să oprești un corp în mișcare.

**p = m · v**

- p = impulsul, în kilogram-metri pe secundă (kg·m/s)
- m = masa, în kilograme (kg)
- v = viteza, în metri pe secundă (m/s)

Impulsul are o **direcție și un sens**. Alegem un sens ca pozitiv (de exemplu, spre dreapta), iar sensul opus este negativ. O bilă de 0,10 kg care se mișcă spre dreapta cu 1,0 m/s are p = +0,10 kg·m/s. Dacă se mișcă spre stânga cu aceeași viteză, p = −0,10 kg·m/s.

### 2.2 Conservarea impulsului

Când corpurile se ciocnesc și nicio forță din exterior nu acționează asupra lor, **impulsul total înainte de ciocnire este egal cu impulsul total după ciocnire.** Acest lucru este mereu adevărat, în orice ciocnire.

Cu energia cinetică lucrurile stau altfel. În unele ciocniri se păstrează, în altele nu:

| | Ciocnire elastică | Ciocnire neelastică |
|---|---|---|
| Impulsul total | Se conservă | Se conservă |
| Energia cinetică totală | Se conservă | O parte trece în căldură, sunet și deformare |
| Corpurile după ciocnire | Se despart | Pot rămâne lipite sau se deformează |
| Exemplu din viața de zi cu zi | Bile de oțel, bile de biliard (aproape elastice) | Două bucăți de plastilină, un accident de mașină |

### 2.3 Exemplu rezolvat: o ciocnire plastică

O bilă de plastilină de 0,10 kg care se mișcă cu 1,0 m/s lovește o bilă identică aflată în repaus, iar cele două rămân lipite.

1. Impulsul înainte: 0,10 × 1,0 + 0,10 × 0 = 0,10 kg·m/s
2. După ciocnire, masa totală de 0,20 kg se mișcă cu viteza v: 0,20 × v = 0,10, deci v = **0,50 m/s**
3. Energia cinetică înainte: ½ × 0,10 × 1,0² = 0,050 J
4. Energia cinetică după: ½ × 0,20 × 0,50² = 0,025 J
5. Jumătate din energia cinetică (0,025 J) s-a dus în încălzirea și turtirea plastilinei.

### 2.4 Pendulul lui Newton

Pendulul lui Newton este un șir de bile de oțel identice, fiecare atârnată de două fire în formă de V, ca să poată oscila doar pe o singură linie. Când stau nemișcate, bilele abia se ating între ele.

Ce observi:

- **Ridici o bilă și o lași liberă.** Lovește șirul și se oprește. Bila de la celălalt capăt sare în afară, urcă aproape la aceeași înălțime, se întoarce, iar procesul se repetă. Bilele din mijloc aproape nu se mișcă.
- **Ridici două bile deodată.** La celălalt capăt sar două bile.
- **Ridici trei bile dintr-un pendul cu cinci bile.** Sar trei bile — inclusiv cea din mijloc, care face parte din ambele grupuri.
- **Ridici câte o bilă de fiecare parte și le lași în același timp.** Ambele lovesc șirul deodată și ambele sar înapoi.

Regula: **dacă n bile lovesc șirul, n bile pleacă de la celălalt capăt, cu aceeași viteză.** Împingerea trece prin bilele care se ating sub forma unei comprimări foarte rapide, cam ca un val care trece printr-un șir de oameni.

### 2.5 Exemplu rezolvat: de ce nu pleacă două bile cu viteză pe jumătate?

Fiecare bilă are masa de 0,10 kg. O bilă este ridicată 5,0 cm (0,050 m) și lăsată liberă.

1. Viteza cu care lovește șirul: v = √(2gh) = √(2 × 9,8 × 0,050) = √0,98 ≈ **0,99 m/s**
2. Impulsul pe care îl aduce: 0,10 × 0,99 = 0,099 kg·m/s
3. Energia cinetică pe care o aduce: ½ × 0,10 × 0,98 = 0,049 J

Acum compară două rezultate posibile:

| Rezultat | Impulsul după (kg·m/s) | Energia cinetică după (J) | Posibil? |
|---|---|---|---|
| O bilă pleacă cu 0,99 m/s | 0,10 × 0,99 = 0,099 | ½ × 0,10 × 0,98 = 0,049 | Da — ambele se conservă |
| Două bile pleacă cu 0,495 m/s | 0,20 × 0,495 = 0,099 | ½ × 0,20 × 0,245 = 0,0245 | Nu — lipsește jumătate din energie |

Ambele rezultate conservă impulsul, dar doar unul conservă și energia cinetică. Bilele de oțel se ciocnesc aproape elastic, așa că natura alege rezultatul în care se conservă amândouă: pleacă o singură bilă.

### 2.6 Ce se întâmplă dacă bilele au mase diferite?

Când o bilă lovește elastic o singură bilă aflată în repaus, rezultatul depinde de mase. Aici o bilă în mișcare cu 1,0 m/s lovește o bilă de 0,10 kg aflată în repaus:

| Masa bilei în mișcare (kg) | Viteza ei după (m/s) | Viteza bilei lovite după (m/s) |
|---|---|---|
| 0,05 (mai ușoară) | −0,33 (sare înapoi) | 0,67 |
| 0,10 (egală) | 0,00 (se oprește complet) | 1,00 |
| 0,20 (mai grea) | +0,33 (merge mai departe) | 1,33 |

Doar când masele sunt egale bila în mișcare se oprește complet și transmite totul. De aceea, toate bilele unui pendul al lui Newton trebuie să aibă aceeași masă.

### 2.7 Un pendul real se oprește

Într-un pendul real, fiecare ciocnire este doar *aproape* elastică. Auzi un clic de fiecare dată — acel sunet este energie care pleacă. Bilele se mai încălzesc foarte puțin și nu sunt niciodată perfect aliniate. După un timp, tiparul ordonat „una intră, una iese” se strică, iar la final toate bilele oscilează ușor împreună până se opresc.

### 2.8 Lucrare practică: construiește un mini pendul al lui Newton

1. Așază două rigle sau creioane peste spațiul dintre două teancuri de cărți, la aproximativ 10 cm una de alta, paralele.
2. Ia cinci mărgele sau bile identice cu gaură (sau lipește câte o buclă de ață pe fiecare).
3. Atârnă fiecare bilă de ambele rigle cu un V de ață, ca să poată oscila doar într-o direcție.
4. Ajustează firele până când toate bilele atârnă exact la aceeași înălțime și abia se ating, în linie dreaptă.
5. Ridică o bilă și las-o liberă. Apoi încearcă cu două. Notează câte bile pleacă de la celălalt capăt și câte clicuri auzi până se strică tiparul.

**Prezice mai întâi:** ce se va întâmpla dacă înlocuiești bila din mijloc cu o bilă de plastilină?

---

## Lecția 3 — Rezonanța și inducția: de la leagăn la bobina Tesla

### 3.1 Frecvența proprie și rezonanța

Orice corp care poate oscila sau vibra are o **frecvență proprie** — numărul de oscilații pe care le face într-o secundă când este lăsat singur.

f = 1 / T

- f = frecvența, în herți (Hz)
- T = perioada, în secunde (s)

Un leagăn de pe terenul de joacă, cu lanțuri de 2,0 m, are o perioadă de aproximativ 2,84 s, deci frecvența lui proprie este cam 1 ÷ 2,84 ≈ 0,35 Hz.

**Rezonanța** apare când împingi un corp cu frecvența lui proprie. Fiecare împingere vine exact la momentul potrivit și mai adaugă puțină energie, așa că oscilațiile devin tot mai mari:

- Împingi o dată la 2,84 s, mereu când leagănul începe să se îndepărteze de tine → leagănul urcă tot mai sus la fiecare împingere.
- Împingi o dată la 2,0 s → unele împingeri ajută, iar altele vin când leagănul se apropie de tine și îl frânează. Leagănul rămâne la oscilații mici.

Un cântăreț poate sparge un pahar de cristal în același fel: dacă nota se potrivește cu frecvența proprie a paharului, fiecare undă sonoră îl mai împinge puțin, până când crapă.

### 3.2 Două pendule care își împart energia

Atârnă două pendule identice de același fir orizontal, puțin lăsat. Pune unul să oscileze și ține-l pe celălalt nemișcat, apoi dă-i drumul.

1. Primul pendul oscilează puternic; al doilea stă pe loc.
2. Smucituri mici se transmit de-a lungul firului. Pentru că ambele pendule au aceeași frecvență proprie, smuciturile îl fac pe al doilea să oscileze tot mai mult — rezonanță.
3. După un timp, primul pendul aproape s-a oprit, iar al doilea oscilează puternic. Toată energia a trecut dincolo.
4. Apoi procesul se inversează și energia se întoarce. Ea continuă să treacă înainte și înapoi.

Cu cât legătura dintre pendule este mai slabă, cu atât sunt necesare mai multe oscilații ca energia să treacă dincolo — dar ea trece în întregime, atâta timp cât ambele pendule au aceeași lungime. Dacă lungimile sunt diferite, trece doar puțină energie.

Ține minte această imagine. O bobină Tesla face exact același lucru, dar cu circuite electrice în loc de pendule.

### 3.3 Inducția electromagnetică

Când miști un magnet lângă o bobină de sârmă, între capetele bobinei apare o tensiune. Dacă bobina face parte dintr-un circuit închis, prin ea trece un curent. Acesta este fenomenul de **inducție electromagnetică**. Ce arată un aparat de măsură sensibil legat la bobină:

| Ce faci | Ce arată aparatul |
|---|---|
| Împingi magnetul în bobină | Acul se mișcă într-o parte |
| Ții magnetul nemișcat în bobină | Nimic — zero |
| Scoți magnetul | Acul se mișcă în cealaltă parte |
| Împingi magnetul mai repede | Deviație mai mare |
| Folosești o bobină cu mai multe spire | Deviație mai mare |
| Folosești un magnet mai puternic | Deviație mai mare |

Cuvântul-cheie este **variație**. Tensiunea este indusă doar cât timp câmpul magnetic prin bobină se schimbă.

### 3.4 Transformatorul

Un transformator are două bobine înfășurate pe același miez de fier. Un curent alternativ în bobina **primară** produce un câmp magnetic care își schimbă mereu sensul. Acest câmp variabil trece prin bobina **secundară** și induce în ea o tensiune alternativă — fără nicio piesă în mișcare.

U_s / U_p = N_s / N_p

- U_p, U_s = tensiunile la bornele bobinei primare și ale celei secundare (V)
- N_p, N_s = numărul de spire ale bobinei primare și ale celei secundare

**Exemplu rezolvat (coborâtor de tensiune).** Un încărcător de telefon are 500 de spire în primar și 25 de spire în secundar. Tensiunea rețelei este 230 V.

U_s = 230 × 25 ÷ 500 = **11,5 V**

**Exemplu rezolvat (ridicător de tensiune).** O sursă de 12 V alimentează un primar cu 100 de spire. Secundarul are 10 000 de spire.

U_s = 12 × 10 000 ÷ 100 = **1200 V**

Un transformator ideal nu pierde energie, deci puterea la intrare este egală cu puterea la ieșire: U_p × I_p = U_s × I_s. Dacă încărcătorul de telefon consumă 0,10 A din rețea, el primește 230 × 0,10 = 23 W, deci curentul din secundar este 23 ÷ 11,5 = **2,0 A**. Când ridici tensiunea, curentul scade întotdeauna.

### 3.5 Un pendul electric

Un condensator legat la o bobină formează un **circuit oscilant LC**, care se comportă ca un pendul:

| Pendul | Circuit LC |
|---|---|
| Bila trasă într-o parte | Condensatorul complet încărcat |
| Energia potențială gravitațională | Energia din câmpul electric al condensatorului |
| Bila are viteza maximă jos | Curentul maxim prin bobină |
| Energia cinetică | Energia din câmpul magnetic al bobinei |
| Frecarea și rezistența aerului | Rezistența firelor |
| Frecvența proprie depinde de lungimea firului | Frecvența proprie depinde de mărimea condensatorului și a bobinei |

Când condensatorul încărcat este legat la bobină, energia trece înainte și înapoi între condensator și bobină, iar curentul își schimbă sensul de multe mii de ori pe secundă. Ca un pendul, oscilația se stinge treptat pe măsură ce firele se încălzesc.

### 3.6 Bobina Tesla

Bobina Tesla, inventată de Nikola Tesla în jurul anului 1891, pune toate aceste idei laolaltă pentru a obține tensiuni foarte mari și scântei lungi, ramificate.

Cum funcționează, pas cu pas:

1. **Încărcarea.** Un transformator ridică tensiunea rețelei la câteva mii de volți și încarcă un condensator din **circuitul primar**.
2. **Întrerupătorul.** Un *eclator* — doi electrozi metalici cu un mic spațiu de aer între ei — funcționează ca un întrerupător. Când tensiunea condensatorului devine destul de mare, aerul din spațiu devine brusc conductor și sare o scânteie, care închide circuitul.
3. **Oscilația.** Condensatorul și bobina primară (doar câteva spire de sârmă groasă) formează acum un circuit LC. Curentul oscilează de sute de mii de ori pe secundă.
4. **Rezonanța.** În interiorul primarului se află **bobina secundară**: sute sau mii de spire de sârmă subțire pe un tub înalt, cu o cupolă sau un inel de metal în vârf. Ea este acordată pe **aceeași frecvență proprie** ca primarul. Cele două bobine sunt cuplate slab — au în comun aerul, nu un miez de fier — așa că, la fel ca la cele două pendule, energia trece dincolo pe parcursul mai multor oscilații, până când aproape toată ajunge în secundar.
5. **Scânteile.** Pentru că secundarul are atât de multe spire și este în rezonanță, tensiunea din vârf ajunge la sute de mii de volți. Aerul din jurul cupolei devine conductor și țâșnesc scântei lungi, violete. Aerul începe să conducă la aproximativ 3000 V pentru fiecare milimetru dintre două plăci metalice plane.
6. **Repetarea.** Energia trece înainte și înapoi, o parte se pierde în eclator și în scântei, eclatorul nu mai conduce, iar condensatorul se încarcă din nou. Ciclul se repetă de o sută de ori sau mai mult în fiecare secundă, de aceea bobina Tesla bâzâie.

O bobină Tesla produce și un câmp electric variabil puternic. Un tub fluorescent ținut în apropiere se aprinde fără să fie legat cu vreun fir — energie transmisă prin aer.

### 3.7 Transformator sau bobină Tesla?

| | Transformator obișnuit | Bobină Tesla |
|---|---|---|
| Miez | De fier, deci bobinele sunt cuplate strâns | Aer, deci bobinele sunt cuplate slab |
| Frecvență | 50 Hz (rețeaua) | Sute de kiloherți |
| Folosește rezonanța? | Nu | Da — ambele circuite sunt acordate pe aceeași frecvență |
| Cum crește tensiunea | Raportul numărului de spire | Raportul numărului de spire și rezonanța |
| Utilizare obișnuită | Încărcătoare, centrale electrice | Demonstrații, primele experimente radio |

### 3.8 Siguranța

- **Nu construi și nu atinge niciodată o bobină Tesla sau orice circuit alimentat de la rețea.** Transformatorul de încărcare și condensatoarele pot ucide, iar condensatoarele pot rămâne încărcate și după ce alimentarea este oprită.
- Scânteile de înaltă frecvență pot provoca arsuri adânci, chiar dacă la început nu par să doară.
- Bobinele Tesla pot perturba aparatele electronice. Oricine are un stimulator cardiac sau alt implant medical trebuie să stea departe.
- La școală, bobinele Tesla sunt prezentate doar de un profesor, în spatele unei bariere, la o distanță sigură.
- Cu magneți și bobine în clasă: ține magneții puternici departe de telefoane și carduri bancare și nu lega niciodată o bobină direct la o baterie pentru mult timp — se încălzește.

---

## Rezumat

- Energia poate fi stocată în moduri diferite și, în orice proces, trece dintr-o formă în alta. Totalul rămâne același, dar o parte este mereu disipată sub formă de căldură și sunet.
- E_c = ½mv² și E_p = mgh. Un pendul le schimbă mereu una în cealaltă; perioada lui depinde doar de lungime.
- Impulsul p = mv se conservă în orice ciocnire. Energia cinetică se conservă doar în ciocnirile elastice — de aceea pendulul lui Newton trimite în afară exact atâtea bile câte lași să cadă.
- Dacă împingi cu frecvența proprie, oscilațiile cresc mult: rezonanța. Două pendule acordate, sau două circuite acordate, își trec energia înainte și înapoi.
- Un câmp magnetic variabil induce o tensiune. Transformatoarele folosesc acest lucru, cu U_s / U_p = N_s / N_p; bobina Tesla adaugă rezonanța ca să ajungă la sute de mii de volți.

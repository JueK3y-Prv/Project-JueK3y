# juek3y.com · Neuentwurf der Website

Stand 2026-11-18 · Status: Entwurf ist als Startseite live. Stil und Programm liegen unter `src/`, Deutsch und Englisch sind eingebaut, die Rechtstexte sind umgezogen. Offen bleibt, was in Abschnitt 6 steht.

Dieses Dokument hält fest, was in der Entwurfsphase entschieden wurde. Es soll reichen, um den Umbau zu planen, ohne die Unterhaltung zu kennen, in der es entstand.

- **Entwurf zum Ansehen:** Der Entwurf ist zur Startseite geworden (`index.html`, `en/index.html`, `src/css/start.css`, `src/js/start/`). Die frühere Einzeldatei unter `docs/entwurf/` steht nur noch in der Git-Historie.
- **Derselbe Entwurf online:** https://claude.ai/artifact/N2R56RgKn4spM1a5wEdNtJ (privat)
- **Stilvorlage für Rechtstexte:** fertig, liegt aber nicht in diesem Repo. Sie gehört zum Studio-Standard und wurde JueK3y getrennt übergeben.

---

## 1 · Warum

Die Website ist der erste Kontakt zu JueK3y (Julian Kennedy), zum Beispiel in einer Bewerbung. Sie steht seit Jahren auf „Coming soon“. Sie soll zeigen, was er gebaut und fotografiert hat.

Was hängen bleiben soll, ist **nicht ein einzelnes Projekt, sondern die Art, wie die Seite es zeigt**: Gestaltung, Bewegung und Bedienung auf dem Niveau von Awwwards und Codegrid. Die Seite ist damit selbst das wichtigste Vorzeigestück.

## 2 · Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
- Staunen: Dinge, die man nicht jeden Tag sieht, auch in der Bedienung.
- Nichts wirkt statisch. Elemente reagieren aufeinander und auf Maus oder Finger.
- Bewegung und gute Bedienbarkeit zusammen: normales Scrollen, alles ohne Animation erreichbar.
- Am Handy genauso stark wie am Desktop.
- Erkennbar aus derselben Familie wie die Apps (Studio-Standard als Orientierung, nicht als Pflicht).
- Wartbar: neue Apps und Fotoserien ohne Programmierarbeit.

**Nicht-Ziele**
- Kein Kunstwerk um seiner selbst willen. „Ausgefallen“ im Sinn von präzise und überraschend, nicht verspielt.
- „Design“ ist keine eigene Kategorie mehr. Die Seite zeigt es, statt es zu behaupten. Übrig bleiben **Code** und **Fotografie**.
- Kein Tracking, keine Cookies, kein Einwilligungsbanner.

**Anti-Ziele** (daran sind Entwürfe gescheitert)
- Unruhe: häufiger Wechsel des ganzen Bildschirms, hektische Übergänge.
- Langeweile: jede Station gleich aufgebaut.
- Text, der ohne Zusammenhang durch Linien oder anderen Text läuft.
- Erklärtexte zur Bedienung. Braucht etwas eine Erklärung, wird der Entwurf geändert.
- Eine Bedienung, die am Handy das Scrollen stört.

## 3 · Ansätze

Sieben Entwürfe wurden gebaut und verworfen oder weiterentwickelt.

| Ansatz | Ergebnis |
|---|---|
| Drei Einzelbilder (Typo, Sucher, 3D-Ring) | zu wenig; es fehlte der Ablauf beim Scrollen |
| Scrollseite mit geteiltem Start, Karten, Bildband | zu brav, etwa Niveau der alten Seite |
| **Zwei Welten** mit flüssiger Linse | traf den Geschmack; Problem: wer nur scrollt, sieht nie Fotos |
| Verzahnt: App, Serie, App, Serie | zu unruhig durch ständigen Weltwechsel |
| Zwei Kapitel, ein Wechsel, alle Stationen gleich | zu langweilig |
| **Zwei Kapitel, jede Station mit eigenem Auftritt** | **gewählt** |
| Kamera (X-T5) baut sich beim Scrollen zusammen | verworfen; aus einfachen Formen sah sie nicht gut genug aus. Nur mit echtem 3D-Modell erneut prüfen |

Für den Übergang zwischen zwei App-Stationen wurden fünf Varianten probiert (Text scrollt mit, Buchstaben fliegen in die Linie, Linie fährt über den ganzen Bildschirm, Linie taucht mit Hilfsstrich ab, einfaches Umformen). **Gewählt: einfaches Umformen der Linie**, Text wechselt weich.

## 4 · Das Konzept

### Aufbau der Startseite

```
Auftakt      JueK3y steigt aus der Linie, sinkt zurück, „Code“ steigt auf
Code         Station je App: TravelFlow, Saldo, 1000 Days
Übergang     der Akzentpunkt öffnet sich zur Foto-Welt
Fotografie   Titel, dann Station je Serie: Meer, Wüste, Unterwegs
Rückkehr     das Portal schließt sich wieder in den Akzentpunkt
Kontakt      „Schreib mir.“ auf der Linie, Formular, Fußzeile
```

Es gibt genau zwei Weltwechsel: hinein in die Fotografie, am Schluss zurück.

### Die Bausteine

- **Die Linie.** Eine einzige Linie in Textfarbe zieht sich durch das Code-Kapitel und formt sich von Station zu Station um. Sie weicht Maus und Finger aus und federt zurück.
- **Der Akzentpunkt** sitzt am Ende der Linie. Er ist das Markenzeichen (Punkt hinter „JueK3y.“), nimmt an einer App-Station deren Akzentfarbe an und ist der Ursprung jedes Übergangs: Weltwechsel und Unterseiten öffnen sich aus ihm und schließen sich in ihn.
- **Schrift sitzt auf der Linie.** Namen stehen mit Abstand auf der Linie und bewegen sich mit ihr. Kleine Texte stehen fest unter der Szene und werden an der Linie abgeschnitten, falls sie sie kreuzt. Nie ragt Text in die Linie.
- **Zwei Welten.** Code trägt das gewählte Farbschema, Fotografie bewusst das Gegenstück. Code: Punktraster, Geist und Geist Mono. Fotografie: Bilder im Raum, kursive Serifenschrift für Titel.
- **Die Linse** (Maus): ein flüssiger Fleck unter dem Zeiger zeigt die andere Welt. Am Start ist sie groß, dort verdeckt sie nichts. Sobald man scrollt, wird sie deutlich kleiner, weil die andere Welt dann nicht wirklich parallel mitläuft. Gedrückt halten lässt sie über den ganzen Bildschirm wachsen.
- **Weltwechsel per Klick.** Die Kapiteltitel „Code“ und „Fotografie“ und die gleichnamigen Einträge oben wechseln die Welt an Ort und Stelle: Das Portal öffnet sich von der Klickstelle, danach steht die Seite am Anfang des anderen Kapitels. „Kontakt“ scrollt ans Ende.
- **Touch:** Tippen und Scrollen öffnen nie die Linse. Kurz tippen stupst die Szene an, nur langes ruhiges Drücken öffnet den Blick hinüber.
- **Auftritt je Station.** Jede App und jede Serie hat eine eigene Szene. Stand:
  - 1000 Days: Umlaufbahn aus dem App-Symbol, Planeten, Tageszähler, Klick fügt einen Planeten hinzu. **Gilt als gelungen und als Maßstab.**
  - TravelFlow: Die gefaltete Karte aus dem Symbol faltet sich beim Heranscrollen auf und zeichnet sich, dann fährt der Punkt (Akzent `#FF6B00`) die Route und zieht den Namen. Der Kartenrand weicht der Maus aus wie die Linie; ein Klick schüttelt die Karte und schickt den Punkt noch einmal los. Der letzte Stopp ist der Punkt selbst. Beschriftungen stehen nur dort, wo die Linie über ihnen bleibt, und rücken vor oder hinter einen Falz; am Handy sind sie zweizeilig. Wo sich ein Falz nicht vermeiden lässt (Buchstaben des Namens), blendet er weich aus statt abzubrechen.
  - Saldo: die Waage aus dem Symbol. Der Balken ist die Linie und kippt mit der Last. Die Schalen hängen an den lebendigen Enden der Linie und schwingen: wenn der Balken kippt, wenn die Maus sie anschubst, wenn eine Münze landet. Einnahmen (Scheiben) und Ausgaben (Ringe) zählen erst, wenn sie in der Schale liegen; dann springt der Betrag. Außer Sicht wird die Waage geleert, jeder Besuch füllt sie neu; ein Klick auf eine volle Schale leert sie. Der Akzentpunkt (`#8E82F0`) sitzt oben auf der Säule, die Linie bleibt in Textfarbe.
  - Was hinter der Linie liegt (Karte, Waage, Restroute), wird mit dem Grund gemischt statt durchscheinend gezeichnet, damit Linie, Ringe und Punkt immer obenauf liegen.
  - Serien: Welle (zieht seitlich), Tunnel (Durchflug), Stapel (Bilder werden weggeworfen). Das letzte Bild ist immer ganz zu sehen, bevor es weitergeht. Die Anordnung richtet sich nach dem Seitenverhältnis des Fensters, nicht nach seiner Breite: Ein hohes Fenster am Desktop bekommt die Hochkant-Anordnung. Der Titel einer stehenden Serie (Welle, Stapel) steht unter den Bildunterschriften, seine Unterzeile bleibt in jedem Fenster im Bild; er und die Bilder verblassen, bevor die Kamera sie erreicht. Im Hochformat schwebt der Tunnel-Titel über den Bildern.
- **Unterseiten.** An jeder App-Station steht „… ansehen“. Die Unterseite öffnet sich aus dem Akzentpunkt und hat eine eigene Adresse (`/1000days`, `/en/1000days`). Gebaut ist sie als Ebene über der Startseite, nicht als eigener Seitenwechsel, damit der Übergang erhalten bleibt (Entscheidung 2026-11-18, „Variante A“):
  - Öffnen setzt die Adresse, der Zurück-Knopf des Browsers und „Zurück“ auf der Seite schließen sie mit derselben Bewegung, Vor öffnet sie wieder.
  - Netlify liefert für `/1000days` die Startseite aus (`netlify.toml`). Sie öffnet die Unterseite sofort und stellt die Station dahinter bereit; „Zurück“ schließt dann zur Station.
  - Titel, Sprachschalter, kanonische Adresse und Beschreibung folgen der offenen Unterseite. Suchmaschinen sehen im HTML trotzdem die Startseite; das ist der bewusste Preis gegenüber einer eigenen Datei je App (Variante B).
  - Die Unterseite zeigt das App-Symbol (`src/img/apps/`), Stand und, wenn vorhanden, einen Knopf zum Play Store.
- **Stand einer App** steht hinter ihrer Art: „App · Reisen · Beta“, „App · Gewohnheiten · Erhältlich“. Er hängt nicht an der Gestaltung der Station.
- **Name auf der Linie oder im Text.** Hängt an der Form der Szene, nicht am Stand: Hat die Linie ein freies Stück (Route), fährt der Name darauf mit. Füllt das Symbol die Linie (Waage, Umlaufbahn), steht der Name groß im Text daneben.
- **Kontakt.** Formular (Name, E-Mail, Nachricht) plus sichtbare Adresse `hello@juek3y.com`. Die Linie zeichnet sich unter das aktive Feld. Fehler stehen am Feld.

### Sprache, Farbe, Recht

- **Deutsch und Englisch.** Deutsch unter `/`, Englisch unter `/en`. Die Sprache folgt beim ersten Besuch dem Browser, die Wahl wird gemerkt. Schalter: zwei Buchstaben oben rechts.
- **Farbschema** folgt dem System, auch live. Ein einzelner Eintrag unten in der Fußzeile zeigt, was aktiv ist („Farbe: System“), ein Klick wechselt weiter zu Hell und Dunkel. Nicht in der Leiste oben. Drei sichtbare Optionen wurden probiert und als zu voll verworfen.
- **Rechtstexte** sind schlichte eigene Seiten nach der Stilvorlage, je App unter `/{app}/datenschutz` usw., Impressum zentral. Im Fuß jeder Seite verlinkt. Geist und Geist Mono liegen dafür schon unter `src/fonts/`.
- **Datenschutz:** Schriften selbst ausliefern, kein Tracking (die alte Seite lädt counter.dev, das entfällt). Das Formular braucht keine Einwilligung, aber einen Hinweis am Formular und einen Abschnitt in der Datenschutzerklärung. Mit Hoster und Mailversand je ein Vertrag zur Auftragsverarbeitung. Rechtstexte vor Veröffentlichung prüfen lassen.

### Ohne Animation

Aus denselben Inhalten entsteht immer eine schlichte, vollständige Seite. Sie ist, was Suchmaschinen, Screenreader, Geräte ohne WebGL und Nutzer mit „Bewegung reduzieren“ bekommen. Der Auftakt lässt sich durch Scrollen überspringen. Kein Ladebildschirm, kein gekapertes Scrollen.

## 5 · Erweitern, ohne umzubauen

Diese Regeln sind noch nicht alle mit JueK3y besprochen. Wo das so ist, steht **(Vorschlag)**.

### Inhalte sind Dateien

```
inhalt/apps/saldo.md            Name, Art, Text (de/en), Auftritt, Akzentfarbe, Zeichen, Fakten, Links
inhalt/apps/saldo/…             Bildschirmfotos
inhalt/serien/meer/serie.md     Name (de/en), Anordnung, Reihenfolge der Bilder, Bildtitel
inhalt/serien/meer/*.jpg        Originale; Größen entstehen beim Bauen
```

Jeder Eintrag hat `startseite: ja/nein` und `reihenfolge`. Stationen, Scroll-Länge, Kameraweg, Zähler („3 Apps“, „12 Bilder“) und die schlichte Seite entstehen daraus. Im Entwurf ist das mit zwei Listen am Anfang des Skripts schon so gelöst.

### Mehr als drei Apps, mehr Serien

- **Startseite:** höchstens 5 Apps und 4 Serien mit je 3 bis 6 Bildern (rund 20 Fotos). Grund: Länge des Scroll-Wegs und Speicher am Handy.
- **Alles Weitere:** Übersichtsseiten „Alle Apps“ und „Alle Serien“ als normale Seiten, unbegrenzt. Dazu je Serie eine eigene Seite (für Fotosessions mit Text). **(Vorschlag)**
- Am Ende jedes Kapitels führt ein Knopf zur Übersicht. **(Vorschlag)**
- Bilder der späteren Stationen werden erst geladen, wenn man sich ihnen nähert. **(Vorschlag)**

### Auftritte der Apps und die Logos

- **Regel:** Der Auftritt entsteht aus dem App-Symbol. 1000 Days zeigt, wie: Die Linie wird zur Form des Symbols, der Akzentpunkt sitzt dort, wo er im Symbol sitzt, dazu eine Bewegung, die zum Zweck der App passt.
- **Standard-Auftritt „Zeichen“ (Vorschlag):** Jede App liefert ihr Symbol als einen einzigen Linienzug (SVG-Pfad) und die Stelle des Akzentpunkts. Die Linie formt sich zu diesem Zeichen. Das braucht keine Programmierarbeit und gilt für jede neue App. Die App-Symbole (Liniengrafik mit einem Akzent) passen genau dazu.
- **Eigener Auftritt** nur für ausgewählte Apps, als abgeschlossener Baustein mit fester Schnittstelle: Form der Linie, Lage, was beim Ankommen passiert, was ein Klick tut.
- **Saldo und TravelFlow** haben seit 2026-11-18 eigene Auftritte nach ihren Symbolen (siehe Abschnitt 4).

### Anordnungen der Serien

Welle, Tunnel und Stapel sind wiederverwendbar. Ohne Angabe wechseln sie sich der Reihe nach ab **(Vorschlag)**. Hoch- und Querformat werden berücksichtigt.

### Pflege

Die Seite besteht aus fertigen Dateien. Inhalte ändern heißt Datei ändern und hochladen, Netlify baut und veröffentlicht wie heute. Bibliotheken auf feste Versionen setzen und ein- bis zweimal im Jahr aktualisieren. Aufmerksamkeit braucht nur die Formular-Funktion.

## 6 · Offen

1. **Saldo und TravelFlow:** Auftritte folgen jetzt den Symbolen. Saldo ist laut JueK3y „viel mehr als eine Waage“; was die App ausmacht, ist für Texte und Unterseite noch nicht besprochen. Der Play-Store-Link von TravelFlow (`com.juek3y.travelflow`) ist angenommen, nicht geprüft.
2. **Texte:** Alle Texte im Entwurf sind Platzhalter. Reisestopps und Geldbeträge sind erfunden. Serien-Namen und Bildtitel stammen nicht von JueK3y.
3. **Akzentfarben:** erledigt. TravelFlow `#FF6B00` (aus dem Symbol gemessen), Saldo `#8E82F0`, 1000 Days `#F76107`. TravelFlow und 1000 Days sind beide orange, Saldo steht dazwischen.
4. **Inhalt der Unterseiten** (Live-Demo von Saldo, Details zu TravelFlow, Fotosessions) und ihre Übergänge im Detail.
5. **Englische Texte** und der Sprachschalter: erledigt. Die englischen Texte sind Übersetzungen der Platzhalter und warten wie diese auf JueK3ys eigene Worte.
6. **Handy neigen** bewegt den Raum: gewünscht, im Entwurf nicht möglich gewesen, braucht auf iOS eine Erlaubnis.
7. **Formular:** erledigt als Netlify-Formular `kontakt` (Name, E-Mail, Nachricht), mit unsichtbarem Feld gegen Spam und ohne Google-Dienst. In Netlify müssen Formularerkennung und E-Mail-Benachrichtigung eingeschaltet sein.
8. **Bestehende Rechtstexte:** Saldo, 1000 Days, Impressum und Website-Datenschutz liegen in der Stilvorlage, je Sprache eine Seite, Datenschutzerklärungen im Aufbau mit 13 Abschnitten. Offen: fachliche Prüfung, Barrierefreiheitserklärungen.
9. **Fotos:** Der Entwurf nutzt 12 Bilder. Ein weiteres zeigt eine Person und bleibt bewusst draußen.
10. **Geprüft** wurde der Entwurf nur als Standbilder im Testbrowser (Desktop und Handybreite). Wie sich Bewegung und Touch anfühlen, hat JueK3y am eigenen Gerät beurteilt. Leistung auf schwachen Handys ist ungeprüft.

## 7 · Dem Bauenden überlassen

- **Technik.** Empfehlung: statische Seite mit Astro, Inhalte als Dateien, three.js und GSAP in aktueller Version über einen Bundler, Netlify wie bisher. Der Entwurf nutzt bewusst alte Fassungen aus dem Netz und ist nicht als Grundlage für den Code gedacht, nur für Aussehen und Verhalten.
- Aufteilung in Inhalt, Bausteine (ein Auftritt, eine Anordnung je Datei) und Kern (Scrollen, Linie, Linse, Übergang).
- Qualitätsstufen für schwächere Geräte.
- Umzug der bestehenden Adressen (`/en/coming-soon`, `/en/projects`) und der Netlify-Weiterleitungen.
- Der Übergang zu Unterseiten als echte Seitenwechsel (View Transitions, mit normalem Laden als Rückfall).

## 8 · Maße aus dem Entwurf

Als Ausgangspunkt, nicht als Vorschrift.

- Farben hell/dunkel: Grund `#F2F3F4` / `#0F0F10`, Text `#0F0F10` / `#F4F4F5`, Zweittext `#5A5D66` / `#8E9099`, Akzent `#1F4FFF` / `#7C96FF`.
- Schrift: Geist (Text, Namen), Geist Mono (kleine Zeilen, Zahlen), Instrument Serif kursiv (Titel der Foto-Welt). Kleinste Größe 12 px, am Handy 11 px für Beschriftungen an der Linie.
- Linie: 1,1 % der kürzeren Bildschirmseite, mindestens 4 px.
- Scroll-Weg im Entwurf: 11 Bildschirmhöhen für 3 Apps und 3 Serien.

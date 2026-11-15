# juek3y.com

Die Website von JueK3y: Apps, die ich baue, und Fotos, die ich mache. Dazu die Rechtstexte aller Apps.

[English version](README.en.md)

## Auf einen Blick

- Startseite als eine Bühne mit zwei Welten, Code und Fotografie, gebaut mit three.js und GSAP
- Deutsch unter `/`, Englisch unter `/en/`, Wechsel oben rechts
- Hell und Dunkel folgen dem Gerät, die Wahl lässt sich am Seitenende umstellen
- Keine Cookies, kein Tracking, nichts von fremden Servern
- Rechtstexte aller Apps in einer Vorlage, je Sprache eine eigene Seite
- Statische Dateien ohne Build-Schritt, ausgeliefert über Netlify

## Entstehung

Idee, Konzept und Tests: JueK3y. Umgesetzt mit KI-Unterstützung.

## Loslegen

Es gibt nichts zu installieren. Zum Ansehen reicht ein kleiner Webserver im Wurzelverzeichnis, der Adressen ohne `.html` versteht, zum Beispiel:

```
npx serve
```

Für die beiden Netlify-Funktionen (Ortssuche und Flugdaten der App TravelFlow) braucht es `netlify dev` und die Schlüssel als Umgebungsvariablen.

## Befehle

| Befehl | Wofür |
|---|---|
| `npm test` | prüft, ob deutsche und englische Texte der Startseite vollständig und gleich aufgebaut sind |

Veröffentlicht wird durch einen Push auf `v2`. Netlify übernimmt den Rest.

## Aufbau des Codes

```
index.html, en/index.html     Startseite, deutsch und englisch (nur Kopf und Gerüst)
404.html                      Fehlerseite
impressum.html                Impressum (englisch: legal-notice.html)
datenschutz.html              Datenschutz der Website (englisch: privacy.html)
travelflow/, saldo/, 1000days/  Rechtstexte je App
src/css/start.css             Aussehen der Startseite
src/js/einstellungen.js       gemerkte Sprache und Farbe, läuft vor dem ersten Bild
src/js/start/inhalt.js        welche Apps und Fotoserien es gibt
src/js/start/texte.de.js      alle Texte der Startseite, deutsch
src/js/start/texte.en.js      dieselben Texte, englisch
src/js/start/buehne.js        die Bühne: Bewegung, Welten, Übergänge
src/js/lib/                   three.js und GSAP, selbst ausgeliefert
src/fonts/, src/img/          Schriften und Bilder
netlify/functions/            Ortssuche und Flugdaten für TravelFlow
netlify.toml                  Kopfzeilen und Weiterleitungen
tools/texte-pruefen.mjs       Prüfung der Texte
docs/                         Entwurfsdokument der Website
```

### Eine App oder Fotoserie ergänzen

1. Eintrag in `src/js/start/inhalt.js`.
2. Texte unter derselben `id` in `texte.de.js` und `texte.en.js`.
3. Bei einer Serie die Bilder nach `src/img/start/` legen.
4. `npm test` ausführen.

### Sprache

Die Adresse entscheidet über die Sprache. Deutsche Seiten haben deutsche Adressen, englische haben englische:

| Seite | Deutsch | Englisch |
|---|---|---|
| Startseite | `/` | `/en/` |
| Impressum | `/impressum` | `/legal-notice` |
| Datenschutz der Website | `/datenschutz` | `/privacy` |
| Datenschutz einer App | `/{app}/datenschutz` | `/{app}/privacy` |
| Nutzungsbedingungen einer App | `/{app}/nutzungsbedingungen` | `/{app}/terms` |

Jede Seite verlinkt oben auf ihr Gegenstück. Nur die Startadresse `/` schaut beim Aufruf nach: Wer die Sprache einmal selbst gewählt hat, bekommt diese. Sonst gilt die Sprache des Geräts, alles außer Deutsch führt nach `/en/`.

### Kontaktformular

Das Formular am Ende der Startseite ist ein Netlify-Formular mit dem Namen `kontakt`. Netlify erkennt es beim Veröffentlichen im HTML beider Sprachfassungen, speichert jede Nachricht und schickt sie per E-Mail weiter. Dafür muss in Netlify die Formularerkennung eingeschaltet und eine E-Mail-Benachrichtigung für `kontakt` angelegt sein. Gegen Spam gibt es ein unsichtbares Feld (`website`) und Netlifys eigene Prüfung, kein Captcha. Lokal gibt es kein Netlify: Das Absenden endet dort mit der Fehlermeldung.

### Ein Rechtstext

Jede Seite ist eine eigene Datei ohne Skripte, mit dem Aussehen in der Datei selbst. Für einen neuen Text eine bestehende Seite derselben Art kopieren und füllen. Die deutsche Fassung ist maßgeblich, die englische sagt das in ihrem ersten Abschnitt.

## Konventionen

- Keine festen Texte im Programm: Alles Sichtbare der Startseite steht in den beiden Textdateien.
- Nichts von fremden Servern laden. `netlify.toml` erzwingt das mit einer Inhaltsrichtlinie.
- Rechtstexte ändern sich nur mit neuem Datum bei „Stand“ und einer kurzen Begründung im Commit.
- Hintergründe zum Entwurf: `docs/superpowers/specs/2026-11-15-website-neuentwurf-design.md`

## Rechtliches

Quelltext und alle Bilder sind urheberrechtlich geschützt (§ 2 UrhG). Jede Nutzung über den privaten Gebrauch hinaus braucht meine Zustimmung. Ausgenommen sind die mitgelieferten Fremdwerke mit eigener Lizenz: three.js und GSAP unter `src/js/lib/`, die Schriften Geist, Geist Mono und Instrument Serif unter `src/fonts/` (Lizenztexte liegen daneben).

[Impressum](https://juek3y.com/impressum) · [Datenschutz](https://juek3y.com/datenschutz)

© 2020–2026 Julian Kennedy (JueK3y)

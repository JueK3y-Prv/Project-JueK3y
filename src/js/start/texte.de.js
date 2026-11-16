/* Alle deutschen Texte der Startseite. Deutsch ist die Ausgangssprache.
   texte.en.js hat genau dieselben Schlüssel; `node tools/texte-pruefen.mjs` prüft das.
   {name}, {n}, {mode}, {mail} sind Platzhalter. Großbuchstaben setzt die Seite selbst, hier steht normale Schreibweise. */
export default {
  nav: { home: 'Zum Anfang', chapters: 'Kapitel', code: 'Code', photo: 'Fotografie', contact: 'Kontakt' },
  plain: { title: 'Code und Fotografie' },
  count: {
    apps: { one: '{n} App', other: '{n} Apps' },
    images: { one: '{n} Bild', other: '{n} Bilder' },
    series: { one: 'Fotoserie · {n} Bild', other: 'Fotoserie · {n} Bilder' }
  },
  scene: {
    route: { stops: ['Tag 1 · Abflug', 'Tag 2 · Stadt', 'Tag 4 · Küste', 'Tag 6 · Heim'] },
    balance: { note: 'Beispielzahlen' },
    orbit: { day: 'Tag {n}' }
  },
  detail: { open: '{name} ansehen', back: 'Zurück' },
  contact: { title: 'Schreib mir.' },
  form: {
    name: 'Name',
    email: 'E-Mail',
    emailError: 'Gib bitte eine gültige E-Mail-Adresse an.',
    message: 'Nachricht',
    error: 'Schreib bitte kurz, worum es geht.',
    send: 'Nachricht senden',
    note: 'Deine Angaben nutze ich nur, um dir zu antworten.',
    done: 'Danke, deine Nachricht ist angekommen.',
    doneHint: 'Ich melde mich per E-Mail bei dir.',
    failed: 'Das Senden hat nicht geklappt. Versuch es noch einmal oder schreib an {mail}.'
  },
  quick: { github: 'GitHub', instagram: 'Instagram', coffee: 'Kaffee ausgeben' },
  theme: {
    button: 'Farbe: {mode}',
    label: 'Farbschema, aktiv: {mode}. Antippen wechselt.',
    system: 'System', light: 'Hell', dark: 'Dunkel'
  },
  legal: {
    imprint: { label: 'Impressum', path: '/impressum' },
    site: { label: 'Datenschutz', path: '/datenschutz' },
    privacy: { label: 'Datenschutz', slug: 'datenschutz' },
    terms: { label: 'Nutzungsbedingungen', slug: 'nutzungsbedingungen' }
  },
  apps: {
    travelflow: { kind: 'App · Reisen', desc: 'Dein Begleiter für Reiseplanung und Durchführung.',
      facts: ['Reiseplan als Zeitleiste', 'Ortssuche und Flüge eingebaut', 'Für das Telefon gebaut'] },
    saldo: { kind: 'App · Finanzen', desc: 'Die eigenen Finanzen, auf dem eigenen Server.',
      facts: ['Läuft auf dem eigenen Server', 'Bankabruf nur lesend', 'Anmeldung mit Passkey'] },
    '1000days': { kind: 'App · Gewohnheiten', desc: 'Aus Gewohnheiten wird dein eigenes Universum.',
      facts: ['Jede Gewohnheit baut am eigenen Universum mit', 'Beta im Play Store'] }
  },
  serien: {
    meer: { name: 'Meer', shots: { surf: 'Brandung', cliff: 'Steilküste', jelly: 'Quallen', palm: 'Abendlicht' } },
    wueste: { name: 'Wüste', shots: { desert: 'Roter Fels', road: 'Leere Straße', ram: 'Dickhornschaf', cactus: 'Kakteen' } },
    unterwegs: { name: 'Unterwegs', shots: { lantern: 'Laternen', shrine: 'Schrein', neon: 'Neon', window: 'Fensterplatz' } }
  }
};

/* Inhalt der Startseite: Welche Apps und Fotoserien es gibt und wie sie auftreten.
   Die Wörter dazu stehen in texte.de.js und texte.en.js unter derselben id.

   Neue App:        Eintrag hier + Texte unter apps.<id> in beiden Sprachdateien.
   Neue Fotoserie:  Bilder nach /src/img/start/, Eintrag hier + Texte unter serien.<id> in beiden Sprachdateien.

   id     = Schlüssel für die Texte; bei Apps zugleich die Adresse der Unterseite (/saldo, /en/saldo) und der Ordner der Rechtstexte (/saldo/datenschutz).
            Neue App: die Adresse auch in netlify.toml eintragen (Abschnitt „Unterseiten der Apps“).
   scene  = wie eine App auftritt:        'route' (Karte mit Route) | 'balance' (Waage) | 'orbit' (Umlaufbahn)
   accent = Akzentfarbe aus dem App-Symbol; der Akzentpunkt nimmt sie an der Station an
   icon   = App-Symbol als Datei, steht auf der Unterseite
   status = Stand der App:                'beta' | 'live'; ohne Angabe steht nichts dazu
   store  = Adresse im Play Store, wird zum Knopf auf der Unterseite
   layout = wie eine Serie gehängt wird:  'wave' | 'tunnel' | 'stack'
   legal  = welche Rechtstexte es gibt:   'privacy', 'terms'
   shots  = [Dateiname ohne .jpg, Breite / Höhe]                                            */

export const MAIL = 'hello@juek3y.com';

// Verweise nach außen, stehen am Seitenende über Impressum und Datenschutz. Beschriftung: quick.<id> in den Textdateien.
export const LINKS = [
  { id: 'github', href: 'https://github.com/JueK3y-Prv' },
  { id: 'instagram', href: 'https://www.instagram.com/juek3y' },
  { id: 'coffee', href: 'https://buymeacoffee.com/juek3y' }
];

export const APPS = [
  { id: 'travelflow', name: 'TravelFlow', scene: 'route', accent: '#FF6B00', icon: '/src/img/apps/travelflow.svg', legal: ['privacy', 'terms'],
    status: 'beta', store: 'https://play.google.com/store/apps/details?id=com.juek3y.travelflow' },
  { id: 'saldo', name: 'Saldo', scene: 'balance', accent: '#8E82F0', icon: '/src/img/apps/saldo.svg', legal: ['privacy', 'terms'] },
  { id: '1000days', name: '1000 Days', scene: 'orbit', accent: '#F76107', icon: '/src/img/apps/1000days.svg', legal: ['privacy'],
    status: 'live', store: 'https://play.google.com/store/apps/details?id=com.juek3y.days1000' }
];

export const SERIEN = [
  { id: 'meer', layout: 'wave', shots: [['surf', .75], ['cliff', .75], ['jelly', .75], ['palm', .8]] },
  { id: 'wueste', layout: 'tunnel', shots: [['desert', .75], ['road', .75], ['ram', .75], ['cactus', 1.5]] },
  { id: 'unterwegs', layout: 'stack', shots: [['lantern', .667], ['shrine', 1.5], ['neon', .75], ['window', .75]] }
];

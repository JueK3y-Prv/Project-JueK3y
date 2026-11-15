/* Inhalt der Startseite: Welche Apps und Fotoserien es gibt und wie sie auftreten.
   Die Wörter dazu stehen in texte.de.js und texte.en.js unter derselben id.

   Neue App:        Eintrag hier + Texte unter apps.<id> in beiden Sprachdateien.
   Neue Fotoserie:  Bilder nach /src/img/start/, Eintrag hier + Texte unter serien.<id> in beiden Sprachdateien.

   id     = Schlüssel für die Texte; bei Apps zugleich der Ordner der Rechtstexte (/saldo/datenschutz)
   scene  = wie eine App auftritt:        'route' | 'balance' | 'orbit'
   layout = wie eine Serie gehängt wird:  'wave' | 'tunnel' | 'stack'
   legal  = welche Rechtstexte es gibt:   'privacy', 'terms'
   shots  = [Dateiname ohne .jpg, Breite / Höhe]                                            */

export const MAIL = 'hello@juek3y.com';

export const APPS = [
  { id: 'travelflow', name: 'TravelFlow', scene: 'route', legal: ['privacy', 'terms'] },
  { id: 'saldo', name: 'Saldo', scene: 'balance', legal: ['privacy', 'terms'] },
  { id: '1000days', name: '1000 Days', scene: 'orbit', accent: '#F76107', legal: ['privacy'],
    icon: '<svg viewBox="0 0 96 96" aria-hidden="true"><rect width="96" height="96" rx="22" fill="#0F0F10"/><ellipse cx="48" cy="48" rx="30" ry="14" transform="rotate(-52 48 48)" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="46" cy="50" r="7" fill="#fff"/><circle cx="66" cy="23" r="5" fill="#F76107"/></svg>' }
];

export const SERIEN = [
  { id: 'meer', layout: 'wave', shots: [['surf', .75], ['cliff', .75], ['jelly', .75], ['palm', .8]] },
  { id: 'wueste', layout: 'tunnel', shots: [['desert', .75], ['road', .75], ['ram', .75], ['cactus', 1.5]] },
  { id: 'unterwegs', layout: 'stack', shots: [['lantern', .667], ['shrine', 1.5], ['neon', .75], ['window', .75]] }
];

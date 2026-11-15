/* Läuft vor dem ersten Bild: gemerktes Farbschema setzen und die Sprache der Startadresse bestimmen.

   Sprache: Die Adresse entscheidet. Deutsche Seiten liegen unter deutschen Adressen (/, /impressum),
   englische unter englischen (/en/, /legal-notice). Nur die Startadresse "/" schaut nach:
   1. Hat jemand die Sprache selbst gewählt, gilt diese Wahl.
   2. Sonst gilt die Sprache des Geräts: Deutsch bleibt hier, alles andere geht nach /en/.
   Suchmaschinen bleiben auf der deutschen Seite, die englische finden sie über hreflang. */
(function () {
  var root = document.documentElement;
  var read = function (key) { try { return localStorage.getItem(key); } catch (e) { return null; } };

  var theme = read('juek3y.theme');
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);

  if (root.lang === 'de' && location.pathname === '/') {
    var chosen = read('juek3y.lang');
    var device = String((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
    var crawler = /bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent);
    var lang = chosen === 'de' || chosen === 'en' ? chosen : crawler ? 'de' : device;
    if (lang === 'en') location.replace('/en/' + location.search + location.hash);
  }

  // Die Fehlerseite hat keine Sprache in der Adresse. Sie zeigt beide, bis hier eine gewählt ist:
  // englische Adresse, sonst die eigene Wahl, sonst die Sprache des Geräts.
  if (root.hasAttribute('data-sprache-offen')) {
    var mine = read('juek3y.lang');
    var english = /^\/(en\/|legal-notice|privacy|[^/]+\/(privacy|terms|accessibility))/.test(location.pathname);
    var pick = english ? 'en' : mine === 'de' || mine === 'en' ? mine : String(navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
    root.lang = pick; root.setAttribute('data-lang', pick);
  }
})();

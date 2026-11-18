/* Prüft die Texte der Startseite: Beide Sprachen haben dieselben Schlüssel und Platzhalter, nichts ist leer,
   jeder Text, den Seite und Inhalt verlangen, ist vorhanden.   Aufruf: node tools/texte-pruefen.mjs */
import { readFileSync } from 'node:fs';
import de from '../src/js/start/texte.de.js';
import en from '../src/js/start/texte.en.js';
import { APPS, SERIEN } from '../src/js/start/inhalt.js';

const errors = [];
const flat = (o, pre = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, pre + k + '.', out);
    else out[pre + k] = v;
  }
  return out;
};
const holes = v => (String(v).match(/\{\w+\}/g) || []).sort().join(' ');
const D = flat(de), E = flat(en);

for (const k of new Set([...Object.keys(D), ...Object.keys(E)])) {
  if (!(k in D)) { errors.push(`fehlt in texte.de.js: ${k}`); continue; }
  if (!(k in E)) { errors.push(`fehlt in texte.en.js: ${k}`); continue; }
  for (const [name, v] of [['de', D[k]], ['en', E[k]]]) {
    const parts = Array.isArray(v) ? v : [v];
    if (!parts.length || parts.some(x => typeof x !== 'string' || !x.trim())) errors.push(`leer in texte.${name}.js: ${k}`);
  }
  if (Array.isArray(D[k]) !== Array.isArray(E[k]) || (Array.isArray(D[k]) && D[k].length !== E[k].length && !k.endsWith('.facts'))) errors.push(`ungleiche Länge: ${k}`);
  if (holes(D[k]) !== holes(E[k])) errors.push(`ungleiche Platzhalter: ${k}`);
}

// was der Inhalt verlangt
for (const a of APPS) for (const f of ['kind', 'desc', 'facts']) if (!(`apps.${a.id}.${f}` in D)) errors.push(`Text fehlt: apps.${a.id}.${f}`);
for (const s of SERIEN) {
  if (!(`serien.${s.id}.name` in D)) errors.push(`Text fehlt: serien.${s.id}.name`);
  for (const [file] of s.shots) if (!(`serien.${s.id}.shots.${file}` in D)) errors.push(`Text fehlt: serien.${s.id}.shots.${file}`);
}

// jede App hat ihre Adresse (/saldo, /en/saldo); Netlify muss sie auf die Startseite leiten
const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
for (const a of APPS) for (const pre of ['', '/en']) if (!toml.includes(`from = "${pre}/${a.id}"`)) errors.push(`Adresse fehlt in netlify.toml: ${pre}/${a.id}`);
for (const a of APPS) if (a.status && !(`status.${a.status}` in D)) errors.push(`Text fehlt: status.${a.status}`);

// was Seite und Programm verlangen
const root = new URL('..', import.meta.url);
const used = new Set();
for (const f of ['index.html', 'en/index.html']) for (const m of readFileSync(new URL(f, root), 'utf8').matchAll(/data-t(?:-label)?="([\w.]+)"/g)) used.add(m[1]);
for (const m of readFileSync(new URL('src/js/start/buehne.js', root), 'utf8').matchAll(/\b(?:txt|plural)\('([\w.]+)'/g)) used.add(m[1].replace(/\.$/, ''));
for (const k of used) if (!(k in D) && !Object.keys(D).some(x => x.startsWith(k + '.'))) errors.push(`verwendet, aber nicht vorhanden: ${k}`);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Texte in Ordnung: ${Object.keys(D).length} Schlüssel in beiden Sprachen, ${used.size} davon fest verwendet.`);

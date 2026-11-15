# juek3y.com

The website of JueK3y: apps I build and photos I take. It also holds the legal texts of all apps.

[Deutsche Fassung](README.md)

## At a glance

- Home page as one stage with two worlds, code and photography, built with three.js and GSAP
- German at `/`, English at `/en/`, switch at the top right
- Light and dark follow the device; the choice can be changed at the end of the page
- No cookies, no tracking, nothing loaded from other servers
- Legal texts of all apps in one template, one page per language
- Static files without a build step, served by Netlify

## How it was made

Idea, concept and testing: JueK3y. Implemented with AI support.

## Getting started

There is nothing to install. To look at the site, start a small web server in the root folder that understands addresses without `.html`, for example:

```
npx serve
```

The two Netlify functions (place search and flight data for the TravelFlow app) need `netlify dev` and their keys as environment variables.

## Commands

| Command | What for |
|---|---|
| `npm test` | checks that the German and English texts of the home page are complete and built the same way |

A push to `v2` publishes the site. Netlify does the rest.

## Code layout

```
index.html, en/index.html     home page, German and English (head and skeleton only)
404.html                      error page
impressum.html                legal notice (English: legal-notice.html)
datenschutz.html              website privacy policy (English: privacy.html)
travelflow/, saldo/, 1000days/  legal texts per app
src/css/start.css             look of the home page
src/js/einstellungen.js       remembered language and color, runs before the first paint
src/js/start/inhalt.js        which apps and photo series exist
src/js/start/texte.de.js      all texts of the home page, German
src/js/start/texte.en.js      the same texts, English
src/js/start/buehne.js        the stage: motion, worlds, transitions
src/js/lib/                   three.js and GSAP, self-hosted
src/fonts/, src/img/          fonts and images
netlify/functions/            place search and flight data for TravelFlow
netlify.toml                  headers and redirects
tools/texte-pruefen.mjs       text check
docs/                         design document of the website
```

### Adding an app or a photo series

1. Add an entry to `src/js/start/inhalt.js`.
2. Add the texts under the same `id` to `texte.de.js` and `texte.en.js`.
3. For a series, put the images into `src/img/start/`.
4. Run `npm test`.

### Language

The address decides the language. German pages have German addresses, English pages have English ones:

| Page | German | English |
|---|---|---|
| Home page | `/` | `/en/` |
| Legal notice | `/impressum` | `/legal-notice` |
| Website privacy policy | `/datenschutz` | `/privacy` |
| Privacy policy of an app | `/{app}/datenschutz` | `/{app}/privacy` |
| Terms of use of an app | `/{app}/nutzungsbedingungen` | `/{app}/terms` |

Every page links to its counterpart at the top. Only the start address `/` looks further: whoever has chosen a language gets that one. Otherwise the language of the device applies, and everything except German leads to `/en/`.

### Contact form

The form at the end of the home page is a Netlify form named `kontakt`. Netlify detects it in the HTML of both language versions when the site is published, stores every message and forwards it by email. This requires form detection to be switched on in Netlify and an email notification for `kontakt`. Against spam there is an invisible field (`website`) and Netlify’s own check, no captcha. There is no Netlify locally: submitting ends with the error message there.

### A legal text

Every page is a file of its own without scripts, with its look inside the file. For a new text, copy an existing page of the same kind and fill it in. The German version is the authoritative one; the English version says so in its first section.

## Conventions

- No fixed texts in the code: everything visible on the home page lives in the two text files.
- Load nothing from other servers. `netlify.toml` enforces this with a content security policy.
- Legal texts only change with a new “last updated” date and a short reason in the commit.
- Background on the design (German): `docs/superpowers/specs/2026-11-15-website-neuentwurf-design.md`

## Legal

Source code and all images are protected by copyright (§ 2 UrhG, German copyright law). Any use beyond private use requires my permission. This does not apply to the bundled third-party works with their own licenses: three.js and GSAP in `src/js/lib/`, the fonts Geist, Geist Mono and Instrument Serif in `src/fonts/` (license texts are next to them).

[Legal notice](https://juek3y.com/legal-notice) · [Privacy](https://juek3y.com/privacy)

© 2020–2026 Julian Kennedy (JueK3y)

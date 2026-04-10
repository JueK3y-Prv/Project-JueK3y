# AGENTS.md

## Cursor Cloud specific instructions

### Overview
This is **Project JueK3y** — a static portfolio website (HTML/SCSS/JS) deployed to Netlify. There is no backend, database, build pipeline, or package manager (`package.json` does not exist). All compiled CSS is already checked into the repo.

### Dev Server
Run a static HTTP server from the workspace root to serve the site locally:
```
serve -l 3000 /workspace
```
The main entry point is `/en/coming-soon.htm`. Other pages: `/en/projects.htm`, `/en/social-media.htm`, `/en/page-not-found.htm`, `/impressum.html`.

### SCSS Compilation
Dart Sass (`sass`) is installed globally. All `.scss` files are in `src/stylesheet/*/`. Pre-compiled `.css` and `.min.css` are checked in, so SCSS compilation is only needed when editing stylesheets. Example:
```
sass src/stylesheet/coso/coso-index.scss src/stylesheet/coso/coso-index.css
```

### Lint / Test / Build
- **No linter, test framework, or build system exists** in this repo. There are no `package.json` scripts, no CI build steps, and no test suites.
- The only CI is a GitHub Actions CodeQL security scan (`.github/workflows/`).
- To validate SCSS, compile all `.scss` files with `sass` and check for errors.
- To validate HTML/JS, serve the site and verify pages load correctly in a browser.

### CDN Dependencies
JavaScript libraries (jQuery, anime.js, Three.js, GSAP) load from `cdnjs.cloudflare.com`. Pages will partially function without internet but interactive features (animations, 3D effects, hover effects) will break.

### Gotchas
- HTML files use both `.htm` and `.html` extensions — the English pages use `.htm`, root-level pages use `.html`.
- All asset paths in HTML are absolute (e.g., `/src/js/...`, `/src/img/...`), so the dev server must be started from the workspace root.

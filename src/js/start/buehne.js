/* Die Bühne der Startseite: eine feste Fläche, zwei Welten (Code und Fotografie), ein Übergang.
   Inhalt steht in inhalt.js, alle Wörter in texte.de.js und texte.en.js. Hier steht nur, wie es sich bewegt.
   Braucht gsap und THREE (src/js/lib), die vor dieser Datei geladen werden. */
import { APPS as APP_LIST, SERIEN, MAIL, LINKS } from './inhalt.js';
import de from './texte.de.js';
import en from './texte.en.js';

const LANG = document.documentElement.lang === 'en' ? 'en' : 'de';   // the address decides the language, see src/js/einstellungen.js
const TX = LANG === 'en' ? en : de;
const REGION = navigator.language || LANG;                            // words follow the language, number formats follow the region of the device

(() => {
  // texts: txt(key) reads the language file of this page, {platzhalter} are filled in; plural picks the form the language asks for
  const txt = (key, vars) => { const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), TX); if (v == null) return key;
    return vars && typeof v === 'string' ? v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : v; };
  const RULES = new Intl.PluralRules(LANG);
  const plural = (key, n) => { const f = txt(key); return (f[RULES.select(n)] || f.other).replace('{n}', n); };
  const caps = s => String(s).toLocaleUpperCase(LANG);
  // content: structure from inhalt.js, words from the language file, joined into what the stage works with
  const APPS = APP_LIST.map(a => Object.assign({}, a, TX.apps[a.id], { legal: (a.legal || []).map(k => [txt('legal.' + k + '.label'), '/' + a.id + '/' + txt('legal.' + k + '.slug')]) }));
  // the stand of an app (beta, available) goes after its kind: "App · Reisen · Beta"
  APPS.forEach(a => { a.line = a.status ? a.kind + ' · ' + txt('status.' + a.status) : a.kind; a.storeLabel = a.store ? txt('store.' + (a.status || 'live')) : ''; });
  // every app has its own address (/1000days, /en/1000days); netlify.toml hands it this page, which then opens the app
  const BASE = LANG === 'en' ? '/en/' : '/';
  const appAt = () => { const m = location.pathname.match(/^(?:\/en)?\/([^/]+)\/?$/); return m ? APPS.findIndex(a => a.id === m[1]) : -1; };
  const SERIES = SERIEN.map(s => ({ layout: s.layout, name: TX.serien[s.id].name, shots: s.shots.map(x => [TX.serien[s.id].shots[x[0]], x[0], x[1]]) }));
  const NSHOTS = SERIES.reduce((n, s) => n + s.shots.length, 0);

  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement, canvas = $('#gl');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const back = t => { const c = 1.9; t = clamp(t, 0, 1) - 1; return 1 + (c + 1) * t * t * t + c * t * t; };

  // words of the fixed parts of the page
  $$('[data-t]').forEach(el => { el.textContent = txt(el.dataset.t); });
  $$('[data-t-label]').forEach(el => { el.setAttribute('aria-label', txt(el.dataset.tLabel)); });
  $('#send').innerHTML = `${txt('form.send')} <span aria-hidden="true">↗</span>`;
  const MAIL_LINK = `<a href="mailto:${MAIL}">${MAIL}</a>`;
  $('#note').textContent = txt('form.note');
  $('#done').innerHTML = `${txt('form.done')}<small>${txt('form.doneHint')}</small>`;
  $('#e-send').innerHTML = txt('form.failed', { mail: MAIL_LINK });
  const SITE_LEGAL = ['imprint', 'site'].map(k => `<a href="${txt('legal.' + k + '.path')}">${txt('legal.' + k + '.label')}</a>`);
  $('#legal-links').innerHTML = SITE_LEGAL.join(' · ');
  const QUICK = LINKS.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${txt('quick.' + l.id)}</a>`);
  $('#quick').innerHTML = QUICK.join(' · ');
  // the plain document is generated from the same lists: it is what readers, reduced motion and browsers without WebGL get
  const other = $('#lang');
  $('#plain').innerHTML = `<h1>JueK3y<i class="pt">.</i> ${txt('plain.title')}</h1><section><h2>${txt('nav.code')}</h2><ul>${APPS.map(a => `<li id="${a.id}"><b>${a.name}</b>${a.desc}${a.status ? ' · ' + txt('status.' + a.status) : ''}${a.store ? ` · <a href="${a.store}" target="_blank" rel="noopener">${a.storeLabel}</a>` : ''}</li>`).join('')}</ul></section>` +
    SERIES.map(s => `<section><h2>${s.name}</h2><div class="shots">${s.shots.map(x => `<img src="/src/img/start/${x[1]}.jpg" alt="${x[0]}" loading="lazy">`).join('')}</div></section>`).join('') +
    `<section id="kontakt"><h2>${txt('nav.contact')}</h2><div id="plain-form"></div><p class="mail">${MAIL}</p><p class="legal-plain">${QUICK.join('')}</p></section>` +
    `<footer>${SITE_LEGAL.join('')}<a href="${other.getAttribute('href')}" hreflang="${other.hreflang}" lang="${other.lang}" data-lang="${other.dataset.lang}">${other.getAttribute('aria-label')}</a></footer>`;
  // a language chosen by hand is remembered; the start address follows it from then on (src/js/einstellungen.js)
  $$('[data-lang]').forEach(a => a.addEventListener('click', () => { try { localStorage.setItem('juek3y.lang', a.dataset.lang); } catch (e) { /* private mode: the link still works */ } }));
  const form = $('#form');
  // the contact form is a Netlify form: the page posts it to its own site, Netlify stores the message and mails it on
  const check = (field, note, bad) => { note.hidden = !bad; field.setAttribute('aria-invalid', String(bad)); return bad; };
  [['#f-mail', '#e-mail'], ['#f-msg', '#e-msg']].forEach(([f, n]) => $(f).addEventListener('input', () => { $(n).hidden = true; $(f).removeAttribute('aria-invalid'); }));   // a hint goes as soon as the field is touched again
  form.addEventListener('submit', async e => { e.preventDefault();
    const mail = $('#f-mail'), msg = $('#f-msg'), send = $('#send'), failed = $('#e-send');
    const badMail = check(mail, $('#e-mail'), !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())), badMsg = check(msg, $('#e-msg'), msg.value.trim().length < 3);
    if (badMail) return mail.focus(); if (badMsg) return msg.focus();
    failed.hidden = true; send.disabled = true; form.classList.add('busy');
    try { const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!r.ok) throw new Error('status ' + r.status);
      form.classList.add('sent'); $('#done').hidden = false; $('#done').focus();
    } catch (err) { failed.hidden = false; }
    send.disabled = false; form.classList.remove('busy'); });
  // without the stage the form sits in the plain document, under "Kontakt"
  const plainForm = () => { $('#plain-form').append(form); const i = appAt(); if (i >= 0) { const el = document.getElementById(APPS[i].id); if (el) el.scrollIntoView(); } };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof THREE === 'undefined' || typeof gsap === 'undefined') return plainForm();
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { return plainForm(); }
  root.classList.add('fx');

  // the page of an app: built from the same lists as everything else
  const detail = $('#detail'), din = $('#d-in'), openBtn = $('#open'), openL = $('#open-l'), langA = $('#lang'), canon = $('link[rel=canonical]'), descM = $('meta[name=description]');
  const HOME = { title: document.title, lang: langA.getAttribute('href'), canon: canon ? canon.href : '', desc: descM ? descM.content : '' };
  const fill = a => { din.innerHTML = `<div class="d-bar"><button class="back" id="back">← ${txt('detail.back')}</button><span class="mono">${a.line}</span></div>`
    + `<header class="d-head">${a.icon ? `<img src="${a.icon}" alt="" width="112" height="112">` : ''}<h2>${a.name}</h2></header><p class="d-lead">${a.desc}</p>`
    + `<ul class="d-facts">${a.facts.map(f => `<li>${f}</li>`).join('')}</ul>`
    + (a.store ? `<div class="d-act"><a class="pillbtn" href="${a.store}" target="_blank" rel="noopener">${a.storeLabel} <span aria-hidden="true">↗</span></a></div>` : '')
    + `<p class="d-legal mono">${a.legal.concat([[txt('legal.imprint.label'), txt('legal.imprint.path')]]).map(l => `<a href="${l[1]}">${l[0]}</a>`).join(' · ')}</p>`; };
  // title, language switch, canonical address and description follow the open page
  const markPage = i => { const a = APPS[i]; document.title = a ? `${a.name} · JueK3y` : HOME.title; langA.setAttribute('href', a ? HOME.lang + a.id : HOME.lang);
    if (canon) canon.href = a ? location.origin + BASE + a.id : HOME.canon; if (descM) descM.content = a ? a.desc : HOME.desc; };
  const showDetail = i => { fill(APPS[i]); markPage(i); detail.classList.add('on'); detail.scrollTop = 0; detail.setAttribute('aria-hidden', 'false'); root.style.overflow = 'hidden'; };
  // straight to an app's address: its page is there at once, the stage gets ready behind it
  const early = appAt();
  if (early >= 0) { showDetail(early); detail.style.clipPath = 'none'; }

  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  const F = { sans: "'Geist',system-ui,sans-serif", mono: "'Geist Mono',ui-monospace,monospace", serif: "'Instrument Serif',Georgia,serif" };
  let W = innerWidth, H = innerHeight;
  if (!FINE) $('#ring').style.display = 'none';

  const VARS = { bg: '--bg', ink: '--ink', muted: '--muted', accent: '--accent', pbg: '--p-bg', pink: '--p-ink', pmuted: '--p-muted' };
  const COL = {}; Object.keys(VARS).forEach(k => { COL[k] = new THREE.Color(); });
  const readTheme = () => { const cs = getComputedStyle(root); Object.keys(VARS).forEach(k => COL[k].set(cs.getPropertyValue(VARS[k]).trim() || '#888')); };
  readTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTimeout(readTheme, 0));
  new MutationObserver(readTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  /* text as textures (white, tinted by the material) so lens and portal can bend it */
  // side -1: text shows only below the line (it is rubbed out as it scrolls up into it); side +1: only above it (letters sink into or rise out of the line)
  const EV = { uEnv: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uH: { value: 1 }, uThick: { value: 6 }, uLevel: { value: 2 } };
  const eraseMat = (tex, tint, side) => new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false,
    uniforms: { map: { value: tex }, uCol: { value: COL[tint || 'ink'] }, uOp: { value: 1 }, uSide: { value: side }, uEnv: EV.uEnv, uRes: EV.uRes, uH: EV.uH, uThick: EV.uThick, uLevel: EV.uLevel },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform sampler2D map,uEnv; uniform vec3 uCol; uniform float uOp,uSide,uH,uThick,uLevel; uniform vec2 uRes; varying vec2 vUv;
      float h(float i){ vec4 a=texture2D(uEnv,vec2((i+0.5)/256.0,0.5)); return a.b<0.5 ? -1.0 : (a.r*255.0*256.0+a.g*255.0)/65535.0; }
      void main(){ float al=texture2D(map,vUv).a*uOp; vec2 sc=gl_FragCoord.xy/uRes; float f=clamp(sc.x*256.0-0.5,0.0,255.0), i=floor(f), a=h(i), b=h(min(i+1.0,255.0));
        if(uSide<-1.5){ al*=1.0-smoothstep(-4.0,-1.0,(sc.y-uLevel)*uH); } else if(a>=0.0&&b>=0.0){ float d=(sc.y-mix(a,b,f-i))*uH, e=uThick*0.5;
          al*= uSide<0.0 ? 1.0-smoothstep(-e-2.5,-e-0.5,d) : smoothstep(e+0.5,e+2.5,d); }
        gl_FragColor=vec4(uCol,al); }` });
  const basic = tint => { const m = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false }); m.color = COL[tint || 'ink']; return m; };
  const textMesh = (str, o) => {
    const s = 2, px = o.px, c = document.createElement('canvas'), x = c.getContext('2d');
    const font = `${o.italic ? 'italic ' : ''}${o.weight || 400} ${px * s}px ${o.family}`;
    const prep = () => { x.font = font; if (o.ls && 'letterSpacing' in x) x.letterSpacing = (o.ls * px * s) + 'px'; };
    const draw = t => { prep(); x.clearRect(0, 0, c.width, c.height); x.fillStyle = '#fff'; x.textBaseline = 'alphabetic'; x.fillText(t, pad, c.height * .72); tex.needsUpdate = true; };
    prep(); const pad = px * s * .16; c.width = Math.ceil(x.measureText(o.widest || str).width + pad * 2); c.height = Math.ceil(px * s * 1.5);
    const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4; let mat; if (o.side) mat = eraseMat(tex, o.tint, o.side); else { mat = basic(o.tint); mat.map = tex; }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    m.userData = { w: c.width / s, h: c.height / s, px, pad: pad / s, o: 1, str };
    m.set = t => { if (t !== m.userData.str) { m.userData.str = t; draw(t); } };       // for counters
    draw(str); return m;
  };
  const glyphRun = (str, o) => { const c = document.createElement('canvas').getContext('2d'); c.font = `${o.weight || 400} ${o.px}px ${o.family}`; let x = 0;
    const list = [...str].map(ch => { const adv = c.measureText(ch).width + (o.ls || 0) * o.px, g = { x: x + adv / 2, r: x + adv, m: ch.trim() ? textMesh(ch, Object.assign({}, o, { ls: 0 })) : null }; x += adv; return g; });
    return { list, w: x, px: o.px }; };
  const place = (m, x, y, size, align) => { const k = size / m.userData.px, w = m.userData.w * k; m.scale.set(w, m.userData.h * k, 1); m.position.set(align === 'l' ? x + w / 2 - m.userData.pad * k : align === 'r' ? x - w / 2 + m.userData.pad * k : x, y, 0); return w - m.userData.pad * k * 2; };
  const fitW = (m, w, x, y, z) => { m.scale.set(w, w * m.userData.h / m.userData.w, 1); m.position.set(x, y, z); return m.scale.y; };
  const op = (m, a) => { const v = a * (m.userData.o == null ? 1 : m.userData.o); m.material.opacity = v; if (m.material.uniforms && m.material.uniforms.uOp) m.material.uniforms.uOp.value = v; m.visible = v > .004; };
  const fade = (g, a) => g.traverse(n => { if (n.material) op(n, a); });

  const boot = () => {
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false);
    const envData = new Uint8Array(256 * 4), envY = new Float32Array(256), envTex = new THREE.DataTexture(envData, 256, 1, THREE.RGBAFormat); envTex.minFilter = envTex.magFilter = THREE.NearestFilter; EV.uEnv.value = envTex;
    const sizeEnv = () => { EV.uRes.value.set(W * DPR, H * DPR); EV.uH.value = H; }; sizeEnv();
    const RT = renderer.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget ? THREE.WebGLMultisampleRenderTarget : THREE.WebGLRenderTarget;
    const mkRT = () => { const r = new RT(W * DPR, H * DPR, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true }); if ('samples' in r) r.samples = 4; return r; };
    let rtC = mkRT(), rtP = mkRT();
    const ptr = { x: W / 2, y: H / 2, sx: W / 2, sy: H / 2, lx: W / 2, ly: H / 2, inside: false, moved: false, last: -1e9 };
    let skip = false, pT = 0, pS = 0, vel = 0, hover = -1, mixNow = 0, uc = 0, up = 0, wide = W >= 760;

    /* ---- the path: chapter Code (p 0 to .44), one crossing (.465 to .545), chapter Fotografie (.55 to 1).
            Each world keeps its own timeline u in [0,1]: start, one station per entry, contact. The lens shows the sibling station. ---- */
    const X0 = .465, X1 = .545, X2 = .905, X3 = .965, STEP = 1 / (APPS.length + 1), ULAST = 1 - STEP;
    const mixAt = p => sstep(X0, X1, p) - sstep(X2, X3, p);
    const ucAt = p => Math.min(ULAST, p / .44 * ULAST), upAt = p => clamp((p - .55) / .35, 0, 1) * (ULAST + STEP * .5);     // Fotografie ends with its last series, it has no contact of its own
    const P_OF = { c: 0, p: .55, e: 1 };

    /* =================== world C · Code =================== */
    const sC = new THREE.Scene(), camC = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -10, 10);
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
      transparent: true, depthTest: false,
      uniforms: { uOff: { value: new THREE.Vector2() }, uRes: { value: new THREE.Vector2(W, H) }, uM: { value: new THREE.Vector2(-9999, -9999) }, uCol: { value: COL.ink } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `uniform vec2 uOff,uRes,uM; uniform vec3 uCol; varying vec2 vUv;
        void main(){ vec2 p=vUv*uRes; vec2 g=mod(p+uOff,40.0)-20.0; float near=1.0-smoothstep(0.0,260.0,distance(p,uM));
          float r=1.1+near*1.9; float a=smoothstep(r+0.8,r-0.2,length(g))*(0.14+near*0.5); gl_FragColor=vec4(uCol,a); }`
    }));
    sC.add(grid);
    const under = new THREE.Group(); sC.add(under);                       // things that sit behind the line
    const N = 220, lpos = new Float32Array(N * 6), lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
    const idx = []; for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    lgeo.setIndex(idx);
    const inkMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, depthTest: false }); inkMat.color = COL.ink;
    const bgMat = new THREE.MeshBasicMaterial({ depthTest: false }); bgMat.color = COL.bg;
    const gpos = new Float32Array(N * 6), ggeo = new THREE.BufferGeometry(); ggeo.setAttribute('position', new THREE.BufferAttribute(gpos, 3)); ggeo.setIndex(idx);
    const ghostMat = new THREE.MeshBasicMaterial({ depthTest: false, side: THREE.DoubleSide, color: new THREE.Color() }), ghostLine = new THREE.Mesh(ggeo, ghostMat); ghostLine.renderOrder = -1; ghostLine.frustumCulled = false; sC.add(ghostLine);   // the stretch of a route not yet travelled
    const line = new THREE.Mesh(lgeo, inkMat); line.frustumCulled = false; sC.add(line);
    const over = new THREE.Group(); sC.add(over);                         // things that sit on the line
    const hairMat = basic('ink'), hair = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hairMat); sC.add(hair);   // the level at which text is wiped, shown only while it moves
    const disc = new THREE.CircleGeometry(1, 40);
    const capA = new THREE.Mesh(disc, inkMat);
    const dotCol = new THREE.Color(), dotMat = new THREE.MeshBasicMaterial({ depthTest: false }); dotMat.color = dotCol;
    const capB = new THREE.Mesh(disc, dotMat), capE = new THREE.Mesh(disc, inkMat);   // capE rounds the end of the line when the dot sits elsewhere
    sC.add(capA, capE, capB);

    const resample = pts => {
      const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const L = d[d.length - 1], out = []; let j = 0;
      for (let i = 0; i < N; i++) { const t = L * i / (N - 1); while (j < d.length - 2 && d[j + 1] < t) j++; const f = (t - d[j]) / Math.max(1e-6, d[j + 1] - d[j]); out.push([lerp(pts[j][0], pts[j + 1][0], f), lerp(pts[j][1], pts[j + 1][1], f)]); }
      return out;
    };
    const bez = (a, b, c, d, n) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); } return o; };
    // thick strokes as triangles (WebGL lines are one pixel): mitred joins, round ends on open paths. `sub` cuts each edge into pieces so a path can be drawn in bit by bit
    const strokeGeo = (paths, w, into) => { const pos = [], ind = [], h = w / 2; let segs = 0;
      const dir = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
      paths.forEach(({ pts: raw, closed, sub }) => { let pts = raw;
        if (sub) { pts = []; const n = raw.length; for (let i = 0; i < (closed ? n : n - 1); i++) { const a = raw[i], b = raw[(i + 1) % n]; for (let k = 0; k < sub; k++) pts.push([lerp(a[0], b[0], k / sub), lerp(a[1], b[1], k / sub)]); } if (!closed) pts.push(raw[n - 1]); }
        const n = pts.length, b0 = pos.length / 3;
        for (let i = 0; i < n; i++) { const p = pts[i], pv = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)], nx = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
          const d0 = i === 0 && !closed ? dir(p, nx) : dir(pv, p), d1 = i === n - 1 && !closed ? d0 : dir(p, nx);
          let mx = -(d0[1] + d1[1]), my = d0[0] + d1[0]; const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
          const k = h / Math.max(.3, -mx * d1[1] + my * d1[0]);
          pos.push(p[0] + mx * k, p[1] + my * k, 0, p[0] - mx * k, p[1] - my * k, 0); }
        const m = closed ? n : n - 1; for (let i = 0; i < m; i++) { const a = b0 + i * 2, b = b0 + ((i + 1) % n) * 2; ind.push(a, a + 1, b, a + 1, b + 1, b); } segs += m;
        if (!closed) [[pts[0], dir(pts[1], pts[0])], [pts[n - 1], dir(pts[n - 2], pts[n - 1])]].forEach(([p, d]) => { const c = pos.length / 3, a0 = Math.atan2(d[1], d[0]) - Math.PI / 2; pos.push(p[0], p[1], 0);
          for (let j = 0; j <= 10; j++) { const a = a0 + Math.PI * j / 10; pos.push(p[0] + Math.cos(a) * h, p[1] + Math.sin(a) * h, 0); } for (let j = 1; j <= 10; j++) ind.push(c, c + j, c + j + 1); }); });
      const old = into && into.attributes.position;                     // a path that moves every frame keeps its buffers
      if (old && old.array.length === pos.length) { old.array.set(pos); old.needsUpdate = true; return into; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(ind); g.userData.segs = segs; if (into) into.dispose(); return g; };
    const strokeMesh = (mat, parent, order) => { const m = new THREE.Mesh(new THREE.BufferGeometry(), mat); m.frustumCulled = false; m.renderOrder = order || 0; parent.add(m); return m; };
    // drawings behind the line are mixed with the ground instead of see-through, so they are painted first and line, rings and dot always lie on top.
    // holes: up to 24 boxes (x, y, half width, half height) where the drawing gives way, so no line runs through a name or a label
    const KN = 24, knock = Array.from({ length: KN }, () => new THREE.Vector4(0, 0, -1, -1)), noHoles = Array.from({ length: KN }, () => new THREE.Vector4(0, 0, -1, -1));
    const flatMat = (tint, holes) => new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { uCol: { value: COL[tint] }, uBg: { value: COL.bg }, uOp: { value: 1 }, uK: { value: holes || noHoles } },
      vertexShader: 'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `uniform vec3 uCol,uBg; uniform float uOp; uniform vec4 uK[${KN}]; varying vec2 vP;
        void main(){ float a=uOp; for(int i=0;i<${KN};i++){ if(uK[i].z>0.0){ float r=min(uK[i].z,uK[i].w); vec2 d=abs(vP-uK[i].xy)-uK[i].zw+r;   // a rounded box that fades out softly, so a line thins away instead of being cut
            a*=smoothstep(0.0,clamp(r*1.2,10.0,26.0),length(max(d,0.0))+min(max(d.x,d.y),0.0)-r); } }
          gl_FragColor=vec4(mix(uBg,uCol,a),1.0); }` });
    const hole = (i, x, y, hw, hh) => { if (i < KN) knock[i].set(x, y, hw, hh); }, noHole = i => { if (i < KN) knock[i].z = -1; };
    // TravelFlow's symbol, drawn on a 512 grid: the folded map spans 131..380 by 153..358. Shapes are kept relative to the map, -1..1 each way, y up.
    const TF = (x, y) => [(x - 255.5) / 124.5, -(y - 255.5) / 102.5];
    const MAP = [TF(131, 179), TF(208, 153), TF(304, 178), TF(380, 153), TF(380, 333), TF(304, 358), TF(208, 333), TF(131, 358)];
    const FOLDS = [[TF(208, 153), TF(208, 333)], [TF(304, 178), TF(304, 358)]], FOLD_AT = [[1, 6], [2, 5]], MSUB = 24;   // folds join corners 1–6 and 2–5 of the outline
    const MAPS = []; MAP.forEach((a, i) => { const b = MAP[(i + 1) % MAP.length]; for (let k = 0; k < MSUB; k++) MAPS.push([lerp(a[0], b[0], k / MSUB), lerp(a[1], b[1], k / MSUB)]); });   // the outline in even pieces
    const smooth = (p, n) => { for (let k = 0; k < n; k++) for (let i = 1; i < p.length - 1; i++) p[i] = [(p[i - 1][0] + p[i][0] * 2 + p[i + 1][0]) / 4, (p[i - 1][1] + p[i][1] * 2 + p[i + 1][1]) / 4]; return p; };
    const TILT = .92, ell = (a, r) => { const x = Math.cos(a) * r, y = Math.sin(a) * r * .5; return [x * Math.cos(TILT) - y * Math.sin(TILT), x * Math.sin(TILT) + y * Math.cos(TILT)]; };
    const orbitPts = Array.from({ length: N }, () => [0, 0]), beamPts = Array.from({ length: N }, (_, i) => [-1 + 2 * i / (N - 1), 0]);
    const SHAPE = {
      flat: resample([[-1, 0], [1, 0]]),
      route: resample(smooth(bez(TF(165, 307), TF(178, 293), TF(205, 284), TF(232, 276), 30).concat(bez(TF(232, 276), TF(258, 268), TF(262, 230), TF(290, 219), 30), bez(TF(290, 219), TF(304, 214), TF(318, 220), TF(337, 220), 20)), 40)),   // the route on the map, ending where the symbol has its dot
      balance: beamPts,                                                  // recomputed every frame: a beam that tips with its load
      orbit: orbitPts                                                    // recomputed every frame: the dot keeps travelling its orbit
    };
    const CST = [{ p: 0, sh: 'flat' }].concat(APPS.map((a, i) => ({ p: (i + 1) * STEP, sh: a.scene, app: a })), [{ p: 1, sh: 'flat' }]);
    const off = new Float32Array(N * 2), ov = new Float32Array(N * 2), cur = new Float32Array(N * 2);
    const gC = CST.map(s => { const g = new THREE.Group(); g.userData.p = s.p; sC.add(g); return g; });
    const T = {};
    T.brand = glyphRun('JueK3y', { family: F.sans, weight: 600, px: 220, ls: -.045, side: 1 });      // the opening: the wordmark, then it sinks into the line
    T.code = glyphRun(txt('nav.code'), { family: F.mono, px: 220, ls: -.03, side: 1 });                       // and the chapter title rises out of it
    T.apps = textMesh(caps(plural('count.apps', APPS.length)), { family: F.mono, px: 26, tint: 'muted', ls: .06 });
    T.caret = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), basic('accent')); T.caret.userData = { o: 1 };
    gC[0].add(T.apps); T.brand.list.forEach(g => over.add(g.m)); T.code.list.forEach(g => over.add(g.m)); over.add(T.caret);
    // small text scrolls with the page and is rubbed out where it meets the line.
    // A name rides on the line where the line has a free stretch for it (the route); where the symbol fills the line (scales, orbit) it stands in the text beside it.
    const RIDES = { route: true };
    T.app = APPS.map((a, i) => { const o = { kind: textMesh(caps(a.line), { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }), desc: textMesh(a.desc, { family: F.sans, px: 40, tint: 'muted', side: -1 }) };
      if (!RIDES[a.scene]) { o.name = textMesh(a.name, { family: F.sans, weight: 600, px: 180, ls: -.045, side: -1 }); gC[i + 1].add(o.name); }
      else { o.run = glyphRun(a.name, { family: F.sans, weight: 600, px: 180, ls: -.005, side: 1 }); o.run.list.forEach(g => g.m && over.add(g.m)); }
      gC[i + 1].add(o.kind, o.desc); CST[i + 1].txt = o; return o; });
    T.end = textMesh(txt('contact.title'), { family: F.sans, weight: 600, px: 200, ls: -.05 });
    gC[gC.length - 1].add(T.end);
    const arc = new Float32Array(N), tmp = { x: 0, y: 0, a: 0 };
    const onLine = d => { if (d < 0 || d > arc[N - 1]) return false; let lo = 0, hi = N - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (arc[m] < d) lo = m; else hi = m; }
      const f = (d - arc[lo]) / Math.max(1e-6, arc[hi] - arc[lo]), a = Math.max(0, lo - 3), b = Math.min(N - 1, hi + 3);
      tmp.x = lerp(cur[lo * 2], cur[hi * 2], f); tmp.y = lerp(cur[lo * 2 + 1], cur[hi * 2 + 1], f); tmp.a = Math.atan2(cur[b * 2 + 1] - cur[a * 2 + 1], cur[b * 2] - cur[a * 2]); return true; };
    // set a run of letters onto the live line, starting d0 pixels along it
    const ride = (run, size, d0, alpha, ends, lift) => { const k = size / run.px, L = arc[N - 1], edge = size * .35, base = size * .33 + thick * 2.1 + (lift || 0);   // letters stand clear of the line
      run.list.forEach(g => { if (!g.m) return; const d = d0 + g.x * k; if (!onLine(d)) { g.m.visible = false; return; } const up = base + (g.lift || 0);
        g.m.scale.set(g.m.userData.w * k, g.m.userData.h * k, 1); g.m.position.set(tmp.x - Math.sin(tmp.a) * up, tmp.y + Math.cos(tmp.a) * up, 0); g.m.rotation.z = tmp.a;
        op(g.m, alpha * (g.o == null ? 1 : g.o) * sstep(0, edge, d) * (ends === false ? 1 : sstep(0, edge, L - d))); }); };
    const bump = (d, power) => { const c = Math.round(clamp(d / Math.max(1, arc[N - 1]), 0, 1) * (N - 1)); for (let i = Math.max(0, c - 16); i <= Math.min(N - 1, c + 16); i++) ov[i * 2 + 1] += power * Math.exp(-Math.pow((i - c) / 7, 2)); };

    /* ---- app scenes: each one adds its own parts and says where its line lives ---- */
    const mkRing = () => { const g = new THREE.Group(); g.add(new THREE.Mesh(disc, bgMat), new THREE.Mesh(new THREE.RingGeometry(.6, 1, 40), inkMat)); g.children[0].scale.setScalar(.62); over.add(g); return g; };
    const euroS = new Intl.NumberFormat(REGION, { style: 'currency', currency: 'EUR', signDisplay: 'exceptZero' });
    const SCENE = {
      route: { ghost: true,                                              // TravelFlow: the folded map of its symbol opens as you arrive, then the dot travels the route and pulls the name behind it; stops open as it reaches them
        init(st) { const T2 = txt('scene.route.stops');
          st.stops = [.03, .34, .65, 1].map((k, j) => { const parts = caps(T2[j]).split(' · '), mk = str => { const m = textMesh(str, { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }); over.add(m); return m; };
            return { g: mkRing(), lab: mk(caps(T2[j])), two: [mk(parts[0]), mk(parts.slice(1).join(' · ') || ' ')], k, j }; });   // one line on a wide screen, two on a phone; the last stop is where the dot arrives
          st.foldMat = flatMat('muted', knock); st.mapMat = flatMat('ink', knock); st.folds = strokeMesh(st.foldMat, under, -3); st.map = strokeMesh(st.mapMat, under, -2);
          st.mo = new Float32Array(MAPS.length * 2); st.mv = new Float32Array(MAPS.length * 2); st.gk = 0; st.trip = -1e9;
          st.tap = (x, y) => { const mx = x - W / 2, my = H / 2 - y; for (let i = 0; i < MAPS.length; i++) { const p = st.rest[i], dx = p[0] - mx, dy = p[1] - my, d = Math.hypot(dx, dy) + 1, f = 900 / (1 + d * d / 12000); st.mv[i * 2] += dx / d * f; st.mv[i * 2 + 1] += dy / d * f; }
            st.trip = performance.now(); };                              // a click shakes the map and sends the dot on the trip once more
          st.rest = MAPS.map(() => [0, 0]); },
        layout: () => { const fw = wide ? Math.min(W * .54, H * .6 * 1.55) : Math.min(W * .9, H * .42), fh = fw / (wide ? 1.55 : 1.15); return { c: [0, wide ? H * .05 : H * .08], s: [fw / 2, fh / 2] }; },
        build(st) { st.walls = [-1, FOLDS[0][0][0], FOLDS[1][0][0], 1].map(x => st.l.c[0] + x * st.l.s[0]); },   // where the open map has upright lines
        head: (dp, st) => { const h = sstep(-.45, -.04, dp / STEP), k = clamp((performance.now() - st.trip) / 2200, 0, 1); return k < 1 ? h * ease(k) : h; },   // the whole route is travelled by the time the station is reached
        update(st, a, q, t, pull, dp, head, dt) { const o = st.txt, L = arc[N - 1], size = Math.min(o.size, L * .78 * o.run.px / o.run.w), S = st.l;
          // the map unfolds: everything right of the first fold is pressed together and opens out; the untravelled route only shows on an open map
          const u = sstep(.02, .55, q), F1 = FOLDS[0][0][0], open = lerp(.1, 1, u); st.gk = u * u;
          const mx = ptr.sx - W / 2, my = H / 2 - ptr.sy, RR = Math.max(90, Math.min(W, H) * .14);
          for (let i = 0; i < MAPS.length; i++) { const nx = MAPS[i][0] < F1 ? MAPS[i][0] : F1 + (MAPS[i][0] - F1) * open, rx = S.c[0] + nx * S.s[0], ry = S.c[1] + MAPS[i][1] * S.s[1];
            let fx = 0, fy = 0; if (ptr.inside && a > .5) { const dx = rx + st.mo[i * 2] - mx, dy = ry + st.mo[i * 2 + 1] - my, d = Math.hypot(dx, dy); if (d < RR) { const k = Math.pow(1 - d / RR, 2) * 2600; fx = dx / (d + .001) * k; fy = dy / (d + .001) * k; } }   // the map gives way to the pointer like the line does
            st.mv[i * 2] += (fx - st.mo[i * 2] * 150 - st.mv[i * 2] * 12) * dt; st.mv[i * 2 + 1] += (fy - st.mo[i * 2 + 1] * 150 - st.mv[i * 2 + 1] * 12) * dt;
            st.mo[i * 2] += st.mv[i * 2] * dt; st.mo[i * 2 + 1] += st.mv[i * 2 + 1] * dt; st.rest[i][0] = rx + st.mo[i * 2]; st.rest[i][1] = ry + st.mo[i * 2 + 1]; }
          if (a > .01) { st.map.geometry = strokeGeo([{ pts: st.rest, closed: true }], thick * .5, st.map.geometry);
            st.folds.geometry = strokeGeo(FOLD_AT.map(([p, b]) => ({ pts: [st.rest[p * MSUB], st.rest[b * MSUB]] })), thick * .35, st.folds.geometry); }
          st.map.geometry.setDrawRange(0, Math.round(sstep(.02, .45, q) * MAPS.length) * 6); st.mapMat.uniforms.uOp.value = .32 * a; st.map.visible = a > .01;
          const fo = .5 * a * sstep(.3, .6, q); st.foldMat.uniforms.uOp.value = fo; st.folds.visible = fo > .01;
          ride(o.run, size, head * L - o.run.w * size / o.run.px - size * .32, a);
          o.run.list.forEach((g, j) => { if (j >= 16) return; const r = g.m ? g.m.rotation.z : 0;   // map and folds give way around each letter
            if (!g.m || !g.m.visible) noHole(j); else hole(j, g.m.position.x - Math.sin(r) * size * .15, g.m.position.y + Math.cos(r) * size * .15, size * .26, size * .26); });
          // labels hang below the route, to the side it has not reached yet. A side is taken only if the line stays above the label all along it;
          // folds and the edge of the map are avoided where possible, and otherwise give way to the label
          const below = (x0, x1, top) => { for (let c = Math.max(0, Math.floor((x0 + W / 2) / W * 256)); c <= Math.min(255, Math.ceil((x1 + W / 2) / W * 256)); c++) if (envY[c] < 1e8 && envY[c] - thick * .7 < top) return false; return x0 > -W / 2 + 6 && x1 < W / 2 - 6; };
          st.stops.forEach(s => { const i = Math.round(s.k * (N - 1)), x = cur[i * 2], y = cur[i * 2 + 1], pop = back(sstep(s.k - .07, s.k, head + .001)), last = s.j === st.stops.length - 1;
            s.g.position.set(x, y, 0); s.g.scale.setScalar(thick * 2 * pop * a); s.g.visible = !last && pop * a > .01;   // no ring at the end: the dot is the destination
            const fs = wide ? 12 : 11, lines = wide ? [s.lab] : s.two, ws = lines.map(m => m.userData.w * fs / m.userData.px - m.userData.pad * fs / m.userData.px * 2);
            const bw = Math.max(...ws), ly = y - (thick * 2 + (wide ? 17 : 14)), top = ly + fs * .6, bot = ly - fs * 1.35 * (lines.length - 1) - fs * .6;
            // where the label may start: beside the stop on the side not yet travelled, then the other side, centred, or slid just clear of a fold
            const dl = thick * (last ? 2.4 : 1), pref = last ? [x + dl - bw, x - dl, x - bw / 2] : [x - dl, x + dl - bw, x - bw / 2], gap = 8;
            const starts = pref.concat(...st.walls.map(v => [v - gap - bw, v + gap])).filter(x0 => x0 < x + bw * .2 && x0 + bw > x - bw * .2);
            const free = x0 => below(x0, x0 + bw, top), clear = x0 => !st.walls.some(v => v > x0 - gap + 1 && v < x0 + bw + gap - 1);
            const x0 = starts.find(x0 => free(x0) && clear(x0)) ?? starts.find(free) ?? pref[0], x1 = x0 + bw, vis = sstep(.3, 1, pop) * a;
            [s.lab].concat(s.two).forEach(m => op(m, 0)); lines.forEach((m, k) => { place(m, x0, ly - fs * 1.35 * k, fs, 'l'); op(m, vis); });
            if (vis > .05) hole(16 + s.j, (x0 + x1) / 2, (top + bot) / 2, bw / 2 + 5, (top - bot) / 2 + 3); else noHole(16 + s.j); }); }
      },
      balance: {                                                         // Saldo: the scales of its symbol. The beam is the line and tips with the load; the pans hang from its ends and swing.
        init(st) { st.th = 0; st.om = 0; st.coins = []; st.sum = 0; st.shown = 0; st.auto = 0; st.kick = 0; st.last = 0; st.away = true;   // income (filled) and spending (rings) drop into the pans, sized by amount
          st.mat = flatMat('ink'); st.post = strokeMesh(st.mat, under, -1); st.pans = [strokeMesh(st.mat, under, -1), strokeMesh(st.mat, under, -1)];
          st.sw = [0, 1].map(() => ({ a: 0, w: 0, x: 0, y: 0, vx: 0, on: false }));
          st.num = textMesh(euroS.format(0), { family: F.mono, px: 64, ls: -.02, widest: euroS.format(-8888.88), side: -1 }); st.note = textMesh(caps(txt('scene.balance.note')), { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }); over.add(st.num, st.note);
          const PLUS = [620, 410.5, 254, 120, 80, 45], MINUS = [180, 95.5, 60, 35, 20, 12];
          const lose = c => { over.remove(c.g); if (c.landed) st.sum -= c.side * c.v; };
          st.clear = side => { st.coins.filter(c => side == null || c.side === side).forEach(lose); st.coins = st.coins.filter(c => side != null && c.side !== side); };
          st.drop = side => { if (st.coins.filter(c => c.side === side).length >= 6) st.clear(side);   // a full pan is tipped out and filling starts again
            const n = st.coins.filter(c => c.side === side).length, v = (side > 0 ? PLUS : MINUS)[n]; let g;
            if (side > 0) { g = new THREE.Mesh(disc, inkMat); over.add(g); } else g = mkRing();
            st.coins.push({ side, n, g, v, r: 1.15 + Math.sqrt(v) / 20, born: performance.now(), y: 0, rr: 0, landed: false }); }; },
        // sizes follow the symbol (512 grid): half the beam is 104, the post rises 28 above it and stands 168 below, the pans hang 108 under the ends with a bowl of 40
        layout: () => { const S = wide ? Math.min(W * .17, H * .28) : Math.min(W * .3, H * .15), u = S / 104; return { c: wide ? [W * .2, u * 70 + 40] : [0, H * .3], s: [S, S], u }; },
        build(st) { const u = st.l.u;
          st.post.geometry = strokeGeo([{ pts: [[0, 28 * u], [0, -168 * u]] }, { pts: [[-52 * u, -168 * u], [52 * u, -168 * u]] }], thick, st.post.geometry);
          const bowl = Array.from({ length: 25 }, (_, i) => { const a = -Math.PI * i / 24; return [40 * u * Math.cos(a), -108 * u + 40 * u * Math.sin(a)]; });
          const pan = strokeGeo([{ pts: [[-40 * u, -108 * u], [0, 0]] }, { pts: [[0, 0], [40 * u, -108 * u]] }, { pts: bowl }], thick, st.pans[0].geometry); st.pans.forEach(m => { m.geometry = pan; }); },
        dotAt: st => [st.l.c[0], st.l.c[1] + 28 * st.l.u],                 // the accent dot sits on top of the post
        update(st, a, q, t, pull, dp, head, dt, soft) { const AUTO = [[.2, 1], [.34, -1], [.48, 1], [.62, 1], [.76, -1]], t0 = performance.now();
          if (soft < .01) { if (!st.away) { st.clear(); Object.assign(st, { sum: 0, shown: 0, auto: 0, th: 0, om: 0, away: true }); } } else st.away = false;   // out of sight the scales are emptied, so every visit fills them again
          if (!st.away && st.auto < AUTO.length && q > AUTO[st.auto][0] && t0 - st.last > 170) { st.drop(AUTO[st.auto++][1]); st.last = t0; }   // one coin at a time, also when arriving from below
          const load = st.coins.reduce((n, c) => n + (c.landed ? c.side * c.r : 0), 0), target = clamp(-load * .045, -.26, .26);   // a coin weighs only once it lies in its pan
          st.om += ((target - st.th) * 46 - st.om * 5) * dt; st.th += st.om * dt;
          const L = st.l, u = L.u, R = 40 * u, len = (108 + 30) * u, now = performance.now(), mx = ptr.sx - W / 2, my = H / 2 - ptr.sy, RR = Math.max(80, R * 1.6);
          st.post.position.set(L.c[0], L.c[1], 0);
          // the pans hang from the live ends of the line, so they follow the beam, the pointer pushing the line, and every wobble, and swing like pendulums
          const hang = [0, N - 1].map((i, k) => { const ex = L.c[0] + (k ? 1 : -1) * L.s[0] * Math.cos(st.th), ey = L.c[1] + (k ? 1 : -1) * L.s[0] * Math.sin(st.th), w = soft * soft; return [lerp(ex, cur[i * 2], w), lerp(ey, cur[i * 2 + 1], w)]; });
          st.sw.forEach((p, k) => { const [hx, hy] = hang[k];
            if (soft < .05 || !p.on || dt <= 0) { Object.assign(p, { a: 0, w: 0, x: hx, y: hy, vx: 0, on: soft >= .05 }); }
            else { const vx = (hx - p.x) / dt, ax = clamp((vx - p.vx) / dt, -9000, 9000); p.vx = vx; p.x = hx; p.y = hy;
              let push = 0; const bx = hx + Math.sin(p.a) * len, by = hy - Math.cos(p.a) * len; if (ptr.inside) { const d = Math.hypot(bx - mx, by - my); if (d < RR) push = Math.sign(bx - mx) * Math.pow(1 - d / RR, 2) * 14; }   // the pointer nudges a pan away
              p.w += (-(2600 / len) * Math.sin(p.a) - ax / len * Math.cos(p.a) * .25 + push - p.w * 3.4) * dt; p.a = clamp(p.a + p.w * dt, -.32, .32); }
            st.pans[k].position.set(hx, hy, 0); st.pans[k].rotation.z = p.a; });
          st.mat.uniforms.uOp.value = soft; st.post.visible = st.pans[0].visible = st.pans[1].visible = soft > .01;
          st.coins.forEach(c => { const k = c.side > 0 ? 1 : 0, [hx, hy] = hang[k], an = st.sw[k].a, x = (c.n % 3 - 1) * R * .58, r = thick * c.r, f = back(clamp((now - c.born) / 520, 0, 1));   // three on the bottom of the pan, three on top of those
            const under0 = c.n > 2 ? st.coins.find(o => o.side === c.side && o.n === c.n - 3) : null;
            c.rr = r; c.y = under0 ? under0.y + under0.rr + r : -108 * u - Math.sqrt(Math.max(0, R * R - x * x)) + thick * .5 + r;
            if (!c.landed && now - c.born > 380) { c.landed = true; st.sum += c.side * c.v; st.om -= c.side * (1 + Math.sqrt(c.v) / 22); st.sw[k].w += (c.n % 3 - 1) * .35 + (c.side > 0 ? .18 : -.18); st.kick = 1; }   // landing: the pan swings, the beam tips, the sum jumps
            const cs = Math.cos(an), sn = Math.sin(an);
            c.g.position.set(hx + x * cs - c.y * sn, hy + x * sn + c.y * cs + (1 - f) * H * .3, 0); c.g.scale.setScalar(r * a); c.g.visible = a > .01; });
          st.shown += (st.sum - st.shown) * .14; const v = Math.round(st.shown * 100) / 100; st.num.set(euroS.format(Math.abs(v) < .005 ? 0 : v)); st.kick = Math.max(0, st.kick - dt * 3);
          const y0 = L.c[1] - 168 * u - (wide ? 56 : 34); place(st.num, L.c[0], y0, (wide ? 42 : 24) * (1 + st.kick * st.kick * .12), 'c'); place(st.note, L.c[0], y0 - (wide ? 40 : 26), wide ? 12 : 11, 'c'); op(st.num, a); op(st.note, a); }
      },
      orbit: {                                                           // 1000 Days: habits become a small universe; a click adds a planet
        init(st) { st.sun = new THREE.Mesh(disc, inkMat); over.add(st.sun); st.planets = []; st.loopMat = new THREE.LineBasicMaterial({ transparent: true, depthTest: false }); st.loopMat.color = COL.ink;
          st.add = () => { if (st.planets.length >= (wide ? 5 : 4)) return false; const n = st.planets.length, r = 1.34 + n * .3;
            const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => { const p = ell(i / 96 * Math.PI * 2, r); return new THREE.Vector3(p[0], p[1], 0); })), st.loopMat);
            const m = new THREE.Mesh(disc, inkMat); under.add(loop); over.add(m); st.planets.push({ loop, m, r, sp: .5 / (1 + n * .45), ph: n * 2.1, born: performance.now() }); return true; };
          st.add(); st.add();
          st.day = textMesh(caps(txt('scene.orbit.day', { n: '0000' })), { family: F.mono, px: 64, ls: -.02, side: -1 }); over.add(st.day); },
        layout: () => { const S = wide ? Math.min(W * .13, H * .2) : Math.min(W * .16, H * .075); return { c: wide ? [W * .22, 0] : [0, H * .24], s: [S, S] }; },
        update(st, a, q, t, pull, dp, head, dt, soft) { const L = st.l, S = L.s[0] * (1 - pull * .12), now = performance.now();
          st.sun.position.set(L.c[0], L.c[1], 0); st.sun.scale.setScalar(S * .2 * back(sstep(0, .4, q)) * soft); st.sun.visible = soft > .01;
          st.loopMat.opacity = .3 * soft * sstep(.2, .7, q);
          st.planets.forEach(pl => { const pop = back(clamp((now - pl.born) / 600, 0, 1)) * sstep(.25, .8, q) * soft, p = ell(t * pl.sp + pl.ph, pl.r);
            pl.loop.position.set(L.c[0], L.c[1], 0); pl.loop.scale.setScalar(S); pl.loop.visible = st.loopMat.opacity > .01;
            pl.m.position.set(L.c[0] + p[0] * S, L.c[1] + p[1] * S, 0); pl.m.scale.setScalar(thick * .9 * pop); pl.m.visible = pop > .01; });
          st.day.set(caps(txt('scene.orbit.day', { n: String(Math.round(1000 * sstep(.05, 1, q))).padStart(4, '0') })));
          const y0 = L.c[1] - S * st.planets[st.planets.length - 1].r * .85 - (wide ? 34 : 24); place(st.day, L.c[0], y0, wide ? 26 : 18, 'c'); op(st.day, a); }
      }
    };
    CST.forEach(st => { if (st.app) SCENE[st.sh].init(st); });
    const BAL = CST.find(s => s.sh === 'balance');
    const ORB = CST.find(s => s.sh === 'orbit');
    const ROU = CST.find(s => s.sh === 'route');
    const accentOf = CST.map(s => s.app && s.app.accent ? new THREE.Color(s.app.accent) : null);

    let thick = 6;
    const layoutC = () => {
      wide = W >= 760;
      camC.left = -W / 2; camC.right = W / 2; camC.top = H / 2; camC.bottom = -H / 2; camC.updateProjectionMatrix();
      grid.scale.set(W, H, 1); grid.material.uniforms.uRes.value.set(W, H);
      const hc = Math.min(W * .2, H * .3), wc = T.code.w * hc / T.code.px; T.code.size = hc; T.brand.size = Math.min(hc, (wc + hc * .6) * T.brand.px / T.brand.w); EV.uThick.value = Math.max(4, Math.min(W, H) * .011);
      place(T.apps, 0, hc * .78, wide ? 13 : 12, 'c'); T.caret.scale.set(hc * .3, hc * .62, 1);
      thick = Math.max(4, Math.min(W, H) * .011);
      const ns = wide ? Math.min(W * .085, H * .16) : Math.min(W * .15, 68), x0 = -W / 2 + Math.max(W * .08, 28), ds = Math.max(17, Math.min(21, W * .015));
      const he = Math.min(W * .125, H * .2), ye = H * .2, we = place(T.end, 0, ye, he, 'c');
      CST.forEach((st, i) => { st.l = st.app ? SCENE[st.sh].layout() : i === 0 ? { c: [0, -hc * .3], s: [wc / 2 + hc * .42, 1] } : { c: [0, ye - he * .68], s: [we / 2, 1] }; if (st.app && SCENE[st.sh].build) SCENE[st.sh].build(st); });
      T.app.forEach((o, i) => { o.size = ns; const l = CST[i + 1].l;
        if (o.run) { const lx = l.c[0] - l.s[0], ly = l.c[1] - l.s[1];   // a name on the line leaves the small text under the scene
          if (wide) { place(o.kind, lx, ly - 40, 13, 'l'); place(o.desc, lx, ly - 76, ds, 'l'); } else { place(o.kind, 0, ly - 30, 12, 'c'); place(o.desc, 0, ly - 58, 15, 'c'); } }
        else if (wide) { const y0 = H * .1; place(o.kind, x0, y0 + ns * .82, 13, 'l'); place(o.name, x0, y0, ns, 'l'); place(o.desc, x0, y0 - ns * .85, ds, 'l'); }
        else { const y0 = -H * .12; place(o.kind, 0, y0 + ns * .9, 12, 'c'); place(o.name, 0, y0, ns, 'c'); place(o.desc, 0, y0 - ns * .9, 15, 'c'); } });
      CST.forEach((st, i) => { const l = st.l, top = st.sh === 'route' ? l.c[1] + l.s[1] + thick : st.sh === 'orbit' ? l.c[1] + l.s[1] * .9 : st.sh === 'balance' ? l.c[1] + 28 * l.u + thick * 2 : l.c[1]; let bt = -1e9, bb = 1e9;
        if (st.app) gC[i].children.forEach(m => { bt = Math.max(bt, m.position.y + m.scale.y * .4); bb = Math.min(bb, m.position.y - m.scale.y * .4); });
        st.level = Math.max(top, bt) + 14; st.low = bb - 16; });
    };
    const dotPos = new THREE.Vector2(.5, .5);
    const pluck = (px, py, power) => { const mx = px - W / 2, my = H / 2 - py; for (let i = 0; i < N; i++) { const dx = cur[i * 2] - mx, dy = cur[i * 2 + 1] - my, d = Math.hypot(dx, dy) + 1; const f = power / (1 + d * d / 9000); ov[i * 2] += dx / d * f; ov[i * 2 + 1] += dy / d * f; } };
    let orbA = 0;
    const updateC = (t, dt) => {
      let i0 = 0; while (i0 < CST.length - 2 && uc > CST[i0 + 1].p) i0++;
      const a = CST[i0], b = CST[i0 + 1], f = clamp((uc - a.p) / (b.p - a.p), 0, 1), e = ease(clamp((f - .2) / .6, 0, 1));
      const pull = sstep(X0 - .03, X0 + .02, pS) * (1 - sstep(X1 - .01, X1 + .02, pS));       // just before the crossing things tighten around the dot
      orbA += dt * .5 * (1 - pull) + Math.abs(vel) * 6; for (let i = 0; i < N; i++) { const p = ell(orbA - (1 - i / (N - 1)) * Math.PI * 2, 1); orbitPts[i][0] = p[0]; orbitPts[i][1] = p[1]; }
      if (BAL) { const cs = Math.cos(BAL.th), sn = Math.sin(BAL.th); for (let i = 0; i < N; i++) { const x = -1 + 2 * i / (N - 1); beamPts[i][0] = x * cs; beamPts[i][1] = x * sn; } }
      const A = SHAPE[a.sh], B = SHAPE[b.sh], sa = a.app && SCENE[a.sh], sb = b.app && SCENE[b.sh];
      // e runs 0 to 1 between two stations: the line turns straight into the next shape
      const hA = sa && sa.head ? sa.head(uc - a.p, a) : 1, hB = sb && sb.head ? sb.head(uc - b.p, b) : 1, head = lerp(hA, hB, e), hi = Math.max(1, Math.round(head * (N - 1)));
      const ghost = (sa && sa.ghost ? (1 - e) * (a.gk == null ? 1 : a.gk) : 0) + (sb && sb.ghost ? e * (b.gk == null ? 1 : b.gk) : 0), own = e < .5 ? i0 : i0 + 1, pk = 1 - pull * .12, dipK = Math.sin(Math.PI * e);
      const dy = 0;
      hair.visible = false;
      const wob = dipK * Math.min(W, H) * .04 + Math.abs(vel) * 900, idle = (1 - sstep(0, STEP * .4, uc)) * thick * (.9 + 1.6 * Math.pow(Math.max(0, Math.sin(t * .8)), 6));
      const mx = ptr.sx - W / 2, my = H / 2 - ptr.sy, RR = Math.max(120, Math.min(W, H) * .2);
      for (let i = 0; i < N; i++) {
        const k = i / (N - 1);
        let x = lerp(a.l.c[0] + A[i][0] * a.l.s[0] * pk, b.l.c[0] + B[i][0] * b.l.s[0] * pk, e), y = lerp(a.l.c[1] + A[i][1] * a.l.s[1] * pk, b.l.c[1] + B[i][1] * b.l.s[1] * pk, e) + dy;
        y += Math.sin(k * 9 + t * 2.4) * wob * Math.sin(Math.PI * k) + Math.sin(k * 5 - t * 1.3) * (2.2 + idle);
        let fx = 0, fy = 0;
        if (ptr.inside) { const dx = x + off[i * 2] - mx, dy = y + off[i * 2 + 1] - my, d = Math.hypot(dx, dy); if (d < RR) { const q = Math.pow(1 - d / RR, 2) * 5200; fx = dx / (d + .001) * q; fy = dy / (d + .001) * q; } }
        ov[i * 2] += (fx - off[i * 2] * 150 - ov[i * 2] * 12) * dt; ov[i * 2 + 1] += (fy - off[i * 2 + 1] * 150 - ov[i * 2 + 1] * 12) * dt;
        off[i * 2] += ov[i * 2] * dt; off[i * 2 + 1] += ov[i * 2 + 1] * dt;
        cur[i * 2] = x + off[i * 2]; cur[i * 2 + 1] = y + off[i * 2 + 1];
      }
      for (let i = 0; i < N; i++) {
        const p = Math.max(0, i - 1), n = Math.min(N - 1, i + 1);
        let tx = cur[n * 2] - cur[p * 2], ty = cur[n * 2 + 1] - cur[p * 2 + 1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
        const nx = -ty * thick / 2, ny = tx * thick / 2, x = cur[i * 2], y = cur[i * 2 + 1];
        lpos[i * 6] = x + nx; lpos[i * 6 + 1] = y + ny; lpos[i * 6 + 2] = 0; lpos[i * 6 + 3] = x - nx; lpos[i * 6 + 4] = y - ny; lpos[i * 6 + 5] = 0;
        gpos[i * 6] = x + nx * .3; gpos[i * 6 + 1] = y + ny * .3; gpos[i * 6 + 2] = 0; gpos[i * 6 + 3] = x - nx * .3; gpos[i * 6 + 4] = y - ny * .3; gpos[i * 6 + 5] = 0;
      }
      lgeo.attributes.position.needsUpdate = true; lgeo.setDrawRange(0, hi * 6); ggeo.attributes.position.needsUpdate = true; ghostMat.color.copy(COL.bg).lerp(COL.ink, .34 * ghost); ghostLine.visible = ghost > .01;
      capA.position.set(cur[0], cur[1], 0); capA.scale.setScalar(thick / 2);
      const ex = cur[hi * 2], ey = cur[hi * 2 + 1]; let bx = ex, by = ey;
      CST.forEach(st => { const sc = st.app && SCENE[st.sh]; if (sc && sc.dotAt) { const w = 1 - sstep(STEP * .3, STEP * .7, Math.abs(uc - st.p)), d = sc.dotAt(st); bx = lerp(bx, d[0], w); by = lerp(by, d[1], w); } });   // a scene may seat the dot where its symbol has it
      capE.position.set(ex, ey, 0); capE.scale.setScalar(thick / 2);
      capB.position.set(bx, by, 0); capB.scale.setScalar(thick * (1.7 + Math.sin(t * 3) * .12 + pull * 2.2));
      dotPos.set((bx + W / 2) / W, (by + H / 2) / H);
      arc[0] = 0; for (let i = 1; i < N; i++) arc[i] = arc[i - 1] + Math.hypot(cur[i * 2] - cur[i * 2 - 2], cur[i * 2 + 1] - cur[i * 2 - 1]);
      // where the line is, column by column: this is what text is rubbed out against
      envY.fill(1e9);
      for (let i = 0; i < N - 1; i++) { let xa = cur[i * 2], ya = cur[i * 2 + 1], xb = cur[i * 2 + 2], yb = cur[i * 2 + 3]; if (xa > xb) { const tx = xa, ty = ya; xa = xb; ya = yb; xb = tx; yb = ty; }
        const c0 = Math.max(0, Math.ceil((xa + W / 2) / W * 256 - .5)), c1 = Math.min(255, Math.floor((xb + W / 2) / W * 256 - .5));
        for (let c = c0; c <= c1; c++) { const x = (c + .5) / 256 * W - W / 2, y = xb - xa < 1e-4 ? Math.min(ya, yb) : ya + (yb - ya) * (x - xa) / (xb - xa); if (y < envY[c]) envY[c] = y; } }
      for (let c = 0; c < 256; c++) { if (envY[c] > 1e8) { envData[c * 4 + 2] = 0; continue; } const v = Math.round(clamp((envY[c] + H / 2) / H, 0, 1) * 65535); envData[c * 4] = v >> 8; envData[c * 4 + 1] = v & 255; envData[c * 4 + 2] = 255; }
      envTex.needsUpdate = true;
      // opening: the wordmark is typed onto the line, sinks into it, and the chapter title rises out of the same line. Scrolling skips it.
      if (uc > .015) skip = true;
      const ti = skip ? 99 : t, al0 = i0 === 0 ? 1 - sstep(.02, .3, e) : 0, hs = T.code.size, hk = hs / T.code.px, hb = T.brand.size, bk = hb / T.brand.px, Lh = arc[N - 1], cw = hs * .3;
      const dB = Lh - T.brand.w * bk - hb * .16, dC = (Lh - T.code.w * hk - cw * 1.2) / 2, eo = x => 1 - Math.pow(1 - clamp(x, 0, 1), 4), ei = x => Math.pow(clamp(x, 0, 1), 3);
      T.brand.list.forEach((g, j) => { g.o = ti < 3.6 ? 1 : 0; g.lift = -(1 - eo((ti - .35 - j * .08) / 1)) * hb * 1.3 - ei((ti - 2.5 - j * .05) / .7) * hb * 1.3; });   // rises out of the line, rests, sinks back in
      ride(T.brand, hb, dB, al0, false, hb * .19);
      let typed = 0; T.code.list.forEach((g, j) => { const r = eo((ti - 3.05 - j * .09) / 1); g.o = 1; g.lift = -(1 - r) * hs * 1.25; if (r > .97) typed = j + 1; });
      ride(T.code, hs, dC, al0, false);
      if (onLine(dC + T.code.w * hk + cw * .72)) { const upc = hs * .36 + thick * 2.1; T.caret.position.set(tmp.x - Math.sin(tmp.a) * upc, tmp.y + Math.cos(tmp.a) * upc, 0); T.caret.rotation.z = tmp.a; }
      T.caret.userData.o = typed === T.code.list.length && (t * 1.6) % 1 < .55 ? 1 : 0; op(T.caret, al0); T.apps.userData.o = sstep(3.9, 4.6, ti);
      dotCol.copy(COL.accent);                                                                 // the dot takes the accent of the app it is showing
      CST.forEach((st, i) => { const dp = uc - st.p, al = i === own ? 1 : 0, soft = i === i0 ? 1 - sstep(.02, .3, e) : i === i0 + 1 ? sstep(.7, .98, e) : 0;
        fade(gC[i], soft);
        if (st.app) { st.l.c[1] += dy; SCENE[st.sh].update(st, soft, clamp((dp / STEP + .42) / .5, 0, 1), t, pull, dp, head, dt, soft); st.l.c[1] -= dy; }
        if (accentOf[i]) dotCol.lerp(accentOf[i], 1 - sstep(STEP * .3, STEP * .7, Math.abs(dp))); });
      grid.material.uniforms.uOff.value.set(-(ptr.sx - W / 2) * .04, -uc * H * 1.6 + (ptr.sy - H / 2) * .04);
      grid.material.uniforms.uM.value.set(ptr.inside ? ptr.sx : -9999, H - ptr.sy);
    };

    /* =================== world P · Fotografie =================== */
    const sP = new THREE.Scene(), camP = new THREE.PerspectiveCamera(50, W / H, .1, 160);
    const TAN = Math.tan(25 * Math.PI / 180);
    const UP = { uVel: { value: 0 }, uBg: { value: COL.pbg }, uTime: { value: 0 } };
    const loader = new THREE.TextureLoader(), pgeo = new THREE.PlaneGeometry(1, 1, 24, 24);
    /* ---- series layouts: each one decides where its photos hang and how they move through its stretch of scroll (q runs 0 to 1) ---- */
    // photos are sized by the shape of the window, not its width: a tall desktop window gets the portrait arrangement, like a phone
    let land = W > H;
    const LAYOUT = {
      wave: { hold: true,                                                 // a strip that rolls past like a swell; it only slides as far as needed to show every print in full
        put(se, it, j, n, q, t) { const gap = land ? 2.75 : 1.95, w = it.h * it.asp, vis = 2 * 7.5 * TAN * camP.aspect * .84, over = Math.max(land ? 1.2 : 0, (n - 1) * gap + w - vis);
          const x = (j - (n - 1) / 2) * gap - (sstep(.22, .6, q) - .5) * over, ph = x * .7 + t * .8;
          it.h = land ? 3 : 2.3; it.pos.set(x, Math.sin(ph) * .32 + (land ? .45 : .6), se.zc - 7.5 - Math.abs(x) * .12); it.rot.set(0, -x * .07, Math.cos(ph) * .1); } },
      tunnel: { hold: false, len: n => (n - 1) * 5.5,                       // photos on both walls, you fly through; wide prints stand further out so nothing is clipped
        put(se, it, j, n) { const side = j % 2 ? 1 : -1, ry = land ? .5 : .28; it.h = (land ? 3 : 2) * (it.asp > 1 ? .72 : 1);
          it.pos.set(side * ((land ? 1.15 : .45) + it.h * it.asp * .5 * Math.cos(ry)), ((j % 3) - 1) * .3, se.zc - 6 - j * 5.5); it.rot.set(0, -side * ry, 0); } },
      stack: { hold: true,                                                // a pile; each scroll step throws the top print aside, the last one stays
        put(se, it, j, n, q) { const dir = j % 2 ? 1 : -1, a0 = .24 + j * (.36 / Math.max(1, n - 1)), f = j < n - 1 ? sstep(a0, a0 + .13, q) : 0, r = Math.sin(j * 12.9898) * .07;
          it.bend = 0; it.h = (land ? 3.3 : 2.5) * (it.asp > 1 ? .7 : 1);
          it.pos.set(dir * f * (land ? 9.5 : 5), (land ? .4 : .7) + f * 1.1, se.zc - 7.5 - j * .22 + f * 1.4); it.rot.set(0, dir * f * .5, r + dir * f * .8);
          it.capA = (1 - sstep(0, .5, f)) * (j > 0 ? sstep(a0 - .36 / Math.max(1, n - 1) + .06, a0 - .36 / Math.max(1, n - 1) + .13, q) : 1); } }
    };
    const photos = [], KZ = [[0, 7]]; let zc = -12.5;
    SERIES.forEach((se, si) => {
      const L = LAYOUT[se.layout]; se.st = (si + 1) * STEP; se.zc = zc; se.items = [];
      if (L.hold) { KZ.push([se.st - STEP * .3, zc], [se.st + STEP * .3, zc]); zc -= 24; } else { const len = L.len(se.shots.length); KZ.push([se.st - STEP * .34, zc], [se.st + STEP * .36, zc - len]); zc -= len + 13; }
      se.title = textMesh(se.name, { family: F.serif, italic: true, px: 240, ls: -.02, tint: 'pink' });
      se.sub = textMesh(caps(plural('count.series', se.shots.length)), { family: F.mono, px: 26, tint: 'pmuted', ls: .06 });
      sP.add(se.title, se.sub);
      se.shots.forEach((s, k) => {
        const tex = loader.load('/src/img/start/' + s[1] + '.jpg'); tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
        const m = new THREE.Mesh(pgeo, new THREE.ShaderMaterial({
          uniforms: Object.assign({ uTex: { value: tex }, uHov: { value: 0 }, uBend: { value: 1 }, uSeed: { value: photos.length * 1.7 }, uNear: { value: L.hold ? 1 : 0 } }, UP),
          vertexShader: `uniform float uVel,uTime,uSeed,uHov,uBend; varying vec2 vUv; varying float vD;
            void main(){ vUv=uv; vec3 p=position; float w=sin(uv.y*3.1416)*sin(uv.x*3.1416);
              p.z+=(w*clamp(uVel,-1.0,1.0)*0.9 + sin(uv.x*4.0+uTime*1.2+uSeed)*0.04*(1.0-uHov))*uBend;
              vec4 mv=modelViewMatrix*vec4(p,1.0); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
          fragmentShader: `uniform sampler2D uTex; uniform vec3 uBg; uniform float uVel,uHov,uNear; varying vec2 vUv; varying float vD;
            void main(){ vec2 uv=(vUv-0.5)*(1.0-uHov*0.06)+0.5; float s=clamp(uVel,-1.0,1.0)*0.03;
              vec3 c=vec3(texture2D(uTex,uv+vec2(0.0,s)).r, texture2D(uTex,uv).g, texture2D(uTex,uv-vec2(0.0,s)).b);
              float g=dot(c,vec3(0.3,0.59,0.11)); c=mix(vec3(g),c,0.8+uHov*0.2);
              c=mix(c,uBg,uNear*(1.0-smoothstep(2.2,5.2,vD)));   // prints of a held series fade before the camera passes through them
              gl_FragColor=vec4(mix(c,uBg,smoothstep(10.0,24.0,vD)*0.95),1.0); }`
        }));
        const it = { m, i: photos.length, name: s[0], asp: s[2], sc: 1, pos: new THREE.Vector3(), rot: new THREE.Euler(), h: 3, capA: 1 };
        it.cap = textMesh(caps(s[0]), { family: F.mono, px: 30, ls: .06, tint: 'pink' });
        m.userData.i = it.i; sP.add(m, it.cap); photos.push(it); se.items.push(it);
      });
    });
    const ZE = zc - 7.5; KZ.push([1, KZ[KZ.length - 1][1]]);
    const P = {
      title: textMesh(txt('nav.photo'), { family: F.serif, italic: true, px: 240, ls: -.02, tint: 'pink' }), sub: textMesh(caps(plural('count.images', NSHOTS)), { family: F.mono, px: 26, tint: 'pmuted', ls: .06 }),
      end: textMesh(txt('contact.title'), { family: F.serif, italic: true, px: 240, ls: -.02, tint: 'pink' })
    };
    Object.values(P).forEach(m => sP.add(m)); P.end.userData.o = 0;
    const layoutP = () => {
      const asp = W / H, big = asp > 1; land = big; camP.aspect = asp; camP.updateProjectionMatrix();
      const vw = 2 * 7 * TAN * asp, th = fitW(P.title, vw * (big ? .56 : .9), 0, 0, 0); fitW(P.sub, vw * (big ? .07 : .2), 0, th * .5, 0);
      SERIES.forEach(se => {
        // under a held series the title stands below the prints and keeps its line inside the frame, in any window: it is no taller than 1.2 (1 upright), and its line ends .25 above the bottom edge
        const hold = LAYOUT[se.layout].hold, ar = se.title.userData.w / se.title.userData.h, tw = Math.min(vw * (big ? .3 : .62) * clamp(se.name.length / 5, .8, big ? 1.3 : 1.05), ar * (big ? 1.2 : 1));
        const sw = vw * (big ? .13 : .4), sh = sw * se.sub.userData.h / se.sub.userData.w, th = tw / ar, half = 5.9 * TAN;
        const h = fitW(se.title, tw, 0, hold ? -half + .25 + sh / 2 + th * .44 : big ? 0 : 1.45, se.zc - (hold ? 5.9 : 4.5));   // upright, a tunnel title floats above the prints, which stand close to the middle
        fitW(se.sub, sw, 0, se.title.position.y - h * .44, se.title.position.z);
      });
      const vw2 = 2 * 7.5 * TAN * asp, eh = fitW(P.end, vw2 * (big ? .5 : .86), 0, big ? 1.5 : 1.75, ZE);
    };
    const zAt = u => { let i = 0; while (i < KZ.length - 2 && u > KZ[i + 1][0]) i++; const a = KZ[i], b = KZ[i + 1]; return lerp(a[1], b[1], ease(clamp((u - a[0]) / (b[0] - a[0]), 0, 1))); };
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), meshes = photos.map(p => p.m);
    let tapHover = -1;
    const pick = (x, y) => { ndc.set(x / W * 2 - 1, -(y / H * 2 - 1)); ray.setFromCamera(ndc, camP); const hit = ray.intersectObjects(meshes)[0]; return hit && hit.distance < 12 ? hit.object.userData.i : -1; };
    const updateP = (t) => {
      const z = zAt(up), mx = ptr.sx / W - .5, my = ptr.sy / H - .5;
      camP.position.set(mx * .5, -my * .32, z); camP.rotation.set(my * .03, -mx * .05, -vel * 2.4);
      UP.uVel.value = vel * 34; UP.uTime.value = t;
      hover = FINE ? (ptr.inside && mixNow > .5 ? pick(ptr.x, ptr.y) : -1) : tapHover;
      SERIES.forEach(se => { const L = LAYOUT[se.layout], q = clamp((up - se.st) / STEP + .5, 0, 1), n = se.items.length;
        se.items.forEach((it, j) => { it.capA = 1; it.bend = 1; L.put(se, it, j, n, q, t); it.m.material.uniforms.uBend.value = it.bend;
          const on = hover === it.i ? 1 : 0, u = it.m.material.uniforms.uHov; u.value += (on - u.value) * .12; it.sc += ((on ? 1.12 : 1) - it.sc) * .12;
          it.m.position.copy(it.pos); it.m.position.y += Math.sin(t * .7 + it.i * 1.3) * .04; it.m.rotation.copy(it.rot); it.m.scale.set(it.h * it.asp * it.sc, it.h * it.sc, 1);
          const d = z - it.pos.z; it.cap.rotation.copy(it.rot); fitW(it.cap, Math.min(it.h * it.asp * .5, it.cap.userData.w / 190), it.pos.x, it.pos.y - it.h / 2 - .15, it.pos.z + .01);
          op(it.cap, (1 - sstep(8, 14, d)) * sstep(.6, 2, d) * it.capA); });
        // a held title is gone before the camera moves up to it, so it never grows past the frame; a tunnel title is flown through
        const d = z - se.title.position.z, a = (1 - sstep(8.5, 14, d)) * (LAYOUT[se.layout].hold ? sstep(3.4, 5.4, d) : sstep(.4, 2.2, d)); op(se.title, a); op(se.sub, a * sstep(3.6, 5.4, d)); });
      op(P.title, sstep(.3, 2.2, z)); op(P.sub, sstep(4.5, 6.5, z));
      const dE = z - ZE; op(P.end, 1 - sstep(9, 17, dE));
    };

    /* =================== lens, hold, crossing =================== */
    const TW = 256, trail = document.createElement('canvas'), tx = trail.getContext('2d');
    const sizeTrail = () => { trail.width = TW; trail.height = Math.max(64, Math.round(TW * H / W)); tx.fillStyle = '#000'; tx.fillRect(0, 0, trail.width, trail.height); };
    sizeTrail();
    const trailTex = new THREE.CanvasTexture(trail); trailTex.minFilter = THREE.LinearFilter; trailTex.generateMipmaps = false;
    const stamp = (x, y, r, a) => { const k = trail.width / W, g = tx.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.55, `rgba(255,255,255,${a * .55})`); g.addColorStop(1, 'rgba(255,255,255,0)'); tx.globalCompositeOperation = 'lighter'; tx.fillStyle = g; tx.beginPath(); tx.arc(x * k, y * k, r * k, 0, 7); tx.fill(); };
    const UC = { tC: { value: rtC.texture }, tP: { value: rtP.texture }, tTrail: { value: trailTex }, uMix: { value: 0 }, uHold: { value: 0 }, uLens: { value: 1 }, uPos: { value: new THREE.Vector2(.5, .5) }, uHPos: { value: new THREE.Vector2(.5, .5) }, uTime: { value: 0 }, uAsp: { value: W / H } };
    const sQ = new THREE.Scene(), camQ = new THREE.Camera();
    sQ.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: UC, depthTest: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
      fragmentShader: `uniform sampler2D tC,tP,tTrail; uniform float uMix,uHold,uLens,uTime,uAsp; uniform vec2 uPos,uHPos; varying vec2 vUv;
        float nz(vec2 p){ return sin(p.x*3.1+uTime*0.9)*sin(p.y*2.7-uTime*0.7)*0.6+sin(p.x*7.3-uTime*1.3+p.y*5.1)*0.4; }
        vec3 ring(vec2 q,float R,float k){ float d=length(q)+nz(q*4.0)*0.035*(0.35+k); float on=step(0.0005,k);
          return vec3(1.0-smoothstep(R-0.012,R,d), smoothstep(R-0.3,R,d)*(1.0-smoothstep(R,R+0.012,d)), (1.0-smoothstep(R,R+0.2,d))*smoothstep(R-0.012,R,d))*on; }
        void main(){ vec2 uv=vUv, A=vec2(uAsp,1.0); float m=texture2D(tTrail,uv).r*uLens; vec2 e=vec2(0.014,0.0);
          vec2 g=vec2(texture2D(tTrail,uv+e.xy).r-texture2D(tTrail,uv-e.xy).r, texture2D(tTrail,uv+e.yx*uAsp).r-texture2D(tTrail,uv-e.yx*uAsp).r)*uLens;
          float lens=smoothstep(0.4,0.56,m+nz(uv*A*5.0)*0.07*step(0.03,m));
          float rimw=smoothstep(0.28,0.5,m)*(1.0-smoothstep(0.6,0.92,m));
          float Rm=length(A)+0.3; vec2 q1=(uv-uPos)*A, q2=(uv-uHPos)*A;
          vec3 r1=ring(q1,pow(uMix,1.7)*Rm,uMix), r2=ring(q2,uHold*uHold*Rm,uHold);
          vec2 d1=normalize(q1+1e-5)/A, d2=normalize(q2+1e-5)/A;
          float look=max(lens,r2.x); float showP=mix(r1.x,1.0-r1.x,look);
          vec2 disp=g*0.12*rimw+d1*r1.y*r1.y*0.07+d2*r2.y*r2.y*0.07+d1*r1.z*0.035+d2*r2.z*0.035-g*0.06*(1.0-lens)*smoothstep(0.1,0.4,m);
          vec2 u2=uv-disp; vec2 ca=normalize(disp+1e-6)*(length(disp)*0.28+(r1.y+r2.y)*0.004);
          vec3 c=mix(vec3(texture2D(tC,u2+ca).r,texture2D(tC,u2).g,texture2D(tC,u2-ca).b), vec3(texture2D(tP,u2+ca).r,texture2D(tP,u2).g,texture2D(tP,u2-ca).b), showP);
          float rim=lens*(1.0-lens)*4.0+r1.y*r1.y+r2.y*r2.y; c=mix(c,vec3(0.5),rim*0.12);
          gl_FragColor=vec4(c,1.0); }`
    })));

    const hold = { v: 0, tw: null, timer: 0, touch: false };
    const nav = $$('.switch [data-go]'), ring = $('#ring'), ringFg = $('#ring-fg'), ringL = $('#ring-l');
    let looked = false;
    const jump = { v: 0, from: 0, to: 0, on: false, pos: new THREE.Vector2(.5, .5) };
    const goWorld = (w, x, y) => { if (jump.on) return; skip = true; jump.on = true; jump.v = 0; jump.from = mixNow; jump.to = w === 'p' ? 1 : 0; jump.pos.set(x / W, 1 - y / H);
      gsap.to(jump, { v: 1, duration: Math.abs(jump.to - jump.from) < .5 ? .01 : 1.1, ease: 'power2.inOut', onComplete: () => { scrollTo(0, (root.scrollHeight - innerHeight) * P_OF[w]); pS = pT = P_OF[w]; vel = 0; jump.on = false; } }); };
    const onTitle = (x, y) => Math.abs(x - W / 2) < Math.max(W * .24, 150) && Math.abs(y - H / 2) < H * .2 && !jump.on ? (pS < .03 && mixNow < .5 ? 'p' : Math.abs(pS - P_OF.p) < .035 && mixNow > .5 ? 'c' : '') : '';
    nav.forEach(b => b.addEventListener('click', () => { const w = b.dataset.go; if (w === 'e') return scrollTo({ top: root.scrollHeight, behavior: 'smooth' }); const r = b.getBoundingClientRect(); goWorld(w, r.left + r.width / 2, r.top + r.height / 2); }));
    $('#home').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    const themeBtn = $('#theme'), MODES = ['', 'light', 'dark'], NAMES = [txt('theme.system'), txt('theme.light'), txt('theme.dark')]; let mode = Math.max(0, MODES.indexOf(root.dataset.theme || ''));
    const showMode = () => { themeBtn.textContent = txt('theme.button', { mode: NAMES[mode] }); themeBtn.setAttribute('aria-label', txt('theme.label', { mode: NAMES[mode] })); };
    showMode();
    themeBtn.addEventListener('click', () => { mode = (mode + 1) % 3; if (MODES[mode]) root.dataset.theme = MODES[mode]; else delete root.dataset.theme;
      try { if (MODES[mode]) localStorage.setItem('juek3y.theme', MODES[mode]); else localStorage.removeItem('juek3y.theme'); } catch (e) { /* private mode: the choice lasts for this visit */ }
      showMode(); });
    const atOrbit = () => ORB && mixNow < .5 && Math.abs(uc - ORB.p) < STEP * .3;
    const atBal = () => BAL && mixNow < .5 && Math.abs(uc - BAL.p) < STEP * .3;
    const atRoute = () => ROU && mixNow < .5 && Math.abs(uc - ROU.p) < STEP * .3;
    const poke = (x, y) => { pluck(x, y, 1000); if (atOrbit()) ORB.add(); if (atBal()) BAL.drop(x - W / 2 < BAL.l.c[0] ? -1 : 1); if (atRoute()) ROU.tap(x, y); };
    // a station opens into its own page out of the accent dot, and closes back into it. The page has its own address (/1000days):
    // the browser's back button closes it, and a visit straight to the address finds it open with its station waiting behind it
    let shown = -1, dOpen = false, dIdx = -1, pushed = false, closing = false;
    const station = i => { const p = (i + 1) * STEP * .44 / ULAST, o = root.style.overflow; root.style.overflow = ''; scrollTo(0, (root.scrollHeight - innerHeight) * p); root.style.overflow = o; pT = pS = p; vel = 0; skip = true; };
    const reach = () => { const dx = dotPos.x * W, dy = (1 - dotPos.y) * H; return [dx, dy, Math.hypot(Math.max(dx, W - dx), Math.max(dy, H - dy)) + 40]; };
    const openDetail = (i, how) => { if (i < 0 || dOpen) return; dOpen = true; dIdx = i; showDetail(i);
      if (how === 'click') { history.pushState({ app: APPS[i].id }, '', BASE + APPS[i].id); pushed = true; }
      if (how === 'direct') gsap.set(detail, { clipPath: 'none' });
      else { const [dx, dy, R] = reach(); gsap.fromTo(detail, { clipPath: `circle(0px at ${dx}px ${dy}px)` }, { clipPath: `circle(${R}px at ${dx}px ${dy}px)`, duration: .95, ease: 'expo.inOut' });
        gsap.fromTo(din.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .07, delay: .32 }); }
      setTimeout(() => { const b = $('#back'); if (b) b.focus({ preventScroll: true }); }, 80); };
    const closeDetail = how => { if (!dOpen || closing) return;
      if (how !== 'pop' && pushed) return history.back();                  // opened from this page: walk back, popstate closes it
      if (how !== 'pop') history.replaceState(null, '', BASE);              // came straight to the address: the start page takes its place
      closing = true; pushed = false; markPage(-1); const [dx, dy, R] = reach();
      gsap.fromTo(detail, { clipPath: `circle(${R}px at ${dx}px ${dy}px)` }, { clipPath: `circle(0px at ${dx}px ${dy}px)`, duration: .7, ease: 'expo.inOut', onComplete: () => {
        detail.classList.remove('on'); detail.setAttribute('aria-hidden', 'true'); root.style.overflow = ''; dOpen = false; closing = false; dIdx = -1; openBtn.focus({ preventScroll: true }); } }); };
    addEventListener('popstate', () => { const i = appAt();
      if (i >= 0 && !dOpen) { station(i); pushed = true; requestAnimationFrame(() => requestAnimationFrame(() => openDetail(i, 'pop'))); }   // forward again: back to the station, then open
      else if (i < 0 && dOpen) closeDetail('pop');
      else if (i >= 0 && i !== dIdx) { dIdx = i; showDetail(i); } });
    openBtn.addEventListener('click', () => openDetail(shown, 'click')); detail.addEventListener('click', e => { if (e.target.closest('#back')) closeDetail('ui'); }); addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail('ui'); });
    const holdStart = (x, y) => { UC.uHPos.value.set(x / W, 1 - y / H); if (hold.tw) hold.tw.kill(); hold.tw = gsap.to(hold, { v: 1, duration: 1.1 * (1 - hold.v) + .05, delay: .16, ease: 'power2.in', onComplete: () => { if (!looked) { looked = true; ringL.textContent = ''; } } }); };
    const holdEnd = () => { clearTimeout(hold.timer); hold.touch = false; if (hold.v <= 0 && !hold.tw) return; if (hold.tw) hold.tw.kill(); hold.tw = gsap.to(hold, { v: 0, duration: .5, ease: 'power3.out', onComplete: () => { hold.tw = null; } }); };
    canvas.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; e.preventDefault(); const w = onTitle(e.clientX, e.clientY); if (w) return goWorld(w, e.clientX, e.clientY); poke(e.clientX, e.clientY); holdStart(e.clientX, e.clientY); });
    addEventListener('pointerup', e => { if (e.pointerType === 'mouse') holdEnd(); }); addEventListener('blur', holdEnd);
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; ptr.x = e.clientX; ptr.y = e.clientY; ptr.inside = true; ptr.last = performance.now(); if (!ptr.moved) { ptr.moved = true; ptr.sx = ptr.lx = ptr.x; ptr.sy = ptr.ly = ptr.y; ring.classList.add('on'); } }, { passive: true });
    root.addEventListener('pointerleave', () => { ptr.inside = false; });
    // touch: scrolling and tapping never open the lens. A short tap pokes the scene; only a long, still press looks across.
    let t0 = null;
    canvas.addEventListener('touchstart', e => { const t = e.touches[0]; if (!t || e.touches.length > 1) return; t0 = { x: t.clientX, y: t.clientY, at: performance.now(), moved: false }; clearTimeout(hold.timer); hold.timer = setTimeout(() => { if (t0 && !t0.moved) { hold.touch = true; holdStart(t0.x, t0.y); } }, 420); }, { passive: true });
    addEventListener('touchmove', e => { const t = e.touches[0]; if (!t || !t0) return; if (Math.hypot(t.clientX - t0.x, t.clientY - t0.y) > 12) { t0.moved = true; clearTimeout(hold.timer); if (hold.touch) holdEnd(); } }, { passive: true });
    addEventListener('touchend', () => { if (t0 && !t0.moved && performance.now() - t0.at < 300) { const w = onTitle(t0.x, t0.y); if (w) goWorld(w, t0.x, t0.y); else poke(t0.x, t0.y); const h = mixNow > .5 ? pick(t0.x, t0.y) : -1; tapHover = h === tapHover ? -1 : h; } t0 = null; holdEnd(); }, { passive: true });
    addEventListener('touchcancel', () => { t0 = null; holdEnd(); }, { passive: true });
    addEventListener('scroll', () => { tapHover = -1; }, { passive: true });
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    const resize = () => {
      W = innerWidth; H = innerHeight; renderer.setSize(W, H, false);
      rtC.dispose(); rtP.dispose(); rtC = mkRT(); rtP = mkRT(); UC.tC.value = rtC.texture; UC.tP.value = rtP.texture; UC.uAsp.value = W / H;
      sizeTrail(); sizeEnv(); layoutC(); layoutP();
    };
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(resize, 120); });
    layoutC(); layoutP();

    const prog = $('#prog'), hint = $('#hint'), legal = $('#legal');
    let tStart = performance.now(), lt = tStart;
    const frame = now => {
      requestAnimationFrame(frame);
      const t = (now - tStart) / 1000, dt = Math.min(.033, (now - lt) / 1000); lt = now;
      const max = root.scrollHeight - innerHeight; pT = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
      const prev = pS; pS += (pT - pS) * (1 - Math.exp(-dt * 6.5)); vel += ((pS - prev) - vel) * .2;
      ptr.sx += (ptr.x - ptr.sx) * .16; ptr.sy += (ptr.y - ptr.sy) * .16;

      tx.globalCompositeOperation = 'source-over'; tx.fillStyle = 'rgba(0,0,0,.075)'; tx.fillRect(0, 0, trail.width, trail.height);
      const big = Math.max(1 - sstep(.008, .045, pS), pS > X1 ? 1 - sstep(P_OF.p + .004, P_OF.p + .03, pS) : 0);   // large at both chapter titles, small while travelling
      const rad = Math.min(W, H) * lerp(.06, .165, big);
      // near the form and the footer links the lens stays away: it would turn the ground under their text
      const guarded = pS > .975 && [form, legal].some(el => { const r = el.getBoundingClientRect(); return ptr.sx > r.left - rad && ptr.sx < r.right + rad && ptr.sy > r.top - rad && ptr.sy < r.bottom + rad; });
      if (guarded) { tx.fillStyle = 'rgba(0,0,0,.3)'; tx.fillRect(0, 0, trail.width, trail.height); ptr.lx = ptr.sx; ptr.ly = ptr.sy; }
      else if (FINE && ptr.moved && ptr.inside) { const steps = clamp(Math.ceil(Math.hypot(ptr.sx - ptr.lx, ptr.sy - ptr.ly) / (rad * .25)), 1, 8); for (let i = 1; i <= steps; i++) stamp(lerp(ptr.lx, ptr.sx, i / steps), lerp(ptr.ly, ptr.sy, i / steps), rad, .2); ptr.lx = ptr.sx; ptr.ly = ptr.sy; }
      else if (!ptr.moved && t < 7.3 && t > 4.6 && pS < .02) { const u = (t - 4.6) / 2.7, k = Math.sin(Math.PI * u); stamp(W * (.16 + .68 * u), H * (.5 + .16 * Math.sin(u * 7)), rad * (.5 + .7 * k), .22 * k + .02); }
      trailTex.needsUpdate = true;

      // each world's own timeline; the hidden one follows as the sibling station and swaps while nobody can see it
      mixNow = mixAt(pS);
      const quiet = (1 - sstep(X0 - .05, X0 - .01, pS) * (1 - sstep(X1 + .0008, X1 + .004, pS))) * (1 - sstep(X2 - .06, X2 - .02, pS) * (1 - sstep(X3 + .005, X3 + .03, pS)));
      uc = pS < X1 + .0005 ? ucAt(pS) : lerp(upAt(pS), 1, sstep(X2 - .05, X2 - .005, pS)); up = pS > X0 - .03 ? upAt(pS) : ucAt(pS);
      if (jump.on) { mixNow = lerp(jump.from, jump.to, jump.v); if (jump.to) up = 0; else uc = 0; }       // the incoming world is set to its opening while it is still hidden
      updateC(t, dt); updateP(t);
      UC.uMix.value = mixNow; UC.uHold.value = hold.v * quiet; UC.uLens.value = quiet; UC.uTime.value = t; UC.uPos.value.copy(jump.on ? jump.pos : dotPos);
      const lensOn = (FINE && ptr.inside && ptr.moved) || (t > 4.4 && t < 8.5) || now - ptr.last < 1800 || hold.v > 0;
      if (mixNow < .999 || lensOn) { renderer.setRenderTarget(rtC); renderer.setClearColor(COL.bg, 1); renderer.render(sC, camC); }
      if (mixNow > .001 || lensOn) { renderer.setRenderTarget(rtP); renderer.setClearColor(COL.pbg, 1); renderer.render(sP, camP); }
      renderer.setRenderTarget(null); renderer.render(sQ, camQ);

      prog.style.transform = `scaleX(${pT})`; hint.style.opacity = pS < .02 ? 1 : 0;
      const atEnd = pS > .975, inP = mixNow > .5; form.classList.toggle('on', atEnd); legal.classList.toggle('on', atEnd);
      let near = -1; if (mixNow < .5 && !dOpen) CST.forEach((st, i) => { if (st.app && Math.abs(uc - st.p) < STEP * .2) near = i - 1; });
      if (near !== shown) { shown = near; if (near >= 0) openL.textContent = txt('detail.open', { name: APPS[near].name }); openBtn.classList.toggle('on', near >= 0); }
      nav.forEach(n => n.setAttribute('aria-current', String(n.dataset.go === (atEnd ? 'e' : inP ? 'p' : 'c'))));
      ring.style.transform = `translate(${ptr.sx}px,${ptr.sy}px) scale(${1 + hold.v * .35})`; ringFg.style.strokeDashoffset = 1 - hold.v;
      ringL.textContent = hover >= 0 ? photos[hover].name : '';
      canvas.style.cursor = hover >= 0 || atOrbit() || atBal() || atRoute() || onTitle(ptr.x, ptr.y) ? 'pointer' : 'default';
    };
    if (location.hash === '#kontakt') scrollTo(0, root.scrollHeight);   // a link from the legal notice leads straight to the form
    if (early >= 0) { station(early); openDetail(early, 'direct'); }
    requestAnimationFrame(frame);
  };

  const fonts = [`400 80px 'Geist Mono'`, `600 80px Geist`, `400 40px Geist`, `italic 400 80px 'Instrument Serif'`];
  const ready = document.fonts && document.fonts.load ? Promise.all(fonts.map(f => document.fonts.load(f).catch(() => 0))) : Promise.resolve();
  Promise.race([ready, new Promise(r => setTimeout(r, 2500))]).then(boot);
})();

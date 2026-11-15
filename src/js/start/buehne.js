/* Die Bühne der Startseite: eine feste Fläche, zwei Welten (Code und Fotografie), ein Übergang.
   Inhalt steht in inhalt.js, alle Wörter in texte.de.js und texte.en.js. Hier steht nur, wie es sich bewegt.
   Braucht gsap und THREE (src/js/lib), die vor dieser Datei geladen werden. */
import { APPS as APP_LIST, SERIEN, MAIL } from './inhalt.js';
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
  $('#note').innerHTML = txt('form.note', { privacy: `<a href="${txt('legal.site.path')}">${txt('legal.site.label')}</a>`, mail: MAIL_LINK });
  $('#done').innerHTML = `${txt('form.done')}<small>${txt('form.doneHint')}</small>`;
  $('#e-send').innerHTML = txt('form.failed', { mail: MAIL_LINK });
  const SITE_LEGAL = ['imprint', 'site'].map(k => `<a href="${txt('legal.' + k + '.path')}">${txt('legal.' + k + '.label')}</a>`);
  $('#legal-links').innerHTML = SITE_LEGAL.join(' · ');
  // the plain document is generated from the same lists: it is what readers, reduced motion and browsers without WebGL get
  const other = $('#lang');
  $('#plain').innerHTML = `<h1>JueK3y<i class="pt">.</i> ${txt('plain.title')}</h1><section><h2>${txt('nav.code')}</h2><ul>${APPS.map(a => `<li><b>${a.name}</b>${a.desc}</li>`).join('')}</ul></section>` +
    SERIES.map(s => `<section><h2>${s.name}</h2><div class="shots">${s.shots.map(x => `<img src="/src/img/start/${x[1]}.jpg" alt="${x[0]}" loading="lazy">`).join('')}</div></section>`).join('') +
    `<section id="kontakt"><h2>${txt('nav.contact')}</h2><div id="plain-form"></div><p class="mail">${MAIL}</p></section>` +
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
  const plainForm = () => { $('#plain-form').append(form); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof THREE === 'undefined' || typeof gsap === 'undefined') return plainForm();
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { return plainForm(); }
  root.classList.add('fx');

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
    const ghostMat = basic('ink'), ghostLine = new THREE.Mesh(ggeo, ghostMat); ghostMat.side = THREE.DoubleSide; ghostLine.frustumCulled = false; sC.add(ghostLine);   // the stretch of a route not yet travelled
    const line = new THREE.Mesh(lgeo, inkMat); line.frustumCulled = false; sC.add(line);
    const over = new THREE.Group(); sC.add(over);                         // things that sit on the line
    const hairMat = basic('ink'), hair = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hairMat); sC.add(hair);   // the level at which text is wiped, shown only while it moves
    const disc = new THREE.CircleGeometry(1, 40);
    const capA = new THREE.Mesh(disc, inkMat);
    const dotCol = new THREE.Color(), dotMat = new THREE.MeshBasicMaterial({ depthTest: false }); dotMat.color = dotCol;
    const capB = new THREE.Mesh(disc, dotMat);
    sC.add(capA, capB);

    const resample = pts => {
      const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const L = d[d.length - 1], out = []; let j = 0;
      for (let i = 0; i < N; i++) { const t = L * i / (N - 1); while (j < d.length - 2 && d[j + 1] < t) j++; const f = (t - d[j]) / Math.max(1e-6, d[j + 1] - d[j]); out.push([lerp(pts[j][0], pts[j + 1][0], f), lerp(pts[j][1], pts[j + 1][1], f)]); }
      return out;
    };
    const bez = (a, b, c, d, n) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); } return o; };
    const smooth = (p, n) => { for (let k = 0; k < n; k++) for (let i = 1; i < p.length - 1; i++) p[i] = [(p[i - 1][0] + p[i][0] * 2 + p[i + 1][0]) / 4, (p[i - 1][1] + p[i][1] * 2 + p[i + 1][1]) / 4]; return p; };
    const TILT = .92, ell = (a, r) => { const x = Math.cos(a) * r, y = Math.sin(a) * r * .5; return [x * Math.cos(TILT) - y * Math.sin(TILT), x * Math.sin(TILT) + y * Math.cos(TILT)]; };
    const orbitPts = Array.from({ length: N }, () => [0, 0]), beamPts = Array.from({ length: N }, (_, i) => [-1 + 2 * i / (N - 1), 0]);
    const SHAPE = {
      flat: resample([[-1, 0], [1, 0]]),
      route: resample(bez([-1, -.8], [-.4, -.8], [-.55, 0], [0, 0], 40).concat(bez([0, 0], [.55, 0], [.4, .8], [1, .8], 40))),
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
    // small text scrolls with the page and is rubbed out where it meets the line; names of route and balance scenes ride on the line
    T.app = APPS.map((a, i) => { const o = { kind: textMesh(caps(a.kind), { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }), desc: textMesh(a.desc, { family: F.sans, px: 40, tint: 'muted', side: -1 }) };
      if (a.scene === 'orbit') { o.name = textMesh(a.name, { family: F.sans, weight: 600, px: 180, ls: -.045, side: -1 }); gC[i + 1].add(o.name); }
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
      route: { ghost: true,                                              // the dot travels the route and pulls the name behind it; stops open as it reaches them
        init(st) { st.stops = [.03, .34, .65, .97].map((k, j) => [caps(txt('scene.route.stops')[j]), k]).map(([label, k], j) => {
          const lab = textMesh(label, { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }); over.add(lab); return { g: mkRing(), lab, k, j }; }); },
        layout: () => wide ? { c: [0, -H * .07], s: [W * .43, H * .27] } : { c: [0, H * .17], s: [W * .42, H * .1] },
        head: dp => sstep(-.4, .26, dp / STEP),
        update(st, a, q, t, pull, dp, head) { const o = st.txt, L = arc[N - 1], size = Math.min(o.size, L * .56 * o.run.px / o.run.w);
          ride(o.run, size, head * L - o.run.w * size / o.run.px - size * .32, a);
          st.stops.forEach(s => { const i = Math.round(s.k * (N - 1)), x = cur[i * 2], y = cur[i * 2 + 1], pop = back(sstep(s.k - .04, s.k + .05, head + .001));
            s.g.position.set(x, y, 0); s.g.scale.setScalar(thick * 2 * pop * a); s.g.visible = pop * a > .01;
            const last = s.j === st.stops.length - 1;            // labels hang below and to the side the route has not reached, so the line never runs through them
            place(s.lab, x + (last ? thick * 2 : -thick), y - (thick * 2 + (wide ? 17 : 15)), wide ? 12 : 11, last ? 'r' : 'l'); op(s.lab, sstep(.3, 1, pop) * a); }); }
      },
      balance: {                                                         // stand-in until Saldo has its mark: income (filled) and spending (rings) land on a beam, sized by amount
        init(st) { st.th = 0; st.om = 0; st.coins = []; st.sum = 0; st.shown = 0; st.auto = 0;
          const tri = new THREE.Shape(); tri.moveTo(0, 0); tri.lineTo(.62, -1); tri.lineTo(-.62, -1); tri.closePath(); st.pivot = new THREE.Mesh(new THREE.ShapeGeometry(tri), inkMat); under.add(st.pivot);
          st.num = textMesh(euroS.format(0), { family: F.mono, px: 64, ls: -.02, widest: euroS.format(-8888.88), side: -1 }); st.note = textMesh(caps(txt('scene.balance.note')), { family: F.mono, px: 26, tint: 'muted', ls: .06, side: -1 }); over.add(st.num, st.note);
          const PLUS = [620, 410.5, 254, 120, 80, 45], MINUS = [180, 95.5, 60, 35, 20, 12];
          st.drop = side => { const n = st.coins.filter(c => c.side === side).length; if (n >= 6) return; const v = (side > 0 ? PLUS : MINUS)[n]; let g;
            if (side > 0) { g = new THREE.Mesh(disc, inkMat); over.add(g); } else g = mkRing();
            st.coins.push({ side, n, g, r: 1.15 + Math.sqrt(v) / 20, born: performance.now() }); st.sum += side * v; st.om -= side * (1 + Math.sqrt(v) / 22); }; },
        layout: () => { const S = wide ? Math.min(W * .3, H * .5) : W * .4; return { c: wide ? [W * .1, H * .04] : [0, H * .18], s: [S, S] }; },
        update(st, a, q, t, pull, dp, head, dt, soft) { const AUTO = [[.2, 1], [.34, -1], [.48, 1], [.62, 1], [.76, -1]]; while (st.auto < AUTO.length && q > AUTO[st.auto][0]) st.drop(AUTO[st.auto++][1]);
          const load = st.coins.reduce((n, c) => n + c.side * c.r, 0), target = clamp(-load * .045, -.26, .26);
          st.om += ((target - st.th) * 46 - st.om * 5) * dt; st.th += st.om * dt;
          const L = st.l, o = st.txt, len = arc[N - 1], size = Math.min(o.size, len * .3 * o.run.px / o.run.w), now = performance.now();
          ride(o.run, size, len / 2 - o.run.w * size / o.run.px / 2 - st.th * size * 1.5, a);
          st.coins.forEach(c => { const u = .5 + c.side * (.275 + (c.n % 3) * .085), i = Math.round(u * (N - 1)), p0 = Math.max(0, i - 3), p1 = Math.min(N - 1, i + 3), r = thick * c.r;
            const ang = Math.atan2(cur[p1 * 2 + 1] - cur[p0 * 2 + 1], cur[p1 * 2] - cur[p0 * 2]), f = back(clamp((now - c.born) / 520, 0, 1)), upx = thick * .5 + r + (c.n > 2 ? thick * 5.6 : 0) + (1 - f) * H * .3;
            c.g.position.set(cur[i * 2] - Math.sin(ang) * upx, cur[i * 2 + 1] + Math.cos(ang) * upx, 0); c.g.scale.setScalar(r * a); c.g.visible = a > .01; });
          st.pivot.position.set(L.c[0], L.c[1] - thick * .5, 0); st.pivot.scale.setScalar(thick * 4.2 * soft); st.pivot.visible = soft > .01;
          st.shown += (st.sum - st.shown) * .14; const v = Math.round(st.shown * 100) / 100; st.num.set(euroS.format(Math.abs(v) < .005 ? 0 : v));
          const y0 = L.c[1] - thick * 4.9 - (wide ? 56 : 38); place(st.num, L.c[0], y0, wide ? 42 : 24, 'c'); place(st.note, L.c[0], y0 - (wide ? 40 : 26), wide ? 12 : 11, 'c'); op(st.num, a); op(st.note, a); }
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
      T.app.forEach((o, i) => { o.size = ns; const bal = CST[i + 1].sh === 'balance', bx = bal ? x0 : W * .13, by = bal ? -H * .14 : -H * .15;
        if (o.run) { if (wide) { place(o.kind, bx, by, 13, 'l'); place(o.desc, bx, by - 36, ds, 'l'); } else { place(o.kind, 0, -H * .2, 12, 'c'); place(o.desc, 0, -H * .2 - 30, 15, 'c'); } }
        else if (wide) { const y0 = H * .1; place(o.kind, x0, y0 + ns * .82, 13, 'l'); place(o.name, x0, y0, ns, 'l'); place(o.desc, x0, y0 - ns * .85, ds, 'l'); }
        else { const y0 = -H * .12; place(o.kind, 0, y0 + ns * .9, 12, 'c'); place(o.name, 0, y0, ns, 'c'); place(o.desc, 0, y0 - ns * .9, 15, 'c'); } });
      const he = Math.min(W * .125, H * .2), ye = H * .2, we = place(T.end, 0, ye, he, 'c');
      CST.forEach((st, i) => { st.l = st.app ? SCENE[st.sh].layout() : i === 0 ? { c: [0, -hc * .3], s: [wc / 2 + hc * .42, 1] } : { c: [0, ye - he * .68], s: [we / 2, 1] }; });
      CST.forEach((st, i) => { const l = st.l, top = st.sh === 'route' ? l.c[1] + l.s[1] * .8 : st.sh === 'orbit' ? l.c[1] + l.s[1] * .9 : st.sh === 'balance' ? l.c[1] + l.s[0] * .27 : l.c[1]; let bt = -1e9, bb = 1e9;
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
      const hA = sa && sa.head ? sa.head(uc - a.p) : 1, hB = sb && sb.head ? sb.head(uc - b.p) : 1, head = lerp(hA, hB, e), hi = Math.max(1, Math.round(head * (N - 1)));
      const ghost = (sa && sa.ghost ? 1 - e : 0) + (sb && sb.ghost ? e : 0), own = e < .5 ? i0 : i0 + 1, pk = 1 - pull * .12, dipK = Math.sin(Math.PI * e);
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
      lgeo.attributes.position.needsUpdate = true; lgeo.setDrawRange(0, hi * 6); ggeo.attributes.position.needsUpdate = true; ghostMat.opacity = .34 * ghost; ghostLine.visible = ghost > .01;
      capA.position.set(cur[0], cur[1], 0); capA.scale.setScalar(thick / 2);
      const ex = cur[hi * 2], ey = cur[hi * 2 + 1];
      capB.position.set(ex, ey, 0); capB.scale.setScalar(thick * (1.7 + Math.sin(t * 3) * .12 + pull * 2.2));
      dotPos.set((ex + W / 2) / W, (ey + H / 2) / H);
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
    const LAYOUT = {
      wave: { hold: true,                                                 // a strip that rolls past like a swell; it only slides as far as needed to show every print in full
        put(se, it, j, n, q, t) { const gap = wide ? 2.75 : 1.95, w = it.h * it.asp, vis = 2 * 7.5 * TAN * camP.aspect * .84, over = Math.max(wide ? 1.2 : 0, (n - 1) * gap + w - vis);
          const x = (j - (n - 1) / 2) * gap - (sstep(.22, .6, q) - .5) * over, ph = x * .7 + t * .8;
          it.h = wide ? 3 : 2.3; it.pos.set(x, Math.sin(ph) * .32 + (wide ? .15 : .6), se.zc - 7.5 - Math.abs(x) * .12); it.rot.set(0, -x * .07, Math.cos(ph) * .1); } },
      tunnel: { hold: false, len: n => (n - 1) * 5.5,                       // photos on both walls, you fly through; wide prints stand further out so nothing is clipped
        put(se, it, j, n) { const side = j % 2 ? 1 : -1, ry = wide ? .5 : .28; it.h = (wide ? 3 : 2) * (it.asp > 1 ? .72 : 1);
          it.pos.set(side * ((wide ? 1.15 : .45) + it.h * it.asp * .5 * Math.cos(ry)), ((j % 3) - 1) * .3, se.zc - 6 - j * 5.5); it.rot.set(0, -side * ry, 0); } },
      stack: { hold: true,                                                // a pile; each scroll step throws the top print aside, the last one stays
        put(se, it, j, n, q) { const dir = j % 2 ? 1 : -1, a0 = .24 + j * (.36 / Math.max(1, n - 1)), f = j < n - 1 ? sstep(a0, a0 + .13, q) : 0, r = Math.sin(j * 12.9898) * .07;
          it.bend = 0; it.h = (wide ? 3.3 : 2.5) * (it.asp > 1 ? .7 : 1);
          it.pos.set(dir * f * (wide ? 9.5 : 5), (wide ? .25 : .7) + f * 1.1, se.zc - 7.5 - j * .22 + f * 1.4); it.rot.set(0, dir * f * .5, r + dir * f * .8);
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
          uniforms: Object.assign({ uTex: { value: tex }, uHov: { value: 0 }, uBend: { value: 1 }, uSeed: { value: photos.length * 1.7 } }, UP),
          vertexShader: `uniform float uVel,uTime,uSeed,uHov,uBend; varying vec2 vUv; varying float vD;
            void main(){ vUv=uv; vec3 p=position; float w=sin(uv.y*3.1416)*sin(uv.x*3.1416);
              p.z+=(w*clamp(uVel,-1.0,1.0)*0.9 + sin(uv.x*4.0+uTime*1.2+uSeed)*0.04*(1.0-uHov))*uBend;
              vec4 mv=modelViewMatrix*vec4(p,1.0); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
          fragmentShader: `uniform sampler2D uTex; uniform vec3 uBg; uniform float uVel,uHov; varying vec2 vUv; varying float vD;
            void main(){ vec2 uv=(vUv-0.5)*(1.0-uHov*0.06)+0.5; float s=clamp(uVel,-1.0,1.0)*0.03;
              vec3 c=vec3(texture2D(uTex,uv+vec2(0.0,s)).r, texture2D(uTex,uv).g, texture2D(uTex,uv-vec2(0.0,s)).b);
              float g=dot(c,vec3(0.3,0.59,0.11)); c=mix(vec3(g),c,0.8+uHov*0.2);
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
      const asp = W / H, big = asp > 1; camP.aspect = asp; camP.updateProjectionMatrix();
      const vw = 2 * 7 * TAN * asp, th = fitW(P.title, vw * (big ? .56 : .9), 0, 0, 0); fitW(P.sub, vw * (big ? .07 : .2), 0, th * .5, 0);
      SERIES.forEach(se => {
        const hold = LAYOUT[se.layout].hold, tw = vw * (big ? .3 : .62) * clamp(se.name.length / 5, .8, big ? 1.3 : 1.05);
        const h = fitW(se.title, tw, 0, hold ? (big ? -1.6 : -1.7) : 0, se.zc - (hold ? 5.9 : 4.5));
        fitW(se.sub, vw * (big ? .13 : .4), 0, se.title.position.y - h * .44, se.title.position.z);
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
        const d = z - se.title.position.z, a = (1 - sstep(8.5, 14, d)) * sstep(.4, 2.2, d); op(se.title, a); op(se.sub, a * sstep(3, 5, d)); });
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
    const poke = (x, y) => { pluck(x, y, 1000); if (atOrbit()) ORB.add(); if (atBal()) BAL.drop(x - W / 2 < BAL.l.c[0] ? -1 : 1); };
    // a station opens into its own page out of the accent dot; on the real site this is a real address
    const detail = $('#detail'), din = $('#d-in'), openBtn = $('#open'), openL = $('#open-l'); let shown = -1, dOpen = false, dx = 0, dy = 0;
    const fill = a => { din.innerHTML = `<div class="d-bar"><button class="back" id="back">← ${txt('detail.back')}</button><span class="mono">${a.kind}</span></div>`
      + `<header class="d-head">${a.icon || ''}<h2>${a.name}</h2></header><p class="d-lead">${a.desc}</p>`
      + `<ul class="d-facts">${a.facts.map(f => `<li>${f}</li>`).join('')}</ul>`
      + `<p class="d-legal mono">${a.legal.concat([[txt('legal.imprint.label'), txt('legal.imprint.path')]]).map(l => `<a href="${l[1]}">${l[0]}</a>`).join(' · ')}</p>`; };
    const openDetail = () => { if (shown < 0 || dOpen) return; dOpen = true; fill(APPS[shown]); dx = dotPos.x * W; dy = (1 - dotPos.y) * H; const R = Math.hypot(Math.max(dx, W - dx), Math.max(dy, H - dy)) + 40;
      detail.classList.add('on'); detail.scrollTop = 0; detail.setAttribute('aria-hidden', 'false'); root.style.overflow = 'hidden';
      gsap.fromTo(detail, { clipPath: `circle(0px at ${dx}px ${dy}px)` }, { clipPath: `circle(${R}px at ${dx}px ${dy}px)`, duration: .95, ease: 'expo.inOut' });
      gsap.fromTo(din.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .07, delay: .32 }); setTimeout(() => { const b = $('#back'); if (b) b.focus(); }, 80); };
    const closeDetail = () => { if (!dOpen) return; gsap.to(detail, { clipPath: `circle(0px at ${dx}px ${dy}px)`, duration: .7, ease: 'expo.inOut', onComplete: () => { detail.classList.remove('on'); detail.setAttribute('aria-hidden', 'true'); root.style.overflow = ''; dOpen = false; openBtn.focus(); } }); };
    openBtn.addEventListener('click', openDetail); detail.addEventListener('click', e => { if (e.target.closest('#back')) closeDetail(); }); addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
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
      const rad = Math.min(W, H) * lerp(.06, .165, 1 - sstep(.008, .045, pS));
      if (FINE && ptr.moved && ptr.inside) { const steps = clamp(Math.ceil(Math.hypot(ptr.sx - ptr.lx, ptr.sy - ptr.ly) / (rad * .25)), 1, 8); for (let i = 1; i <= steps; i++) stamp(lerp(ptr.lx, ptr.sx, i / steps), lerp(ptr.ly, ptr.sy, i / steps), rad, .2); ptr.lx = ptr.sx; ptr.ly = ptr.sy; }
      else if (!ptr.moved && t < 7.3 && t > 4.6 && pS < .02) { const u = (t - 4.6) / 2.7, k = Math.sin(Math.PI * u); stamp(W * (.16 + .68 * u), H * (.5 + .16 * Math.sin(u * 7)), rad * (.5 + .7 * k), .22 * k + .02); }
      trailTex.needsUpdate = true;

      // each world's own timeline; the hidden one follows as the sibling station and swaps while nobody can see it
      mixNow = mixAt(pS);
      const quiet = (1 - sstep(X0 - .05, X0 - .01, pS) * (1 - sstep(X1 + .01, X1 + .05, pS))) * (1 - sstep(X2 - .06, X2 - .02, pS) * (1 - sstep(X3 + .005, X3 + .03, pS)));
      uc = pS < X1 + .03 ? ucAt(pS) : lerp(upAt(pS), 1, sstep(X2 - .05, X2 - .005, pS)); up = pS > X0 - .03 ? upAt(pS) : ucAt(pS);
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
      canvas.style.cursor = hover >= 0 || atOrbit() || atBal() || onTitle(ptr.x, ptr.y) ? 'pointer' : 'default';
    };
    if (location.hash === '#kontakt') scrollTo(0, root.scrollHeight);   // a link from the legal notice leads straight to the form
    requestAnimationFrame(frame);
  };

  const fonts = [`400 80px 'Geist Mono'`, `600 80px Geist`, `400 40px Geist`, `italic 400 80px 'Instrument Serif'`];
  const ready = document.fonts && document.fonts.load ? Promise.all(fonts.map(f => document.fonts.load(f).catch(() => 0))) : Promise.resolve();
  Promise.race([ready, new Promise(r => setTimeout(r, 2500))]).then(boot);
})();

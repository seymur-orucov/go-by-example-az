// Design v6 "Liquid glass" — platform home. Runs after ../v2/v2.js (window.W3: data, icons, search, reveal).
// 1. Hero: a WebGL liquid-glass form. Glass drops refract the aurora and the hairline grid behind them.
//    Intro: the drops are scattered (each carries a source label: video, forum, pdf…) and then flow
//    together into one form. Afterwards a small drop follows the pointer, any drop can be grabbed and
//    pulled out, and a click on an empty spot splashes the form; it always flows back.
// 2. Sections: roadmap explorer, lesson demo + quiz, stack, platform sections, why + comparison, FAQ, resume.
(function () {
  "use strict";
  const W = window.W3;
  if (!W) return;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = W.esc;
  const motion = !W.reduced;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const clamp01 = (k) => (k < 0 ? 0 : k > 1 ? 1 : k);
  const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const pad = (n) => String(n).padStart(2, "0");
  const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  const tech = (id) => W.TECHS.find((t) => t.id === id);
  const PAGES = window.W3_PAGES || "";
  const ARROW = W.I.arrow;

  const FLAT = W.FLAT;
  const doneN = FLAT.filter((e) => W.learnedSet.has(e.slug)).length;
  const next = FLAT.find((e) => !W.learnedSet.has(e.slug)) || FLAT[0];
  const READY_N = W.READY.size;
  $$("[data-ready-n]").forEach((el) => (el.textContent = READY_N));
  $$("[data-ready-count]").forEach((el) => { el.dataset.count = READY_N; el.textContent = READY_N; });
  // term rule: programming terms stay in English (the shared prototype data still says "massiv")
  const SEC_DESC = { collections: "Array, slice, map və onların üzərində gəzinti." };
  const SUB = { arrays: "Sabit ölçülü array", slices: "Dinamik siyahı" };

  // layout position of el inside an ancestor (ignores transforms, so entrance animations don't skew wires)
  function rel(el, anc) {
    let x = 0, y = 0, n = el;
    while (n && n !== anc) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function roundPath(pts, r) {
    if (!pts.length) return "";
    let d = "M" + pts[0][0] + "," + pts[0][1];
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const ax = x0 - x1, ay = y0 - y1, bx = x2 - x1, by = y2 - y1;
      if (Math.abs(ax * by - ay * bx) < 1e-6) { d += "L" + x1 + "," + y1; continue; }
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), rr = Math.min(r, la / 2, lb / 2);
      d += "L" + (x1 + (ax / la) * rr).toFixed(1) + "," + (y1 + (ay / la) * rr).toFixed(1) + "Q" + x1 + "," + y1 + " " + (x1 + (bx / lb) * rr).toFixed(1) + "," + (y1 + (by / lb) * rr).toFixed(1);
    }
    const l = pts[pts.length - 1];
    return d + "L" + l[0] + "," + l[1];
  }

  // =====================================================================
  // 1. HERO: liquid glass
  // =====================================================================
  const hero = $("#start"), cv = $("#liquid"), stage = $("#stage"), card = $("#stage-card");
  const labelsEl = $("#drop-labels"), splashEl = $("#splash"), title = $("#hero-title");
  const NB = 10, CURSOR = 9, DROPS = 9;
  const SOURCES = ["video", "məqalə", "forum", "pdf", "kurs", "sənəd", "47 tab", "qeyd", "podkast"];
  // the body: three drops that melt into one form (offset x, offset y, radius — in units of R)
  const BODY = [[-0.07, -0.05, 0.3], [0.11, 0.05, 0.25], [-0.03, 0.15, 0.21]];
  // satellites orbiting the body: angle°, distance, radius (R), orbit speed (rad/s)
  const SAT = [[200, 0.6, 0.12, 0.1], [320, 0.57, 0.14, -0.08], [35, 0.64, 0.1, 0.12], [110, 0.6, 0.11, -0.11], [255, 0.76, 0.075, 0.07], [150, 0.86, 0.06, 0.09]];
  const blobs = [];
  for (let i = 0; i < NB; i++) blobs.push({ x: 0, y: 0, vx: 0, vy: 0, r: 0, sx: Math.random(), sy: Math.random(), ph: Math.random() * 6.28, rr: Math.random(), grab: false });
  let Wd = 1, Hd = 1, CX = 0, CY = 0, R = 120;
  let phase = motion ? "chaos" : "form", mergeAt = -1e9, dragging = -1;
  const ptr = { x: 0, y: 0, on: false };

  function layout() {
    Wd = hero.clientWidth; Hd = hero.clientHeight;
    const h = hero.getBoundingClientRect(), z = stage.getBoundingClientRect(), cH = card.offsetHeight + 70;
    CX = z.left - h.left + z.width / 2;
    CY = z.top - h.top + Math.max(80, (z.height - cH) / 2);
    R = Math.max(80, Math.min(z.width * 0.5, (z.height - cH) * 0.62, 300));
  }
  function home(i, t) {
    if (i < 3) {
      const f = BODY[i];
      return [CX + (f[0] + Math.sin(t * 0.7 + i * 2.1) * 0.025) * R, CY + (f[1] + Math.cos(t * 0.6 + i) * 0.02) * R, f[2] * R * (1 + Math.sin(t * 0.9 + i) * 0.03)];
    }
    const s = SAT[i - 3], a = (s[0] * Math.PI) / 180 + t * s[3], d = (s[1] + Math.sin(t * 0.5 + i) * 0.05) * R;
    return [CX + Math.cos(a) * d, CY + Math.sin(a) * d * 0.82, s[2] * R];
  }
  function chaosPos(i, t) {
    const b = blobs[i];
    // size from the smaller side: on phones the hero is tall and narrow
    return [(0.05 + b.sx * 0.9) * Wd + Math.sin(t * 0.45 + b.ph) * 34, (0.14 + b.sy * 0.74) * Hd + Math.cos(t * 0.38 + b.ph * 1.7) * 26, Math.min(Hd, Wd * 1.1) * (0.02 + b.rr * 0.02)];
  }
  function seed() {
    for (let i = 0; i < DROPS; i++) {
      const b = blobs[i], p = motion ? chaosPos(i, 0) : home(i, 0);
      b.x = p[0]; b.y = p[1]; b.r = p[2]; b.vx = b.vy = 0;
    }
    blobs[CURSOR].x = CX; blobs[CURSOR].y = CY;
  }

  // ----- simulation (time-based sub-steps, so it runs the same at any frame rate) -----
  let tStart = performance.now(), lastT = 0;
  const mergeK = (now) => (phase === "form" ? clamp01((now - mergeAt) / 1500) : 0);
  function simulate(now) {
    const t = (now - tStart) / 1000;
    const dt = Math.min(64, lastT ? now - lastT : 16.7); lastT = now;
    const sub = Math.max(1, Math.min(4, Math.round(dt / 16.7)));
    const m = mergeK(now);
    for (let i = 0; i < NB; i++) {
      const b = blobs[i];
      let tx, ty, tr, k, damp = 0.82;
      if (i === CURSOR) { tx = ptr.x; ty = ptr.y; tr = ptr.on && dragging < 0 ? Hd * 0.024 : 0; k = 0.2; damp = 0.62; }
      else if (phase === "chaos") { [tx, ty, tr] = chaosPos(i, t); k = 0.06; }
      else { [tx, ty, tr] = home(i, t); k = 0.01 + 0.04 * easeInOut(m); }
      if (b.grab) { tx = ptr.x; ty = ptr.y; k = 0.24; damp = 0.6; }
      for (let q = 0; q < sub; q++) {
        b.vx += (tx - b.x) * k; b.vy += (ty - b.y) * k;
        b.vx *= damp; b.vy *= damp;
        b.x += b.vx; b.y += b.vy;
        b.r += (tr - b.r) * 0.07;
      }
    }
    return m;
  }

  // ----- labels ride on the drops while they are scattered -----
  labelsEl.innerHTML = SOURCES.map((s) => '<span class="drop-label">' + esc(s) + "</span>").join("");
  const labels = $$(".drop-label", labelsEl);
  let labelsOn = motion;
  function paintLabels() {
    if (!labelsOn) return;
    labels.forEach((el, i) => { const b = blobs[i]; el.style.transform = "translate(" + b.x.toFixed(1) + "px," + (b.y + b.r + 8).toFixed(1) + "px) translateX(-50%)"; });
  }
  if (!motion) labelsEl.hidden = true;

  // ----- WebGL -----
  const FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH", "precision highp float;", "#else", "precision mediump float;", "#endif",
    "uniform vec2 uRes, uFocus; uniform float uT, uDark, uSky, uK;",
    "uniform vec3 uC1, uC2, uC3, uC4, uBg, uInk;",
    "uniform vec4 uB[10];",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }",
    // light ribbons (the v2 aurora, fewer strands)
    "vec3 ribbon(vec2 p, float t, float seed, vec3 ca, vec3 cb, float tilt, float yoff, float amp, float freq){",
    "  vec3 col = vec3(0.0);",
    "  for (int i = 0; i < 5; i++) {",
    "    float fi = float(i);",
    "    float y = yoff + tilt * p.x + sin(p.x * freq + t * 0.32 + seed + fi * 0.09) * amp + sin(p.x * freq * 2.1 - t * 0.21 + seed * 1.7 + fi * 0.13) * amp * 0.35;",
    "    y += (fi - 2.0) * 0.017 * (1.0 + 0.9 * sin(p.x * 1.3 + t * 0.2 + seed));",
    "    float d = abs(p.y - y);",
    "    float w = 0.0022 + 0.0035 * (0.5 + 0.5 * sin(p.x * 2.3 + seed + t * 0.15));",
    "    float g = w / (d + w); g *= g;",
    "    float fade = smoothstep(-1.25, -0.2, p.x + 0.3 * sin(seed)) * smoothstep(1.35, 0.25, p.x - 0.2 * cos(seed));",
    "    vec3 c = mix(ca, cb, 0.5 + 0.5 * sin(p.x * 1.4 + fi * 0.35 + t * 0.25 + seed));",
    "    col += c * g * fade * (0.3 + 0.7 * smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(p.x * 3.0 + fi * 0.7 + t * 0.4)));",
    "  }",
    "  float yc = yoff + tilt * p.x + sin(p.x * freq + t * 0.32 + seed) * amp;",
    "  col += mix(ca, cb, 0.5 + 0.5 * sin(p.x * 1.1 + t * 0.2)) * exp(-pow((p.y - yc) * 4.0, 2.0)) * 0.28 * smoothstep(-1.3, 0.0, p.x) * smoothstep(1.4, 0.2, p.x);",
    "  return col;",
    "}",
    // the backdrop: page colour + ribbons + a hairline grid around the form (the grid makes the refraction readable)
    "vec3 sky(vec2 p){",
    "  float t = uT;",
    "  vec3 a = ribbon(p, t, 0.0, uC1, uC2, -0.32, 0.02, 0.15, 1.9);",
    "  a += ribbon(p, t * 0.8, 2.4, uC2, uC3, 0.22, -0.1, 0.12, 2.4) * 0.8;",
    "  a += ribbon(p, t * 1.1, 4.1, uC4, uC1, -0.08, 0.2, 0.09, 1.4) * 0.55;",
    "  a = (1.0 - exp(-a * 1.25)) * uSky;",
    "  vec2 q = abs(fract(p * 10.0 + 0.5) - 0.5);",
    "  float line = 1.0 - smoothstep(0.0, 14.0 / uRes.y, min(q.x, q.y));",
    "  float gm = exp(-length((p - uFocus) * vec2(0.9, 1.2)) * 2.4) * (0.35 + 0.65 * uSky);",
    "  vec3 col;",
    "  if (uDark > 0.5) col = uBg + a * 0.85 + vec3(0.55, 0.62, 1.0) * 0.08 * line * gm;",
    "  else { float e = max(a.r, max(a.g, a.b)); vec3 hue = a / max(e, 0.001); col = mix(uBg, hue * 0.85, e * 0.4); col = mix(col, uInk, 0.085 * line * gm); }",
    "  return mix(uBg, col, smoothstep(-0.5, -0.28, p.y));",
    "}",
    "float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }",
    "float field(vec2 p){ float d = 10.0; for (int i = 0; i < 10; i++) { vec4 b = uB[i]; if (b.z <= 0.0) continue; d = smin(d, length(p - b.xy) - b.z, uK); } return d; }",
    "float height(float d){ float t = clamp(-d / 0.07, 0.0, 1.0); return sqrt(1.0 - (1.0 - t) * (1.0 - t)); }",
    // Written so that sky() is inlined once and field() four times: on Windows, Chrome translates WebGL to
    // Direct3D (ANGLE) and inlines every call; the first version called sky() up to four times and took
    // tens of seconds to compile on a fresh profile.
    "void main(){",
    "  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;",
    "  float px = 1.0 / uRes.y;",
    "  float d = field(p);",
    "  float h = height(d), e = 1.5 * px;",
    "  float hx = height(field(p + vec2(e, 0.0))) - h;",
    "  float hy = height(field(p + vec2(0.0, e))) - h;",
    "  vec3 n = normalize(vec3(-hx / e, -hy / e, 7.0));",
    "  float g = 1.0 - smoothstep(-1.5 * px, 1.5 * px, d);",          // 1 inside the glass, 0 outside
    // the glass bends the point we look at: one backdrop sample per pixel
    "  vec3 col = sky(p - n.xy * 0.12 * g);",
    // glass body. Dark: it lifts the light. Light: it stays clear (no milky white) with a stronger coloured rim
    "  vec3 gc = uDark > 0.5 ? col * 1.08 + vec3(0.03, 0.035, 0.05) : mix(col, mix(uC2, uC1, 0.5), 0.06);",
    "  float fres = pow(1.0 - n.z, 2.0);",
    "  vec3 rimC = mix(uC1, uC3, clamp(0.5 + 0.5 * n.x - 0.3 * n.y, 0.0, 1.0));",
    "  gc = uDark > 0.5 ? gc + rimC * fres * 0.9 : mix(gc, rimC, fres * 0.75);",
    // a cheap stand-in for chromatic dispersion: cyan on one side of the rim, warm on the other
    "  gc += (uC1 * max(n.x, 0.0) + uC4 * max(-n.x, 0.0)) * fres * 0.3;",
    "  vec3 L = normalize(vec3(-0.5, 0.7, 0.5));",
    "  gc += pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 60.0) * (uDark > 0.5 ? 0.85 : 0.6);",
    "  gc += 0.07 * clamp(dot(n.xy, vec2(-0.6, 0.8)), 0.0, 1.0);",
    "  gc -= 0.06 * clamp(dot(n.xy, vec2(0.6, -0.8)), 0.0, 1.0);",
    // outside: a soft contact shadow and, in the dark theme, a faint glow
    "  float sh = smoothstep(0.08, -0.02, field(p + vec2(-0.01, 0.028)));",
    "  vec3 oc = col * (1.0 - sh * (uDark > 0.5 ? 0.45 : 0.14));",
    "  if (uDark > 0.5) oc += mix(uC2, uC3, 0.5) * 0.09 * exp(-max(d, 0.0) * 22.0);",
    "  col = mix(oc, gc, g);",
    "  float edge = 1.0 - smoothstep(0.0, 2.0 * px, abs(d + px));",
    "  col = mix(col, uDark > 0.5 ? vec3(0.92, 0.95, 1.0) : mix(uInk, uC2, 0.5), edge * (uDark > 0.5 ? 0.35 : 0.22));",
    "  col += (hash(gl_FragCoord.xy + uT) - 0.5) / 255.0;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}",
  ].join("\n");

  function rgbOf(name) {
    const probe = document.createElement("i");
    probe.style.color = "var(" + name + ")"; probe.style.display = "none";
    document.body.appendChild(probe);
    const m = getComputedStyle(probe).color.match(/[\d.]+/g) || [128, 128, 255];
    probe.remove();
    return [m[0] / 255, m[1] / 255, m[2] / 255];
  }

  // The program compiles in the background (KHR_parallel_shader_compile): asking for LINK_STATUS right away
  // would block the page until the GPU driver is done. Until then the hero shows a soft CSS backdrop and the
  // canvas fades in once the first frame is drawn.
  let gl = null, ready = false, U = {}, uB = new Float32Array(NB * 4), mergeTimer = 0;
  const tScript = performance.now();
  (function initGL() {
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false }); } catch (e) { gl = null; }
    if (!gl) { hero.classList.add("no-gl"); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const vs = sh(gl.VERTEX_SHADER, "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }"), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const ext = gl.getExtension("KHR_parallel_shader_compile");
    function finish() {
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; hero.classList.add("no-gl"); return; }
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uRes", "uFocus", "uT", "uDark", "uSky", "uK", "uC1", "uC2", "uC3", "uC4", "uBg", "uInk", "uB"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
      ready = true;
      colors(); sizeCanvas();
      // let the scattered drops be seen before they merge, even on a first visit with a slow compile
      if (motion && phase === "chaos") { clearTimeout(mergeTimer); mergeTimer = setTimeout(startMerge, performance.now() - tScript > 5000 ? 300 : 1300); }
      if (motion) run(); else still();
      requestAnimationFrame(() => hero.classList.add("gl-on"));
    }
    if (!ext) { setTimeout(finish, 0); return; } // no extension: compile synchronously, but after first paint
    (function poll() { if (!gl) return; if (gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR)) finish(); else setTimeout(poll, 50); })();
  })();

  function colors() {
    if (!ready) return;
    gl.uniform3fv(U.uC1, rgbOf("--cyan")); gl.uniform3fv(U.uC2, rgbOf("--accent"));
    gl.uniform3fv(U.uC3, rgbOf("--accent-2")); gl.uniform3fv(U.uC4, rgbOf("--accent-3"));
    gl.uniform3fv(U.uBg, rgbOf("--bg")); gl.uniform3fv(U.uInk, rgbOf("--text"));
    gl.uniform1f(U.uDark, W.isDark() ? 1 : 0);
  }
  // render scale: starts modest and drops further if frames are slow (weak integrated GPUs)
  let quality = 1;
  function sizeCanvas() {
    if (!ready) return;
    // measured on an Intel HD iGPU at 1440px: 792px wide 45 fps, 396px wide 61 fps
    const scale = Math.min(devicePixelRatio || 1, 1.5) * (Wd > 1100 ? 0.5 : 0.7) * quality;
    const w = Math.max(1, Math.round(cv.clientWidth * scale)), h = Math.max(1, Math.round(cv.clientHeight * scale));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(U.uRes, w, h);
  }
  function draw(now, m) {
    if (!ready) return;
    for (let i = 0; i < NB; i++) {
      const b = blobs[i], r = b.r / Hd;
      uB[i * 4] = (b.x - Wd / 2) / Hd; uB[i * 4 + 1] = (Hd / 2 - b.y) / Hd; uB[i * 4 + 2] = r > 0.002 ? r : 0; uB[i * 4 + 3] = 0;
    }
    gl.uniform4fv(U.uB, uB);
    gl.uniform2f(U.uFocus, (CX - Wd / 2) / Hd, (Hd / 2 - CY) / Hd);
    gl.uniform1f(U.uT, 14 + (now - tStart) / 1000);
    gl.uniform1f(U.uK, 0.02 + 0.07 * m);
    gl.uniform1f(U.uSky, 0.42 + 0.58 * m);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ----- loop -----
  let raf = 0, heroVis = true, fpsN = 0, fpsT = 0;
  function adapt(now) {
    if (!fpsT) { fpsT = now; fpsN = 0; return; }
    fpsN++;
    if (now - fpsT < 1500) return;
    const fps = (fpsN * 1000) / (now - fpsT);
    fpsT = now; fpsN = 0;
    if (fps < 48 && quality > 0.61) { quality = Math.max(0.6, quality * 0.85); sizeCanvas(); }
    else if (fps > 57 && quality < 1) { quality = Math.min(1, quality * 1.1); sizeCanvas(); } // the first seconds (fonts, intro) are slow: recover
  }
  function frame(now) {
    raf = 0;
    adapt(now);
    const m = simulate(now);
    if (labelsOn) { paintLabels(); if (m > 0.6) { labelsOn = false; labelsEl.hidden = true; } }
    draw(now, m);
    if (heroVis && !document.hidden) raf = requestAnimationFrame(frame);
    else { lastT = 0; fpsT = 0; }
  }
  const run = () => { if (motion && !raf && heroVis && !document.hidden) raf = requestAnimationFrame(frame); };
  function still() { // one frame for reduced motion, resize and theme changes
    for (let i = 0; i < DROPS; i++) { const h = home(i, 0); blobs[i].x = h[0]; blobs[i].y = h[1]; blobs[i].r = h[2]; }
    blobs[CURSOR].r = 0;
    sizeCanvas(); draw(tStart, 1);
  }

  // ----- intro: scattered sources flow together into one form -----
  const intro = (n) => $$('[data-intro="' + n + '"]').forEach((el) => el.classList.add("in"));
  function startMerge() {
    if (phase === "form") return;
    phase = "form"; mergeAt = performance.now();
    labelsEl.classList.add("gone");
    intro(2); intro(3);
    setTimeout(showCard, 1000);
  }
  function showCard() { card.classList.add("in"); $("#sc-bar").style.setProperty("--p", Math.max(3, Math.round((doneN / FLAT.length) * 100)) + "%"); }
  layout(); sizeCanvas(); colors(); seed();
  if (!motion) {
    title.classList.add("go"); [0, 1, 2, 3].forEach(intro); showCard(); still();
  } else {
    setTimeout(() => intro(0), 80);
    setTimeout(() => title.classList.add("go"), 160);
    setTimeout(() => intro(1), 900);
    if (!ready) mergeTimer = setTimeout(startMerge, 1900); // rescheduled when the glass is ready (see initGL)
    run();
  }
  new IntersectionObserver((e) => { heroVis = e[0].isIntersecting; run(); }, { threshold: 0.01 }).observe(hero);
  document.addEventListener("visibilitychange", run);
  window.addEventListener("w3:look", () => { colors(); if (!motion) still(); });
  let rsz = 0;
  addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { layout(); sizeCanvas(); if (!motion) still(); }, 120); });
  if (document.fonts) document.fonts.ready.then(() => { layout(); sizeCanvas(); if (!motion) still(); });

  // stage card: progress on the Go roadmap
  $("#sc-meta").textContent = W.SECTIONS.length + " bölmə · " + FLAT.length + " mövzu · " + READY_N + " hazır";
  $("#sc-pct").textContent = Math.round((doneN / FLAT.length) * 100) + "%";
  $("#sc-next").textContent = next.title;
  card.href = W.lessonHref(next.slug);
  if (coarse) $("#stage-hint span").textContent = "Toxun — damcılar dağılsın · damcını çək";

  // ----- touch: follow, grab, splash -----
  function hit(x, y) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < DROPS; i++) { const b = blobs[i], d = Math.hypot(b.x - x, b.y - y); if (d < b.r + 12 && d < bd) { bd = d; best = i; } }
    return best;
  }
  function splash(x, y) {
    for (let i = 0; i < DROPS; i++) {
      const b = blobs[i], dx = b.x - x, dy = b.y - y, d = Math.hypot(dx, dy) + 1;
      if (d < 420) { const f = (1 - d / 420) * 30; b.vx += (dx / d) * f; b.vy += (dy / d) * f; }
    }
    splashEl.style.left = x + "px"; splashEl.style.top = y + "px";
    splashEl.classList.remove("go"); void splashEl.offsetWidth; splashEl.classList.add("go");
  }
  const at = (e) => { const r = hero.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
  if (motion && gl) {
    hero.addEventListener("pointermove", (e) => {
      at(e);
      const overUI = !!e.target.closest(".hero-copy, .stage-card, .scroll-cue, a, button");
      ptr.on = e.pointerType === "mouse" && !overUI && phase === "form";
      if (dragging < 0) hero.classList.toggle("grab", !overUI && phase === "form" && hit(ptr.x, ptr.y) >= 0);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { ptr.on = false; hero.classList.remove("grab"); });
    hero.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || e.target.closest("a, button, input, form, .hero-copy, .stage-card")) return;
      at(e);
      if (phase !== "form") { startMerge(); return; } // a click during the scatter brings order at once
      const i = hit(ptr.x, ptr.y);
      if (i >= 0) {
        dragging = i; blobs[i].grab = true;
        hero.classList.add("grabbing");
        try { hero.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      } else splash(ptr.x, ptr.y);
    });
    const release = () => { if (dragging < 0) return; blobs[dragging].grab = false; dragging = -1; hero.classList.remove("grabbing"); };
    hero.addEventListener("pointerup", release);
    hero.addEventListener("pointercancel", release);
  }

  // ----- ask box (from v2) -----
  const ask = $("#ask"), askInput = $("#ask-input");
  ask.addEventListener("submit", (e) => { e.preventDefault(); W.openPalette(askInput.value.trim()); });
  $$("[data-q]", ask).forEach((c) => c.addEventListener("click", () => W.openPalette(c.dataset.q)));
  if (motion) {
    const PH = ["Backend developer olmaq üçün nə öyrənim?", "Go-da goroutine necə işləyir?", "Slice ilə array arasında fərq", "Map-də açar yoxdursa nə qaytarır?", "System design müsahibəsinə hazırlıq"];
    let pi = 0, ci = 0, del = false;
    (function type() {
      if (document.activeElement === askInput || askInput.value) { setTimeout(type, 800); return; }
      const s = PH[pi];
      ci += del ? -1 : 1;
      askInput.placeholder = s.slice(0, ci) + (ci < s.length || del ? "▍" : "");
      let wait = del ? 22 : 48;
      if (!del && ci === s.length) { wait = 2200; del = true; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % PH.length; wait = 400; }
      setTimeout(type, wait);
    })();
  }

  // =====================================================================
  // 2. ROADMAP EXPLORER
  // =====================================================================
  (function roadmap() {
    const S = W.SECTIONS, map = $("#rm-map"), wire = $("#rm-wire"), detail = $("#rm-detail");
    const BACKEND = W.DIRECTIONS.find((d) => d.id === "backend");
    let base = 0;
    const firstNo = S.map((s) => { const b = base; base += s.items.length; return b; });
    const secState = (s) => {
      const n = s.items.length, done = s.items.filter((it) => W.learnedSet.has(it[0])).length, ready = s.items.filter((it) => W.READY.has(it[0])).length;
      const now = next.sid === s.id;
      return { n, done, ready, now, cls: done === n ? "done" : now ? "now" : ready ? "ready" : "plan" };
    };
    // serpentine on three columns: 1 2 3 / 6 5 4 / 7 8 9
    const cell = (i) => { const r = Math.floor(i / 3), c = i % 3; return "--r:" + (r + 1) + ";--c:" + ((r % 2 ? 2 - c : c) + 1); };
    let view = "go", sel = 0, nowIdx = 0;

    function render() {
      $$(".rm-node", map).forEach((n) => n.remove());
      let html = "";
      if (view === "go") {
        nowIdx = Math.max(0, S.findIndex((s) => s.id === next.sid));
        html = S.map((s, i) => {
          const st = secState(s);
          return '<button class="rm-node ' + st.cls + '" role="tab" aria-selected="false" data-i="' + i + '" style="--i:' + i + ";" + cell(i) + '">' +
            (st.now ? '<span class="rm-here">buradasan</span>' : "") + '<span class="rm-dot">' + pad(i + 1) + "</span><b>" + esc(s.title) + "</b><small>" + st.ready + "/" + st.n + " hazır" + (st.done ? " · " + st.done + " keçilib" : "") + "</small>" +
            '<span class="rm-mini" style="--p:' + Math.round((st.done / st.n) * 100) + '%"><i></i></span></button>';
        }).join("");
      } else {
        nowIdx = BACKEND.techs.indexOf("go");
        html = BACKEND.techs.map((id, i) => {
          const t = tech(id), live = t.status === "live";
          return '<button class="rm-node ' + (live ? "now" : "plan") + '" role="tab" aria-selected="false" data-i="' + i + '" style="--i:' + i + ";" + cell(i) + '">' +
            (live ? '<span class="rm-here">açıqdır</span>' : "") + '<span class="mono-ic rm-dot" style="--c:' + t.c + '">' + esc(t.ic) + "</span><b>" + esc(t.name) + "</b><small>addım " + (i + 1) + "/" + BACKEND.techs.length + " · " + (live ? FLAT.length + " mövzu" : "tezliklə") + "</small></button>";
        }).join("");
      }
      map.insertAdjacentHTML("beforeend", html);
      select(view === "go" ? nowIdx : nowIdx);
      requestAnimationFrame(drawWire);
    }
    function drawWire() {
      const nodes = $$(".rm-node", map);
      if (!nodes.length) return;
      const pts = nodes.map((n) => { const r = rel(n, map); return [Math.round(r.x + r.w / 2), Math.round(r.y + r.h / 2)]; });
      const full = roundPath(pts, 22), prog = roundPath(pts.slice(0, nowIdx + 1), 22);
      wire.innerHTML = '<defs><linearGradient id="rmGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + map.offsetWidth + '" y2="' + map.offsetHeight + '"><stop offset="0" stop-color="var(--cyan)"/><stop offset=".5" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs>' +
        '<path class="base" d="' + full + '"/>' + (nowIdx > 0 ? '<path class="prog" d="' + prog + '"/>' : "") +
        (motion ? '<circle class="pulse" r="4"><animateMotion dur="' + (3 + nodes.length * 0.35).toFixed(1) + 's" repeatCount="indefinite" path="' + full + '"/></circle>' : "");
    }
    function select(i) {
      sel = i;
      $$(".rm-node", map).forEach((n) => n.setAttribute("aria-selected", String(+n.dataset.i === i)));
      if (view === "go") {
        const s = S[i], st = secState(s);
        const firstOpen = s.items.find((it) => !W.learnedSet.has(it[0])) || s.items[0];
        detail.innerHTML = '<div class="rd-head"><span class="n">' + pad(i + 1) + "/" + pad(S.length) + "</span><div><h3>" + esc(s.title) + "</h3><p>" + esc(SEC_DESC[s.id] || s.desc) + "</p></div></div>" +
          '<div class="rd-stats"><span class="chip">' + st.n + ' mövzu</span><span class="chip">' + st.ready + " hazır</span>" + (st.done ? '<span class="chip">' + st.done + " keçilib</span>" : "") + "</div>" +
          '<ol class="rd-list">' + s.items.map((it, k) => {
            const c = W.learnedSet.has(it[0]) ? ["done", "keçilib"] : W.READY.has(it[0]) ? ["ready", "hazırdır"] : ["plan", "yazılır"];
            return '<li><a href="' + W.lessonHref(it[0]) + '" style="--i:' + k + '"><span class="n">' + pad(firstNo[i] + k + 1) + '</span><span class="t"><b>' + esc(it[1]) + "</b><small>" + esc(SUB[it[0]] || it[2]) + '</small></span><span class="st ' + c[0] + '">' + c[1] + "</span></a></li>";
          }).join("") + "</ol>" +
          '<div class="rd-foot"><a class="btn btn-sm btn-primary" href="' + W.lessonHref(firstOpen[0]) + '">' + (st.done ? "Davam et" : "Bölmədən başla") + ' <span class="arrow">' + ARROW + '</span></a><a class="btn btn-sm" href="' + PAGES + 'roadmap.html">Tam xəritə</a></div>';
      } else {
        const id = BACKEND.techs[i], t = tech(id), live = t.status === "live";
        const dirs = W.DIRECTIONS.filter((d) => d.techs.includes(id)).map((d) => d.name);
        detail.innerHTML = '<div class="rd-head"><span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><div><h3>" + esc(t.name) + "</h3><p>" + esc(t.desc) + "</p></div></div>" +
          '<div class="rd-stats"><span class="chip">Backend · addım ' + (i + 1) + "/" + BACKEND.techs.length + "</span>" + W.badge(live ? "live" : "soon") + "</div>" +
          '<p class="muted" style="font-size:14px">' + (live
            ? "Go xəritəsi açıqdır: " + S.length + " bölmə, " + FLAT.length + " mövzu, " + READY_N + " dərs hazır. Backend yolunda Go-dan əvvəl Git, Linux və HTTP gəlir."
            : "Bu texnologiyanın xəritəsi hazırlanır. Backend yolunda yeri: " + (i ? tech(BACKEND.techs[i - 1]).name + "-dan sonra" : "ilk addım") + ".") + "</p>" +
          '<p class="muted" style="font-size:13px;margin-top:10px">Daxil olduğu istiqamətlər: ' + esc(dirs.join(", ")) + "</p>" +
          '<div class="rd-foot">' + (live ? '<a class="btn btn-sm btn-primary" href="' + t.href + '">Go xəritəsini aç <span class="arrow">' + ARROW + "</span></a>" : "") + '<a class="btn btn-sm" href="' + PAGES + 'roadmap.html#backend">Backend önizləməsi</a></div>';
      }
    }
    map.addEventListener("click", (e) => { const n = e.target.closest(".rm-node"); if (n) select(+n.dataset.i); });
    map.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const nodes = $$(".rm-node", map), k = Math.max(0, Math.min(nodes.length - 1, sel + (e.key === "ArrowRight" ? 1 : -1)));
      e.preventDefault(); select(k); nodes[k].focus();
    });
    $$(".rm-tabs button").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.view === view) return;
      view = b.dataset.view;
      $$(".rm-tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      render();
    }));
    render();
    addEventListener("resize", drawWire);
    if (document.fonts) document.fonts.ready.then(drawWire);
  })();

  // =====================================================================
  // 3. LESSON DEMO: a slice of the real "slices" lesson (content/go/examples/slices)
  // =====================================================================
  (function lesson() {
    const SRC = [
      "package main", "", 'import "fmt"', "", "func main() {",
      "\tvar cart []string", '\tfmt.Println("cart:", cart, len(cart), cart == nil)', "",
      '\tcart = append(cart, "bread")', '\tcart = append(cart, "cheese", "tea")', '\tfmt.Println("cart:", cart, len(cart), cap(cart))', "",
      '\tcart[0] = "flatbread"', '\tfmt.Println("first item:", cart[0])', "",
      "\tfirst := cart[:2]", '\tfirst[1] = "butter"', '\tfmt.Println("first two:", first)', '\tfmt.Println("cart:", cart)', "}",
    ].join("\n");
    const STEPS = [
      { t: "Boş slice", x: "`[]string` — string-lərdən ibarət slice. Dəyər verilməyibsə, slice `nil`-dir: içində element yoxdur, `len` 0-dır. Səbət hələ boşdur.", r: [6, 7], out: "cart: [] 0 true", mem: { name: "cart", cells: [], len: 0, cap: 0 } },
      { t: "append", x: "`append` sona element əlavə edir və yeni slice qaytarır, ona görə nəticəni yenə `cart`-a yazırıq. `len` elementlərin sayıdır, `cap` ayrılmış yerin həcmi.", r: [9, 11], out: "cart: [bread cheese tea] 3 3", mem: { name: "cart", cells: ["bread", "cheese", "tea"], fresh: [0, 1, 2], len: 3, cap: 3 } },
      { t: "İndeks", x: "Saymaq 0-dan başlayır: `cart[0]` birinci elementdir. Eyni yolla dəyəri dəyişirik — `\"bread\"` yerinə `\"flatbread\"`.", r: [13, 14], out: "first item: flatbread", mem: { name: "cart", cells: ["flatbread", "cheese", "tea"], fresh: [0], len: 3, cap: 3 } },
      { t: "Slice-dan slice", x: "`cart[:2]` ilk iki elementi götürür. Yeni slice eyni elementlərə baxır, kopya yaratmır — ona görə `first[1]` dəyişəndə `cart` da dəyişdi.", r: [16, 19], out: "first two: [flatbread butter]\ncart: [flatbread butter tea]", mem: { name: "cart[:2]", cells: ["flatbread", "butter", "tea"], fresh: [1], win: [0, 2], len: 2, cap: 3 } },
    ];
    const pre = $("#ls-pre"), code = $("#ls-code"), band = $("#ls-band"), stepsEl = $("#ls-steps"), mem = $("#ls-mem"), out = $("#ls-out"), box = $("#lesson");
    W.renderCode(pre, SRC);
    const lines = $$(".ln", pre);
    STEPS.forEach((s, k) => { for (let n = s.r[0]; n <= s.r[1]; n++) lines[n - 1].dataset.step = k; });
    stepsEl.innerHTML = STEPS.map((s, k) => '<li><button class="ls-step" data-k="' + k + '"><i>' + (k + 1) + "</i><b>" + esc(s.t) + '</b><span class="tx"><span><span>' + md(s.x) + "</span></span></span></button></li>").join("");
    let cur = -1, auto = 0;
    function placeBand() {
      if (cur < 0) return;
      const a = lines[STEPS[cur].r[0] - 1], b = lines[STEPS[cur].r[1] - 1];
      band.style.transform = "translateY(" + (pre.offsetTop + a.offsetTop) + "px)";
      band.style.height = b.offsetTop + b.offsetHeight - a.offsetTop + "px";
    }
    function setStep(k) {
      k = (k + STEPS.length) % STEPS.length;
      if (k === cur) return;
      const prevCells = cur >= 0 ? STEPS[cur].mem.cells.length : 0;
      cur = k;
      const s = STEPS[k], m = s.mem;
      $$(".ls-step", stepsEl).forEach((b, i) => { if (i === k) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      lines.forEach((l) => l.classList.toggle("act", +l.dataset.step === k));
      code.classList.add("has-hl"); placeBand();
      $("#ls-count").textContent = k + 1 + "/" + STEPS.length;
      mem.innerHTML = '<div class="ls-h"><span>Yaddaş · <b>' + esc(m.name) + "</b></span><span>len " + m.len + " · cap " + m.cap + '</span></div><div class="cells">' +
        (m.cells.length ? m.cells.map((c, i) => '<span class="cell on' + ((m.fresh || []).indexOf(i) >= 0 || i >= prevCells ? " pop" : "") + (m.win && (i < m.win[0] || i >= m.win[1]) ? " out" : "") + '">"' + esc(c) + '"</span>').join("") : '<span class="cell cap">nil</span>') + "</div>";
      out.innerHTML = '<div class="ls-h"><span>Çıxış</span></div><pre>' + esc(s.out) + "</pre>";
    }
    const stop = () => { clearInterval(auto); auto = 0; };
    stepsEl.addEventListener("click", (e) => { const b = e.target.closest(".ls-step"); if (b) { stop(); setStep(+b.dataset.k); } });
    pre.addEventListener("pointerover", (e) => { const l = e.target.closest(".ln[data-step]"); if (l && e.pointerType === "mouse") { stop(); setStep(+l.dataset.step); } });
    pre.addEventListener("click", (e) => { const l = e.target.closest(".ln[data-step]"); if (l) { stop(); setStep(+l.dataset.step); } });
    $("#ls-prev").addEventListener("click", () => { stop(); setStep(cur - 1); });
    $("#ls-next").addEventListener("click", () => { stop(); setStep(cur + 1); });
    addEventListener("resize", placeBand);
    if (document.fonts) document.fonts.ready.then(placeBand);
    setStep(0);
    if (motion) {
      const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { io.disconnect(); auto = setInterval(() => { if (!document.hidden) setStep(cur + 1); }, 3800); } }, { rootMargin: "0px 0px -30% 0px" });
      io.observe(box);
    }
    box.addEventListener("pointerdown", stop);

    // what every lesson has
    const FACTS = [
      ["book", "Qısa izah", "Giriş və hər addımda bir neçə cümlə", "live"],
      ["code", "İşlək kod", "Go ilə işə salınıb, çıxış realdır", "live"],
      ["eye", "Vizual", "Yaddaşda nə dəyişir — addım-addım", "live"],
      ["check", "Test", "5–10 sual, bir-bir; ilk cəhd sayılır", "live"],
      ["layers", "Yadda saxla", "Əsas məqamlar və yaxşı təcrübə", "live"],
      ["chat", "Müsahibə sualı", "Mövzuya bağlı, cavabı ilə", "soon"],
    ];
    $("#facts").innerHTML = FACTS.map((f) => '<li><span class="fi">' + W.I[f[0]] + "</span><span><b>" + f[1] + "</b><small>" + f[2] + "</small></span>" + W.badge(f[3]) + "</li>").join("");

    // one real question from the lesson's quiz
    W.renderCode($("#quiz-code"), "u := []int{1, 2, 3}\nv := u[:2]\nv[0] = 9\nfmt.Println(u)");
    const opts = $("#quiz-opts"), why = $("#quiz-why");
    opts.innerHTML = ["[1 2 3]", "[9 2]", "[9 2 3]"].map((o, i) => '<button data-i="' + i + '">' + o + "</button>").join("");
    why.textContent = "Variantı seç — cavabın izahı burada çıxacaq.";
    opts.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.disabled) return;
      if (+b.dataset.i === 2) {
        b.classList.add("ok"); $$("button", opts).forEach((x) => (x.disabled = true));
        why.innerHTML = md("Düzdür. `v` `u`-nun elementlərinə baxır, kopya deyil — `v`-dəki dəyişiklik `u`-da da görünür.");
      } else {
        b.classList.add("bad"); b.disabled = true;
        why.innerHTML = md("Hələ yox. İpucu: `u[:2]` yeni kopya yaratmır.");
      }
    });
  })();

  // =====================================================================
  // 4. STACK: directions and technologies
  // =====================================================================
  (function stack() {
    const dirsEl = $("#dirs"), techsEl = $("#techs"), pathEl = $("#path");
    dirsEl.innerHTML = W.DIRECTIONS.map((d) => '<button class="dir glass spot" role="tab" aria-selected="false" data-dir="' + d.id + '" style="--c:' + d.c + '"><span class="mono-ic" style="--c:' + d.c + '">' + d.ic + "</span><b>" + d.name + "</b><p>" + esc(d.desc) + '</p><span class="meta">' + d.techs.length + " texnologiya · ~" + d.nodes + " mövzu " + W.badge(d.status) + "</span></button>").join("");
    techsEl.innerHTML = W.TECHS.map((t) => {
      const live = t.status === "live";
      const inner = '<span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span><span><b>" + esc(t.name) + "</b><small>" + (live ? FLAT.length + " mövzu · hazırdır" : "tezliklə") + '</small></span><span class="seq"></span>';
      return live ? '<a class="tech glass live" href="' + t.href + '" data-tech="' + t.id + '" style="--c:' + t.c + '">' + inner + "</a>" : '<div class="tech glass" data-tech="' + t.id + '" style="--c:' + t.c + '" title="' + esc(t.desc) + '">' + inner + "</div>";
    }).join("");
    let cur = "";
    function selectDir(id) {
      if (id === cur) return;
      cur = id;
      const d = W.DIRECTIONS.find((x) => x.id === id);
      $$(".dir", dirsEl).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.dir === id)));
      techsEl.classList.add("has-dir");
      $$(".tech", techsEl).forEach((el) => {
        const k = d.techs.indexOf(el.dataset.tech);
        el.classList.toggle("on", k >= 0); el.style.setProperty("--k", Math.max(0, k));
        $(".seq", el).textContent = k >= 0 ? k + 1 : "";
      });
      pathEl.innerHTML = '<span class="lbl">' + esc(d.name) + " yolu</span>" +
        d.techs.map((tid, i) => { const t = tech(tid); return '<span class="stp" style="--i:' + i + '"><span class="mono-ic" style="--c:' + t.c + '">' + esc(t.ic) + "</span>" + esc(t.name) + "</span>"; }).join('<span class="sep">→</span>') +
        '<span class="go">' + W.badge(d.status) + (d.href ? '<a href="' + d.href + '">Xəritəni aç →</a>' : "") + "</span>";
    }
    dirsEl.addEventListener("click", (e) => { const b = e.target.closest(".dir"); if (b) selectDir(b.dataset.dir); });
    dirsEl.addEventListener("mouseover", (e) => { const b = e.target.closest(".dir"); if (b && matchMedia("(hover: hover)").matches) selectDir(b.dataset.dir); });
    techsEl.addEventListener("click", (e) => { const t = e.target.closest("div.tech"); if (t) W.toast(tech(t.dataset.tech).name + " — tezliklə"); });
    selectDir("backend");
  })();

  // =====================================================================
  // 5. PLATFORM SECTIONS in rollout order
  // =====================================================================
  (function platform() {
    const P = W.PLATFORM, live = P.filter((p) => p.status === "live").length, lastLive = P.map((p) => p.status).lastIndexOf("live");
    const HREF = { roadmaps: PAGES + "roadmap.html", learn: PAGES + "go.html", visual: W.lessonHref("slices"), tests: W.lessonHref("slices") };
    const EXTRA = { roadmaps: "Go · Backend önizləmə", learn: READY_N + " dərs hazır", visual: "slice, array, map", tests: "hər dərsdə 5–10 sual", interview: "mövzuya bağlı", sysdesign: "ayrıca bölmə", algo: "pattern üzrə", live: "ən sonda" };
    $("#rollout").innerHTML = '<span class="lbl">Açılış sırası</span><div class="ro-track"><i class="ro-fill" style="--p:' + (lastLive / (P.length - 1)).toFixed(3) + '"></i>' +
      P.map((p) => '<i class="ro-dot' + (p.status === "live" ? " live" : "") + '" title="' + esc(p.name) + '"></i>').join("") + "</div><b>" + live + " / " + P.length + " aktiv</b>";
    $("#bento").innerHTML = P.map((p, i) => {
      const tag = HREF[p.id] ? "a" : "div";
      return "<" + tag + ' class="pcard glass spot ' + p.status + '"' + (HREF[p.id] ? ' href="' + HREF[p.id] + '"' : "") + ' data-reveal style="--i:' + i + '">' +
        '<div class="pcard-top"><span class="pi">' + W.I[p.icon] + '</span><span class="n">' + pad(i + 1) + "</span></div><h3>" + esc(p.name) + "</h3><p>" + esc(p.desc) + '</p><div class="pmeta"><span>' + esc(EXTRA[p.id] || "") + "</span>" + W.badge(p.status) + "</div></" + tag + ">";
    }).join("");
  })();

  // =====================================================================
  // 6. WHY + comparison
  // =====================================================================
  const WHY = [
    ["chat", "Ana dilində, terminlər orijinalda", "İzah Azərbaycan dilindədir, <code>slice</code>, <code>goroutine</code> kimi terminlər isə ingiliscə qalır — sənəddə və işdə necə görəcəksənsə."],
    ["map", "Xəritə və dərs bir yerdə", "Hansı mövzunun nədən sonra gəldiyini görürsən və dərhal öyrənirsən. Harada qaldığın həmişə görünür."],
    ["eye", "Oxuma — gör", "Kod addım-addım gedir: hansı sətrin işlədiyini, yaddaşda nəyin dəyişdiyini və nəticəni eyni anda görürsən."],
    ["check", "Kod işləyir — yoxlanılıb", "Hər nümunə Go ilə işə salınır, test cavabları da kodla təsdiqlənir. Ekrandakı nəticə realdır."],
  ];
  $("#why").innerHTML = WHY.map((w, i) => '<article class="why-card glass spot" data-reveal style="--i:' + i + '"><span class="wi">' + W.I[w[0]] + "</span><h3>" + w[1] + "</h3><p>" + w[2] + "</p></article>").join("");
  const Y = '<span class="mk y" aria-label="var">✓</span>', N = '<span class="mk n" aria-label="yoxdur">—</span>';
  const Pp = '<span class="mk p">qismən</span>', Sn = '<span class="mk s">tezliklə</span>';
  const ROWS = [
    ["Azərbaycan dilində", Y, N, Pp, N],
    ["Öyrənmə ardıcıllığı (yol xəritəsi)", Y, Y, Pp, N],
    ["Hər mövzuda işlək, yoxlanılmış kod", Y, Pp, Y, Y],
    ["Vizual, addım-addım izah", Y, N, Pp, N],
    ["Hər dərsdə test", Y, Pp, Pp, N],
    ["Müsahibə sualları mövzuya bağlı", Sn, Pp, Pp, N],
    ["Bütün texnologiyalar bir saytda", Y, Y, N, N],
    ["Pulsuz, açıq lisenziyalı məzmun", Y, Pp, N, Y],
  ];
  $("#cmp-body").innerHTML = ROWS.map((r) => '<tr><th scope="row">' + r[0] + '</th><td class="us">' + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td><td>" + r[4] + "</td></tr>").join("");

  // =====================================================================
  // 7. FAQ
  // =====================================================================
  const FAQ = [
    ["Pulsuzdur?", "Bəli. Bütün dərslər və xəritələr pulsuzdur. Məzmun CC BY 4.0, kod MIT lisenziyası ilə açıqdır."],
    ["Hesab açmaq lazımdır?", "Yox. İrəliləyiş bu brauzerdə saxlanılır. Hesablar sonra gələcək — cihazlar arasında sinxron üçün."],
    ["Hansı dildədir?", "İzahlar Azərbaycan dilindədir. Proqramlaşdırma terminləri (`slice`, `goroutine`, `interface`) ingiliscə qalır — sənəddə və işdə necə görəcəksənsə, elə."],
    ["Kod nümunələri doğrudan işləyir?", "Hər nümunə Go ilə işə salınır və ekrandakı çıxış proqramın real çıxışıdır. Test cavabları da kodu işlədərək yoxlanılır."],
    ["Haradan başlayım?", "Proqramlaşdırmaya yenisənsə — Go xəritəsinin ilk bölməsi “Əsaslar”-dan. Backend yolunu seçmisənsə — istiqamət xəritəsindən: Git, Linux, HTTP, sonra Go."],
    ["Go-dan sonra nə gələcək?", "Növbəti texnologiya hələ seçilməyib. “Tezliklə” yazılanlar planlaşdırılır; sıra yol xəritələrinə görə müəyyən olunacaq."],
  ];
  $("#faq").innerHTML = FAQ.map((f, i) => '<details class="glass" data-reveal style="--i:' + i + '"' + (i ? "" : " open") + "><summary>" + esc(f[0]) + W.I.chev + '</summary><div class="ans">' + md(f[1]) + "</div></details>").join("");

  // =====================================================================
  // 8. RESUME
  // =====================================================================
  $("#res-pct").textContent = Math.round((doneN / FLAT.length) * 100) + "%";
  $("#res-title").textContent = next.title;
  $("#res-sub").textContent = next.sub + " · " + next.section + " · " + doneN + "/" + FLAT.length;
  $("#resume").href = $("#cta-next").href = W.lessonHref(next.slug);
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { $("#res-bar").style.strokeDashoffset = 314.2 * (1 - doneN / FLAT.length); o.disconnect(); } }).observe($("#resume"));

  W.paintIcons();
  W.observe();
})();

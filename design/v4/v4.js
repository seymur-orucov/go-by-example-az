// Design v4 — "Metro": platform home.
// Depends on ../shared/data.js (Go topics) and ../v2/v2.js (window.W3: prototype data, theme, search).
// Everything on the page is built here: the transit map with its trains, the Go strip map and timetable,
// the lesson demo with a turnstile question, the split-flap board and the boarding pass.
(function () {
  "use strict";
  const W = window.W3;
  if (!W) return;
  const { esc, reduced } = W;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const TECH = Object.fromEntries(W.TECHS.map((t) => [t.id, t]));
  const DIR = Object.fromEntries(W.DIRECTIONS.map((d) => [d.id, d]));
  const PAGES = window.W3_PAGES || "";

  function onEnter(el, fn, margin) {
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { io.disconnect(); fn(); }
    }), { rootMargin: margin || "0px 0px -10% 0px", threshold: 0.12 });
    io.observe(el);
  }
  $$("[data-rv]").forEach((el) => onEnter(el, () => el.classList.add("is-in")));
  // `code` in copy: "`x`" → <code>x</code>
  const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

  // =====================================================================
  // 1. The map. Lines are directions, stations are technologies.
  //    Octolinear layout in a 1280×640 canvas; every line starts at Git.
  //    A waypoint with a third value is a stop.
  // =====================================================================
  const LINES = [
    { id: "data", n: 4, pts: [[120, 463.5, "git"], [280, 463.5, "linux"], [305, 463.5], [416, 574.5], [650, 574.5, "python"], [680, 574.5], [800, 454.5, "sql"]] },
    { id: "devops", n: 3, pts: [[120, 454.5, "git"], [280, 454.5, "linux"], [440, 454.5, "http"], [470, 454.5], [581, 565.5], [650, 565.5, "python"], [1010, 565.5, "docker"], [1160, 565.5, "k8s"]] },
    { id: "backend", n: 1, pts: [[120, 445.5, "git"], [280, 445.5, "linux"], [440, 445.5, "http"], [620, 445.5, "go"], [800, 445.5, "sql"], [830, 445.5], [941, 556.5], [1010, 556.5, "docker"], [1160, 556.5, "k8s"]] },
    { id: "frontend", n: 2, pts: [[120, 428, "git"], [440, 428, "http"], [520, 428], [640, 308, "html"], [740, 208, "javascript"], [852, 96], [940, 96, "typescript"], [1110, 96, "react"]] },
  ];
  const LINE = Object.fromEntries(LINES.map((l) => [l.id, l]));
  const ORDER = ["backend", "frontend", "devops", "data"];
  // label side per station: b(elow), t(op), r(ight); optional short name for the map
  const LABEL = { git: ["b"], linux: ["b"], http: ["b", "HTTP"], go: ["b"], sql: ["t"], rust: ["t"], html: ["r"], javascript: ["r"], typescript: ["t"], react: ["t"], python: ["b"], docker: ["b"], k8s: ["b"] };
  const R = 7.5;

  function roundPath(pts, r) {
    let d = "M" + pts[0][0] + "," + pts[0][1];
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const ax = x0 - x1, ay = y0 - y1, bx = x2 - x1, by = y2 - y1;
      if (Math.abs(ax * by - ay * bx) < 1e-6) { d += "L" + x1 + "," + y1; continue; } // a stop on a straight run
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), rr = Math.min(r, la / 2, lb / 2);
      d += "L" + (x1 + (ax / la) * rr).toFixed(2) + "," + (y1 + (ay / la) * rr).toFixed(2) +
        "Q" + x1 + "," + y1 + " " + (x1 + (bx / lb) * rr).toFixed(2) + "," + (y1 + (by / lb) * rr).toFixed(2);
    }
    const last = pts[pts.length - 1];
    return d + "L" + last[0] + "," + last[1];
  }

  const stations = {};
  LINES.forEach((l) => {
    l.stops = [];
    l.pts.forEach((p) => {
      if (!p[2]) return;
      const s = stations[p[2]] || (stations[p[2]] = { id: p[2], x: p[0], ys: [], lines: [] });
      s.ys.push(p[1]); s.lines.push(l.id); l.stops.push(p[2]);
    });
  });
  stations.rust = { id: "rust", x: 990, ys: [445.5], lines: [], planned: true };

  const map = $("#map"), stage = $("#stage"), tip = $("#tip"), mapInner = $("#map-inner");
  const hasProgress = W.learnedSet.size > 0;

  (function buildMap() {
    let h = "";
    // the fundamentals zone: every line starts here
    h += '<rect class="zone" x="64" y="398" width="432" height="126" rx="22"/><text class="zone-t" x="84" y="514">Təməl zona</text>';
    // title block, shown only when the headline is not on the canvas (narrow screens)
    h += '<g class="map-title"><text class="mt-h" x="70" y="118">Xətlər sxemi</text>' +
      ORDER.map((id, i) => '<g class="c-' + id + '"><circle cx="82" cy="' + (166 + i * 34) + '" r="12"/><text class="mt-n" x="82" y="' + (170.5 + i * 34) + '" text-anchor="middle">' + LINE[id].n + '</text><text class="mt-s" x="106" y="' + (171 + i * 34) + '">' + esc(DIR[id].name) + " xətti · " + LINE[id].stops.length + " stansiya</text></g>").join("") + "</g>";
    h += '<g class="legend"><circle class="lg-live" cx="78" cy="590" r="7"/><text class="lg-t" x="93" y="594">açıq</text>' +
      '<circle class="lg-o" cx="150" cy="590" r="6.5"/><text class="lg-t" x="165" y="594">tezliklə</text>' +
      '<path class="ln-plan" d="M238 590h30"/><text class="lg-t" x="278" y="594">layihədə</text></g>';
    h += '<path class="ln-plan" d="M830 445.5H983"/>';
    LINES.forEach((l) => {
      l.d = roundPath(l.pts, 24);
      h += '<path class="ln-case" d="' + l.d + '"/><path class="ln c-' + l.id + '" data-line="' + l.id + '" d="' + l.d + '" pathLength="1"/>';
    });
    LINES.forEach((l) => { h += '<path class="ln-hit" data-line="' + l.id + '" d="' + l.d + '"><title>' + esc(DIR[l.id].name) + " xətti</title></path>"; });
    h += '<g class="trains">' + LINES.map((l) => '<g class="train" data-line="' + l.id + '"><rect x="-11" y="-5.5" width="22" height="11" rx="5.5"/></g>').join("") + "</g>";
    Object.values(stations).forEach((s) => {
      const t = TECH[s.id], live = t.status === "live", r = live ? 10.5 : R;
      const y0 = Math.min.apply(null, s.ys), y1 = Math.max.apply(null, s.ys);
      const side = LABEL[s.id][0], name = LABEL[s.id][1] || t.name;
      const lines = s.lines.map((id) => DIR[id].name).join(", ");
      const label = name + " stansiyası — " + (live ? "açıqdır" : s.planned ? "layihədədir" : "tezliklə") + (lines ? "; xətlər: " + lines : "");
      const box = 'x="' + (s.x - r) + '" y="' + (y0 - r) + '" width="' + r * 2 + '" height="' + (y1 - y0 + r * 2) + '" rx="' + r + '"';
      let txt;
      if (side === "r") txt = '<text class="st-l" x="' + (s.x + 17) + '" y="' + (y0 + 5) + '">' + esc(name) + "</text>";
      else if (side === "t") txt = '<text class="st-l" x="' + s.x + '" y="' + (y0 - r - 9) + '" text-anchor="middle">' + esc(name) + "</text>";
      else txt = '<text class="st-l" x="' + s.x + '" y="' + (y1 + r + (live ? 23 : 20)) + '" text-anchor="middle">' + esc(name) + "</text>" +
        (live ? '<text class="st-sub" x="' + s.x + '" y="' + (y1 + r + 40) + '" text-anchor="middle">' + W.FLAT.length + " dərs · açıqdır</text>" : "");
      h += (t.href ? '<a href="' + t.href + '"' : '<g tabindex="0" role="button"') +
        ' class="st' + (live ? " live" : "") + (s.planned ? " planned" : "") + '" data-st="' + s.id + '" aria-label="' + esc(label) + '">' +
        "<rect class=\"st-ping\" " + box + "/><rect class=\"st-body\" " + box + "/>" + txt + (t.href ? "</a>" : "</g>");
    });
    const go = stations.go;
    h += '<g class="flag" transform="translate(' + go.x + ' 0)"><g class="flag-in"><rect x="-66" y="390" width="132" height="24" rx="4"/><path d="M-7 413.5h14l-7 9z"/>' +
      '<text x="0" y="406" text-anchor="middle">' + (hasProgress ? "Sən buradasan" : "Buradan başla") + "</text></g></g>";
    map.innerHTML = h;
    // set the hidden start state before anything forces a style pass, so nothing transitions into it
    if (!reduced) map.classList.add("pre");
  })();

  // measure: where each stop sits along its line
  const SPEED = 900; // map units per second while the lines are drawn
  LINES.forEach((l, i) => {
    l.path = $('.ln[data-line="' + l.id + '"]', map);
    l.total = l.path.getTotalLength();
    l.at = l.pts.filter((p) => p[2]).map((p) => {
      let best = 0, bd = Infinity;
      for (let s = 0; s <= l.total; s += 2) {
        const q = l.path.getPointAtLength(s), d = (q.x - p[0]) ** 2 + (q.y - p[1]) ** 2;
        if (d < bd) { bd = d; best = s; }
      }
      return best;
    });
    l.delay = 250 + ORDER.indexOf(l.id) * 140;
    l.path.style.setProperty("--dur", Math.round((l.total / SPEED) * 1000) + "ms");
    l.path.style.setProperty("--ld", l.delay + "ms");
    l.stops.forEach((id, k) => {
      const t = l.delay + (l.at[k] / SPEED) * 1000;
      stations[id].t = Math.min(stations[id].t == null ? Infinity : stations[id].t, t);
    });
  });
  stations.rust.t = 1900;
  $$(".st", map).forEach((el) => el.style.setProperty("--d", Math.round(stations[el.dataset.st].t) + "ms"));

  // ----- intro -----
  let introDone = reduced;
  if (!reduced) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      map.classList.remove("pre"); map.classList.add("run");
      setTimeout(() => { map.classList.remove("run"); introDone = true; }, 2700);
    }));
  }

  // ----- narrow screens: the headline leaves the canvas, so crop the empty margin -----
  const narrow = matchMedia("(max-width: 1179px)");
  let vb = [0, 0, 1280, 640];
  function setViewBox() {
    vb = narrow.matches ? [60, 60, 1190, 580] : [0, 0, 1280, 640];
    map.setAttribute("viewBox", vb.join(" "));
  }
  narrow.addEventListener("change", setViewBox); setViewBox();

  // ----- trains: one per line, running stop to stop and back -----
  const trains = LINES.map((l, i) => ({ l, el: $('.train[data-line="' + l.id + '"]', map), i: 0, dir: 1, phase: "dwell", t0: 0, wait: 1700 + ORDER.indexOf(l.id) * 520 }));
  function place(tr, s) {
    const p = tr.l.path.getPointAtLength(s), q = tr.l.path.getPointAtLength(Math.min(tr.l.total, s + 1.5)), b = tr.l.path.getPointAtLength(Math.max(0, s - 1.5));
    tr.el.setAttribute("transform", "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ") rotate(" + ((Math.atan2(q.y - b.y, q.x - b.x) * 180) / Math.PI).toFixed(1) + ")");
  }
  function ping(id) {
    const el = $('.st[data-st="' + id + '"]', map);
    if (!el || el.classList.contains("live")) return;
    el.classList.remove("ping"); void el.getBoundingClientRect(); el.classList.add("ping");
  }
  if (reduced) trains.forEach((tr, k) => place(tr, tr.l.at[Math.min(tr.l.at.length - 1, k + 1)]));
  else {
    trains.forEach((tr) => place(tr, 0));
    let visible = true, raf = 0, last = 0;
    const ease = (k) => 0.5 - Math.cos(Math.PI * k) / 2;
    function frame(now) {
      raf = 0;
      if (!last) { last = now; trains.forEach((tr) => (tr.t0 = now)); }
      trains.forEach((tr) => {
        const at = tr.l.at;
        if (tr.phase === "dwell") {
          if (now - tr.t0 < tr.wait) return;
          if (tr.i + tr.dir < 0 || tr.i + tr.dir >= at.length) tr.dir = -tr.dir;
          tr.from = at[tr.i]; tr.to = at[tr.i + tr.dir];
          tr.dur = 700 + Math.abs(tr.to - tr.from) * 9; tr.phase = "run"; tr.t0 = now;
        }
        const k = Math.min(1, (now - tr.t0) / tr.dur);
        place(tr, tr.from + (tr.to - tr.from) * ease(k));
        if (k >= 1) { tr.i += tr.dir; tr.phase = "dwell"; tr.t0 = now; tr.wait = 900; ping(tr.l.stops[tr.i]); }
      });
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf && visible && !document.hidden) { last = 0; trains.forEach((tr) => { if (tr.phase === "run") { tr.phase = "dwell"; tr.wait = 0; } }); raf = requestAnimationFrame(frame); } };
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; kick(); }).observe(map);
    document.addEventListener("visibilitychange", kick);
    kick();
  }

  // ----- line chooser + focus -----
  const box = $("#linebox");
  box.innerHTML =
    '<div class="lb-head"><span>Xətt seç</span><span>' + ORDER.length + " xətt · " + Object.keys(stations).length + " stansiya</span></div>" +
    '<div class="lb-lines">' + ORDER.map((id) => '<button class="lb-line c-' + id + '" data-line="' + id + '" aria-pressed="false"><span class="bullet">' + LINE[id].n + "</span>" + esc(DIR[id].name) + "</button>").join("") + "</div>" +
    '<div class="lb-info" id="lb-info" aria-live="polite"></div>';
  const info = $("#lb-info");
  let sel = null, hov = null, shown;
  function paintFocus() {
    const id = hov || sel;
    map.classList.toggle("focus", !!id);
    $$(".ln, .train", map).forEach((el) => el.classList.toggle("off", !!id && el.dataset.line !== id));
    $$(".st", map).forEach((el) => el.classList.toggle("off", !!id && stations[el.dataset.st].lines.indexOf(id) < 0));
    $$(".lb-line", box).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.line === sel)));
    if (id === shown) return;
    shown = id;
    if (!id) {
      info.innerHTML = "<h3>Dörd xətt, bir sxem</h3><p>Xəttin üstünə gəl və ya seç — dayanacaqlarını sıra ilə göstərək. Hələlik bir stansiya açıqdır: <b>Go</b>.</p>";
      return;
    }
    const d = DIR[id], st = W.STATUS[d.status];
    info.innerHTML =
      '<h3><span class="bullet c-' + id + '">' + LINE[id].n + "</span>" + esc(d.name) + ' xətti <span class="tag ' + st[0] + '">' + st[1] + "</span></h3>" +
      '<ol class="lb-stops c-' + id + '">' + LINE[id].stops.map((s, i) => '<li style="--i:' + i + '"' + (TECH[s].status === "live" ? ' class="open"' : "") + ">" + esc(LABEL[s][1] || TECH[s].name) + "</li>").join("") + "</ol>" +
      (d.href ? '<a class="lb-more" href="' + d.href + '">Xətti aç · ' + d.nodes + " mövzu →</a>" : '<p>Xətt tikilir — ' + d.nodes + " mövzu planlaşdırılıb.</p>");
  }
  paintFocus();
  box.addEventListener("click", (e) => { const b = e.target.closest(".lb-line"); if (!b) return; sel = sel === b.dataset.line ? null : b.dataset.line; paintFocus(); });
  box.addEventListener("pointerover", (e) => { const b = e.target.closest(".lb-line"); if (b && e.pointerType === "mouse") { hov = b.dataset.line; paintFocus(); } });
  box.addEventListener("pointerout", (e) => { if (e.target.closest(".lb-line")) { hov = null; paintFocus(); } });
  $$(".ln-hit", map).forEach((p) => {
    p.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && introDone) { hov = p.dataset.line; paintFocus(); } });
    p.addEventListener("pointerleave", () => { hov = null; paintFocus(); });
    p.addEventListener("click", () => { sel = sel === p.dataset.line ? null : p.dataset.line; paintFocus(); });
  });

  // ----- station sign (tooltip) -----
  function showTip(el) {
    const s = stations[el.dataset.st], t = TECH[s.id], live = t.status === "live";
    const y0 = Math.min.apply(null, s.ys), y1 = Math.max.apply(null, s.ys), below = y0 - vb[1] < 190;
    tip.innerHTML = "<b>" + esc(t.name) + "<small>" + (live ? "açıqdır" : s.planned ? "layihədə" : "tezliklə") + "</small></b><p>" + esc(t.desc) + "</p>" +
      (s.lines.length ? '<div class="tip-lines">' + ORDER.filter((id) => s.lines.indexOf(id) >= 0).map((id) => '<span class="bullet c-' + id + '">' + LINE[id].n + "</span>").join("") + "</div>" : "");
    tip.classList.toggle("below", below);
    tip.style.left = ((s.x - vb[0]) / vb[2]) * 100 + "%";
    tip.style.top = (((below ? y1 : y0) - vb[1]) / vb[3]) * 100 + "%";
    tip.hidden = false;
    $$(".st.on", map).forEach((x) => x.classList.remove("on")); el.classList.add("on");
  }
  function hideTip() { tip.hidden = true; $$(".st.on", map).forEach((x) => x.classList.remove("on")); }
  $$(".st", map).forEach((el) => {
    el.addEventListener("pointerenter", () => showTip(el));
    el.addEventListener("pointerleave", hideTip);
    el.addEventListener("focus", () => showTip(el));
    el.addEventListener("blur", hideTip);
    if (el.tagName.toLowerCase() === "g") {
      const soon = () => W.toast(TECH[el.dataset.st].name + " stansiyası tikilir — tezliklə açılacaq");
      el.addEventListener("click", () => { showTip(el); soon(); });
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); soon(); } });
    }
  });
  $("#hero-facts").textContent = ORDER.length + " xətt · " + Object.keys(stations).length + " stansiya · " + W.FLAT.length + " Go dərsi";

  // =====================================================================
  // 2. The page line under the header: one stop per section.
  // =====================================================================
  (function strip() {
    const STOPS = [["xerite", "Xəritə"], ["go", "Go xətti"], ["stansiya", "Stansiya"], ["bilet", "Bilet"], ["bolmeler", "Tablo"], ["basla", "Minik"]];
    const el = $("#strip"), secs = STOPS.map((s) => document.getElementById(s[0]));
    el.style.setProperty("--n", STOPS.length - 1);
    el.innerHTML = '<i class="strip-fill"></i>' + STOPS.map((s, i) => '<i class="strip-stop" style="--at:' + i + '"></i>').join("") + '<i class="strip-train"><span></span></i>';
    const dots = $$(".strip-stop", el), label = $(".strip-train span", el);
    let ticking = false, idle = 0;
    function paint() {
      ticking = false;
      const a = secs.map((s, i) => (i ? Math.max(0, s.offsetTop - innerHeight * 0.4) : 0));
      let p = 0;
      for (let i = 0; i < a.length; i++) {
        if (scrollY < a[i]) break;
        const next = i + 1 < a.length ? a[i + 1] : Infinity;
        p = i + Math.min(1, (scrollY - a[i]) / (next - a[i]));
      }
      p = Math.min(p, STOPS.length - 1);
      el.style.setProperty("--p", p.toFixed(3));
      dots.forEach((d, i) => d.classList.toggle("passed", i <= p + 0.001));
      label.textContent = STOPS[Math.round(p)][1];
    }
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
      el.classList.add("moving"); clearTimeout(idle); idle = setTimeout(() => el.classList.remove("moving"), 1100);
    }, { passive: true });
    addEventListener("resize", paint);
    paint();
  })();

  // =====================================================================
  // 3. Go line: strip map of the nine sections + a timetable of lessons.
  // =====================================================================
  const nextIdx = Math.max(0, W.FLAT.findIndex((x) => !W.learnedSet.has(x.slug)));
  const nextLesson = W.FLAT[nextIdx] || W.FLAT[0];
  (function goLine() {
    const S = W.SECTIONS, line = $("#goline"), tt = $("#tt");
    // term rule: programming terms stay in English (the shared prototype data says "Massivlər")
    const DESC = { collections: "Array, slice, map və onların üzərində gəzinti." };
    const cur = Math.max(0, S.findIndex((s) => s.id === nextLesson.sid));
    const doneIn = (s) => s.items.filter((it) => W.learnedSet.has(it[0])).length;
    $("#go-sign").textContent = W.READY.size + " dərs hazırdır";
    line.innerHTML = '<i class="goline-fill"></i>' + S.map((s, i) => {
      const done = doneIn(s);
      return '<button class="gstop' + (done === s.items.length ? " done" : "") + '" role="tab" aria-selected="false" data-i="' + i + '">' +
        '<span class="g-n">' + String(i + 1).padStart(2, "0") + '</span><span class="g-dot"></span><span class="g-name">' + esc(s.title) + '</span><span class="g-c">' + (done ? done + "/" : "") + s.items.length + " dərs</span></button>";
    }).join("") + '<i class="g-train"></i>';
    line.style.setProperty("--p", ((cur + doneIn(S[cur]) / S[cur].items.length) / (S.length - 1)).toFixed(3));
    let base = 0;
    const firstNo = S.map((s) => { const b = base; base += s.items.length; return b; });
    function select(i) {
      const s = S[i];
      line.style.setProperty("--i", i);
      $$(".gstop", line).forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
      tt.innerHTML = '<div class="tt-head"><h3>' + esc(s.title) + "</h3><p>" + esc(DESC[s.id] || s.desc) + "</p><span>dayanacaq " + (i + 1) + "/" + S.length + " · " + s.items.length + " dərs</span></div>" +
        '<div class="tt-list">' + s.items.map((it, k) => {
          const st = W.learnedSet.has(it[0]) ? ["done", "keçilib"] : W.READY.has(it[0]) ? ["ready", "hazırdır"] : ["plan", "yazılır"];
          return '<a class="tt-row" style="--i:' + k + '" href="' + W.lessonHref(it[0]) + '"><span class="n">' + String(firstNo[i] + k + 1).padStart(2, "0") + '</span><span class="t">' + esc(it[1]) + '</span><span class="s ' + st[0] + '">' + st[1] + "</span></a>";
        }).join("") + "</div>";
    }
    line.addEventListener("click", (e) => { const b = e.target.closest(".gstop"); if (b) select(+b.dataset.i); });
    line.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const i = +getComputedStyle(line).getPropertyValue("--i"), n = Math.max(0, Math.min(S.length - 1, i + (e.key === "ArrowRight" ? 1 : -1)));
      e.preventDefault(); select(n); $$(".gstop", line)[n].focus();
    });
    select(cur);
  })();

  // =====================================================================
  // 4. Station: a slice of the real "slices" lesson (content/go/examples/slices).
  // =====================================================================
  (function station() {
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
    const pre = $("#code-pre"), code = $("#code"), hl = $("#hl"), stepsEl = $("#steps"), mem = $("#mem"), out = $("#out"), stn = $("#stn");
    W.renderCode(pre, SRC);
    const lines = $$(".ln", pre);
    STEPS.forEach((s, k) => { for (let n = s.r[0]; n <= s.r[1]; n++) lines[n - 1].dataset.step = k; });
    stepsEl.innerHTML = STEPS.map((s, k) => '<li><button class="step" data-k="' + k + '"><i></i><b>' + esc(s.t) + '</b><span class="step-t"><span><span>' + md(s.x) + "</span></span></span></button></li>").join("");
    let cur = -1, auto = 0;
    function band() {
      if (cur < 0) return;
      const a = lines[STEPS[cur].r[0] - 1], b = lines[STEPS[cur].r[1] - 1];
      hl.style.transform = "translateY(" + (pre.offsetTop + a.offsetTop) + "px)";
      hl.style.height = b.offsetTop + b.offsetHeight - a.offsetTop + "px";
    }
    function setStep(k) {
      k = (k + STEPS.length) % STEPS.length;
      if (k === cur) return;
      cur = k;
      const s = STEPS[k], m = s.mem;
      $$(".step", stepsEl).forEach((b, i) => { if (i === k) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      lines.forEach((l) => l.classList.toggle("act", +l.dataset.step === k));
      code.classList.add("has-hl"); band();
      $("#stn-count").textContent = k + 1 + "/" + STEPS.length;
      mem.innerHTML = '<div class="mem-h"><span>Yaddaş · <b>' + esc(m.name) + "</b></span><span>len " + m.len + " · cap " + m.cap + '</span></div><div class="cells">' +
        (m.cells.length ? m.cells.map((c, i) => '<span class="cell' + ((m.fresh || []).indexOf(i) >= 0 ? " fresh" : "") + (m.win && (i < m.win[0] || i >= m.win[1]) ? " outside" : "") + '" style="--i:' + i + '">' + esc(c) + "</span>").join("") : '<span class="cell nil">nil</span>') + "</div>";
      out.innerHTML = '<div class="out-h"><span>Çıxış</span></div><pre>' + esc(s.out) + "</pre>";
    }
    const stop = () => { clearInterval(auto); auto = 0; };
    stepsEl.addEventListener("click", (e) => { const b = e.target.closest(".step"); if (b) { stop(); setStep(+b.dataset.k); } });
    pre.addEventListener("pointerover", (e) => { const l = e.target.closest(".ln[data-step]"); if (l && e.pointerType === "mouse") { stop(); setStep(+l.dataset.step); } });
    pre.addEventListener("click", (e) => { const l = e.target.closest(".ln[data-step]"); if (l) { stop(); setStep(+l.dataset.step); } });
    $("#stn-prev").addEventListener("click", () => { stop(); setStep(cur - 1); });
    $("#stn-next").addEventListener("click", () => { stop(); setStep(cur + 1); });
    addEventListener("resize", band);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(band);
    setStep(0);
    // walk through the steps once it is on screen, until the reader takes over
    if (!reduced) onEnter(stn, () => { auto = setInterval(() => { if (!document.hidden) setStep(cur + 1); }, 3800); }, "0px 0px -30% 0px");
    stn.addEventListener("pointerdown", stop); stn.addEventListener("keydown", stop);

    // the turnstile: one real question from the lesson's quiz
    const gate = $("#gate"), opts = $("#gate-opts"), msg = $("#gate-msg"), next = $("#gate-next");
    W.renderCode($("#gate-code"), "u := []int{1, 2, 3}\nv := u[:2]\nv[0] = 9\nfmt.Println(u)");
    opts.innerHTML = ["[1 2 3]", "[9 2]", "[9 2 3]"].map((o, i) => '<button class="opt" data-i="' + i + '">' + o + "</button>").join("");
    msg.textContent = "Düz cavab turniketi açır.";
    opts.addEventListener("click", (e) => {
      const b = e.target.closest(".opt");
      if (!b || b.disabled || gate.classList.contains("open")) return;
      if (+b.dataset.i === 2) {
        b.classList.add("right"); gate.classList.add("open");
        $("#turn").style.setProperty("--rot", "120deg");
        msg.innerHTML = md("Keçid açıqdır. `v` `u`-nun elementlərinə baxır, kopya deyil — `v`-dəki dəyişiklik `u`-da da görünür.");
        next.removeAttribute("aria-disabled"); next.removeAttribute("tabindex");
        $$(".opt", opts).forEach((o) => (o.disabled = true));
      } else {
        b.classList.add("wrong"); b.disabled = true;
        gate.classList.remove("nope"); void gate.offsetWidth; gate.classList.add("nope");
        msg.innerHTML = md("Hələ yox. İpucu: `u[:2]` yeni kopya yaratmır.");
      }
    });
  })();

  // =====================================================================
  // 5. Tickets (printed on enter) and the split-flap board.
  // =====================================================================
  onEnter($("#tickets"), () => $("#tickets").classList.add("is-in"));

  (function board() {
    const el = $("#board");
    const NAME = 18, STAT = 7;
    const CH = "ABCÇDEƏFGĞHXIİJKQLMNOÖPRSŞTUÜVYZ0123456789";
    const TXT = { live: "AÇIQDIR", plan: "PLANDA", later: "SONRA" };
    const HREF = { roadmaps: PAGES + "roadmap.html", learn: PAGES + "go.html", visual: PAGES + "lesson.html?ex=slices", tests: PAGES + "lesson.html?ex=slices" };
    // English terms keep a plain I; Azerbaijani names need the locale (i → İ, ı → I)
    const EN = { sysdesign: 1, live: 1 };
    const up = (p) => (EN[p.id] ? p.name.toUpperCase() : p.name.toLocaleUpperCase("az")).replace(/\s*\+\s*/g, "+");
    const cells = (n, cls, extra) => '<span class="flaps ' + cls + '" aria-hidden="true"' + (extra || "") + ">" + "<i class=\"flap\"><span>&nbsp;</span></i>".repeat(n) + "</span>";
    el.innerHTML =
      '<div class="board-top"><span>Açılış cədvəli · platforma bölmələri</span><span class="board-clock">indi ' + cells(5, "clock") + "</span></div>" +
      '<div class="board-cols"><span>Sıra</span><span>Bölmə</span><span>Nə verir</span><span>Status</span></div>' +
      W.PLATFORM.map((p, i) => {
        const tag = HREF[p.id] ? "a" : "div", st = p.status === "live" ? "live" : p.status === "later" ? "later" : "plan";
        return "<" + tag + ' class="brow"' + (HREF[p.id] ? ' href="' + HREF[p.id] + '"' : "") + ' aria-label="' + esc(i + 1 + ". " + p.name + " — " + W.STATUS[p.status][1] + ". " + p.desc) + '">' +
          cells(2, "num") + cells(NAME, "name") + '<span class="desc" aria-hidden="true">' + esc(p.desc) + "</span>" + cells(STAT, "status st-" + st, ' data-s="' + TXT[st].toLocaleLowerCase("az") + '"') + "</" + tag + ">";
      }).join("") +
      '<div class="board-foot"><span class="st-live"><i></i>açıqdır — indi işləyir</span><span class="st-plan"><i></i>planda — növbədədir</span><span class="st-later"><i></i>sonra</span><button class="board-replay" id="board-replay">Tablonu yenilə</button></div>';

    const put = (cell, ch) => { cell.firstChild.textContent = ch === " " ? " " : ch; cell.dataset.ch = ch; };
    function flip(cell, target, delay) {
      if ((cell.dataset.ch || " ") === target) return;
      if (reduced) { put(cell, target); return; }
      const n = target === " " ? 2 : 4 + Math.floor(Math.random() * 5);
      let k = 0;
      setTimeout(function tick() {
        k++;
        put(cell, k >= n ? target : CH[Math.floor(Math.random() * CH.length)]);
        cell.firstChild.animate([{ transform: "rotateX(-88deg)" }, { transform: "none" }], { duration: 72, easing: "ease-out" });
        if (k < n) setTimeout(tick, 60);
      }, delay);
    }
    function write(group, text, delay) {
      const cs = $$(".flap", group);
      text = text.padEnd(cs.length, " ").slice(0, cs.length);
      cs.forEach((c, i) => flip(c, text[i], delay + i * 17));
    }
    const rows = $$(".brow", el);
    function show() {
      rows.forEach((row, i) => {
        const p = W.PLATFORM[i], st = p.status === "live" ? "live" : p.status === "later" ? "later" : "plan", d = i * 150;
        write($(".num", row), String(i + 1).padStart(2, "0"), d);
        write($(".name", row), up(p), d + 40);
        write($(".status", row), TXT[st], d + 260);
      });
    }
    function clear() { $$(".brow .flap", el).forEach((c) => put(c, " ")); }
    function clock() { const t = new Date(); write($(".clock", el), String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0"), 0); }
    onEnter(el, () => { show(); clock(); setInterval(clock, 15000); }, "0px 0px -18% 0px");
    $("#board-replay").addEventListener("click", () => { clear(); show(); });
  })();

  // =====================================================================
  // 6. Boarding pass: where the reader stopped and what comes next.
  // =====================================================================
  (function pass() {
    const prev = nextIdx > 0 ? W.FLAT[nextIdx - 1] : null;
    $("#pass-from").textContent = prev ? prev.title : "Başlanğıc";
    $("#pass-to").textContent = nextLesson.title;
    $("#pass-sec").textContent = nextLesson.section;
    $("#pass-n").textContent = nextIdx + 1 + "/" + W.FLAT.length;
    $("#pass-fill").style.setProperty("--p", ((W.learnedSet.size / W.FLAT.length) * 100).toFixed(1) + "%");
    const href = W.lessonHref(nextLesson.slug);
    $("#pass").href = href; $("#cta-next").href = href;
    $("#pass").setAttribute("aria-label", "Minik talonu: " + (prev ? prev.title : "başlanğıc") + " stansiyasından " + nextLesson.title + " stansiyasına");
    onEnter($("#pass-slot"), () => $("#pass-slot").classList.add("is-in"));
  })();
})();

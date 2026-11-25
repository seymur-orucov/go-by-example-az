// Design v2 — lesson page.
// The lesson data below is a port of content/go/examples/slices/ (main.go with //@step markers,
// lesson.az.md, steps.yaml, quiz.az.yaml, takeaways.az.yaml, output.txt). On the real site the
// loader in apps/site/src/lib/lesson.ts produces the same shape at build time.
(function () {
  "use strict";
  const W = window.W3;
  const root = document.documentElement;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = W.esc;
  const motion = !W.reduced;
  // inline Markdown used in the lesson files: `code`, **bold**
  let linkHook = null; // set once the walkthrough exists (view modes redraw the code link)
  const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  // ================= lesson data (slices) =================
  const MAIN_GO = [
    "package main",
    "",
    'import "fmt"',
    "",
    "func main() {",
    "\t//@step nil",
    "\tvar cart []string",
    '\tfmt.Println("cart:", cart, len(cart), cart == nil)',
    "",
    "\t//@step append",
    '\tcart = append(cart, "bread")',
    '\tcart = append(cart, "cheese", "tea")',
    '\tfmt.Println("cart:", cart, len(cart), cap(cart))',
    "",
    "\t//@step index",
    '\tcart[0] = "flatbread"',
    '\tfmt.Println("first item:", cart[0])',
    "",
    "\t//@step make",
    "\tcounts := make([]int, 3)",
    "\tcounts[2] = 2",
    '\tfmt.Println("counts:", counts)',
    "",
    "\t//@step sub",
    "\tfirst := cart[:2]",
    '\tfirst[1] = "butter"',
    '\tfmt.Println("first two:", first)',
    '\tfmt.Println("cart:", cart)',
    "}",
  ].join("\n");
  const OUTPUT = "cart: [] 0 true\ncart: [bread cheese tea] 3 3\nfirst item: flatbread\ncounts: [0 0 2]\nfirst two: [flatbread butter]\ncart: [flatbread butter tea]";
  const LESSON = {
    slug: "slices",
    title: "Slices",
    subtitle: "Böyüyə bilən siyahı",
    level: "başlanğıc",
    duration: 4,
    intro: "Slice — eyni tipli elementlərin siyahısıdır və ölçüsü lazım olduqca böyüyür, bazar səbəti kimi. Əvvəlki dərsdəki array-dən fərqi budur: array-in ölçüsü tipin hissəsidir və dəyişmir, slice isə böyüyə bilər. Ona görə Go-da siyahılarla işləyəndə demək olar ki, həmişə slice istifadə olunur.",
    steps: [
      { id: "nil", title: "Boş slice", text: ["`[]string` — string-lərdən ibarət slice. Dəyər verilməyibsə, slice `nil`-dir: içində element yoxdur, `len` 0-dır. Səbət hələ boşdur. Məhsullar koddakı kimi ingiliscədir: `bread` (çörək), `cheese` (pendir), `tea` (çay), `flatbread` (lavaş), `butter` (yağ)."],
        out: ["cart: [] 0 true"], vis: { name: "cart", nil: true, cells: [], len: 0, cap: 0 } },
      { id: "append", title: "append", text: ["`append` sona element əlavə edir və yeni slice qaytarır, ona görə nəticəni yenə `cart`-a yazırıq. `len` elementlərin sayıdır, `cap` isə ayrılmış yerin həcmidir."],
        note: "**Diqqət:** nəticəni saxlamadan yalnız `append(cart, \"tea\")` yazsaq, kompilyasiya xətası alırıq.",
        out: ["cart: [bread cheese tea] 3 3"], vis: { name: "cart", cells: ["bread", "cheese", "tea"], len: 3, cap: 3, fresh: [0, 1, 2] } },
      { id: "index", title: "İndeks", text: ["Elementə indekslə müraciət edirik: `cart[0]` — birinci element, çünki saymaq 0-dan başlayır. Eyni yolla dəyəri dəyişirik: `\"bread\"`-i `\"flatbread\"` ilə əvəz etdik."],
        out: ["first item: flatbread"], vis: { name: "cart", cells: ["flatbread", "cheese", "tea"], len: 3, cap: 3, fresh: [0] } },
      { id: "make", title: "make", text: ["`make([]int, 3)` 3 elementlik slice yaradır və onu zero value ilə doldurur — `int` üçün `0`. Elementlər əvvəlcədən məlumdursa, slice literal ilə birbaşa yazmaq da olar: `[]int{1, 2, 3}`."],
        out: ["counts: [0 0 2]"], vis: { name: "counts", cells: ["0", "0", "2"], len: 3, cap: 3, fresh: [2] } },
      { id: "sub", title: "Slice-dan slice", text: ["`cart[:2]` ilk iki elementi götürür: başlanğıc daxildir, son (`2`) daxil deyil. Yeni slice eyni elementlərə baxır, kopya yaratmır — ona görə `first[1]`-i dəyişəndə `cart` da dəyişdi."],
        out: ["first two: [flatbread butter]", "cart: [flatbread butter tea]"], vis: { name: "cart[:2]", cells: ["flatbread", "butter", "tea"], len: 2, cap: 3, window: [0, 2] } },
    ],
    takeaways: {
      rules: [
        "`[]string` — string-lərdən ibarət slice; ölçüsü tipin hissəsi deyil. Dəyər verilməyibsə slice `nil`-dir və `len`-i 0-dır.",
        "`len(s)` elementlərin sayı, `cap(s)` isə ayrılmış yerin həcmidir.",
        "`append` yeni slice qaytarır, nəticəni saxlamaq lazımdır: `s = append(s, x)`. Saxlamasaq, kompilyasiya xətası alırıq.",
        "İndeks 0-dan başlayır: `s[0]` birinci elementdir.",
        "`s[a:b]` `a`-dan başlayır, `b` daxil deyil, və kopya yaratmır: iki slice eyni elementlərə baxır, birini dəyişəndə digəri də dəyişir.",
        "`make([]T, n)` n elementi zero value ilə doldurur.",
      ],
      practices: [
        "`append`-in nəticəsini həmişə eyni dəyişənə yazın: `cart = append(cart, ...)`.",
        "Boş slice üçün `var cart []string` kifayətdir: `nil` slice-a da `append` etmək olar.",
        "Slice-ı başqa yerə ötürəndə elementləri paylaşdığını yadda saxlayın; müstəqil nüsxə lazımdırsa, yeni slice yaradıb dəyərləri köçürün.",
      ],
    },
    quiz: [
      { q: "Bu kod nə çap edəcək?", code: "var s []int\nfmt.Println(len(s), s == nil)", options: ["0 true", "0 false", "nil true"], answer: 0, explain: "Dəyər verilməmiş slice `nil`-dir və uzunluğu 0-dır." },
      { q: "Bu kod nə çap edəcək?", code: "var s []int\ns = append(s, 5, 7)\nfmt.Println(s, len(s))", options: ["[5 7] 2", "[] 0", "panic: nil slice"], answer: 0, explain: "`nil` slice-a da `append` etmək olar — Go lazım olan yeri özü ayırır." },
      { q: "Bu kod nə çap edəcək?", code: 'n := make([]string, 2)\nfmt.Println(len(n), n[0] == "")', options: ["0 true", "2 true", "2 false"], answer: 1, explain: "`make` 2 element yaradır və onları zero value ilə doldurur; `string` üçün bu boş mətndir." },
      { q: "Bu kod nə çap edəcək?", code: "t := []int{1, 2, 3, 4}\nfmt.Println(t[1:3])", options: ["[1 2 3]", "[2 3]", "[2 3 4]"], answer: 1, explain: "1-ci indeks daxildir, 3-cü daxil deyil: `t[1]` və `t[2]`." },
      { q: "Bu kod nə çap edəcək?", code: "u := []int{1, 2, 3}\nv := u[:2]\nv[0] = 9\nfmt.Println(u)", options: ["[1 2 3]", "[9 2]", "[9 2 3]"], answer: 2, explain: "`v` `u`-nun elementlərinə baxır, kopya deyil; `v`-dəki dəyişiklik `u`-da da görünür." },
      { q: "Bu kod nə çap edəcək?", code: "m := make([]int, 2, 5)\nfmt.Println(len(m), cap(m))", options: ["2 5", "5 2", "2 2"], answer: 0, explain: "`make`-in ikinci arqumenti `len`, üçüncüsü `cap`-dir." },
      { q: "Bu kod işə salınanda nə olacaq?", code: "var c []int\nc[0] = 1", options: ["c [1] olacaq", "proqram panic ilə dayanacaq", "kompilyasiya xətası"], answer: 1, explain: "Boş slice-da 0-cı element yoxdur; əvvəlcə `append` ilə element əlavə etmək lazımdır." },
      { q: "Hansı sətir kompilyasiya olunmayacaq?", options: ["c = append(c, 1)", "append(c, 1)", "c = append(c, 1, 2)"], answer: 1, explain: "`append` yeni slice qaytarır; nəticə istifadə olunmasa, kompilyator xəta verir." },
    ],
  };

  // //@step markers → clean source + 1-based line ranges (same rule as the site loader:
  // a step runs until the next marker or the end of main; trailing blank lines are dropped)
  function parseSteps(src) {
    const lines = [], marks = [];
    src.split("\n").forEach((l) => {
      const m = l.trim().match(/^\/\/ ?@step\s+(\S+)/);
      if (m) marks.push({ id: m[1], from: lines.length + 1 });
      else lines.push(l);
    });
    let end = lines.length; // closing brace of main
    while (end > 0 && lines[end - 1].trim() !== "}") end--;
    marks.forEach((mk, i) => {
      let to = (i + 1 < marks.length ? marks[i + 1].from : end) - 1;
      while (to > mk.from && !lines[to - 1].trim()) to--;
      mk.to = to;
    });
    return { code: lines.join("\n"), ranges: marks };
  }
  const parsed = parseSteps(MAIN_GO);
  LESSON.code = parsed.code;
  LESSON.steps.forEach((s) => { const r = parsed.ranges.find((x) => x.id === s.id); s.from = r.from; s.to = r.to; });
  // map each step's output lines onto output.txt in order
  const OUT_LINES = OUTPUT.split("\n");
  (function () { let k = 0; LESSON.steps.forEach((s) => { s.outIdx = s.out.map(() => k++); }); })();

  // ================= which topic is asked for =================
  const want = new URLSearchParams(location.search).get("ex") || "slices";
  const topic = W.FLAT.find((x) => x.slug === want) || W.FLAT.find((x) => x.slug === "slices");
  const isSlices = topic.slug === "slices";
  const isReady = W.READY.has(topic.slug);
  const shown = isReady ? W.FLAT.find((x) => x.slug === "slices") : topic; // ready topics show the slices sample
  const idx = W.FLAT.findIndex((x) => x.slug === topic.slug);
  const prev = W.FLAT[idx - 1], next = W.FLAT[idx + 1];
  const sectionOf = (slug) => W.SECTIONS.find((s) => s.items.some((it) => it[0] === slug));

  // ================= sidebar =================
  const side = $("#lx-side");
  function renderSidebar() {
    const done = W.FLAT.filter((e) => W.learnedSet.has(e.slug)).length;
    const pct = Math.round((done / W.FLAT.length) * 100);
    let h = '<div class="sb-card glass dots"><span class="mono-ic" style="--c:#00add8">Go</span><div><b>Go yolu</b><small><b>' + done + "</b> / " + W.FLAT.length + " dərs · " + pct + '%</small></div><a class="sb-map" href="roadmap.html" title="Yol xəritəsi" aria-label="Yol xəritəsi">' + W.I.map + '</a><div class="sb-bar"><span style="width:' + pct + '%"></span></div></div><nav class="sb-nav" aria-label="Bölmələr">';
    W.SECTIONS.forEach((s, si) => {
      const open = s.items.some((it) => it[0] === topic.slug);
      const sd = s.items.filter((it) => W.learnedSet.has(it[0])).length;
      h += '<details class="sb-group"' + (open ? " open" : "") + "><summary><span class=\"sb-n\">" + String(si + 1).padStart(2, "0") + "</span>" + esc(s.title) + '<span class="sb-cnt">' + sd + "/" + s.items.length + "</span>" + W.I.chev + '</summary><ul class="sb-list">';
      s.items.forEach(([slug, title]) => {
        const st = W.learnedSet.has(slug) ? "done" : W.READY.has(slug) ? "ready" : "plan";
        h += '<li><a class="' + st + '" href="' + W.lessonHref(slug) + '"' + (slug === topic.slug ? ' aria-current="page"' : "") + '><span class="sb-dot" aria-hidden="true"></span>' + esc(title) + (st === "done" ? '<span class="sb-ok" aria-label="öyrənildi">✓</span>' : st === "plan" ? '<span class="sb-soon">tezliklə</span>' : "") + "</a></li>";
      });
      h += "</ul></details>";
    });
    side.innerHTML = h + "</nav>";
    const cur = side.querySelector('[aria-current="page"]');
    if (cur) side.scrollTop = Math.max(0, cur.offsetTop - side.clientHeight / 2);
  }
  renderSidebar();

  // ================= page body =================
  const main = $("#lx-main");
  const sec = sectionOf(topic.slug) || W.SECTIONS[1];
  const pager = '<nav class="lx-pager" aria-label="Dərslər arasında keçid">' +
    (prev ? '<a class="glass spot" href="' + W.lessonHref(prev.slug) + '"><span class="dir">← Əvvəlki <kbd>Shift ←</kbd></span><b>' + esc(prev.title) + "</b><small>" + esc(prev.sub) + "</small></a>" : "<span></span>") +
    (next ? '<a class="glass spot next" href="' + W.lessonHref(next.slug) + '"><span class="dir">Növbəti → <kbd>Shift →</kbd></span><b>' + esc(next.title) + "</b><small>" + esc(next.sub) + "</small></a>" : "<span></span>") + "</nav>";
  const crumbs = (t) => '<nav class="lx-crumbs" aria-label="Yol"><a href="index.html">Ana səhifə</a><span>/</span><a href="go.html">Go</a><span>/</span><a href="go.html#' + sec.id + '">' + esc(sec.title) + "</a><span>/</span><b>" + esc(t) + "</b></nav>";
  document.title = document.title.replace(/^[^·]+/, (isReady ? "Slices" : topic.title) + " ");

  if (!isReady) {
    // ---------- planned topic: "Hazırlanır" ----------
    const readyInSec = sec.items.filter((it) => W.READY.has(it[0]));
    main.innerHTML = crumbs(topic.title) +
      '<section class="lx-soon glass dots" data-reveal><div class="soon-orb" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="kicker" style="justify-content:flex-start">lesson.Write()<span class="caret"></span></div>' +
      '<h1 class="lx-title"><span class="title-grad">' + esc(topic.title) + '</span></h1><p class="lx-sub">' + esc(topic.sub) + " · " + esc(sec.title) + "</p>" +
      '<p class="soon-text">Bu dərs hələ yazılır. Hər dərs orijinal nümunə ilə hazırlanır, kod Go ilə işlədilib yoxlanılır — ona görə bir az vaxt aparır.</p>' +
      '<div class="soon-btns"><a class="btn btn-primary" href="' + W.lessonHref("slices") + '">Hazır dərsə keç: Slices <span class="arrow" data-icon="arrow"></span></a><a class="btn" href="go.html">Go səhifəsi</a><a class="btn btn-ghost" href="roadmap.html#' + esc(topic.slug) + '">Yol xəritəsində bax</a></div>' +
      (readyInSec.length ? '<div class="soon-ready"><span class="menu-label">Bu bölmədə hazırdır</span><div>' + readyInSec.map((it) => '<a class="chip" href="' + W.lessonHref(it[0]) + '">' + esc(it[1]) + "</a>").join("") + "</div></div>" : "") +
      "</section>" + pager;
    W.paintIcons(main);
    W.observe(main);
    wireViewModes();
    return;
  }

  const L = LESSON;
  const stepNo = (i) => String(i + 1).padStart(2, "0");
  main.innerHTML = crumbs("Slices") +
    (isSlices ? "" : '<div class="lx-notice glass"><span class="badge next">prototip</span><span>Prototipdə yalnız <b>Slices</b> dərsi doldurulub. <b>' + esc(topic.title) + "</b> dərsi saytda hazırdır — burada nümunə kimi Slices göstərilir.</span></div>") +
    '<header class="lx-head">' +
      '<div class="lx-meta"><span class="mono-ic" style="--c:#00add8">Go</span><span>' + esc(sectionOf("slices").title) + " · #" + String(W.FLAT.findIndex((x) => x.slug === "slices") + 1).padStart(2, "0") + " / " + W.FLAT.length + "</span></div>" +
      '<h1 class="lx-title"><span class="title-grad">' + L.title + '</span></h1><p class="lx-sub">' + esc(L.subtitle) + "</p>" +
      '<div class="lx-chips"><span class="chip c-green">' + L.level + '</span><span class="chip">' + L.duration + ' dəq</span><span class="chip">' + L.steps.length + ' addım</span><span class="chip c-acc">vizual</span><span class="chip">' + L.quiz.length + ' sual</span>' +
        '<a class="chip c-link" href="roadmap.html#slices">' + W.I.map + "Bu mövzu yol xəritəsində</a></div>" +
      '<div class="lx-actions"><button class="btn btn-sm" data-zen-toggle title="Zen rejimi (Z)"><span data-zen-label>Zen</span></button><button class="btn btn-sm" data-learned><span data-learned-label>✓ Öyrəndim</span></button></div>' +
    "</header>" +
    '<p class="lx-lead">' + md(L.intro) + "</p>" +
    '<div class="lx-walk">' +
      '<div class="lx-steps" id="lx-steps">' +
        L.steps.map((s, i) =>
          '<section class="lx-step glass" data-i="' + i + '" id="step-' + s.id + '" tabindex="-1">' +
            '<div class="st-head"><span class="st-num">' + stepNo(i) + "</span><h3>" + md(s.title) + '</h3><span class="st-lines">sətir ' + s.from + (s.to > s.from ? "–" + s.to : "") + "</span></div>" +
            s.text.map((p) => "<p>" + md(p) + "</p>").join("") +
            (s.note ? '<div class="st-note">' + md(s.note) + "</div>" : "") +
            '<pre class="code st-snip" data-from="' + s.from + '" data-to="' + s.to + '"></pre>' +
            '<div class="st-vis"><div class="st-vis-cap"><span>Yaddaş</span><small class="mono"></small></div><div class="vis"></div></div>' +
            '<div class="st-out"><span class="p">$</span><div>' + s.out.map((o) => "<span>" + esc(o) + "</span>").join("") + "</div></div>" +
          "</section>").join("") +
      "</div>" +
      '<div class="lx-pane" id="lx-pane"><div class="cw glass dots">' +
        '<div class="win-head cw-head"><span class="win-dots"><i></i><i></i><i></i></span><span class="cw-file">main.go</span>' +
          '<div class="cw-steps"><button class="btn btn-ghost btn-sm btn-icon" id="p-prev" aria-label="Əvvəlki addım" title="Əvvəlki addım (←)">‹</button><span class="cw-count" id="p-count">01 / 05</span><button class="btn btn-ghost btn-sm btn-icon" id="p-next" aria-label="Növbəti addım" title="Növbəti addım (→)">›</button><button class="btn btn-ghost btn-sm btn-icon cw-play" id="p-play" aria-label="Addımları oynat" title="Addımları oynat">▶</button></div>' +
          '<button class="btn btn-ghost btn-sm btn-icon" id="btn-copy" aria-label="Kodu kopyala" title="Kopyala"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg></button>' +
        "</div>" +
        '<div class="cw-progress"><span id="cw-progress"></span></div>' +
        '<pre class="code cw-code dim" id="cw-code" aria-label="main.go"></pre>' +
        '<div class="cw-term" aria-live="polite"><div class="cw-term-head"><span>Çıxış</span><span class="cw-status" id="cw-status"><i></i>addım rejimi</span><button class="btn btn-ghost btn-sm" id="btn-full" aria-pressed="false">Tam çıxış</button></div><div class="cw-term-body" id="cw-term"></div></div>' +
      "</div>" +
      '<div class="cw-hint"><span><kbd>←</kbd><kbd>→</kbd> addımlar</span><span><kbd>Z</kbd> zen</span><span><kbd>[</kbd> panel</span><span>izah ↔ kod: üzərinə gəl</span></div></div>' +
    "</div>" +
    '<div class="lx-after">' +
      '<section class="tk glass dots" data-reveal aria-labelledby="tk-h"><div class="kicker" style="justify-content:flex-start">Yadda saxla</div><h2 id="tk-h">Xülasə</h2>' +
        '<h3 class="tk-sub">Əsas məqamlar</h3><ul class="tk-rules">' + L.takeaways.rules.map((r) => "<li>" + md(r) + "</li>").join("") + "</ul>" +
        '<h3 class="tk-sub">Yaxşı təcrübə</h3><ul class="tk-good">' + L.takeaways.practices.map((r) => "<li>" + md(r) + "</li>").join("") + "</ul></section>" +
      '<section class="qz glass glow-border" data-reveal style="--i:1" aria-labelledby="qz-h" id="quiz"></section>' +
    "</div>" +
    '<div class="lx-done glass" id="lx-done"><div><b>Dərsi bitirdin?</b><small>İrəliləyiş bu brauzerdə saxlanılır</small></div><button class="btn btn-primary" data-learned><span data-learned-label>✓ Öyrəndim</span></button></div>' +
    pager;
  W.paintIcons(main);

  // ---------- code: full window + per-step snippets ----------
  const pre = $("#cw-code");
  W.renderCode(pre, L.code);
  const codeLines = $$(".ln", pre);
  const srcLines = L.code.split("\n");
  $$(".st-snip", main).forEach((p) => {
    const a = +p.dataset.from, b = +p.dataset.to;
    p.innerHTML = srcLines.slice(a - 1, b).map((l, k) => '<span class="ln hl" data-n="' + (a + k) + '">' + (W.hlGo(l) || " ") + "</span>").join("");
  });

  // ---------- memory visual ----------
  function renderVis(box, cap, v, animate) {
    cap.textContent = "len " + v.len + " · cap " + v.cap;
    if (v.nil) { box.innerHTML = '<div class="vis-row"><span class="vis-name">' + esc(v.name) + '</span><div class="cells"><span class="cell cap">nil</span></div></div>'; return; }
    const win = v.window;
    let cells = "";
    for (let k = 0; k < Math.max(v.cap, v.cells.length); k++) {
      const inLen = win ? k >= win[0] && k < win[1] : k < v.len;
      const fresh = animate && v.fresh && v.fresh.includes(k);
      const val = v.cells[k];
      const show = val == null ? "·" : /^\d+$/.test(val) ? val : '"' + val + '"';
      cells += '<span class="vcell"><span class="cell' + (inLen ? " on" : " cap") + (fresh ? " pop" : "") + '" style="--d:' + k * 70 + 'ms">' + esc(show) + '</span><small>' + k + "</small></span>";
    }
    box.innerHTML = '<div class="vis-row"><span class="vis-name">' + esc(v.name) + '</span><div class="cells">' + cells + "</div></div>" +
      (win ? '<p class="vis-note">eyni array, fərqli pəncərə: <code>cart[:2]</code> 0 və 1-ci elementləri görür</p>' : "");
  }
  const stepEls = $$(".lx-step", main);
  stepEls.forEach((el, i) => renderVis($(".vis", el), $(".st-vis-cap small", el), L.steps[i].vis, false));

  // ---------- output panel ----------
  const term = $("#cw-term");
  let fullOut = false;
  function paintTerm(i) {
    const on = new Set(L.steps[i].outIdx);
    term.innerHTML = OUT_LINES.map((l, k) => '<span class="' + (fullOut || on.has(k) ? "on" : "") + (on.has(k) && !fullOut ? " cur" : "") + '">' + esc(l) + "</span>").join("");
  }
  $("#btn-full").addEventListener("click", (e) => {
    fullOut = !fullOut;
    e.currentTarget.setAttribute("aria-pressed", String(fullOut));
    $("#cw-status").lastChild.textContent = fullOut ? "tam çıxış · output.txt" : "addım rejimi";
    $("#cw-status").classList.toggle("full", fullOut);
    paintTerm(cur);
  });
  $("#btn-copy").addEventListener("click", () => {
    const done = () => W.toast("Kod kopyalandı");
    try { navigator.clipboard.writeText(L.code).then(done, () => W.toast("Kopyalamaq alınmadı")); } catch (e) { W.toast("Kopyalamaq alınmadı"); }
  });

  // ---------- step engine (two-way highlighting) ----------
  let cur = -1, playing = 0, lockScroll = 0;
  const wide = () => matchMedia("(min-width: 1181px)").matches;
  const headerH = () => (root.hasAttribute("data-zen") ? 0 : 64);
  function setStep(i, opts) {
    opts = opts || {};
    i = Math.max(0, Math.min(L.steps.length - 1, i));
    const changed = i !== cur;
    cur = i;
    const s = L.steps[i];
    stepEls.forEach((el, k) => el.classList.toggle("active", k === i));
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 >= s.from && k + 1 <= s.to));
    $("#p-count").textContent = stepNo(i) + " / " + stepNo(L.steps.length - 1);
    $("#cw-progress").style.width = ((i + 1) / L.steps.length) * 100 + "%";
    $("#p-prev").disabled = i === 0;
    $("#p-next").disabled = i === L.steps.length - 1;
    paintTerm(i);
    if (changed) renderVis($(".vis", stepEls[i]), $(".st-vis-cap small", stepEls[i]), s.vis, motion);
    // keep highlighted lines visible inside the code window
    const first = codeLines[s.from - 1];
    if (first && changed) {
      const top = first.offsetTop - pre.clientHeight * 0.3;
      if (first.offsetTop < pre.scrollTop || first.offsetTop + (s.to - s.from + 1) * first.offsetHeight > pre.scrollTop + pre.clientHeight)
        pre.scrollTo({ top: Math.max(0, top), behavior: motion ? "smooth" : "auto" });
    }
    if (opts.scroll) scrollToStep(stepEls[i]);
    queueLink();
  }
  function scrollToStep(el) {
    const r = el.getBoundingClientRect();
    if (r.top >= headerH() + 8 && r.bottom <= innerHeight - 8) return;
    lockScroll = Date.now() + (motion ? 900 : 100);
    scrollTo({ top: scrollY + r.top - headerH() - Math.max(24, (innerHeight - headerH() - r.height) / 3), behavior: motion ? "smooth" : "auto" });
  }
  // scroll picks the step closest to 40% of the viewport
  function pickByScroll() {
    if (Date.now() < lockScroll || playing) return;
    const line = headerH() + (innerHeight - headerH()) * 0.4;
    let best = 0, bd = Infinity;
    stepEls.forEach((el, k) => { const r = el.getBoundingClientRect(); const d = r.top > line ? r.top - line : r.bottom < line ? line - r.bottom : 0; if (d < bd) { bd = d; best = k; } });
    if (best !== cur) setStep(best);
  }
  stepEls.forEach((el, k) => {
    el.addEventListener("mouseenter", () => { if (wide() && !playing) setStep(k); });
    el.addEventListener("click", (e) => { if (!e.target.closest("a, button")) setStep(k); });
  });
  pre.addEventListener("mouseover", (e) => {
    const ln = e.target.closest(".ln"); if (!ln || playing) return;
    const n = +ln.dataset.n, k = L.steps.findIndex((s) => n >= s.from && n <= s.to);
    if (k >= 0 && k !== cur) { setStep(k); clearTimeout(pre._t); pre._t = setTimeout(() => { if (cur === k) scrollToStep(stepEls[k]); }, 350); }
  });
  $("#p-prev").addEventListener("click", () => { stopPlay(); setStep(cur - 1, { scroll: true }); });
  $("#p-next").addEventListener("click", () => { stopPlay(); setStep(cur + 1, { scroll: true }); });
  const playBtn = $("#p-play");
  function stopPlay() { clearInterval(playing); playing = 0; playBtn.textContent = "▶"; playBtn.setAttribute("aria-label", "Addımları oynat"); $("#cw-status").classList.remove("play"); }
  playBtn.addEventListener("click", () => {
    if (playing) return stopPlay();
    if (cur >= L.steps.length - 1) setStep(0, { scroll: true });
    playBtn.textContent = "❚❚"; playBtn.setAttribute("aria-label", "Dayandır");
    $("#cw-status").classList.add("play");
    playing = setInterval(() => { if (cur >= L.steps.length - 1) return stopPlay(); setStep(cur + 1, { scroll: true }); }, 2400);
  });
  addEventListener("scroll", () => { pickByScroll(); queueLink(); paintRead(); }, { passive: true });
  addEventListener("resize", queueLink);
  pre.addEventListener("scroll", queueLink, { passive: true });

  // ---------- curved link: active step → its code lines ----------
  const link = $("#lx-link"), lp = $("#lx-link-path"), la = $("#lx-link-a"), lb = $("#lx-link-b"), lg = $("#linkGrad");
  // user-space gradient: a bounding-box gradient vanishes on a perfectly horizontal path
  lg.setAttribute("gradientUnits", "userSpaceOnUse");
  let linkRaf = 0;
  function queueLink() { if (!linkRaf) linkRaf = requestAnimationFrame(drawLink); }
  function drawLink() {
    linkRaf = 0;
    const el = stepEls[cur];
    if (!el || !wide()) { link.classList.remove("on"); return; }
    const s = L.steps[cur];
    const r = el.getBoundingClientRect(), pr = pre.getBoundingClientRect();
    const a = codeLines[s.from - 1].getBoundingClientRect(), b = codeLines[s.to - 1].getBoundingClientRect();
    const top = headerH();
    const y1 = Math.min(Math.max(r.top + 30, top + 20), r.bottom - 20);
    let y2 = (a.top + b.bottom) / 2;
    y2 = Math.min(Math.max(y2, pr.top + 8), pr.bottom - 8);
    const x1 = r.right, x2 = pr.left;
    const visible = r.bottom > top + 30 && r.top < innerHeight - 30 && x2 > x1;
    link.classList.toggle("on", visible);
    if (!visible) return;
    const dx = (x2 - x1) * 0.55;
    lp.setAttribute("d", "M" + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2);
    la.setAttribute("cx", x1); la.setAttribute("cy", y1);
    lb.setAttribute("cx", x2); lb.setAttribute("cy", y2);
    lg.setAttribute("x1", x1); lg.setAttribute("y1", y1); lg.setAttribute("x2", x2); lg.setAttribute("y2", y2);
  }

  // ---------- reading progress ----------
  const readBar = $("#read-bar");
  function paintRead() {
    const h = document.documentElement.scrollHeight - innerHeight;
    readBar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
  }

  // ---------- keyboard: ← → steps, Shift ← → lessons ----------
  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const a = document.activeElement;
    if (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable || a.closest(".qz") || $(".palette-backdrop:not([hidden])")) return;
    e.preventDefault();
    if (e.shiftKey) { const t = e.key === "ArrowRight" ? next : prev; if (t) location.href = W.lessonHref(t.slug); return; }
    stopPlay();
    setStep(cur + (e.key === "ArrowRight" ? 1 : -1), { scroll: true });
  });

  // ---------- learned ----------
  function paintLearned() {
    const on = W.learnedSet.has("slices");
    $$("[data-learned]").forEach((b) => { b.classList.toggle("is-done", on); b.setAttribute("aria-pressed", String(on)); });
    $$("[data-learned-label]").forEach((l) => (l.textContent = on ? "✓ Öyrənildi" : "✓ Öyrəndim"));
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-learned]")) return;
    if (W.learnedSet.has("slices")) { W.learnedSet.delete("slices"); W.toast("Qeyd silindi"); }
    else { W.learnedSet.add("slices"); W.toast("Əla! Slices öyrənildi" + (next ? " — növbəti: " + next.title : "")); }
    W.saveLearned(); paintLearned(); renderSidebar();
  });
  paintLearned();

  // ---------- quiz slider ----------
  const qz = $("#quiz");
  const res = L.quiz.map(() => null); // null | "first" | "retry"
  let qi = 0;
  qz.innerHTML = '<div class="qz-head"><div><div class="kicker" style="justify-content:flex-start">Özünü yoxla</div><h2 id="qz-h">Test · <span id="qz-n">1</span> / ' + L.quiz.length + '</h2></div><div class="qz-dots" id="qz-dots" role="tablist" aria-label="Suallar">' +
    L.quiz.map((_, k) => '<button role="tab" data-k="' + k + '" aria-label="Sual ' + (k + 1) + '"></button>').join("") + '<button role="tab" data-k="' + L.quiz.length + '" class="qz-dot-end" aria-label="Nəticə"></button></div></div>' +
    '<div class="qz-view" id="qz-view"><div class="qz-track" id="qz-track">' +
      L.quiz.map((q, k) => '<div class="qz-slide" data-k="' + k + '"><p class="qz-q">' + md(q.q) + "</p>" +
        (q.code ? '<pre class="code qz-code">' + q.code.split("\n").map((l, n) => '<span class="ln" data-n="' + (n + 1) + '">' + (W.hlGo(l) || " ") + "</span>").join("") + "</pre>" : "") +
        '<div class="qz-opts">' + q.options.map((o, n) => '<button class="qz-opt" data-n="' + n + '"><span class="qz-letter">' + "ABCD"[n] + '</span><span class="mono">' + esc(o) + "</span></button>").join("") + "</div>" +
        '<p class="qz-fb" aria-live="polite"></p></div>').join("") +
      '<div class="qz-slide qz-result" data-k="' + L.quiz.length + '"><div class="qz-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="qzGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--cyan)"/><stop offset=".5" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs><circle cx="60" cy="60" r="50" class="tr"/><circle cx="60" cy="60" r="50" class="br" id="qz-bar"/></svg><div><b id="qz-score">0/' + L.quiz.length + '</b><small>ilk cəhddə</small></div></div><h3 id="qz-verdict"></h3><p class="muted" id="qz-verdict-sub"></p><button class="btn btn-primary" id="qz-restart">Yenidən başla</button></div>' +
    "</div></div>" +
    '<div class="qz-foot"><button class="btn btn-sm" id="qz-prev">‹ Əvvəlki</button><button class="btn btn-sm" id="qz-next">Növbəti ›</button></div>';
  const slides = $$(".qz-slide", qz), track = $("#qz-track"), view = $("#qz-view");
  function goQuiz(k) {
    qi = Math.max(0, Math.min(L.quiz.length, k));
    track.style.transform = "translateX(" + -qi * 100 + "%)";
    slides.forEach((s, n) => { s.inert = n !== qi; s.setAttribute("aria-hidden", String(n !== qi)); });
    view.style.height = slides[qi].offsetHeight + "px";
    $("#qz-n").textContent = Math.min(qi + 1, L.quiz.length);
    $$("#qz-dots button").forEach((b) => { const k2 = +b.dataset.k; b.setAttribute("aria-selected", String(k2 === qi)); b.className = (k2 === L.quiz.length ? "qz-dot-end " : "") + (res[k2] || ""); });
    $("#qz-prev").disabled = qi === 0;
    const nx = $("#qz-next");
    nx.disabled = qi === L.quiz.length;
    nx.classList.toggle("btn-primary", qi < L.quiz.length && res[qi] != null);
    nx.textContent = qi === L.quiz.length - 1 ? "Nəticə ›" : "Növbəti ›";
    if (qi === L.quiz.length) paintResult();
  }
  function paintResult() {
    const ok = res.filter((r) => r === "first").length, n = L.quiz.length;
    $("#qz-score").textContent = ok + "/" + n;
    $("#qz-bar").style.strokeDashoffset = 314.2 * (1 - ok / n);
    const answered = res.filter(Boolean).length;
    $("#qz-verdict").textContent = answered < n ? "Hələ " + (n - answered) + " sual cavabsızdır" : ok === n ? "Mükəmməl! Hamısı ilk cəhddə." : ok >= n * 0.7 ? "Çox yaxşı — mövzunu başa düşmüsən." : "Pis deyil — addımlara bir də bax.";
    $("#qz-verdict-sub").textContent = answered < n ? "Nöqtələrdən birinə basıb qayıda bilərsən." : "Yaşıl — ilk cəhddə düz, sarı — ikinci cəhddə.";
  }
  qz.addEventListener("click", (e) => {
    const opt = e.target.closest(".qz-opt");
    if (opt) {
      const slide = opt.closest(".qz-slide"), k = +slide.dataset.k, q = L.quiz[k];
      if (slide.classList.contains("solved")) return;
      const good = +opt.dataset.n === q.answer;
      opt.classList.add(good ? "ok" : "bad");
      if (good) {
        if (res[k] == null) res[k] = "first";
        slide.classList.add("solved");
        $(".qz-fb", slide).innerHTML = '<b class="ok">Düzdür.</b> ' + md(q.explain);
      } else {
        res[k] = "retry";
        opt.disabled = true;
        $(".qz-fb", slide).innerHTML = '<b class="bad">Yox.</b> Bir də cəhd et.';
      }
      goQuiz(k);
      return;
    }
    const dot = e.target.closest("#qz-dots button"); if (dot) goQuiz(+dot.dataset.k);
    if (e.target.closest("#qz-prev")) goQuiz(qi - 1);
    if (e.target.closest("#qz-next")) goQuiz(qi + 1);
    if (e.target.closest("#qz-restart")) {
      res.fill(null);
      slides.forEach((s) => { s.classList.remove("solved"); $$(".qz-opt", s).forEach((o) => { o.className = "qz-opt"; o.disabled = false; }); const fb = $(".qz-fb", s); if (fb) fb.innerHTML = ""; });
      goQuiz(0);
    }
  });
  qz.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goQuiz(qi + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goQuiz(qi - 1); }
  });
  addEventListener("resize", () => (view.style.height = slides[qi].offsetHeight + "px"));
  goQuiz(0);

  if (!isSlices) setTimeout(() => W.toast("Prototipdə yalnız “Slices” doldurulub"), 400);
  linkHook = queueLink;
  wireViewModes();
  setStep(0);
  pickByScroll();
  paintRead();
  W.observe(main);
  if (document.fonts) document.fonts.ready.then(() => { queueLink(); view.style.height = slides[qi].offsetHeight + "px"; });

  // ================= view modes: sidebar [, width F, Zen Z / Esc =================
  function wireViewModes() {
    const narrow = () => matchMedia("(max-width: 980px)").matches;
    const isOff = () => root.getAttribute("data-sidebar") === "off";
    const isFull = () => root.getAttribute("data-width") === "full";
    const isZen = () => root.hasAttribute("data-zen");
    const save = (st, k, v) => { try { v == null ? st.removeItem(k) : st.setItem(k, v); } catch (e) { /* private mode */ } };
    function paint() {
      $$('[data-act="sidebar"]').forEach((b) => b.setAttribute("aria-checked", String(!isOff())));
      $$("[data-width-opt]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.widthOpt === "full") === isFull())));
      $$("[data-zen-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(isZen())));
      $$("[data-zen-label]").forEach((l) => (l.textContent = isZen() ? "Zen-dən çıx" : "Zen"));
      $$("[data-sb-toggle]").forEach((b) => b.setAttribute("aria-expanded", String(narrow() ? root.hasAttribute("data-drawer") : !isOff())));
    }
    const after = () => { paint(); setTimeout(() => { if (linkHook) linkHook(); }, 320); };
    function toggleSidebar() {
      if (narrow()) { root.toggleAttribute("data-drawer"); return after(); }
      if (isZen()) setZen(false);
      if (isOff()) root.removeAttribute("data-sidebar"); else root.setAttribute("data-sidebar", "off");
      save(localStorage, "w3:sidebar", isOff() ? "off" : "on");
      after();
    }
    function setWidth(full) {
      if (full) root.setAttribute("data-width", "full"); else root.removeAttribute("data-width");
      save(localStorage, "w3:width", full ? "full" : "center");
      after();
    }
    function setZen(on) {
      if (on === isZen()) return;
      if (on) root.setAttribute("data-zen", ""); else root.removeAttribute("data-zen");
      root.removeAttribute("data-drawer");
      save(sessionStorage, "w3:zen", on ? "1" : null);
      if (on) W.toast("Zen rejimi — çıxmaq üçün Esc");
      after();
    }
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-sb-toggle], [data-act='sidebar']")) toggleSidebar();
      if (e.target.closest("[data-sb-close]")) { root.removeAttribute("data-drawer"); paint(); }
      const w = e.target.closest("[data-width-opt]"); if (w) setWidth(w.dataset.widthOpt === "full");
      if (e.target.closest("[data-zen-toggle]")) setZen(!isZen());
      if (narrow() && e.target.closest(".lx-side a")) root.removeAttribute("data-drawer");
    });
    // capture: when the search palette is open, Esc belongs to it
    addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const a = document.activeElement;
      if (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable || $(".palette-backdrop:not([hidden])")) return;
      if (e.key === "Escape") { if (isZen()) setZen(false); else if (root.hasAttribute("data-drawer")) { root.removeAttribute("data-drawer"); paint(); } return; }
      if (e.key === "[") { e.preventDefault(); toggleSidebar(); }
      else if (e.code === "KeyF" && !isZen()) { e.preventDefault(); setWidth(!isFull()); W.toast(isFull() ? "Kontent: tam en" : "Kontent: mərkəzdə"); }
      else if (e.code === "KeyZ") { e.preventDefault(); setZen(!isZen()); }
    }, true);
    paint();
  }
})();

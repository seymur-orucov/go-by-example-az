/* Variant D — sample roadmap node content + the shared node panel (theory · practice · visual · test · interview).
   Used by index.html (explorer) and roadmap.html. Prototype data: on the platform each node links to real
   theory / practice / quiz / interview items. Depends on ../shared/app.js (window.GOAZ). */
(function () {
  "use strict";
  const G = window.GOAZ;
  const esc = G.esc;

  const LIST = [
    { slug: "hello-world", title: "Hello World", sec: "Əsaslar",
      theory: "Hər Go proqramı <code>package main</code> ilə başlayır, icra isə <code>main()</code> funksiyasından başlayır. <code>fmt.Println</code> mətni ekrana çıxarır.",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Salam, Dünya!")\n}',
      steps: ["package main — icra olunan proqram", "import \"fmt\" — çap paketi", "main() — icra buradan başlayır"],
      quiz: { q: "Proqramın icrası hansı funksiyadan başlayır?", opts: ["init()", "main()", "start()"], ok: 1 },
      interview: { q: "<code>package main</code> ilə adi paket arasında fərq nədir?", a: "<code>package main</code> icra olunan proqram yaradır və onda <code>main()</code> funksiyası olmalıdır. Digər paketlər kitabxana kimi import olunur." } },
    { slug: "variables", title: "Variables", sec: "Əsaslar",
      theory: "<code>var</code> ilə dəyişən elan olunur; funksiyanın daxilində qısa <code>:=</code> yazılışı tipi dəyərdən özü müəyyən edir. Dəyər verilməyən dəyişən <b>sıfır dəyəri</b> alır.",
      code: 'var a int\nb := "go"\nfmt.Println(a, b) // 0 go',
      steps: ["var a int → a = 0 (sıfır dəyər)", "b := \"go\" → tip: string", "Println → 0 go"],
      quiz: { q: "<code>var x int</code> — <code>x</code>-in dəyəri nədir?", opts: ["nil", "0", "təyin olunmayıb"], ok: 1 },
      interview: { q: "<code>var</code> və <code>:=</code> arasında fərq nədir?", a: "<code>:=</code> yalnız funksiyanın daxilində işləyir və tipi dəyərdən çıxarır. <code>var</code> paket səviyyəsində də işləyir və tipi açıq yazmağa imkan verir." } },
    { slug: "for", title: "For", sec: "Əsaslar",
      theory: "Go-da yeganə dövr əmri <code>for</code>-dur: klassik üç hissəli forma, yalnız şərtli forma (<code>while</code> kimi) və sonsuz dövr.",
      code: 'for i := 0; i < 3; i++ {\n\tfmt.Print(i, " ")\n}\n// 0 1 2',
      steps: ["i := 0 → başlanğıc", "i < 3 → şərt yoxlanılır", "i++ → hər dövrdən sonra"],
      quiz: { q: "Bu kod nə çap edir?", opts: ["0 1 2 3", "0 1 2", "1 2 3"], ok: 1 },
      interview: { q: "Go-da <code>while</code> yoxdursa, onu necə yazırsınız?", a: "Yalnız şərti olan <code>for</code> ilə: <code>for x &lt; 10 { … }</code>. Şərtsiz <code>for { … }</code> isə sonsuz dövrdür." } },
    { slug: "slices", title: "Slices", sec: "Kolleksiyalar",
      theory: "Slice massivin bir hissəsinə <b>baxışdır</b>: uzunluğu (<code>len</code>) və tutumu (<code>cap</code>) var. <code>append</code> tutum çatmayanda yeni, daha böyük massiv ayırır.",
      code: "s := []int{10, 20, 30}\ns = append(s, 40)\nfmt.Println(s[1:3]) // [20 30]",
      steps: ["[]int{10, 20, 30} → len 3, cap 3", "append(s, 40) → yeni massiv, cap 6", "s[1:3] → [20 30]"],
      quiz: { q: "<code>s[1:3]</code> nə qaytarır?", opts: ["[10 20]", "[20 30]", "[20 30 40]"], ok: 1 },
      interview: { q: "<code>append</code> nə vaxt yeni massiv ayırır və bu niyə vacibdir?", a: "<code>len</code> <code>cap</code>-a çatanda. Bundan sonra köhnə və yeni slice fərqli massivlərə baxır: birinə yazmaq digərini dəyişmir." } },
    { slug: "maps", title: "Maps", sec: "Kolleksiyalar",
      theory: "Map açar–dəyər cütlərini saxlayır. Olmayan açar sıfır dəyər qaytarır; açarın olub-olmadığını <code>v, ok := m[k]</code> ilə yoxlamaq olur.",
      code: 'm := map[string]int{"a": 1}\nv, ok := m["b"]\nfmt.Println(v, ok) // 0 false',
      steps: ["map yaradılır: a → 1", "m[\"b\"] → açar yoxdur", "v = 0, ok = false"],
      quiz: { q: "Bu kod nə çap edir?", opts: ["0 false", "nil false", "panic"], ok: 0 },
      interview: { q: "Map üzərində <code>range</code> ilə gəzəndə elementlərin sırası necə olur?", a: "Sıra təsadüfidir və hər dəfə fərqli ola bilər. Sıra lazımdırsa, açarları ayrıca slice-a yığıb sıralayın." } },
    { slug: "goroutines", title: "Goroutines", sec: "Concurrency",
      theory: "<code>go f()</code> funksiyanı ayrıca goroutine-də, paralel işə salır. Goroutine-lər çox yüngüldür; nəticəni gözləmək üçün <code>sync.WaitGroup</code> və ya channel lazımdır.",
      code: 'go say("salam") // paralel\nsay("dünya")    // main goroutine\ntime.Sleep(time.Second)',
      steps: ["go say(…) → yeni goroutine", "say(\"dünya\") → main davam edir", "Sleep → nəticəni gözləyirik"],
      quiz: { q: "<code>main()</code> bitəndə işləyən goroutine-lərə nə olur?", opts: ["gözlənilir", "dayandırılır", "fonda davam edir"], ok: 1 },
      interview: { q: "Goroutine ilə OS thread arasında fərq nədir?", a: "Goroutine-i Go runtime idarə edir: kiçik stack ilə (bir neçə KB) başlayır və minlərlə goroutine az sayda OS thread üzərində planlaşdırılır." } },
  ];
  const SAMPLE = {};
  LIST.forEach((n) => (SAMPLE[n.slug] = n));

  const TABS = ["theory", "practice", "visual", "quiz", "interview"];

  // Mounts the 5-tab panel. els: { sec, title, status, tabs, body } (DOM elements). Returns { show(slug), current() }.
  function mountNodePanel(els) {
    const ls = G.learnedSet;
    const next = G.FLAT.find((e) => !ls.has(e.slug));
    let cur = null, tab = "theory";

    function body(n, meta) {
      const link = (text) => '<a class="nx-link" href="' + G.href(n ? n.slug : meta.slug) + '">' + text + " →</a>";
      const soon = (text) => '<p class="nx-text">' + text + "</p>";
      const lesson = n || G.READY.has(meta.slug);
      if (tab === "theory") return n ? '<p class="nx-text">' + n.theory + "</p>" + link("Tam izahı oxu") : soon("Bu mövzunun izahı hazırlanır: " + esc(meta.sub) + ".") + (lesson ? link("Dərsə keç") : "");
      if (tab === "practice") return n ? '<div class="nx-code"><pre class="code" data-code></pre></div>' + link("Dərsə keç və işə sal") : soon("İşlək nümunə və tapşırıq tezliklə əlavə olunacaq.");
      if (tab === "visual") return n ? '<ol class="nx-steps">' + n.steps.map((s, i) => '<li style="--i:' + i + '"><span>' + String(i + 1).padStart(2, "0") + "</span><code>" + esc(s) + "</code></li>").join("") + "</ol>" + link("Addım-addım vizuala bax") : soon("Bu mövzu üçün vizual izah hazırlanır.");
      if (tab === "quiz") return n ? '<p class="nx-q">' + n.quiz.q + '</p><div class="nx-opts">' + n.quiz.opts.map((o, i) => '<button data-opt="' + i + '"><code>' + esc(o) + "</code></button>").join("") + '</div><p class="nx-soon">Önizləmə · Testlər bölməsi növbəti mərhələdə</p>' : soon("Bu mövzunun testi tezliklə əlavə olunacaq.");
      return n ? '<p class="nx-q">' + n.interview.q + '</p><details class="nx-ans"><summary>Cavabı göstər</summary><p>' + n.interview.a + '</p></details><p class="nx-soon">Önizləmə · Müsahibə bölməsi planlaşdırılır</p>' : soon("Bu mövzu üzrə müsahibə sualları tezliklə əlavə olunacaq.");
    }

    function renderBody() {
      const meta = G.FLAT.find((e) => e.slug === cur), n = SAMPLE[cur];
      els.body.innerHTML = body(n, meta);
      const pre = els.body.querySelector("[data-code]");
      if (pre && n) G.renderCode(pre, n.code);
      els.body.classList.remove("nx-in"); void els.body.offsetWidth; els.body.classList.add("nx-in");
    }

    function render() {
      const meta = G.FLAT.find((e) => e.slug === cur);
      els.sec.textContent = "Go · " + meta.section;
      els.title.textContent = meta.title;
      const isDone = ls.has(cur), isNext = next && next.slug === cur;
      els.status.className = "nx-status" + (isDone ? " done" : isNext ? " next" : "");
      els.status.textContent = isDone ? "✓ öyrənilib" : isNext ? "növbəti" : "qarşıda";
      els.tabs.querySelectorAll("[data-tab]").forEach((b) => {
        const on = b.dataset.tab === tab;
        b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
      });
      renderBody();
    }

    els.tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tab]"); if (!b) return;
      tab = b.dataset.tab; render();
    });
    // Arrow keys move between tabs (WAI-ARIA tabs pattern)
    els.tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      tab = TABS[(TABS.indexOf(tab) + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length]; render();
      els.tabs.querySelector('[data-tab="' + tab + '"]').focus();
    });
    els.body.addEventListener("click", (e) => {
      const o = e.target.closest("[data-opt]"); if (!o || o.parentElement.classList.contains("answered")) return;
      const q = SAMPLE[cur].quiz, ok = +o.dataset.opt === q.ok;
      o.parentElement.classList.add("answered");
      o.classList.add(ok ? "right" : "wrong");
      if (!ok) o.parentElement.querySelector('[data-opt="' + q.ok + '"]').classList.add("right");
      G.toast(ok ? "Düzdür!" : "Düzgün cavab işarələndi");
    });

    return { show(slug) { cur = slug; render(); }, current: () => cur };
  }

  window.GOAZ_D = { LIST, SAMPLE, mountNodePanel };
})();

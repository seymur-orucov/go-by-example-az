// Lesson page behavior (design v2): step walkthrough with two-way explanation <-> code
// highlighting, step output, play, the curved explanation -> code link, full output, copy, the
// "Öyrəndim" button, reading progress, view modes (sidebar, width, Zen) and keyboard shortcuts.
// The page renders all markup at build time; the quiz lives in quiz.ts.
import { learnedSet, reduced, saveLearned, toast } from "@platform/theme/scripts/v2";
import type { CodeEditor } from "./editor";

interface LessonData {
  slug: string;
  steps: { from: number; to: number; out?: string }[];
  code: string;
  output: string;
  /** `go run main.go` for Go; null for a terminal session, whose output already holds the `$ cmd` lines. */
  run: string | null;
  /** Go lessons: the code can be edited and run through POST /api/run. */
  runnable: boolean;
  /** Toast after copying the code pane. */
  copied: string;
  next: { title: string; href: string } | null;
  prev: { href: string } | null;
  /** Markdown code lessons: each step's lines rendered (HTML) instead of program output. */
  previews: string[] | null;
  /** Markdown code lessons: the whole file rendered, for the "Tam nəticə" view. */
  fullPreview: string | null;
}

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document): T | null =>
  scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document): T[] => [
  ...scope.querySelectorAll<T>(sel),
];
const motion = !reduced;
const pad = (n: number): string => String(n).padStart(2, "0");

function readData(): LessonData | null {
  const el = document.getElementById("lesson-data");
  try {
    return el?.textContent ? (JSON.parse(el.textContent) as LessonData) : null;
  } catch {
    return null;
  }
}

const typing = (): boolean => {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable);
};
const paletteOpen = (): boolean => !!$(".palette-backdrop:not([hidden])");

// ---------- view modes: sidebar [, width F, Zen Z / Esc ----------
function initViewModes(onLayout: () => void): void {
  const narrow = (): boolean => matchMedia("(max-width: 980px)").matches;
  const isOff = (): boolean => root.getAttribute("data-sidebar") === "off";
  const isFull = (): boolean => root.getAttribute("data-width") === "full";
  const isZen = (): boolean => root.hasAttribute("data-zen");
  const save = (st: Storage, k: string, v: string | null): void => {
    try {
      if (v == null) st.removeItem(k);
      else st.setItem(k, v);
    } catch {
      /* private mode */
    }
  };
  function paint(): void {
    $$('[data-act="sidebar"]').forEach((b) => b.setAttribute("aria-checked", String(!isOff())));
    $$("[data-width-opt]").forEach((b) =>
      b.setAttribute("aria-pressed", String((b.dataset.widthOpt === "full") === isFull())),
    );
    $$("[data-zen-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(isZen())));
    $$("[data-zen-label]").forEach((l) => (l.textContent = isZen() ? "Zen-dən çıx" : "Zen"));
    $$("[data-sb-toggle]").forEach((b) =>
      b.setAttribute(
        "aria-expanded",
        String(narrow() ? root.hasAttribute("data-drawer") : !isOff()),
      ),
    );
  }
  const after = (): void => {
    paint();
    setTimeout(onLayout, 320);
  };
  function setZen(on: boolean): void {
    if (on === isZen()) return;
    if (on) root.setAttribute("data-zen", "");
    else root.removeAttribute("data-zen");
    root.removeAttribute("data-drawer");
    save(sessionStorage, "w3:zen", on ? "1" : null);
    if (on) toast("Zen rejimi — çıxmaq üçün Esc");
    after();
  }
  function toggleSidebar(): void {
    if (narrow()) {
      root.toggleAttribute("data-drawer");
      return after();
    }
    if (isZen()) setZen(false);
    if (isOff()) root.removeAttribute("data-sidebar");
    else root.setAttribute("data-sidebar", "off");
    save(localStorage, "w3:sidebar", isOff() ? "off" : "on");
    after();
  }
  function setWidth(full: boolean): void {
    if (full) root.setAttribute("data-width", "full");
    else root.removeAttribute("data-width");
    save(localStorage, "w3:width", full ? "full" : "center");
    after();
  }
  document.addEventListener("click", (e) => {
    const t = e.target as Element;
    if (t.closest("[data-sb-toggle], [data-act='sidebar']")) toggleSidebar();
    if (t.closest("[data-sb-close]")) {
      root.removeAttribute("data-drawer");
      paint();
    }
    const w = t.closest<HTMLElement>("[data-width-opt]");
    if (w) setWidth(w.dataset.widthOpt === "full");
    if (t.closest("[data-zen-toggle]")) setZen(!isZen());
    if (narrow() && t.closest(".lx-side a")) root.removeAttribute("data-drawer");
  });
  // capture: when the search palette is open, Esc belongs to it
  addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || typing() || paletteOpen()) return;
      if (e.key === "Escape") {
        if (isZen()) setZen(false);
        else if (root.hasAttribute("data-drawer")) {
          root.removeAttribute("data-drawer");
          paint();
        }
        return;
      }
      // e.code does not depend on the keyboard layout (on the AZ layout [ is "ö")
      if (e.code === "BracketLeft" || (!e.code && e.key === "[")) {
        e.preventDefault();
        toggleSidebar();
      } else if (e.code === "KeyF" && !isZen()) {
        e.preventDefault();
        setWidth(!isFull());
        toast(isFull() ? "Kontent: tam en" : "Kontent: mərkəzdə");
      } else if (e.code === "KeyZ") {
        e.preventDefault();
        setZen(!isZen());
      }
    },
    true,
  );
  paint();
}

// ---------- reading progress ----------
function initReadProgress(): void {
  const bar = $("#read-bar");
  if (!bar) return;
  const paint = (): void => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  };
  addEventListener("scroll", paint, { passive: true });
  paint();
}

// ---------- learned button ----------
function initLearned(data: LessonData): void {
  const paint = (): void => {
    const on = learnedSet.has(data.slug);
    $$("[data-learned]").forEach((b) => {
      b.classList.toggle("is-done", on);
      b.setAttribute("aria-pressed", String(on));
    });
    $$("[data-learned-label]").forEach((l) => (l.textContent = on ? "✓ Öyrənildi" : "✓ Öyrəndim"));
  };
  document.addEventListener("click", (e) => {
    if (!(e.target as Element).closest("[data-learned]")) return;
    if (learnedSet.has(data.slug)) {
      learnedSet.delete(data.slug);
      toast("Qeyd silindi");
    } else {
      learnedSet.add(data.slug);
      toast(data.next ? `Əla! Növbəti: ${data.next.title} →` : "Əla! Bütün mövzular bitdi.");
    }
    saveLearned();
    paint();
  });
  paint();
}

// ---------- walkthrough ----------
function initWalkthrough(data: LessonData): () => void {
  const pre = $("#cw-code")!;
  const stepEls = $$(".lx-step");
  const codeLines = $$(".ln", pre);
  const term = $("#cw-term")!;
  const status = $("#cw-status")!;
  const n = data.steps.length;
  const prevBtn = $<HTMLButtonElement>("#p-prev")!;
  const nextBtn = $<HTMLButtonElement>("#p-next")!;
  const playBtn = $<HTMLButtonElement>("#p-play")!;

  // terminal lines: every step's output in order, tagged with the step that prints it
  const outLines = data.steps.flatMap((s, i) =>
    s.out
      ? s.out
          .replace(/\n$/, "")
          .split("\n")
          .map((text) => ({ text, step: i }))
      : [],
  );
  const outputLines = data.output.replace(/\n$/, "").split("\n");
  let fullOut = false;
  const esc = (s: string): string =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // In a terminal session the `$ cmd` lines get the prompt color; an empty line keeps a line's height.
  const session = data.run === null;
  const lineHtml = (s: string): string =>
    s === ""
      ? " "
      : session && s.startsWith("$ ")
        ? `<b class="p">$</b> ${esc(s.slice(2))}`
        : esc(s);
  // While set, the terminal shows the result of "İşə sal" instead of the recorded output.
  let runHtml: string | null = null;
  function paintTerm(i: number): void {
    if (runHtml !== null) {
      term.innerHTML = runHtml;
      return;
    }
    if (data.previews) {
      term.innerHTML = fullOut ? (data.fullPreview ?? "") : (data.previews[i] ?? "");
      return;
    }
    term.innerHTML = fullOut
      ? outputLines.map((l) => `<span class="on">${lineHtml(l)}</span>`).join("")
      : outLines
          .map((l) => {
            const cls = l.step < i ? "on" : l.step === i ? "on cur" : "";
            return `<span class="${cls}">${lineHtml(l.text)}</span>`;
          })
          .join("") || '<span class="on">— bu addıma qədər heç nə çap olunmur</span>';
  }
  const setStatus = (text: string, cls = ""): void => {
    status.className = "cw-status" + (cls ? ` ${cls}` : "");
    status.lastChild!.textContent = text;
  };

  let cur = -1;
  let playing = 0;
  let lockScroll = 0;
  const wide = (): boolean => matchMedia("(min-width: 1181px)").matches;
  const headerH = (): number => (root.hasAttribute("data-zen") ? 0 : 64);

  function popVis(el: HTMLElement): void {
    if (!motion) return;
    $$(".cell.new, .tl-bar", el).forEach((c) => {
      c.classList.remove("pop");
      void c.offsetWidth;
      c.classList.add("pop");
    });
  }

  function setStep(i: number, opts: { scroll?: boolean } = {}): void {
    i = Math.max(0, Math.min(n - 1, i));
    const changed = i !== cur;
    cur = i;
    const s = data.steps[i]!;
    stepEls.forEach((el, k) => el.classList.toggle("active", k === i));
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 >= s.from && k + 1 <= s.to));
    $("#p-count")!.textContent = `${pad(i + 1)} / ${pad(n)}`;
    $("#cw-progress")!.style.width = `${((i + 1) / n) * 100}%`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === n - 1;
    if (!fullOut) paintTerm(i);
    if (changed) popVis(stepEls[i]!);
    // keep the highlighted lines visible inside the code window
    const first = codeLines[s.from - 1];
    if (first && changed) {
      const top = first.offsetTop - pre.clientHeight * 0.3;
      if (
        first.offsetTop < pre.scrollTop ||
        first.offsetTop + (s.to - s.from + 1) * first.offsetHeight >
          pre.scrollTop + pre.clientHeight
      )
        pre.scrollTo({ top: Math.max(0, top), behavior: motion ? "smooth" : "auto" });
    }
    if (opts.scroll) scrollToStep(stepEls[i]!);
    queueLink();
  }

  function scrollToStep(el: HTMLElement): void {
    const r = el.getBoundingClientRect();
    if (r.top >= headerH() + 8 && r.bottom <= innerHeight - 8) return;
    lockScroll = Date.now() + (motion ? 900 : 100);
    scrollTo({
      top: scrollY + r.top - headerH() - Math.max(24, (innerHeight - headerH() - r.height) / 3),
      behavior: motion ? "smooth" : "auto",
    });
  }
  // scrolling picks the step closest to 40% of the viewport
  function pickByScroll(): void {
    if (Date.now() < lockScroll || playing) return;
    const line = headerH() + (innerHeight - headerH()) * 0.4;
    let best = 0;
    let bd = Infinity;
    stepEls.forEach((el, k) => {
      const r = el.getBoundingClientRect();
      const d = r.top > line ? r.top - line : r.bottom < line ? line - r.bottom : 0;
      if (d < bd) {
        bd = d;
        best = k;
      }
    });
    if (best !== cur) setStep(best);
  }
  stepEls.forEach((el, k) => {
    el.addEventListener("mouseenter", () => {
      if (wide() && !playing) setStep(k);
    });
    el.addEventListener("click", (e) => {
      if (!(e.target as Element).closest("a, button")) setStep(k);
    });
  });
  let hoverTimer: number | undefined;
  pre.addEventListener("mouseover", (e) => {
    const ln = (e.target as Element).closest<HTMLElement>(".ln");
    if (!ln || playing) return;
    const num = Number(ln.dataset.n);
    const k = data.steps.findIndex((s) => num >= s.from && num <= s.to);
    if (k >= 0 && k !== cur) {
      setStep(k);
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        if (cur === k) scrollToStep(stepEls[k]!);
      }, 350);
    }
  });

  function stopPlay(): void {
    clearInterval(playing);
    playing = 0;
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Addımları oynat");
    status.classList.remove("play");
  }
  prevBtn.addEventListener("click", () => {
    stopPlay();
    setStep(cur - 1, { scroll: true });
  });
  nextBtn.addEventListener("click", () => {
    stopPlay();
    setStep(cur + 1, { scroll: true });
  });
  playBtn.addEventListener("click", () => {
    if (playing) return stopPlay();
    if (cur >= n - 1) setStep(0, { scroll: true });
    playBtn.textContent = "❚❚";
    playBtn.setAttribute("aria-label", "Dayandır");
    status.classList.add("play");
    playing = window.setInterval(() => {
      if (cur >= n - 1) return stopPlay();
      setStep(cur + 1, { scroll: true });
    }, 2400);
  });

  // full output toggle + copy
  const fullBtn = $("#btn-full")!;
  const paintFullBtn = (): void => {
    fullBtn.setAttribute("aria-pressed", String(fullOut && runHtml === null));
    fullBtn.textContent = runHtml !== null ? "Dərsin çıxışı" : "Tam çıxış";
  };
  fullBtn.addEventListener("click", () => {
    // after a run, the button brings back the lesson's own output
    if (runHtml !== null) runHtml = null;
    else fullOut = !fullOut;
    paintFullBtn();
    const fullText = data.previews ? "bütün fayl" : "tam çıxış · output.txt";
    setStatus(fullOut ? fullText : "addım rejimi", fullOut ? "full" : "");
    paintTerm(cur);
  });
  const play = data.runnable
    ? initPlayground(
        data,
        pre,
        (html, text, cls) => {
          runHtml = html;
          paintFullBtn();
          setStatus(text, cls);
          paintTerm(cur);
        },
        queueLink,
      )
    : null;
  $("#btn-copy")!.addEventListener("click", () => {
    const fail = (): void => toast("Kopyalamaq alınmadı");
    try {
      navigator.clipboard.writeText(play?.code() ?? data.code).then(() => toast(data.copied), fail);
    } catch {
      fail();
    }
  });

  // curved link: active step -> its code lines
  const link = $<SVGSVGElement>("#lx-link")!;
  const lp = $("#lx-link-path")!;
  const la = $("#lx-link-a")!;
  const lb = $("#lx-link-b")!;
  const lg = $("#linkGrad")!;
  // user-space gradient: a bounding-box gradient vanishes on a perfectly horizontal path
  lg.setAttribute("gradientUnits", "userSpaceOnUse");
  let linkRaf = 0;
  function queueLink(): void {
    if (!linkRaf) linkRaf = requestAnimationFrame(drawLink);
  }
  function drawLink(): void {
    linkRaf = 0;
    const el = stepEls[cur];
    if (!el || !wide() || pre.hidden) {
      link.classList.remove("on");
      return;
    }
    const s = data.steps[cur]!;
    const r = el.getBoundingClientRect();
    const pr = pre.getBoundingClientRect();
    const a = codeLines[s.from - 1]!.getBoundingClientRect();
    const b = codeLines[s.to - 1]!.getBoundingClientRect();
    const top = headerH();
    const y1 = Math.min(Math.max(r.top + 30, top + 20), r.bottom - 20);
    const y2 = Math.min(Math.max((a.top + b.bottom) / 2, pr.top + 8), pr.bottom - 8);
    const x1 = r.right;
    const x2 = pr.left;
    const visible = r.bottom > top + 30 && r.top < innerHeight - 30 && x2 > x1;
    link.classList.toggle("on", visible);
    if (!visible) return;
    const dx = (x2 - x1) * 0.55;
    lp.setAttribute("d", `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`);
    la.setAttribute("cx", String(x1));
    la.setAttribute("cy", String(y1));
    lb.setAttribute("cx", String(x2));
    lb.setAttribute("cy", String(y2));
    lg.setAttribute("x1", String(x1));
    lg.setAttribute("y1", String(y1));
    lg.setAttribute("x2", String(x2));
    lg.setAttribute("y2", String(y2));
  }
  addEventListener(
    "scroll",
    () => {
      pickByScroll();
      queueLink();
    },
    { passive: true },
  );
  addEventListener("resize", queueLink);
  pre.addEventListener("scroll", queueLink, { passive: true });

  // keyboard: left/right move between steps (Shift + arrows between lessons is global)
  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const a = document.activeElement as HTMLElement | null;
    if (typing() || a?.closest(".qz") || paletteOpen()) return;
    e.preventDefault();
    stopPlay();
    setStep(cur + (e.key === "ArrowRight" ? 1 : -1), { scroll: true });
  });

  setStep(0);
  pickByScroll();
  if (document.fonts) void document.fonts.ready.then(queueLink);
  return queueLink;
}

// ---------- edit + run (Go lessons) ----------
interface RunResult {
  errors: string;
  vet: string;
  events: { kind: "stdout" | "stderr"; text: string }[];
}
const escHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** One <span> per line; the terminal styles `.err`, `.warn` and `.note` lines. */
const termLines = (text: string, cls = ""): string =>
  text
    .replace(/\n$/, "")
    .split("\n")
    .map((l) => `<span class="on${cls ? ` ${cls}` : ""}">${escHtml(l) || " "}</span>`)
    .join("");

/**
 * "Redaktə" swaps the highlighted code for a CodeMirror editor (loaded on the first click),
 * "Sıfırla" restores the lesson's code, "İşə sal" (or Ctrl+Enter) sends the current code to
 * /api/run and shows the result through `show`. Returns the code that copy should take.
 */
function initPlayground(
  data: LessonData,
  pre: HTMLElement,
  show: (html: string, status: string, cls: string) => void,
  relayout: () => void,
): { code: () => string } {
  const editBtn = $<HTMLButtonElement>("#btn-edit")!;
  const resetBtn = $<HTMLButtonElement>("#btn-reset")!;
  const runBtn = $<HTMLButtonElement>("#btn-run")!;
  const host = $("#cw-editor")!;
  const cw = pre.closest<HTMLElement>(".cw")!;
  let editor: CodeEditor | null = null;
  let editing = false;
  let running = false;

  const code = (): string => editor?.getCode() ?? data.code;
  const edited = (): boolean => code() !== data.code;
  const paintEdited = (): void => {
    resetBtn.hidden = !edited();
    cw.classList.toggle("is-edited", edited());
  };

  async function setEditing(on: boolean): Promise<void> {
    if (on && !editor) {
      editBtn.disabled = true;
      try {
        const { createEditor } = await import("./editor");
        editor = createEditor(host, data.code, paintEdited);
      } catch {
        toast("Redaktoru yükləmək alınmadı");
        return;
      } finally {
        editBtn.disabled = false;
      }
    }
    editing = on;
    host.hidden = !on;
    pre.hidden = on;
    cw.classList.toggle("is-editing", on);
    editBtn.setAttribute("aria-pressed", String(on));
    editBtn.title = on ? "Addımlara qayıt (E)" : "Redaktə (E)";
    relayout(); // the explanation -> code link hides while the editor is shown
    if (on) editor?.focus();
    else if (edited()) toast("Dəyişikliklər saxlanılır — «İşə sal» sənin kodunu işlədir");
  }

  async function run(): Promise<void> {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = "İşləyir…";
    const mine = edited();
    show('<span class="on note">Go Playground-a göndərilir…</span>', "işləyir · go.dev", "play");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code() }),
      });
      const body = (await res.json().catch(() => null)) as (RunResult & { error?: string }) | null;
      if (!res.ok || !body || body.error) throw new Error(body?.error ?? `HTTP ${res.status}`);
      if (body.errors) {
        show(termLines(body.errors, "err"), "kompilyasiya xətası", "err");
        return;
      }
      let html = body.vet ? termLines(`go vet: ${body.vet}`, "warn") : "";
      html += body.events.map((e) => termLines(e.text, e.kind === "stderr" ? "err" : "")).join("");
      if (!body.events.length) html += '<span class="on note">— proqram heç nə çap etmədi</span>';
      const printed = body.events.map((e) => e.text).join("");
      if (!mine && printed.replace(/\n$/, "") !== data.output.replace(/\n$/, "")) {
        html +=
          '<span class="on note">— nəticə dərsdəkindən fərqlidir: Playground-da saat 2009-11-10-da dayanıb, şəbəkə, fayl sistemi və proseslər məhduddur</span>';
      }
      show(html, mine ? "sənin kodun · go.dev" : "işlədi · go.dev", "ran");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      show(
        termLines(`İşə salmaq alınmadı: ${msg}`, "err") +
          '<span class="on note">Kodu kopyalayıb <a href="https://go.dev/play/" target="_blank" rel="noopener">go.dev/play</a>-da işlədə bilərsiniz</span>',
        "işə salınmadı",
        "err",
      );
    } finally {
      running = false;
      runBtn.disabled = false;
      runBtn.textContent = "▶ İşə sal";
    }
  }

  editBtn.addEventListener("click", () => void setEditing(!editing));
  resetBtn.addEventListener("click", () => {
    editor?.setCode(data.code);
    paintEdited();
    toast("Kod ilkin halına qaytarıldı");
  });
  runBtn.addEventListener("click", () => void run());
  // capture: Ctrl+Enter must reach us before the editor inserts a line
  addEventListener(
    "keydown",
    (e) => {
      if (paletteOpen() || e.altKey) return;
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        if ((document.activeElement as HTMLElement | null)?.closest(".qz")) return;
        e.preventDefault();
        e.stopPropagation();
        void run();
      } else if (e.code === "KeyE" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !typing()) {
        e.preventDefault();
        void setEditing(!editing);
      }
    },
    true,
  );
  return { code };
}

// Shift + arrows: previous / next lesson (planned pages have no walkthrough, so this is global).
function initLessonKeys(data: LessonData): void {
  addEventListener("keydown", (e) => {
    if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (typing() || paletteOpen()) return;
    const target = e.key === "ArrowRight" ? data.next : data.prev;
    if (!target) return;
    e.preventDefault();
    location.href = target.href;
  });
}

const data = readData();
let relayout = (): void => {};
if (data) {
  if (data.steps.length) relayout = initWalkthrough(data);
  initLearned(data);
  initLessonKeys(data);
}
initViewModes(() => relayout());
initReadProgress();

// Lesson walkthrough, ported from design/shared/b.js (createLesson) and design/d/example.html:
// step controls, two-way explanation <-> code highlighting, step output, play, full output,
// copy and the "Öyrəndim" button (the quiz lives in quiz.ts). The page renders all markup; this only adds behavior.
import { store } from "@platform/theme/scripts/storage";
import { escapeHtml } from "@platform/theme/scripts/text";
import { toast } from "@platform/theme/scripts/toast";
import { KEY_LEARNED, readLearned } from "./lesson-sidebar";

interface LessonData {
  slug: string;
  steps: { from: number; to: number; out?: string }[];
  code: string;
  output: string;
  /** The command shown above the full output ("go run main.go"); null for terminal sessions, whose output has its own `$` lines. */
  run: string | null;
  /** Toast after copying the code pane. */
  copied: string;
  next: { title: string; href: string } | null;
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

function readData(): LessonData | null {
  const el = document.getElementById("lesson-data");
  try {
    return el?.textContent ? (JSON.parse(el.textContent) as LessonData) : null;
  } catch {
    return null;
  }
}

const wide = () => matchMedia("(min-width: 1201px)").matches;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One output line; in a terminal session (no `run` command) the `$ cmd` lines get the prompt
 * color. An empty line becomes a space, so its block keeps a line's height (pre-wrap).
 */
const lineHtml = (l: string, session: boolean) =>
  l === ""
    ? " "
    : session && l.startsWith("$ ")
      ? `<span class="prompt">$</span> ${escapeHtml(l.slice(2))}`
      : escapeHtml(l);

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>';
const PAUSE_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

function initWalkthrough(data: LessonData): void {
  const pre = $("#code")!;
  const stepEls = Array.from(document.querySelectorAll<HTMLElement>(".step[data-step]"));
  const term = $("[data-term]")!;
  const status = $("[data-run-status]")!;
  const count = $("[data-step-count]")!;
  const prevBtn = $<HTMLButtonElement>("[data-prev-step]")!;
  const nextBtn = $<HTMLButtonElement>("[data-next-step]")!;
  const playBtn = $<HTMLButtonElement>("[data-play]")!;
  const codeLines = Array.from(pre.querySelectorAll<HTMLElement>(".line"));
  const n = data.steps.length;

  let pinned = 0; // chosen by scroll, buttons or keys
  let shown = -1; // currently displayed (hover may preview another step)
  let playing: number | undefined;

  const setStatus = (cls: string, text: string) => {
    status.className = "status" + (cls ? " " + cls : "");
    status.lastElementChild!.textContent = text;
  };

  // Output printed up to step i; earlier lines dimmed.
  function paintTerm(i: number) {
    const outs = data.steps
      .slice(0, i + 1)
      .map((s, k) => ({ out: s.out, k }))
      .filter((x) => x.out !== undefined);
    term.innerHTML = outs.length
      ? outs
          .flatMap(({ out, k }) =>
            out!
              .split("\n")
              .map(
                (l) =>
                  `<span class="out-line${k < i ? " dim" : ""}">${lineHtml(l, data.run === null)}</span>`,
              ),
          )
          .join("")
      : '<span class="out-line dim">— bu addıma qədər heç nə çap olunmur</span>';
  }

  // Re-insert the step's visual so its CSS entrance animation plays again.
  function replayVis(el: HTMLElement) {
    const vis = $(".vis", el);
    if (vis && !reduced()) vis.replaceWith(vis.cloneNode(true));
  }

  function show(i: number) {
    if (i === shown) return;
    shown = i;
    const s = data.steps[i]!;
    pre.classList.add("has-focus");
    for (const l of codeLines) {
      const k = Number(l.dataset.n);
      l.classList.toggle("hl", k >= s.from && k <= s.to);
    }
    stepEls.forEach((el, k) => el.classList.toggle("is-active", k === i));
    count.textContent = `${pad(i + 1)} / ${pad(n)}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === n - 1;
    paintTerm(i);
    setStatus("", "addım rejimi");
    replayVis(stepEls[i]!);
  }

  // Wide screens: bring the step's explanation into view without fighting the scroll observer.
  let lockScroll = 0;
  const inView = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.top >= 70 && r.bottom <= innerHeight;
  };
  function scrollToStep(el: HTMLElement) {
    lockScroll = Infinity;
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      lockScroll = Date.now() + 120;
    };
    addEventListener("scrollend", release, { once: true });
    setTimeout(release, 1500);
    el.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "center" });
  }

  function go(i: number, fromUser = false) {
    i = Math.max(0, Math.min(n - 1, i));
    pinned = i;
    show(i);
    if (fromUser && wide() && !inView(stepEls[i]!)) scrollToStep(stepEls[i]!);
  }
  const preview = (i: number | null) => show(i ?? pinned);

  function paintPlay() {
    playBtn.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
    playBtn.setAttribute("aria-label", playing ? "Dayandır" : "Addımları oynat");
    playBtn.title = playing ? "Dayandır" : "Addımları oynat";
  }
  function stop() {
    clearInterval(playing);
    playing = undefined;
    paintPlay();
  }
  function play() {
    if (playing) return stop();
    if (pinned === n - 1) go(0, true);
    playing = window.setInterval(() => {
      if (pinned >= n - 1) return stop();
      go(pinned + 1, true);
    }, 2200);
    paintPlay();
  }

  prevBtn.addEventListener("click", () => {
    stop();
    go(pinned - 1, true);
  });
  nextBtn.addEventListener("click", () => {
    stop();
    go(pinned + 1, true);
  });
  playBtn.addEventListener("click", play);
  paintPlay();

  // Code -> explanation: hovering a line previews its step.
  const stepForLine = (k: number) => data.steps.findIndex((s) => k >= s.from && k <= s.to);
  let hoverTimer: number | undefined;
  pre.addEventListener("mouseover", (e) => {
    const line = (e.target as Element).closest<HTMLElement>(".line");
    if (!line) return;
    const i = stepForLine(Number(line.dataset.n));
    if (i < 0) return;
    preview(i);
    clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => {
      if (wide() && !inView(stepEls[i]!)) scrollToStep(stepEls[i]!);
    }, 350);
  });
  pre.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    preview(null);
  });
  // Clicking a line pins its step.
  pre.addEventListener("click", (e) => {
    const line = (e.target as Element).closest<HTMLElement>(".line");
    const i = line ? stepForLine(Number(line.dataset.n)) : -1;
    if (i >= 0) {
      stop();
      go(i);
    }
  });

  // Explanation -> code: hover previews, click pins, scrolling picks the step in the middle.
  let hovering = false;
  stepEls.forEach((el, i) => {
    el.addEventListener("mouseenter", () => {
      if (!wide()) return;
      hovering = true;
      preview(i);
    });
    el.addEventListener("mouseleave", () => {
      hovering = false;
      preview(null);
    });
    el.addEventListener("click", () => {
      if (!wide()) return;
      stop();
      go(i);
    });
  });
  const io = new IntersectionObserver(
    (entries) => {
      if (hovering || Date.now() < lockScroll) return;
      for (const en of entries)
        if (en.isIntersecting) go(stepEls.indexOf(en.target as HTMLElement));
    },
    { rootMargin: "-42% 0px -50% 0px" },
  );
  stepEls.forEach((el) => io.observe(el));

  // ← → move between steps (capture: the shell uses plain arrows for the pager; Shift+arrows still do).
  addEventListener(
    "keydown",
    (ev) => {
      if (ev.shiftKey || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
      const a = document.activeElement as HTMLElement | null;
      if (a && (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable)) return;
      if (document.querySelector(".palette-backdrop.open")) return;
      // Inside the quiz the arrows move between questions (quiz.ts stops them there).
      if (a?.closest("[data-quiz]")) return;
      ev.stopPropagation();
      ev.preventDefault();
      stop();
      go(pinned + (ev.key === "ArrowRight" ? 1 : -1), true);
    },
    true,
  );

  // A code pane taller than the screen keeps its bottom edge visible (the code is never trimmed).
  const pane = $("#pane")!;
  function fitSticky() {
    const headerH =
      (document.documentElement.hasAttribute("data-zen")
        ? 0
        : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) ||
          58) + 16;
    const h = pane.offsetHeight;
    pane.style.top = `${h > innerHeight - headerH - 16 ? innerHeight - h - 16 : headerH}px`;
  }
  fitSticky();
  addEventListener("resize", fitSticky);
  addEventListener("goaz:layout", fitSticky);

  // Full output: the recorded output of `go run main.go` or of the whole terminal session
  // (live Go runs come with the /api/run proxy).
  const runBtn = $<HTMLButtonElement>("[data-run]")!;
  function showOutput() {
    stop();
    pre.classList.remove("has-focus");
    shown = -1;
    term.innerHTML = data.run ? `<span class="prompt">$</span> ${escapeHtml(data.run)}` : "";
    data.output
      .replace(/\n$/, "")
      .split("\n")
      .forEach((l, i) => {
        const s = document.createElement("span");
        s.className = "out-line";
        s.style.animationDelay = `${i * 60}ms`;
        s.innerHTML = lineHtml(l, data.run === null);
        term.appendChild(s);
      });
    setStatus("ok", data.run ? "proqramın tam çıxışı" : "sessiyanın tam çıxışı");
  }
  runBtn.addEventListener("click", showOutput);
  document.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      showOutput();
    }
  });

  $("[data-copy]")!.addEventListener("click", async () => {
    toast((await copyText(data.code)) ? data.copied : "Kopyalamaq alınmadı");
  });

  go(0);
}

// The Clipboard API works on https and localhost, which covers every place the site runs.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function initLearned(data: LessonData): void {
  const btn = $<HTMLButtonElement>("[data-learned]");
  if (!btn) return;
  const paint = () => {
    const on = readLearned().has(data.slug);
    btn.classList.toggle("is-done", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.querySelector("span")!.textContent = on ? "Öyrənildi" : "Öyrəndim";
  };
  btn.addEventListener("click", () => {
    const learned = readLearned();
    if (learned.has(data.slug)) learned.delete(data.slug);
    else {
      learned.add(data.slug);
      toast(data.next ? `Əla! Növbəti: ${data.next.title} →` : "Əla! Bütün mövzular bitdi.");
    }
    store.set(KEY_LEARNED, [...learned]);
    paint();
    dispatchEvent(new Event("goaz:learned"));
  });
  paint();
}

const data = readData();
if (data) {
  initWalkthrough(data);
  initLearned(data);
}

// Stage player of the visual lesson pilots: chapters, step counter, narration, the command with
// its output, and prediction questions ("Proqnoz et") that hold a frame back until answered.
// The page supplies `show(frame, index, from)`, which draws the visual.
import type { FrameText } from "../data/lab-player";

export const reducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AUTOPLAY_MS = 5200;

export function createPlayer<F extends FrameText>(
  root: HTMLElement,
  frames: F[],
  chapters: string[],
  show: (frame: F, index: number, from: number) => void,
): { go: (i: number) => void } {
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const title = $("[data-p-title]");
  const body = $("[data-p-body]");
  const chapterEl = $("[data-p-chapter]");
  const cmdBox = $("[data-p-cmd]");
  const cmdText = $("[data-p-cmd-text]");
  const outBox = $<HTMLPreElement>("[data-p-out]");
  const outBtn = $<HTMLButtonElement>("[data-p-out-toggle]");
  const askBox = $("[data-p-ask]");
  const count = $("[data-p-count]");
  const prev = $<HTMLButtonElement>("[data-p-prev]");
  const next = $<HTMLButtonElement>("[data-p-next]");
  const play = $<HTMLButtonElement>("[data-p-play]");
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-p-tab]")];
  const segs = [...root.querySelectorAll<HTMLElement>("[data-p-seg]")];
  const narr = $("[data-p-narr]");

  let index = -1;
  let shown = -1; // frame whose visual is on stage
  let timer = 0;
  const answered = new Map<number, number>(); // frame → chosen option
  let outOpen = false;

  const pad = (n: number) => String(n).padStart(2, "0");

  function setOut(open: boolean) {
    outOpen = open;
    outBox.hidden = !open;
    outBtn.setAttribute("aria-expanded", String(open));
    outBtn.textContent = open ? "Çıxışı gizlət" : "Terminalda nə görünür?";
  }
  outBtn.addEventListener("click", () => setOut(!outOpen));

  function renderText(f: F, i: number) {
    title.innerHTML = f.title;
    body.innerHTML = f.body;
    body.hidden = false;
    cmdBox.hidden = !f.cmd;
    if (f.cmd) {
      cmdText.textContent = f.cmd;
      outBtn.hidden = !f.out;
      outBox.textContent = f.out ?? "";
      setOut(outOpen && !!f.out);
    }
    const a = f.ask;
    if (a && answered.has(i)) renderAsk(f, i, answered.get(i)!);
    else askBox.hidden = true;
  }

  function renderAsk(f: F, i: number, chosen: number | null) {
    const a = f.ask!;
    askBox.hidden = false;
    askBox.innerHTML = "";
    const head = document.createElement("div");
    head.className = "ask-head";
    head.innerHTML = `<span class="ask-tag">Proqnoz et</span>`;
    const q = document.createElement("p");
    q.className = "ask-q";
    q.innerHTML = a.q;
    const list = document.createElement("div");
    list.className = "ask-opts";
    a.options.forEach((o, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ask-opt";
      b.innerHTML = `<span class="ask-key">${"ABC"[k]}</span><span>${o}</span>`;
      if (chosen !== null) {
        b.disabled = true;
        if (k === a.answer) b.classList.add("is-right");
        else if (k === chosen) b.classList.add("is-wrong");
      } else {
        b.addEventListener("click", () => answer(i, k));
      }
      list.append(b);
    });
    askBox.append(head, q, list);
    if (chosen !== null) {
      const fb = document.createElement("p");
      fb.className = "ask-fb " + (chosen === a.answer ? "ok" : "no");
      fb.innerHTML =
        (chosen === a.answer ? "<b>Düzdür.</b> " : chosen < 0 ? "" : "<b>Bu dəfə yox.</b> ") +
        a.explain;
      askBox.append(fb);
    }
  }

  function answer(i: number, k: number) {
    answered.set(i, k);
    reveal(i);
  }

  // Show frame i's visual and text (after its prediction, if any).
  function reveal(i: number) {
    const f = frames[i]!;
    renderText(f, i);
    show(f, i, shown);
    shown = i;
    next.textContent = i === frames.length - 1 ? "Sona çatdı" : "Növbəti →";
    next.disabled = i === frames.length - 1;
    narr.classList.remove("is-asking");
  }

  function go(i: number, user = true) {
    if (i < 0 || i >= frames.length) return;
    if (user) stop();
    index = i;
    const f = frames[i]!;
    chapterEl.textContent = `${f.chapter + 1}-ci hissə · ${chapters[f.chapter]}`;
    count.textContent = `${pad(i + 1)} / ${pad(frames.length)}`;
    prev.disabled = i === 0;
    tabs.forEach((t) =>
      t.setAttribute("aria-selected", String(Number(t.dataset.pTab) === f.chapter)),
    );
    segs.forEach((s, k) => {
      s.classList.toggle("is-done", k < i);
      s.classList.toggle("is-cur", k === i);
    });
    if (f.ask && !answered.has(i)) {
      // Hold the visual on the previous frame until the reader predicts.
      title.textContent = "Növbəti addımdan əvvəl…";
      body.hidden = true;
      cmdBox.hidden = true;
      renderAsk(f, i, null);
      narr.classList.add("is-asking");
      next.textContent = "Cavabı göstər";
      next.disabled = false;
      const before = Math.max(0, i - 1);
      if (shown !== before) {
        show(frames[before]!, before, shown);
        shown = before;
      }
      stop();
      return;
    }
    reveal(i);
  }

  function step(d: number) {
    const f = frames[index]!;
    if (d > 0 && f.ask && !answered.has(index)) {
      answered.set(index, -1);
      reveal(index);
      return;
    }
    go(index + d);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = 0;
    play.textContent = "▶ Oynat";
    play.setAttribute("aria-pressed", "false");
  }
  function start() {
    if (index >= frames.length - 1) go(0);
    play.textContent = "❚❚ Dayan";
    play.setAttribute("aria-pressed", "true");
    timer = window.setInterval(() => {
      if (index >= frames.length - 1) return stop();
      go(index + 1, false);
    }, AUTOPLAY_MS);
  }

  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  play.addEventListener("click", () => (timer ? stop() : start()));
  $("[data-p-reset]").addEventListener("click", () => {
    answered.clear();
    shown = -1;
    go(0);
  });
  tabs.forEach((t) =>
    t.addEventListener("click", () =>
      go(frames.findIndex((f) => f.chapter === Number(t.dataset.pTab))),
    ),
  );
  segs.forEach((s, k) => s.addEventListener("click", () => go(k)));

  // ← → work while the stage is the main thing on screen and focus is not in a field.
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable]")) return;
    const r = root.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    if (r.top > mid || r.bottom < mid * 0.6) return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  });

  go(0, false);
  return { go };
}

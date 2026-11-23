import { icons } from "./icons";
import { store } from "./storage";
import { escapeHtml as esc, normalize } from "./text";

export interface SearchEntry {
  slug: string;
  title: string;
  sub: string;
  section: string;
  n: number;
  href: string;
}

export interface Palette {
  open(): void;
  close(): void;
  isOpen(): boolean;
}

export function buildPalette(entries: SearchEntry[]): Palette {
  const learned = new Set(store.get<string[]>("goaz:learned", []));
  const wrap = document.createElement("div");
  wrap.className = "palette-backdrop";
  wrap.innerHTML =
    '<div class="palette" role="dialog" aria-modal="true" aria-label="Axtarış">' +
    `<div class="palette-input-row">${icons.search}` +
    '<input type="text" placeholder="Nümunə axtar… (məs. slice, dövr, kanal)" aria-label="Axtarış" autocomplete="off" spellcheck="false">' +
    "<kbd>Esc</kbd></div>" +
    '<ul class="palette-list" role="listbox"></ul>' +
    '<div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> seç</span><span><kbd>↵</kbd> aç</span><span><kbd>Esc</kbd> bağla</span></div>' +
    "</div>";
  document.body.appendChild(wrap);
  const input = wrap.querySelector("input")!;
  const list = wrap.querySelector<HTMLElement>(".palette-list")!;
  let results: SearchEntry[] = [];
  let sel = 0;

  const mark = (text: string, q: string): string => {
    if (!q) return esc(text);
    const i = normalize(text).indexOf(q);
    if (i < 0) return esc(text);
    return `${esc(text.slice(0, i))}<mark>${esc(text.slice(i, i + q.length))}</mark>${esc(text.slice(i + q.length))}`;
  };

  function render(): void {
    const q = normalize(input.value.trim());
    results = entries.filter(
      (e) =>
        !q ||
        normalize(e.title).includes(q) ||
        normalize(e.sub).includes(q) ||
        normalize(e.section).includes(q),
    );
    if (sel >= results.length) sel = 0;
    if (!results.length) {
      list.innerHTML = '<li class="palette-empty">Heç nə tapılmadı. Başqa söz yoxlayın.</li>';
      return;
    }
    let html = "";
    let group: string | null = null;
    results.slice(0, 60).forEach((e, i) => {
      if (e.section !== group) {
        group = e.section;
        html += `<li class="palette-group" role="presentation">${esc(group)}</li>`;
      }
      html +=
        `<li class="palette-item" role="option" data-i="${i}" aria-selected="${i === sel}">` +
        `<span class="pi-num">${String(e.n).padStart(2, "0")}</span>` +
        `<span class="pi-title">${mark(e.title, q)}</span>` +
        `<span class="pi-sub">${mark(e.sub, q)}</span>` +
        (learned.has(e.slug) ? '<span class="pi-done">✓ öyrənildi</span>' : "") +
        "</li>";
    });
    list.innerHTML = html;
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }

  const go = (i: number): void => {
    const e = results[i];
    if (e) location.href = e.href;
  };

  input.addEventListener("input", () => {
    sel = 0;
    render();
  });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") {
      sel = Math.min(sel + 1, results.length - 1);
      render();
      ev.preventDefault();
    } else if (ev.key === "ArrowUp") {
      sel = Math.max(sel - 1, 0);
      render();
      ev.preventDefault();
    } else if (ev.key === "Enter") go(sel);
  });
  list.addEventListener("mousemove", (ev) => {
    const li = (ev.target as Element).closest<HTMLElement>(".palette-item");
    if (!li) return;
    const i = Number(li.dataset.i);
    if (i === sel) return;
    sel = i;
    list
      .querySelectorAll<HTMLElement>(".palette-item")
      .forEach((x) => x.setAttribute("aria-selected", String(Number(x.dataset.i) === sel)));
  });
  list.addEventListener("click", (ev) => {
    const li = (ev.target as Element).closest<HTMLElement>(".palette-item");
    if (li) go(Number(li.dataset.i));
  });

  let lastFocus: HTMLElement | null = null;
  const palette: Palette = {
    open() {
      lastFocus = document.activeElement as HTMLElement | null;
      wrap.classList.add("open");
      input.value = "";
      sel = 0;
      render();
      setTimeout(() => input.focus(), 10);
    },
    close() {
      wrap.classList.remove("open");
      lastFocus?.focus();
    },
    isOpen: () => wrap.classList.contains("open"),
  };
  wrap.addEventListener("click", (ev) => {
    if (ev.target === wrap) palette.close();
  });
  return palette;
}

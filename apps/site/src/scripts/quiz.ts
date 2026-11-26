// "Özünü yoxla" quiz slider (design v2): one question at a time, prev/next, progress dots and a
// result slide. A wrong option is marked and disabled; the right one closes the question and
// shows the explanation. The score counts questions answered right on the first try.
// Markup: components/Quiz.astro.
type Status = "first" | "retry" | null;

function initQuiz(root: HTMLElement): void {
  const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = root): T =>
    scope.querySelector<T>(sel)!;
  const view = $("[data-quiz-view]");
  const track = $("[data-quiz-track]");
  const slides = Array.from(track.children) as HTMLElement[];
  const questions = slides.filter((s) => !s.classList.contains("qz-result"));
  const total = questions.length;
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>(".qz-dots button"));
  const prevBtn = $<HTMLButtonElement>("[data-quiz-prev]");
  const nextBtn = $<HTMLButtonElement>("[data-quiz-next]");
  const res: Status[] = questions.map(() => null);
  let qi = 0;

  const fit = (): void => {
    view.style.height = `${slides[qi]!.offsetHeight}px`;
  };

  function paintResult(): void {
    const ok = res.filter((r) => r === "first").length;
    $("[data-quiz-score]").textContent = `${ok}/${total}`;
    $<SVGElement>("[data-quiz-bar]").style.strokeDashoffset = String(314.2 * (1 - ok / total));
    const answered = res.filter(Boolean).length;
    $("[data-quiz-verdict]").textContent =
      answered < total
        ? `Hələ ${total - answered} sual cavabsızdır`
        : ok === total
          ? "Mükəmməl! Hamısı ilk cəhddə."
          : ok >= total * 0.7
            ? "Çox yaxşı — mövzunu başa düşmüsən."
            : "Pis deyil — addımlara bir də bax.";
    $("[data-quiz-verdict-sub]").textContent =
      answered < total
        ? "Nöqtələrdən birinə basıb qayıda bilərsən."
        : "Yaşıl — ilk cəhddə düz, sarı — ikinci cəhddə.";
  }

  function go(k: number): void {
    qi = Math.max(0, Math.min(total, k));
    track.style.transform = `translateX(${-qi * 100}%)`;
    slides.forEach((s, i) => {
      s.inert = i !== qi;
      s.setAttribute("aria-hidden", String(i !== qi));
    });
    fit();
    $("[data-quiz-n]").textContent = String(Math.min(qi + 1, total));
    dots.forEach((b) => {
      const k2 = Number(b.dataset.k);
      b.setAttribute("aria-selected", String(k2 === qi));
      b.className = (k2 === total ? "qz-dot-end " : "") + (res[k2] ?? "");
    });
    prevBtn.disabled = qi === 0;
    nextBtn.disabled = qi === total;
    nextBtn.classList.toggle("btn-primary", qi < total && res[qi] != null);
    nextBtn.textContent = qi === total - 1 ? "Nəticə ›" : "Növbəti ›";
    if (qi === total) paintResult();
  }

  root.addEventListener("click", (e) => {
    const t = e.target as Element;
    const opt = t.closest<HTMLButtonElement>(".qz-opt");
    if (opt) {
      const slide = opt.closest<HTMLElement>(".qz-slide")!;
      const k = Number(slide.dataset.k);
      if (slide.classList.contains("solved")) return;
      const good = Number(opt.dataset.n) === Number(slide.dataset.answer);
      opt.classList.add(good ? "ok" : "bad");
      const fb = $("p.qz-fb", slide);
      if (good) {
        if (res[k] == null) res[k] = "first";
        slide.classList.add("solved");
        const explain = $<HTMLTemplateElement>("template", slide).innerHTML;
        fb.innerHTML = `<b class="ok">Düzdür.</b> ${explain}`;
      } else {
        res[k] = "retry";
        opt.disabled = true;
        fb.innerHTML = '<b class="bad">Yox.</b> Bir də cəhd et.';
      }
      go(k);
      return;
    }
    const dot = t.closest<HTMLElement>(".qz-dots button");
    if (dot) go(Number(dot.dataset.k));
    if (t.closest("[data-quiz-prev]")) go(qi - 1);
    if (t.closest("[data-quiz-next]")) go(qi + 1);
    if (t.closest("[data-quiz-restart]")) {
      res.fill(null);
      slides.forEach((s) => {
        s.classList.remove("solved");
        s.querySelectorAll<HTMLButtonElement>(".qz-opt").forEach((o) => {
          o.className = "qz-opt";
          o.disabled = false;
        });
        const fb = s.querySelector(".qz-fb");
        if (fb) fb.innerHTML = "";
      });
      go(0);
    }
  });
  // inside the quiz the arrows move between questions
  root.addEventListener("keydown", (e) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      go(qi + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      go(qi - 1);
    }
  });
  addEventListener("resize", fit);
  new ResizeObserver(fit).observe(slides[0]!);
  go(0);
  if (document.fonts) void document.fonts.ready.then(fit);
}

document.querySelectorAll<HTMLElement>("[data-quiz]").forEach(initQuiz);

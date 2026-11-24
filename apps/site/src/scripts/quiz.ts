// "Özünü yoxla" quiz slider: one question at a time, prev/next, progress dots, result slide.
// A wrong option is marked and disabled; the right one closes the question and shows the explanation.
// The score counts questions answered right on the first try. Markup: components/Quiz.astro.
type Status = "open" | "first" | "retry";

function initQuiz(root: HTMLElement): void {
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const viewport = $("[data-quiz-viewport]");
  const track = $("[data-quiz-track]");
  const slides = Array.from(track.children) as HTMLElement[];
  const questions = slides.filter((s) => !s.hasAttribute("data-quiz-result"));
  const total = questions.length;
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-quiz-go]"));
  const count = $("[data-quiz-count]");
  const prevBtn = $<HTMLButtonElement>("[data-quiz-prev]");
  const nextBtn = $<HTMLButtonElement>("[data-quiz-next]");

  const status: Status[] = questions.map(() => "open");
  const misses: number[] = questions.map(() => 0);
  let index = 0;

  // The viewport follows the height of the visible slide (feedback text can change it).
  const fit = () => (viewport.style.height = `${slides[index]!.offsetHeight}px`);
  const ro = new ResizeObserver(fit);

  function paint() {
    const onResult = index === total;
    track.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((s, i) => (s.inert = i !== index));
    count.textContent = onResult ? "Nəticə" : `${index + 1} / ${total}`;
    dots.forEach((d, i) => {
      if (i === index) d.setAttribute("aria-current", "step");
      else d.removeAttribute("aria-current");
      d.classList.toggle("is-ok", status[i] === "first");
      d.classList.toggle("is-retry", status[i] === "retry");
    });
    prevBtn.disabled = index === 0;
    nextBtn.hidden = onResult;
    nextBtn.textContent = index === total - 1 ? "Nəticə ›" : "Növbəti ›";
    // Highlight "next" once the current question is answered.
    nextBtn.classList.toggle("btn-primary", !onResult && status[index] !== "open");
    ro.disconnect();
    ro.observe(slides[index]!);
    fit();
    if (onResult) paintResult();
  }

  function paintResult() {
    const score = status.filter((s) => s === "first").length;
    const answered = status.filter((s) => s !== "open").length;
    $("[data-quiz-score]").textContent = String(score);
    $("[data-quiz-ring]").style.setProperty("--p", String(total ? score / total : 0));
    $("[data-quiz-verdict]").textContent =
      answered < total
        ? `${total - answered} sual cavabsız qaldı.`
        : score === total
          ? "Əla! Hamısı ilk cəhddə düzdür."
          : score / total >= 0.6
            ? "Yaxşı nəticə!"
            : "Mövzunu bir daha nəzərdən keçirin.";
  }

  function go(i: number) {
    index = Math.max(0, Math.min(total, i));
    paint();
  }

  questions.forEach((q, qi) => {
    const answer = Number(q.dataset.answer);
    const fb = q.querySelector<HTMLElement>(".quiz-feedback")!;
    const explain = q.querySelector("template")!.innerHTML.trim();
    q.addEventListener("click", (ev) => {
      const b = (ev.target as Element).closest<HTMLButtonElement>(".quiz-option");
      if (!b || b.disabled) return;
      if (Number(b.dataset.i) === answer) {
        b.classList.add("correct");
        q.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((o) => (o.disabled = true));
        fb.className = "quiz-feedback ok";
        fb.innerHTML = "Düzdür!" + (explain ? " " + explain : "");
        status[qi] = misses[qi] ? "retry" : "first";
        paint();
        nextBtn.focus({ preventScroll: true });
      } else {
        misses[qi]!++;
        b.classList.add("wrong");
        b.disabled = true;
        fb.className = "quiz-feedback no";
        fb.textContent = "Yox. Yenidən cəhd edin.";
      }
    });
  });

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

  $("[data-quiz-restart]").addEventListener("click", () => {
    questions.forEach((q, qi) => {
      status[qi] = "open";
      misses[qi] = 0;
      q.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((o) => {
        o.disabled = false;
        o.classList.remove("correct", "wrong");
      });
      const fb = q.querySelector<HTMLElement>(".quiz-feedback")!;
      fb.className = "quiz-feedback";
      fb.textContent = "";
    });
    go(0);
    root.focus({ preventScroll: true });
  });

  // ← → move between questions while focus is inside the quiz (lesson.ts leaves them to us).
  root.addEventListener("keydown", (ev) => {
    if (ev.shiftKey || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    // Keep the arrows from reaching the shell, which uses them to switch lessons.
    ev.stopPropagation();
    ev.preventDefault();
    go(index + (ev.key === "ArrowRight" ? 1 : -1));
  });

  addEventListener("resize", fit);
  paint();
}

document.querySelectorAll<HTMLElement>("[data-quiz]").forEach(initQuiz);

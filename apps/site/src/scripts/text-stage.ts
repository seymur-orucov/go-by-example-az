// Text lessons (concept, compare): the side panel shows the visual of the step being read, or
// of the nearest earlier step that has one. Steps are marked active like in code lessons.
// Without this script the first visual stays shown. Motion: the fade-in is CSS, and the global
// prefers-reduced-motion rule in v2.css turns it off.
const stage = document.querySelector<HTMLElement>(".lx-stage");
if (stage) {
  const steps = [...document.querySelectorAll<HTMLElement>(".lx-step")];
  const items = [...stage.querySelectorAll<HTMLElement>("[data-for]")];
  const owners = items.map((it) => Number(it.dataset.for));
  let shown = owners[0] ?? -1;
  let frame = 0;

  const update = (): void => {
    frame = 0;
    // the active step: the last one whose top has passed 40% of the viewport
    const line = innerHeight * 0.4;
    let active = 0;
    steps.forEach((s, i) => {
      if (s.getBoundingClientRect().top < line) active = i;
    });
    steps.forEach((s, i) => s.classList.toggle("active", i === active));
    const pick = owners.filter((i) => i <= active).pop() ?? owners[0];
    if (pick === undefined || pick === shown) return;
    shown = pick;
    items.forEach((it, k) => (it.hidden = owners[k] !== pick));
  };
  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
}

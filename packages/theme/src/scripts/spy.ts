// Scroll-spy dots on the right edge: one per [data-spy] section on the page.
export function initSpy(): void {
  const sections = [...document.querySelectorAll<HTMLElement>("[data-spy]")];
  if (sections.length < 2) return;

  const nav = document.createElement("nav");
  nav.className = "spy";
  nav.setAttribute("aria-label", "Bölmələr");
  nav.innerHTML = sections
    .map(
      (s) => `<a href="#${s.id}" aria-label="${s.dataset.spy}"><span>${s.dataset.spy}</span></a>`,
    )
    .join("");
  document.body.appendChild(nav);

  const dots = [...nav.querySelectorAll("a")];
  dots[0]?.classList.add("on");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting)
          dots.forEach((d, i) => d.classList.toggle("on", sections[i] === en.target));
      }),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => io.observe(s));
}

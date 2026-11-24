// Dropdown menus: a [data-menu-btn] button toggles the .menu inside the same .dd wrapper.
export function initMenus(): void {
  const menus = () => document.querySelectorAll<HTMLElement>(".menu");
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    const btn = target.closest("[data-menu-btn]");
    const inMenu = target.closest(".menu");
    menus().forEach((m) => {
      const owner = m.closest(".dd") ?? m.parentElement!;
      if (btn && owner.contains(btn) && !inMenu) m.hidden = !m.hidden;
      else if (!inMenu || !owner.contains(target)) m.hidden = true;
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menus().forEach((m) => (m.hidden = true));
  });
}

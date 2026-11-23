let el: HTMLDivElement | undefined;
let timer: number | undefined;

export function toast(message: string): void {
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(timer);
  timer = window.setTimeout(() => el?.classList.remove("show"), 2600);
}

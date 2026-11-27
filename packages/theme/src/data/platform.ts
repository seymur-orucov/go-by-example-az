// Platform data (prototype): technologies, directions and platform sections.
// Later this comes from content/ and content/roadmaps/. Hrefs follow the route plan:
// /<technology>/, /<technology>/roadmap/, /roadmaps/<direction>/.

export type Status = "live" | "started" | "preview" | "next" | "plan" | "soon" | "later";

export interface Tech {
  id: string;
  name: string;
  ic: string;
  c: string;
  status: Status;
  href?: string;
  desc: string;
}

export interface Direction extends Tech {
  techs: string[];
  nodes: number;
}

export interface PlatformSection {
  id: string;
  name: string;
  icon: string;
  status: Status;
  desc: string;
}

export const TECHS: Tech[] = [
  {
    id: "go",
    name: "Go",
    ic: "Go",
    c: "#00add8",
    status: "live",
    href: "/go/",
    desc: "Sadə sintaksis, sürətli kompilyasiya, concurrency.",
  },
  {
    id: "python",
    name: "Python",
    ic: "Py",
    c: "#4b8bd4",
    status: "soon",
    desc: "Avtomatlaşdırma, data, backend.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    ic: "TS",
    c: "#3178c6",
    status: "soon",
    desc: "Tipli JavaScript: frontend və Node.js.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    ic: "JS",
    c: "#e8c32a",
    status: "soon",
    desc: "Brauzerin dili: DOM, async, modullar.",
  },
  {
    id: "sql",
    name: "SQL",
    ic: "SQL",
    c: "#7b8cff",
    status: "soon",
    desc: "Sorğular, join, index, tranzaksiyalar.",
  },
  {
    id: "rust",
    name: "Rust",
    ic: "Rs",
    c: "#e0895a",
    status: "soon",
    desc: "Yaddaş təhlükəsizliyi, yüksək performans.",
  },
  {
    id: "git",
    name: "Git",
    ic: "Git",
    c: "#f05033",
    status: "soon",
    desc: "Versiya nəzarəti, branch, merge, rebase.",
  },
  {
    id: "linux",
    name: "Linux",
    ic: "$_",
    c: "#f2b93b",
    status: "soon",
    desc: "Terminal, fayl sistemi, proseslər.",
  },
  {
    id: "http",
    name: "HTTP və şəbəkə",
    ic: "Net",
    c: "#22c3a6",
    status: "soon",
    desc: "HTTP, DNS, TLS, REST.",
  },
  {
    id: "docker",
    name: "Docker",
    ic: "Dkr",
    c: "#2496ed",
    status: "soon",
    desc: "Image, container, compose.",
  },
  {
    id: "k8s",
    name: "Kubernetes",
    ic: "K8s",
    c: "#5b7fe8",
    status: "soon",
    desc: "Pod, deployment, service.",
  },
  {
    id: "react",
    name: "React",
    ic: "Re",
    c: "#4fd1f0",
    status: "soon",
    desc: "Komponentlər, state, hooks.",
  },
  {
    id: "html",
    name: "HTML və CSS",
    ic: "</>",
    c: "#ef6a3a",
    status: "soon",
    desc: "Semantika, layout, responsive.",
  },
];

export const DIRECTIONS: Direction[] = [
  {
    id: "backend",
    name: "Backend",
    ic: "BE",
    c: "#9b7bff",
    status: "preview",
    href: "/roadmaps/backend/",
    techs: ["git", "linux", "http", "go", "sql", "docker", "k8s"],
    desc: "Server, API, verilənlər bazası və deploy — sorğudan serverə qədər.",
    nodes: 64,
  },
  {
    id: "frontend",
    name: "Frontend",
    ic: "FE",
    c: "#f472b6",
    status: "soon",
    techs: ["html", "javascript", "typescript", "react", "git", "http"],
    desc: "İnterfeys, brauzer, komponentlər və performans.",
    nodes: 58,
  },
  {
    id: "devops",
    name: "DevOps",
    ic: "Ops",
    c: "#22c3a6",
    status: "soon",
    techs: ["linux", "git", "docker", "k8s", "http", "python"],
    desc: "Avtomatlaşdırma, konteynerlər, CI/CD, monitorinq.",
    nodes: 52,
  },
  {
    id: "data",
    name: "Data",
    ic: "DA",
    c: "#f5a524",
    status: "soon",
    techs: ["python", "sql", "git", "linux"],
    desc: "Məlumatın toplanması, təmizlənməsi və analizi.",
    nodes: 40,
  },
];

/** Platform sections in the agreed rollout order (docs/DECISIONS.md). */
export const PLATFORM: PlatformSection[] = [
  {
    id: "roadmaps",
    name: "Yol xəritələri",
    icon: "map",
    status: "live",
    desc: "Texnologiya və istiqamət üzrə: nə, hansı ardıcıllıqla.",
  },
  {
    id: "learn",
    name: "Nəzəriyyə + praktika",
    icon: "book",
    status: "live",
    desc: "Hər mövzuda qısa izah və işlək kod.",
  },
  {
    id: "visual",
    name: "Vizual izah",
    icon: "eye",
    status: "live",
    desc: "Yaddaşda nə baş verdiyini addım-addım gör.",
  },
  {
    id: "tests",
    name: "Testlər",
    icon: "check",
    status: "live",
    desc: "Hər dərsdə 5–10 sual; yekun test sonra.",
  },
  {
    id: "interview",
    name: "Müsahibə",
    icon: "chat",
    status: "plan",
    desc: "Mövzu və səviyyə üzrə suallar, cavabları ilə.",
  },
  {
    id: "sysdesign",
    name: "System design",
    icon: "layers",
    status: "plan",
    desc: "Böyük sistemlərin dizaynı: keş, növbə, miqyas.",
  },
  {
    id: "algo",
    name: "Alqoritmlər",
    icon: "pointer",
    status: "plan",
    desc: "Pattern üzrə: two pointers, sliding window, BFS/DFS.",
  },
  {
    id: "live",
    name: "Live coding",
    icon: "terminal",
    status: "later",
    desc: "Vaxtla tapşırıq və avtomatik yoxlama.",
  },
];

/** CSS class and Azerbaijani label per status. */
export const STATUS: Record<Status, [string, string]> = {
  live: ["live", "aktiv"],
  started: ["live", "başlanıb"],
  preview: ["next", "önizləmə"],
  next: ["next", "növbəti"],
  plan: ["plan", "planlaşdırılır"],
  soon: ["plan", "tezliklə"],
  later: ["later", "sonra"],
};

export const badge = (s: Status): string =>
  `<span class="badge ${STATUS[s][0]}">${STATUS[s][1]}</span>`;

/**
 * What the content says about a technology, computed at build time (apps/site/src/lib/technologies.ts):
 * "ready" when every lesson is ready, "started" when at least one is, "soon" otherwise.
 */
export interface TechState {
  id: string;
  name: string;
  status: "ready" | "started" | "soon";
  ready: number;
  total: number;
  /** Only for started and ready technologies. */
  href?: string;
}

const states = new Map<string, TechState>();

/** The computed state of a technology (lesson counts), once the page's states are applied. */
export const techState = (id: string): TechState | undefined => states.get(id);

/** Overrides the hand-written statuses above with the computed ones: started and ready technologies become active. */
export function applyTechStates(list: TechState[]): void {
  for (const s of list) {
    states.set(s.id, s);
    const t = TECHS.find((x) => x.id === s.id);
    if (!t) continue;
    if (s.status === "soon" || !s.href) {
      t.status = "soon";
      delete t.href;
    } else {
      t.status = s.status === "ready" ? "live" : "started";
      t.href = s.href;
    }
  }
  // Active technologies first (the mega menu shows the first seven); the rest keep their order.
  const rank = (t: Tech): number => (t.status === "live" || t.status === "started" ? 0 : 1);
  TECHS.sort((a, b) => rank(a) - rank(b));
}

// Pages embed the states as JSON (Layout); every script that imports this module sees them.
if (typeof document !== "undefined") {
  try {
    const el = document.getElementById("tech-status");
    if (el?.textContent) applyTechStates(JSON.parse(el.textContent) as TechState[]);
  } catch {
    /* no states on this page: keep the hand-written statuses */
  }
}

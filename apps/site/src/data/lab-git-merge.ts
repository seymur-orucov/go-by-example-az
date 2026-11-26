// Pilot: "Merge" as a visual lesson — the frames of the commit-graph stage player.
// Hashes and outputs are illustrative; a real lesson would record them with `pnpm content:run`.
import type { FrameText, Takeaways } from "./lab-player";

export interface Commit {
  hash: string;
  msg: string;
  parents: string[];
}

export type Tone = "base" | "ours" | "theirs";

export interface GitFrame extends FrameText {
  /** Visible commits: id → [column, lane]. */
  nodes: Record<string, [number, number]>;
  branches: Record<string, string>;
  head: string;
  tones?: Record<string, Tone>;
  /** Highlighted edges, keyed "child>parent". */
  edgeTones?: Record<string, Tone>;
}

export const COMMITS: Record<string, Commit> = {
  A: { hash: "3f9a2c1", msg: "Initial page", parents: [] },
  B: { hash: "8b41e07", msg: "Add header", parents: ["A"] },
  C: { hash: "c27d5a4", msg: "Add footer", parents: ["B"] },
  D: { hash: "4e8f1b9", msg: "Add search box", parents: ["C"] },
  E: { hash: "9a3c6d2", msg: "Add search filters", parents: ["D"] },
  F: { hash: "1d7b0e5", msg: "Fix header typo", parents: ["C"] },
  M: { hash: "6c2e8fa", msg: "Merge branch 'feature'", parents: ["F", "E"] },
};

export const CHAPTERS = ["Fast-forward", "Three-way merge"];

const BASE: Record<string, [number, number]> = { A: [0, 0], B: [1, 0], C: [2, 0] };
const SPLIT: Record<string, [number, number]> = { ...BASE, F: [3, 0], D: [3, 1], E: [4, 1] };

export const FRAMES: GitFrame[] = [
  {
    chapter: 0,
    title: "Başlanğıc: üç commit",
    body: "Layihədə üç commit var: <b>A</b>, <b>B</b>, <b>C</b>. Hər commit layihənin bir anlıq tam surətidir (snapshot) və öz <b>valideynini</b> göstərir — oxlar keçmişə baxır. <code>main</code> isə sadəcə <b>yarlıqdır</b>: ən son commit-i, C-ni göstərir. <code>HEAD</code> «sən buradasan» işarəsidir: hazırda <code>main</code> üzərindəsən.",
    cmd: "git log --oneline",
    out: "c27d5a4 (HEAD -> main) Add footer\n8b41e07 Add header\n3f9a2c1 Initial page",
    nodes: BASE,
    branches: { main: "C" },
    head: "main",
  },
  {
    chapter: 0,
    title: "Yeni branch — ikinci yarlıq",
    body: "<code>git switch -c feature</code> yeni branch yaradır və ona keçir. Diqqət: heç bir fayl kopyalanmır, yeni commit yaranmır. Git sadəcə C-yə ikinci yarlıq yapışdırır və <code>HEAD</code>-i ona köçürür. Ona görə branch yaratmaq bir anda baş verir — layihə nə qədər böyük olsa da.",
    cmd: "git switch -c feature",
    out: "Switched to a new branch 'feature'",
    nodes: BASE,
    branches: { main: "C", feature: "C" },
    head: "feature",
  },
  {
    chapter: 0,
    title: "feature-də işləyirik",
    body: "Yeni commit <b>D</b> yaranır, valideyni C-dir. Commit-i hansı branch-də etmisənsə, yalnız o yarlıq irəli gedir: <code>feature</code> D-yə keçdi, <code>main</code> isə yerində — C-də qaldı.",
    cmd: 'git commit -m "Add search box"',
    out: "[feature 4e8f1b9] Add search box\n 1 file changed, 12 insertions(+)",
    nodes: { ...BASE, D: [3, 1] },
    branches: { main: "C", feature: "D" },
    head: "feature",
  },
  {
    chapter: 0,
    title: "Daha bir commit",
    body: "<b>E</b> D-nin üzərinə gəlir və <code>feature</code> yenə irəliləyir. İndi <code>feature</code> <code>main</code>-dən iki commit qabaqdadır, <code>main</code> isə ayrıldığı yerdən heç tərpənməyib.",
    cmd: 'git commit -m "Add search filters"',
    out: "[feature 9a3c6d2] Add search filters\n 1 file changed, 8 insertions(+)",
    nodes: { ...BASE, D: [3, 1], E: [4, 1] },
    branches: { main: "C", feature: "E" },
    head: "feature",
  },
  {
    chapter: 0,
    title: "main-ə qayıdırıq",
    body: "<code>HEAD</code> yenidən <code>main</code>-ə keçdi və diskdəki fayllar C-nin halına qayıtdı: axtarış qutusu «yox oldu». Narahat olma — D və E itməyib, sadəcə <code>main</code>-in tarixində deyillər.",
    cmd: "git switch main",
    out: "Switched to branch 'main'",
    nodes: { ...BASE, D: [3, 1], E: [4, 1] },
    branches: { main: "C", feature: "E" },
    head: "main",
  },
  {
    chapter: 0,
    title: "Fast-forward: yarlıq irəli sürüşür",
    ask: {
      q: "İndi <code>git merge feature</code> işlədirik. Git nə edəcək?",
      options: [
        "Yeni merge commit yaradacaq",
        "<code>main</code> yarlığını sadəcə E-yə sürüşdürəcək",
        "D və E-nin surətini çıxarıb <code>main</code>-ə əlavə edəcək",
      ],
      answer: 1,
      explain:
        "C, E-nin əcdadıdır: <code>main</code> ayrılandan sonra heç irəli getməyib. Birləşdiriləsi yeni iş yoxdur — yarlığı irəli çəkmək kifayətdir.",
    },
    body: "Git heç bir yeni commit yaratmadı: <code>main</code> yarlığı D-nin üstündən «sürüşüb» E-yə keçdi. Buna <b>fast-forward</b> deyilir. Tarix düz xətt olaraq qaldı — şəkildə iki xəttin birə çevrildiyinə bax.",
    cmd: "git merge feature",
    out: "Updating c27d5a4..9a3c6d2\nFast-forward\n search.html | 20 ++++++++++++++++++++\n 1 file changed, 20 insertions(+)",
    nodes: { ...BASE, D: [3, 0], E: [4, 0] },
    branches: { main: "E", feature: "E" },
    head: "main",
  },
  {
    chapter: 1,
    title: "Yeni ssenari: tarix ayrılıb",
    body: "Eyni başlanğıc, bir fərqlə: sən <code>feature</code> üzərində işləyərkən <code>main</code>-ə də commit gəldi — <b>F</b> (komanda yoldaşın başlıqdakı xətanı düzəltdi). İndi hər iki branch C-dən sonra irəli gedib: tarix <b>ayrılıb</b> (diverged).",
    cmd: "git log --oneline --graph --all",
    out: "* 1d7b0e5 (HEAD -> main) Fix header typo\n| * 9a3c6d2 (feature) Add search filters\n| * 4e8f1b9 Add search box\n|/\n* c27d5a4 Add footer\n* 8b41e07 Add header\n* 3f9a2c1 Initial page",
    nodes: SPLIT,
    branches: { main: "F", feature: "E" },
    head: "main",
  },
  {
    chapter: 1,
    title: "Ortaq əcdadı tapmaq",
    ask: {
      q: "Bu dəfə fast-forward mümkündürmü?",
      options: [
        "Bəli — <code>main</code> yarlığını E-yə sürüşdürmək olar",
        "Xeyr — yarlıq E-yə keçsə, F <code>main</code>-in tarixindən çıxar",
      ],
      answer: 1,
      explain:
        "E-dən geriyə gedən yolda F yoxdur. Yarlığı sürüşdürmək F-i «itirərdi». Git-ə hər iki tarixi birləşdirən yeni commit lazımdır.",
    },
    body: "Birləşdirmədən əvvəl Git iki branch-in sonuncu <b>ortaq</b> commit-ini tapır — buna <b>merge base</b> deyilir. Bizdə bu C-dir: yollar ondan sonra ayrılır. Bunu <code>git merge-base</code> ilə özün də görə bilərsən.",
    cmd: "git merge-base main feature",
    out: "c27d5a4",
    nodes: SPLIT,
    branches: { main: "F", feature: "E" },
    head: "main",
    tones: { C: "base" },
    edgeTones: { "F>C": "ours", "D>C": "theirs", "E>D": "theirs" },
  },
  {
    chapter: 1,
    title: "Üç snapshot",
    body: "Adı buradan gəlir: Git <b>üç</b> snapshot-u müqayisə edir. <b>Baza</b> (C) ilə <b>ours</b> (F, olduğun branch) arasındakı fərq <code>main</code>-də nəyin dəyişdiyini, baza ilə <b>theirs</b> (E, birləşdirdiyin branch) arasındakı fərq isə <code>feature</code>-da nəyin dəyişdiyini göstərir. Dəyişikliklər fərqli yerlərdədirsə, Git onları özü birləşdirir. Eyni sətir hər iki tərəfdə dəyişibsə, bu <b>conflict</b>-dir — onu ayrıca dərsdə görəcəyik.",
    nodes: SPLIT,
    branches: { main: "F", feature: "E" },
    head: "main",
    tones: { C: "base", F: "ours", E: "theirs" },
    edgeTones: { "F>C": "ours", "D>C": "theirs", "E>D": "theirs" },
  },
  {
    chapter: 1,
    title: "Merge commit",
    ask: {
      q: "Merge commit-in neçə valideyni olacaq?",
      options: ["Bir — E", "İki — F və E", "Üç — C, F və E"],
      answer: 1,
      explain:
        "Baza (C) yalnız müqayisə üçündür. Yeni commit hər iki branch-in son commit-ini — F və E-ni — valideyn kimi göstərir.",
    },
    body: "Git yeni <b>M</b> commit-ini yaratdı. Onun <b>iki valideyni</b> var — F və E, şəkildəki iki ox. <code>main</code> M-ə keçdi, <code>feature</code> isə yerində qaldı. Komanda mesaj üçün redaktor açır: hazır mesajı (<code>Merge branch 'feature'</code>) saxlayıb bağlamaq kifayətdir.",
    cmd: "git merge feature",
    out: "Merge made by the 'ort' strategy.\n search.html | 20 ++++++++++++++++++++\n 1 file changed, 20 insertions(+)",
    nodes: { ...SPLIT, M: [5, 0] },
    branches: { main: "M", feature: "E" },
    head: "main",
    edgeTones: { "M>F": "ours", "M>E": "theirs" },
  },
  {
    chapter: 1,
    title: "Nəticə",
    body: "Tarix artıq düz xətt deyil — <code>git log --graph</code> da bunu göstərir. M-dən geriyə iki yol gedir və hər iki branch-in işi <code>main</code>-in tarixindədir. <code>feature</code> yarlığı artıq lazım deyilsə, <code>git branch -d feature</code> onu silir: commit-lər qalır, yalnız yarlıq gedir.",
    cmd: "git log --oneline --graph",
    out: "*   6c2e8fa (HEAD -> main) Merge branch 'feature'\n|\\\n| * 9a3c6d2 (feature) Add search filters\n| * 4e8f1b9 Add search box\n* | 1d7b0e5 Fix header typo\n|/\n* c27d5a4 Add footer\n* 8b41e07 Add header\n* 3f9a2c1 Initial page",
    nodes: { ...SPLIT, M: [5, 0] },
    branches: { main: "M", feature: "E" },
    head: "main",
  },
];

export const TAKEAWAYS: Takeaways = {
  rules: [
    "Branch commit-ə yapışdırılmış **yarlıqdır**: onu yaratmaq heç nəyi kopyalamır.",
    "`HEAD` hazırda hansı branch-də olduğunu göstərir; yeni commit yalnız o branch-i irəli aparır.",
    "**Fast-forward**: birləşdirdiyin branch-in tarixi sənin branch-ini artıq içində saxlayırsa, Git yarlığı irəli sürüşdürür — yeni commit yaranmır.",
    "**Three-way merge**: tarix ayrılıbsa, Git bazanı və iki ucu müqayisə edib iki valideynli merge commit yaradır.",
  ],
  practices: [
    "Merge-dən əvvəl `git log --oneline --graph --all` ilə tarixin şəklinə bax.",
    "Birləşdirdiyin branch lazım deyilsə, `git branch -d` ilə sil — commit-lər itmir.",
  ],
};

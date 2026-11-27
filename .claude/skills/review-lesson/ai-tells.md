# AI tells in Azerbaijani lesson text

Shared by `review-lesson` (to find them) and `polish-lesson` (to fix them). Each entry: what
it looks like, why a reader notices it, and a plain rewrite. `scan.mjs` finds the phrase-level
ones; the structural ones need a reader.

Why it matters: Azerbaijani readers who notice generated text stop reading and switch to a
Russian or English source. One tell is forgivable; three in one lesson make the whole site
look generated. The goal is not "undetectable" text — it is text an experienced instructor
would say at the board, with nothing a reader has to skip.

**Context beats lists.** A phrase on this list is a reason to look, not a verdict. The approved
exemplars (see write-content "Exemplars") use "Deyək ki", "demək olar ki" and one
"yalnız … deyil" — each once, where it does real work. Flag a phrase when it carries no
information, repeats, or sounds like a speech.

When the user flags a new pattern, add it here (with their example) and to `PHRASES` in
`scan.mjs`.

## 1. Frames and openers

| Tell | Example | Rewrite |
|---|---|---|
| Imagine-opener | "Təsəvvür edin ki, böyük bir kitabxanada kitab axtarırsınız…" | Start with the fact: "Map açarı dəyərə bağlayır: `stock["milk"]` südün sayını qaytarır." |
| "Let's" | "Gəlin baxaq, bu necə işləyir." | Delete. Show it: "`len(stock)` `3` qaytarır." |
| Announcing a note | "Qeyd etmək lazımdır ki, map-də sıra yoxdur." | "Map-də sıra yoxdur." |
| Lesson frame | "Bu dərsdə biz … öyrənəcəyik." + "Bu dərsdə … öyrəndik." | The intro says what the concept is and why it is needed; the outro (if any) points to the next lesson. No announcement, no recap. Not a tell: one sentence that introduces the example's data ("Bu dərsdə kiçik mağazanın anbarını izləyirik: açar məhsulun adı…") or places the lesson in the course ("Bu kursda Git-i öyrənəcəyik"). |
| Rhetorical Q&A | "Bəs bu nə deməkdir? Çox sadə: …" | State the answer. A real question is fine when it is the reader's actual question ("Hansı fayl sonuncudur?" in a problem step). |
| Reader flattery / reassurance | "Narahat olmayın, bu, ilk baxışdan çətin görünə bilər." | Delete, or name the real difficulty: "Burada çox vaxt `&`-i unudurlar." |

## 2. Closers and recaps

| Tell | Example | Rewrite |
|---|---|---|
| Summary sentence | "Beləliklə, map açar-dəyər cütlərini saxlamaq üçün əla vasitədir." | Delete. The step already said it; the takeaways card summarises. |
| Pep talk | "İndi siz artıq map-lərlə işləməyi bacarırsınız!" / "Uğurlar!" | Delete. |
| "As a result" chain | "Nəticədə, … Nəticə etibarilə, …" | One causal link, said once: "Ona görə …" |

## 3. Hype, ornament, metaphor

| Tell | Example | Rewrite |
|---|---|---|
| Hype adjective | "Goroutine-lər Go-nun ən güclü və möhtəşəm xüsusiyyətlərindən biridir." | Say what it does and the cost: "Goroutine bir neçə KB yaddaşla başlayır, ona görə minlərlə işə salmaq olar." |
| Grand metaphor | "Channel goroutine-lər arasında körpüdür, məlumatlar onun üzərindən axır." | "Channel bir goroutine-dən digərinə dəyər ötürür." One short comparison per lesson is allowed (write-lesson §3), only if it explains what the code cannot. |
| Running metaphor | Restaurant in every step: "aşpaz", "ofisiant", "sifariş" | Name it in programming terms; keep the context only in the data (`order`, `price`). |
| Personification | "Kompilyator bizi səhvlərdən qoruyur", "Go bizə deyir ki…" | "Kompilyator bu kodu qəbul etmir: `declared and not used`." |
| Journey words | "Go dünyasına səyahət", "sirlərini açaq", "qapılar açır" | Delete. |
| Elegant / perfect | "zərif həll", "mükəmməl seçim", "ideal vasitə" | Say when to choose it and when not. |

## 4. Filler and vague claims

| Tell | Example | Rewrite |
|---|---|---|
| Empty importance | "Bu, çox vacibdir." / "Bu mövzu son dərəcə əhəmiyyətlidir." | Say the consequence: "`Close` çağırılmasa, fayl açıq qalır və proqram limitə çata bilər." |
| Vague scope | "bir çox hallarda", "müxtəlif ssenarilərdə", "real layihələrdə geniş istifadə olunur" | One concrete case: "HTTP handler-lərdə timeout üçün istifadə olunur." Or delete. |
| Softeners | "əslində", "sadəcə olaraq", "bir növ", "müəyyən mənada" | Delete; they add no meaning. "sadəcə" is fine when it means "only". |
| Stacked hedges | "adətən, bir qayda olaraq, əksər hallarda" | One hedge, or a rule with its exception. |
| Easy promise | "asanlıqla", "rahatlıqla" | Delete or show the one line it takes. |

## 5. Calques (English / Russian syntax in Azerbaijani words)

These make text read like a translation, which readers associate with machine output.

| Calque | From | Example | Natural |
|---|---|---|---|
| "hansı ki" | Rus. "который" | "Slice, hansı ki, massivə əsaslanır, …" | "Slice massivin üzərində qurulub." / participle: "massivə əsaslanan slice" |
| "imkan verir" | "allows to" | "Bu funksiya faylı oxumağa imkan verir." | "Bu funksiya faylı oxuyur." |
| "ilə gəlir" | "comes with" | "Go standart kitabxana ilə gəlir." | "Go-nun standart kitabxanası var." |
| "həyata keçirmək" | "implement" | "interfeysi həyata keçirir" | "interface-in metodlarını yazır" / "interface-i ödəyir" (follow GLOSSARY) |
| "təmin edir" (repeated) | "provides" | "`sync.Mutex` təhlükəsizliyi təmin edir." | Say how: "`Lock` eyni anda bir goroutine-i buraxır." |
| "istifadə edərək" chains | "using X, …" | "`make` istifadə edərək slice yaradaraq…" | "`make` ilə slice yaradırıq." |
| "tərəfindən" passive | "by" | "Go tərəfindən təmin edilən paket" | "Go-nun öz paketi" / active voice |
| "öz növbəsində" | Rus. "в свою очередь" | "Funksiya isə öz növbəsində…" | Delete. |
| "bu o deməkdir ki" (repeated) | "this means that" | | Once per lesson at most; usually ":" is enough. |
| "Problem odur ki" | "the problem is that" | "Problem odur ki, `{{end}}`-dən sonrakı sətir keçidi də çap olunur." | State it: "`{{end}}`-dən sonrakı sətir keçidi də çap olunur." |
| "oyuna daxil olur", "günün sonunda" | English idioms | | Delete; say the fact. |

## 6. Structure

| Tell | What it looks like | Fix |
|---|---|---|
| Antithesis | "Bu sadəcə funksiya deyil — bu, yeni yanaşmadır." | State what it is. Keep "X deyil, Y" only when X is a real misconception the reader holds. |
| Rule of three | "sürətli, etibarlı və miqyaslana bilən" | One specific, checkable claim. |
| Colon reveal everywhere | Every sentence: "Nəticə: …", "Səbəb: …", "Fərq: …" | One colon per paragraph at most. |
| Dash chains | Several " — " asides in one paragraph | Split into sentences. |
| Bold-label bullets for prose | Every idea as "- **Sürət:** …" | Lists only for real lists (≥3 parallel items). Prose for explanations. |
| Uniform rhythm | Every sentence 13–16 words, every paragraph 3 sentences | Vary: a 5-word sentence after a long one is how people talk. |
| Long participle chains | "…-an …-dığı …-ən dəyəri qaytaran funksiya" | Two sentences, finite verbs. |
| Intro repeats steps | Intro lists every step's content | Intro = what and why; steps = how. |
| Over-addressing / switching person | "siz" and "biz" mixed in one step | One person per lesson (Go lessons: "biz" in steps; Git: "siz" for the reader's actions is fine). |

## 7. What a real instructor does (positive signals)

Use these as the target when rewriting, not as decoration.

- **Points at the code and output.** "İkinci sətir `0` çap edir, çünki `butter` map-də yoxdur."
- **Names the actual mistake** a beginner makes and the error they will see: "`:=` funksiyadan
  kənarda işləmir: `syntax error: non-declaration statement outside function body`."
- **Says when not to use it.** "Kiçik, sabit sayda element üçün slice kifayətdir; map lazım deyil."
- **Gives a reason with every rule.** "Map-i `make` ilə yaradın: `nil` map-ə yazmaq panic verir."
- **Short sentences, one idea each, concrete nouns.** Numbers, names and messages from the
  example instead of "məlumat", "proses", "element" in the abstract.
- **Explains a new term once, in passing**, then just uses it ("kompilyasiya zamanı, yəni
  proqram işə düşməzdən əvvəl").
- **Has an opinion** where the field has one ("Praktikada `errors.Is` istifadə olunur,
  `==` yox"), without hype.
- **Stops when done.** No recap, no outro unless it links to the next lesson.

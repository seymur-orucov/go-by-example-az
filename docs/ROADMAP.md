# Yol xəritəsi

Son yenilənmə: 2026-11-23

İşarələr: `[x]` görülüb · `[~]` gedir · `[ ]` qarşıdadır

---

## Vizyon: öyrənmə platforması

**Nümunələrlə Go ilk prototipdir.** Ondan sonra layihə roadmap.sh və itbooster.ru tipində **vahid platformaya** çevrilir:

| Prinsip | Mənası |
|---|---|
| **Roadmap ilə öyrənmə** | Developer nəyi, hansı ardıcıllıqla öyrənəcəyini yol xəritəsində görür; harada olduğunu və növbəti addımı bilir. Roadmap-lar iki növdür: **texnologiya** ("Go") və **istiqamət** ("Backend") |
| **Hesablar** | Platforma mərhələsində qeydiyyat və irəliləyişin serverdə saxlanması (Go prototipində yox) |
| **Nəzəriyyə + praktika bir yerdə** | Yol xəritəsinin hər node-u həm nəzəri izaha (konsept), həm də praktikaya (işlək nümunə, tapşırıq, sual) aparır |
| **Bütün texnologiyalar bir saytda** | Go, Python, Rust, TypeScript, SQL və s. eyni platformada, eyni dizayn və eyni dərs formatı ilə. Ayrı saytlar **yoxdur** |
| **Azərbaycan dilində** | Kontent Azərbaycan dilində, terminlər ingiliscə |

Prototipdə bu vizyona hazırlıq artıq var: header-də texnologiya seçicisi, "Yol xəritəsi" görünüşü, statuslar (öyrənilib / növbəti / qarşıda), irəliləyiş, "Bir platforma, bir neçə dil" bölməsi.

Mərhələlər bu vizyona görə qurulub: 1–5 Go prototipini canlı sayta çıxarır, 6–7 onu platformaya çevirir.

---

## Mərhələ 0 — Konsept və qərarlar ✅

- [x] Məqsəd: gobyexample.com-un Azərbaycan dilində, müasir dizaynlı, sadələşdirilmiş alternativi
- [x] Lisenziya araşdırıldı: CC BY 3.0, mənbəyə istinad şərti ilə tərcümə və uyğunlaşdırma icazəlidir
- [x] Arxitektura təklifi qəbul edildi: Astro + Shiki + Pagefind, statik sayt, hub-a hazır monorepo
- [x] Hosting: Cloudflare Pages (domen yoxdur, `*.pages.dev`)
- [x] Terminlər ingiliscə qalır (`slice`, `goroutine`), ilk işlənəndə qısa izah verilir
- [x] Kod saytın içində işləyəcək (`go.dev/_/compile` proxy), alınmasa Playground linki

Təfərrüat: [DECISIONS.md](DECISIONS.md).

---

## Mərhələ 1 — Dizayn prototipi `[~]` (hazırkı mərhələ)

Framework-süz statik HTML/CSS/JS, `design/` qovluğunda.

### Görülənlər
- [x] Dizayn tokenləri (açıq və tünd tema), Inter + JetBrains Mono (`ə ı ş ç ğ ö ü` dəstəyi)
- [x] **Variant A** "Clean" — Stripe/Linear üslubu, Go mavisi
- [x] İzah ↔ kod **iki istiqamətli** işıqlanma (hover)
- [x] **Variant B** "Scope" — frontscope.dev əsasında: addım pleyeri, yaddaş vizualı
- [x] **Variant C** "Roadmap" — roadmap.sh + itbooster.ru: yol xəritəsi, bento, 4 palitra, hub seçicisi
- [x] **Variant D** — A, B və C-nin bəyənilən hissələrinin birləşməsi (istifadəçi seçdi)
- [x] D: hərəkətli qradiyent fon (palitranın iki rəngi yavaş üzür)
- [x] D: scroll animasiyaları — başlıq sözləri maskadan qalxır, kod etiketi yazılır, rəqəmlər sayılır, kartlar növbə ilə gəlir, hero solur, demo pleyer 3D-dən düzəlir
- [x] D: "Bütün mövzular / Bölmə üzrə / Yol xəritəsi" tab keçidlərində animasiya
- [x] D: "Niyə bu sayt?" bento kartlarında daxili mini-animasiyalar və kursoru izləyən işıq
- [x] D dərs səhifəsi: sidebar gizlətmə (`[`), kontent eni mərkəzdə / tam en (`F`), Zen rejimi (`Z`, `Esc`)
- [x] Layihə üçün git repo və sənədlər (bu fayl)

### Qalanlar (Mərhələ 2-yə keçməzdən əvvəl)
- [ ] Variant D-nin **yekun təsdiqi** — istifadəçinin son rəyi
- [ ] Palitranın yekun seçimi (hazırda 4 seçim: Nebula, İndiqo, Okean, Qrafit; standart Nebula)
- [ ] Mobil görünüşün D üçün ayrıca nəzərdən keçirilməsi (ana səhifə animasiyaları + dərs səhifəsi)
- [ ] Açıq temanın D üçün yekun yoxlanışı
- [ ] İstəyə bağlı: izah ilə kod arasında **ox/əyri xətt** ilə əlaqə (istifadəçinin ideyası, hələ edilməyib)
- [ ] Təsdiqdən sonra A, B, C variantlarını arxivə çıxarmaq (məsələn `design/archive/`) və ya silmək

---

## Mərhələ 2 — Layihə skeleti `[ ]`

Monorepo (npm workspaces). İlk buraxılış yalnız Go kontenti ilə çıxır, amma struktur **əvvəldən vahid platforma** üçün qurulur (Mərhələ 6–7): marşrutlar `/<texnologiya>/...`, kontent `content/<texnologiya>/`, ortaq tema və komponentlər.

```
packages/theme/        # tokens.css + Astro komponentləri (Layout, Sidebar, CodeStep, Player, SearchPalette, RunButton)
apps/site/             # vahid Astro sayt; ilk buraxılışda yalnız /go/...; kontent ../../content/*-dan oxunur
content/go/
  sections.yaml        # bölmələr və sıralama
  examples/<slug>/
    meta.yaml          # title, section, order, status, səviyyə, müddət
    main.go            # işlək, sadələşdirilmiş kod; seqment sərhədləri şərhlərlə
    az.md              # seqment başına kompakt izah
    output.txt         # CI tərəfindən generasiya olunur
functions/api/run.ts   # go.dev/_/compile proxy (rate-limit + ölçü limiti)
.github/workflows/ci.yml
```

- [ ] npm workspaces, Astro, Content Collections + Zod sxemi
- [ ] Variant D-nin tokenlərini və komponentlərini `packages/theme`-ə köçürmək
- [ ] Shiki ilə build vaxtı kod rənglənməsi (prototipdəki sadə rəngləyicinin yerinə)
- [ ] Pagefind ilə statik axtarış (`Ctrl+K` palitrası)
- [ ] CodeMirror 6 — yalnız "Redaktə" kliklənəndə lazy-load
- [ ] `/api/run` — Cloudflare Pages Function, `go.dev/_/compile`-a proxy (CORS yoxdur, ona görə proxy lazımdır)
- [ ] İrəliləyiş `localStorage`-də (try/catch ilə)
- [ ] Görünüş rejimləri (sidebar, en, zen) və animasiyalar komponentlərə köçürülür; `prefers-reduced-motion` qorunur

## Mərhələ 3 — Pilot kontent `[ ]`

10 nümunə, hər biri orijinaldan sadə, Azərbaycan dilində kompakt izahla:

- [ ] hello-world · values · variables · constants · for · if-else · slices · maps · functions · goroutines
- [ ] Terminologiya lüğəti (`docs/GLOSSARY.md`): ingiliscə termin + qısa Azərbaycan izahı
- [ ] Vizual tələb edən mövzular üçün addım vizualları (slice, map, kanal, goroutine)

## Mərhələ 4 — CI/CD `[ ]`

- [x] GitHub repo (public): https://github.com/seymur-orucov/go-by-example-az
- [ ] GitHub Actions: `setup-go` → hər `main.go` üçün `go vet` + `go run` → `output.txt` müqayisəsi; `npm ci && npm run build`; link yoxlaması
- [ ] Cloudflare Pages: GitHub inteqrasiyası (main → production, PR → preview URL). Hesab istifadəçi tərəfindən qoşulur

## Mərhələ 5 — Qalan ~74 nümunə `[ ]`

- [ ] Bölmə-bölmə əlavə (cəmi 84 nümunə, 9 bölmə — siyahı `design/data.js`-dədir)

## Mərhələ 6 — Platformaya keçid: roadmap + nəzəriyyə + praktika `[ ]`

Go prototipi canlı olduqdan sonra sayt vahid platformaya çevrilir.

- [ ] Kontent modelinə **nəzəriyyə** növü əlavə etmək: konsept məqaləsi (qısa izah, diaqram, əlaqəli nümunələr). Hazırkı nümunələr **praktika** növü olur
- [ ] **Roadmap modeli**: node-lar (mövzular), ardıcıllıq, asılılıqlar, səviyyələr; hər node nəzəriyyəyə və praktikaya bağlanır. Roadmap-lar fayl kimi saxlanılır, məsələn `content/roadmaps/<id>.yaml`
- [ ] Roadmap-ların məzmunu **roadmap.sh və itbooster.ru resurslarının birləşməsi** əsasında təkmilləşdirilir. Hər roadmap üçün:
  1. hər iki saytda uyğun roadmap/kursun mövzu siyahısı və ardıcıllığı toplanır;
  2. müqayisə edilir: ortaq mövzular, yalnız birində olanlar, fərqli ardıcıllıqlar;
  3. birləşmiş siyahı qurulur, boşluqlar doldurulur, Go prototipindəki nümunələrə bağlanır;
  4. mətnlər: istifadəçi qeyd etdiyi mövzularda həmin resurslardan götürülür və Azərbaycan dilinə tərcümə olunur; qalanlarında özümüz yazırıq
  5. tərcümə edilmiş mətn public repo-ya və sayta yalnız müəllifin yazılı razılığından sonra düşür; o vaxta qədər `content-private/`-də (git-ə düşmür) saxlanılır — [DECISIONS.md](DECISIONS.md#vizyon-2026-11-23)
- [ ] roadmap.sh və itbooster.ru müəlliflərinə tərcümə və dərc üçün müraciət
- [ ] İki növ roadmap:
  - **texnologiya** roadmap-ı — məsələn "Go": dilin özü, sadədən mürəkkəbə;
  - **istiqamət** roadmap-ı — məsələn "Backend": bir neçə texnologiyanın node-larını birləşdirir (Go, SQL, HTTP, Docker…), node-lar texnologiya kontentinə istinad edir, kontent təkrarlanmır
- [ ] **İstifadəçi hesabları**: qeydiyyat / giriş, irəliləyişin serverdə saxlanması və cihazlar arasında sinxronu, roadmap üzrə şəxsi yol. Bunun üçün backend + verilənlər bazası lazımdır; kontent səhifələri statik qalır. Texnologiya seçimi açıq məsələdir ([DECISIONS.md](DECISIONS.md#açıq-məsələlər-qərar-gözləyir))
- [ ] Hesabsız istifadə də mümkün qalır (irəliləyiş `localStorage`-də)
- [ ] Roadmap səhifəsi: interaktiv xəritə (roadmap.sh üslubu), node kliklənəndə panel: nəzəriyyə, praktika, status
- [ ] Praktika genişlənir: tapşırıqlar (kodu tamamla / düzəlt), testlə yoxlama, "Özünü yoxla" sualları
- [ ] Platforma strukturu (itbooster üslubu): ana səhifə → texnologiyalar və roadmap-lar → roadmap → node → dərs
- [ ] Texnologiya seçicisi işlək olur; marşrutlar `/<texnologiya>/...` formasında (məsələn `/go/slices`), Go linkləri qırılmır
- [ ] Ortaq axtarış bütün texnologiyalar üzrə

## Mərhələ 7 — Yeni texnologiyalar `[ ]`

- [ ] Hər texnologiya eyni formatla əlavə olunur: roadmap + nəzəriyyə + praktika
- [ ] Namizədlər: Python, TypeScript, Rust, SQL (sıra sonra müəyyən olunur)
- [ ] Kod işlətmə hər dil üçün ayrıca həll tələb edir (Go-da `go.dev` proxy; digərlərində WASM və ya xarici API) — dil əlavə edərkən araşdırılır

## Gələcək (indi lazım deyil)

- [ ] Digər istiqamətlər: Frontend, DevOps və s.
- [ ] Başqa dillərə tərcümə (EN, RU, TR) — kod və izah ayrı saxlandığı üçün asandır

---

## Növbəti sessiyada haradan başlamaq

1. `node design/serve.mjs` → http://localhost:4321/d/ açıb Variant D-yə bax.
2. "Mərhələ 1 → Qalanlar" siyahısından davam et, ya da istifadəçinin yeni rəyini tətbiq et.
3. D təsdiqlənəndən sonra Mərhələ 2-yə keç: əvvəlcə plan rejimində skeleti razılaşdır.

Qeyd: lokal kompüterdə **Go quraşdırılmayıb** (Node 22 var). Mərhələ 3-dən əvvəl Go-nu quraşdırmaq tövsiyə olunur ki, nümunələr lokal yoxlanıla bilsin.

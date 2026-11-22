# Qərarlar

Razılaşdırılmış qərarlar və səbəbləri. Qərar dəyişsə, köhnəsini silmə: üstündən xətt çək (`~~...~~`) və yenisini tarixlə yaz.

## Vizyon (2026-11-23)

| Qərar | Səbəb |
|---|---|
| "Nümunələrlə Go" **ilk prototipdir**; yekun hədəf roadmap.sh və itbooster.ru tipində **öyrənmə platformasıdır** | İstifadəçinin əsas məqsədi |
| Developer **roadmap ilə** öyrənir; hər addımda həm **nəzəriyyə**, həm **praktika** bu resursdan verilir | Developer düzgün ardıcıllıqla, bir mənbədən öyrənsin |
| **Bütün texnologiyalar bir saytda**; ayrı saytlar yoxdur | İstifadəçinin qərarı; ortaq dizayn, axtarış, irəliləyiş |
| ~~roadmap.sh və itbooster.ru yalnız **struktur və UX referansıdır**; onların kontenti və roadmap-ları kopyalanmır, öz roadmap-larımız yazılır~~ | ~~Hüquqi təhlükəsizlik~~ |
| Konkret roadmap-lar (Go, Backend və s.) **[roadmap.sh](https://roadmap.sh) və [itbooster.ru](https://itbooster.ru/) resurslarının birləşməsi əsasında** təkmilləşdirilir: hər ikisinin mövzu siyahısı və ardıcıllığı müqayisə edilir, birləşdirilir, boşluqlar doldurulur (2026-11-23) | İstifadəçinin qərarı: iki resursun güclü tərəfləri bir roadmap-da |
| ~~Bu resurslardan **mövzular, onların ardıcıllığı və asılılıqları** götürülür; **mətnlər, izahlar və diaqramlar özümüz tərəfindən** yazılır, birbaşa kopyalanmır~~ | ~~Hər iki saytın kontenti açıq lisenziyalı deyil~~ |
| Bu resurslardan **mövzular, ardıcıllıq və asılılıqlar** götürülür. **Mətnlər** isə istifadəçi konkret mövzu üçün **qeyd etdiyi anda** həmin resurslardan götürülür və Azərbaycan dilinə **tərcümə olunur**. İstifadəçi qeyd etməyibsə, mətn özümüz tərəfindən yazılır (2026-11-23) | İstifadəçinin qərarı |
| **Şərt:** roadmap.sh və ya itbooster.ru-dan tərcümə edilmiş mətn **public repo-ya commit olunmazdan və saytda dərc olunmazdan əvvəl** müəllifdən yazılı razılıq alınmalıdır. Razılıq alınana qədər tərcümələr yalnız lokal / private saxlanılır (`.gitignore`-dakı `content-private/` qovluğu). Razılıq alındıqda onun qeydi bu fayla yazılır və mənbəyə istinad saytda göstərilir | roadmap.sh-ın lisenziyası (repo-dakı `license` faylı, yoxlanıldı 2026-11-23): mətn və şəkillər yalnız şəxsi istifadə üçündür; başqa formada, o cümlədən mətn şəklində dərc etmək üçün müəllifin qabaqcadan razılığı lazımdır. itbooster.ru-da açıq lisenziya göstərilməyib — default olaraq bütün hüquqlar qorunur sayılır |
| İki növ roadmap: **texnologiya** üzrə (məsələn "Go") və **istiqamət** üzrə (məsələn "Backend"). İstiqamət roadmap-ı bir neçə texnologiyanın node-larını birləşdirə bilər | İstifadəçi: "Go texnologiyadır, backend isə istiqamətdir" — hər ikisi lazımdır |
| **İstifadəçi hesabları** ilk prototipdən sonra (platforma mərhələsində) lazım olacaq | İrəliləyiş cihazlar arasında saxlanılsın, roadmap üzrə şəxsi yol izlənsin |

## Məhsul və kontent

| Qərar | Səbəb |
|---|---|
| Sayt adı: **Nümunələrlə Go** | Orijinal adın təbii tərcüməsi |
| Kontent gobyexample.com əsasında, amma **sadələşdirilmiş** nümunələrlə | İstifadəçinin istəyi: daha sadə, daha aydın |
| Orijinalın **kompakt izah üslubu** saxlanılır: hər addımda 2–3 cümlə | Go by Example-ın güclü tərəfi |
| **Terminlər ingiliscə** qalır (`slice`, `goroutine`, `channel`), ilk işlənəndə qısa izah | Rəsmi sənədlər və axtarışla uyğunluq; tərcümə edilmiş terminlər çaşdırır |
| Lisenziya **CC BY 3.0**; footer-də Mark McGranaghan və Eli Bendersky-yə istinad, "əsasında hazırlanıb, uyğunlaşdırılıb və sadələşdirilib" qeydi | Lisenziya şərti |
| Dərs quruluşu: izah → işə sal → "Yadda saxla" → "Özünü yoxla" sualı → "Öyrəndim" → növbəti | Öyrənmə dövrü |
| 84 nümunə, 9 bölmə (siyahı: `design/data.js`) | Orijinalın strukturu, qruplaşdırılıb |

## Texniki arxitektura

| Qərar | Səbəb |
|---|---|
| ~~**Statik sayt**, backend və DB yoxdur~~ | ~~Pulsuz hosting, sadəlik; DB yalnız hesablar/şərhlər lazım olsa~~ |
| Go prototipi (Mərhələ 1–5) **statik sayt**, backend və DB yoxdur; platforma mərhələsində (6+) hesablar üçün **backend + verilənlər bazası** əlavə olunur. Kontent səhifələri yenə statik qalır (2026-11-23) | Hesablar ilk prototipdən sonra lazım olacaq; kontentin statik qalması sürət və pulsuz hosting verir |
| **Astro** + Content Collections + Zod | Sıfır JS ilə sürətli HTML, Markdown/MDX, çoxsaylı kolleksiyalar |
| **Shiki** (build vaxtı kod rənglənməsi) | VS Code keyfiyyəti, brauzerdə JS lazım deyil |
| **Pagefind** (statik axtarış) | Serversiz, `Ctrl+K` palitrası ilə |
| **CodeMirror 6**, yalnız "Redaktə" kliklənəndə lazy-load | İlkin yükləməni yüngül saxlamaq |
| Kod işlətmə: Cloudflare Pages Function → `go.dev/_/compile` proxy; alınmasa Playground linki | `go.dev` CORS başlığı vermir; pulsuz limit (100k sorğu/gün) kifayətdir |
| ~~**Monorepo**: `packages/theme`, `apps/go`, `content/go`; sonra `apps/hub`~~ | ~~Ayrı sayt da, hub da eyni kontentdən qurula bilir~~ |
| ~~İlk buraxılış **tək sayt**, hub sonra~~ | ~~YAGNI — hub-a hazır struktur kifayətdir~~ |
| **Monorepo** (npm workspaces): `packages/theme`, **vahid** `apps/site`, `content/<texnologiya>/`, `content/roadmaps/` (2026-11-23) | Ayrı saytlar olmayacaq; bütün texnologiyalar bir saytda |
| İlk buraxılış yalnız Go kontenti ilə, amma marşrutlar əvvəldən `/<texnologiya>/...` (məsələn `/go/slices`) (2026-11-23) | Sonra yeni texnologiya əlavə ediləndə linklər qırılmasın |
| Kontent iki növdür: **nəzəriyyə** (konsept) və **praktika** (nümunə, tapşırıq); roadmap node-u hər ikisinə bağlanır (2026-11-23) | Vizyon: nəzəriyyə + praktika bir yerdə |
| Kontent: hər nümunə qovluq — `meta.yaml`, `main.go`, `az.md`, `output.txt` | Kod CI-də yoxlanır, çıxış avtomatik generasiya olunur, başqa dillərə keçid asandır |
| İrəliləyiş `localStorage`-də | Hesab tələb etmir |
| **Hosting: Cloudflare Pages**, domen yoxdur → `*.pages.dev` | Pulsuz, hər PR üçün preview URL |
| CI: GitHub Actions — `go vet`, `go run`, çıxış müqayisəsi, build, link yoxlaması | Nümunələr heç vaxt sınmasın |
| Repo **public**: https://github.com/seymur-orucov/go-by-example-az (2026-11-23) | Kontent CC BY lisenziyalıdır; açıq mənbə, düzəliş təklifləri üçün |

## Dizayn

| Qərar | Səbəb |
|---|---|
| Seçilmiş variant: **D** (A + B + C birləşməsi) | İstifadəçi hər variantdan bəyəndiyini seçdi ([HISTORY.md](HISTORY.md), 7–8) |
| Rənglər: neytral qara/boz + **göy → bənövşəyi** qradiyent; 4 palitra (Nebula standart, İndiqo, Okean, Qrafit) | İstifadəçi: "müasir göy, purple, boz, qara"; frontscope-un sarısı bəyənilmədi |
| **Tünd tema birinci planda**, sistem seçiminə uyğun açılır; açıq tema tam dəstəklənir | |
| Şriftlər: **Inter** (mətn) + **JetBrains Mono** (kod); kodda liqaturalar söndürülüb | `ə ı ş ç ğ ö ü` dəstəyi; başlanğıc səviyyə `<=` işarəsini `≤` kimi görməsin |
| B-dəki Unbounded/Syne başlıq şriftləri istifadə olunmur | frontscope-un şriftləri bəyənilmədi; Syne-də `ə` yoxdur |
| Dərsdə **kod tam hündürlükdə**, addımlara görə qısaldılmır; çıxış kodun altında | A-dan bəyənildi |
| İzah ↔ kod **iki istiqamətli** işıqlanma | Go by Example-da olmayan, istifadəçinin ən çox bəyəndiyi xüsusiyyət |
| Yaddaş vizualı hər addımın içində; addım idarəsi (‹ 01/05 › ▶) kod pəncərəsinin başlığında | D-də birləşdirildi |
| Sidebar: bütün bölmələr, açılıb-bağlanan qruplar, irəliləyiş zolağı | A-dan bəyənildi |
| Dərs səhifəsində görünüş rejimləri: sidebar gizlətmə, mərkəzdə/tam en, Zen (həmişə mərkəzdə) | İstifadəçinin istəyi |
| Ana səhifə fonu: palitranın iki rəngində **yavaş hərəkət edən qradiyent** (dalğa deyil) | İstifadəçi dalğanı rədd etdi, referans şəkil verdi |
| Scroll, tab keçidi və bento animasiyaları frontscope ruhunda; hamısı `prefers-reduced-motion`-da söndürülür | İstifadəçinin istəyi + əlçatanlıq |
| Header-də texnologiya seçicisi (`Go ▾` → Python, Rust… "tezliklə") və "Bir platforma, bir neçə dil" bölməsi | Hub-a hazırlıq |
| Dar ekran: < 1200px addımların altında kod parçası; < 980px sidebar drawer olur | Mobil UX |

## Açıq məsələlər (qərar gözləyir)

- Palitranın yekun seçimi: 4 seçim qalsın, yoxsa bir standart?
- İzah ↔ kod arasında ox/əyri xətt lazımdırmı?
- A, B, C variantları təsdiqdən sonra silinsin, yoxsa arxivdə qalsın?
- Go-dan sonra hansı texnologiya gəlir?
- roadmap.sh (Kamran Ahmed) və itbooster.ru müəlliflərindən mətnlərin tərcüməsi və dərci üçün razılıq — kim, nə vaxt müraciət edəcək? Razılıqların qeydi: _hələ yoxdur_.
- Hesablar üçün backend necə qurulacaq: öz API-miz (məsələn Go + PostgreSQL — həm də layihənin öz mövzusu ilə uyğun gəlir) və ya hazır xidmət (Supabase və s.)? Giriş üsulu: GitHub / Google OAuth, e-poçt? Hosting pulsuz qalmalıdırmı? — Mərhələ 6-dan əvvəl qərar verilməlidir.
- Hesabı olmayan istifadəçi: irəliləyiş `localStorage`-də qalır və hesab açanda serverə köçürülür?

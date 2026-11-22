# Qərarlar

Razılaşdırılmış qərarlar və səbəbləri. Qərar dəyişsə, köhnəsini silmə: üstündən xətt çək (`~~...~~`) və yenisini tarixlə yaz.

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
| **Statik sayt**, backend və DB yoxdur | Pulsuz hosting, sadəlik; DB yalnız hesablar/şərhlər lazım olsa |
| **Astro** + Content Collections + Zod | Sıfır JS ilə sürətli HTML, Markdown/MDX, çoxsaylı kolleksiyalar |
| **Shiki** (build vaxtı kod rənglənməsi) | VS Code keyfiyyəti, brauzerdə JS lazım deyil |
| **Pagefind** (statik axtarış) | Serversiz, `Ctrl+K` palitrası ilə |
| **CodeMirror 6**, yalnız "Redaktə" kliklənəndə lazy-load | İlkin yükləməni yüngül saxlamaq |
| Kod işlətmə: Cloudflare Pages Function → `go.dev/_/compile` proxy; alınmasa Playground linki | `go.dev` CORS başlığı vermir; pulsuz limit (100k sorğu/gün) kifayətdir |
| **Monorepo** (npm workspaces): `packages/theme`, `apps/go`, `content/go`; sonra `apps/hub` | Ayrı sayt da, hub da eyni kontentdən qurula bilir |
| İlk buraxılış **tək sayt**, hub sonra | YAGNI — hub-a hazır struktur kifayətdir |
| Kontent: hər nümunə qovluq — `meta.yaml`, `main.go`, `az.md`, `output.txt` | Kod CI-də yoxlanır, çıxış avtomatik generasiya olunur, başqa dillərə keçid asandır |
| İrəliləyiş `localStorage`-də | Hesab tələb etmir |
| **Hosting: Cloudflare Pages**, domen yoxdur → `*.pages.dev` | Pulsuz, hər PR üçün preview URL |
| CI: GitHub Actions — `go vet`, `go run`, çıxış müqayisəsi, build, link yoxlaması | Nümunələr heç vaxt sınmasın |

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
- GitHub repo: public, yoxsa private? (CC BY kontenti üçün public məntiqlidir)

# Referanslar

## Mənbə kontent

| Link | Qeyd |
|---|---|
| https://gobyexample.com | Əsas mənbə. Müəlliflər: Mark McGranaghan, Eli Bendersky |
| https://github.com/mmcgrana/gobyexample | Orijinal repo (nümunələrin kodu və izahları) |
| https://creativecommons.org/licenses/by/3.0/ | Kontent lisenziyası (CC BY 3.0) |
| https://go.dev/doc/ | Rəsmi Go sənədləri — terminlər və yoxlama üçün |
| https://go.dev/play/ | Go Playground — kodu işlətmək üçün fallback |

## Roadmap mənbələri

Platformanın konkret roadmap-ları (Go, Backend və s.) bu iki resursun **birləşməsi** əsasında təkmilləşdiriləcək. Onlardan mövzular, ardıcıllıq və asılılıqlar götürülür; mətnlər və diaqramlar özümüz tərəfindən yazılır ([DECISIONS.md](DECISIONS.md#vizyon-2026-11-23)).

| Resurs | Nə üçün |
|---|---|
| https://roadmap.sh | Texnologiya və istiqamət roadmap-ları (məsələn Go, Backend): mövzu siyahısı, ardıcıllıq, tövsiyə olunan / alternativ yollar |
| https://itbooster.ru/ | Kurs və mövzu strukturu, nəzəriyyə ilə praktikanın birləşdirilməsi |

## Dizayn referansları

İstifadəçinin göndərdiyi saytlar. Dizayn onlara **tam oxşamamalıdır**, hər birindən bəyənilən hissə götürülür.

| Sayt | Nə bəyənildi / nə götürüldü | Nə bəyənilmədi |
|---|---|---|
| https://frontscope.dev/ | Vizualizasiyalar: addım pleyeri, yaddaş vizualı; scroll animasiyaları; "Oxuma — gör." üslubu | Şriftlər (Syne), sarı/limon rəng; B variantı ona çox oxşadı |
| https://roadmap.sh/ | Sadə və kompakt; sıx kafel şəbəkəsi; yol xəritəsi görünüşü (mərkəzi xətt + budaqlar); statuslar (öyrənilib / növbəti / qarşıda) | — |
| https://itbooster.ru/ | Maraqlı struktur; kod üslubunda bölmə etiketləri (`features.Why()`); bento kartlar; scroll-spy nöqtələri | — |
| Stripe / Linear (ümumi üslub) | Variant A-nın təmiz, redaksiyalı görünüşü | — |
| İstifadəçinin göndərdiyi "FOCUS" şəkli | Hərəkətli fon üçün: tünd göy → bənövşəyi yumşaq qradiyent, yavaş hərəkət | — |

## Texnologiyalar (Mərhələ 2+)

| Alət | Link | Nə üçün |
|---|---|---|
| Astro | https://astro.build | Statik sayt framework-ü, Content Collections |
| Shiki | https://shiki.style | Build vaxtı kod rənglənməsi |
| Pagefind | https://pagefind.app | Statik axtarış indeksi |
| CodeMirror 6 | https://codemirror.net | Brauzerdə kod redaktoru (lazy-load) |
| Cloudflare Pages | https://pages.cloudflare.com | Hosting, PR preview, Pages Functions (`/api/run`) |
| GitHub Actions + setup-go | https://github.com/actions/setup-go | CI: nümunələrin yoxlanması |
| Go compile API | `https://go.dev/_/compile` | Kodu işlətmək (CORS yoxdur → proxy lazımdır) |

## Şriftlər

| Şrift | Link | Qeyd |
|---|---|---|
| Inter | https://fonts.google.com/specimen/Inter | Mətn; Azərbaycan hərfləri var |
| JetBrains Mono | https://fonts.google.com/specimen/JetBrains+Mono | Kod; liqaturalar söndürülür |

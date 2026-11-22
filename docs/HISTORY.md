# İş jurnalı

Hər iterasiyada istifadəçinin istəyi və görülən iş. Ən yenisi aşağıdadır.

---

## 2026-11-22 — Sessiya 1: konsept və ilk dizaynlar

### 1. Başlanğıc istəyi
gobyexample.com-un Azərbaycan dilində alternativi: müasir dizayn, rahat UX, orijinalın kompakt izah üslubu, daha sadə və aydın nümunələr. Sonra GitHub ilə CI/CD və pulsuz serverə deploy. Gələcəkdə hər texnologiya üçün ayrı sayt və ya vahid hub ola bilər. İlk etapda dizayn təsdiqlənməlidir.

### 2. Təkliflər və razılaşma
Lisenziya (CC BY 3.0), arxitektura (Astro, Shiki, Pagefind, Cloudflare Pages), kontent modeli, monorepo, UX təklifləri və 5 sual təqdim olundu. İstifadəçinin cavabları:
1. Hosting — Cloudflare Pages ilə razı
2. Dizayn istiqaməti — təkliflə razı (təmiz, tünd tema, Go mavisi)
3. Domen yoxdur
4. Terminlər ingiliscə qalsın — razı
5. Kod saytın içində işləsin, çox resurs tələb edirsə Playground linki

Yoxlanıldı: `go.dev/_/compile` işləyir, amma CORS vermir → kiçik proxy lazımdır. Plan təsdiqləndi ([ROADMAP.md](ROADMAP.md)).

### 3. Variant A — "Clean"
`design/index.html`, `design/example.html`. Hero + kod kartı, bölmə kartları, dərsdə solda addımlar və sağda yapışqan bütöv proqram, `Ctrl+K` axtarış, irəliləyiş, açıq/tünd tema.

### 4. Rəy: iki istiqamətli işıqlanma
İstifadəçi izah → kod işıqlanmasını çox bəyəndi və tərsini istədi: kodun üzərinə gələndə soldakı izah işıqlansın. Edildi. Ox ilə göstərmə ideyası gələcək üçün qeyd olundu.

### 5. Variant B — "Scope" (frontscope.dev əsasında)
Böyük hero, üzən teqlər, addım pleyeri, yaddaş vizualizatoru, "Proqram" bölməsi (trek kartları + nömrəli sətirlər + filtr). Fayllar: `design/b/`.

Rəy: frontscope-a çox oxşayır. Yeni referanslar verildi: itbooster.ru (struktur), roadmap.sh (sadə, kompakt), frontscope.dev (vizualizasiyalar — amma şriftləri və sarı rəngi bəyənilmədi). İstənilən rənglər: müasir göy, bənövşəyi, boz, qara.

### 6. Variant C — "Roadmap"
roadmap.sh-ın sıx kafel şəbəkəsi və yol xəritəsi, itbooster-in kod üslubunda bölmə etiketləri və bento kartları, scroll-spy nöqtələri, header-də texnologiya seçicisi (hub-a hazırlıq), 4 rəng palitrası. Fayllar: `design/c/`.

### 7. Rəy: hər variantdan bəyənilənlər
- **A:** Go versiyası ana səhifədə görünür; "Bütün mövzular" hissəsi; dərs səhifəsindəki sidebar daha aydın və solid; kod addımlara görə qısaldılmır, tam hündürlükdə görünür.
- **B:** "Oxuma — gör." bölməsi; "Proqram — 9 bölmə. 84 nümunə." bölməsi.
- **C:** ümumi rəng və dizayn, struktur, palitra.

### 8. Variant D — birləşmiş
C-nin rəngləri, palitrası və strukturu üzərinə A-nın versiya nişanı, "Bütün mövzular" kartları, solid sidebar və tam hündürlükdə kod; B-nin "Oxuma — gör." demosu və "Proqram" bölməsi. "Proqram"-da 3 görünüş arasında keçid: Bütün mövzular · Bölmə üzrə · Yol xəritəsi. Fayllar: `design/d/`.

---

## 2026-11-23 — Sessiya 2: Variant D üzərində iterasiya

### 9. İstifadəçi D-ni seçdi, əlavə istəklər
- Ana səhifəyə sadə animasiya (məsələn background wave).
- Dərs səhifəsində sidebar gizlənə bilsin, Zen rejimi olsun, kontent tam en və ya mərkəzdə ola bilsin.

Edildi:
- Dərs səhifəsi: header-də "Görünüş" menyusu; sidebar düyməsi və `[`; kontent eni "Mərkəzdə" (1220px) / "Tam en" və `F`; Zen rejimi (`Z`, `Esc`) — header/sidebar/footer gizlənir, kontent mərkəzdə, yuxarıda oxuma irəliləyişi, sol aşağıda çıxış paneli. Seçimlər yadda qalır (zen yalnız tab üçün). Fayl: `design/d/d.js`.
- Ana səhifə: hero-da SVG dalğalar, giriş animasiyaları.

### 10. Rəy: dalğa yox, hərəkətli qradiyent
Nəzərdə tutulan dalğa xətləri deyil, D-dəki ilkin arxa qradiyentin yavaş-yavaş hərəkət etməsi idi (iki rəng, hazırkı palitra rəngləri ola bilər). Referans: tünd göy-bənövşəyi yumşaq qradiyent şəkli.

Edildi: dalğalar silindi; palitranın iki rəngində 3 böyük yumşaq ləkə müxtəlif yollarla 28–40 saniyəlik dövrlə üzür və qarışır. Palitra dəyişəndə rənglər də dəyişir.

### 11. Rəy: section-lar arası scroll animasiyası yoxdur (frontscope-dakı kimi)
Edildi: kod etiketi hərf-hərf yazılır, h2 sözləri maskanın altından qalxır, "9 bölmə. 84 nümunə." rəqəmləri sayılır, alt mətn bulanıqdan aydınlaşır, kartlar növbə ilə gəlir, hero scroll-da solur, demo pleyer 3D əyilmədən düzəlir.

### 12. Rəy: tab keçidlərində və "Niyə bu sayt?" bloklarında animasiya yoxdur
Edildi:
- Tab keçidləri: kartlar növbə ilə; yol xəritəsində mərkəzi xətt çəkilir, node-lar böyüyür, budaqlar kənarlardan çıxır; bölmə/filtr dəyişəndə sətirlər soldan sürüşür.
- Bento kartları: hər birində mövzuya uyğun mini-animasiya (append, terminalda yazı, izah ↔ kod işığı, quiz seçimi, düymə basılması, zolaq dolması, parıltı). Yalnız ekrandaykən işləyir. Hover-də kart qalxır, kursoru izləyən işıq görünür.

### 13. Repo və sənədlər
Davam etmək üçün git repo yaradıldı; `README.md`, `docs/` (yol xəritəsi, jurnal, qərarlar, referanslar) və `CLAUDE.md` yazıldı. İstifadəçinin seçimi ilə GitHub-da **public** repo açıldı: https://github.com/seymur-orucov/go-by-example-az

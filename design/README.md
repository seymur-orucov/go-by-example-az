# Dizayn prototipi — Nümunələrlə Go

Framework-süz statik HTML/CSS prototip. Məqsəd: vizual üslubu və UX-i təsdiqləmək. Mərhələ 2-də bu tokenlər və komponentlər Astro-ya köçürüləcək.

## Necə açmaq olar
```
node design/serve.mjs
```
Sonra brauzerdə: http://localhost:4321/d/ (**Variant D — seçilmiş**), http://localhost:4321 (Variant A), http://localhost:4321/b/ (Variant B), http://localhost:4321/c/ (Variant C).

Dörd variant var. Hər səhifənin sağ aşağı küncündəki **Variant A | B | C | D** düyməsi ilə eyni səhifənin digər variantına keçmək olur.

| | Variant A — “Clean” | Variant B — “Scope” | Variant C — “Roadmap” |
|---|---|---|---|
| Ünvan | `/` | `/b/` | `/c/` |
| Referans | Stripe/Linear üslubu | frontscope.dev | roadmap.sh + itbooster.ru + frontscope vizualları |
| Rənglər | Tünd göy-qara, Go mavisi | Qara, limon `#E8FF5A` | Qara/boz + göy→bənövşəyi qradiyent; **4 palitra seçimi** |
| Başlıq şrifti | Inter | Unbounded (Syne-də `ə/Ə` yoxdur) | Inter |
| Ana səhifə | Hero + kod kartı, bölmə kartları | Böyük hero, üzən teqlər, canlı demo | Yığcam hero + irəliləyiş kartı, **Nümunələr / Yol xəritəsi** tabları, bento, hub bölməsi, scroll-spy nöqtələri |
| Dərs səhifəsi | İzah + bütöv kod | İzah + pleyer (kod, yaddaş, çıxış) | Eyni pleyer + sidebar-da **vertikal yol** (spine) və bölmə seçicisi |

**Variant C-nin UX qərarları:**
- *roadmap.sh-dan:* sıx 3 sütunlu kafel şəbəkəsi (hər nümunə: ad + qısa izah + status), “Yol xəritəsi” görünüşü: mərkəzi xətt, bölmə node-ları və hər iki tərəfə budaqlanan nümunələr. Statuslar: öyrənilib (yaşıl), növbəti (vurğu), qarşıda (boz).
- *itbooster.ru-dan:* kod üslubunda bölmə etiketləri (`features.Why()`, `hub.Next()`), bento kartlar, sağ kənarda bölmə nöqtələri (scroll-spy).
- *frontscope-dan:* yalnız vizualizasiya — addım pleyeri və yaddaş vizualı.
- *Hub-a hazırlıq:* header-də texnologiya seçicisi (`Go ▾` → Python, Rust… “tezliklə”) və ana səhifədə “Bir platforma, bir neçə dil” bölməsi.
- *Palitra:* header-dəki palitra düyməsi — Nebula (göy→bənövşəyi), İndiqo, Okean, Qrafit. Seçim yadda saxlanılır.

### Variant D — birləşmiş (`/d/`)
Rəyə əsasən A, B və C-nin bəyənilən hissələri bir yerdə:
- **C-dən:** rənglər, 4 palitra, header (texnologiya seçicisi), hero strukturu, bento, hub, scroll-spy.
- **A-dan:** hero-da Go versiyası nişanı, “Bütün mövzular” kartları, dərs səhifəsində bütün bölmələri göstərən açılıb-bağlanan sidebar, **tam hündürlükdə kod** (addımlara görə qısaldılmır; çıxış kodun altında).
- **B-dən:** “Oxuma — gör.” canlı demo, “Proqram — 9 bölmə. 84 nümunə.” bölməsi (trek kartları + nömrəli sətirlər + filtr).
- “Proqram” bölməsində 3 görünüş arasında keçid: **Bütün mövzular** (A) · **Bölmə üzrə** (B) · **Yol xəritəsi** (C). Seçim yadda saxlanılır.
- Dərsdə yaddaş vizualı hər addımın içində göstərilir; addım idarəsi (‹ 01/05 › ▶) kod pəncərəsinin başlığındadır.
- **Ana səhifə animasiyaları:** hero arxasındakı qradiyent hərəkətlidir (palitranın iki rəngində böyük yumşaq ləkələr yavaş-yavaş üzür və qarışır), başlıqda axan qradiyent, yüklənəndə hero elementlərinin növbə ilə qalxması. Scroll zamanı: kod etiketi (`demo.Play()`) yazılır, başlıq sözləri maskanın altından növbə ilə qalxır, “9 bölmə. 84 nümunə.” rəqəmləri 0-dan sayılır, alt mətn bulanıqlıqdan aydınlaşır, kartlar növbə ilə aşağıdan/bulanıqdan gəlir, yol xəritəsinin budaqları kənarlardan çıxır, hero yuxarı çəkildikcə solur, demo pleyer isə 3D əyilmədən düzəlir (scroll-a bağlı).
  - *Görünüş keçidləri:* “Bütün mövzular / Bölmə üzrə / Yol xəritəsi” arasında keçəndə kartlar növbə ilə gəlir; xəritədə mərkəzi xətt çəkilir, node-lar böyüyür, budaqlar kənarlardan çıxır; bölmə seçəndə və ya filtr dəyişəndə sətirlər soldan sürüşür.
  - *“Niyə bu sayt?” kartları:* hər kartın içində öz mini-animasiyası var (slice-a `append`, terminalda əmrin yazılıb nəticənin çıxması, izah ↔ kod işığı, sualın cavabının seçilməsi, düymələrin basılması, zolağın dolması, lisenziya nişanında parıltı). Animasiyalar yalnız kart ekrandaykən işləyir. Üzərinə gələndə kart qalxır və kursoru izləyən işıq görünür. `prefers-reduced-motion` açıqdırsa hamısı söndürülür.
- **Dərs səhifəsinin görünüş rejimləri** (header-dəki “Görünüş” menyusu):
  - *Mövzular paneli* — header-in solundakı düymə və ya <kbd>[</kbd> ilə gizlənir/açılır (dar ekranda drawer açır).
  - *Kontent eni* — **Mərkəzdə** (1220px, standart) və ya **Tam en**; <kbd>F</kbd>.
  - *Zen rejimi* — header, sidebar, footer və yol xətti gizlənir, kontent mərkəzdə qalır; yuxarıda oxuma irəliləyişi, sol aşağıda çıxış paneli. <kbd>Z</kbd> ilə açılır, <kbd>Esc</kbd> ilə bağlanır; dərsin başlığındakı “Zen” düyməsi də var.
  - Panel və en seçimi `localStorage`-da, zen isə yalnız bu tab üçün (`sessionStorage`) saxlanılır; səhifə yüklənəndə titrəmə olmasın deyə `<head>`-də tətbiq olunur.

Bütün variantlarda **izah ↔ kod qarşılıqlı işıqlanır**: izahın üzərinə gələndə kod sətirləri, kod sətrinin üzərinə gələndə isə uyğun izah addımı işıqlanır (lazım olsa ekrana gətirilir).

## Fayllar
| Fayl | Nə üçündür |
|---|---|
| `tokens.css` | Rənglər, şriftlər, ölçülər — açıq və tünd tema. Yeni texnologiya saytı yalnız `--accent*` dəyişənlərini dəyişir. |
| `app.css` | Komponentlər: header, sidebar, axtarış palitrası, kod pəncərəsi, terminal, quiz, pager |
| `app.js` | Tema, `Ctrl+K` axtarış, Go kod rənglənməsi (prototip), irəliləyiş (`localStorage`) |
| `data.js` | 84 nümunənin siyahısı (9 bölmə) — real saytda `content/go/`-dan generasiya olunacaq |
| `index.html` | Ana səhifə |
| `example.html` | Nümunə səhifəsi (pilot: Slices) |
| `b/style.css` | Variant B-nin bütün stilləri və tokenləri |
| `b/b.js` | Variant B: addım pleyeri, yaddaş vizualizatoru, Slices dərsinin məlumatı |
| `b/index.html`, `b/example.html` | Variant B səhifələri |
| `c/style.css` | Variant C stilləri, neytral tokenlər və 4 palitra (`data-palette`) |
| `c/c.js` | Variant C: palitra seçicisi, açılan menyular, bölmə rəngləri |
| `c/index.html`, `c/example.html` | Variant C səhifələri (pleyer üçün `b/b.js` təkrar istifadə olunur) |
| `d/style.css` | Variant D: `c/style.css` üzərinə A və B komponentləri |
| `d/d.js` | Variant D: dərs səhifəsinin görünüş rejimləri (panel, en, zen) və ana səhifədə scroll animasiyası |
| `d/index.html`, `d/example.html` | Variant D səhifələri (`b/b.js`, `c/c.js` təkrar istifadə olunur) |
| `serve.mjs` | Asılılıqsız lokal server |

## Dizayn qərarları
- **Tünd tema birinci planda**, amma sistem seçiminə uyğun açılır; açıq tema tam dəstəklənir.
- **Rəng:** Go mavisi `#00ADD8` əsas vurğudur; aqua uğur, fuksiya xəta, sarı xəbərdarlıq üçündür (Go brend palitrası).
- **Şriftlər:** Inter (mətn) və JetBrains Mono (kod), hər ikisi `ə ı ş ç ğ ö ü` hərflərini dəstəkləyir. Kodda liqaturalar söndürülüb ki, başlanğıc səviyyəli oxucu `<=` işarəsini `≤` kimi görməsin.
- **Nümunə səhifəsi = izah + tam proqram.** Orijinaldakı kimi kodu parçalara bölmək əvəzinə solda addımlar, sağda isə yapışqan (sticky) **bütöv proqram** var. Hansı addım oxunursa (scroll və ya hover), koddakı uyğun sətirlər işıqlanır, qalanları solğunlaşır. Bütöv kod birbaşa işə salına və kopyalana bilir.
- **Dar ekranda** (< 1180px) hər addımın altında öz kod parçası görünür, bütöv proqram isə sonda verilir. Sidebar < 960px-də drawer olur.
- **Öyrənmə dövrü:** izah → işə sal → “Yadda saxla” → “Özünü yoxla” sualı → “Öyrəndim” → növbəti mövzu.
- **Axtarış** Azərbaycan hərflərinə həssas deyil: `dovr` sorğusu “Dövr”ü tapır.

## Prototipdə simulyasiya olunanlar
- “İşə sal” əvvəlcədən hazırlanmış nəticəni göstərir. Real saytda `/api/run` → `go.dev/_/compile` proxy-si işləyəcək.
- Redaktə sadə `contenteditable`-dır. Real saytda CodeMirror lazy-load olunacaq.
- Yalnız **Slices** səhifəsi doludur; digər linklər həmin səhifəni bildirişlə açır.
- İlk girişdə irəliləyiş demo üçün doldurulub (8 nümunə “öyrənilib”).

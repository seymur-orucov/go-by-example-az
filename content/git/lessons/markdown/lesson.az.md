**Markdown** sadə mətnə bir neçə işarə əlavə edərək formatlama yazma üsuludur. Fayl `.md` ilə bitir və istənilən redaktorda oxunur. GitHub isə onu formatlanmış göstərir. README-lər, issue-lar və şərhlər Markdown-la yazılır.

Nümunə Ayla-nın komandaya yeni gələnlər üçün yazdığı `SETUP.md` faylıdır: laptopu işə necə hazırlamaq.

## Başlıqlar və mətn {#headings}

Başlıq sətrin əvvəlindəki `#` ilə yazılır. Bir `#` ən böyük başlıqdır, `##` ondan kiçik, `######` ən kiçik. `#`-dan sonra boşluq qoyulur.

Adi sətirlər paraqraf olur. Paraqrafları boş sətir ayırır. Faylda ardıcıl gələn iki sətir isə bir paraqrafa birləşir: `first day.` və `Ask Ayla` yan-yana çıxır. Issue, PR və şərhlərdə isə GitHub sətir sonunu saxlayır.

Mətnin içində `**qalın**` qalın, `*kursiv*` kursiv, backtick-lər arasındakı mətn isə kod kimi görünür. Kod üçün backtick fayl, komanda və proqram adlarına yaxşıdır: `GitHub` sözü burada belə yazılıb.

## Siyahılar və tapşırıqlar {#lists}

Nömrəli siyahı `1.`, `2.` ilə yazılır. Nöqtəli siyahı `-` ilə yazılır, `*` də olar. İç-içə siyahı üçün bəndi üst bəndin mətninin altına qədər içəri çəkin. `2. ` 3 simvoldur, ona görə `- pick the LTS version` 3 boşluqla başlayır.

`- [ ]` və `- [x]` **tapşırıq siyahısıdır** (*task list*). GitHub onu checkbox kimi göstərir, `[x]` işarələnmiş deməkdir. Bu GitHub Flavored Markdown-un (GFM) imkanıdır. GFM GitHub-ın Markdown dialektidir: adi Markdown-a cədvəl, tapşırıq siyahısı və başqa bir neçə şey əlavə edir.

## Keçidlər və şəkillər {#links}

Keçid `[mətn](ünvan)` formasındadır. Kvadrat mötərizədə görünən mətn, adi mötərizədə ünvan yazılır. Ünvan tam URL ola bilər. Eyni repository-dəki fayl üçün nisbi yol da olar: `CONTRIBUTING.md` faylın yanındakı fayla aparır.

Şəkil keçidə bənzəyir, sadəcə əvvəlində `!` var: `![izah](yol)`. Kvadrat mötərizədəki mətn *alt text*-dir: şəkil açılmasa və ya ekran oxuyucusu işlədilsə, o oxunur. Ona görə şəklin nə göstərdiyini yazın. Dərsdə şəkil faylı yoxdur, ona görə şəklin yerində alt text görünür.

## Kod blokları və cədvəllər {#code-tables}

Bir neçə sətir kod üç backtick arasında yazılır. Açılan backtick-lərdən sonra dilin adını (`bash`) yazsanız, GitHub kodu rəngləyir. Blokun içində Markdown işləmir: `#` başlıq olmur, hər şey olduğu kimi görünür.

Cədvəl `|` ilə sütunlara bölünür. İkinci sətir başlığı cədvəldən ayırır və sütunun düzlənməsini təyin edir. `:---` sola, `:---:` mərkəzə, `---:` sağa düzləyir. Sütunları boşluqla bərabər etmək lazım deyil, sadəcə faylda oxumaq asan olur.

## Bloklar və xəbərdarlıqlar {#alerts}

`>` ilə başlayan sətirlər sitat blokudur. Son sətir belədir: o, solunda xətt olan mətn kimi görünür.

`> [!NOTE]` və `> [!WARNING]` GitHub-ın **alert**-ləridir. Onlar rəngli başlıqlı blok kimi görünür. Beş növ var: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`. Bunlar da GitHub-a xasdır: başqa saytlarda adi sitat kimi görünə bilər. GitHub sənəddə bir-iki alert-dən çox işlətməməyi və onları ard-arda qoymamağı tövsiyə edir. Hər yerdə xəbərdarlıq olanda oxucu onlara fikir vermir.

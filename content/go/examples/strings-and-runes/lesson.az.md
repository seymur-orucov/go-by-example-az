Go-da `string` dəyişməz bayt ardıcıllığıdır: mətn UTF-8 kodlaşdırması ilə baytlara çevrilib saxlanılır. Bir simvolu təmsil edən ədəd isə `rune`-dur, yəni simvolun Unicode cədvəlindəki nömrəsi. İngilis əlifbasından kənar hərflər 1 baytdan çox tutduğu üçün "neçə bayt" və "neçə hərf" fərqli suallardır. Bu dərsdə `ü` hərfi olan sözlərdə bu fərqi görürük.

## Bayt və hərf {#bytes}

Bayt 0-dan 255-ə qədər olan kiçik ədəddir. UTF-8-də ingilis hərfləri (`a`, `k`) 1 bayt tutur, `ü`, `é`, `ñ` isə 2 bayt. Azərbaycan hərfləri `ə`, `ş`, `ç`, `ğ`, `ı`, `ö` də 2 bayt tutur.

`len(city)` hərflərin yox, baytların sayını qaytarır: "Zürich" 6 hərfdir, amma `ü` 2 bayt tutduğu üçün 7 bayt edir. Hərfləri saymaq üçün `unicode/utf8` paketinin `RuneCountInString` funksiyası lazımdır.

## İndeks baytdır {#index}

`city[3]` 4-cü baytı qaytarır, yəni `byte` tipli ədəd: `114`. `r` 1 bayt tutduğu üçün `string(city[3])` onu yenidən `r` hərfinə çevirir. `city[:3]` isə slice kimi ilk üç baytı götürür: `Z` və `ü`-nün iki baytı birlikdə `Zü` verir.

İndekslə baytı oxumaq olar, dəyişmək olmaz: string dəyişməzdir. `city[0] = 'z'` kompilyasiya olunmur: `cannot assign to city[0]`. Başqa mətn lazımdırsa, yeni string yaradın.

> **Diqqət:** `city[1]` `ü` deyil, onun iki baytından yalnız birincisidir. Çoxbaytlı hərfi indekslə və ya yarı kəsilmiş slice ilə götürmək xarab simvol verir.

## []rune {#runes}

`[]rune(city)` mətni `rune`-lara bölür. Adi hərflərdə bir hərf bir `rune`-dur. Bəzi simvollar isə bir neçə `rune`-dan ibarətdir: məsələn, bəzi emoji və ya ayrıca aksent işarəsi ilə yazılmış `é`. İndi `len` 6-dır və `letters[1]` həqiqətən ikinci hərfdir. `Println` `rune`-u ədəd kimi çap edir (`ü`-nün Unicode nömrəsi 252-dir), hərf kimi görmək üçün `string(...)` ilə çeviririk.

## range ilə gəzinti {#range}

`range` mətni bayt-bayt yox, hərf-hərf gəzir: `r` `rune`-dur, `i` isə həmin hərfin başladığı baytın indeksidir. Ona görə indekslər 0, 1, 3, 4, 5, 6 kimi gedir: `ü` 1 indeksində başlayır, 2 indeksli bayt da ona məxsusdur, növbəti hərf `r` isə 3 indeksindədir.

## Rune literal {#literal}

Tək dırnaq içində yazılan `'ü'` rune literal-dır, cüt dırnaq içindəki `"ü"` isə string. `range` hər hərfi `rune` kimi verdiyi üçün onu `'ü'` ilə birbaşa müqayisə edirik və "Frühstück" sözündə `ü` hərfini sayırıq.

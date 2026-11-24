Go-da `string` dəyişməz bayt ardıcıllığıdır. Bayt 0-dan 255-ə qədər olan kiçik ədəddir, mətn isə UTF-8 kodlaşdırması ilə baytlara çevrilib saxlanılır. UTF-8-də ingilis əlifbasının hərfləri (`a`, `k`) 1 bayt tutur, `ü`, `é`, `ñ` kimi hərflər isə 2 bayt. Azərbaycan əlifbasındakı `ə`, `ş`, `ç`, `ğ`, `ı`, `ö`, `ü` da 2 bayt tutur.

Bir simvolu təmsil edən ədəd isə `rune`-dur — onun Unicode-dakı nömrəsi. Ona görə ASCII-dən kənar hərfləri olan mətnlə işləyəndə "neçə bayt" və "neçə hərf" fərqli suallardır. Bu dərsdə `ü` hərfi olan sözlər üzərində bu fərqi görürük.

## Bayt və hərf {#bytes}

`len(city)` hərflərin yox, baytların sayını qaytarır: "Zürich" 6 hərfdir, amma `ü` 2 bayt tutduğu üçün 7 bayt edir. Hərfləri saymaq üçün `unicode/utf8` paketinin `RuneCountInString` funksiyası lazımdır.

## İndeks baytdır {#index}

`city[3]` 4-cü baytı qaytarır, yəni `byte` tipli ədəd: `114`. `r` 1 bayt tutduğu üçün `string(city[3])` onu yenidən `r` hərfinə çevirir. `city[:3]` isə slice kimi ilk üç baytı götürür: `Z` və `ü`-nün iki baytı birlikdə `Zü` verir.

> **Diqqət:** `city[1]` `ü` deyil, onun iki baytından yalnız birincisidir. Çoxbaytlı hərfi indekslə və ya yarı kəsilmiş slice ilə götürmək xarab simvol verir.

## []rune {#runes}

`[]rune(city)` mətni hərflərə bölür: hər element bir `rune`-dur. İndi `len` 6-dır və `letters[1]` həqiqətən ikinci hərfdir. `Println` `rune`-u ədəd kimi çap edir (`ü`-nün Unicode nömrəsi 252-dir), hərf kimi görmək üçün `string(...)` ilə çeviririk.

## range ilə gəzinti {#range}

`range` mətni bayt-bayt yox, hərf-hərf gəzir: `r` `rune`-dur, `i` isə həmin hərfin başladığı baytın indeksidir. Ona görə indekslər 0, 1, 3, 4, 5, 6 kimi gedir: `ü` 1-ci baytda başlayır, 2-ci bayt da ona məxsusdur, növbəti hərf `r` isə 3-dədir.

## Rune literal {#literal}

Tək dırnaq içində yazılan `'ü'` rune literal-dır, cüt dırnaq içindəki `"ü"` isə string. `range` hər hərfi `rune` kimi verdiyi üçün onu `'ü'` ilə birbaşa müqayisə edirik və "Frühstück" sözündə `ü` hərfini sayırıq.

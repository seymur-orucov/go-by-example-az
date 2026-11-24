Go-da `string` dəyişməz bayt ardıcıllığıdır. Bayt 0-dan 255-ə qədər olan kiçik ədəddir, mətn isə UTF-8 kodlaşdırması ilə baytlara çevrilib saxlanılır. UTF-8-də latın hərfləri (`a`, `k`) 1 bayt tutur, `ə`, `ş`, `ç`, `ğ`, `ı`, `ö`, `ü` isə 2 bayt.

Bir simvolu təmsil edən ədəd isə `rune`-dur — onun Unicode-dakı nömrəsi. Ona görə Azərbaycan dilində mətnlə işləyəndə "neçə bayt" və "neçə hərf" fərqli suallardır. Bu dərsdə şəhər adları üzərində bu fərqi görürük.

## Bayt və hərf {#bytes}

`len(city)` hərflərin yox, baytların sayını qaytarır: "Şəki" 4 hərfdir, amma `Ş` və `ə` 2 bayt tutduğu üçün 6 bayt edir. Hərfləri saymaq üçün `unicode/utf8` paketinin `RuneCountInString` funksiyası lazımdır.

## İndeks baytdır {#index}

`city[4]` 5-ci baytı qaytarır, yəni `byte` tipli ədəd: `107`. `k` 1 bayt tutduğu üçün `string(city[4])` onu yenidən `k` hərfinə çevirir. `city[:2]` isə slice kimi ilk iki baytı götürür və bu iki bayt birlikdə `Ş` hərfidir.

> **Diqqət:** `city[0]` `Ş` deyil, onun iki baytından yalnız birincisidir. Çoxbaytlı hərfi indekslə və ya yarı kəsilmiş slice ilə götürmək xarab simvol verir.

## []rune {#runes}

`[]rune(city)` mətni hərflərə bölür: hər element bir `rune`-dur. İndi `len` 4-dür və `letters[1]` həqiqətən ikinci hərfdir. `Println` `rune`-u ədəd kimi çap edir (`ə`-nin Unicode nömrəsi 601-dir), hərf kimi görmək üçün `string(...)` ilə çeviririk.

## range ilə gəzinti {#range}

`range` mətni bayt-bayt yox, hərf-hərf gəzir: `r` `rune`-dur, `i` isə həmin hərfin başladığı baytın indeksidir. Ona görə indekslər 0, 2, 4, 5 kimi atlayır — `Ş` və `ə` iki bayt tutur.

## Rune literal {#literal}

Tək dırnaq içində yazılan `'ə'` rune literal-dır, cüt dırnaq içindəki `"ə"` isə string. `range` hər hərfi `rune` kimi verdiyi üçün onu `'ə'` ilə birbaşa müqayisə edirik və "Lənkəran" sözündə `ə` hərfini sayırıq.

Fayldan, formdan, komanda sətrindən və ya şəbəkədən gələn məlumat həmişə mətndir: `"6"` ədəd deyil, `6` simvolundan ibarət string-dir. Onunla hesablamaq üçün əvvəlcə mətni oxuyub ədədə çevirmək (parse etmək) lazımdır. `int(x)` kimi tip çevirməsi bunu bacarmır: o, bir ədəd tipini başqasına çevirir, mətni oxumur, `int("6")` isə kompilyasiya olunmur. Bu iş üçün `strconv` package-i var, adı "string conversion" sözlərindən gəlir.

Bu dərsdə ağıllı termostatın parametrlər faylını oxuyuruq: oyanma saatı, istənilən temperatur, qənaət rejimi, cihazın nömrəsi və ventilyatorun gücü. Fayldakı hər dəyər mətndir, bəziləri isə səhv yazıla bilər.

## Atoi və Itoa {#atoi}

`strconv.Atoi` ("ASCII to integer") mətni `int`-ə çevirir və ikinci nəticə kimi `error` qaytarır, çünki hər mətn ədəd deyil. Fərq çıxışda görünür: `wake+"1"` iki mətni yapışdırıb `61` verir, `hour+1` isə hesablayıb `7` verir. Əks istiqamət `strconv.Itoa`-dır: o, ədədi mətnə çevirir ki, onu başqa mətnlə `+` ilə birləşdirmək olsun.

> **Diqqət:** `string(rune(65))` ədədi mətnə çevirmir: Unicode nömrəsi 65 olan hərfi, yəni `"A"`-nı verir. Ədədin yazılışı lazımdırsa, `strconv.Itoa(65)` yazın.

## Kəsr ədəd və bool {#float-bool}

`strconv.ParseFloat(s, 64)` mətni `float64`-ə çevirir. İkinci arqument bit ölçüsüdür: 64 tam `float64` dəqiqliyi deməkdir; 32 yazsanız, dəyər `float32`-yə sığacaq qədər yuvarlaqlaşdırılır, amma nəticənin tipi yenə `float64` olur. `strconv.ParseBool` `"true"`, `"false"`, `"1"`, `"0"`, `"t"`, `"F"`, `"TRUE"` kimi yazılışları qəbul edir, `"yes"` və `"on"` isə xətadır.

Burada mətnləri özümüz yazdığımız üçün xətanı `_` ilə atırıq. Fayldan oxunan dəyərdə xəta mütləq yoxlanmalıdır, onu son iki addımda görəcəyik.

## Say sistemləri {#bases}

`strconv.ParseInt(s, base, bitSize)` iki əlavə arqument alır. `base` say sistemidir: 10 adi onluq, 16 onaltılıq (hex, rəqəmlər 0–9 və A–F), 2 ikilik. Cihazın nömrəsi `1F4A` hex yazılıb, onluqda bu 8010-dur. `strconv.FormatInt(n, base)` əksini edir: ədədi istənilən say sistemində mətnə çevirir və hex hərflərini kiçik yazır.

> **Bilgi:** `base` 0 olanda say sistemi mətnin prefiksindən götürülür: `0x` hex, `0b` ikilik, `0o` səkkizlik, prefikssiz mətn isə onluq.

## Səhv yazılış {#syntax}

Mətn ədəd kimi oxunmursa, `Atoi` `0` və xəta qaytarır. Xətanın mətni hər şeyi deyir: hansı funksiya, hansı mətn və səbəb, yəni `invalid syntax`. Bu xəta `*strconv.NumError` tipindədir və içində `strconv.ErrSyntax`-ı bükür, ona görə səbəbi `errors.Is` ilə yoxlamaq olur. Boşluq və nöqtə də səhv yazılışdır: `" 6"` və `"6.5"` `Atoi` üçün ədəd deyil.

## Aralıqdan kənar {#range}

`bitSize` nəticənin hansı tipə sığmalı olduğunu deyir: 8 `int8` deməkdir, yəni -128..127. Ventilyatorun gücü `int8`-də saxlanılır, `"300"` isə ora sığmır: `ParseInt` ən yaxın sərhədi, `127`-ni və `strconv.ErrRange` xətasını qaytarır. Nəticənin tipi `bitSize`-dan asılı olmayaraq `int64`-dür; xəta yoxdursa, onu `int8(fan)` ilə itkisiz çevirmək olar.

`errors.As` xətanı `*strconv.NumError`-a açır və onun sahələrini verir: `Num` səhv mətndir, `Func` isə xətanı qaytaran funksiyanın adı.

> **Diqqət:** Xəta olanda qaytarılan `127` faylda yazılan dəyər deyil. Əvvəlcə `err`-i yoxlayın, nəticəni yalnız sonra istifadə edin.

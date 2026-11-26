Təsadüfi ədədlər oyunlarda, sualları qarışdırmaqda, simulyasiyalarda lazım olur. Kompüter əslində "təsadüf" yaratmır: generator başlanğıc ədəddən (seed) düsturla təsadüfi görünən ədədlər ardıcıllığı çıxarır, buna pseudo-random deyilir. Go-da bunun üçün `math/rand/v2` package-i var; onun ümumi (global) generatoru proqram hər işə düşəndə özünü fərqli seed ilə qurur, ona görə nəticə hər dəfə başqa olur.

Bu dərsdə şagirdlər üçün şifahi hesab vərəqləri yaradan proqram yazırıq: əməl, ədədlər və cavab variantları təsadüfi seçilir, amma müəllim istədiyi vərəqi yenidən çap edə bilməlidir.

## Təsadüfi indeks {#intn}

`rand.IntN(n)` `[0, n)` aralığından, yəni 0-dan `n-1`-ə qədər bir tam ədəd qaytarır. Bu, slice indeksinə tam uyğundur: `ops[rand.IntN(len(ops))]` üç əməldən birini seçir. Seçim hər işə salmada fərqli ola bilər, ona görə çıxışda dəyərin özünü yox, onun düzgün olub-olmadığını çap edirik.

> **Diqqət:** `rand.IntN(0)` panic edir (`invalid argument to IntN`). Boş slice-dan seçməzdən əvvəl uzunluğu yoxlayın.

## Aralıqdan ədəd {#range}

`[min, max)` aralığı üçün `min + rand.IntN(max-min)` yazılır: `rand.IntN(90)` 0–89 verir, üstünə 10 gələndə 10–99 alınır, yəni iki rəqəmli ədəd. Yuxarı sərhəd aralığa daxil deyil: zər atmaq üçün `1 + rand.IntN(6)` yazılır, `rand.IntN(7)` isə 0 da qaytara bilər. Dövr 1000 ədəd yaradır və hamısının aralıqda qaldığını yoxlayır.

## Qarışdırmaq {#shuffle}

Düzgün cavab həmişə birinci yerdə olsa, şagird bunu tez tutar. `rand.Shuffle(n, swap)` elementləri təsadüfi yerlərə köçürür: elementlərin sayını və iki elementin yerini dəyişən closure-u alır. Slice-ın özü dəyişir, elementlər isə itmir: düzgün cavab `91` yenə içindədir.

`rand.Perm(n)` 0-dan `n-1`-ə qədər ədədləri qarışıq sırada yeni slice kimi qaytarır, sualların sırası üçün rahatdır. Sıra hər dəfə başqadır, amma sıralayanda həmişə `[0 1 2 3 4]` alınır.

## Seed ilə generator {#seeded}

Müəllim 3 nömrəli vərəqi paylayıb, cavabları yoxlamaq üçün isə eyni vərəq lazımdır. `rand.New(rand.NewPCG(s1, s2))` ayrıca generator yaradır: PCG alqoritmin adıdır, iki `uint64` ədəd isə seed-dir. Eyni seed həmişə eyni ardıcıllığı verir, ona görə bu hissənin çıxışı hər işə salmada eynidir və `reprint` də yenə 36 ilə başlayır. Generatorun metodları package funksiyaları ilə eyni adlıdır: `sheet.IntN`, `sheet.Shuffle`, `sheet.Perm`.

Köhnə `math/rand`-dakı `rand.Seed` funksiyası v2-də yoxdur: təkrarlanan ardıcıllıq lazımdırsa, seed ilə öz generatorunuzu yaradın. Avtomatik testlərdə də bu üsuldan istifadə olunur: nəticə hər dəfə eyni olur və yoxlamaq asanlaşır.

> **Diqqət:** Seed məlumdursa, ardıcıllığı hər kəs təkrarlaya bilər. Ona görə `math/rand/v2` parol, token və ya şifrə açarı üçün yaramır; belə hallarda `crypto/rand` package-i istifadə olunur.

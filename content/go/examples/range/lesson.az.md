`range` kolleksiyanın elementlərini bir-bir gəzmək üçündür və `for` ilə birlikdə yazılır. Array dərsində indeksi əllə artırırdıq: `for i := 0; i < len(a); i++`. `range` eyni işi görür, amma başlanğıcı, şərti və addımı özü idarə edir, ona görə indeksi səhv yazıb hüduddan çıxmaq riski olmur.

Bu dərsdə metro xəttini gəzirik: stansiyaların siyahısı, aralarındakı yol vaxtı və hər stansiyadakı sərnişin sayı.

## Slice üzərində {#slice}

`for i, stop := range stops` hər təkrarda iki dəyər verir: indeks (`i`) və həmin indeksdəki element (`stop`). İndeks 0-dan başladığı üçün sıra nömrəsini `i+1` kimi çap edirik. Array üzərində də `range` eyni cür işləyir.

## Lazımsız dəyəri atmaq {#blank}

Burada yalnız dəqiqələr lazımdır, indeks yox. Go-da istifadə olunmayan dəyişən kompilyasiya xətasıdır, ona görə indeksin yerinə `_` yazırıq — "bu dəyəri at" deməkdir. Əksinə, yalnız indeks lazımdırsa, ikinci dəyişəni ümumiyyətlə yazmırıq: `for i := range stops`.

> **Diqqət:** `m` elementin nüsxəsidir. Dövrün içində `m = 0` yazsaq, `minutes` dəyişmir; elementi dəyişmək üçün indeksdən istifadə edin: `minutes[i] = 0`.

## Map üzərində {#map}

Map üzərində `range` açarı və dəyəri verir: `station` və `n`. Hər stansiyanı əvvəlki ən böyük sayla müqayisə edib ən sıx stansiyanı tapırıq.

> **Diqqət:** map-də gəzinti sırası təsadüfidir və hər işə salmada dəyişə bilər. Ona görə nəticəsi sıradan asılı olmayan işlər görürük: cəm, ən böyük dəyər, axtarış.

## Ədəd üzərində {#int}

Go 1.22-dən `range`-ə ədəd də vermək olar: `for car := range 3` `car`-ı 0, 1, 2 qiymətləri ilə təkrarlayır. Bu, `for car := 0; car < 3; car++` yazılışının qısa formasıdır və sadəcə "N dəfə təkrarla" lazım olanda rahatdır.

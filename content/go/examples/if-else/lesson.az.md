Şərt kodun bir hissəsini yalnız müəyyən halda icra edir: hava soyuqdursa gödəkçə götür, balans çatmırsa keçidə icazə vermə. Dövr eyni işi təkrarlayır, şərt isə işi yalnız lazım olanda görür.

`if`-dən sonra `true` və ya `false` verən ifadə yazılır: `true` olanda `{ }` içindəki kod işləyir, yoxsa blok keçilir. Bu dərsdə hava proqnozuna baxıb nə geyinməyi seçən proqram yazırıq: `temp` dərəcə ilə temperaturdur, `raining` isə yağış olub-olmadığını göstərir.

## Şərt və && {#if}

`if temp < 10 && raining` iki şərti `&&` ("və") ilə birləşdirir: nəticə hər ikisi doğru olanda `true` olur. `&&`, `||` və `!` operatorlarını Values dərsində görmüşük. Burada `4 < 10` doğrudur, `raining` də `true`-dur, ona görə mesaj çap olunur. `raining` özü `bool` olduğu üçün `raining == true` yazmağa ehtiyac yoxdur.

> **Diqqət:** Go-da şərti mötərizəyə almaq lazım deyil, amma `{ }` həmişə məcburidir, tək sətirlik kod üçün də.

## else {#else}

`else` şərt yalan olanda işləyən alternativ yoldur. İki blokdan həmişə yalnız biri işləyir: `4 < 0` yalandır, ona görə `else` bloku işləyir.

> **Diqqət:** `else` bağlayan `}` ilə eyni sətirdə olmalıdır: `} else {`. Yeni sətirdə yazsanız, kompilyasiya xətası alarsınız.

## else if zənciri {#chain}

Yol ikidən çoxdursa, `else if` ilə zəncir qurulur. Şərtlər yuxarıdan aşağı yoxlanır, ilk doğru olan işləyir, qalanlarına baxılmır: `4 < 0` yalandır, `4 < 15` doğrudur və `"cool"` çap olunur. Ona görə şərtlərin sırası nəticəni dəyişir: `temp < 15`-i birinci yazsaq, `-5` üçün də `"cool"` çap olunardı (`-5 < 15` doğrudur).

## Şərtdən əvvəl qısa elan {#init}

`if feels := temp - 3; feels < 5` şərtdən əvvəl nöqtəli vergüllə dəyişən elan edir. Burada küləyə görə hiss olunan temperaturu real temperaturdan 3 dərəcə aşağı hesab edirik. `feels` yalnız bu `if`-in və onun `else` hissələrinin içində görünür, kənarda onu istifadə etmək olmaz. Beləcə yalnız şərt üçün lazım olan `feels` funksiyanın qalan hissəsində başqa dəyişənlə qarışmır.

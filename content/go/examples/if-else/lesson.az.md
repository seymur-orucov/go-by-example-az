Şərt proqrama qərar verməyi öyrədir: hava soyuqdursa gödəkçə götür, balans çatmırsa keçidə icazə vermə. Dövr eyni işi təkrarlayır, şərt isə işi yalnız lazım olanda görür. Şərt `true` və ya `false` verən ifadədir: `true` olanda `{ }` içindəki kod işləyir, əks halda həmin blok keçilir.

Şərt `if` açar sözü ilə yazılır. Bu dərsdə hava proqnozuna baxıb nə geyinməyi seçən proqram yazırıq: `temp` dərəcə ilə temperaturdur, `raining` isə yağış olub-olmadığını göstərir.

## Şərt və && {#if}

`if temp < 10 && raining` iki şərti birləşdirir: `&&` "və" deməkdir, nəticə hər ikisi doğru olanda `true` olur. `||` "və ya"dır, biri doğru olsa kifayətdir; `!` isə şərti tərsinə çevirir. Burada `4 < 10` doğrudur, `raining` də `true`-dur, ona görə mesaj çap olunur. `raining` özü `bool` olduğu üçün `raining == true` yazmağa ehtiyac yoxdur.

> **Diqqət:** Go-da şərti mötərizəyə almaq lazım deyil, amma `{ }` həmişə məcburidir, tək sətirlik kod üçün də.

## else {#else}

`else` şərt yalan olanda işləyən alternativ yoldur. İki blokdan həmişə tam biri işləyir: `temp < 0` yalandır (4 sıfırdan böyükdür), ona görə `else` bloku çap olunur.

> **Diqqət:** `else` bağlayan `}` ilə eyni sətirdə olmalıdır: `} else {`. Yeni sətirdə yazsanız, kompilyasiya xətası alarsınız.

## else if zənciri {#chain}

Yol ikidən çoxdursa, `else if` ilə zəncir qurulur. Şərtlər yuxarıdan aşağı yoxlanır, ilk doğru olan işləyir, qalanlarına baxılmır: `4 < 0` yalandır, `4 < 15` doğrudur və `"cool"` çap olunur. Buna görə sıra vacibdir: dar həddi əvvəl yazmaq lazımdır, əks halda ilk geniş şərt hər şeyi özünə çəkər.

## Şərtdən əvvəl qısa elan {#init}

`if feels := temp - 3; feels < 5` şərtdən əvvəl nöqtəli vergüllə dəyişən elan edir. Burada küləyə görə hiss olunan temperaturu real temperaturdan 3 dərəcə aşağı hesab edirik. `feels` yalnız bu `if`-in və onun `else` hissələrinin içində görünür, kənarda onu istifadə etmək olmaz. Beləcə müvəqqəti dəyər kodun qalanını çirkləndirmir.

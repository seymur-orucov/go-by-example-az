Sabit — proqram işləyərkən dəyişməyən dəyərdir: şəhərin adı, taksi tarifi, vergi faizi. Dəyişəndən fərqi budur ki, sabitə sonradan yeni dəyər yazmaq olmur: onu təsadüfən dəyişmək cəhdini kompilyator özü tutur və proqram heç işə düşmür.

Sabit `const` ilə elan olunur. Onun dəyəri kompilyasiya zamanı, yəni proqram işə düşməzdən əvvəl məlum olmalıdır: rəqəm, mətn, `true`/`false` və ya bunlardan qurulan ifadə. Adlı sabit kodu oxunaqlı edir — `0.5`-in nə demək olduğunu təxmin etmək lazım deyil, `perKm` adı özü deyir.

## Paket səviyyəsində sabit {#declare}

`city` funksiyadan kənarda elan olunub, ona görə faylın bütün funksiyalarında görünür. Bir dəfə yazılır və hər yerdə eyni qalır.

## Sabitlər qrupu {#group}

Bir-birinə aid sabitləri `const ( ... )` blokunda yığmaq rahatdır: taksi tarifinin hər iki rəqəmi bir yerdədir. Tarif dəyişəndə kodda yalnız bu iki sətri düzəldirik.

> **Diqqət:** sabitə yeni dəyər yazmaq olmaz — `minFare = 3` kompilyasiya xətası verir.

## Untyped sabitlər {#untyped}

`minFare` və `perKm`-in tipi yazılmayıb — bunlar untyped sabitlərdir. Belə sabit istifadə olunduğu yerin tipinə uyğunlaşır: `km` `float64` olduğu üçün `minFare` də `float64` kimi hesablanır. `minFare` `int` tipli dəyişən olsaydı, onu `float64` ilə toplamaq olmazdı.

## Sabit ifadələr {#expr}

Sabitdən yeni sabit qurmaq olar: gecə tarifi gündüzdən 1.5 dəfə bahadır. Bu hesablama proqram işə düşməzdən əvvəl, kompilyasiya zamanı aparılır.

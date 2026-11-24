Sabit — proqram işləyərkən dəyişməyən dəyərdir: şəhərin adı, taksi tarifi, vergi faizi. `const` ilə elan olunur və dəyəri kompilyasiya zamanı məlum olmalıdır.

## Paket səviyyəsində sabit {#declare}

`city` funksiyadan kənarda elan olunub, ona görə faylın bütün funksiyalarında görünür. Bir dəfə yazılır və hər yerdə eyni qalır.

## Sabitlər qrupu {#group}

Bir-birinə aid sabitləri `const ( ... )` blokunda yığmaq rahatdır: taksi tarifinin hər iki rəqəmi bir yerdədir. Tarif dəyişəndə kodda yalnız bu iki sətri düzəldirik.

> **Diqqət:** sabitə yeni dəyər yazmaq olmaz — `minFare = 3` kompilyasiya xətası verir.

## Untyped sabitlər {#untyped}

`minFare` və `perKm`-in tipi yazılmayıb — bunlar untyped sabitlərdir. Belə sabit istifadə olunduğu yerin tipinə uyğunlaşır: `km` `float64` olduğu üçün `minFare` də `float64` kimi hesablanır. `minFare` `int` tipli dəyişən olsaydı, onu `float64` ilə toplamaq olmazdı.

## Sabit ifadələr {#expr}

Sabitdən yeni sabit qurmaq olar: gecə tarifi gündüzdən 1.5 dəfə bahadır. Bu hesablama proqram işə düşməzdən əvvəl, kompilyasiya zamanı aparılır.

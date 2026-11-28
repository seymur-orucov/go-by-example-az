Sabit `const` ilə elan olunan və proqram işləyərkən dəyişməyən dəyərdir: şəhərin adı, taksi tarifi, vergi faizi. Dəyişəndən fərqli olaraq, sabitə sonradan yeni dəyər yazmaq olmur. Belə cəhdi kompilyator tutur və proqram işə düşmür.

Sabitin dəyəri kompilyasiya zamanı, yəni proqram işə düşməzdən əvvəl məlum olmalıdır: rəqəm, mətn, `true`/`false` və ya bunlardan qurulan ifadə.

## Package səviyyəsində sabit {#declare}

`city` funksiyadan kənarda elan olunub, ona görə package-in bütün funksiyalarında görünür, başqa fayldakılarda da. Bir dəfə yazılır və hər yerdə eyni qalır.

## Sabitlər qrupu {#group}

Bir-birinə aid sabitləri `const ( ... )` blokunda yığmaq rahatdır: taksi tarifinin hər iki rəqəmi bir yerdədir. Tarif dəyişəndə kodda yalnız bu iki sətri düzəldirik. `perKm` adı deyir ki, `0.5` 1 km-in qiymətidir. Rəqəmin mənasını təxmin etmək lazım gəlmir.

> **Diqqət:** sabitə yeni dəyər yazmaq olmaz — `minFare = 3` kompilyasiya xətası verir.

## Untyped sabitlər {#untyped}

`minFare` və `perKm`-in tipi yazılmayıb — bunlar untyped sabitlərdir. Belə sabit istifadə olunduğu yerin tipinə uyğunlaşır: `km` `float64` olduğu üçün `minFare` də `float64` kimi hesablanır. `minFare` `int` tipli dəyişən olsaydı, onu `float64` ilə toplamaq olmazdı.

## Sabit ifadələr {#expr}

Sabitdən yeni sabit qurmaq olar: gecə tarifi gündüzdən 1.5 dəfə bahadır. Bu hesablama proqram işə düşməzdən əvvəl, kompilyasiya zamanı aparılır.

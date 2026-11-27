Generics funksiyanı bir dəfə yazıb müxtəlif tiplərlə işlətmək üsuludur: tip də parametr kimi verilir. Nəticə də elə həmin konkret tipdə qayıdır, interface-dəki kimi ümumi tipdə yox. Bu dərsdə ağıllı evin sensorlarını emal edirik. Temperatur `float64`, rütubət `int`, qapı hadisələri `string`, hərəkət isə `bool` tipindədir.

## Problem: eyni kod, fərqli tip {#problem}

`maxFloat` temperaturların ən yüksəyini tapır. Rütubət üçün də eyni iş lazımdır, amma `maxFloat(humidity)` kompilyasiya olunmur: `humidity` `[]int`-dir, funksiya isə yalnız `[]float64` qəbul edir. Generics olmasaydı, `maxInt` adlı ikinci funksiya yazmalı olardıq: eyni gövdə, yalnız tip fərqli. Hər yeni tip üçün daha bir surət.

## Generic funksiya {#generic}

`Max[T cmp.Ordered]` eyni gövdəni bir dəfə yazır, konkret tipi isə `T` adlı type parameter ilə əvəz edir. `cmp.Ordered` constraint-dir (məhdudiyyət): `T` yalnız `<` və `>` ilə müqayisə oluna bilən tip ola bilər, yəni ədədlər və sətirlər. O, standart `cmp` package-indən gəlir. Çağırışda tipi yazmırıq, Go onu arqumentdən çıxarır: `Max(temps)`-də `T` `float64`, `Max(humidity)`-də `int` olur. İndi `maxFloat`-a ehtiyac qalmır.

> **Bilgi:** `cmp.Ordered`-in içində tiplər `~float64` kimi yazılıb: `~` `float64` üzərində qurulan öz tiplərimizi, məsələn `type Celsius float64`-ü də qəbul edir.

## comparable {#comparable}

`Count` yalnız `==` istifadə edir, ona görə ona daha yumşaq constraint kifayətdir: `comparable`. `bool` `==` ilə müqayisə olunur, amma sıralanmır. Ona görə `Count(motion, true)` işləyir, `Max(motion)` isə kompilyasiya olunmur. Constraint funksiyanın tipdən həqiqətən nə istədiyini deyir, artıq heç nə.

## Generic tip {#type}

Struct da type parameter ala bilər. `Log[T any]` istənilən tipli ölçmələri saxlayır, `any` isə `T`-dən heç nə tələb etmir. Metodlarda receiver `*Log[T]` kimi yazılır. Generic tipdən istifadə edəndə tip arqumenti mütləqdir: `var readings Log[float64]`. Jurnal boş olanda `Latest` `T`-nin zero value-sunu qaytarmalıdır. `T`-nin hansı tip olacağını bilmədiyimiz üçün onu `var zero T` ilə alırıq: `float64` üçün bu, `0`-dır.

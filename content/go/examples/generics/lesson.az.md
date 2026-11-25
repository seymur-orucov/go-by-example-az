Generics eyni funksiyanı və ya tipi bir neçə tip üçün bir dəfə yazmağa imkan verir. Cavabları saymaq sətirlər üçün də, ədədlər üçün də eyni işdir; generics olmadan bu funksiyanı hər tip üçün ayrıca yazmalı olardıq. Tip burada parametr kimi verilir: çağırış zamanı onun yerinə konkret tip, məsələn `string` və ya `int` qoyulur. Interface-dən fərqi odur ki, nəticə də həmin konkret tipdə qayıdır və onu geri çevirmək lazım olmur.

Bu dərsdə otel qonaqlarının sorğusunu emal edirik: cavabları sayırıq, ulduz qiymətlərini 1 ilə 5 arasında saxlayırıq və təkliflərin qısa siyahısını tuturuq.

## Generic funksiya {#func}

`[K comparable]` funksiyanın type parameter-idir: `K` hələ bilinməyən tipin yerini tutur. `comparable` isə constraint-dir (məhdudiyyət): `K`-nın `==` ilə müqayisə oluna bilməsini tələb edir, çünki map açarı belə olmalıdır. Çağırışda tipi yazmırıq, Go onu arqumentdən çıxarır: birinci çağırışda `K` `string`, ikincidə `int` olur. `fmt` map-i açarlara görə sıralayıb çap edir, ona görə nəticə həmişə eyni görünür.

## Constraint {#constraint}

`Clamp` dəyəri `lo` ilə `hi` arasında saxlayır: səhvən verilən 7 ulduz 5-ə, -2 isə 1-ə çevrilir. `<` və `>` hər tipdə işləmir, ona görə constraint `cmp.Ordered`-dir: standart `cmp` package-indən, sıralana bilən bütün ədəd və sətir tipləri. Üç arqument eyni `T` tipində olmalıdır; `Clamp(4.5, 1, 5)`-də tipsiz sabitlərə baxıb Go `T` üçün `float64` seçir.

`cmp.Ordered` daxilində tiplər `~int` kimi yazılıb: `~` `int` üzərində qurulmuş tipləri də, məsələn `Stars`-ı qəbul edir. Ona görə `Clamp(Stars(9), 1, 5)` də işləyir.

## Generic tip {#type}

Tip də type parameter ala bilər. `Shortlist[T any]` ən çox `Max` element saxlayan siyahıdır; `any` `T`-dən heç nə tələb etmir. Metodda receiver `*Shortlist[T]` kimi yazılır. Generic tipdən istifadə edəndə tip arqumenti yazılmalıdır: `Shortlist[string]{Max: 2}`. Üçüncü təklifə artıq yer qalmır və `Add` `false` qaytarır.

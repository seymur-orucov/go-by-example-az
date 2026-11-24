Dəyişən — dəyəri saxlayan adlı yerdir, üstündə ad yazılmış qutu kimi: ad dəyişmir, içindəkini isə dəyişmək olar. Eyni dəyəri hər yerdə təkrar yazmaq əvəzinə onu bir dəfə dəyişənə yazırıq və sonra adı ilə istifadə edirik.

Go-da hər dəyişənin tipi var; o, elan olunanda müəyyən olur və sonradan dəyişmir. Bu dərsdə bir tələbənin imtahan nəticələrini saxlayırıq.

## var ilə elan {#var}

`var` açar sözü dəyişən elan edir: `var student = "Aysel"`. Tip yazılmayıb — Go onu dəyərdən özü təyin edir: `"Aysel"` mətndir, deməli `student` `string`-dir.

## Tipi göstərmək {#typed}

Tipi açıq yazmaq da olar: `var history, physics int = 80, 90` iki dəyişəni bir sətirdə elan edir, hər ikisi `int`-dir və dəyərlər sıra ilə verilir. Tipi o zaman yazırıq ki, Go-nun seçimi bizə uyğun deyil — məsələn, `80` üçün Go `int` seçir, `float64` lazımdırsa onu özümüz göstəririk.

## Zero value {#zero}

Dəyər verilməyən dəyişən boş qalmır, tipinin zero value-sunu alır: `int` üçün `0`, `bool` üçün `false`, `string` üçün boş mətn `""`. Beləcə elan olunan dəyişən həmişə məlum dəyərdən başlayır.

## Qısa yazılış := {#short}

Funksiyanın içində `average := ...` yazmaq `var average = ...` ilə eynidir, amma daha qısadır. Dəyəri sonradan `=` ilə dəyişmək olar (`history = 100`), tipini isə yox. Diqqət edin: `average` yenilənmədi, çünki hesablama elan anındakı dəyərlərlə aparılıb və nəticə ayrıca saxlanıb.

> **Bilgi:** `:=` yalnız funksiyaların içində işləyir. Elan olunub istifadə olunmayan dəyişən isə kompilyasiya xətasıdır.

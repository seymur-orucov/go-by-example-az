Dəyişən — dəyəri saxlayan adlı yerdir. Go-da hər dəyişənin tipi var və bu tip sonradan dəyişmir.

## var ilə elan {#var}

`var` açar sözü dəyişən elan edir. Tip yazılmayanda Go onu dəyərdən özü təyin edir: `"salam"` → `string`.

## Tipi göstərmək {#typed}

Tipi açıq yazmaq da olar. Bir sətirdə bir neçə dəyişən elan etmək mümkündür: `var b, c int = 1, 2`.

## Sıfır dəyər {#zero}

Dəyər verilməyən dəyişən boş qalmır — tipinin sıfır dəyərini alır: `int` üçün `0`, `bool` üçün `false`, `string` üçün boş mətn `""`.

## Qısa yazılış := {#short}

Funksiyanın içində `g := "alma"` yazmaq `var g = "alma"` ilə eynidir. Sonra dəyəri `=` ilə dəyişmək olar, amma tipi yox: `g`-yə ədəd yazmaq olmaz.

> **Bilgi:** `:=` yalnız funksiyaların içində işləyir. Elan olunub istifadə olunmayan dəyişən isə kompilyasiya xətası verir.

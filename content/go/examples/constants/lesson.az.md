Sabit — proqram işləyərkən dəyəri dəyişməyən addır. `const` açar sözü ilə elan olunur.

## const ilə elan {#declare}

Sabit funksiyadan kənarda (paket səviyyəsində) də, funksiyanın içində də elan oluna bilər. Onun dəyəri kompilyasiya zamanı məlum olmalıdır.

## İstifadə {#use}

Sabit adi dəyişən kimi oxunur. Amma `s = "yeni"` yazsaq, proqram kompilyasiya olunmaz — sabiti dəyişmək olmaz.

## Tipsiz sabitlər {#untyped}

`n` və `d`-nin tipi yazılmayıb. Belə sabitlər dəqiq hesablanır və tipini istifadə olunduğu yerdə alır. `3e20` — 3 × 10²⁰ deməkdir; `d` kəsr ədəd kimi `6e+11` çap olunur.

## Tipə çevirmə {#convert}

`int64(d)` sabiti tam ədədə çevirir. `math.Sin` `float64` gözləyir, ona görə `n` orada avtomatik `float64` olur.

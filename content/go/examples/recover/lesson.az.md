Panic adətən proqramı dayandırır. `recover` isə onu yarı yolda tutmağa imkan verir: panic dayanır və proqram işləməyə davam edir. Bu, bir hissənin səhvi bütün proqramı dayandırmamalı olan yerlərdə lazımdır: veb-server bir sorğuda panic etsə, digər istifadəçilərə xidmət etməyə davam etməlidir. `recover` `defer` ilə birlikdə işləyir, çünki panic zamanı yalnız defer olunan kod icra olunur.

Bu dərsdə foto çap edən kiosk yazırıq: səhv sifariş bütün kiosku dayandırmamalıdır.

## Panic və defer {#unwind}

`feedPaper` tanımadığı ölçünü görəndə panic edir. Panic funksiyanı dərhal dayandırır, amma onun defer-ləri yenə işləyir: kağız qabı (`paper tray`) bağlanır. Sonra panic çağırana keçir, onun da defer-ləri işləyir və bu, yuxarıya doğru davam edir. Panic-i heç kim tutmasa, o, `main`-ə çatıb proqramı bitirir.

## recover {#recover}

`printPhoto`-nun defer-i function literal-dır və içində `recover()` çağırır. Panic yoxdursa, `recover` `nil` qaytarır və heç nə etmir. Panic varsa, onu dayandırır və `panic`-ə verilmiş dəyəri qaytarır, burada `"unknown size poster"` mətnini. `printPhoto` normal bitir, `main` növbəti sifarişə keçir və kiosk işləməyə davam edir.

> **Diqqət:** `recover` yalnız birbaşa defer olunan funksiyanın içində işləyir. Onu adi kodda və ya defer funksiyasının çağırdığı başqa funksiyada yazsanız, `nil` qaytaracaq və panic davam edəcək.

## Panic-i xətaya çevirmək {#to-error}

`pick` adlı nəticələrdən istifadə edir: `photo` və `err`. Defer `return`-dan sonra işlədiyi üçün `err`-i dəyişə bilir və çağıran adi xəta alır. `album[5]` Go-nun öz panic-idir, `recover` onun dəyərini də qaytarır: `runtime error: index out of range [5] with length 3`. `%v` bu dəyəri mətnə çevirib qoyur. Beləcə panic funksiyanın içində qalır, çöldəki kod isə tanış `if err != nil` yoxlaması ilə işləyir.

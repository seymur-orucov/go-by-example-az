URL (veb ünvan) bir sətirdə bir neçə hissəni saxlayır: protokol, istifadəçi, server, port, yol, sorğu parametrləri və fraqment. Onu `strings.Split` ilə özünüz bölməyə çalışsanız, `:`, `@`, `?`, `#` işarələrində və kodlaşdırılmış simvollarda tez səhv edərsiniz. `net/url` package-i URL-i standarta uyğun hissələrə ayırır və əksinə, hissələrdən düzgün URL yığır.

Bu dərsdə otel axtarışı saytının sınaq (staging) serverinə gələn linki təhlil edirik, sonra isə istifadəçinin filtrlərindən yeni axtarış linki qururuq.

## URL-i hissələrə ayırmaq {#parse}

`url.Parse` sətri `*url.URL` struct-ına çevirir və xəta qaytarır, məsələn, `%` işarəsindən sonra iki hex rəqəm gəlməyəndə. `Scheme` protokoldur (`https`), `Host` isə server adını portla birlikdə saxlayır. Onları ayrıca almaq üçün `Hostname()` və `Port()` metodları var; URL-də port yazılmayıbsa, `Port()` `443` yox, boş sətir qaytarır.

> **Diqqət:** `url.Parse` çox güzəştlidir: `"stayfinder.example/search"` kimi protokolsuz sətir xətasız oxunur, amma bütün mətn `Path`-a düşür, `Host` isə boş qalır.

## İstifadəçi məlumatı {#user}

`tester:s3cret@` hissəsi `u.User`-ə düşür, onun tipi `*url.Userinfo`-dur. `Username()` adı qaytarır, `Password()` isə iki nəticə: parolu və parolun URL-də olub-olmadığını göstərən `bool`. Proqram parolu çap etmir, yalnız onun varlığını yoxlayır. Linki loga yazmaq lazım olanda `Redacted()` parolu `xxxxx` ilə əvəz edir.

URL-də istifadəçi hissəsi yoxdursa, `u.User` `nil` olur; onun metodları `nil` üzərində də işləyir və boş sətir qaytarır.

## Yol, sorğu və fraqment {#path}

`Path` serverdə hansı səhifənin istəndiyini göstərir: `/search/baku`. `?`-dən sonrakı hissə `RawQuery`-də olduğu kimi, xam mətn şəklində qalır. `#`-dən sonrakı `Fragment` isə səhifənin içində bir yerdir, burada xəritə bölməsi; brauzer onu serverə göndərmir, ona görə server tərəfində gələn sorğuda fraqment olmur.

## Sorğu parametrləri {#query}

`u.Query()` `RawQuery`-ni `url.Values` tipinə çevirir. `url.Values` əslində `map[string][]string`-dir: bir açarın bir neçə dəyəri ola bilər, çünki `room=double&room=single` kimi təkrar adi haldır. `Get` açarın ilk dəyərini qaytarır, bütün dəyərlər isə `params["room"]` ilə alınır. Olmayan açar üçün `Get` boş sətir qaytarır, açarın ümumiyyətlə olub-olmadığını isə `Has` deyir.

`Query()` kodlaşdırılmış dəyərləri açır: `New+York` `New York` olur. Dəyərlər həmişə string-dir: gecələrin sayı ilə hesablamaq üçün onu əvvəlki dərsdəki `strconv.Atoi` ilə ədədə çevirmək lazımdır.

## URL qurmaq {#build}

Linki string-ləri `+` ilə yapışdıraraq qurmaq risklidir: dəyərdə boşluq, `&` və ya `=` olsa, link xarab olur. `url.Values{}` boş parametrlər yığını yaradır; `Set` açarın dəyərini əvəz edir, `Add` isə yeni dəyər əlavə edir. `Encode` hər şeyi kodlaşdırır (boşluq `+` olur) və açarları əlifba sırası ilə düzür, ona görə nəticə həmişə eynidir.

Tək dəyəri kodlaşdırmaq üçün `url.QueryEscape` var: `&` `%26`-ya çevrilir və artıq parametrləri bir-birindən ayırmır.

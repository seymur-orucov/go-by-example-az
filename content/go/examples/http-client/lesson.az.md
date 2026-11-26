HTTP brauzerlərin, mobil tətbiqlərin və servislərin bir-biri ilə danışdığı protokoldur. Müştəri (client) sorğu göndərir: metod (`GET`, `POST`), ünvan (URL) və header-lər, yəni sorğu haqqında əlavə məlumat. Server cavab qaytarır: status kodu (`200`, `404`), header-lər və gövdə (body). Go-da müştəri tərəfi `net/http` paketindədir və əlavə kitabxana tələb etmir.

Bu dərsdə hava proqnozu servisinə müraciət edən müştəri yazırıq. Dərs internetsiz işləsin deyə servisi proqramın özündə qaldırırıq: `httptest.NewServer` bu kompüterdə sınaq serveri işə salır və ünvanını `srv.URL`-də verir. `weather` funksiyası həmin servisin özüdür, onu növbəti dərsdə, server yazanda ətraflı açacağıq.

## GET sorğusu {#get}

`http.Get` sorğunu göndərir və `*http.Response` ilə `error` qaytarır. `resp.Status` status kodunu mətnlə birlikdə verir: `401 Unauthorized`. Diqqət edin, `err` `nil`-dir: server cavab verdisə, sorğu uğurlu sayılır, cavabın "pis" olması xəta deyil. `err` yalnız cavab heç alınmayanda gəlir: server əlçatmazdır, ünvan səhvdir, şəbəkə kəsilib.

`resp.Body` şəbəkə bağlantısına bağlı axındır, onu işimiz bitəndə bağlamaq lazımdır. Ona görə `defer resp.Body.Close()` xətanı yoxladıqdan dərhal sonra yazılır: `err` olanda `resp` `nil`-dir və `Close` panic edərdi.

## Header əlavə etmək {#header}

Servis açarsız sorğunu qəbul etmir. Header əlavə etmək üçün sorğunu `http.NewRequest` ilə özümüz qururuq: metod, URL və gövdə (`GET`-də gövdə yoxdur, `nil`). `req.Header.Set` header yazır, `http.DefaultClient.Do` isə sorğunu göndərir; `http.Get` də içəridə məhz bunu edir. Gövdəni `io.ReadAll` sona qədər oxuyub `[]byte` kimi qaytarır.

## Status kodunu yoxlamaq {#status}

Eyni sorğunu başqa şəhər üçün təkrarlayırıq: `req.URL.RawQuery` ünvanın `?`-dən sonrakı hissəsidir. Servis `404` qaytarır, `err` yenə `nil` olur. Ona görə cavabın uğurlu olduğunu `resp.StatusCode` ilə özümüz yoxlayırıq; `http.StatusOK` `200`-ün adlı sabitidir. Gövdədə adətən xətanın izahı olur, onu istifadəçiyə göstərmək faydalıdır.

> **Diqqət:** Yalnız `err`-i yoxlayıb gövdəni oxumaq tipik səhvdir: `404` və ya `500` cavabının gövdəsi gözlədiyiniz verilən deyil, xəta mətnidir.

## Timeout {#timeout}

`http.DefaultClient`-in vaxt limiti yoxdur: server cavab verməsə, proqram sonsuza qədər gözləyə bilər. `http.Client{Timeout: ...}` öz müştərimizi yaradır: sorğu bağlantıdan gövdənin oxunmasına qədər bu müddətə sığmasa, `err` qaytarılır. `/slow` 800 ms susur, limit isə 100 ms-dir, ona görə sorğu xəta ilə bitir. `os.IsTimeout` xətanın məhz vaxt limitindən yarandığını deyir.

> **Bilgi:** Bir `http.Client` yaradıb bütün proqramda təkrar istifadə edin: o, bağlantıları yadda saxlayır və eyni serverə növbəti sorğular daha tez gedir.

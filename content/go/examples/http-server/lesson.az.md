Əvvəlki dərsdə sorğu göndərən müştəri yazdıq, indi isə sorğuları qəbul edib cavab verən tərəfi, yəni serveri yazırıq. Server bir portda (kompüterdəki şəbəkə "qapısı", məsələn `8080`) gözləyir və hər gələn sorğunu URL-ə görə uyğun funksiyaya ötürür. Go-nun `net/http` paketi elə hazır serverdir ki, real saytlar ona heç bir framework əlavə etmədən işləyir.

Bu dərsdə kafenin kiçik API-sini yazırıq: menyunu və içkinin qiymətini qaytarır. Server də, onu yoxlayan sorğular da eyni proqramdadır, ona görə dərs internetsiz işləyir.

## Handler {#handler}

Handler bir sorğuya cavab verən funksiyadır: `func(w http.ResponseWriter, r *http.Request)`. `r` gələn sorğudur (metod, URL, header-lər, gövdə), `w` isə cavabı yazdığımız yerdir. `w` `fmt.Fprintln`-ə fayl kimi verilə bilir: nə yazsaq, cavabın gövdəsinə gedir. Status kodu yazmasaq, Go `200 OK` göndərir.

## Status və header {#status}

`r.PathValue("item")` URL-in dəyişən hissəsini qaytarır: `/price/latte` üçün `"latte"`. İçki tapılmayanda `http.Error` cavaba `404` status kodunu və xəta mətnini yazır; ondan sonra `return` lazımdır, yoxsa funksiya davam edib gövdəyə başqa mətn də əlavə edər. `w.Header().Set` cavaba header qoyur, məsələn məzmunun tipini.

> **Diqqət:** Header-lər və status kodu gövdədən əvvəl gedir. Gövdəyə ilk bayt yazılandan sonra `w.Header().Set` və `w.WriteHeader` heç nəyi dəyişmir.

## Marşrutlar {#routes}

`http.NewServeMux` marşrutlaşdırıcıdır (router): sorğunun metoduna və yoluna baxıb uyğun handler-i seçir. `"GET /menu"` yalnız `GET` sorğusunu qəbul edir, `{item}` isə yolun dəyişən hissəsidir və `PathValue` ilə oxunur. Yol uyğun gəlməsə, mux özü `404` qaytarır; yol uyğun, metod səhv olsa, `405 Method Not Allowed`.

## Serveri işə salmaq {#serve}

`http.Server` serverin özüdür, `Handler` sahəsi sorğuları mux-a ötürür. Real proqramda adətən `http.ListenAndServe(":8080", mux)` yazılır: bu, `8080` portunu açır və proqram dayanana qədər sorğu qəbul edir. Biz eyni işi iki addımda görürük: `net.Listen` `127.0.0.1:0` ilə istənilən boş portu açır, `srv.Serve(ln)` isə sorğu qəbul etməyə başlayır. `Serve` server dayanana qədər qayıtmır, ona görə onu goroutine-də işlədirik, sonra isə əvvəlki dərsin müştərisi ilə sorğular göndəririk.

Çıxışda hər üç cavab növü görünür: handler-in `200`-ü, `http.Error`-un `404`-ü və mux-un özünün `405` və `404` cavabları.

## Dayandırmaq {#shutdown}

`srv.Shutdown` yeni sorğu qəbulunu dayandırır və işlənən sorğuların bitməsini gözləyir, yəni müştərini yarımçıq cavabla qoymur. Arqumenti `context`-dir, gözləmə üçün vaxt limiti vermək olar; növbəti dərsdə onu öyrənəcəyik, burada limitsiz `context.Background()` veririk. Bundan sonra `Serve` `http.ErrServerClosed` qaytarır: bu xəta deyil, normal dayanma siqnalıdır.

> **Bilgi:** `ListenAndServe` istifadə edəndə də onun xətasını yoxlayın: port artıq məşğuldursa, dərhal xəta qaytarır və proqram səssizcə bitə bilər.

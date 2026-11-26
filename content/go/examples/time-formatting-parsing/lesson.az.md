Vaxt insana mətn kimi göstərilir və proqrama da çox vaxt mətn kimi gəlir: məktubdakı "18.06.2026 15:30", API-dəki `2026-06-18T15:30:00Z`, formadakı tarix sahəsi. `Format` metodu `time.Time`-ı istənilən şəkildə mətnə çevirir, `time.Parse` isə əksini edir: mətni oxuyub `time.Time` qaytarır. Bir çox dildə format `YYYY-MM-DD` kimi xüsusi hərflərlə yazılır, Go isə formatı nümunə tarixlə göstərməyi istəyir.

Bu dərsdə vebinar dəvəti hazırlayırıq: vebinar 18 iyunda 15:30 UTC-də başlayır, dəvət bir neçə formatda və iki şəhərin saatı ilə göstərilir, qeydiyyat sistemindən gələn tarixlər isə yoxlanılır.

## Nümunə tarix {#layout}

Go-da format (layout) bir konkret anın, `Mon Jan 2 15:04:05 MST 2006`-nın necə görünməli olduğunu yazmaqdır. Bu tarixin hissələri ardıcıl rəqəmlərdir: ay 1, gün 2, saat 3 (24 saatlıq yazılışda 15), dəqiqə 4, saniyə 5, il 6, zona −7. `Format` layout-da `2006`-nı görəndə yerinə il, `01`-i görəndə ay, `15:04`-ü görəndə saat və dəqiqə qoyur; nöqtə, vergül və boşluq olduğu kimi qalır. `Monday` və `January` günün və ayın tam adını, `Mon` və `Jan` isə qısa adını verir.

> **Diqqət:** Go yalnız nümunə tarixin rəqəmlərini tanıyır: `"YYYY-MM-DD"` olduğu kimi çap olunur, `"2006-02-01"` isə gün ilə ayın yerini dəyişir.

## Hazır layout-lar {#predefined}

Tez-tez lazım olan layout-lar `time` package-ində sabit kimi var. `time.RFC3339` API-lərin və JSON-un standart formatıdır; UTC-də zona fərqi yerinə `Z` yazılır. `time.DateOnly` yalnız tarixi, `time.DateTime` tarix və saatı, `time.Kitchen` isə 12 saatlıq saatı `AM`/`PM` ilə verir. Layout-u əl ilə yazmaq əvəzinə sabit işlətmək bir rəqəmi səhv yazmaq riskini aradan qaldırır.

## Saat qurşağı {#zone}

Vebinar Bakıda axşam 19:30-da, Nyu-Yorkda səhər 11:30-da başlayır, amma bu eyni andır. `time.FixedZone(ad, saniyə)` UTC-dən sabit fərqi olan zona yaradır: `4*60*60` dörd saatdır. `In` anı dəyişmir, yalnız onu başqa zonada göstərir. Layout-da `-07:00` zonanın UTC-dən fərqini, `3` 12 saatlıq saatı, `PM` isə `AM` və ya `PM` yazır.

> **Bilgi:** `FixedZone` yay vaxtını bilmir: Nyu-York yayda UTC−4, qışda UTC−5-dir. Real proqramda `time.LoadLocation("America/New_York")` işlədilir, amma o, kompüterdəki saat qurşağı bazasından asılıdır, ona görə dərsdə sabit zona götürürük.

## Mətni oxumaq {#parse}

`time.Parse(layout, mətn)` mətni layout-a uyğun oxuyur və `time.Time` ilə `error` qaytarır. Qeydiyyat sistemi vaxtı Bakı saatı ilə RFC3339-da göndərib: `.UTC()` göstərir ki, bu, vebinarın başlama anıdır, `Equal` də `true` verir. Mətndə zona yoxdursa, `Parse` vaxtı UTC sayır. `time.Date`-dən fərqli olaraq `Parse` 31 iyun kimi olmayan tarixi düzəltmir, xəta qaytarır; mətn layout-a uymayanda da xəta gəlir. İstifadəçidən gələn tarixi oxuyanda xətanı mütləq yoxlayın.

> **Diqqət:** Oxunmuş vaxtı birbaşa çap etməyin: mətndəki zona fərqi kompüterin yerli zonasına uyğun gəlsə, `Parse` yerli zonanı götürür və çıxış kompüterdən asılı olur. Əvvəlcə `.UTC()` və ya `In` ilə zonanı seçin.

Unix vaxtı anı tək bir ədədlə ifadə edir: 1 yanvar 1970, 00:00:00 UTC-dən keçən saniyələrin sayı. Bu başlanğıc nöqtəsinə epoch deyilir. Verilənlər bazası, log faylları və API-lər vaxtı çox vaxt belə saxlayır: ədəd az yer tutur, onu müqayisə etmək və çıxmaq asandır, saat qurşağından və tarix formatından asılı deyil. Eyni an Bakıda da, Nyu-Yorkda da eyni ədəddir. Əvvəlki dərsdəki `time.Time` isə insan üçün rahatdır: ayı, günü, həftənin gününü verir.

Bu dərsdə avtomobil dayanacağı yazırıq: giriş və çıxış vaxtı Unix vaxtı kimi qeyd olunur, sistem bu ədədlərdən dayanma müddətini və ödənişi hesablayır.

## Time-dan ədədə {#unix}

`Unix()` anı `int64` tipli saniyə sayına çevirir və bu ədəd biletə yazılır. `UnixMilli()` eyni anı millisaniyə ilə verir: JavaScript və bir çox JSON API vaxtı belə göndərir. Ona görə ədədin hansı vahiddə olduğunu həmişə bilmək lazımdır, 1000 dəfə fərq bir tarixi 1970-ci ilə və ya uzaq gələcəyə atar.

> **Bilgi:** Daha dəqiq vahidlər üçün `UnixMicro()` və `UnixNano()` da var.

## Ədəddən time-a {#from-unix}

Çıxış qapısı vaxtı ədəd kimi qeyd edir. `time.Unix(saniyə, nanosaniyə)` onu yenidən `time.Time`-a çevirir; ikinci arqument saniyənin kəsr hissəsidir, burada lazım deyil. `time.Unix` anı kompüterin öz saat qurşağında (`Local`) qaytarır: eyni ədəd Bakıdakı kompüterdə 00:35, Londondakında 21:35 kimi çap olunardı. `.UTC()` anı UTC-də göstərir və nəticə hər kompüterdə eyni olur.

> **Diqqət:** `time.Unix` `int64` gözləyir: `int` dəyişənini ötürmək kompilyasiya xətasıdır, `int64(sec)` yazmaq lazımdır.

## Ədədlərlə hesablama {#arithmetic}

İki Unix vaxtının fərqi adi çıxmadır və nəticə saniyədir. Onu oxunaqlı göstərmək üçün `time.Duration`-a çevirib `time.Second`-a vururuq, çünki Duration nanosaniyə sayır. Ödəniş hər başlanmış saat üçün 2 dollardır: tam ədədlərin bölməsi kəsri atır, ona görə əvvəlcə `3599` əlavə edib yuxarı yuvarlaqlaşdırırıq və 2 saat 15 dəqiqə 3 saat sayılır. Unix vaxtlarını `<` ilə də müqayisə etmək olar: kiçik ədəd əvvəlki andır.

> **Diqqət:** `time.Duration(seconds)` təkbaşına 8100 nanosaniyədir (`8.1µs`), saniyə yox.

## Epoch və boş vaxt {#zero}

`time.Unix(0, 0)` epoch-un özüdür, ondan əvvəlki anlar mənfi ədəd olur. `time.Time`-ın zero value-su isə epoch deyil, 1-ci ilin 1 yanvarıdır və onun Unix vaxtı böyük mənfi ədəddir. Sürücü hələ ödəməyibsə, `paidAt` boş qalır: bunu `Unix() == 0` ilə yox, `IsZero()` ilə yoxlamaq lazımdır. Boş vaxtı bazaya Unix vaxtı kimi yazsanız, orada `-62135596800` görəcəksiniz.

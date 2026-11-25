Pointer (göstərici) dəyərin özünü yox, onun yaddaşdakı ünvanını saxlayır. Bunu üzərində ev ünvanı yazılmış kağıza bənzətmək olar: kağızı kimə versən, o, eyni evə gedib orada nəyisə dəyişə bilər. Adi dəyişəni başqa dəyişənə yazanda və ya funksiyaya verəndə Go onun surətini çıxarır. Pointer isə surət yox, eyni dəyişənə aparan yoldur.

Bu dərsdə avtomobil dayanacağındakı boş yerləri sayırıq: maşın girəndə say azalır və bu dəyişiklik proqramın hər yerində görünməlidir.

## Ünvan və dəyər {#address}

`&free` `free` dəyişəninin ünvanını verir. `p`-nin tipi `*int`-dir, yəni "`int`-ə pointer". `*p` həmin ünvandakı dəyəri oxuyur. `*p = 11` yeni dəyişən yaratmır, `free`-nin özünü dəyişir, ona görə `free` də `11` göstərir.

## Funksiyaya pointer ötürmək {#param}

Funksiyalar dərsindən bilirik ki, parametr arqumentin surətidir. `main`-dən sonra yazılmış `parkCopy` öz surətini azaldır, `free` isə `11` olaraq qalır. `park` isə `*int` qəbul edir: ona `&free` veririk və `*spots--` ünvandakı dəyəri, yəni `free`-nin özünü azaldır. Funksiya çağıranın dəyişənini dəyişməlidirsə, ona pointer ötürülür.

## nil pointer {#nil}

Pointer-in zero value-su `nil`-dir: o, heç bir dəyişəni göstərmir. `vip` hələ heç bir ünvan almayıb, ona görə `<nil>` çap olunur və `vip == nil` `true` verir.

> **Diqqət:** `nil` pointer-in dəyərini oxumaq (`*vip`) proqramı panic ilə, yəni qəza ilə dayandırır. Pointer `nil` ola bilərsə, əvvəlcə `vip != nil` yoxlayın.

## new ilə yer ayırmaq {#new}

`new(int)` yeni, adsız `int` dəyişəni yaradır, onu zero value (`0`) ilə doldurur və ünvanını qaytarır. Artıq `vip` `nil` deyil: ona yazmaq və onu `park`-a ötürmək olar. `vip` özü pointer olduğu üçün `&` yazmırıq.

> **Bilgi:** Funksiyadan lokal dəyişənin ünvanını qaytarmaq da təhlükəsizdir: `return &spots`. Go dəyişəni ona pointer qaldıqca saxlayır.

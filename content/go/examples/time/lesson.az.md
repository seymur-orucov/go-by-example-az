Qatar cədvəlində iki cür məlumat var: an (qatar 14 martda saat 08:45-də yola düşür) və müddət (yol 2 saat 35 dəqiqə çəkir). `time` package-i bunlar üçün iki tip verir: `time.Time` konkret anı, yəni tarixi, saatı və saat qurşağını saxlayır, `time.Duration` isə iki an arasındakı müddəti. Vaxtı `"08:45"` kimi string-də saxlasaq, yol müddətini əlavə etmək və ya iki vaxtı müqayisə etmək üçün mətni özümüz parçalamalı olardıq.

Konkurentlik bölməsindəki `time.Now()` hər işə salmada fərqli dəyər verir, ona görə bu dərsdə sabit tarixlərlə işləyirik.

## Tarix yaratmaq {#date}

`time.Date` ili, ayı, günü, saatı, dəqiqəni, saniyəni, nanosaniyəni və saat qurşağını (location, qısaca zona) alıb bir an qaytarır. Ay `time.Month` tipindədir və `time.March` kimi sabitlə yazılır; `time.UTC` isə bütün dünya üçün ortaq olan UTC saatıdır. `Println` anı tarix, saat və zona ilə birlikdə çap edir. `Year`, `Month`, `Day`, `Weekday` metodları anın hissələrini ayrıca qaytarır: həftənin gününü özümüz hesablamırıq, `Weekday` 14 martın şənbə olduğunu özü tapır.

> **Bilgi:** `time.Date` həddən çıxan dəyərləri xəta saymır, düzəldir: 30 fevral 2 mart olur.

## Müddət {#duration}

`time.Duration` nanosaniyələrin sayını saxlayan tam ədəddir (`int64` üzərində qurulub). Onu `time.Hour`, `time.Minute`, `time.Second`, `time.Millisecond` sabitlərindən toplayırıq: `2*time.Hour + 35*time.Minute`. `Println` müddəti `2h35m0s` kimi oxunaqlı çap edir, `Minutes()` və `Hours()` isə onu lazım olan vahiddə `float64` kimi qaytarır.

> **Diqqət:** `int` dəyişənini Duration-a vurmaq olmaz: `n * time.Minute` kompilyasiya olunmur, `time.Duration(n) * time.Minute` yazmaq lazımdır. `2*time.Hour`-da isə `2` tipsiz sabitdir və özü Duration olur.

## Vaxt əlavə etmək və çıxmaq {#add-sub}

`departs.Add(journey)` yola düşmə anına müddəti əlavə edib çatma anını qaytarır: 08:45 + 2 saat 35 dəqiqə = 11:20. Mənfi müddət anı geri çəkir. `Sub` əksini edir: iki anın fərqini `Duration` kimi verir. Qatar 11:32-də çatıb, deməli 12 dəqiqə gecikib. `Add` `departs`-ı dəyişmir, yeni `time.Time` qaytarır.

## Gün və ay əlavə etmək {#add-date}

Həftəlik qatar növbəti dəfə 7 gün sonra gedir. `AddDate(il, ay, gün)` təqvim vahidləri ilə hesablayır: nəticə yenə şənbə, saat da yenə 08:45-dir. Bunu `Add(7 * 24 * time.Hour)` ilə də yazmaq olardı, amma yay vaxtına keçən zonalarda bir gün həmişə 24 saat deyil, `AddDate` isə saatı yerində saxlayır.

> **Diqqət:** Ay əlavə edəndə ayın günü yeni ayda yoxdursa, artıq günlər növbəti aya keçir: 31 yanvar + 1 ay 2026-da 3 mart olur.

## Müqayisə {#compare}

Sərnişin platformaya 08:47-də çatıb. `a.Before(b)` `a` `b`-dən əvvəl olanda `true` qaytarır. `After` sonra olanda, `Equal` isə eyni an olanda `true` verir. Sərnişin qatara çatmayıb, `Sub` isə nə qədər gecikdiyini göstərir. Qatar da cədvəldəki vaxtda çatmayıb, ona görə `Equal` `false`-dur.

> **Diqqət:** `time.Time`-ı `==` ilə müqayisə etməyin: `==` saat qurşağını da müqayisə edir və eyni an fərqli zonada yazılanda `false` verir. `Equal` yalnız anın özünə baxır.

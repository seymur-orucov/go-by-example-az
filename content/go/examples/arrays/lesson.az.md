Array — eyni tipli elementlərin sabit ölçülü siyahısıdır: həftənin 7 günü, ilin 12 ayı, şahmat taxtasının 8 sırası. Ölçü tipin bir hissəsidir: `[7]int` "7 ədəd `int`" deməkdir və proqram işləyərkən bu ölçü dəyişmir.

Bu dərsdə bir həftəlik hava məlumatını array-də saxlayırıq. Praktikada Go kodunda array-dən çox növbəti dərsin mövzusu olan slice istifadə olunur, amma slice array-in üzərində qurulub, ona görə əvvəl array-i tanımaq lazımdır.

## Elan və zero value {#zero}

`var rain [7]int` 7 elementlik array yaradır. Dəyər verməsək, hər element zero value alır — `int` üçün `0`. `len(rain)` elementlərin sayını qaytarır və array üçün o, həmişə tipdəki ölçüyə bərabərdir.

## Literal və indeks {#literal}

Elementlər əvvəlcədən məlumdursa, array literal ilə yazırıq: `[7]int{12, 14, ...}`. Elementə indekslə müraciət edirik, saymaq 0-dan başlayır: `temps[2]` üçüncü gündür, yəni çərşənbə. Eyni yolla dəyəri dəyişirik: bazar gününün temperaturunu 18-ə dəyişdik.

> **Bilgi:** ölçünü əllə saymaq istəmirsinizsə, `[...]int{12, 14, 11}` yazın — kompilyator elementləri sayıb ölçünü özü qoyur (burada 3).

## Dövrlə gəzinti {#loop}

Array-in bütün elementlərini yoxlamaq üçün indeksi 0-dan `len(temps)`-ə qədər artıran adi `for` dövründən istifadə edirik. Birinci günü "ən isti" qəbul edib qalan günləri onunla müqayisə edirik.

> **Diqqət:** ən böyük indeks `len(temps) - 1`-dir. `temps[7]` yazsaq, kompilyator xəta verir, çünki ölçü əvvəlcədən məlumdur.

## Kopyalama və müqayisə {#copy}

`forecast := temps` array-in tam nüsxəsini yaradır: 7 dəyərin hamısı köçürülür. Ona görə `forecast[0]`-ı dəyişəndə `temps` olduğu kimi qalır. Eyni tipli array-ləri `==` ilə müqayisə etmək olar: bütün elementlər bərabərdirsə, nəticə `true`-dur. Növbəti dərsdə görəcəyik ki, slice-da bu fərqli işləyir.

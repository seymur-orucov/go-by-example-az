Sıralama elementləri müəyyən qaydaya düzməkdir: ədədləri kiçikdən böyüyə, adları əlifba ilə. Sıralanmış siyahıda ən kiçik və ən böyük dəyər kənarlarda durur, axtarış isə xeyli sürətlənir. Go-da bunun üçün standart `slices` package-i var: onun generic funksiyaları istənilən tipli slice ilə işləyir.

İterator-lar dərsində `slices.Sorted` iterator-dan yeni, sıralanmış slice yığırdı. Bu dərsdəki `slices.Sort` isə artıq mövcud olan slice-ı sıralayır. Nümunə marafondur: qaçışçıların nömrələrini, finiş vaxtlarını və adlarını sıralayırıq.

## Ədədləri sıralamaq {#numbers}

`slices.Sort` slice-ı yerində (in place) sıralayır: yeni slice yaratmır və heç nə qaytarmır, `bibs`-in öz elementlərinin yerini dəyişir. Funksiya `cmp.Ordered` constraint-i ilə yazılıb, ona görə eyni çağırış `int`, `float64` və `string` üçün işləyir. Finiş vaxtları dəqiqə ilə `float64`-dür: sıralanandan sonra ən yaxşı nəticə `minutes[0]`-da, ən zəifi sonuncu elementdədir.

> **Bilgi:** Köhnə kodda `sort` package-inin `sort.Ints` və `sort.Strings` funksiyalarına rast gələcəksiniz. Onlar da işləyir, amma yeni kodda `slices.Sort` tövsiyə olunur.

## Sətirləri sıralamaq {#strings}

Sətirlər bayt-bayt, yəni hərflərin kodlarına görə müqayisə olunur. Bütün böyük latın hərflərinin kodu kiçik hərflərdən kiçikdir: `Z` 90-dır, `e` isə 101. Ona görə qeydiyyatda adını kiçik hərflə yazan `eva` siyahının sonuna düşür. ASCII-dən kənar hərflər (`ü`, `ə`) isə bütün latın hərflərindən sonra gəlir.

> **Diqqət:** Bu, lüğətdəki əlifba sırası deyil, kod sırasıdır. Böyük-kiçik hərfə baxmadan sıralamaq üçün müqayisəni özünüz yazmalısınız: bunu növbəti dərsdəki `slices.SortFunc` edir.

## Orijinalı saxlamaq {#clone}

Finiş sırası özü nəticədir: ilk üç ad podiumdur. Sertifikatları əlifba ilə çap etmək üçün `finish`-i sıralasaq, bu sıra itər. `names := finish` yazmaq da kömək etməz: slice-lar dərsində gördük ki, belə mənimsətmə elementləri kopyalamır və iki dəyişən eyni elementlərə baxır.

`slices.Clone` elementlərin ayrıca kopyasını yaradır, ona görə `names`-i sıralamaq `finish`-ə toxunmur. `slices.IsSorted` slice-ın artıq sıralı olub-olmadığını yoxlayır və heç nəyi dəyişmir.

## İkili axtarış {#search}

Sıralanmış slice-da elementi tapmaq üçün onu əvvəldən sona gəzmək lazım deyil. `slices.BinarySearch` ortadakı elementə baxır: axtarılan ondan kiçikdirsə, sol yarıda, böyükdürsə, sağ yarıda davam edir, lüğətdə söz axtaran kimi. Hər addımda yoxlanacaq hissə yarıya düşür, ona görə milyon elementdə 20-yə yaxın müqayisə kifayət edir.

Funksiya iki nəticə qaytarır: indeks və elementin tapılıb-tapılmadığı. Element yoxdursa, indeks onun sıranı pozmadan yerləşəcəyi yeri göstərir: `100` `96` ilə `318` arasına, yəni 2-ci indeksə düşərdi.

> **Diqqət:** `BinarySearch` yalnız sıralanmış slice-da düzgün işləyir. Sırasız slice-da mövcud elementi də "tapılmadı" deyə bilər.

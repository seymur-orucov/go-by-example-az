Go-da funksiya bir yox, bir neçə nəticə qaytara bilər. Hesabı bölmək həm hər adamın payını, həm də bölünməyən qalığı verir. Kartla ödəniş həm yeni balansı, həm də ödənişin keçib-keçmədiyini bildirir.

Bu dərsdə restoranda hesabı hesablayırıq: dostlar arasında bölmək, kartla ödəmək və vergi əlavə etmək.

## İki nəticə {#two}

Nəticələr çox olanda onların tipləri mötərizədə yazılır: `(int, int)`. `return` də elanda neçə tip varsa, vergüllə o qədər dəyər qaytarır. `bill / people` hər adamın payıdır, `bill % people` isə bölünməyən qalıqdır. Çağıran tərəf hər nəticəyə bir dəyişən ayırır: `each, left := split(50, 3)`.

Nəticələri dəyişənlərə yazanda hər nəticəyə bir dəyişən lazımdır. `x := split(50, 3)` kompilyasiya xətasıdır: funksiya iki dəyər qaytarır, solda isə bir dəyişən var.

> **Bilgi:** Çoxlu nəticəni birbaşa başqa funksiyaya da ötürmək olar: `fmt.Println(split(50, 3))` `16 2` çap edir.

## Dəyər və bool {#ok}

`pay` balansı və ödənişin uğurlu olub-olmadığını qaytarır. Pul çatmayanda balans dəyişmir, ikinci nəticə isə `false` olur. Bu, map-dəki "comma ok" yazılışının eynisidir. `ok` ödənişin alınıb-alınmadığını deyir, birinci dəyər isə nəticənin özüdür.

İkinci çağırışda `=` yazdıq, `:=` yox. `balance` və `ok` artıq elan olunub, `:=` isə solda ən azı bir yeni dəyişən tələb edir.

## Adlı nəticələr {#named}

Nəticələrə ad vermək olar: `(tax, total int)`. Belə nəticələr funksiyanın başında zero value ilə yaranan adi dəyişənlərdir. Biz onlara dəyər yazırıq, sonra boş `return` onların cari dəyərini qaytarır. Adlar həm də izah verir: elandan hansı nəticənin vergi, hansının yekun məbləğ olduğu görünür.

> **Diqqət:** Uzun funksiyada boş `return` hansı dəyərlərin qayıtdığını gizlədir. Onu qısa funksiyalarda yazın, uzun funksiyada isə `return tax, total` yazın.

## Lazımsız nəticə: alt xətt {#blank}

Növbəti masada yalnız hər adamın payı lazımdır, qalıq yox. İstifadə olunmayan dəyişən Go-da xətadır, ona görə qalığın yerinə `_` yazırıq, `range` dərsində indeksi atdığımız kimi.

Go-da ən çox rast gələcəyiniz cüt `(nəticə, error)` olacaq: funksiya həm işin nəticəsini, həm də xətanı qaytarır. Bunu "Xətalar" bölməsində görəcəyik.

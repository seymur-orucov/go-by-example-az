Slice — eyni tipli elementlərin siyahısıdır və ölçüsü lazım olduqca böyüyür, bazar səbəti kimi. Əvvəlki dərsdəki array-dən fərqi budur: array-in ölçüsü tipin hissəsidir və dəyişmir, slice isə böyüyə bilər. Ona görə Go-da siyahılarla işləyəndə demək olar ki, həmişə slice istifadə olunur.

## Boş slice {#nil}

`[]string` — string-lərdən ibarət slice. Dəyər verilməyibsə, slice `nil`-dir: içində element yoxdur, `len` 0-dır. Səbət hələ boşdur. Məhsullar koddakı kimi ingiliscədir: `bread` (çörək), `cheese` (pendir), `tea` (çay), `flatbread` (lavaş), `butter` (yağ).

## append {#append}

`append` sona element əlavə edir və yeni slice qaytarır, ona görə nəticəni yenə `cart`-a yazırıq. `len` elementlərin sayıdır, `cap` isə ayrılmış yerin həcmidir.

> **Diqqət:** nəticəni saxlamadan yalnız `append(cart, "tea")` yazsaq, kompilyasiya xətası alırıq.

## İndeks {#index}

Elementə indekslə müraciət edirik: `cart[0]` — birinci element, çünki saymaq 0-dan başlayır. Eyni yolla dəyəri dəyişirik: `"bread"`-i `"flatbread"` ilə əvəz etdik.

## make {#make}

`make([]int, 3)` 3 elementlik slice yaradır və onu zero value ilə doldurur — `int` üçün `0`. Elementlər əvvəlcədən məlumdursa, slice literal ilə birbaşa yazmaq da olar: `[]int{1, 2, 3}`.

## Slice-dan slice {#sub}

`cart[:2]` ilk iki elementi götürür: başlanğıc daxildir, son (`2`) daxil deyil. Yeni slice eyni elementlərə baxır, kopya yaratmır — ona görə `first[1]`-i dəyişəndə `cart` da dəyişdi.

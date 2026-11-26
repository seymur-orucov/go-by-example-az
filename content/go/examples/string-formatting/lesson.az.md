`fmt.Println` dəyərləri boşluqla ayırıb öz bildiyi kimi çap edir. Qəbz, cədvəl və ya log sətri üçün isə daha çox nəzarət lazımdır: kəsrdən sonra neçə rəqəm, sütun nə enlikdə, mətn dırnaqda olsun, ya yox. `fmt.Printf` bunun üçündür: birinci arqument format sətridir, onun içindəki `%` ilə başlayan işarələr (verb) növbəti arqumentlərlə sıra ilə əvəz olunur.

Bu dərsdə boya mağazasının sifariş vərəqini çap edirik: boyanın adı, litri, rəng kodu və anbarda olub-olmaması.

## Ümumi verb-lər {#general}

`%v` dəyəri standart formada çap edir, `Println` də məhz bunu edir. `%+v` struct-ın sahə adlarını da göstərir, `%#v` dəyəri Go kodunda yazıldığı kimi verir: tip adı və dırnaqlı string ilə. `%T` isə dəyərin özünü yox, tipini çap edir. `Printf` sətrin sonuna özü keçid qoymur, ona görə hər format sətri `\n` ilə bitir.

> **Bilgi:** Struct-ın içində nə olduğunu tez görmək lazım olanda (debug zamanı) `%+v` ən rahat seçimdir.

## Ədəd, mətn, bool {#basic}

Hər tipin öz verb-i var: `%d` tam ədəd, `%s` string, `%t` bool, `%f` kəsr ədəd. `%.2f` kəsrdən sonra düz iki rəqəm saxlayır: `2.5` `2.50` kimi çap olunur. `%q` string-i dırnaq içində çap edir, ona görə `note`-un sonundakı gizli boşluq görünür; istifadəçinin yazdığı mətni log-a çıxaranda bu çox kömək edir.

## Sprintf və 16-lıq say sistemi {#hex}

`fmt.Sprintf` `Printf` kimi işləyir, amma nəticəni çap etmir, string kimi qaytarır. Burada onunla navy rənginin veb kodunu qururuq: `%x` ədədi 16-lıq say sistemində (hex) yazır, `128` `80` olur. Sadə `%x` sıfırı bir rəqəmlə yazır və kod `#0080` kimi qırılır. `%02x` isə hər ədədi iki simvola qədər sıfırla doldurur: `#000080`, 7 simvol.

> **Diqqət:** `%p` pointer-in ünvanını hex ilə çap edir (`0xc000012345` kimi). Ünvan hər işə salmada dəyişir, ona görə onu nəticəsi müqayisə olunan çıxışa qoymayın.

## Enlik və düzləndirmə {#table}

Verb-dən əvvəlki ədəd enlikdir: `%8s` mətni 8 simvolluq sahəyə yazır və sağa düzləndirir, boş yer boşluqla dolur. `-` işarəsi sola düzləndirir: `%-10s`. Kəsr ədəddə enlik və dəqiqlik birlikdə yazılır: `%8.2f` 8 simvolluq sahə, kəsrdən sonra 2 rəqəm. Beləcə adlar fərqli uzunluqda olsa da, `|` sütunları alt-alta düşür.

## Fprintf və faiz işarəsi {#fprint}

`fmt.Fprintf` nəticəni birinci arqumentdə verilən yerə yazır. `os.Stdout` ekrandır, amma eyni çağırış fayla, şəbəkə bağlantısına və ya xətalar üçün ayrılmış `os.Stderr`-ə də yaza bilər. `%` format sətrində xüsusi işarə olduğu üçün faiz işarəsinin özünü çap etmək üçün `%%` yazılır.

> **Diqqət:** Verb arqumentin tipinə uyğun deyilsə və ya arqument çatmırsa, kod yenə kompilyasiya olunur, çap zamanı isə `%!d(string=ten)` və ya `%!s(MISSING)` kimi mətn çıxır. `go vet` belə səhvləri əvvəlcədən tapır.

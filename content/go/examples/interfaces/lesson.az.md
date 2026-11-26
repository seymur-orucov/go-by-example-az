Interface tipin nə bacardığını təsvir edir, necə qurulduğunu yox. O, sadəcə metodların siyahısıdır: bu metodları olan istənilən tip həmin interface-i ödəyir. Elektrik rozetkası kimi: ona istənilən cihazı qoşmaq olar, təki çəngəli uyğun gəlsin. Struct konkret dəyəri təsvir edir, interface isə "bunu bacaran istənilən dəyər" deməkdir və fərqli tipləri eyni kodla işlətməyə imkan verir.

Bu dərsdə internet mağazası üçün iki çatdırılma üsulu yazırıq: kuryer və bağlama terminalı (parcel locker).

## Interface və onu ödəyən tiplər {#define}

`Shipping` interface-i bir metod tələb edir: `Price(kg int) int`. `Courier` və `Locker` bu metodu yazıb, başqa heç nə etmir: Go-da `implements` sözü yoxdur, uyğunluğu kompilyator metodlara görə özü yoxlayır. `main`-də `var s Shipping` əvvəl `Courier`, sonra `Locker` saxlayır və `s.Price(3)` hər dəfə saxlanan tipin öz metodunu çağırır.

Interface dəyişəninə dəyər yazılanda onun surəti saxlanılır. Heç nə yazılmamış interface dəyişəni isə `nil`-dir.

> **Diqqət:** Metod pointer receiver ilə yazılıbsa (`func (c *Courier) Price...`), interface-i `Courier` yox, `*Courier` ödəyir və `var s Shipping = &Courier{PerKg: 2}` yazmaq lazımdır.

## Interface parametr kimi {#use}

`cheapest` hansı çatdırılma üsulları olduğunu bilmir, yalnız onların `Price` metodunu çağırır. `[]Shipping` slice-ı fərqli tipləri birlikdə saxlayır. Sabah yeni üsul, məsələn dron əlavə olunsa, `cheapest` dəyişmədən onunla da işləyəcək. 1 kq üçün kuryer (2 dollar), 5 kq üçün isə terminal (4 dollar) ucuzdur.

## Type switch {#switch}

Bəzən interface-in arxasında hansı konkret tipin olduğunu bilmək lazımdır. `switch v := s.(type)` bunu yoxlayır: `case Courier` budağında `v` artıq `Courier` tiplidir və onun `PerKg` sahəsini oxumaq olar. Tək bir tipi yoxlamaq üçün type assertion yazılır: `c, ok := s.(Courier)`. Map-dəki "comma ok" kimi, tip uyğun gəlməsə `ok` `false` olur. `ok`-suz yazılan `s.(Courier)` isə tip uyğun gəlməsə proqramı panic ilə dayandırır.

> **Bilgi:** Metodu olmayan `interface{}`-i hər tip ödəyir, ona görə o, istənilən dəyəri saxlaya bilər. Onun qısa adı `any`-dir; `fmt.Println` da arqumentlərini `any` kimi qəbul edir.

`errors.New` yalnız mətnli xəta yaradır. Bəzən isə çağırana mətndən çoxu lazımdır: hansı otaq, hansı saat, problemin əsl səbəbi nədir. `error` interface olduğu üçün `Error() string` metodu olan istənilən tip xəta ola bilər. Öz struct-ımızı xəta kimi qaytarıb lazımi sahələri onun içinə qoyuruq, çağıran isə onları oxuyub qərar verir.

Bu dərsdə ofisdə iclas otağı sifariş edən funksiya yazırıq: sifariş alınmayanda xəta otağı, saatı və səbəbi bildirir.

## Xəta tipi {#type}

`BookingError` adi struct-dır: otaq, saat və səbəb (`Err`). `Error` metodu onu `error` interface-inə uyğun edir. `fmt.Sprint` `fmt.Print` kimidir, amma mətni çap etmək əvəzinə qaytarır. Metod pointer receiver ilədir, ona görə aşağıdakı `book` funksiyası xətanı `&BookingError{...}` kimi qaytarır. `main`-də onu çap edəndə `fmt` bizim `Error` metodumuzu çağırır.

## Unwrap metodu {#unwrap}

`BookingError` öz içində başqa xəta saxlayır, `Unwrap` metodu isə onu çölə verir. `errors.Is` zənciri açanda məhz bu metodu çağırır. Ona görə `errors.Is(err, ErrBusy)` `true` qaytarır, baxmayaraq ki, `book` `ErrBusy`-ni birbaşa yox, `BookingError`-un içində qaytarıb. `Unwrap` olmasaydı, nəticə `false` olardı.

## errors.As {#as}

`errors.Is` müəyyən bir xəta dəyərini axtarır, `errors.As` isə müəyyən tipli xətanı. `be` `*BookingError` tipli dəyişəndir, ona `&be` ilə ünvanını veririk. `errors.As` zəncirdə bu tipdə xəta tapsa, onu `be`-yə yazır və `true` qaytarır. Xəta `fmt.Errorf` ilə bir dəfə də bükülsə belə, otağı və saatı yenə oxuya bilirik.

> **Diqqət:** Funksiyanın nəticə tipi `error` olsun, `*BookingError` yox. `nil` `*BookingError` `error`-a yazılanda interface `nil` olmur və `err != nil` `true` verir.

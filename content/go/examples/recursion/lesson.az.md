Rekursiya funksiyanın özünü çağırmasıdır. Hər çağırış eyni məsələnin daha kiçik halını həll edir, ən kiçik halın cavabı isə birbaşa bilinir. Düz sıra ilə gedən işlər üçün `for` dövrü kifayətdir. Rekursiya isə ağac kimi verilənlər üçün uyğundur: komanda strukturu, qovluqlar.

## Base case {#base}

`goDown` mərtəbəni çap edir və özünü bir aşağı mərtəbə ilə çağırır. `floor == 0` şərti base case-dir, yəni rekursiyanın dayandığı hal. Burada funksiya özünü çağırmır və `return` ilə bitir.

Hər çağırış `floor`-un öz surətini alır və içində etdiyi çağırış bitənə qədər gözləyir. Go gözləyən çağırışları call stack adlanan yaddaş sahəsində saxlayır. `fmt.Println("floor", floor)` sətrini `goDown(floor - 1)`-dən sonra yazsaq, çap sırası tərsinə dönər. Onda hər çağırış öz mərtəbəsini içindəki çağırış bitəndən sonra çap edir və çıxış `ground floor`, `floor 1`, `floor 2`, `floor 3` olur.

> **Diqqət:** Base case olmasa və ya çağırış ona yaxınlaşmasa (məsələn, `floor + 1`), funksiya özünü dayanmadan çağırar, call stack dolar və proqram `stack overflow` xətası ilə dayanar.

## Nəticə qaytaran rekursiya {#result}

`reports` map-i hər rəhbərin birbaşa tabeliyində olanları saxlayır: açar rəhbərin adıdır, dəyər isə adlardan ibarət slice-dır. Map `main`-dən kənarda elan olunub, ona görə bütün funksiyalar onu görür.

`headcount` rəhbərin tabeliyində neçə nəfər olduğunu sayır. Hər birbaşa işçi üçün `1` əlavə edir, sonra həmin işçinin öz tabeliyindəkilərini də eyni funksiya ilə sayır. Ben-in komandası `3` nəfərdir, Cara-nınkı `1`, ona görə Ava üçün `(1 + 3) + (1 + 1) = 6` alınır.

Burada base case ayrıca `if` ilə yazılmayıb. Gia map-də açar deyil, ona görə `reports["Gia"]` `nil` slice qaytarır. Dövr bir dəfə də işləmir və funksiya `0` qaytarır.

## Ağacı çap etmək {#tree}

`printChart` adı çap edir, sonra hər tabeliyində olan üçün özünü bir pillə dərində, `level+1` ilə çağırır. `strings.Repeat("  ", level)` iki boşluğu `level` dəfə təkrarlayır, buna görə hər pillə əvvəlkindən içəridə çap olunur. Funksiya Ben-in bütün komandasını çap edib qurtarandan sonra Cara-ya keçir.

Eyni işi `for` dövrləri ilə yazmaq çətin olardı, çünki ağacın neçə pillə dərin olduğunu əvvəlcədən bilmirik. Rekursiya isə istənilən dərinlikdə eyni üç sətirlə işləyir.

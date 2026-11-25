Rekursiya funksiyanın özünü çağırmasıdır. Məsələ eyni məsələnin daha kiçik bir hissəsinə bölünür, ən kiçik hissənin cavabı isə birbaşa bilinir. İç-içə qutuları açmaq buna yaxşı nümunədir: qutunu açırsan, içində yenə qutu var, onu da eyni qayda ilə açırsan, boş qutuya çatanda dayanırsan. Düz sıra ilə gedən işlər üçün `for` dövrü kifayətdir. Rekursiya isə ağac kimi şaxələnən verilənlərdə özünü göstərir: komanda strukturu, qovluqlar, iç-içə menyular.

Bu dərsdə kiçik şirkətin ofisindəyik. `reports` map-i hər rəhbərin birbaşa tabeliyində olanları saxlayır: açar rəhbərin adıdır, dəyər isə adlardan ibarət slice-dır. Map `main`-dən kənarda elan olunub, ona görə bütün funksiyalar onu görür.

## Base case {#base}

`goDown` lift kimi mərtəbə-mərtəbə aşağı enir: mərtəbəni çap edir, sonra özünü bir aşağı mərtəbə ilə çağırır. `floor == 0` şərti base case-dir, yəni rekursiyanın dayandığı hal: burada funksiya artıq özünü çağırmır, `return` ilə bitir.

Hər çağırış `floor`-un öz surətini alır və cavabı bitənə qədər gözləyir. Go gözləyən çağırışları call stack adlanan yaddaş sahəsində saxlayır.

> **Diqqət:** Base case olmasa və ya çağırış ona yaxınlaşmasa (məsələn, `floor + 1`), funksiya özünü dayanmadan çağırar, call stack dolar və proqram `stack overflow` xətası ilə dayanar.

## Nəticə qaytaran rekursiya {#result}

`headcount` rəhbərin tabeliyində neçə nəfər olduğunu sayır. Hər birbaşa işçi üçün `1` əlavə edir, sonra həmin işçinin öz tabeliyindəkilərini də eyni funksiya ilə sayır. Ben-in komandası `3` nəfərdir, Cara-nınkı `1`, ona görə Ava üçün `(1 + 3) + (1 + 1) = 6` alınır.

Burada base case ayrıca `if` ilə yazılmayıb. Tabeliyində heç kim olmayan adam üçün `reports[boss]` boş slice qaytarır, dövr bir dəfə də işləmir və funksiya `0` qaytarır.

## Ağacı çap etmək {#tree}

`printChart` adı çap edir, sonra hər tabeliyində olanı bir pillə dərinə, `level+1` ilə çağırır. `strings.Repeat("  ", level)` iki boşluğu `level` dəfə təkrarlayır, buna görə hər pillə əvvəlkindən içəridə çap olunur. Funksiya Ben-in bütün komandasını çap edib qurtarandan sonra Cara-ya keçir.

Eyni işi `for` dövrləri ilə yazmaq çətin olardı, çünki ağacın neçə pillə dərin olduğunu əvvəlcədən bilmirik. Rekursiya isə istənilən dərinlikdə eyni üç sətirlə işləyir.

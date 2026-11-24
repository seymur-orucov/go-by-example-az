Dövr eyni işi bir neçə dəfə təkrar etməyə imkan verir: hər ay hesaba pul qoymaq, siyahıdakı hər məhsulun qiymətini çap etmək. Eyni sətri əlimizlə on iki dəfə yazmaq əvəzinə kodu bir dəfə yazırıq, dövr isə onu lazım olan qədər təkrarlayır.

Go-da dövr üçün yalnız bir açar söz var — `for`. Digər dillərdəki `while` və `do-while` yoxdur: onların işini də `for` görür. Bu dərsdə hər ay hesaba pul qoyan adamın yığımını izləyirik.

## Üç hissəli dövr {#classic}

`for month := 1; month <= 3; month++` üç hissədən ibarətdir, onları nöqtəli vergül ayırır: başlanğıc (`month := 1`, dövr başlayanda bir dəfə işləyir), şərt (`month <= 3`, hər təkrardan əvvəl yoxlanır) və addım (`month++`, hər təkrardan sonra işləyir və `month`-u 1 artırır). Şərt yalan olan kimi dövr bitir. `month` yalnız dövrün içində görünür.

## Yalnız şərtlə {#condition}

Başlanğıc və addım lazım deyilsə, yalnız şərti yazmaq olar: `for balance < 500` şərt doğru olduğu müddətdə təkrarlanır. Təkrar sayı əvvəlcədən məlum deyil: balans 500 USD-ə çatana qədər hər dəfə 120 USD əlavə edirik, bunun üçün 5 ay lazım olur. Başqa dillərdəki `while` məhz budur.

> **Diqqət:** dövrün içində şərti dəyişdirən kod olmalıdır (burada `balance += 120`). Əks halda şərt heç vaxt yalan olmaz və dövr sonsuz işləyər.

## Sonsuz dövr və break {#forever}

Şərt yazılmasa, `for { ... }` sonsuz təkrarlanır və onu `break` dayandırır. Burada hər təkrarda 200 USD xərcləyirik (balans əvvəlki addımdakı 600 USD-dən başlayır) və qalıq 200-dən az olanda dövrdən çıxırıq. Şərti yoxlayan `if` "əgər" deməkdir, ona növbəti dərsdə ətraflı baxacağıq. `break` dövrü dərhal bitirir, dövrün qalan kodu işləmir.

## continue {#skip}

`continue` cari təkrarın qalanını keçir və dövr növbəti təkrardan davam edir. 3-cü ayda maaş gecikib, ona görə həmin ay ödəniş çap olunmur, digər aylar isə normal keçir. Fərq belədir: `break` dövrü tamam bitirir, `continue` yalnız bir təkrarı atlayır.

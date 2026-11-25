Funksiya bir işi görən, adı olan kod parçasıdır: bilet qiymətini hesablamaq, sifarişin cəmini tapmaq, bileti çap etmək. Onu bir dəfə yazırıq, sonra lazım olan yerdə adı ilə çağırırıq. Belə olanda eyni hesablama kodda təkrarlanmır, `main` də qısa və oxunaqlı qalır. Əslində funksiyalarla artıq tanışsınız: `main`-in özü funksiyadır, `fmt.Println`, `len`, `append` də funksiyadır.

Bu dərsdə kinoteatrın kassasını yazırıq: biletin qiyməti yaşa görə dəyişir, böyük və uşaq biletlərinin qiyməti sabitlərdə saxlanır.

## Funksiya elan etmək {#declare}

`func ticketPrice(age int) int` belə oxunur: funksiyanın adı `ticketPrice`-dır, `int` tipli `age` parametrini qəbul edir və `int` nəticə qaytarır. `return` nəticəni geri verir və funksiyanı dərhal bitirir. Ona görə `age < 12` olanda ikinci `return`-ə növbə çatmır.

Çağıranda mötərizədə dəyər, yəni arqument veririk: `ticketPrice(8)`. Bu çağırışda `age` `8` olur. Funksiyalar `main`-dən kənarda, faylın yuxarı səviyyəsində elan olunur, fayldakı sıraları isə önəmli deyil.

> **Diqqət:** Nəticə qaytaran funksiya hər yolda `return` ilə bitməlidir. Sonuncu `return`-ü silsək, kompilyator `missing return` xətası verəcək.

## Bir neçə parametr {#params}

Parametrlər vergüllə ayrılır və hər birinin tipi olur. Ardıcıl parametrlərin tipi eynidirsə, onu bir dəfə yazmaq kifayətdir: `adults, kids int`, `adults int, kids int` ilə eyni mənanı verir. Arqumentlər parametrlərlə eyni sırada verilir: `orderTotal(2, 3)` 2 böyük və 3 uşaq bileti deməkdir.

## Nəticəsiz funksiya {#no-result}

`printTicket`-in nəticə tipi yoxdur: o heç nə qaytarmır, sadəcə bir iş görür, bu halda bileti çap edir. Belə funksiyanın çağırışını dəyişənə yazmaq olmaz. Burada `printTicket` qiyməti özü hesablamır, `ticketPrice`-ı çağırır: funksiyalar bir-birini çağıra bilər, qiymət qaydası isə bir yerdə qalır.

## Parametr — surətdir {#copy}

Funksiya arqumentin surətini alır. `discount` öz `price` parametrini `2` azaldır, amma `main`-dəki `price` `10` olaraq qalır, çünki bunlar ayrı dəyişənlərdir. Funksiya dəyəri dəyişib çağırana çatdırmaq istəyirsə, onu `return` ilə qaytarmalıdır, çağıran da nəticəni dəyişənə yazmalıdır: `newPrice := discount(price)`.

> **Bilgi:** Slice-ın surəti də eyni elementlərə baxır (slice-dan slice yaradanda gördüyümüz kimi). Ona görə funksiya ona ötürülmüş slice-ın elementini dəyişsə, bu dəyişiklik çağırana da görünür.

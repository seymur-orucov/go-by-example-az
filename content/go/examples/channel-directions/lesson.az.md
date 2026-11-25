Adi channel iki tərəflidir: ona həm göndərmək, həm də ondan qəbul etmək olur. Amma çox vaxt bir funksiya channel-ı yalnız bir istiqamətdə işlətməlidir: dəyəri hazırlayan yalnız göndərir, onu istifadə edən yalnız qəbul edir. Go-da istiqaməti channel-ın tipinə yazmaq olur: `chan<- T` yalnız göndərmək, `<-chan T` yalnız qəbul etmək üçündür. Səhv istiqamətdə istifadə kompilyasiya xətasıdır, yəni səhv proqram işə düşməzdən əvvəl tutulur, funksiyanın imzası isə channel-ın burada hansı rolu oynadığını dərhal göstərir.

Bu dərsdə şirə doldurma xətti yazırıq: doldurma, etiketləmə və qablaşdırma mərhələləri bir-birinə channel-larla bağlıdır.

## Yalnız göndərmək {#send-only}

`fill` şüşələri doldurur və `filled` channel-ına göndərir. Parametrin tipi `chan<- string`-dir: ox `chan` sözünə tərəf yönəlib, yəni dəyər channel-a daxil olur. `fill` içində `<-filled` yazsaq, kod kompilyasiya olunmaz və xəta `cannot receive from send-only channel` olar. Doldurma maşını hazır şüşəni geri götürmür, kompilyator da buna icazə vermir.

> **Bilgi:** Yazılışı yadda saxlamaq asandır: ox həmişə dəyərin hərəkət istiqamətini göstərir. `chan<-` dəyər channel-a girir, `<-chan` dəyər channel-dan çıxır.

## Yalnız qəbul etmək {#receive-only}

`label` iki channel alır. `filled` `<-chan string` tiplidir: ox channel-dan çıxır, ondan yalnız qəbul etmək olar. `labeled` isə yenə `chan<- string`-dir. Etiketləmə mərhələsi `n` dəfə (`for range n`) şüşəni bir channel-dan götürür, etiket vurur və o birinə ötürür. Ortadakı mərhələ xəttdə məhz belə görünür: bir channel-dan oxuyur, digərinə yazır. Burada `filled <- bottle` yazsaq, `cannot send to receive-only channel` xətası alarıq.

## İki tərəfli channel-ın çevrilməsi {#convert}

`main`-də `filled` və `labeled` adi, iki tərəfli `chan string`-dir. Onları `chan<- string` və ya `<-chan string` parametrinə verəndə Go onları özü çevirir, əlavə heç nə yazmaq lazım deyil. Əks istiqamətdə çevirmə yoxdur: tək istiqamətli channel-ı yenidən iki tərəfli etmək olmaz.

`main` özü qablaşdırma mərhələsidir: `labeled`-dən üç şüşə qəbul edib çap edir. Hər mərhələ şüşələri gəldiyi sıra ilə bir-bir ötürür, ona görə çıxışda sıra həmişə eynidir: apple, cherry, mango.

> **Diqqət:** İstiqamət channel-ın özünü dəyişmir, yalnız həmin dəyişən və ya parametr vasitəsilə nə etmək olduğunu məhdudlaşdırır. `fill` yalnız göndərə bilir, amma eyni channel-dan `label` qəbul edir.

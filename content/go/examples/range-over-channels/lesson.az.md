Əvvəlki dərsdə bağlı channel-ı `v, ok` və `break` ilə tanıdıq. `for v := range ch` eyni işi qısa yazır: hər təkrarda channel-dan bir dəyər qəbul edir, channel bağlanıb boşalanda isə dövr özü bitir. Slice üzərində `range`-dən fərqi budur: slice-ın uzunluğu əvvəlcədən bəllidir, channel-a isə dəyərlər zamanla gəlir və neçə olacağını yalnız göndərən bilir.

Bu dərsdə hava stansiyası temperaturu ölçüb ekrana göndərir, ekran isə stansiya sönənə qədər ölçmələri göstərir.

## Göndərən bağlayır {#station}

`station` ölçmələri `readings` channel-ına göndərir və sonda onu bağlayır. Bu `close` ekran üçün "stansiya söndü" xəbəridir: onsuz ekran yeni ölçmənin gəlib-gəlməyəcəyini bilə bilməz.

> **Diqqət:** Stansiya `close`-u unutsaydı, ekrandakı dövr sonsuza qədər növbəti ölçməni gözləyərdi. Başqa işləyən goroutine qalmadığı üçün proqram `fatal error: all goroutines are asleep - deadlock!` xətası ilə dayanardı.

## range ilə oxumaq {#range}

`main` channel-ı yaradır və stansiyanı goroutine-də işə salır. `for t := range readings` hər təkrarda bir ölçmə qəbul edir; yeni dəyər hələ gəlməyibsə, dövr gözləyir. Channel bağlanıb boşalanda dövr bitir və proqram növbəti sətrə keçir. Ekran neçə ölçmə gələcəyini əvvəlcədən bilmir, onları sadəcə sayır.

Channel üzərində `range` yalnız bir dəyişən verir, çünki channel-da indeks yoxdur: `for i, t := range readings` kompilyasiya olunmur.

## Bağlı, amma boş olmayan channel {#drain}

Closing Channels dərsində gördük ki, bağlı channel-ın buffer-indəki dəyərlər itmir. `range` də `night`-dakı üç ölçməni göndərildikləri sıra ilə verir və yalnız channel boşalanda bitir.

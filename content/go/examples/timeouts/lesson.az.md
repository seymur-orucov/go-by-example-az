Channel-dan oxuyan goroutine dəyər gələnə qədər gözləyir, lazım gəlsə əbədi. Xarici xidmət (bank, başqa server) cavab verməyəndə bu, problemə çevrilir: alıcı ekranda sonsuz fırlanan ikon görür. Timeout gözləməyə vaxt limiti qoyur: cavab limitdən əvvəl gəlsə, onu işləyirik, gəlməsə, gözləməni dayandırıb başqa yol seçirik. Go-da bunun üçün ayrıca mexanizm lazım deyil: tanış `select` kifayətdir.

Bu dərsdə onlayn mağaza ödəniş şlüzünün (payment gateway) cavabını gözləyir, amma 300 ms-dən çox yox: limit keçəndə alıcıya yenidən cəhd etməyi təklif edir.

## Ödəniş şlüzü {#gateway}

`charge` bankın cavabını ayrıca goroutine-də gözləyir və nəticəni dərhal qaytardığı channel ilə verir. `bankDelay` bankın cavab müddətini təqlid edir: `time.Sleep` goroutine-i bu qədər saxlayır, `time.Duration` isə müddət tipidir. Nəticə tipi `<-chan string`-dir, çağıran channel-dan yalnız oxuya bilər.

Channel-ın 1 yerlik buffer-i var: mağaza cavabı artıq gözləməsə belə, goroutine onu buffer-ə qoyub bitir. Buffer-siz channel-da heç kim oxumadığı üçün o, göndərmədə əbədi ilişib qalardı.

## Vaxtında gələn cavab {#in-time}

`time.After(d)` channel qaytarır və `d` müddəti keçəndə ona bir dəyər (həmin anın vaxtını) göndərir. `select`-ə girəndə hər iki ifadə hesablanır: `charge` sorğunu başladır, `time.After` saymağa başlayır. Bank 50 ms-də cavab verir, 300 ms-lik limitdən əvvəl, ona görə birinci `case` işləyir. Timer-in göndərdiyi dəyər bizə lazım deyil, ona görə ikinci `case` dəyişənsiz yazılır: `case <-time.After(...)`.

> **Diqqət:** `time.After` dövrün içindəki `select`-də yazılanda hər təkrarda yeni timer yaranır və limit yenidən başlayır. Bütün iş üçün ümumi limit lazımdırsa, `deadline := time.After(...)` dövrdən əvvəl bir dəfə yaradılır.

## Limit keçəndə {#too-slow}

Bu dəfə bank 1000 ms-də cavab verir. 300 ms-də `time.After`-in channel-ı hazır olur, `select` ikinci `case`-i seçir və alıcıya yenidən cəhd etməsini deyirik. `time.Now()` cari anı, `time.Since(start)` isə ondan bəri keçən müddəti verir. Müddətin özünü çap etmirik, çünki o, hər işə salmada bir az fərqlidir; yalnız 600 ms-dən az olduğunu yoxlayırıq, yəni mağaza bankı 1000 ms gözləməyib.

## Gecikmiş cavab {#late}

Timeout gözləməni dayandırır, bankın işini yox: bank sorğunu yenə emal edir və 1000 ms-də cavab verir. Cavab buffer-də qalır, burada onu oxuyuruq və görürük ki, ödəniş əslində keçib. Alıcıya isə "yenidən cəhd edin" demişik, ona görə real mağaza belə gecikmiş ödənişi geri qaytarmalıdır (refund), yoxsa alıcı yenidən ödəyəndə pul iki dəfə tutulacaq. `<-pay` bankın cavabı gələnə qədər gözləyir.

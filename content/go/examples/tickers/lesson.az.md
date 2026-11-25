Ticker taymerin təkrarlanan formasıdır: bir dəfə yox, hər `d` müddətindən bir siqnal verir, metronom kimi. Fitness saatı məşq boyu nəbzi sabit aralıqla ölçür. Bunu `for` dövründə `time.Sleep` ilə də yazmaq olardı, amma onda hər ölçmənin özünə gedən vaxt aralığa əlavə olunur və ritm yavaş-yavaş sürüşür. Ticker isə siqnalları sabit vaxt nöqtələrində verir, channel ilə işlədiyi üçün də onu `select`-də "dayan" siqnalı ilə birlikdə gözləmək olur.

Bu dərsdə fitness saatının nəbz ölçməsini yazırıq: əvvəl isinmə zamanı üç ölçmə, sonra idmançı "bitir" düyməsini basana qədər davam edən məşq.

## Ticker yaratmaq {#new-ticker}

`time.NewTicker(d)` ticker yaradır və onun `C` channel-ına hər `d` müddətindən bir dəyər göndərir. `time.Millisecond` `time.Duration` (müddət) tipinin sabitidir, `100 * time.Millisecond` saniyənin onda biridir. Birinci siqnal dərhal yox, ilk `d` müddətindən sonra gəlir. `for range 3` üç siqnal gözləyir və hər birində növbəti nəbz ölçməsini çap edir.

> **Bilgi:** Siqnalı qəbul edən gecikərsə, ticker siqnalları növbəyə yığmır, artıq olanları atır. Ona görə yavaş işləyən dövr sonradan bir-birinin ardınca gələn bir dəstə köhnə siqnal almır.

## Ticker-i dayandırmaq {#stop}

Ticker özbaşına dayanmır: `Stop` çağırılmasa, saat batareyanı yeyərək ölçməyə davam edərdi. `warmUp.Stop()`-dan sonra `C`-yə yeni siqnal gəlmir. Bunu yoxlamaq üçün `select` timeouts dərsindəki `time.After` ilə 300 millisaniyə gözləyir: ticker işləsəydi, bu müddətdə üç siqnal gələrdi, amma heç biri gəlmir.

> **Diqqət:** `Stop` channel-ı bağlamır. Ona görə `for range warmUp.C` dövrü `Stop`-dan sonra bitmir, növbəti siqnalı əbədi gözləyir.

## Stop channel-ı ilə dayandırmaq {#stop-channel}

Əsl saatda ölçmə ayrıca goroutine-də gedir və neçə dəfə təkrarlanacağı əvvəlcədən bilinmir: məşq idmançı istəyəndə bitir. Goroutine dövrdə `select` ilə iki channel-ı gözləyir: siqnal gələndə nəbzi `readings` channel-ı ilə `main`-ə göndərir, `finish` bağlananda isə `readings`-i bağlayıb `return` ilə çıxır. `main` ölçmələri `range` ilə qəbul edib çap edir, üçüncüdən sonra isə idmançının "bitir" düyməsini təqlid edərək `finish`-i bağlayır.

`readings` bağlananda `range` dövrü bitir və `main` yekunu çap edir. `defer workout.Stop()` goroutine hansı yolla çıxsa da ticker-i dayandırır, yoxsa o, heç kimin oxumadığı siqnalları göndərməyə davam edərdi.

> **Diqqət:** Goroutine-də `return` əvəzinə `break` yazmaq olmaz: `select`-in içindəki `break` yalnız `select`-dən çıxır, `for` dövrü isə davam edir.

Ticker taymerin təkrarlanan formasıdır: bir dəfə yox, hər `d` müddətindən bir siqnal verir. Bunu `for` dövründə `time.Sleep` ilə də yazmaq olardı, amma onda hər ölçmənin özünə gedən vaxt aralığa əlavə olunur və ritm yavaş-yavaş sürüşür. Ticker isə siqnalları sabit vaxt nöqtələrində verir, channel ilə işlədiyi üçün də onu `select`-də "dayan" siqnalı ilə birlikdə gözləmək olur.

Bu dərsdə fitness saatının nəbz ölçməsini yazırıq: əvvəl isinmə zamanı üç ölçmə, sonra idmançı "bitir" düyməsini basana qədər davam edən məşq.

## Ticker yaratmaq {#new-ticker}

`time.NewTicker(d)` ticker yaradır və onun `C` channel-ına hər `d` müddətindən bir dəyər göndərir. `time.Millisecond` `time.Duration` (müddət) tipinin sabitidir, `100 * time.Millisecond` saniyənin onda biridir. Birinci siqnal dərhal yox, ilk `d` müddətindən sonra gəlir. Dövr üç nəbz qiymətini gəzir: hər addımda əvvəl siqnalı gözləyir, sonra növbəti qiyməti çap edir.

> **Bilgi:** Siqnalı qəbul edən gecikərsə, ticker siqnalları növbəyə yığmır, artıq olanları atır. Ona görə yavaş işləyən dövr sonradan bir-birinin ardınca gələn bir dəstə köhnə siqnal almır.

## Ticker-i dayandırmaq {#stop}

Ticker özbaşına dayanmır: `Stop` çağırılana qədər siqnal verir. `warmUp.Stop()`-dan sonra `C`-yə yeni siqnal gəlmir. Bunu yoxlamaq üçün `select` timeouts dərsindəki `time.After` ilə 300 millisaniyə gözləyir: ticker işləsəydi, ilk siqnal 100 millisaniyədə gələrdi və `extra reading` çap olunardı.

> **Diqqət:** `Stop` channel-ı bağlamır. Ona görə `for range warmUp.C` dövrü `Stop`-dan sonra bitmir, növbəti siqnalı əbədi gözləyir.

## Stop channel-ı ilə dayandırmaq {#stop-channel}

Bu dəfə ölçmə ayrıca goroutine-də gedir və neçə dəfə təkrarlanacağı əvvəlcədən bilinmir: dövr `finish` bağlanana qədər davam edir. Goroutine `select` ilə iki channel-ı gözləyir. Siqnal gələndə ölçmənin nömrəsini `readings` channel-ı ilə `main`-ə göndərir. `finish` bağlananda `readings`-i bağlayır və `return` ilə çıxır. `main` ölçmələri `range` ilə qəbul edib çap edir, üçüncüdən sonra isə `finish`-i bağlayır.

`readings` bağlananda `range` dövrü bitir və `main` yekunu çap edir. `defer workout.Stop()` goroutine hansı yolla çıxsa da ticker-i dayandırır. Go 1.23-dən bəri heç kimin istifadə etmədiyi ticker `Stop` olmadan da yaddaşdan təmizlənir, amma `Stop` siqnalların harada kəsildiyini kodda açıq göstərir. Köhnə Go versiyalarında isə `Stop`-suz ticker yaddaşda qalırdı.

> **Diqqət:** Goroutine-də `return` əvəzinə `break` yazmaq olmaz: `select`-in içindəki `break` yalnız `select`-dən çıxır, `for` dövrü isə davam edir.

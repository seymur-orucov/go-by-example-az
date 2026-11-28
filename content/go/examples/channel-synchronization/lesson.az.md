`main` işə saldığı goroutine-i gözləmir: `main` bitəndə proqram da bitir, yarımçıq qalan goroutine-lər isə səssizcə dayanır. Bəzi işlər isə mütləq başa çatmalıdır: mağaza kassası günün çeklərinin backup-ı (ehtiyat nüsxəsi) bitmədən bağlanmamalıdır. Bunun üçün channel-dan siqnal kimi istifadə edirik: goroutine işini bitirəndə channel-a xəbər göndərir, `main` isə həmin xəbəri qəbul edənə qədər gözləyir. Bir neçə goroutine-i gözləmək üçün Goroutines dərsindəki `sync.WaitGroup` daha rahatdır, onun təfərrüatı WaitGroups dərsindədir.

## Siqnal göndərmək {#signal}

`backup` çekləri bir-bir diskə yazır. Hər çekin yazılmasını `time.Sleep(60 * time.Millisecond)` təqlid edir, yəni hər çek 60 ms çəkir. İş bitəndə `backup` nəticəni çap edir və `done` channel-ına siqnal göndərir.

`struct{}` heç bir sahəsi olmayan boş struct tipidir, `struct{}{}` isə onun yeganə dəyəridir və yaddaşda yer tutmur. `chan struct{}` tipi oxucuya dərhal deyir: bu channel məlumat yox, yalnız "hazırdır" xəbərini daşıyır. `chan bool` da işləyərdi, amma onda `true` ilə `false`-un burada nə fərqi var sualı yaranır.

## Sleep ilə təxmin {#guess}

`main` `done` channel-ını yaradır və backup-ı goroutine-də işə salır. Sonra gözləməyin ilk ağla gələn yolunu sınayır: 50 ms yatır və backup-ın bu vaxtda bitəcəyinə ümid edir. Amma backup 4 × 60 = 240 ms çəkir, ona görə çıxışda `register:` sətri backup sətrindən **əvvəl** gəlir. `main` burada bitsəydi, proqram backup-ı yarıda kəsərdi və çeklər itərdi.

Rəqəmi böyütmək də çarə deyil: yavaş diskdə istənilən rəqəm yenə az ola bilər, sürətli diskdə isə kassa boş yerə gözləyər.

> **Diqqət:** `time.Sleep` gözləmə deyil, təxmindir. İşin bitdiyini yalnız işi görən goroutine özü xəbər verə bilər.

## Siqnalı gözləmək {#wait}

`<-done` channel-dan qəbul edir. Backup siqnal göndərənə qədər `<-done` `main`-i saxlayır. Backup son sətrini çap edir, siqnalı göndərir və yalnız bundan sonra `main` davam edib kassanı bağlayır. Gələn dəyəri heç bir dəyişənə yazmırıq: `<-done` burada yalnız gözləmək üçündür.

> **Bilgi:** Goroutine-in siqnaldan əvvəl gördüyü hər iş, o cümlədən dəyişənlərə yazdığı dəyərlər, `<-done`-dan sonra `main` üçün tam görünür. Channel həm də goroutine-lər arasında yaddaşı sinxronlaşdırır.

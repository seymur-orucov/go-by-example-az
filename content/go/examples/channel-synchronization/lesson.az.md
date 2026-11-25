`main` işə saldığı goroutine-i gözləmir: `main` bitəndə proqram da bitir, yarımçıq qalan goroutine-lər isə səssizcə dayanır. Bəzi işlər isə mütləq başa çatmalıdır, sonrakı addım ondan asılıdır: kassa günün satışları saxlanmadan bağlanmamalıdır. Bunun üçün channel-dan siqnal kimi istifadə edirik: goroutine işini bitirəndə channel-a xəbər göndərir, `main` isə həmin xəbəri qəbul edənə qədər gözləyir. Bir neçə goroutine-i gözləmək üçün `sync.WaitGroup` daha rahatdır, onu WaitGroups dərsində görəcəyik.

Bu dərsdə mağazanın gün sonunu yazırıq: kassa günün çeklərinin backup-ı (ehtiyat nüsxəsi) bitmədən bağlanmamalıdır.

## Siqnal göndərmək {#signal}

`backup` çekləri bir-bir diskə yazır. `time.Sleep(d)` goroutine-i `d` müddəti qədər dayandırır, `time.Millisecond` isə bir millisaniyədir: hər çekin yazılması 60 ms çəkir (`time` paketini Timers dərsində ətraflı görəcəyik). İş bitəndə `backup` nəticəni çap edir və `done` channel-ına siqnal göndərir.

`struct{}` heç bir sahəsi olmayan boş struct tipidir, `struct{}{}` isə onun yeganə dəyəridir və yaddaşda yer tutmur. `chan struct{}` tipi oxucuya dərhal deyir: bu channel məlumat yox, yalnız "hazırdır" xəbərini daşıyır. `chan bool` da işləyərdi, amma onda `true` ilə `false`-un burada nə fərqi var sualı yaranır.

## Sleep ilə təxmin {#guess}

`main` `done` channel-ını yaradır və backup-ı goroutine-də işə salır. Sonra gözləməyin ilk ağla gələn yolunu sınayır: 50 ms yatır və backup-ın bu vaxtda bitəcəyinə ümid edir. Amma backup 4 × 60 = 240 ms çəkir, ona görə çıxışda `till:` sətri backup sətrindən **əvvəl** gəlir. `main` burada bitsəydi, proqram backup-ı yarıda kəsərdi və çeklər itərdi.

Rəqəmi böyütmək də çarə deyil: yavaş diskdə istənilən rəqəm yenə az ola bilər, sürətli diskdə isə kassa boş yerə gözləyər.

> **Diqqət:** `time.Sleep` gözləmə deyil, təxmindir. İşin bitdiyini yalnız işi görən goroutine özü xəbər verə bilər.

## Siqnalı gözləmək {#wait}

`<-done` channel-dan qəbul edir. Channel unbuffered olduğu üçün qəbul, backup siqnal göndərənə qədər bloklanır, yəni `main` bu sətirdə dayanıb gözləyir. Backup son sətrini çap edir, siqnalı göndərir və yalnız bundan sonra `main` davam edib kassanı bağlayır. Gələn dəyəri heç bir dəyişənə yazmırıq: `<-done` burada yalnız gözləmək üçündür.

> **Bilgi:** Goroutine-in siqnaldan əvvəl gördüyü hər iş, o cümlədən dəyişənlərə yazdığı dəyərlər, `<-done`-dan sonra `main` üçün tam görünür. Channel həm də goroutine-lər arasında yaddaşı sinxronlaşdırır.

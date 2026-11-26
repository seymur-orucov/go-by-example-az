Taymer müəyyən vaxtdan sonra **bir dəfə** siqnal verir, mətbəx taymeri kimi: qurursan, işinə davam edirsən, vaxt çatanda zəng çalır. `time.Sleep`-dən fərqi budur: `Sleep` goroutine-i yatırır və bu gözləməni yarıda kəsmək olmur. Taymer isə siqnalı channel-a göndərir, ona görə onu `select`-də başqa hadisələrlə yarışdırmaq və lazım olmayanda ləğv etmək olur. Timeouts dərsindəki `time.After` da taymerdir, sadəcə onu dayandırmaq üçün əlimizdə dəyişən qalmır.

Bu dərsdə bir neçə yeməyi eyni vaxtda bişirən aşpaz üçün taymerlər qururuq: biri vaxtında zəng çalır, biri ləğv olunur, biri isə xatırlatma funksiyasını çağırır.

## Taymer yaratmaq {#new-timer}

`time.NewTimer(d)` taymer yaradır və geri sayımı dərhal başladır. `d` `time.Duration` tipli müddətdir: `time.Millisecond` və `time.Second` bu tipin sabitləridir, `100 * time.Millisecond` isə saniyənin onda biridir. Taymerin `C` sahəsi channel-dır: vaxt çatanda oraya bir dəyər gəlir. `<-eggs.C` həmin siqnala qədər gözləyir; burada bu hələ `time.Sleep` kimi görünür, fərq növbəti addımda üzə çıxır.

## Taymeri dayandırmaq {#stop}

Makaron üçün taymer 1 saniyəyə qurulub, amma aşpaz 100 millisaniyə sonra dadına baxır və makaron artıq hazırdır. Goroutine-dəki `time.Sleep(d)` cari goroutine-i `d` müddəti qədər yatırır, sonra `tasted` channel-ını bağlayır. `select` hansı hadisə əvvəl baş verərsə, onu seçir; yatan bir goroutine isə dadmağa reaksiya verə bilməzdi. `pasta.Stop()` taymeri ləğv edir və o daha zəng çalmayacaq.

`Stop` hələ işləməmiş taymeri dayandırıbsa, `true` qaytarır. `eggs` taymeri artıq zəng çalıb və onun siqnalını almışıq, ona görə onun `Stop`-u `false` qaytarır.

> **Bilgi:** Go 1.23-dən taymerin channel-ı buffer-sizdir: `Stop`-dan sonra `C`-dən köhnə siqnal gəlmir. Köhnə versiyalarda `Stop`-dan sonra channel-ı əllə boşaltmaq lazım gəlirdi, köhnə məqalələrdə bu kodu görə bilərsiniz.

## time.AfterFunc {#after-func}

Bəzən siqnalı gözləmək yox, vaxt çatanda sadəcə bir iş görmək lazımdır. `time.AfterFunc(d, f)` müddət bitəndə `f`-i öz goroutine-ində çağırır; burada channel yoxdur. `main` isə bu müddətdə işinə davam edir, ona görə `soup is simmering` xatırlatmadan əvvəl çap olunur. Sonda `<-stirred` ilə xatırlatmanı gözləyirik, yoxsa `main` bitər və funksiya heç vaxt çağırılmaz.

> **Bilgi:** `AfterFunc` da `*time.Timer` qaytarır. Vaxt çatmamış onun `Stop`-unu çağırsanız, funksiya ümumiyyətlə işləməyəcək.

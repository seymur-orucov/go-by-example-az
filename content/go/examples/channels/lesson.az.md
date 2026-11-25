Goroutine-lər eyni vaxtda işləyir, amma çox vaxt onların bir-birinə nəsə ötürməsi lazımdır: nəticəni, sifarişi, xəbəri. Channel (kanal) iki goroutine arasında boru kimidir: biri bir ucundan dəyər qoyur, digəri o biri ucundan götürür. Əvvəlki dərsdə nəticəni slice-ın öz yerinə yazıb `wg.Wait()` ilə gözləyirdik; channel isə həm dəyəri ötürür, həm də qəbul edəni dəyər gələnə qədər gözlədir.

Bu dərsdə pizzeriya yazırıq: soba (goroutine) hazır pizzanı channel ilə piştaxtaya (`main`) verir, piştaxta isə pizza gələnə qədər gözləyir.

## Göndərmək {#send}

`bake` pizzanı bişirir və hazır olanı `ready` channel-ına göndərir. `chan string` tipi "`string` daşıyan channel" deməkdir: ona başqa tipli dəyər göndərmək olmaz. `ready <- pizza` göndərmə əmridir, ox dəyərin hara getdiyini göstərir. `go` funksiyanın nəticəsini qaytarmadığı üçün goroutine öz nəticəsini məhz belə, channel ilə çatdırır.

## Channel yaratmaq {#make}

Channel `make` ilə yaradılır: `make(chan string)`. Eyni `ready`-ni `bake`-ə veririk və özümüzdə də saxlayırıq: bir channel-ın bir ucu sobada, o biri ucu piştaxtadadır. `go bake(...)` dərhal qayıdır, piştaxta `waiting for Margherita` yazır, soba isə hələ bişirir.

> **Bilgi:** Channel-ın zero value-su `nil`-dir. `var ch chan string` ilə elan olunan `nil` channel-a göndərmək də, ondan almaq da əbədi gözləyir, ona görə channel həmişə `make` ilə yaradılır.

## Qəbul etmək {#receive}

`<-ready` channel-dan dəyər götürür, ox bu dəfə channel-dan çölə baxır. Dəyər hələ yoxdursa, `main` bu sətirdə dayanıb gözləyir. Soba 100 millisaniyədən sonra pizzanı göndərəndə gözləmə bitir və `pizza` `Margherita` olur. Ona görə burada `WaitGroup` lazım deyil: dəyəri almaq elə goroutine-in işini gözləmək deməkdir.

## Göndərən də gözləyir {#send-waits}

`make(chan string)` ilə yaradılan channel-da dəyəri saxlamağa yer yoxdur, dəyər birbaşa əldən-ələ verilir. Belə channel-a buffer-siz (unbuffered) deyilir. Ona görə yalnız qəbul edən yox, göndərən də gözləyir: göndərmə o biri tərəf dəyəri götürənə qədər bitmir.

Burada piştaxta `Pepperoni` sifarişini `orders` channel-ı ilə sobaya verir, amma soba hələ 100 millisaniyə məşğuldur. `orders <- "Pepperoni"` soba sifarişi götürənə qədər `main`-i saxlayır, `waited: true` bunu göstərir. Sonra soba pizzanı bişirib `ready` ilə qaytarır.

> **Diqqət:** Dəyəri götürəcək goroutine yoxdursa, göndərmə heç vaxt bitmir. Bütün goroutine-lər belə ilişib qalanda Go proqramı `fatal error: all goroutines are asleep - deadlock!` xətası ilə dayandırır.

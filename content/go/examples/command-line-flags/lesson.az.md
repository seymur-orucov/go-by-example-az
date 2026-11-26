Flag (bayraq) adı olan arqumentdir: `-city Oslo`, `-days=3`, `-wind`. Adi arqumentlərdə mənanı sıra müəyyən edir, flag-larda isə ad: onları istənilən sırada yazmaq və lazım olmayanları buraxmaq olur, buraxılan flag standart dəyərini alır. Go-da flag-ları `flag` paketi oxuyur, tipə çevirir və səhv yazılanda xəta verir.

Bu dərsdə hava proqnozu aləti yazırıq: `weather` şəhəri, günlərin sayını və küləyin göstərilib-göstərilməməsini flag-lardan götürür.

## Flag təyin etmək {#define}

`flag.String`, `flag.Int` və `flag.Bool` üç arqument alır: flag-ın adı, standart dəyəri və `-h` yazanda göstərilən izah. Hər biri dəyərin özünü yox, pointer qaytarır, çünki bu anda flag-lar hələ oxunmayıb: dəyər sonra, `Parse` zamanı həmin ünvana yazılır. Ona görə dəyəri `*city` kimi oxuyuruq.

## flag.Parse {#parse}

`flag.Parse()` komanda sətrini, yəni `os.Args[1:]`-i oxuyur və flag-ları doldurur. Proqramı `go run main.go` ilə flag-sız işlətdik, ona görə hamısı standart dəyərdədir. `flag.Args()` flag olmayan qalan arqumentləri qaytarır, burada boşdur. Real istifadədə `go run main.go -city Rome -days 2` yazmaq kifayətdir.

> **Diqqət:** Flag-ları `flag.Parse()`-dan sonra oxuyun. Ondan əvvəl `*city` hələ standart dəyəri saxlayır.

## Komanda sətrini simulyasiya etmək {#simulate}

`flag.Parse()` əslində `flag.CommandLine.Parse(os.Args[1:])` deməkdir, ona görə eyni flag-ları əl ilə yazılmış slice-dan da oxumaq olur. Dəyər flag-dan boşluqla (`-city Oslo`) və ya `=` ilə (`-days=3`) ayrılır. Bool flag-ın dəyəri yazılmır: `-wind` onu `true` edir. Oxuma ilk flag olmayan sözdə dayanır, ondan sonrakılar (`tomorrow`) `flag.Args()`-a düşür.

> **Diqqət:** Bool flag-ı söndürmək üçün `-wind=false` yazın. `-wind false` yazsanız, flag `true` olur, `false` isə adi arqument kimi `flag.Args()`-a düşür.

## Səhv flag-lar {#errors}

`flag.NewFlagSet` öz flag dəstini yaradır. Qlobal dəst səhv flag görəndə xəta mətni ilə istifadə qaydasını çap edib proqramı bitirir, `flag.ContinueOnError` isə xətanı `Parse`-dan qaytarır ki, onu özümüz emal edək. `SetOutput(io.Discard)` paketin öz çapını söndürür, xətanı biz çap edirik. `many` ədəd deyil, `-hours` isə heç təyin olunmayıb: hər iki halda `Parse` nəyin səhv olduğunu dəqiq deyir.

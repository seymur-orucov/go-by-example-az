Proses işləyən proqramdır: əməliyyat sisteminin ona ayırdığı yaddaşı, arqumentləri, mühit dəyişənləri və üç standart axını var (stdin girişdir, stdout nəticədir, stderr xəta mesajlarıdır). Bəzən işin bir hissəsini başqa proqram daha yaxşı görür: video çevirmək üçün `ffmpeg`, versiyaya baxmaq üçün `git`. `os/exec` paketi Go proqramından başqa proqramı uşaq proses (child process) kimi işə salır, ona giriş verir və nəticəsini oxuyur.

Bu dərsdə onlayn mağaza bağlama üçün etiket çap edir və bunu ayrıca köməkçi proqrama tapşırır. `ls` və ya `echo` kimi əmrlər Windows-da və Linux-da fərqlidir, ona görə dərs hər yerdə eyni işləsin deyə köməkçi rolunu proqramın özü oynayır: özünü xüsusi mühit dəyişəni ilə ikinci dəfə işə salır.

## Köməkçi proqram {#helper}

`printLabel` uşaq prosesin gördüyü işdir: ünvanı stdin-dən oxuyur, etiketi stdout-a yazır. Ünvan boşdursa, mesajı stderr-ə yazır və `os.Exit(3)` ilə bitir: `os.Exit` prosesi verilən çıxış kodu (exit code) ilə dərhal dayandırır, onu sonuncu dərsdə ətraflı görəcəyik. Çıxış kodu prosesin valideynə qoyduğu qısa hesabatdır: `0` uğur, qalan hər şey xəta deməkdir.

## Özünü işə salmaq {#self}

Proqram əvvəlcə `LABEL_HELPER` mühit dəyişəninə baxır: varsa, köməkçidir və yalnız etiket çap edir. Yoxdursa, əsas proqramdır və `os.Executable` ilə öz icra faylının yolunu tapır. Real layihədə bu addım olmur: orada uşaq prosesin adı birbaşa yazılır, məsələn `exec.Command("git", "status")`.

## Command və Output {#output}

`exec.Command` prosesi hələ işə salmır, yalnız təsvir edir: proqram və arqumentlər. `cmd.Env` uşağın mühit dəyişənləridir; `os.Environ()`-a öz dəyişənimizi əlavə edirik, çünki `Env` verilərsə, uşaq yalnız onu görür. `cmd.Stdin`-ə `strings.NewReader` ilə mətn veririk, uşaq onu öz stdin-i kimi oxuyur. `cmd.Output()` prosesi işə salır, bitməsini gözləyir və stdout-u `[]byte` kimi qaytarır.

> **Diqqət:** `exec.Command` shell işlətmir: `exec.Command("git status")` `git` proqramını yox, adı `git status` olan proqramı axtarır. Hər arqument ayrıca verilir. Bir `Command` yalnız bir dəfə işə salına bilər; təkrar üçün yenisini yaradın.

## Çıxış kodu {#exit-code}

Bu dəfə stdin vermirik, köməkçi boş giriş alır və `3` kodu ilə bitir. Sıfırdan fərqli kod `Output()`-dan `*exec.ExitError` kimi qayıdır; `errors.As` onu çıxarır, `ExitCode()` kodu verir. `Output()` stderr-i də yadda saxlayır: o, `exitErr.Stderr`-dədir və istifadəçiyə uşağın öz izahını göstərməyə imkan verir.

## Proqram tapılmayanda {#not-found}

Proqramın adında yol yoxdursa, Go onu `PATH` mühit dəyişənindəki qovluqlarda axtarır. Tapılmasa, proses heç başlamır və xəta `exec.ErrNotFound`-dur. Xəta mətnini çap etmirik, çünki Windows-da və Linux-da fərqlidir; `errors.Is` isə hər yerdə eyni cavab verir.

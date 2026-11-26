Hər proqram bitəndə əməliyyat sisteminə bir ədəd, çıxış kodu (exit code) qaytarır: `0` uğur deməkdir, sıfırdan fərqli kod isə xəta. Ekrandakı mətni insan oxuyur, çıxış kodunu isə proqramlar: shell-də `make && ./deploy` yalnız `make` `0` qaytaranda ikinci əmri işə salır, CI və cron isə kodun sıfırdan fərqli olduğunu görüb işi uğursuz sayır. Go proqramı `main` adi qaydada bitəndə `0`, tutulmayan panic-də `2` qaytarır; istənilən kodla dərhal çıxmaq üçün `os.Exit` işlədilir.

Bu dərsdə gecə avtomatik işləyən ehtiyat nüsxə (backup) proqramını yazırıq: diskdə yer çatmasa, o, uğursuzluğunu çıxış kodu ilə bildirməlidir ki, planlayıcı xəbərdarlıq göndərsin.

## Kodu funksiyadan qaytarmaq {#code}

`backup` çıxış kodunu adi `int` kimi qaytarır: yer çatırsa `0`, çatmırsa `1`. Xəta mətnini `os.Stderr`-ə, yəni xətalar üçün ayrılmış axına yazırıq: çıxışı fayla yönləndirəndə də xəta terminalda görünür. Funksiyanın əvvəlindəki `defer` hər iki halda kilidi buraxır, çünki funksiya adi `return` ilə bitir.

## main-dəki defer {#defer}

`main`-in əvvəlində müvəqqəti qovluğu silən `defer` qeydə alırıq. Adi halda o, `main` bitəndə işləyərdi. Bu sətrin çıxışda görünməməsi dərsin əsas nəticəsidir, səbəbi son addımdadır.

## Proqramı işlətmək {#run}

Birinci çağırışda yer çatır: `backup: done`, sonra defer-in sətri, sonra `0`. İkincidə 40 GB lazımdır, 25 GB var: xəta stderr-ə yazılır, kilid yenə buraxılır və kod `1` olur. Kodu dərhal `os.Exit`-ə vermirik, dəyişəndə saxlayırıq.

## os.Exit {#exit}

`os.Exit(code)` proqramı həmin an bitirir və kodu sistemə verir. O, `return` kimi funksiyadan çıxmır, prosesi dayandırır, ona görə qeydə alınmış defer-lər işləmir: `main: temp folder removed` heç vaxt çap olunmur. Ona görə təmizlik işini ayrıca funksiyada edin və `os.Exit`-i yalnız `main`-in sonunda çağırın, məsələn `os.Exit(run())`: `run`-ın defer-ləri o qayıdanda artıq işləmiş olur.

Kodu yoxlamaq üçün proqramı `go build` ilə kompilyasiya edib işlədin, sonra bash-da `echo $?` yazın: `1` görünəcək. `go run` sıfırdan fərqli kodu öz mesajı ilə, `exit status 1` kimi göstərir.

> **Diqqət:** `log.Fatal` da daxildə `os.Exit(1)` çağırır, ona görə ondan sonra defer-lər işləmir.

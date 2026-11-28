Böyük komanda sətri alətləri işi alt əmrlərə (subcommand) bölür: `git commit`, `git push`, `go build`, `go test`. Proqram adından sonrakı ilk söz işi seçir və hər alt əmrin öz flag-ları olur: `go test -run` var, `go build`-də isə yoxdur. Go-da bunu ayrıca paket olmadan, `flag.NewFlagSet` ilə qurmaq olur.

Bu dərsdə tapşırıqlar siyahısı aləti yazırıq: `todo add` yeni tapşırıq əlavə edir və `-priority` flag-ını qəbul edir, `todo list` siyahını göstərir və `-all` flag-ını qəbul edir.

## Real komanda sətri {#real}

`main` bütün işi `run`-a ötürür və yalnız xətanı çap edir. Proqramı `go run main.go` ilə arqumentsiz işlətdik, ona görə alt əmr yoxdur və istifadə qaydası çap olunur. Real istifadədə əmr `./todo add -priority 3 renew passport` kimi yazılardı.

## Komanda sətirlərini simulyasiya etmək {#simulate}

Dörd komanda sətrini slice kimi yazıb eyni `run`-dan keçiririk. Birincisi tapşırıq əlavə edir, ikincisi siyahını göstərir. Üçüncüdə `-due` flag-ı `add` üçün təyin olunmayıb, dördüncüdə isə `remove` adlı alt əmr yoxdur: hər iki səhv adi `error` kimi qayıdır və növbəti sətrə keçilir.

## Alt əmri seçmək {#dispatch}

`run` ilk arqumenti, yəni alt əmrin adını `switch` ilə yoxlayır və qalan arqumentləri (`args[1:]`) uyğun funksiyaya verir. Alt əmrin adı flag deyil, ona görə onu `flag` paketi yox, bu `switch` oxuyur. Naməlum ad xəta qaytarır, xəta mətnində də istifadəçinin yazdığı söz göstərilir.

## Hər alt əmrə öz FlagSet-i {#flagsets}

`add` və `list` hər biri öz `FlagSet`-ini yaradır, ona görə `-priority` yalnız `add`-də, `-all` isə yalnız `list`-də keçərlidir. `FlagSet` (flag dəsti) funksiyanın içində yaradılır: hər çağırışda flag-lar standart dəyərdən başlayır və əvvəlki komanda sətrinin dəyəri qalmır. `fs.Args()` flag-lardan sonrakı sözləri qaytarır, `strings.Join` onları tapşırığın adına birləşdirir. Flag-lar addan əvvəl gəlməlidir, çünki oxuma ilk flag olmayan sözdə dayanır. `add renew passport -priority 3` yazsaq, prioritet `1` qalır və `-priority 3` tapşırığın adına düşür.

> **Bilgi:** `flag.NewFlagSet`-in ilk arqumenti alt əmrin adıdır. Paketin çap etdiyi istifadə qaydasında (`Usage of add:`) bu ad görünür.

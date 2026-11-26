Komanda sətri arqumentləri proqramın adından sonra yazılan sözlərdir: `git commit`, `go run main.go`, `cp a.txt b.txt`. Onlar proqrama hər dəfə kodu dəyişmədən başqa giriş verməyə imkan yaradır: eyni proqram bu gün bir faylı, sabah başqasını emal edir. Go-da arqumentlər `os` paketinin `os.Args` adlı string slice-ındadır.

Bu dərsdə müəllim üçün kiçik alət yazırıq: `grades` imtahan ballarını arqument kimi alır və orta balı çap edir, məsələn `./grades 78 92 85`.

## os.Args {#os-args}

`os.Args[0]` proqramın özünün yoludur, istifadəçinin yazdığı arqumentlər isə `os.Args[1:]`-dədir. Proqramı `go run main.go` ilə arqumentsiz işlədəndə slice-da yalnız proqramın yolu olur: uzunluq 1, `os.Args[1:]` boşdur. `go run main.go 78 92 85` yazsaq, `count: 4` və `given: [78 92 85]` çap olunardı. Arqumentləri boşluqlar ayırır, onları shell (terminal) bölür, Go yox: `./grades "Ann Lee" 90` iki arqumentdir, çünki dırnaq içindəki mətn bir arqument sayılır.

> **Bilgi:** `go run` proqramı müvəqqəti qovluqda kompilyasiya edir, ona görə `os.Args[0]` hər dəfə başqa yol olur. Daimi ad üçün `go build` ilə fayl yaradıb onu `./grades 78 92 85` kimi işlədin.

## Arqumentləri yoxlamaq {#real}

Proqram arqumentləri `average` funksiyasına ötürür və onun xətasını yoxlayır. Arqument verilməyib, ona görə istifadə qaydası (usage) çap olunur: istifadəçi proqramı necə çağırmalı olduğunu dərhal görür. Arqumentlərin sayını yoxlamamaq tipik səhvdir: arqumentsiz işə düşən proqramda `os.Args[1]` yazmaq panic verir, çünki belə indeks yoxdur.

## Komanda sətrini simulyasiya etmək {#simulate}

Məntiq `os.Args`-dan yox, parametrdən oxunduğu üçün funksiyanı istənilən slice ilə çağırmaq olur. Burada iki komanda sətrini əl ilə yazırıq: biri düzgün ballarla, biri `ninety` sözü ilə. Bu üsul proqramı hər dəfə terminaldan işə salmadan yoxlamağa, məsələn test yazmağa imkan verir.

## Mətndən ədədə {#convert}

Bütün arqumentlər string-dir: `92` də ədəd yox, `"92"` mətnidir. Hesablamadan əvvəl hər birini `strconv.Atoi` ilə ədədə çeviririk və xətanı yoxlayırıq, çünki istifadəçi istənilən söz yaza bilər. Xəta mətnində problemli arqumenti `%q` ilə göstəririk ki, istifadəçi hansını səhv yazdığını görsün.

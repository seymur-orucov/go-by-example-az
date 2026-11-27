Komanda sətri arqumentləri proqramın adından sonra yazılan sözlərdir: `git commit`, `go run main.go`, `cp a.txt b.txt`. Onlarla proqrama kodu dəyişmədən hər dəfə başqa giriş vermək olur: eyni proqram bu gün bir faylı, sabah başqasını emal edir. Go-da arqumentlər `os` package-inin `os.Args` adlı string slice-ındadır.

Bu dərsdə müəllim üçün kiçik alət yazırıq: `grades` imtahan ballarını arqument kimi alır və orta balı çap edir, məsələn `./grades 78 92 85`.

## os.Args {#os-args}

`os.Args[0]` proqramın özünün yoludur, istifadəçinin yazdığı arqumentlər isə `os.Args[1:]`-dədir. Proqramı `go run main.go` ilə arqumentsiz işlədəndə slice-da yalnız proqramın yolu olur: uzunluq 1, `os.Args[1:]` boşdur. `go run main.go 78 92 85` yazsaq, `count: 4` və `given: [78 92 85]` çap olunardı. Arqumentləri boşluqlar ayırır, dırnaq içindəki mətn isə bir arqument sayılır: `./grades "Ann Lee" 90` iki arqumentdir.

> **Bilgi:** `go run` proqramı Go-nun keş (cache) qovluğunda kompilyasiya edib oradan işə salır. Ona görə `os.Args[0]` `grades` yox, `go-build` qovluğunda uzun bir yoldur. Daimi ad üçün `go build -o grades` ilə fayl yaradın (Windows-da `-o grades.exe`) və onu `./grades 78 92 85` kimi işlədin.

## Arqumentləri yoxlamaq {#real}

Proqram arqumentləri `average` funksiyasına ötürür və onun xətasını yoxlayır. Funksiyanın özü son addımdadır: siyahı boşdursa, istifadə qaydası (usage) ilə xəta qaytarır. Burada arqument verilməyib, ona görə həmin qayda çap olunur və istifadəçi proqramı necə çağırmalı olduğunu dərhal görür. Arqumentlərin sayını yoxlamamaq tipik səhvdir: arqumentsiz işə düşən proqramda `os.Args[1]` yazmaq panic verir, çünki belə indeks yoxdur.

> **Bilgi:** Real alətdə istifadə qaydası `os.Stderr`-ə yazılır və proqram `os.Exit(2)` ilə bitir. Burada proqram növbəti addımlara keçsin deyə xəta sadəcə çap olunur.

## Komanda sətrini simulyasiya etmək {#simulate}

Məntiq `os.Args`-dan yox, parametrdən oxunduğu üçün funksiyanı istənilən slice ilə çağırmaq olur. Burada iki komanda sətrini əl ilə yazırıq: biri düzgün ballarla, biri `ninety` sözü ilə. Belə funksiyanı terminalsız yoxlamaq, məsələn onun üçün test yazmaq olur.

## Mətndən ədədə {#convert}

Bütün arqumentlər string-dir: `92` də ədəd yox, `"92"` mətnidir. Hesablamadan əvvəl hər birini `strconv.Atoi` ilə ədədə çeviririk və xətanı yoxlayırıq, çünki istifadəçi istənilən söz yaza bilər. Xəta mətnində problemli arqumenti `%q` ilə göstəririk ki, istifadəçi hansını səhv yazdığını görsün.

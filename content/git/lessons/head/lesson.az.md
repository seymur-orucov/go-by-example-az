**HEAD** hazırda hansı commit üzərində işlədiyinizi göstərir. Adətən o, commit-i birbaşa yox, hazırkı branch-ı göstərir, branch isə son commit-i. Komandada `HEAD` yazanda Git bu zənciri izləyib son commit-i tapır. `HEAD~1` və `HEAD^` kimi yazılışlarla ondan əvvəlki commit-lərə də hash yazmadan istinad etmək olur.

Nümunə bağ planıdır: `plants.txt`-də nə əkiləcəyi yazılıb və artıq iki commit var.

## HEAD branch-ı, branch commit-i göstərir {#pointer}

`git log --oneline` iki commit göstərir, ən yenisi yuxarıdadır. `cat .git/HEAD` `ref: refs/heads/main` çap edir. HEAD-də hash yoxdur: orada yalnız branch-ın adı var (`ref` — istinad).

`main` branch-ı da sadə fayldır: `.git/refs/heads/main`. Onun içində bir sətir var, son commit-in tam hash-i. Bu hash-in ilk 7 simvolu `git log` çıxışının birinci sətrindəki qısa hash ilə eynidir. Deməli, zəncir belədir: HEAD → `main` → son commit. Vizualda bu, ən yuxarıdakı commit-in yanında `HEAD → main` kimi yazılıb.

Branch commit-i göstərən addır, yəni pointer-dir (göstərici); branch-ları ayrıca modulda keçəcəyik. HEAD-in branch-ı yox, birbaşa commit-i göstərdiyi hal da var (*detached HEAD*), onu da orada görəcəyik.

## Commit-dən sonra HEAD irəliləyir {#move}

Əkin təqvimi üçün yeni fayl, `calendar.txt`, əlavə edib commit edirik. Çıxışın birinci sətrindəki `[main ...]` commit-in hansı branch-a düşdüyünü göstərir: Git HEAD-ə baxıb `main`-i tapdı.

İndi iki faylı yenidən oxuyuruq. `.git/HEAD` dəyişməyib, yenə `main`-i göstərir. `.git/refs/heads/main`-də isə artıq başqa hash var: yeni commit-in hash-i. Commit zamanı Git branch-ı yeni commit-ə keçirir. HEAD branch-a baxdığı üçün onunla birlikdə irəliləyir. Vizualda yeni commit və yerini dəyişən `HEAD → main` vurğulanıb.

## HEAD~N: geriyə addımlar {#tilde}

`HEAD~1` HEAD-in parent-idir, yəni bir commit əvvəlki. `HEAD~2` parent-in parent-idir. Rəqəm HEAD-dən geriyə neçə addım getdiyini bildirir. `git log --oneline -1` yalnız verilən commit-in sətrini çap edir (`-1` — bir commit). Çıxışa görə `HEAD~1` `Add basil`, `HEAD~2` isə `Plan tomatoes` commit-idir.

`HEAD~3` xəta verir. Üç commit-in ən köhnəsi root commit-dir, onun parent-i yoxdur. `fatal: ambiguous argument` o deməkdir ki, Git `HEAD~3` adlı nə commit, nə də fayl tapdı. Növbəti iki sətir commit-i fayl adından `--` ilə ayırmağı təklif edir; burada bu lazım deyil.

> **Bilgi:** `HEAD~1` sabit ad deyil. Növbəti commit-dən sonra o, indiki son commit-i göstərəcək. Konkret commit lazımdırsa, onun hash-ini yazın.

## HEAD^: birinci parent {#caret}

`HEAD^` da HEAD-in parent-idir: çıxış əvvəlki addımdakı `HEAD~1` ilə eyni sətirdir. `HEAD^^` iki dəfə geri gedir və `HEAD~2` ilə eynidir. Hər commit-in bir parent-i olan düz tarixçədə `HEAD^` və `HEAD~1` həmişə eyni commit-dir.

Fərq rəqəmdədir. `~`-dan sonrakı rəqəm neçə addım geri getməyi, `^`-dan sonrakı isə parent-in sırasını bildirir. Merge commit-in iki parent-i olur və `HEAD^2` onun ikinci parent-idir (merge-i sonra keçəcəyik). Ona görə `HEAD^2` və `HEAD~2` fərqli şeylərdir.

> **Diqqət:** Windows-un `cmd` pəncərəsində `^` xüsusi simvoldur, ona görə `HEAD^` Git-ə düzgün çatmır. Orada `HEAD~1` yazın və ya `"HEAD^"` kimi dırnağa alın. Git Bash-də bu problem yoxdur.

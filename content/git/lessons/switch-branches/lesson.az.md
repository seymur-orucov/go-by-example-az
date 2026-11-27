`git switch <ad>` başqa branch-a keçir: HEAD həmin branch-ı göstərir, working directory-dəki fayllar isə onun son commit-inə uyğunlaşır. Ona görə keçiddən sonra bəzi fayllar yox olur, bəziləri yaranır, bəzilərinin məzmunu dəyişir. Commit olunmamış dəyişiklik isə bəzən sizinlə yeni branch-a keçir, bəzən keçidə mane olur.

Nümunə ev köçmə siyahısıdır (`boxes.txt`-də qutular, `addresses.txt`-də ünvan), `movers` branch-ı isə daşıma şirkətini seçmək üçündür və `main`-dən iki commit irəlidədir.

## git switch: başqa branch-a keçmək {#switch}

`git branch` iki branch göstərir. `*` hazırkı branch-ı işarələyir, yəni hələ `main`-dəyik. `ls` iki fayl çap edir.

`git switch movers` cavab verir: `Switched to branch 'movers'`. İndi `ls` üç fayl göstərir, `movers.txt` yarandı. `boxes.txt`-də isə yataq otağının sətri peyda oldu. Bu fayllar `movers`-in son commit-indədir və Git onları working directory-yə yazdı. Vizualda `HEAD → movers` ən yuxarıdakı commit-dədir, `main` isə iki commit aşağıda qalıb.

> **Bilgi:** köhnə dərsliklərdə `git checkout movers` görəcəksiniz. O da branch-a keçir, amma `checkout` fayl bərpası kimi başqa işlər də görür. Branch-lar arasında keçmək üçün `git switch` yazın.

## git switch -: əvvəlki branch-a qayıtmaq {#back}

`git switch -` əvvəlki branch-a qayıdır, burada `main`-ə. İki branch arasında gedib-gələndə adı hər dəfə yazmaq lazım olmur.

`ls`-də `movers.txt` artıq yoxdur, `boxes.txt`-də də yenə bir sətir var. Fayl itməyib: o, `movers`-in commit-lərində saxlanır və `movers`-ə qayıdanda yenidən yaranacaq. Vizualda working directory-dəki fayllar `main`-in son commit-i ilə eynidir.

## Commit olunmamış dəyişiklik sizinlə gedir {#carry}

`addresses.txt`-ə yeni ünvanı yazırıq, amma commit etmirik. ` M` faylın dəyişdiyini və dəyişikliyin hələ stage olunmadığını göstərir.

`git switch movers` keçidi edir və altında `M` ilə `addresses.txt`-i göstərir. Bu, dəyişmiş halda yeni branch-a keçən faylların siyahısıdır. `git status --short` `movers`-də də eyni sətri çap edir. Commit olunmamış dəyişiklik heç bir branch-a aid deyil, o yalnız working directory-dədir. `addresses.txt` iki branch-da eynidir, ona görə Git faylı dəyişməli olmadı və yeni sətir yerində qaldı.

## Keçid alınmayanda {#refuse}

`movers`-də olarkən qarajdakı qutuları da sayırıq, amma commit etmirik. `boxes.txt` iki branch-da fərqlidir. `main`-ə keçmək üçün Git bu faylı `main`-dəki versiya ilə əvəz etməli olardı və commit olunmamış sətir silinərdi. Ona görə Git keçidi etmir: `error: Your local changes ... would be overwritten`, altında faylın adı. Sonuncu sətir, `Aborting`, heç nəyin dəyişmədiyini bildirir. Vizualda HEAD yenə `movers`-dədir.

Mesajda `checkout` sözü var, çünki `git switch` daxildə `checkout`-un kodunu işlədir. Git iki yol təklif edir: dəyişikliyi commit etmək və ya `stash` etmək, yəni müvəqqəti kənara qoymaq (`git stash`-i sonra keçəcəyik).

## Əvvəlcə commit, sonra keçid {#commit-first}

`boxes.txt`-i `movers`-də commit edirik. Bu faylda commit olunmamış dəyişiklik qalmadı və `git switch main` işləyir. Qaraj sətri `movers`-in yeni commit-indədir, `main`-in `boxes.txt`-ində isə yoxdur. Vizualda yeni commit `movers`-də, `HEAD → main` isə aşağıdadır.

`addresses.txt` yenə `M` ilə gəldi. Onu commit etmədik, ona görə hansı branch-a keçsəniz, o da sizinlə gedir.

> **Diqqət:** keçiddən əvvəl `git status --short`-a baxın. Dəyişiklik hansı branch-a aiddirsə, onu orada commit edin. Əks halda o, başqa branch-a keçir və səhvən orada commit oluna bilər.

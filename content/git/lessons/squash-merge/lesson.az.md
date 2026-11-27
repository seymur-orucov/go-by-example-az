Adi merge branch-ın bütün commit-lərini `main`-in tarixçəsinə gətirir, kiçik və səliqəsiz commit-lər də daxil olmaqla. **Squash merge** (*squash* — sıxmaq) branch-ın bütün dəyişikliklərini bir yeni commit kimi gətirir. Bu, adi commit-dir: onun bir parent-i var və branch-ın commit-ləri `main`-in tarixçəsinə düşmür.

Nümunə ispan dilini öyrənmək üçün kart dəstidir (flashcards): `spanish.csv`-də hər sətir bir kartdır, `README.md`-də dəstin təsviri yazılıb.

## Kiçik commit-ləri olan branch {#branch}

`food-cards` branch-ında dəstə 20 yemək kartı əlavə olunub. İş üç commit-ə bölünüb: `Add cards 1-10`, `Fix typo` və `Add cards 11-20`. `Fix typo` yalnız bir kartdakı hərf səhvini düzəldir. Bu arada `main`-də də bir commit yaranıb: `Explain the card format` `README.md`-ni dəyişib.

Adi merge burada merge commit yaradardı və hər üç commit `main`-in tarixçəsində qalardı. Komandaya isə bir fakt lazımdır: dəstə 20 yemək kartı əlavə olundu.

## git merge --squash: dəyişikliklər staging area-ya düşür {#squash}

`main`-dəsiniz və `git merge --squash food-cards` yazırsınız. Git merge-i adi merge kimi hesablayır, amma commit yaratmır. Çıxışın birinci sətri iki şey deyir. Merge konfliktsiz alındı (`Automatic merge went well`). Git isə istədiyiniz kimi commit-dən əvvəl dayandı (`stopped before committing as requested`). İkinci sətir, `Squash commit -- not updating HEAD`, HEAD-in və `main`-in yerində qaldığını bildirir.

`git status`-da `spanish.csv` `Changes to be committed` altındadır. Üç commit-in birlikdə gətirdiyi dəyişiklik staging area-dadır və commit-i gözləyir. Vizualda repository-dəki son commit hələ `Explain the card format`-dır. `git status` merge haqqında heç nə demir: Git bunu yarımçıq merge saymır.

## Bir commit, bir parent {#commit}

`git commit -m "Add 20 food cards"` staging area-dakını bir commit kimi yazır. Çıxışdakı `1 file changed, 20 insertions(+)` göstərir ki, 20 kartın hamısı bu commit-dədir. `git cat-file -p HEAD` commit-in içini çap edir. Orada bir `parent` sətri var: `Explain the card format` commit-i. Merge commit-də iki `parent` sətri olardı.

Vizualda yeni commit `main`-in xəttindədir. `food-cards`-ın üç commit-i ayrı xətdə qalıb və yeni commit onlara bağlı deyil.

> **Bilgi:** `-m` yazmasanız, Git redaktoru açır. Mesajın qaralamasında branch-ın bütün commit-ləri sadalanır (`Squashed commit of the following:`). Bu siyahını qısa bir mesajla əvəz edin.

## Git branch-ı merge olunmuş saymır {#not-merged}

`git log --oneline main..food-cards` `food-cards`-da olan, `main`-də olmayan commit-ləri çap edir. Üç commit-in üçü də siyahıdadır. Onların dəyişiklikləri `main`-dədir, commit-lərin özü isə yox.

`git branch -d` branch-ın commit-lərinin HEAD-in tarixçəsində olub-olmadığını yoxlayır, faylların məzmununu müqayisə etmir. Ona görə `git branch -d food-cards` xəta verir: `the branch 'food-cards' is not fully merged`. Squash merge-dən sonra bu gözlənilən haldır. Dəyişikliklər `main`-də olduğu üçün branch-ı `git branch -D food-cards` ilə silirik. Vizualda üç commit itdi, çünki onları göstərən branch qalmadı.

> **Diqqət:** squash merge-dən sonra eyni branch-da işə davam etməyin. Növbəti merge-də köhnə commit-lər yenə "merge olunmamış" görünəcək və konflikt çıxa bilər. Yeni iş üçün `main`-dən yeni branch yaradın.

## Tarixçədə nə qaldı {#history}

`git log --oneline` `main`-də üç commit göstərir. Yemək kartları bir commit-dir: `Add 20 food cards`. `git diff --stat HEAD~1 HEAD` bu commit-in dəyişikliyini göstərir: `spanish.csv`-ə 20 sətir əlavə olunub. `Fix typo` iz qoymayıb, düzəliş artıq kartın içindədir.

Squash merge-i branch-da çoxlu kiçik commit olanda seçirlər, məsələn `wip` (*work in progress*, yarımçıq iş) mesajlı commit-lər. Onda `main`-də hər iş üçün bir təmiz commit olur. Bunun qiyməti detalların itməsidir: kartların hansı addımlarla əlavə olunduğu artıq görünmür. Branch-ın commit-ləri ayrı-ayrılıqda mənalıdırsa, adi merge daha yaxşıdır.

> **Bilgi:** GitHub-da pull request-in **Squash and merge** düyməsi eyni işi görür: PR-ın commit-lərini bir commit-ə birləşdirib əsas branch-a əlavə edir. Pull request-ləri "Komanda işi" modulunda keçəcəyik.

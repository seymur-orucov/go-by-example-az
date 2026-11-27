Git faylları, qovluqları, commit-ləri və annotated tag-ları `.git/objects` qovluğunda obyekt kimi saxlayır. Faylın məzmunu **blob**, qovluq isə **tree** adlanır: onları commit snapshot dərsində `git ls-tree` ilə gördük. Hər obyektin adı məzmunundan hesablanan hash-dir, **ref**-lər (branch, tag, HEAD) isə bu hash-lərə verilən adlardır.

Nümunə haiku toplusudur (`spring.txt`, `autumn.txt` və `drafts/winter.txt`), ilk commit və `v1` tag-ı artıq yaradılıb.

## Porcelain və plumbing {#porcelain}

İndiyə qədər işlətdiyimiz `add`, `commit`, `log`, `switch` kimi komandalar **porcelain** adlanır. Onlar insan üçündür: çıxışı oxunaqlıdır və Git-in yeni versiyalarında dəyişə bilər. Onların altında aşağı səviyyəli komandalar var, **plumbing**: `cat-file`, `hash-object`, `ls-tree`, `rev-parse`. Hər biri kiçik bir iş görür və çıxışı sabit qalır, ona görə skriptlərdə bunlar işlədilir. Adlar santexnikadan gəlir: plumbing divarın içindəki borulardır, porcelain isə görünən çini hissə.

`git log --oneline` porcelain-dir: qısa hash və mesaj. `git rev-parse HEAD` plumbing-dir: adı tam, 40 simvolluq hash-ə çevirir. `git cat-file -t HEAD` bu obyektin tipini çap edir: `commit`.

## Obyektlər .git/objects-dədir {#objects}

`find .git/objects -type f` qovluqdakı bütün faylları tapır, `sort` onları sıralayır. Hər fayl bir obyektdir və onun yolu obyektin hash-idir. Hash-in ilk iki simvolu qovluğun adı, qalan 38 simvolu faylın adıdır. Məsələn, `git log`-dakı qısa hash-in ilk iki simvolu ilə adlanan qovluqda commit-in faylı var. Hash-i belə bölmək bir qovluğa minlərlə fayl yığılmasının qarşısını alır.

Fayllar zlib ilə sıxılıb, `cat` onlarda oxunmaz simvollar göstərir. Obyekti `git cat-file` ilə oxuyun. `--batch-all-objects --batch-check` bütün obyektləri sətir-sətir çap edir: hash, tip və baytla ölçü. Siyahıda 3 blob, 2 tree, 1 commit və 1 tag var. Blob-lar üç faylın məzmunudur, ölçüləri də faylların ölçüsüdür. Tree-lərdən biri layihənin kök qovluğu, digəri `drafts/`-dir. Tag obyekti `v1` annotated tag-ıdır.

> **Bilgi:** obyektlər çoxalanda `git gc` onları `.git/objects/pack/` qovluğunda bir neçə böyük fayla, *packfile*-a yığır. Tək-tək fayllar azalır, amma `git cat-file` obyektləri əvvəlki kimi tapır.

## Hash məzmundan hesablanır {#hash}

`git ls-tree HEAD spring.txt` commit-in tree-sindən yalnız `spring.txt`-in sətrini göstərir. `git hash-object spring.txt` faylın blob hash-ini hesablayır və eyni hash-i çap edir. Git bu hash-i yalnız məzmundan hesablayır (susmaya görə SHA-1 ilə). Fayl adı, tarix və müəllif ora daxil deyil. Ona görə eyni məzmun hər kompüterdə eyni hash alır.

`--stdin` ilə `hash-object` məzmunu fayldan yox, `echo`-dan oxuyur. `wc -l` sətirləri, yəni obyekt fayllarını sayır. Seçimsiz `hash-object` yalnız hash-i hesablayır: obyektlərin sayı 7 olaraq qalır. `-w` (write) obyekti bazaya yazır. Hash eynidir, say isə 8 olur. Bu blob heç bir commit-də yoxdur, ona görə `git gc` onu bir müddət sonra silə bilər.

## HEAD-dən fayla qədər {#chain}

Ref-lər `.git/objects`-də yox, `.git/HEAD` və `.git/refs/` fayllarında saxlanır. Obyekt heç vaxt dəyişmir, ref isə dəyişir: hər commit `main`-i yeni hash-ə keçirir. `HEAD` yazanda Git zənciri izləyir. Biz də onu plumbing ilə addım-addım izləyirik:

1. `cat .git/HEAD`: HEAD `main` branch-ını göstərir.
2. `git rev-parse main`: `main`-in göstərdiyi commit-in hash-i.
3. `git cat-file -p main`: commit-in `tree` sətri kök qovluğun tree-sini göstərir.
4. `git cat-file -p HEAD^{tree}`: kök tree. `^{tree}` "bu commit-in tree-si" deməkdir, hash yazmaq lazım olmur.
5. `git cat-file -p HEAD:drafts`: `drafts/` qovluğunun tree-si.
6. `git cat-file -p HEAD:drafts/winter.txt`: blob, yəni faylın məzmunu.

Kök tree-də iki fayl `100644 blob` ilə yazılıb. `drafts` sətri isə `040000 tree`-dir: `040000` qovluğun rejimidir, `tree` isə bu sətrin başqa tree-yə istinad etdiyini bildirir. Tree həm blob-lara, həm də başqa tree-lərə istinad edir və iç-içə qovluqlar belə saxlanır. Faylın adı blob-da yox, tree-dədir. `HEAD:drafts` yazılışı commit-də həmin yoldakı obyekti göstərir: qovluq üçün tree, fayl üçün blob.

> **Diqqət:** PowerShell-də və `cmd`-də `{` və `^` xüsusi simvollardır. Orada dırnaqla yazın: `git cat-file -p "HEAD^{tree}"`. Git Bash-də dırnaq lazım deyil.

## Yeni commit: yalnız yeni obyektlər {#new-commit}

`spring.txt`-ə sətir əlavə edib commit edirik. Obyektlərin sayı 8-dən 11-ə çıxdı. Üç yeni obyekt yarandı: `spring.txt`-in yeni blob-u, yeni kök tree və commit. Kök tree-də `spring.txt`-in hash-i dəyişib. `autumn.txt` və `drafts` sətirlərindəki hash-lər isə əvvəlki addımdakı ilə eynidir. `drafts/`-də heç nə dəyişmədiyi üçün onun tree-si də eyni qaldı və Git onu yenidən yazmadı.

Fayl dəyişəndə onun blob-u, sonra ondan kökə qədər olan hər tree yeni hash alır, ən sonda da yeni commit yaranır. `drafts/winter.txt` dəyişsəydi, `drafts` tree-si də yenilənərdi. Vizualda yeni commit-də `spring.txt` dəyişən kimi, qalan fayllar isə parent-dəki ilə eyni kimi işarələnib.

> **Bilgi:** blob `git add` zamanı yazılır, tree və commit isə `git commit` zamanı. Ona görə stage edib commit etmədiyiniz faylın məzmunu da `.git/objects`-də olur.

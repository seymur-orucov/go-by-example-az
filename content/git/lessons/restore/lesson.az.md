`git status` dəyişmiş faylların altında `git restore` ipuclarını göstərirdi. `git restore` faylı Git-in saxladığı versiyalardan birinə qaytarır: staging area-dakına və ya bir commit-dəkinə. Komanda commit yaratmır və tarixçəyə toxunmur.

Nümunə bayram hədiyyələrinin siyahısıdır: `gifts.txt`-də kimə nə alınacağı, `budget.txt`-də ümumi büdcə yazılıb.

## Diskdəki dəyişikliyi ləğv etmək {#discard}

`gifts.txt`-ə Sam üçün sətir əlavə etmək istəyirdik, amma `>>` əvəzinə `>` yazdıq. `>` faylın üstündən yazır, ona görə köhnə sətirlər itdi. Üstəlik `budget.txt`-i səhvən sildik. `git status` iki faylı da `Changes not staged for commit` bölməsində göstərir: `deleted` silinmiş, `modified` isə dəyişmiş fayldır. Silinmə də diskdəki dəyişiklikdir. Birinci ipucunda `add/rm` yazılıb, çünki silinməni `git rm` ilə də stage etmək olur.

İkinci ipucu `git restore <file>`-dır: "discard changes in working directory", yəni diskdəki dəyişikliyi ləğv et. `git restore gifts.txt budget.txt` iki faylı staging area-dakı versiyaya qaytarır. Burada staging area son commit ilə eynidir. `cat` siyahının üç sətrini və büdcəni göstərir.

> **Diqqət:** ləğv edilən dəyişiklik heç yerdə saxlanmır: o nə commit-də, nə staging area-da olub. Onu geri qaytarmaq olmur. Əmin deyilsinizsə, əvvəlcə `git diff <fayl>` ilə nəyi itirəcəyinizə baxın.

## Staging area-dan çıxarmaq: --staged {#unstage}

Bu dəfə Sam-ı düzgün, `>>` ilə əlavə edib stage etdik. `Changes to be committed` bölməsindəki ipucu `git restore --staged <file>`-dır: "to unstage", yəni faylı staging area-dan çıxarmaq. `--staged` ilə Git faylın staging area-dakı versiyasını son commit-dəki ilə əvəz edir. Diskdəki fayla toxunmur.

`git status --short` ` M` göstərir: dəyişiklik yerindədir, amma növbəti commit-ə düşməyəcək. Vizualda `gifts.txt` working directory-də dəyişmiş qalıb, staging area isə yenə son commit ilə eynidir.

> **Bilgi:** `--staged` `git add`-ın əksidir və heç nəyi silmir. Faylı yenidən stage etmək üçün yenə `git add` yazın. Köhnə sənədlərdə eyni iş üçün `git reset <fayl>` yazılır, onu "reset --mixed" dərsində görəcəksiniz.

## git restore faylı haradan götürür {#to-index}

`gifts.txt`-i yenidən stage etdik, sonra diskdə ona `Sam: gloves` sətrini də əlavə etdik. İndi faylın üç versiyası var. Commit-də Sam yoxdur, staging area-da corab var, diskdə həm corab, həm əlcək. `git restore gifts.txt` faylı staging area-dakı versiyaya qaytarır, son commit-dəkinə yox. Ona görə yalnız əlcək sətri getdi.

Kod `M ` oldu: corab hələ stage olunub. Vizualda fərq staging area ilə son commit arasındadır, working directory isə staging area ilə eynidir.

> **Bilgi:** köhnə sənədlərdə və internetdəki cavablarda bunun üçün `git checkout -- gifts.txt` yazılır. O da faylı staging area-dan götürür. Git 2.23-dən bəri `checkout`-un bu işini `git restore`, branch-lar arasında keçməyi isə `git switch` görür.

## Hər iki sahə: --staged --worktree {#both}

Corabı da istəmirik: fayl son commit-dəki kimi olmalıdır. `--worktree` working directory deməkdir və flag-siz `git restore` elə onu dəyişir. İki flag birlikdə hər iki sahəni bərpa edir. `--staged` olanda Git faylı staging area-dan yox, son commit-dən götürür. Ona görə `git status --short` heç nə çap etmir. `cat` yenə üç sətir göstərir, Sam siyahıda yoxdur.

> **Diqqət:** bu komanda faylın həm staged, həm stage edilməmiş dəyişikliyini atır. İşə salmazdan əvvəl ikisinə birlikdə `git diff HEAD gifts.txt` ilə baxın.

## Köhnə versiyanı gətirmək: --source {#source}

Büdcəni 250 USD-ə qaldırmışdıq, amma 150 USD-ə qayıtmaq qərarına gəldik. `git log --oneline`-da büdcəni qaldıran commit ortadadır. Ən aşağıdakı ilk commit `HEAD~2`-dir və köhnə rəqəm oradadır. `--source` faylın hansı commit-dən götürüləcəyini deyir. Git `budget.txt`-in o commit-dəki versiyasını working directory-yə yazır. Başqa fayllara toxunmur, `HEAD` də yerində qalır.

Git üçün bu adi dəyişiklikdir. `git status --short` ` M budget.txt` göstərir, `git diff` isə `250 USD`-in `150 USD` ilə əvəz olunduğunu. Saxlamaq üçün onu hər dəyişiklik kimi commit edin: `git commit -am "Return to the 150 USD budget"`. Vizualda dəyişiklik yalnız working directory-dədir.

> **Bilgi:** `--source`-a qısa hash, `HEAD~N`, branch və ya tag adı vermək olar.

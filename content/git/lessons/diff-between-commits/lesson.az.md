İndiyə qədər `git diff` working directory-ni, staging area-nı və son commit-i müqayisə edirdi. Amma hər commit snapshot olduğu üçün Git istənilən iki commit-i də müqayisə edə bilər. `git diff A B` A commit-indən B commit-inə qədər nəyin dəyişdiyini göstərir. Bu, "son iki commit-də nə etmişəm?" və ya "bu fayl o vaxtdan bəri necə dəyişib?" suallarına cavab verir.

Nümunə şəhər bələdçisidir: `places.md`-də görməli yerlər, `food.md`-də yemək yerləri yazılıb. Dörd commit artıq hazırdır.

## Tarixçə {#history}

`git log --oneline` dörd commit göstərir, ən yenisi yuxarıdadır. Ən yuxarıdakı `HEAD`-dir, ondan aşağıdakı `HEAD~1`, sonra `HEAD~2`, ən aşağıdakı ilk commit isə `HEAD~3`. Mesajlardan hər commit-in nə etdiyi görünür. İlk commit iki faylı yaradıb. Sonra `places.md`-ə `River Bridge`, `food.md`-ə `Noodle Bar` əlavə olunub. Son commit `City Park`-ın adını `Central Park` edib. Vizualda eyni zəncir qraf kimi görünür, `HEAD` ən yuxarıdakı commit-dədir.

## İki commit-i müqayisə etmək {#two-commits}

`git diff HEAD~2 HEAD` iki snapshot-u müqayisə edir. Birinci ad köhnə tərəfdir (`a/`, `-` sətirləri), ikinci ad yeni tərəfdir (`b/`, `+` sətirləri). Nəticə son iki commit-in dəyişikliyidir: `food.md`-də yeni `Noodle Bar` sətri, `places.md`-də parkın yeni adı. Git bunları commit-commit göstərmir. O, aradakı commit-lərə baxmır, yalnız iki snapshot-u tutuşdurur və bir diff çap edir.

> **Bilgi:** A və B istənilən commit adı ola bilər: `git log --oneline`-dakı qısa hash, `HEAD~2` kimi ad və ya branch adı (`main`).

## Xülasə: --stat {#stat}

`--stat` diff-in özünü yox, xülasəsini göstərir. `HEAD~3` ilk commit-dir, ona görə bu komanda bələdçinin başlanğıcdan bəri necə dəyişdiyini göstərir. Hər fayl üçün bir sətir var: faylın adı, dəyişən sətirlərin sayı və `+`/`-` işarələri. `places.md | 3 ++-` deyir ki, faylda 3 sətir dəyişib: ikisi əlavə, biri silinmə.

Son sətir cəmdir. `2 files changed` iki faylın dəyişdiyini, `3 insertions(+)` üç sətrin əlavə olunduğunu, `1 deletion(-)` isə bir sətrin silindiyini bildirir. Dəyişmiş sətir əvvəlki dərslərdəki kimi bir silinmə və bir əlavə sayılır.

> **Bilgi:** çox fayl dəyişəndə əvvəlcə `--stat`-a baxın. Hansı fayllara toxunulduğunu görüb sonra lazım olan faylın diff-ini açın.

## Bir fayl və arqumentlərin sırası {#one-file}

Sondakı `-- places.md` diff-i bir fayla daraldır. `--` commit adlarını fayl adlarından ayırır: ondan sonra gələn hər şey fayl yolu kimi oxunur. Birinci komanda `places.md`-in ilk commit-dən bəri bütün dəyişikliyini göstərir. `City Park` `Central Park` olub, `River Bridge` əlavə olunub. Hunk başlığındakı `-1,3 +1,4` da bunu deyir: fayl 3 sətirdən 4 sətrə çıxıb.

İkinci komandada A və B-nin yerini dəyişdik. İndi `HEAD` köhnə tərəfdir, ilk commit isə yeni tərəf. Ona görə `-` və `+` yer dəyişib: diff faylı geriyə, ilk versiyaya aparan dəyişikliyi göstərir. Adətən əvvəl köhnə, sonra yeni commit yazılır.

> **Diqqət:** `--` olmadan da işləyir, amma fayl adı branch adı ilə eyni olsa, Git onu ayırd edə bilmir və `ambiguous argument` xətası verir. `--` bu şübhəni aradan qaldırır.

## Bir commit adı: git diff HEAD~2 {#working-dir}

`food.md`-ə `Night Market` əlavə etdik, amma commit etmədik. `git diff HEAD~2 HEAD -- food.md` yalnız `Noodle Bar`-ı göstərir, çünki o, iki commit-i müqayisə edir. Tək adla `git diff HEAD~2` isə `HEAD~2`-ni working directory ilə, yəni diskdəki fayllarla müqayisə edir. Ona görə commit olunmamış `Night Market` də diff-ə düşüb. `git diff HEAD` də eyni işi görür, sadəcə son commit ilə.

> **Diqqət:** "son iki commit-də nə dəyişib?" sualına `git diff HEAD~2 HEAD` cavab verir. `git diff HEAD~2` buna commit olunmamış dəyişiklikləri də qatır. Working directory təmiz olanda ikisinin nəticəsi eynidir.

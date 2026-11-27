Branch yeni commit-lə irəli gedir, tag isə həmişə eyni commit-də qalır. Ona görə tag-a keçəndə HEAD ayrılır və detached HEAD vəziyyəti yaranır. Köhnə versiyaya baxmaq üçün bu kifayətdir, onu düzəltmək üçün isə tag-dan branch yaradılır.

Nümunə çap üçün təqvim hazırlayan `calendar-gen` layihəsidir, onun üç buraxılışının (release) annotated tag-ı var: `v1.0`, `v1.1`, `v2.0`.

## Tag branch deyil {#switch-fails}

`git tag` üç tag göstərir. `git log --oneline --decorate` onların hansı commit-də olduğunu yazır: `(tag: v1.1)` `Add New Year's Eve` commit-inin yanındadır. `main` daha irəlidədir: `v2.0`-dan sonra da bir commit var.

`git switch v1.1` xəta verir: `a branch is expected, got tag 'v1.1'`. Bu, detached HEAD dərsindəki xətadır, yalnız `commit` yerinə `tag` yazılıb. `git switch` HEAD-i branch-a bağlayır ki, yeni commit-lər o branch-ı irəli aparsın. Tag isə irəli getmir, ona görə Git onu branch kimi qəbul etmir. `hint` sətri yolu göstərir: `--detach` seçimi.

## Köhnə versiyaya baxmaq {#detach}

`git switch --detach v1.1` işləyir. `HEAD is now at` sətrində tag-ın commit-i var: `Add New Year's Eve`. Working directory-dəki fayllar indi `v1.1`-dəki kimidir. `holidays.txt` bayramların siyahısıdır. `cat` onun `v1.1`-dəki halını çap edir, orada iki bayram var.

`git status` `HEAD detached at v1.1` yazır. Hash əvəzinə tag adı görünür, çünki HEAD-in commit-ini tag göstərir. Vizualda `HEAD` və `tag: v1.1` eyni commit-in yanındadır, `main` isə yerində qalıb.

> **Bilgi:** `git checkout v1.1` də HEAD-i tag-da ayırır, ona `--detach` lazım deyil. O, üstəlik detached HEAD haqda uzun bir izah çap edir.

## Tag-dan branch yaratmaq {#hotfix-branch}

İstifadəçi xəbər verir ki, `v1.1`-in təqvimində Yeni il gecəsi 31 dekabr yox, 13 dekabr çıxır. Bu səhvi `holidays.txt`-in ikinci sətrində gördük: `Dec 13`. `v2.0` yalnız A4 kağızda çap edir, ona görə bəzi istifadəçilər `v1.1`-də qalıb. Onlara `v2.0`-ın dəyişikliklərini yox, yalnız düzəlişi vermək lazımdır.

Düzəlişi `main`-də etsək, o, `v2.0`-ın dəyişiklikləri ilə birlikdə gələcək. Ona görə branch-ı tag-dan yaradırıq: `git switch -c hotfix/1.1.1 v1.1`. Son arqument start nöqtəsidir, branch `v1.1`-in commit-indən başlayır. Bu komanda istənilən yerdən işləyir, əvvəlcə tag-a keçmək lazım deyil.

`git branch`-da `*` `hotfix/1.1.1`-in yanındadır: HEAD yenə branch-a bağlıdır. Vizualda `HEAD → hotfix/1.1.1` və `tag: v1.1` eyni commit-dədir.

## Düzəliş və yeni tag {#fix}

`holidays.txt`-i düzəldib `git diff` ilə yoxlayırıq: `-` ilə `Dec 13` sətri silinib, `+` ilə `Dec 31` sətri gəlib. `git commit -am` dəyişikliyi commit edir. Çıxışın birinci sətrində branch adı var: `[hotfix/1.1.1 ...]`. Yəni commit branch-a düşüb, detached HEAD-dəki commit kimi branch-sız qalmayıb.

Düzəliş yeni buraxılışdır, ona görə ona da annotated tag qoyuruq: `v1.1.1`. Bu layihə sıfır patch-i tag adında yazmır, `v1.1` `1.1.0` versiyasıdır. Səhv düzəlişi patch-i artırır və `1.1.1` alınır. `git tag` indi dörd tag göstərir.

Vizualda yeni commit ayrı xətdədir, yanında `HEAD → hotfix/1.1.1` və `tag: v1.1.1` var. `tag: v1.1` isə köhnə commit-də qalıb. Branch commit ilə irəli getdi, tag yerindən tərpənmədi.

## Bütün tarixçə {#graph}

`git log --oneline --decorate --all --graph` bütün branch-ları və tag-ları bir yerdə göstərir. Ən yuxarıda düzəliş commit-i var: `HEAD -> hotfix/1.1.1, tag: v1.1.1`. Sağ xətdə `main`-in iki commit-i var, birinin yanında `tag: v2.0` yazılıb. `|/` sətri xətlərin `v1.1` commit-ində ayrıldığını göstərir. Deməli, `v2.0`-ın dəyişiklikləri `hotfix/1.1.1`-in tarixçəsində yoxdur.

`git switch main` sizi `main`-ə qaytarır. Buradakı `holidays.txt`-də hələ `Dec 13` yazılıb, çünki düzəliş yalnız `hotfix/1.1.1`-dədir. Onu `main`-ə də gətirmək üçün `git merge hotfix/1.1.1` edirsiniz, merge-i "Merge" modulunda keçmişik.

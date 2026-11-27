Commit-dən sonra səhv çox vaxt dərhal görünür: mesajda hərf səhvi var və ya bir faylı `git add` etməyi unutmusunuz. `git commit --amend` son commit-i düzəldir: staging-dəki dəyişiklikləri ona əlavə edir və istəsəniz mesajı dəyişir. Git köhnə commit-i dəyişmir: yeni commit yaradır və branch-ı ona keçirir.

Nümunə yoga studiyasının dərs cədvəlidir: `schedule.txt`-də günlər və dərslər yazılıb, ilk commit artıq var.

## Mesajda hərf səhvi {#typo}

Cədvələ çərşənbə dərsini əlavə edib commit edirik. Mesajda səhv var: `Wednsday`. `git log --oneline` iki commit göstərir, səhv mesaj birinci sətirdədir.

Commit hələ push olunmayıb, yəni yalnız bu kompüterdədir. Onu düzəltmək heç kimə mane olmur.

## Mesajı düzəltmək {#fix-message}

`git commit --amend -m` son commit-i yeni mesajla əvəz edir. Çıxışdakı `Date:` sətri commit-in ilk dəfə yarandığı vaxtdır. Amend author-u və bu tarixi köhnə commit-dən götürür, committer tarixi isə yenilənir.

`git log --oneline` yenə iki commit göstərir. İkinci sətir dəyişməyib. Birinci sətirdə mesaj düzəlib və hash başqadır. Hash commit-in mətnindən hesablanır, mesaj da bu mətnə daxildir. Ona görə amend eyni parent üzərində yeni commit yaradır və `main`-i ona keçirir.

Köhnə commit artıq branch-da deyil, vizualda da görünmür. Vizualda vurğulanan commit yenisidir. Git köhnəsini dərhal silmir, bir müddət saxlayır. Onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

> **Bilgi:** `-m` olmadan `git commit --amend` redaktor açır və köhnə mesajı orada göstərir. Mesajı düzəldib faylı saxlayırsınız və redaktoru bağlayırsınız. Bu dərsin terminalında redaktor açılmır, ona görə hər yerdə `-m` və ya `--no-edit` yazırıq.

## Unudulmuş fayl {#forgotten-file}

İndi cümə dərsini və qiymətlər faylını, `prices.txt`-i əlavə edirik. Amma `git add` yalnız `schedule.txt` üçün yazıldı. Commit mesajı qiymətlərdən danışır, `prices.txt` isə commit-də yoxdur.

`git status --short` onu `??` ilə göstərir: fayl untracked-dir. Vizualda son commit-in fayllarına baxın: orada yalnız dəyişən `schedule.txt` var.

## --no-edit: mesajı saxlamaq {#no-edit}

Unudulmuş faylı stage edib `git commit --amend --no-edit` yazırıq. Amend staging-dəki hər şeyi yeni commit-ə qoyur. `--no-edit` köhnə mesajı olduğu kimi saxlayır və redaktor açmır. Çıxışda indi `2 files changed` və `create mode 100644 prices.txt` var: fayl commit-ə düşdü.

`git log --oneline` yenə üç commit göstərir. Unudulmuş fayl üçün ayrıca commit yaranmadı. Birinci sətirdəki hash yenə dəyişib. Vizualda yeni commit-də `prices.txt` yeni fayl kimi işarələnib.

> **Diqqət:** amend staging-də nə varsa, hamısını götürür. Başqa iş üçün stage etdiyiniz fayl da bu commit-ə düşəcək. Amend-dən əvvəl `git status`-a baxın.

## Push olunmuş commit-i amend etməyin {#pushed}

`main`-i serverə göndəririk. Server burada lokal bare repository-dir, GitHub-da `To` sətrində `https://github.com/...` olardı. Sonra son commit-in mesajını yenə dəyişirik. Amend lokal `main`-i yeni commit-ə keçirdi. `origin/main` isə köhnə commit-də qaldı. Vizualda bu iki commit eyni parent-dən çıxan iki ayrı xəttdir.

`git status` `have diverged` yazır: hər tərəfdə digərində olmayan bir commit var (`1 and 1`). `git push` rədd olunur (`non-fast-forward`). Server `main`-i yeni commit-ə çəksə, köhnə commit branch-dan düşər. Push dərsində mötərizədə `fetch first` yazılmışdı: orada serverdəki commit Sam-ın repository-sində yox idi. Burada isə serverdəki commit sizdə də var, `origin/main` onu göstərir. `hint` sətri `git pull` təklif edir. Amma merge etsəniz, köhnə və yeni commit hər ikisi tarixçədə qalar və eyni dəyişiklik iki dəfə görünər.

Komandada kimsə köhnə commit-i artıq götürmüş ola bilər. Ona görə push etdiyiniz commit-i amend etməyin. Belə push-u yalnız force push qəbul etdirir, onu "Tarixçəni yenidən yazmaq" modulunda keçəcəyik.

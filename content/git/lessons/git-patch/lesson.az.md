Patch diff yazılmış mətn faylıdır. Onu e-poçtla göndərib başqa repository-də tətbiq etmək olar, ona görə push hüququ olmayan adam da dəyişiklik təqdim edə bilir. `git diff` + `git apply` yalnız faylları dəyişir, `git format-patch` + `git am` isə commit-i müəllifi və mesajı ilə köçürür.

Nümunə Sam-ın saxladığı kiçik açıq mənbə kitabxanası `lib-tiny`-dir: könüllü Ayla onu `~/ayla/lib-tiny`-ə clone edib, amma push edə bilmir.

## Diff-i fayla yazmaq {#diff-file}

`strings.sh`-də iki shell funksiyası var: `upper` və `trim`. Ayla `trim`-də səhv tapıb: o, mətnin yalnız əvvəlindəki boşluqları silir. Ayla `sed` sətrinə sondakı boşluqlar üçün ikinci əvəzetmə (`s/ *$//`) əlavə edib, amma commit etməyib.

`git diff > trim.patch` diff-i ekrana yox, `trim.patch` faylına yazır. `>` shell-in yönləndirməsidir, Git burada yeni heç nə etmir. `cat trim.patch` faylda adi diff olduğunu göstərir. Köhnə sətir `-` ilə, yeni sətir `+` ilə yazılıb. Hunk başlığının sonundakı `upper() {` dəyişiklikdən yuxarıdakı ən yaxın funksiya başlığıdır. Git onu yeri tapmağı asanlaşdırmaq üçün yazır.

Faylda müəllif də, commit mesajı da yoxdur. Ayla bu faylı Sam-a məktubla göndərə bilər.

## git apply: yalnız fayllar {#apply}

Sam öz clone-una keçir. Patch Ayla-nın qovluğundadır, ona görə yol `../ayla/lib-tiny/trim.patch`-dir. Real həyatda Sam onu məktubdan saxlayardı.

`git apply --check` patch-i tətbiq etmir, yalnız tətbiq oluna biləcəyini yoxlayır. Çıxış boşdur, deməli problem yoxdur. `git apply` dəyişikliyi `strings.sh`-ə yazır. `git status --short` ` M strings.sh` göstərir: fayl dəyişib, amma stage olunmayıb. `git log --oneline`-da hələ bir commit var. Sam bunu özü commit etsə, müəllif Sam olacaq, mesajı da o yazmalı olacaq.

Patch tətbiq olunandan sonra eyni yoxlama xəta verir: `patch failed: strings.sh:5` və `patch does not apply`. Patch 5-ci sətirdən başlayan köhnə sətirləri gözləyir, onlar isə artıq dəyişib. Patch uyğun gəlməyəndə `git apply` da heç bir faylı dəyişmir: ya patch-in hamısı tətbiq olunur, ya heç nə. Vizualda dəyişiklik yalnız working directory-dədir.

## git format-patch: commit-dən patch {#format-patch}

İndi Ayla düzəlişi commit edir. `-c user.name=...` yalnız bu dərsdə lazımdır: commit-in müəllifi Ayla olsun deyə. Ayla-nın öz kompüterində bu ad onun config-indədir.

`git format-patch -1 HEAD` son bir commit-dən patch faylı yaradır və faylın adını çap edir. `0001` sıra nömrəsidir, qalanı commit mesajından düzəlib. Fayl e-poçt məktubu formatındadır:

- Birinci sətir `From`, Ayla-nın commit-inin hash-i və `Mon Sep 17 00:00:00 2001`-dir. Bu tarix commit vaxtı deyil. O, hər patch-də eynidir və proqramlara faylın `format-patch`-dən çıxdığını tanımağa kömək edir.
- `From:` müəllifdir, `Date:` commit-in vaxtıdır, `Subject:` commit mesajıdır. Mesajın qabağına `[PATCH]` əlavə olunub.
- `---`-dan sonra `--stat`-dakı kimi dəyişən sətirlərin sayı, sonra `trim.patch`-dəki diff gəlir. Sondakı `--` sətri və Git-in versiyası məktubun imzasıdır.

> **Bilgi:** bir neçə commit üçün `git format-patch -3` (son üç commit) və ya `git format-patch origin/main..HEAD` (server-də olmayan commit-lər) yazın. Hər commit ayrıca fayl olur: `0001-...`, `0002-...`, köhnədən yeniyə.

## git am: commit Ayla-nın adı ilə {#am}

Sam əvvəlcə `git restore strings.sh` ilə `git apply`-ın dəyişikliyini geri qaytarır. Yoxsa `git am` dayanardı, çünki `strings.sh`-də commit olunmamış dəyişiklik var.

`git am` patch faylını oxuyur və ondan commit yaradır. Çıxışdakı `Applying:` sətri tətbiq olunan patch-in mövzusudur. `git log --oneline`-da yeni commit var, mesajında `[PATCH]` yoxdur.

`git log -1 --format=fuller` iki şəxsi göstərir. `Author` Ayla-dır, `AuthorDate` da patch-in `Date:` sətrindən gəlib. `Commit` isə Sam-dır, çünki commit-i onun repository-sində o yaradıb. Committer və vaxt başqa olduğu üçün yeni commit-in hash-i patch-in birinci sətrindəki hash-dən fərqlidir. Cherry-pick-də də belə idi. İndi Sam bu commit-i adi qaydada push edə bilər.

> **Diqqət:** patch tətbiq olunmasa, `git am` dayanır. `git am --abort` hər şeyi əvvəlki vəziyyətə qaytarır. `git am --3way` isə patch-i three-way merge ilə tətbiq etməyə çalışır və konflikti merge-dəki kimi göstərir.

Komandaların çoxu bu gün pull request işlədir, amma patch-lər hələ də işlənir. Linux kernel-ə və Git-in özünə dəyişikliklər patch kimi mailing list-ə, yəni layihənin e-poçt siyahısına göndərilir. Bunun üçün `git send-email` komandası var: o, `format-patch` fayllarını birbaşa məktub kimi yollayır.

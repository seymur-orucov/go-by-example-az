`git reset` hazırkı branch-ı, onunla birlikdə də HEAD-i başqa commit-ə keçirir. Reset-in üç rejimi staging area və working directory ilə nə etdikləri ilə fərqlənir. `--soft` yalnız branch-ı köçürür, geri alınan commit-lərin dəyişiklikləri isə staging area-da qalır.

Nümunə tərcüməçinin lüğətidir: `terms.csv`-də terminlər, `notes.md`-də tərcümə qeydləri var və artıq dörd commit edilib.

## Branch bir commit geri gedir {#move}

`git log --oneline` dörd commit göstərir. Son üçü bir işin hissələridir. Əvvəl `refund` termini əlavə olunub, sonra onun hərf səhvi düzəldilib, sonra ona qeyd yazılıb.

`git reset --soft HEAD~1` `main`-i `HEAD~1`-ə, yəni `Fix typo` commit-inə keçirir. Komanda heç nə çap etmir. İkinci `git log` artıq üç commit göstərir: `Add note on refund` tarixçədən çıxıb. Vizualda `HEAD → main` indi `Fix typo`-nun yanındadır. Commit zamanı Git branch-ı irəli aparır, reset isə onu istədiyiniz commit-ə, o cümlədən geriyə apara bilir.

> **Bilgi:** geri alınan commit dərhal silinmir. Git onu bir müddət saxlayır və onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

## Dəyişikliklər staging area-da qalır {#staged}

`--soft` yalnız branch-ı köçürdü, staging area və working directory olduğu kimi qaldı. Ona görə `notes.md` həm diskdə, həm də staging area-dadır, `main`-in son commit-ində isə yoxdur. Commit-in işi itmədi, sadəcə hələ commit olunmamış dəyişikliyə çevrildi.

`git status` bunu göstərir. `Changes to be committed` başlığı altındakı fayllar stage olunub və növbəti commit-ə düşəcək. `new file:   notes.md` deyir ki, bu fayl son commit-də yoxdur və commit-də yeni fayl kimi yaranacaq. Mötərizədəki sətir ipucudur: `git restore --staged` faylı staging area-dan çıxarır. Vizualda `notes.md` staging area-da `yeni` kimi işarələnib, repository-də isə son commit `Fix typo`-dur.

## İşi bitirib yenidən commit etmək {#recommit}

Bu, `--soft`-un bir istifadəsidir: commit tələsik edilib və iş hələ bitməyib. Qeydə ikinci sətri yazıb faylı yenidən stage edirik. `git commit` staging area-dakını yazır. Çıxışdakı `2 insertions(+)` deyir ki, commit-ə köhnə sətir də, yeni sətir də düşdü.

`git log` yenə dörd commit göstərir. Sonuncu yeni commit-dir: onun hash-i birinci addımdakı `Add note on refund`-un hash-indən fərqlidir. Vizualda yeni commit vurğulanıb.

> **Bilgi:** yalnız son commit-i düzəltmək üçün `git commit --amend` daha qısadır. `reset --soft` bir neçə commit-i birdən geri ala bilir.

## Üç commit-i geri almaq {#squash}

`refund` üzərindəki iş indi üç commit-dir: `Add refund`, `Fix typo` və `Add notes on refund`. Onları bir commit-də birləşdiririk. Squash merge dərsindəki kimi buna squash deyilir. Belə olanda tarixçədə bir iş üçün bir commit qalır.

`git reset --soft HEAD~3` `main`-i üç commit geri, `Start glossary`-yə keçirir. Üç commit-in dəyişiklikləri staging area-da toplanır. `git status --short` iki fayl göstərir. `A  notes.md` deyir ki, fayl `Start glossary`-də yox idi. `M  terms.csv` faylın dəyişdiyini bildirir. Bu faylda `refund` sətri artıq düzəlmiş haldadır. Staging area faylların son halını saxlayır, aradakı addımları yox. Vizualda repository-də bir commit qalıb, staging area-da isə iki fayl var.

## Bir commit yaratmaq {#squash-commit}

`git commit` staging area-dakı hər şeyi bir commit kimi yazır. Çıxışdakı `2 files changed, 3 insertions(+)` üç commit-in cəmidir: `terms.csv`-də bir sətir, `notes.md`-də iki sətir. `git log` indi iki commit göstərir və `Add refund term`-in parent-i `Start glossary`-dir.

> **Diqqət:** push etdiyiniz commit-ləri reset etməyin. Serverdə və komanda yoldaşlarınızda köhnə commit-lər qalır və tarixçələr ayrılır. Sonrakı push `non-fast-forward` ilə rədd olunur, onu yalnız force push qəbul etdirir ("Tarixçəni yenidən yazmaq" modulu). Paylaşılmış commit-i ləğv etmək üçün `git revert` var.

Növbəti dərs `--mixed` rejimidir: o, branch-la birlikdə staging area-nı da geri alır. Rejim yazılmayanda `git reset` elə `--mixed` kimi işləyir.

`git reset` hazırkı branch-ı başqa commit-ə, adətən daha köhnə birinə qaytarır. Rejim staging area və working directory-nin də həmin commit-ə uyğunlaşıb-uyğunlaşmayacağını təyin edir. Səhv seçim commit olunmamış işi silə bilər.

Nümunə tələbənin dissertasiya repository-sidir (`thesis/`, hər fəsil ayrıca fayldır): eyni başlanğıca üç rejimi ayrı-ayrı tətbiq edirik.

## Eyni başlanğıc, üç rejim {#same-start}

Repository-də üç commit var: `Add introduction`, `Add methods chapter` və `Draft results chapter`. Sonuncu commit `methods.md`-yə bir sətir əlavə edir və yeni `results.md` faylını yaradır. Nəticələr fəsli tələsik yazılıb və bu commit-i geri almaq istəyirsiniz.

Komanda hər dəfə `git reset --<rejim> HEAD~1`-dir. İlk addım üç rejimdə eynidir: `main` bir commit geri gedir və `Add methods chapter`-i göstərir. HEAD də onunla birlikdə gedir. Bundan sonra `git log --oneline` hər üç halda iki commit göstərir. `--soft` burada dayanır. `--mixed` staging area-nı da həmin commit-ə uyğunlaşdırır, `--hard` isə working directory-ni də.

Rejim yazılmasa, `git reset HEAD~1` `--mixed` kimi işləyir: default rejim odur.

## Dəyişikliklər hara düşür {#where-changes-go}

Commit geri alınanda onun dəyişiklikləri, yəni `methods.md`-dəki yeni sətir və `results.md`, harasa düşməlidir. Bunu hər rejimdən dərhal sonra `git status` göstərir:

- `--soft`: `Changes to be committed` bölməsində `modified: methods.md` və `new file: results.md`. Dəyişikliklər staged qalıb, `git commit` onları dərhal yenidən commit edər.
- `--mixed`: `methods.md` `Changes not staged for commit` bölməsindədir, `results.md` isə `Untracked files` bölməsində. Fayllar diskdə dəyişməyib, staging area isə `Add methods chapter`-dəki kimidir. `results.md` untracked olur, çünki o commit-də bu fayl yoxdur.
- `--hard`: `nothing to commit, working tree clean`. `methods.md` köhnə halına qayıdıb, `results.md` diskdən silinib.

Reset-in öz çıxışı da fərqlidir. `--soft` heç nə çap etmir. `--mixed` `Unstaged changes after reset:` başlığı ilə stage edilməmiş faylları sadalayır (burada `methods.md`). `--hard` isə `HEAD is now at` sətrində yeni commit-in qısa hash-ini və mesajını yazır.

## Nə itə bilər {#data-loss}

Reset commit-i dərhal silmir. Git onu bir müddət saxlayır və `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik. Risk commit olunmamış işdədir. `--soft` və `--mixed` working directory-yə toxunmur, ona görə diskdəki heç bir dəyişiklik itmir.

`--hard` izlənən faylları commit-dəki halına yazır. Deyək ki, reset-dən əvvəl `intro.md`-yə təşəkkür sətri əlavə etmisiniz, amma commit etməmisiniz. `--hard`-dan sonra bu sətir yoxdur. O heç bir commit-ə düşmədiyi üçün Git onu geri qaytara bilmir.

> **Diqqət:** `--hard`-dan əvvəl `git status`-a baxın. `Changes not staged for commit` və ya `Changes to be committed` bölməsində saxlamaq istədiyiniz nəsə varsa, əvvəlcə onu commit edin.

## Hansını seçmək {#choose}

Əsas sual budur: geri alınan dəyişikliklər sizə lazımdırmı? Lazım deyilsə, `--hard`. Lazımdırsa, rejimi onlarla nə edəcəyiniz seçir:

- Son bir neçə commit-i bir commit-də birləşdirmək istəyirsiniz: `git reset --soft HEAD~3`, sonra `git commit`. Dəyişikliklər artıq staged-dir, yenidən `git add` lazım deyil.
- Commit-i başqa cür bölmək istəyirsiniz, məsələn `methods.md` və `results.md` ayrı commit-lərdə olsun: `git reset HEAD~1`. Sonra hər faylı ayrıca `git add` edib commit edin.
- Commit-i və onun dəyişikliklərini tamamilə atmaq istəyirsiniz: `git reset --hard HEAD~1`.
- Lokal `main`-dəki commit-ləri atıb onu serverdəki vəziyyətə qaytarmaq istəyirsiniz: `git fetch`, sonra `git reset --hard origin/main`.

Bu siyahı push olunmamış commit-lər üçündür. Commit artıq serverdədirsə, başqaları onu çəkmiş ola bilər və reset sizin tarixçənizi onlarınkından ayırır. Belə halda `git revert` seçilir; bunu növbəti dərsdə müqayisə edəcəyik.

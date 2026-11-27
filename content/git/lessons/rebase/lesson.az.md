`git rebase` branch-ın commit-lərini başqa bir commit-in üstünə köçürür. Git hər commit-in dəyişikliyini yeni yerdə təkrar tətbiq edir və **yeni** commit yaradır: mesaj eyni qalır, hash dəyişir. Merge iki xətti merge commit ilə birləşdirir, rebase-dən sonra isə tarixçə düz xətt olur.

Nümunə muzeyin audio bələdçisinin mətnləridir (`audio-guide/`): Sam `feat/room-3` branch-ında üçüncü otağın mətnini yazır, Ayla isə `main`-də düzəliş edir.

## Hər iki branch irəliləyib {#fork}

Sam `feat/room-3` branch-ındadır. `git log --oneline --graph --all` tarixçənin iki xəttə ayrıldığını göstərir. Sam-ın xəttində iki commit var. `Add the room 3 script` yeni `room-3.txt` faylını əlavə edir. `Send visitors from room 2 to room 3` isə `room-2.txt`-in son sətrini dəyişir. Digər xəttdə Ayla-nın commit-i var, `Fix the map year in room 1`. O, `main`-dədir və `feat/room-3`-də yoxdur.

Xətlərin ayrıldığı commit, `Add the room 2 script`, iki branch-ın merge base-idir. `git merge` burada three-way merge edər və merge commit yaradardı. Rebase başqa yol seçir: Sam-ın commit-lərini `main`-in son commit-inin üstünə köçürür, sanki Sam işə indi başlayıb. Vizualda `HEAD → feat/room-3` Sam-ın son commit-indədir, `main` isə ayrı xəttdədir.

## Commit-lər yeni əsasın üstündə {#rebase}

`git rebase main` hazırkı branch-ı, yəni `feat/room-3`-ü `main`-in üstünə köçürür. Git əvvəlcə branch-da olan, amma `main`-də olmayan commit-ləri tapır: merge base-dən sonrakı iki commit. Sonra `main`-in son commit-indən başlayır və bu commit-lərin dəyişikliklərini köhnədən yeniyə doğru bir-bir tətbiq edir. Hər dəyişiklikdən yeni commit yaranır.

İş gedəndə terminalda əvvəl `Rebasing (1/2)`, sonra `Rebasing (2/2)` yazılır: hansı commit-in tətbiq olunduğunu göstərir. Bu yazılar eyni sətirdə bir-birini əvəz edir, sonda yerində yalnız son mesaj qalır. Çıxışda gördüyümüz də odur: `Successfully rebased and updated refs/heads/feat/room-3.` Rebase uğurla bitib. `refs/heads/feat/room-3` branch-ın tam adıdır: Git onu yeni commit-lərin sonuncusuna keçirib.

`git log --oneline --graph --all` indi bir düz xətt göstərir. Sam-ın commit-ləri Ayla-nın commit-indən sonra gəlir. Mesajlar birinci addımdakı kimidir, amma bu iki sətirdə hash-lər başqadır. Hash commit-in parent-indən də asılıdır. `Add the room 3 script`-in parent-i isə artıq `Fix the map year in room 1`-dir. Ona görə bunlar yeni commit-lərdir. Köhnə commit-lər heç bir branch-da deyil, vizualda da görünmür. Git onları bir müddət saxlayır; reflog dərsində onları tapacağıq.

> **Diqqət:** rebase köhnə commit-lərin yerinə yeni commit-lər qoyur. Başqalarında artıq olan commit-ləri, məsələn push etdiyiniz branch-ı, rebase etməyin. Səbəbini növbəti dərsdə görəcəyik.

## Rebase konfliktlə dayanır {#conflict}

Bu vaxt Ayla `main`-ə daha bir commit əlavə edib: `git log --oneline -1 main` onu göstərir. Ayla `room-2.txt`-in son sətrini `Next: the gift shop.` edib. Sam-ın ikinci commit-i də həmin sətri dəyişir. Sam branch-ı yenə `main`-in üstünə köçürür.

`git rebase main` birinci commit-i problemsiz tətbiq edir, ikincidə isə dayanır. `Auto-merging` və `CONFLICT (content)` sətirlərini merge konfliktindən tanıyırsınız. `error: could not apply` sətri Git-in hansı commit-i tətbiq edə bilmədiyini göstərir: qısa hash və mesaj. `hint:` sətirləri üç yol təklif edir:

- konflikti həll edib `git add` etmək, sonra `git rebase --continue` yazmaq;
- `git rebase --skip` ilə bu commit-i atlamaq, onda onun dəyişikliyi branch-a düşmür;
- `git rebase --abort` ilə rebase-i ləğv etmək və branch-ı əvvəlki vəziyyətə qaytarmaq.

Son sətir xətanı bir də təkrarlayır. `git status`-un birinci sətri `interactive rebase in progress` yazır, halbuki interactive rebase işə salmamışıq. Adi rebase də içəridə onun mexanizmi ilə işləyir; interactive rebase-i bu modulda keçəcəyik. `onto`-dan sonra yeni əsasın, yəni `main`-in son commit-inin hash-i gəlir. `Last commands done` Git-in götürdüyü commit-lərin siyahısıdır, `pick` "bu commit-i tətbiq et" deməkdir. Aşağıda tanış `both modified: room-2.txt` var.

Vizualda `feat/room-3` hələ köhnə commit-lərdədir. HEAD heç bir branch-a bağlı deyil (detached HEAD). O, `main`-in üstündəki yeni `Add the room 3 script` commit-ini göstərir. Branch yeni commit-lərə yalnız rebase bitəndə keçir. Ona görə `--abort`-dan sonra `feat/room-3` əvvəlki kimi qalır.

## Həll etmək və davam etmək {#continue}

`cat room-2.txt` konflikt markerlərini göstərir. Rebase-də tərəflərin yeri merge-dəkinin əksidir. `<<<<<<< HEAD` altında `main`-in versiyası var, `Next: the gift shop.`, çünki HEAD yeni əsasın üstündədir. `>>>>>>>` sətrində tətbiq olunan commit, yəni Sam-ın commit-i yazılıb. Onun versiyası `Next: room 3.`-dür.

Sam iki dəyişikliyi də saxlayır: `Next: room 3, then the gift shop.` Faylı `printf` ilə yenidən yazırıq, `git add` onu həll olunmuş kimi işarələyir. Rebase-i `git commit` yox, `git rebase --continue` davam etdirir. O, commit-i yaradır və növbəti commit-ə keçir; burada başqa commit qalmayıb.

Real terminalda `--continue` commit mesajı üçün redaktor açır. Mesaj hazırdır, Sam-ın köhnə commit-inin mesajıdır: faylı saxlayıb redaktoru bağlamaq kifayətdir. Bu dərsin terminalında redaktor açılmır. Ona görə komandanın əvvəlinə `GIT_EDITOR=true` yazırıq: redaktor əvəzinə heç nə etməyən `true` proqramı işləyir və mesaj olduğu kimi qalır.

`[detached HEAD ...]` sətri commit-in detached HEAD-də yarandığını göstərir. Ondan sonra `Successfully rebased` gəlir və Git `feat/room-3`-ü son yeni commit-ə keçirir. Vizualda branch yenə `main`-in üstündə düz xətt üzərindədir.

## main fast-forward ilə irəliləyir {#fast-forward}

İndi `main`-in son commit-i `feat/room-3`-ün tarixçəsindədir. Ona görə `git merge feat/room-3` fast-forward edir: `Fast-forward` sətri merge commit yaranmadığını göstərir. `main` sadəcə irəli çəkilir. Sonrakı sətirlər `main`-ə nə gəldiyini sayır: `room-3.txt` yeni fayldır (`create mode`), `room-2.txt`-də isə bir sətir dəyişib.

`git log --oneline --graph` altı commit-i bir xətt üzərində göstərir, merge commit yoxdur. Three-way merge dərsində nəticə başqa idi: tarixçədə iki xətt və onları birləşdirən commit qalmışdı. Hansı yolu nə vaxt seçmək lazım olduğunu növbəti dərsdə müqayisə edəcəyik. Vizualda `HEAD → main` və `feat/room-3` eyni commit-dədir.

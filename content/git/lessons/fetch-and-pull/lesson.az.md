Clone-dan sonra başqaları serverə yeni commit-lər göndərir, sizin repository isə bunu özü bilmir. `git fetch` yeni commit-ləri yükləyir, amma sizin branch-a birləşdirmir. `git pull` həm yükləyir, həm də birləşdirir.

Nümunə imtahana hazırlıq üçün ortaq konspektdir (`biology.md`, `history.md`), Sam və Ayla serverdəki `study-notes.git`-in öz clone-larında işləyir.

## origin/main: serverin yadda qalan halı {#tracking}

Komandalar Sam-ın clone-unda işləyir. `git branch -a` clone dərsindəki kimi `remotes/origin/main` göstərir. Bu, **remote-tracking branch**-dır: serverdəki `main`-in sizin repository-dəki izi. Komandalarda qısa yazılır: `origin/main`.

`git log` çıxışında `main` və `origin/main` eyni commit-dədir. Vizualda da belədir, `origin/main` qırıq xətli çərçivədədir. `origin/main` serverdəki `main`-in son əlaqə anında harada olduğunu yadda saxlayır. Burada son əlaqə clone idi. `origin/main` özü hərəkət etmir: server dəyişəndə sizdəki `origin/main` yerində qalır. Onun üzərində commit də etmirsiniz, onu yalnız Git yeniləyir.

Clone-dan sonra Ayla serverə yeni commit göndərib (bu, `push`-dur, onu sonra keçəcəyik). Buna baxmayaraq `git status` `Your branch is up to date with 'origin/main'` yazır. Status serverə qoşulmur, `main`-i `origin/main` ilə müqayisə edir. Ona görə bu "up to date" son əlaqə anına aiddir.

> **Bilgi:** vizualda Ayla-nın yeni commit-i yoxdur. Vizual yalnız sizin repository-də olanı göstərir, o commit isə hələ yüklənməyib.

## git fetch: yükləyir, amma birləşdirmir {#fetch}

`git fetch` serverə qoşulur, sizdə olmayan commit-ləri yükləyir və `origin/main`-i yeni yerinə keçirir. `From /home/sam/server/study-notes` haradan yüklədiyini göstərir. GitHub-da burada `https://github.com/...` kimi ünvan olardı. Növbəti sətirdəki ox (`->`) serverdəki `main`-in sizdə `origin/main`-ə yazıldığını bildirir. Sətrin əvvəlindəki iki hash `origin/main`-in köhnə və yeni yeridir.

`git status` indi fərqi görür: `Your branch is behind 'origin/main' by 1 commit`, yəni `main` bir commit geridədir. `and can be fast-forwarded` bu commit-i fast-forward ilə gətirmək mümkün olduğunu bildirir. Git `git pull` yazmağı təklif edir, onu iki addım sonra görəcəyik.

`git log`-da `origin/main` yeni commit-dədir, `HEAD -> main` isə köhnə yerində qalıb. Vizualda yeni commit və yerini dəyişən `origin/main` vurğulanıb, `HEAD → main` tərpənməyib. `ls` yalnız `biology.md` göstərir. Ayla-nın `history.md`-si repository-yə yüklənib, amma working directory-yə gəlməyib. Fetch sizin `main`-ə və fayllarınıza toxunmur.

## origin/main-i merge etmək {#merge}

`origin/main` adi branch kimi merge olunur. `git merge origin/main` `main`-i Ayla-nın commit-inə çəkir. `Updating` və `Fast-forward` sətirlərini merge dərslərindən tanıyırsınız: `main`-də yeni commit yox idi, ona görə Git onu sadəcə irəli çəkdi. `create mode` sətri `history.md`-nin working directory-yə gəldiyini göstərir.

Vizualda `HEAD → main` yeni commit-ə keçib və yenə `origin/main`-in yanındadır. `git status` yenə `up to date` yazır, çünki `main` və `origin/main` eyni commit-dədir.

## git pull = fetch + merge {#pull}

Ayla `history.md`-yə daha bir sətir əlavə edib serverə göndərib. Bu dəfə iki komanda əvəzinə `git pull` yazırıq. Çıxış iki hissədən ibarətdir. İlk iki sətir fetch-in çıxışıdır: `origin/main` yeni commit-ə keçdi. `Updating` və `Fast-forward` isə merge-in çıxışıdır: `main` də ora çəkildi.

`git pull` hazırkı branch-ın bağlı olduğu remote-tracking branch-ı fetch edib merge edir. `main` üçün bu `origin/main`-dir, bu əlaqəni clone özü qurur. Belə əlaqə *upstream* adlanır, onu push dərsində keçəcəyik. `git log`-da `HEAD -> main`, `origin/main` və `origin/HEAD` yenə bir commit-dədir. Vizualda `origin/main` və `HEAD → main` birlikdə yeni commit-ə keçib.

## Hər iki tərəfdə yeni commit {#diverged}

Sam `history.md`-yə sətir əlavə edib commit edir. Eyni vaxtda Ayla `biology.md`-yə `mitosis` yazıb serverə göndərib. İndi Sam-ın `main`-ində serverdə olmayan commit var, serverdə isə Sam-da olmayan commit. Bu, three-way merge dərsindəki vəziyyətdir, sadəcə ikinci tərəf `origin/main`-dir.

Adi `git pull` burada dayanır: `fatal: Need to specify how to reconcile divergent branches.` Ayar olmadan `git pull` yalnız fast-forward edir, burada isə fast-forward mümkün deyil. `hint` sətirləri üç seçimi sadalayır: merge (`pull.rebase false`), rebase (`pull.rebase true`) və yalnız fast-forward (`pull.ff only`). Fetch hissəsi isə işləyib: ilk iki sətrə görə `origin/main` artıq Ayla-nın commit-indədir.

`git pull --no-rebase` bu dəfə üçün merge seçir. `--no-edit` merge dərsindəki kimidir: o olmadan Git mesaj üçün redaktor açır. `From` sətri yoxdur, çünki yeni commit artıq yüklənib. Git merge commit yaratdı, mesajı `Merge branch 'main' of /home/sam/server/study-notes`-dir. Vizualda onun iki parent-i var: Sam-ın commit-i və Ayla-nın commit-i. `origin/main` Ayla-nın commit-ində qalıb. `git status` `ahead of 'origin/main' by 2 commits` yazır: Sam-ın commit-i və merge commit serverdə hələ yoxdur.

> **Bilgi:** seçimi hər dəfə yazmamaq üçün ayarda saxlayın: `git config pull.rebase false` bu repository üçün, `--global` ilə bütün repository-lər üçün. `git pull --rebase` isə merge commit yaratmır, sizin commit-ləri `origin/main`-in üstünə köçürür; rebase-i ayrıca modulda keçəcəyik.

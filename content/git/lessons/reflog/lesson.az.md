`git reset --hard`, `git branch -D`, amend və ya rebase-dən sonra commit `git log`-da görünmür, amma Git onu dərhal silmir. **Reflog** (reference log, istinadların jurnalı) HEAD-in və branch-ların hər yerdəyişməsini yazır. Bu jurnalda itmiş commit-i tapıb ona yenidən branch bağlamaq olar.

Nümunə hekayə əlyazmasıdır: `story/` qovluğunda hər fəsil ayrıca fayldır (`chapter-1.md` və s.), sonluğun bir variantı isə `sad-ending` branch-ındadır.

## HEAD-in jurnalı: git reflog {#entries}

`git log --oneline` `main`-in dörd commit-ini göstərir. `git reflog` isə HEAD-in olduğu bütün yerləri göstərir, ən yenisi yuxarıdadır. Hər sətir üç hissədən ibarətdir. Əvvəlcə HEAD-in həmin anda göstərdiyi commit-in qısa hash-i gəlir, sonra `HEAD@{n}`, sonra isə nə baş verdiyi.

`HEAD@{n}` HEAD-in n hərəkət əvvəlki yeridir. `HEAD@{0}` indiki yerdir, `HEAD@{1}` bir hərəkət əvvəlki. `HEAD~n`-dən fərqi budur: `~` parent-lər üzrə geri gedir, `@{n}` isə jurnal üzrə.

Sətrin sonu hərəkətin növünü yazır. `commit (initial)` ilk commit-dir, `commit:` adi commit. `checkout: moving from main to sad-ending` branch dəyişmədir: `git switch` də jurnala `checkout` kimi düşür. Reflog-da yeddi sətir var, `git log`-da isə dörd. `Try a sad ending` və iki branch keçidi `main`-in tarixçəsində yoxdur. `Add chapter 2`-nin hash-i üç sətirdə təkrarlanır: branch dəyişəndə HEAD həmin commit-də qalmışdı.

## Reset ilə iki commit-i itirmək {#lose}

`git reset --hard HEAD~2` `main`-i iki commit geri, `Add chapter 2`-yə keçirir. `git log --oneline` artıq iki commit göstərir. Vizualda `Add chapter 3` və `Add chapter 4` yoxdur, çünki heç bir branch onları göstərmir.

`git reflog -3` jurnalın son üç sətrini çap edir. Ən yuxarıda yeni sətir var: `reset: moving to HEAD~2`. Köhnə sətirlər bir pillə aşağı düşüb. `Add chapter 4` indi `HEAD@{1}`-dir, `Add chapter 3` isə `HEAD@{2}`. Commit-lər silinməyib, reflog onları hələ göstərir.

> **Diqqət:** reflog yalnız commit-ləri göstərir. Commit olunmamış dəyişiklik heç bir commit-də olmayıb. `git reset --hard` onu silibsə, reflog-da onu tapmaq olmur.

## Reset-dən əvvəlki yerə qayıtmaq {#recover}

`HEAD@{1}` reset-dən əvvəlki yerdir, yəni `Add chapter 4`. `git reset --hard HEAD@{1}` `main`-i ora qaytarır. `git log --oneline` yenə dörd commit göstərir. Vizualda iki fəsil geri gəlib.

Bərpa da HEAD-in hərəkətidir və jurnala düşür. `git reflog -2`-nin birinci sətri `reset: moving to HEAD@{1}`-dir. Köhnə sətirlər yenə bir pillə aşağı düşdü. Rəqəm hər hərəkətdən sonra dəyişir. Ona görə `HEAD@{n}` yazmazdan əvvəl `git reflog`-a baxın.

> **Bilgi:** `main`-i yerindən tərpətmək istəmirsinizsə, itmiş commit-də yeni branch yaradın: `git branch rescue HEAD@{1}`. Commit-lər `rescue` branch-ında qalır, `main` isə olduğu yerdə.

## Silinmiş branch {#delete-branch}

Kədərli sonluq lazım olmadı və `sad-ending` `-D` ilə silinir. `Try a sad ending` `main`-ə merge olunmamışdı, ona görə vizualdan da çıxdı. Çıxışdakı `(was ...)` mötərizəsində branch-ın son commit-inin qısa hash-i var. Bu terminal açıq qalıbsa, hash-i oradan götürmək olar.

Hash yadda qalmayıbsa, `git reflog`-a baxırıq. `branch -D` HEAD-i tərpətmir, ona görə jurnala yeni sətir düşməyib. `commit: Try a sad ending` sətri `HEAD@{5}`-dir. Bu commit HEAD-in jurnalındadır, çünki onu yaradanda HEAD `sad-ending`-də idi.

## Branch-ı bərpa etmək və branch-ın öz jurnalı {#restore-branch}

Fikrinizi dəyişirsiniz və kədərli sonluğu qaytarırsınız. `git branch sad-ending HEAD@{5}` həmin commit-də yeni branch yaradır. Vizualda `sad-ending` öz commit-i ilə geri qayıdıb. Commit eynidir, onun hash-i dəyişməyib.

`git reflog show <branch>` bir branch-ın öz jurnalını göstərir. Sətirlərdə `HEAD@{n}` yerinə `sad-ending@{0}`, `main@{3}` kimi adlar var. `sad-ending`-in jurnalında bir sətir var: `branch: Created from HEAD@{5}`. Köhnə jurnal branch silinəndə onunla birlikdə silindi. Ona görə silinmiş branch-ı HEAD-in jurnalında axtarırıq. `main`-in jurnalında `checkout` sətirləri yoxdur: branch dəyişmə HEAD-i tərpədir, `main`-i yox.

Reflog `.git` qovluğunda saxlanır və yalnız sizin kompüterinizdədir. Push onu serverə göndərmir. Clone olunan repository-də jurnal clone anından başlayır.

> **Bilgi:** reflog-un köhnə sətirləri vaxtla silinir. Ayarlar dəyişməyibsə, adi sətirlər 90 gün qalır (`gc.reflogExpire`). Branch-dan çıxmış commit-lərin sətirləri isə 30 gün qalır (`gc.reflogExpireUnreachable`). Sətir silinəndən sonra Git commit-in özünü də silə bilər.

## Rebase-i geri qaytarmaq {#rebase}

Rebase dərsində rebase-dən sonra köhnə commit-lərin bir müddət qaldığını demişdik. İndi onları tapırıq. Sam kədərli sonluğu dördüncü fəsildən sonra oxumaq istəyir. O, `sad-ending`-ə keçir və onu `main`-in üstünə rebase edir.

`git reflog -4` rebase-in jurnala yazdığı sətirləri göstərir. `rebase (start)` HEAD-in `main`-in son commit-inə keçdiyi andır. `rebase (pick)` köçürülmüş commit-dir, onun hash-i yenidir. `rebase (finish)` branch-ın yeni commit-ə keçdiyini bildirir. Rebase-dən əvvəlki yer `HEAD@{3}`-dür, yəni `checkout: moving from main to sad-ending` sətri.

Branch-ın öz jurnalında axtarmaq daha asandır. Rebase `sad-ending`-i bir dəfə tərpədir, ona görə onun jurnalına bir sətir düşüb. `sad-ending@{1}` rebase-dən əvvəlki commit-dir. Sam fikrini dəyişir və `git reset --hard sad-ending@{1}` ilə branch-ı ora qaytarır. `git log`-da `Try a sad ending` yenə `Add chapter 2`-nin üstündədir. Vizualda da branch köhnə yerinə qayıdıb.

Amend və detached HEAD-dən sonra da yol eynidir. Amend jurnala `commit (amend): ...` sətri yazır, köhnə commit isə `HEAD@{1}`-dir. Detached HEAD-də commit edib branch-a qayıtmısınızsa, jurnalda `checkout: moving from <hash> to main` sətri olur. Ondan bir aşağıdakı sətir itən commit-dir.

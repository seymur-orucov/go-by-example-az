Əvvəlki modulda `git diff A B` iki commit-i müqayisə etdi, A və B branch adı da ola bilərdi. Branch `main`-dən ayrılıb hər ikisi irəliləyəndə iki sual yaranır: branch-da hansı yeni commit-lər var və branch `main`-ə nə gətirir. Git bunlara `..` (iki nöqtə) və `...` (üç nöqtə) ilə cavab verir, amma `git log` və `git diff` iki nöqtəni fərqli oxuyur.

Nümunə konfrans çıxışının planıdır: demo bölməsi `feat/demo` branch-ında hazırlanır, bu vaxt `main`-də çıxışın müddəti dəyişib.

## Ayrılan tarixçə {#history}

`outline.md`-də çıxışın bölmələri, `slides.txt`-də slaydlar yazılıb. `--all` bütün branch-ların commit-lərini, `--graph` isə onların xətlərini göstərir. İlk iki commit ortaqdır. `Add the first slides`-dan sonra tarixçə ikiyə ayrılır. Sağdakı xəttdə `feat/demo`-nun iki commit-i var, soldakı xəttdə `main`-in bir commit-i. `|/` sətri sağ xəttin ayrıldığı yeri göstərir. `--decorate` mötərizədə branch adlarını yazır, `HEAD -> main` isə bizim `main`-də olduğumuzu bildirir. Vizualda iki branch iki sütunda görünür.

## Branch-da hansı commit-lər var: log main..feat/demo {#log-range}

`git log main..feat/demo` `feat/demo`-nun tarixçəsində olan, amma `main`-in tarixçəsində olmayan commit-ləri göstərir. Bunlar demo üçün yazılmış iki commit-dir. Ortaq iki commit siyahıda yoxdur, çünki onlar hər iki branch-dadır.

Adların yerini dəyişəndə sual da dəyişir. `feat/demo..main` `main`-də olub branch-da olmayan commit-i göstərir: branch yarandıqdan sonra gələn `Shorten the talk to 15 minutes`. `A..B`-ni belə oxuyun: "B-də var, A-da yox".

## İki snapshot: diff main feat/demo {#two-snapshots}

`git diff main feat/demo` commit-lər arası fərqdəki kimi iki snapshot-u müqayisə edir. `main`-in son commit-i köhnə tərəfdir, `feat/demo`-nun son commit-i yeni tərəf. `+4. Live demo` və `+Demo: git log` branch-ın öz dəyişiklikləridir.

Amma diff-də `-# Git in 15 minutes` və `+# Git in 20 minutes` sətirləri də var. Branch başlığa toxunmayıb. Başlığı `main` dəyişib, `feat/demo`-da isə köhnə başlıq qalıb. Ona görə bu diff-də `main`-in yeni dəyişikliyi tərsinə görünür, sanki branch başlığı geri qaytarıb.

İkinci komanda, `git diff main..feat/demo`, eyni çıxışı verir. `git diff`-də iki nöqtə boşluqla eynidir.

> **Diqqət:** `..` `git log`-da və `git diff`-də fərqli işləyir. `git log main..feat/demo` commit siyahısıdır: branch-da olub `main`-də olmayanlar. `git diff main..feat/demo` isə iki snapshot-u müqayisə edir və `main`-in öz dəyişikliklərini də göstərir.

## Yalnız branch-ın dəyişikliyi: diff main...feat/demo {#three-dots}

Üç nöqtə ilə `git diff main...feat/demo` `feat/demo`-nu `main`-in son commit-i ilə yox, merge base ilə müqayisə edir. Merge base iki branch-ın son ortaq commit-idir, burada `Add the first slides`; onu Merge modulunda ətraflı görəcəyik. Ona görə diff-də yalnız branch-ın etdiyi dəyişikliklər qalıb: `4. Live demo` və `Demo: git log`. Başlıq sətri diff-də yoxdur. `outline.md`-in hunk başlığı `@@ -2,3 +2,4 @@` da birinci sətirdən yox, ikincidən başlayır.

GitHub-da pull request-in "Files changed" bölməsi də belə diff göstərir. Orada branch-ın gətirdiyi dəyişikliklər görünür, `main`-ə sonradan gələnlər görünmür.

> **Bilgi:** bir adı buraxsanız, Git onun yerinə `HEAD` götürür. `feat/demo`-da olanda `git diff main...` yazmaq kifayətdir.

## Branch-ın həcmi: --stat {#stat}

`--stat` branch adları ilə də işləyir. Birinci komanda iki snapshot-u sayır. `outline.md | 3 ++-` sətrində başlıq bir silinmə və bir əlavə sayılıb, üstəlik `4. Live demo` əlavə olunub. Cəm `3 insertions(+), 1 deletion(-)`-dir.

Üç nöqtə ilə hər faylda bir əlavə qalır: `2 insertions(+)`, silinmə yoxdur. Branch-ın həcmini bu ikinci rəqəmlər düz göstərir.

> **Bilgi:** branch-ı yoxlayanda əvvəlcə `git log --oneline main..feat/demo` ilə commit-lərə, sonra `git diff --stat main...feat/demo` ilə fayllara baxın. Lazım olan faylın diff-ini sonra açın.

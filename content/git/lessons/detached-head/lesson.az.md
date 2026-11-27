Adətən HEAD branch-ı göstərir, branch isə son commit-i. HEAD branch-ı yox, commit-i birbaşa göstərəndə bu vəziyyətə **detached HEAD** (ayrılmış HEAD) deyilir. Orada köhnə fayllara baxmaq, hətta commit etmək olur, amma yeni commit heç bir branch-a düşmür və oradan çıxanda itə bilər.

Nümunə mahnı sözləri kolleksiyasıdır: `songs` repository-sində `lyrics.txt` faylı və üç commit var.

## Köhnə commit-ə keçmək {#detach}

`git log --oneline` üç commit göstərir. Mahnının ilk variantına, yalnız birinci bənd olan commit-ə qayıtmaq istəyirik. Bu commit `HEAD~2`-dir. `git switch HEAD~2` xəta verir: `a branch is expected, got commit 'HEAD~2'`. `git switch` branch adı gözləyir, `HEAD~2` isə commit-dir. `hint` sətri `--detach` seçimini təklif edir.

`git switch --detach HEAD~2` işləyir. `HEAD is now at` sətri HEAD-in indi hansı commit-də olduğunu göstərir. `cat lyrics.txt` faylın o commit-dəki halını çap edir: yalnız birinci bənd. Vizualda `HEAD` yazısı köhnə commit-in yanındadır, `main` isə yerində qalıb.

> **Bilgi:** `git checkout HEAD~2` (və ya `git checkout <hash>`) da HEAD-i ayırır. `--detach` olmadan o, uzun bir izah da çap edir. Orada commit-ləri saxlamaq üçün `git switch -c <new-branch-name>`, geri qayıtmaq üçün `git switch -` təklif olunur. Tag-a keçəndə də HEAD ayrılır; tag-ları sonra keçəcəyik.

## HEAD-də hash var {#look}

`cat .git/HEAD` indi `ref: refs/heads/main` yox, commit-in tam hash-ini çap edir. HEAD branch-ı yox, birbaşa commit-i göstərir. "Detached" adı buradandır: HEAD branch-dan ayrılıb.

`git status` ilk sətirdə `On branch main` əvəzinə `HEAD detached at` və commit-in qısa hash-ini yazır. `git branch` siyahısında `*` heç bir branch-ın yanında deyil. O, `(HEAD detached at ...)` sətrinin yanındadır. `main` əvvəlki kimi son commit-i göstərir.

## Detached HEAD-də commit {#commit}

Birinci bəndin ardınca başqa nəqərat yazıb commit edirik. Commit alınır, amma çıxışın birinci sətrində branch adı yerinə `detached HEAD` yazılıb. Git yeni commit-i yaratdı və yalnız HEAD-i ona keçirdi, heç bir branch yerindən tərpənmədi.

`git branch` indi `detached at` yox, `detached from` yazır. HEAD ayrıldığı commit-dən (`Add first verse`) irəli gedib. Vizualda `Try a quiet chorus` ayrı xətdədir və onu yalnız `HEAD` göstərir.

## Commit-i branch ilə saxlamaq {#save}

`Try a quiet chorus`-a gedən yol yalnız HEAD-dən keçir. HEAD başqa yerə keçsə, heç nə bu commit-i göstərməyəcək. Ona görə çıxmazdan əvvəl branch yaradırıq: `git switch -c quiet-chorus`. Branch HEAD-in olduğu commit-dən yaranır və HEAD ona keçir.

`cat .git/HEAD` yenə `ref:` sətri çap edir, bu dəfə `refs/heads/quiet-chorus`. `git branch`-da `*` `quiet-chorus`-un yanındadır. Vizualda `HEAD → quiet-chorus` görünür: HEAD artıq ayrılmış deyil.

`git branch quiet-chorus` da commit-i saxlayardı, amma HEAD ayrılmış qalardı. `git switch -c` isə həm branch yaradır, həm də sizi ona keçirir.

## Branch yaratmadan çıxanda {#leave}

İndi səhv yolu göstəririk. `main`-ə qayıdırıq, `HEAD~1`-ə (`Add chorus`) keçirik, körpü (bridge) sətri əlavə edib commit edirik. Commit `-q` ilə edilib, ona görə heç nə çap etmir. Sonra branch yaratmadan `main`-ə qayıdırıq.

Git keçidi edir, amma əvvəlcə xəbərdarlıq yazır: `you are leaving 1 commit behind, not connected to any of your branches`. Yəni bir commit geridə qalır və heç bir branch-a bağlı deyil. Sonra həmin commit-in qısa hash-i və mesajı gəlir (`Try a bridge`). Git onu saxlamaq üçün hazır komanda da təklif edir: `git branch <new-branch-name>` və həmin hash. `<new-branch-name>` yerinə öz branch adınızı yazırsınız.

Vizualda `Try a bridge` görünmür, çünki vizual yalnız branch-lardan, tag-lardan və HEAD-dən gedib çatılan commit-ləri göstərir. Commit dərhal silinmir, amma Git-in avtomatik təmizləməsi (`git gc`) belə commit-ləri bir müddət sonra silir.

> **Diqqət:** bu xəbərdarlığı görəndə hash-i dərhal götürüb `git branch <ad> <hash>` yazın. Hash-i itirsəniz, commit-i `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

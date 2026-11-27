Tarixçənin forması işin `main`-ə necə gətirildiyindən asılıdır. **Xətti** (*linear*) tarixçədə `main`-in hər commit-inin bir parent-i var və `git log --oneline --graph` düz xətt çəkir. **Qeyri-xətti** tarixçədə iki parent-li merge commit-lər var və qrafda branch-lar ayrıca xətt kimi görünür.

Nümunə `tinydate` adlı kiçik open-source kitabxanadır: o, tarixləri `2026-01-15` və ya `3 days ago` kimi formatlayır.

## Formanı merge üsulu müəyyən edir {#two-shapes}

Kitabxananı Sam və Ayla aparır. Onlar maintainer-dir, yəni dəyişiklikləri `main`-ə qəbul edən adamlardır. Kənar iştirakçılar dəyişikliyi branch-da hazırlayıb pull request ilə, yəni `main`-ə qəbul etmək təklifi ilə göndərir. İndi `main`-ə iki branch gəlməlidir. `fix/leap-year`-da bir commit var: `Fix leap year`. `feat/relative-time`-da iki commit var: `Add relative time` və `Test relative time`. İki branch eyni vaxtda `main`-in son commit-indən, `Add format()`-dan ayrılıb.

Xətti tarixçəni üç yol verir. Fast-forward branch-ın commit-lərini olduğu kimi `main`-in ucuna qoyur. Branch `main`-dən geri qalıbsa, onu əvvəlcə rebase edirsiniz və fast-forward yenə mümkün olur. Squash merge isə branch-ın bütün işini bir yeni commit kimi gətirir. Hər üç halda `git log --oneline --graph` hər sətirdə bir `*` göstərir və budaq olmur.

Qeyri-xətti tarixçəni merge commit verir: three-way merge və ya `--no-ff`. Hər merge commit qrafda "Fast-forward və --no-ff" dərsindəki kimi qabarcıq yaradır. Bu iki branch paralel yazıldığı üçün onların xətləri yanaşı gedir və bir-birinin üstündən keçir.

## Xətti tarixçə: oxumaq asandır {#linear}

Deyək ki, hər iki branch squash merge ilə gəlib. `git log --oneline` `main`-də üç sətir göstərir: `Add relative time`, `Fix leap year`, `Add format()`. Hər sətir bir dəyişiklikdir və onlar `main`-ə düşdükləri sıra ilə düzülüb. Yeni versiyanın dəyişiklik siyahısını (*changelog*) yazmaq üçün bu çıxışı oxumaq kifayətdir.

Hər commit-in bir parent-i olduğu üçün geri almaq da sadədir: `git revert <commit>` `-m`-siz işləyir. Squash merge-də bir commit bütöv dəyişiklikdir, ona görə nisbi vaxt formatı bir revert ilə geri gedir. Səhvi yaradan commit-i axtaranda da commit-lər bir sırada durur; bunu "Faydalı alətlər" modulunda `git bisect` ilə edəcəyik.

Bunun qiyməti kontekstdir. Squash-dan sonra branch-dakı ayrı addımlar görünmür. Rebase və fast-forward ilə addımlar qalır. Amma feature-in harada başlayıb harada bitdiyi tarixçədən oxunmur.

## Qeyri-xətti tarixçə: kontekst qalır {#non-linear}

İndi eyni iki branch merge commit ilə gəlib. Merge commit hansı branch-ın birləşdirildiyini (`Merge branch 'feat/relative-time'`) və bunun nə vaxt olduğunu saxlayır. Qrafda iki branch-ın paralel yazıldığı da görünür. Feature-in bütün commit-ləri onun budağındadır.

Adi `git log --oneline` isə burada çətin oxunur. O, commit-ləri tarixə görə düzür və müxtəlif branch-ların commit-lərini qarışdırır. `Fix leap year` `Add relative time` ilə `Test relative time` arasında yazılıbsa, çıxışda da onların arasına düşür. Ona görə belə tarixçəyə `--graph` və ya `--first-parent` ilə baxırlar. `--first-parent` yalnız `main`-in öz xəttini göstərir və orada hər feature bir merge commit-dir. Feature-i bütövlükdə geri almaq üçün `git revert -m 1` kifayətdir. İkisini də "Fast-forward və --no-ff" dərsində görmüşdük.

Bunun qiyməti əlavə commit-lərdir. Hər merge tarixçəyə bir commit əlavə edir. İştirakçı öz branch-ını yeniləmək üçün `main`-i ona merge edəndə tarixçəyə `Merge branch 'main' into feat/relative-time` kimi commit-lər də düşür. Onlar heç bir iş haqqında məlumat vermir.

## Komanda üçün seçim {#choose}

Seçim tarixçəni kimin oxuyacağından və orada nə axtaracağından asılıdır. Cədvəldə yaşıl xana həmin aspektdə üstün olan formanı göstərir.

`tinydate`-ə gələn dəyişikliklərin çoxu kiçikdir: bir fix və ya bir yeni format. Kənar iştirakçıların branch-larında isə tez-tez `fix typo`, `wip` kimi commit-lər olur. Sam və Ayla squash merge seçir: `main` xətti qalır və hər commit bir pull request-dir. Böyük layihədə isə branch-lar həftələrlə yaşayır və bir neçə komanda paralel işləyir. Orada hansı işin nə vaxt birləşdiyini görmək lazım olur və merge commit-lər saxlanır.

Ara yol da var. Branch əvvəlcə rebase olunur, sonra `--no-ff` ilə merge olunur. Onda `main`-in xətti düz qalır, hər feature isə onun yanında ayrıca budaqdır. Budaqlar bir-birinin üstündən keçmir, çünki hər biri əvvəlki merge-dən başlayır.

## Seçimi serverdə qoymaq {#enforce}

"Fast-forward və --no-ff" dərsindəki `git config merge.ff only` lokal olaraq təsadüfi merge commit-in qarşısını alır. Amma bu ayar yalnız sizin kompüterinizdədir və yeni iştirakçı onu bilməyəcək. Ona görə qaydanı serverdə qoyurlar.

GitHub-da repository-nin **Settings** səhifəsində **Pull Requests** bölməsi var. Orada üç seçim durur: **Allow merge commits**, **Allow squash merging** və **Allow rebase merging**. Yalnız birini saxlasanız, pull request-in merge düyməsi yalnız o üsulu təklif edir. `tinydate` yalnız **Allow squash merging**-i saxlayır.

`main` üçün branch qorunma qaydasında (*branch protection rule*) **Require linear history** seçimi də var. GitHub sənədlərinə görə o, branch-a merge commit push etməyi qadağan edir. Onda pull request-lər yalnız squash və ya rebase ilə merge olunur. Bu seçimi açmaq üçün repository squash və ya rebase merge-ə icazə verməlidir. Pull request-ləri "Komanda işi" modulunda keçəcəyik.

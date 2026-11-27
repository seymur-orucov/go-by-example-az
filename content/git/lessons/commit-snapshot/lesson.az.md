Əvvəlki dərslərdə commit yaratdıq, amma onun içinə baxmadıq. Commit dəyişikliklərin siyahısı (diff) deyil: o, layihənin həmin andakı bütün fayllarının **snapshot**-udur. Hər commit-in unikal adı, yəni **hash**-i var və hər commit özündən əvvəlkini, yəni **parent**-ini göstərir. Commit-lər bu istinadlarla zəncir qurur və tarixçə məhz bu zəncirdir.

Nümunə həftəlik idman planıdır: `plan.txt`-də günlər, `goals.txt`-də məqsəd yazılıb.

## Commit-in içi {#first-commit}

İki faylı stage edib ilk commit-i yaradırıq. Çıxışın birinci sətrindəki qısa kod commit-in hash-idir. `git cat-file -p` Git-in saxladığı obyekti göstərir; `HEAD` burada "son commit" deməkdir (onu ayrıca dərsdə keçəcəyik).

Commit kiçik bir mətndir:

- `tree` — snapshot-un özü: commit-dəki faylların siyahısının hash-i;
- `author` — dəyişikliyi kim yazıb və nə vaxt (rəqəm 1970-ci ildən keçən saniyələrdir, `+0000` saat qurşağıdır);
- `committer` — commit-i kim yaradıb; adətən author ilə eynidir;
- boş sətirdən sonra commit mesajı.

`parent` sətri yoxdur: bu, repository-nin ilk commit-idir (*root commit*), ondan əvvəl heç nə olmayıb. Vizualda da "parent yoxdur" yazılıb.

> **Bilgi:** Git hash-i commit-in bu mətnindən hesablayır və tam hash 40 simvoldur. Çıxışdakı 7 simvol onun qısa formasıdır: repository-də eyni simvollarla başlayan ikinci obyekt olmadıqca, Git qısa formanı da başa düşür.

## Snapshot: commit-dəki bütün fayllar {#snapshot}

`git ls-tree HEAD` commit-in tree-sini, yəni snapshot-dakı faylları göstərir (`--abbrev` hash-ləri qısa yazır). Hər sətirdə: `100644` — adi fayl, `blob` — faylın məzmunu, sonra bu məzmunun hash-i və faylın adı. Git hər faylın məzmununu ayrıca obyekt (blob) kimi saxlayır və ona da məzmundan hash verir: eyni məzmun həmişə eyni hash alır.

## Parent: əvvəlki commit-ə istinad {#parent}

Plana çərşənbə gününü əlavə edib ikinci commit-i yaradırıq. `git cat-file -p HEAD` çıxışında indi yeni sətir var: `parent`. Orada ilk commit-in tam hash-i yazılıb; onun ilk 7 simvolu birinci addımın çıxışındakı qısa hash ilə eynidir.

İstinad bir istiqamətdədir: yeni commit öz parent-ini bilir, parent isə ondan sonra gələn commit-lər haqqında heç nə saxlamır. `tree` sətri də dəyişib, çünki `plan.txt` dəyişdiyi üçün snapshot artıq başqadır.

## Snapshot, diff deyil {#same-files}

`git ls-tree` yenə iki fayl göstərir, halbuki bu commit-də yalnız `plan.txt`-i dəyişdik. Commit "nə dəyişdi"ni yox, "layihə indi necədir"i yazır, ona görə dəyişməyən `goals.txt` də snapshot-dadır.

Bu, hər commit-də hər faylın yeni surəti demək deyil. `goals.txt` sətrindəki blob hash-i əvvəlki addımdakı ilə eynidir: məzmun dəyişmədiyi üçün Git onu yenidən saxlamır, yeni tree köhnə blob-a istinad edir. `plan.txt`-in hash-i isə dəyişib.

Vizualda hər commit-in faylları rənglə işarələnib: yaşıl — yeni fayl, sarı — dəyişib, qırıq xətli — parent-dəki ilə eyni.

> **Bilgi:** `git diff` göstərdiyi fərqi Git saxlamır: lazım olanda iki snapshot-u müqayisə edib hesablayır.

## Commit qrafı {#chain}

Üçüncü commit yeni fayl, `log.txt` əlavə edir. İndi üç commit var və hər biri öz parent-ini göstərir: ən yenisi ortadakını, ortadakı isə ilk commit-i. Bu istinadlar **commit qrafı** adlanır. Vizualda ən yeni commit yuxarıdadır, `HEAD → main` də ondadır: `main` branch-ı son commit-i göstərir (branch-ları ayrıca modulda keçəcəyik).

Hələlik qraf düz xəttdir. Branch-larla işləyəndə o budaqlanır: bir commit-dən iki ayrı xətt çıxa bilər, merge commit-in isə iki parent-i olur.

Parent-in hash-i commit-in mətninə daxildir. Ona görə köhnə commit-də nəyisə dəyişsəniz (hətta yalnız mesajını), onun hash-i dəyişir, ondan sonrakı commit-lərin `parent` sətirləri və hash-ləri də dəyişməli olur. Tarixçəni hash-lər dəyişmədən gizlicə düzəltmək mümkün deyil.

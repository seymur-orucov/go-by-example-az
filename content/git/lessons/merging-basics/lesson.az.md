Branch-da iş bitəndə onun commit-lərini əsas xəttə gətirmək lazımdır. Bunu `git merge` edir: başqa branch-ın commit-lərini **hazırkı** branch-a birləşdirir. Commit-ləri qəbul edən branch-a *target* (hədəf), verən branch-a isə *source* (mənbə) deyilir.

Nümunə musiqi qrupunun konsert siyahısıdır (`setlist/`): `songs.txt`-də mahnılar, `gear.txt`-də alətlər yazılıb.

## Merge-dən əvvəl: tarixçə {#branch-ahead}

`main`-də çalmağa hazır siyahı durur, yeni mahnılar isə ayrıca branch-da hazırlanır. `encore` branch-ında iki commit var: siyahının sonuna iki encore mahnısı əlavə olunub. Encore konsertin sonunda tamaşaçı istəyəndə çalınan əlavə mahnıdır. `main` hələ ilk commit-dədir. `HEAD -> encore` isə hazırda `encore`-da olduğumuzu göstərir.

Mahnılar məşq olunub, indi onları `main`-ə gətirmək istəyirik. Burada `main` target-dir, `encore` isə source.

## Target-ə keçib merge etmək {#merge}

`git merge` commit-ləri hazırkı branch-a yazır. Ona görə əvvəlcə `git switch main` ilə commit-ləri qəbul edəcək branch-a keçirik. Sonra `git merge encore` `encore`-un commit-lərini `main`-ə gətirir. Qayda həmişə belədir: əvvəlcə target-ə keçin, sonra `git merge <source>` yazın.

Çıxışın birinci sətri, `Updating`, `main`-in hansı commit-dən hansına keçdiyini iki qısa hash ilə göstərir. `Fast-forward` o deməkdir ki, `main`-də yeni commit yox idi və Git `main`-i sadəcə irəli çəkdi; bunu növbəti dərsdə ətraflı görəcəyik. Sonra `--stat` kimi statistika gəlir: `songs.txt`-ə iki sətir əlavə olunub.

`git log`-da `main` və `encore` indi eyni commit-dədir: `(HEAD -> main, encore)`. `encore` yerindən tərpənməyib. Merge yalnız target-i dəyişir, source olduğu kimi qalır. Vizualda iki ad eyni commit-in yanındadır.

> **Diqqət:** istiqaməti qarışdırmayın. `encore`-da olarkən `git merge main` yazsanız, əksinə, `main`-in commit-ləri `encore`-a gələr.

## Merge olunmuş branch-ı silmək {#delete}

`encore`-un bütün commit-ləri artıq `main`-dədir. Ona görə `git branch -d encore` xəta vermədən silir. `git branch` yalnız `main`-i göstərir, encore mahnılarının commit-ləri isə `main`-in tarixçəsində qalıb.

## İki branch da irəliləyəndə {#both-moved}

Bu dəfə iş paralel gedib. `keyboard` branch-ında `gear.txt`-ə klavişli alət əlavə olunub. Bu vaxt `main`-də `Slow River` mahnısı qısaldılıb.

`git log` tarixçənin ikiyə ayrıldığını göstərir: `|/` sətrindən yuxarıda hər branch-ın öz commit-i var. İndi `main`-i sadəcə `keyboard`-un commit-inə çəkmək olmaz. Onda `Shorten Slow River` commit-i `main`-in tarixçəsindən çıxardı.

## Merge commit {#merge-commit}

Hələ `main`-dəyik, ona görə yenə `git merge` yazırıq. Bu dəfə çıxışda `Fast-forward` yoxdur. `Merge made by the 'ort' strategy.` o deməkdir ki, Git iki branch-ın dəyişikliklərini birləşdirib yeni commit yaradıb; *ort* Git-in standart merge alqoritminin adıdır. Bunu "Merge commit" dərsində açacağıq. Statistika yalnız `keyboard`-un gətirdiyini göstərir: `gear.txt`-ə bir sətir.

`git log`-un ən yuxarısında yeni commit var: `Merge branch 'keyboard'`. Bu commit-in iki parent-i var. `|\` sətrindən iki xətt aşağı gedir: biri `main`-in öz commit-inə, digəri `keyboard`-un commit-inə. `keyboard` yenə yerində qalıb. Vizualda merge commit hər iki xətti birləşdirir.

> **Bilgi:** merge commit-in də mesajı olur. Real terminalda `git merge keyboard` mətn redaktorunu hazır mesajla açır: `Merge branch 'keyboard'`. Faylı saxlayıb bağlayanda merge bitir. Bu səhifədə redaktor yoxdur, ona görə `--no-edit` yazdıq: Git hazır mesajı olduğu kimi götürür. Öz mesajınızı vermək üçün `-m "..."` yazın.

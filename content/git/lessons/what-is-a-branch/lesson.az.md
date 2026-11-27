**Branch** commit-i göstərən addır, yəni pointer-dir. HEAD dərsində gördük ki, `main` `.git/refs/heads/` qovluğunda bir fayldır və içində son commit-in hash-i yazılıb. Yeni branch da belə bir fayldır, ona görə o bir anda yaranır və layihənin fayllarını köçürmür.

Nümunə podkast qeydləridir (`episodes.md` və `guests.txt`): ikinci mövsümü `main`-ə toxunmadan ayrıca branch-da hazırlayacağıq.

## main bir fayldır {#file}

`git branch` repository-dəki branch-ları siyahılayır. Hələlik yalnız `main` var. Qarşısındakı `*` HEAD-in göstərdiyi branch-ı, yəni hazırda işlədiyiniz branch-ı bildirir.

`cat .git/refs/heads/main` son commit-in tam hash-ini çap edir. Branch-da başqa heç nə saxlanmır: nə fayllar, nə commit-lərin siyahısı. `wc -c` faylın ölçüsünü baytla göstərir: `41`. Bu, hash-in 40 simvolu və sətrin sonundakı yeni sətir simvoludur.

## Yeni branch fayl köçürmür {#create}

`git branch season-2` hazırkı commit-də `season-2` adlı branch yaradır (yaratmağın yollarını növbəti dərsdə keçəcəyik). Komanda heç nə çap etmir. `.git/refs/heads`-də indi iki fayl var. `season-2` faylında `main`-dəki hash-in eynisi yazılıb: iki branch eyni commit-i göstərir.

`--decorate` seçimi `git log`-da hər commit-in yanında onu göstərən adları mötərizədə yazır (real terminalda Git bunu seçimsiz də edir). `(HEAD -> main, season-2)` o deməkdir ki, son commit-i həm `main`, həm də `season-2` göstərir, HEAD isə `main`-dədir. Vizualda da iki ad eyni commit-in yanındadır.

`ls` yenə iki fayl göstərir. Git layihənin surətini çıxarmadı və yeni qovluq yaratmadı, yalnız 41 baytlıq fayl yazdı. Layihədə 10 fayl olsa da, 10 000 fayl olsa da, branch eyni sürətlə yaranır.

> **Bilgi:** `git gc` (repository-ni təmizləyən komanda) bu faylları bir fayla, `.git/packed-refs`-ə yığa bilər. Onda `.git/refs/heads/` boş görünür, amma branch-lar yerindədir. Ona görə branch-lara `git branch` ilə baxın, faylları əl ilə dəyişməyin.

## Commit yalnız bir branch-ı irəlilədir {#commit}

`main`-də ikinci epizodu yazıb commit edirik. Çıxışdakı `[main ...]` commit-in `main`-ə düşdüyünü göstərir. İndi iki branch-ın faylını oxuyuruq. `main`-dəki hash dəyişib: bu, yeni commit-in hash-idir. `season-2`-dəki hash isə əvvəlki kimidir.

Commit zamanı Git yalnız HEAD-in göstərdiyi branch-ı yeni commit-ə keçirir. Digər branch-lar yerində qalır. Vizualda `main` yeni commit-ə keçib, `season-2` isə köhnə commit-dədir.

## HEAD hansı branch-dadırsa, o irəliləyir {#head}

`git switch season-2` HEAD-i `season-2`-yə keçirir (bu komandanı ayrıca dərsdə keçəcəyik). `cat .git/HEAD` indi `ref: refs/heads/season-2` çap edir. Bu branch `Add guest list` commit-ini göstərir, ona görə `episodes.md`-də ikinci epizod yoxdur. O itməyib, `main`-in commit-indədir.

Siyahıya yeni qonaq əlavə edib commit edirik. Bu dəfə çıxışda `[season-2 ...]` var: irəliləyən `season-2`-dir, `main` yerində qaldı.

`--all` `git log`-a təkcə HEAD-dən yox, bütün branch-lardan başlamağı deyir, `--graph` isə xətləri çəkir. Tarixçə indi iki xəttə ayrılıb. İki branch-ın son commit-lərinin parent-i eynidir: `Add guest list`. `|/` sətri iki xəttin həmin commit-də birləşdiyini göstərir. Vizualda da iki xətt var.

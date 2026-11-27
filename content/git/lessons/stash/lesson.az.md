Bəzən iş yarımçıq olanda başqa branch-a keçmək lazım gəlir, hazır olmayan dəyişikliyi isə commit etmək istəmirsiniz. `git stash` commit olunmamış dəyişiklikləri kənarda saxlayır və working directory-ni son commit-in halına qaytarır. Dəyişiklikləri sonra geri gətirmək olar, amma commit-dən fərqli olaraq stash heç bir branch-ın tarixçəsinə yazılmır.

Nümunə məktəbin dərs cədvəlidir (`monday.txt`, `rooms.txt`): `clubs` branch-ında dərnəkləri əlavə edirik və bu vaxt `main`-də təcili düzəliş lazım olur.

## git stash: dəyişiklikləri kənara qoymaq {#stash}

`clubs`-da iki dəyişiklik var. `rooms.txt`-ə incəsənət dərnəyinin otağını yazıb stage etmişik (`M `). `monday.txt`-ə şahmat dərnəyini yazmışıq, amma stage etməmişik (` M`). `git switch main` işləmir: `monday.txt` iki branch-da fərqlidir və keçid commit olunmamış sətri silərdi.

`git stash` hər iki dəyişikliyi götürür: həm stage olunmuşu, həm də olunmamışı. Cavabdakı `Saved working directory and index state` deyir ki, working directory və staging area-nın halı saxlanıldı. `WIP on clubs` stash-in `clubs`-da yarandığını göstərir. WIP *work in progress*, yəni yarımçıq iş deməkdir. Sonra branch-ın son commit-inin qısa hash-i və mesajı gəlir. `git status --short` heç nə çap etmir, vizualda da üç sahə yenə eynidir.

Stash `.git` qovluğunda saxlanır (`refs/stash`), ona görə vizualda görünmür. Onu `git stash list` göstərir. `stash@{0}` ən son saxlanmış stash-dir.

## Təcili düzəliş main-də {#fix}

Commit olunmamış dəyişiklik qalmadı, ona görə `git switch main` işləyir. Bazar ertəsi `10:30`-da elm dərsi var, amma `rooms.txt`-də onun otağı yoxdur. Laboratoriyanı əlavə edib commit edirik.

Vizualda yeni commit `main`-dədir, `clubs` isə öz commit-ində qalıb. Stash-dəki dəyişikliklər bu commit-ə düşmədi.

## git stash pop: işi geri qaytarmaq {#pop}

`clubs`-a qayıdırıq. `git stash pop` son stash-i working directory-yə tətbiq edir və onu siyahıdan silir. Cavabın əvvəli `git status`-un çıxışıdır: iki fayl yenə dəyişib. Son sətir, `Dropped refs/stash@{0}`, stash-in silindiyini bildirir. Ona görə `git stash list` heç nə çap etmir.

`git status --short` iki faylda da ` M` göstərir. `rooms.txt` stash-dən əvvəl stage olunmuşdu, indi isə stage olunmayıb. Vizualda staging area son commit ilə eynidir.

> **Diqqət:** `pop` stage olunmuş dəyişikliyi stage edilməmiş kimi qaytarır. Staging area-nı da bərpa etmək üçün `git stash pop --index` yazın.

## Yeni fayllar: -u və -m {#untracked}

Çərşənbə axşamının dram dərnəyi üçün `tuesday.txt` yaradırıq. `git stash` `git stash push`-un qısa yazılışıdır. `push`-a `-m` ilə ad vermək olar, onda siyahıda `WIP on` əvəzinə bu ad görünür.

`git stash push -m "art and chess"`-dən sonra `git status --short` `?? tuesday.txt` göstərir. Stash yalnız Git-in izlədiyi faylları götürdü, yeni fayl working directory-də qaldı. Bu halda `git switch` onu da başqa branch-a aparardı.

İzlənməyən faylı da götürmək üçün `-u` (`--include-untracked`) yazılır. İkinci stash-də yalnız `tuesday.txt` var, çünki başqa dəyişiklik qalmamışdı. `git stash list` iki stash göstərir. `On clubs` stash-in `clubs`-da yarandığını bildirir, sonra verdiyimiz ad gəlir. Ən yenisi həmişə `stash@{0}` olur, ona görə əvvəlki stash `stash@{1}`-ə keçdi.

## git stash apply və drop {#apply}

`git stash apply` də stash-i tətbiq edir, amma onu siyahıda saxlayır. Lazım olan stash-in adını yazırıq: `stash@{1}` `art and chess`-dir. Cavab yenə `git status`-un çıxışıdır, amma `Dropped` sətri yoxdur. `git stash list` hələ iki stash göstərir.

Lazım olmayan stash-i `git stash drop` silir: `Dropped stash@{1}`. Siyahıda yalnız `tuesday.txt`-li stash qaldı. Vizualda iki fayl yenə dəyişib, `tuesday.txt` isə hələ stash-dədir.

`apply` stash-i nəticəni yoxlayana qədər saxlamaq istəyəndə lazımdır. Məsələn, eyni dəyişikliyi iki branch-a tətbiq etmək olar. Gündəlik işdə çox vaxt `pop` kifayətdir.

> **Bilgi:** `pop` konfliktlə bitsə, Git stash-i silmir. Konflikti həll edəndən sonra onu `git stash drop` ilə özünüz silin.

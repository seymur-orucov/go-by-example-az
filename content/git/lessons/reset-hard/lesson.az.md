`git reset --hard` branch-ı `--soft` və `--mixed` kimi verilən commit-ə keçirir, amma staging area-nı və working directory-ni də onunla eyniləşdirir. Commit olunmamış dəyişikliklər bu zaman silinir və onları geri qaytarmaq olmur.

Nümunə toy üçün musiqi siyahısıdır: `ceremony.txt` mərasimin, `party.txt` ziyafətin mahnılarıdır. Siyahını serverdən `playlist` qovluğuna clone etmisiniz, Ayla da onun üzərində işləyir.

## Commit olunmamış üç dəyişiklik {#uncommitted}

Fayllarda üç cür dəyişiklik edirik. `ceremony.txt`-ə üzük mərasiminin mahnısı yazılıb və stage olunub: `M ` (sol sütunda `M`). `party.txt`-ə yeni mahnı yazılıb, amma stage olunmayıb: ` M`. `speeches.txt` yeni fayldır və Git onu izləmir: `??`.

Vizualda üç sahə bir-birindən fərqlənir. Repository-də son commit `Add party songs`-dur. Staging area-da `ceremony.txt`-in yeni versiyası var. Working directory-də isə hər üç dəyişiklik var.

## git reset --hard: dəyişikliklər silinir {#reset}

Commit adı yazılmayanda `git reset --hard` HEAD-i götürür. Branch yerində qalır, staging area və working directory isə HEAD-in commit-inə qaytarılır. Çıxışdakı `HEAD is now at` sətri HEAD-in indi hansı commit-də olduğunu yazır: əvvəlcə qısa hash, sonra commit mesajı (`Add party songs`).

`git status --short` artıq `ceremony.txt`-i və `party.txt`-i göstərmir. `cat party.txt` iki mahnı çap edir: `Uptown Funk` sətri silinib. `ceremony.txt`-ə yazıb stage etdiyimiz sətir də getdi. Vizualda bu iki fayl üç sahədə yenə eynidir.

`speeches.txt` isə yerində qalıb: `git status --short` onu yenə `??` ilə göstərir. `reset --hard` yalnız Git-in izlədiyi fayllara toxunur. Untracked faylları silmək üçün ayrıca komanda var, `git clean`. Amma yeni faylı `git add` etsəydiniz, o artıq izlənən olardı və `reset --hard` onu da silərdi.

> **Diqqət:** commit olunmamış dəyişiklik heç bir commit-də saxlanmayıb, ona görə `reset --hard`-dan sonra onu geri qaytarmaq olmur. Bu komandadan əvvəl `git status`-a baxın. Saxlamaq istədiyiniz işi əvvəlcə commit edin.

## İki lokal commit {#experiment}

Ziyafət mahnılarının sırasını dəyişib commit edirik. `git commit -am` izlənən faylların dəyişikliyini stage edib dərhal commit edir. Sonra nitqlərin sırasını, `speeches.txt`-i də commit edirik. `git log --oneline` dörd commit göstərir.

Vizualda `HEAD → main` iki commit irəlidədir. `origin/main` isə serverdən son aldığınız vəziyyətdə, `Add party songs`-da qalıb. Bu iki commit hələ yalnız sizin kompüterinizdədir.

## Son commit-i atmaq: HEAD~1 {#drop-commit}

Nitqlərin sırası musiqi siyahısına aid deyil, son commit-i atmaq istəyirsiniz. `git reset --hard HEAD~1` `main`-i bir commit geri, `Try a new party order`-ə keçirir. `--soft` və `--mixed`-dən fərqli olaraq, atılan commit-in dəyişiklikləri staging area-da və ya fayllarda qalmır. `ls`-in çıxışında `speeches.txt` yoxdur. Bu fayl yalnız atılan commit-də idi, ona görə diskdən də silindi. `--mixed`-dən sonra o diskdə untracked (`??`) qalardı.

Vizualda `HEAD → main` bir commit geri çəkilib, `Add the speech order` qrafda görünmür. `HEAD~2` yazsaydınız, iki commit atılardı. Bu commit push olunmamışdı. Push olunmuş commit-i belə atsanız, sonrakı push `non-fast-forward` ilə rədd olunar, bunu "revert və reset" dərsində görəcəyik.

> **Bilgi:** atılan commit bir müddət Git-də qalır. Onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik. Commit olunmamış dəyişiklik üçün belə yol yoxdur.

## Serverdəki kimi etmək: origin/main {#match-server}

Yeni sıra alınmadı və siz bu təcrübədən imtina edirsiniz. `git fetch` Ayla-nın serverə göndərdiyi commit-i gətirir (`main -> origin/main`). GitHub-da `From` sətrində `https://github.com/...` kimi ünvan olardı. `git status` `have diverged` yazır: `main`-də serverdə olmayan bir commit, `origin/main`-də isə sizdə olmayan bir commit var (`1 and 1`). Git `git pull` təklif edir, amma pull sizin təcrübənizi Ayla-nın commit-i ilə birləşdirərdi.

`git reset --hard origin/main` `main`-i `origin/main`-in commit-inə keçirir və faylları da onunla eyniləşdirir. `git log --oneline` serverdəki üç commit-i göstərir, `Try a new party order` artıq branch-da yoxdur. Vizualda `HEAD → main` və `origin/main` eyni commit-dədir.

Bu üsul lokal təcrübəni atıb serverdəki versiyadan təzədən başlamaq üçündür. Serverə göndərilməmiş bütün commit-lər branch-dan çıxır.

> **Diqqət:** saxlamaq istədiyiniz lokal commit varsa, `reset`-dən əvvəl onu push edin və ya üstündə yeni branch yaradın (`git branch <ad>`). Branch commit-i tarixçədə saxlayır.

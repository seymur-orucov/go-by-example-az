`git reset`-də rejim yazmasanız, Git `--mixed` rejimini işlədir. O da `--soft` kimi branch-ı geri çəkir, amma staging area-nı da həmin commit-ə qaytarır. Diskdəki fayllar dəyişmir: commit-in dəyişiklikləri stage olunmamış dəyişiklik kimi geri gəlir və onları başqa cür commit etmək olur.

Nümunə akvarium jurnalıdır: `water.log`-da suyun ölçüləri, `feeding.txt`-də yemləmə qaydası yazılıb.

## İki iş bir commit-də {#one-commit}

Yeni su ölçüsünü və yeni yemləmə qaydasını yazırıq və ikisini bir commit-ə qoyuruq. `2 files changed` commit-də iki faylın dəyişdiyini göstərir. Bunlar ayrı işlərdir. Sonra yalnız yemləmə qaydasını geri almaq lazım olsa, su ölçüsü də onunla birlikdə gedəcək. Vizualda yeni commit-in yanında `HEAD → main` yazılıb.

## git reset HEAD~1: branch geri çəkilir {#reset}

`git reset HEAD~1`-də rejim yoxdur, ona görə `--mixed` işləyir. Yəni bu, `git reset --mixed HEAD~1` ilə eyni komandadır. Git `main`-i bir commit geri, `Start aquarium log`-a keçirir. `git log --oneline` indi bir commit göstərir. Vizualda `HEAD → main` köhnə commit-in yanına keçib, `Update aquarium log` isə tarixçədə görünmür.

`Unstaged changes after reset:` reset-dən sonra stage olunmamış dəyişiklikləri sadalayır. Hər sətirdə `M` (*modified*) və faylın adı var. Yəni hər iki faylın diskdəki versiyası staging area-dakından fərqlidir. `--soft` belə siyahı çap etmir, çünki staging area-ya toxunmur.

> **Bilgi:** ləğv olunan commit dərhal silinmir. Sadəcə heç bir branch onu göstərmir, ona görə `git log`-da görünmür. Onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

## Dəyişikliklər stage olunmamış qalıb {#unstaged}

`git status` iki faylı `Changes not staged for commit` başlığı altında göstərir. Dəyişikliklər diskdədir, amma növbəti commit-ə düşməyəcək. `--mixed` staging area-nı `Start aquarium log` commit-inə qaytardı, working directory-yə isə toxunmadı. Vizualda staging area repository ilə eynidir, yeni sətirlər isə yalnız working directory-dədir.

Commit yeni fayl yaratmış olsaydı, o fayl diskdə qalardı. Amma staging area-da və `HEAD`-də o olmadığı üçün `git status` onu `Untracked files` altında göstərərdi (`??`).

`--soft`-dan sonra eyni fayllar `Changes to be committed` altında olardı. Fərq yalnız staging area-dadır. Mötərizədəki ipuclarını əvvəlki dərslərdən tanıyırsınız: `git add` faylı stage edir, `git restore` isə diskdəki dəyişikliyi atır.

> **Diqqət:** burada `git restore <file>` yazmayın. Dəyişiklik heç bir branch-da yoxdur, restore isə onu diskdən silir.

## Commit-i iki hissəyə bölmək {#split}

İndi hər işi ayrıca commit edirik. Əvvəl yalnız `water.log`-u stage edib commit edirik, sonra `feeding.txt`-i. Hər commit-in çıxışında `1 file changed` yazılıb. `git log --oneline` üç commit göstərir. Vizualda `main` iki yeni commit qədər irəliləyib və hər commit-in mesajı bir işi adlandırır.

> **Diqqət:** reset-i yalnız hələ push etmədiyiniz commit-lərə tətbiq edin. Paylaşılmış commit-i ləğv etsəniz, sizin tarixçəniz serverdəkindən ayrılır və push `non-fast-forward` ilə rədd olunur. Bunu "revert və reset" dərsində müqayisə edəcəyik.

## Fayl adı ilə git reset: yalnız unstage {#unstage-file}

Hər iki fayla yeni sətir əlavə edib ikisini də stage edirik. Yemləmə qaydası hələ dəqiq deyil, ona görə `git reset feeding.txt` ilə onu staging area-dan çıxarırıq. Commit yazılmayanda Git `HEAD` götürür və faylın staging area-dakı versiyasını `HEAD`-dəki versiyaya qaytarır. Bu, `git restore --staged feeding.txt` ilə eyni işdir.

Çıxışda yenə `Unstaged changes after reset:` var, amma siyahıda yalnız `feeding.txt` var. `water.log` stage olunub, ona görə siyahıya düşmür. `git status --short` da bunu göstərir: `feeding.txt` üçün ` M` (sağ sütun), `water.log` üçün `M ` (sol sütun).

Fayl adı olan bu forma branch-ı tərpətmir. `git log --oneline -1` yenə `Feed shrimp pellets on Sunday` göstərir. Vizualda yalnız staging area dəyişib.

> **Bilgi:** `git reset` heç bir arqumentsiz bütün stage olunmuş faylları unstage edir. Branch yenə yerində qalır.

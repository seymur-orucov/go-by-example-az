`git worktree` eyni repository-yə ikinci qovluq qoşur və orada başqa branch açır. Hər qovluğun öz faylları və staging area-sı olur, commit-lər və branch-lar isə ortaqdır. Stash yarımçıq işi kənara qoyur, worktree isə ona toxunmur.

Nümunə qəhvə abunəsi saytıdır (`coffee-site`): Sam `feat/new-plans` branch-ında yeni planlar üzərində işləyərkən `main`-dəki `plans.txt`-də səhv qiymət tapılır.

## Yarımçıq iş və təcili düzəliş {#problem}

`git branch` Sam-ın `feat/new-plans`-də olduğunu göstərir. `git status --short`-da ` M plans.txt` var: Sam bu fayla Student planını yazır, hələ commit etməyib. `main`-də isə Basic planının qiyməti 21 dollar yazılıb, düzgün qiymət 12 dollardır. Düzəliş `main`-dən başlamalıdır.

`git switch main` keçidi etmir, çünki `plans.txt` iki branch-da fərqlidir. Bu xətanı branch-lar arasında keçid dərsindən tanıyırsınız. Yarımçıq işi commit etmək istəmirik. Stash da olar, amma sonra onu geri qaytarmaq lazımdır. Qısa keçid üçün stash kifayətdir. İki iş bir müddət paralel gedəndə (təcili düzəliş, başqasının branch-ına review, uzun test) worktree daha rahatdır.

## git worktree add: ikinci qovluq {#add}

`git worktree add ../coffee-hotfix -b hotfix/price main` `main`-dən yeni `hotfix/price` branch-ı yaradır. Sonra `coffee-site`-ın yanında `coffee-hotfix` qovluğunu açır və bu branch-ın fayllarını ora yazır. Birinci arqument qovluğun yeridir, `-b` yeni branch-ın adını verir, sonuncu arqument isə branch-ın başladığı yerdir.

Çıxışın birinci sətri yeni branch-ın yarandığını deyir. `HEAD is now at` isə yeni qovluqda HEAD-in `main`-in son commit-ində olduğunu bildirir.

`git worktree list` hər qovluq üçün bir sətir çap edir: tam yol, HEAD-in commit-inin qısa hash-i və kvadrat mötərizədə branch. Birinci sətir əsas qovluqdur, ikincisi yenisi. Lokal kompüterdə yol `/home/sam/...` yox, sizin qovluğunuz olacaq.

> **Bilgi:** `-b` olmadan `git worktree add ../coffee-hotfix main` mövcud `main` branch-ını açardı. Bu da işləyir, çünki `main` heç bir qovluqda açıq deyil. Düzəliş üçün ayrıca branch isə onu sonra merge etməyi və ya pull request açmağı asanlaşdırır.

## Yeni qovluqda işləmək {#fix}

`cd ../coffee-hotfix` ilə yeni qovluğa keçirik. `git status` `On branch hotfix/price` və `working tree clean` yazır. Student sətri burada yoxdur, o yalnız `coffee-site` qovluğundadır. `cat` `main`-dəki faylı göstərir, ona görə Family planı da burada yoxdur.

`sed` səhv qiyməti düzəldir, `git commit -am` onu `hotfix/price`-a yazır. Bu adi qovluqdur və tanış komandalar burada eyni işləyir. Vizualda yeni commit `hotfix/price`-dadır, `HEAD → hotfix/price` bu qovluğun HEAD-idir. `feat/new-plans` öz commit-i ilə ayrı xətdədir, `main` isə ilk commit-də qalıb.

## Bir repository, iki qovluq {#shared}

`cd ../coffee-site` ilə əsas qovluğa qayıdırıq. `git status --short` yenə ` M plans.txt` göstərir: yarımçıq iş yerindədir.

`git log --oneline -2 hotfix/price` təzə commit-i buradan da görür. Yeni qovluğun ayrıca repository-si yoxdur. Onun `.git`-i qovluq yox, bir sətirlik fayldır. `cat` göstərir ki, `gitdir:` əsas `.git`-in içindəki `worktrees/coffee-hotfix`-ə yönləndirir. Commit-lər və branch-lar ortaqdır, hər qovluğun isə öz working directory-si, staging area-sı və HEAD-i var.

`git branch`-də `hotfix/price`-ın qarşısında `+` var. Bu, branch-ın başqa worktree-də açıq olduğunu bildirir. Ona görə `git switch hotfix/price` alınmır: `is already used by worktree at '/home/sam/coffee-hotfix'`. Branch eyni anda yalnız bir worktree-də açıq ola bilər. Artıq açıq olan branch-ı `git worktree add`-ə versəniz, eyni xətanı alarsınız.

## git worktree remove: qovluğu silmək {#remove}

Düzəliş commit olunub, `coffee-hotfix` artıq lazım deyil. Amma Sam orada `index.html`-ə yeni sətir əlavə edib və commit etməyib. `git worktree remove` belə qovluğu silmir: `contains modified or untracked files, use --force to delete it`. Git commit olunmamış işi itirməmək üçün dayanır.

Bu sətir lazım deyil, ona görə `--force` ilə silirik. İndi `git worktree list` bir qovluq göstərir. `git branch`-də isə `hotfix/price` qalıb, `+` işarəsi artıq yoxdur. Worktree-ni silmək branch-ı silmir. Düzəlişi `main`-ə adi yolla, merge və ya pull request ilə gətirirsiniz.

> **Diqqət:** `--force` commit olunmamış dəyişiklikləri birdəfəlik silir. Qovluğu `rm -rf` ilə əl ilə silsəniz, Git-in qeydi qalır və `git worktree list` onu `prunable` kimi göstərir. `git worktree prune` belə qeydləri təmizləyir.

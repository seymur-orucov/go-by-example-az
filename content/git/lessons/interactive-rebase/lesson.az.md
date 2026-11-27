Lokal branch-da tez-tez `wip`, `fix typo` kimi səliqəsiz commit-lər yığılır. `git rebase -i` (*interactive*) son commit-ləri siyahı kimi redaktorda açır. `git reset --soft` commit-ləri yalnız hamısını birdən birləşdirirdi, burada isə hər commit-i ayrıca saxlamaq, əvvəlkinə qatmaq, mesajını dəyişmək və ya silmək olar.

Nümunə rəqs dərsi üçün xoreoqrafiya qeydləridir: `chorus` branch-ında `routine.md` və `music.txt` fayllarına toxunan dörd səliqəsiz commit var.

## Siyahı: git rebase -i HEAD~4 {#todo}

`git log --oneline` beş commit göstərir. `Add verse` `main`-dən gəlir, üstündəki dörd commit isə yalnız `chorus`-dadır. `git rebase -i HEAD~4` `HEAD~4`-dən, yəni `Add verse`-dən sonrakı dörd commit-i götürür.

Real terminalda bu komanda redaktor açır. Bu səhifənin terminalında redaktor açılmır, ona görə siyahını çıxışa yazırıq. Siz bu sətirləri redaktorda görəcəksiniz. Hər sətir bir commit-dir. Sətirdə əvvəl komanda (`pick`), sonra qısa hash gəlir. `#`-dan sonra commit-in mesajı yazılır. Sıra `git log`-un əksinədir: ən köhnə commit yuxarıdadır. Git commit-ləri yuxarıdan aşağı bir-bir tətbiq edir, ona görə sətirlərin yerini dəyişsəniz, commit-lərin sırası da dəyişir.

`pick` commit-i olduğu kimi saxlayır. Siyahının altında Git `#` ilə başlayan şərh sətirləri yazır, orada bütün komandaların qısa izahı var. Çıxışda onları göstərmirik. Burada siyahını dəyişmədən saxlayıb redaktoru bağladıq. Hər sətir `pick` qaldı, ona görə Git heç nəyi yenidən yazmadı: ikinci `git log`-da hash-lər eynidir. `Successfully rebased and updated refs/heads/chorus` rebase-in bitdiyini və `chorus`-un yeniləndiyini bildirir.

## fixup və drop {#fixup-drop}

`fix typo` `Add chorus moves`-dakı hərf səhvini düzəldir, ayrıca commit kimi lazım deyil. `Try slow intro` isə sınaq idi və yavaş girişdən imtina etdik. Redaktorda ikinci sətirdə `pick` sözünü `fixup` ilə, dördüncü sətirdə `drop` ilə əvəz edirsiniz. Çıxışın ilk dörd sətri belə saxlanmış siyahıdır, onu burada skript dəyişdi.

`fixup` commit-in dəyişikliyini yuxarıdakı sətrin commit-inə qatır və öz mesajını atır. `drop` commit-i dəyişiklikləri ilə birlikdə silir. `git log` indi iki commit göstərir, `ls`-in çıxışında da `intro.md` yoxdur. Hər iki commit yeni hash alıb: `Add chorus moves`-un məzmunu dəyişdi, `wip`-in isə parent-i. Vizualda `main` yerində qalıb, `chorus` isə yeni commit-lərə keçib.

> **Diqqət:** interactive rebase də commit-ləri yenidən yazır. Rebase-in qızıl qaydası burada da keçərlidir: yalnız push etmədiyiniz commit-lərlə işləyin. Kimsə köhnə commit-ləri artıq götürübsə, sizin və onun tarixçəsi ayrılır.

## reword: mesajı dəyişmək {#reword}

`wip` mesajı heç nə demir. `git rebase -i HEAD~1` yalnız son commit-i götürür və siyahıda bir sətir olur. Orada `pick`-i `reword` ilə əvəz edirsiniz. Siyahını saxlayanda Git ikinci dəfə redaktor açır, bu dəfə commit mesajı ilə. Mesajı `Note when the chorus starts` edib saxlayırsınız.

Çıxışdakı `[detached HEAD ...]` sətri yeni commit-dir. Rebase zamanı Git commit-ləri detached HEAD-də yazır və sonda `chorus`-u onlara keçirir. `Date` sətri amend-dəki kimi commit-in ilk yarandığı vaxtdır. Faylların məzmunu dəyişmədi, amma mesaj dəyişdiyi üçün hash yenidir.

> **Bilgi:** yalnız son commit-in mesajı üçün `git commit --amend -m` daha qısadır. `reword` daha köhnə commit-in mesajını dəyişmək üçün lazımdır.

## squash: mesajları birləşdirmək {#squash}

İndi hər iki commit xorla bağlıdır, onları birləşdiririk. `git rebase -i HEAD~2` siyahısında ikinci sətirdə `pick`-i `squash` ilə əvəz edirsiniz. `fixup`-dan fərqi mesajdadır: `squash` hər iki mesajı saxlayır və onları birlikdə redaktorda açır. Redaktorda iki mesaj alt-alta olur, aralarında `#` ilə başlayan izah sətirləri var. Mətni istədiyiniz kimi düzəldirsiniz. Burada heç nəyi dəyişmədən saxladıq.

`git log --oneline` artıq bir commit göstərir, çünki `--oneline` mesajın yalnız ilk sətrini çap edir. `git log -1` tam mesajı göstərir. `Add chorus moves` başlıqdır, boş sətirdən sonrakı `Note when the chorus starts` isə mesajın gövdəsidir. Çıxışdakı `2 files changed, 5 insertions(+)` iki commit-in birlikdə etdiyi dəyişiklikdir.

## git commit --fixup və --autosquash {#autosquash}

Bu arada bridge hərəkətləri ayrıca commit olundu: `Add bridge moves`. Sonra səhv tapılır: mahnıda xor 0:45-də deyil, 0:48-də başlayır. `sed` `music.txt`-də vaxtı düzəldir. Bu düzəliş `Add chorus moves`-a aiddir. O artıq son commit deyil, ona görə amend kömək etmir.

`git commit --fixup=HEAD~1` düzəlişi commit edir və mesajı özü yazır: `fixup! ` və hədəf commit-in mesajı. `HEAD~1` burada `Add chorus moves`-dur. `git log`-da yeni commit hələlik ən yuxarıdadır.

`git rebase -i --autosquash HEAD~3` siyahını özü hazırlayır. `fixup!` ilə başlayan commit-i hədəfinin altına köçürür və onun `pick`-ini `fixup` ilə əvəz edir. Siyahını əl ilə dəyişmək lazım deyil, redaktoru saxlayıb bağlamaq kifayətdir. Son `git log`-da yenə iki commit var, düzəliş isə `Add chorus moves`-un içindədir. Vizualda iki yeni commit vurğulanıb.

> **Bilgi:** `git config rebase.autoSquash true` yazsanız, `git rebase -i` `--autosquash` olmadan da `fixup!` commit-lərini yerinə qoyur.

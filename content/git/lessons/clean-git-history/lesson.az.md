Pull request-i (PR) review edən komanda yoldaşı, yəni rəyçi, branch-ı commit-commit oxuyur. `wip` mesajı, ayrıca `fix` commit-ləri və bir commit-ə yığılmış ayrı işlər onun işini çətinləşdirir. Təmiz tarixçə üç vərdişdən yaranır: atomik commit-lər, köhnə commit-ə `--fixup` ilə düzəliş və PR-dan əvvəl bir interactive rebase.

Nümunə həftəsonu bazarındakı kiçik satış yerinin fayllarıdır: `stock.csv`-də malların sayı, `prices.txt`-də dollarla qiymətlər var.

## Atomik commit-lər {#atomic}

Sam `winter-goods` branch-ında işləyir, orada artıq bir tələsik commit var: `wip`. `git diff` iş qovluğunda iki dəyişiklik göstərir. `prices.txt`-ə `scarf` və `mittens` üçün qış qiymətləri əlavə olunub. `stock.csv`-də isə `jam`-in sayı düzəldilib: 18 yox, 12. Bunlar iki ayrı işdir, ona görə iki commit olmalıdır.

Atomik commit bir məntiqi dəyişiklikdir. Onun mesajı qısa olur və rəyçi onu ayrıca oxuyur. Lazım olsa, `git revert` ilə yalnız onu geri almaq olur, o biri iş yerində qalır.

`git add prices.txt` yalnız bir faylı stage edir, ona görə commit-in çıxışında `1 file changed` var. Sonra `stock.csv` eyni yolla ikinci commit olur. `git add .` və ya `git commit -a` hər iki dəyişikliyi bir commit-ə yığardı.

> **Bilgi:** bir faylın içində iki ayrı iş olanda `git add -p` (*patch*) dəyişiklikləri hissə-hissə göstərir. Hər hissə üçün soruşur: `y` stage edir, `n` keçir. Komanda cavab gözləyir, ona görə bu səhifənin terminalında onu göstərmirik.

## Düzəliş: git commit --fixup {#fixup}

Sam görür ki, `mittens` 9.00 yox, 8.50 dollardır. Səhv `Add winter prices` commit-indədir. O artıq son commit deyil. `--amend` isə son commit-i, yəni `Fix jam count in stock`-u dəyişərdi. Ayrıca `Fix mittens price` commit-i isə PR-da lazımsız bir sətir olardı.

Interactive rebase dərsindən tanış `git commit --fixup` düzəlişi hədəf commit-ə bağlayır. Çıxışda yeni commit-in mesajı görünür: `fixup! Add winter prices`. Hədəfi `":/Add winter prices"` ilə adlandırdıq, yəni mesajında bu mətn olan ən yeni commit. `HEAD~1` də olardı, amma mesajla adlandıranda commit-ləri saymaq lazım olmur.

İş zamanı belə düzəlişləri istədiyiniz qədər yazın. Onlar PR-dan əvvəl hədəflərinə qatılacaq.

## PR-dan əvvəl tarixçəyə baxmaq {#review}

`git fetch` serverdəki yenilikləri gətirir. Burada server lokal qovluqdur, GitHub-da ünvan `https://github.com/...` olardı. `main -> origin/main` sətri deyir ki, `origin/main` irəliləyib: bu arada Ayla `main`-ə bir commit push edib.

`git log --oneline origin/main..HEAD` branch-da olub `origin/main`-də olmayan commit-ləri göstərir. PR-da rəyçi də bu dörd commit-i görəcək. İkisi problemlidir. `wip` nə edildiyini demir. `fixup! Add winter prices` isə ayrıca commit kimi lazım deyil.

## Bir rebase ilə təmizləmək {#rebase}

`git rebase -i --autosquash origin/main` branch-ı `origin/main`-in son commit-inin üstünə köçürür və siyahını açır. `--autosquash` siyahını interactive rebase dərsindəki kimi hazırlayıb: `fixup!` commit-ini hədəfinin altına qoyub və onun `pick`-ini `fixup` ilə əvəz edib. Siz yalnız birinci sətirdə `pick`-i `reword` edirsiniz. Çıxışın ilk dörd sətri belə saxlanmış siyahıdır. Heç nəyi dəyişmədən bağlasanız da, fixup yenə hədəfinə qatılır.

Sonra Git `wip` üçün mesaj redaktoru açır və siz `Add the winter sign` yazırsınız. `[detached HEAD ...]` sətri bu yeni commit-dir. Son `git log` üç commit göstərir, hər mesaj bir dəyişikliyi adlandırır. Vizualda branch Ayla-nın commit-inin üstündədir. Lokal `main` köhnə yerində qalıb, bu rebase üçün o lazım deyildi. İndi branch-ı push edib PR aça bilərsiniz.

> **Diqqət:** tarixçəni push etməzdən əvvəl təmizləyin. Rebase commit-ləri yenidən yazır, qızıl qayda burada da keçərlidir: başqalarının artıq götürdüyü commit-ləri yenidən yazmayın.

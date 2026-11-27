Amend və rebase push olunmuş commit-ləri yeni commit-lərlə əvəz edir, belə branch-ı isə adi `git push` göndərmir. `git push --force` serverdəki branch-ı heç nə yoxlamadan sizinki ilə əvəz edir: arada kimsə push edibsə, onun commit-i branch-dan silinir. `--force-with-lease` belə push-u rədd edir.

Nümunə avtobus bileti mobil tətbiqinin tərcüməsidir: Sam və Ayla `strings/en.json`-dakı ingilis mətnlərini `strings/az.json`-a tərcümə edir.

## Yenidən yazılmış branch-ı göndərmək {#rejected}

Sam menyu mətnlərini öz `az-menu` branch-ında tərcümə edib və push edib. Bu branch-da ondan başqa heç kim işləmir. Sonra Sam `main`-in yeni commit-lərini gətirmək üçün branch-ı `git rebase main` ilə yeniləyib. Rebase commit-ləri yeni hash-li surətlərlə əvəz edir. Serverdəki `az-menu` isə köhnə commit-lərdə qalıb.

`git push` rədd olunur: `! [rejected] az-menu -> az-menu (non-fast-forward)`. Bu mesajı amend dərsindən tanıyırsınız. Yeni commit-lər serverdəki commit-in davamı deyil. Server branch-ı onlara keçirsə, köhnə commit-lər branch-dan düşər. Push isə branch-ı yalnız irəli çəkə bilər.

`git push --force` bu yoxlamanı söndürür və push keçir. Çıxışda branch-ın sətri `+` ilə başlayır və `(forced update)` ilə bitir. Bu, serverdəki branch-ın irəli çəkilmədiyini, əvəz olunduğunu göstərir. Burada itən heç nə yoxdur: köhnə commit-ləri Sam-dan başqa heç kim götürməyib.

## Force push Ayla-nın commit-ini silir {#lost-work}

Ortaq `translate-az` branch-ında Sam və Ayla birlikdə işləyir. Sam `Add menu strings` commit-ini push edib. Ayla onu götürüb, üstünə `Translate settings screen` commit-ini edib və push edib. Sam bundan xəbərsizdir. O, menyu mətnində hərf səhvi tapır və onu `git commit --amend` ilə düzəldir.

`git push` rədd olunur, amma mötərizədə bu dəfə `fetch first` yazılıb. Yəni serverdə Sam-da olmayan commit var. Rədd olunmanın səbəbi amend deyil, Ayla-nın push-udur. Sam mesajı oxumur və `git push --force` yazır.

Server heç nəyi müqayisə etmir və merge etmir. O, `translate-az`-ı Sam-ın yeni commit-inə keçirir. Ayla-nın commit-i Sam-ın köhnə commit-inin üstündə idi, yeni commit-in tarixçəsində isə yoxdur. Ona görə o, branch-dan çıxır. Diaqram force push-dan sonrakı vəziyyəti göstərir.

Ayla-nın commit-i hələ onun laptopundadır. Növbəti `git fetch`-də o, `(forced update)` sətrini görür, `git status` isə `have diverged` yazır. Ayla commit-ini yeni `translate-az`-ın üstünə cherry-pick ilə qaytara bilər. Amma bunun üçün nə baş verdiyini başa düşməlidir.

> **Diqqət:** burada `git pull --rebase` Ayla-ya kömək etmir. `origin/translate-az` bir vaxt Ayla-nın commit-ini göstərib, çünki onu Ayla özü push etmişdi. Ona görə Git bu commit-i serverdən gəlmiş sayır və köçürmür. Commit Ayla-nın branch-ından da çıxır.

## --force-with-lease: əvvəl yoxla {#lease}

`--force-with-lease` push-dan əvvəl bir şeyi yoxlayır: serverdəki branch hələ də sizin `origin/translate-az`-ın göstərdiyi commit-dədirmi? `origin/translate-az` Sam-ın serverdə son gördüyü haldır, yəni son fetch və ya push anı. Ayla ondan sonra push edib. Ona görə serverdəki branch başqa commit-dədir.

Sam eyni vəziyyətdə `git push --force-with-lease` yazsaydı, push rədd olunardı: `! [rejected] translate-az -> translate-az (stale info)`. *Stale info* "köhnəlmiş məlumat" deməkdir: Sam-ın serverdəki branch haqqında bildiyi artıq doğru deyil. Serverdə heç nə dəyişmir. Sam `git fetch` ilə Ayla-nın commit-ini görür və anlayır ki, bu branch-ı yenidən yazmaq olmaz.

Yoxlama yalnız `origin/translate-az` ilə müqayisədir. Sam push-dan əvvəl `git fetch` etsəydi, `origin/translate-az` Ayla-nın commit-ini göstərərdi. Onda lease keçərdi və Ayla-nın commit-i yenə silinərdi. Bəzi redaktorlar fetch-i arxa planda özü edir. Ona görə fetch-dən sonra nə gəldiyinə baxın: `git log --oneline HEAD..origin/translate-az`.

> **Bilgi:** `--force-if-includes` bu boşluğu bağlayır. `--force-with-lease` ilə birlikdə yazılanda o, serverdəki commit-in sizin branch-ınızda nə vaxtsa olub-olmadığını da yoxlayır. Fetch etmisinizsə, amma gələn commit-i öz branch-ınıza gətirməmisinizsə, push `remote ref updated since checkout` ilə rədd olunur.

## Force push nə vaxt olar {#when-to-force}

Merge və rebase dərsindəki qızıl qayda burada da işləyir: başqalarının üzərində iş qura biləcəyi commit-ləri yenidən yazmayın. Force push həmin yenidən yazılmış tarixçəni serverə çatdıran addımdır. Ona görə əvvəlcə soruşun: bu branch-da məndən başqa kimsə işləyirmi?

`az-menu` kimi yalnız sizin branch-ınızda force push adi işdir. Branch-ı `main`-in üstünə rebase edəndə, interactive rebase ilə commit-ləri birləşdirəndə və ya amend-dən sonra onu başqa yolla göndərmək olmur. Belə hallarda da `--force-with-lease` yazın. Branch-ı başqa kompüterdən özünüz push etmisinizsə, o işi də qoruyur.

`main` və `translate-az` kimi ortaq branch-larda force push etməyin. Orada səhv commit-i `git revert` ilə geri alın: revert tarixçəni yenidən yazmır. GitHub-da qorunan branch-larda (*protected branch*) force push standart olaraq qadağandır. Ortaq branch-ın tarixçəsini dəyişmək həqiqətən lazımdırsa, məsələn təsadüfən commit olunmuş parolu silmək üçün, əvvəlcə komandaya xəbər verin.

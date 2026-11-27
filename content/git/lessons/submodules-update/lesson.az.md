Əsas repository submodule-un fayllarını yox, yalnız gitlink-i, yəni submodule-un hansı commit-də olmalı olduğunu saxlayır. Ona görə adi `git clone` submodule qovluğunu boş gətirir, submodule-dakı yeni commit-i isə əsas repository-yə siz gətirirsiniz: gitlink-i yeniləyib commit edirsiniz.

Nümunə serverdəki sənədləşmə saytıdır: `docs-site` CSS fayllarından ibarət theme-i (`docs-theme`) əvvəlki dərsdəki `git submodule add` ilə submodule kimi saxlayır. Sam saytı clone edir, sonra komandaya Ayla qoşulur.

## Adi clone: submodule qovluğu boşdur {#clone}

`git clone` saytı yükləyir. `ls` `docs-theme` qovluğunu göstərir, amma `ls docs-theme` heç nə çap etmir: qovluq boşdur. Clone yalnız əsas repository-ni gətirdi. Gitlink-də theme-in commit-i yazılıb, fayllar isə başqa repository-dədir.

`git submodule status` hər submodule üçün bir sətir çap edir: gitlink-dəki commit-in tam hash-i və submodule-un yolu. Sətrin əvvəlindəki `-` submodule-un hələ hazırlanmadığını, yəni clone olunmadığını bildirir.

> **Bilgi:** server yenə lokal qovluqdur, ona görə sessiyada əvvəlki dərsdəki gizli `protocol.file.allow always` ayarı var. GitHub ünvanı ilə bu ayar lazım deyil.

## git submodule update --init {#init}

`--init` submodule-un ünvanını `.gitmodules`-dən götürüb `.git/config`-ə yazır. `update` isə submodule-u clone edib gitlink-dəki commit-ə keçirir. Çıxış bunu üç hissədə göstərir. `registered for path 'docs-theme'` sətri qeydiyyatdır, mötərizədə theme-in ünvanı var. `Cloning into` ilə `done.` theme repository-sinin clone-udur. `Submodule path 'docs-theme': checked out` isə submodule-un gitlink-dəki commit-ə keçdiyini bildirir. İndi `ls docs-theme` `theme.css` göstərir.

`-C docs-theme` Git-i həmin qovluqda işlədir, yəni bu `git status` submodule-un öz statusudur. Birinci sətir `HEAD detached at` və qısa hash-dir. Əsas repository branch yox, konkret commit saxlayır və Git submodule-u məhz o commit-ə keçirir. Bu, detached HEAD dərsindəki vəziyyətdir.

> **Diqqət:** submodule-un içində dəyişiklik edib commit etmək istəsəniz, əvvəlcə orada branch-a keçin: `git -C docs-theme switch main`. Yoxsa yeni commit heç bir branch-a düşməyəcək.

## Bir komanda ilə: --recurse-submodules {#recurse}

Komandaya yeni qoşulan Ayla saytı öz qovluğunda (`~/ayla`) clone edir. `--recurse-submodules` clone-dan sonra submodule-ları da hazırlayır, ayrıca `git submodule update --init` lazım olmur. Çıxışda əvvəlcə saytın clone-u, sonra əvvəlki addımdakı üç hissə gəlir. `ls docs-site/docs-theme` dərhal `theme.css` göstərir.

> **Bilgi:** submodule-un içində də submodule ola bilər. `--recurse-submodules` onları da clone edir. Artıq clone olunmuş repository-də bunun qarşılığı `git submodule update --init --recursive`-dir.

## Theme-in yeni commit-ini götürmək {#remote}

Theme-in müəllifi serverə yeni commit göndərib: `Add dark mode`. Sam-ın saytında gitlink hələ köhnə commit-dədir. Bayraqsız `git submodule update` submodule-u gitlink-dəki commit-ə keçirir, ona görə burada heç nə dəyişməzdi. `--remote` isə submodule-u serverdəki branch-ın son commit-inə keçirir. `From` və ox (`->`) sətirləri fetch dərsindən tanışdır: submodule-da `origin/main` yeniləndi. Son sətir submodule-un yeni commit-ə keçdiyini göstərir.

Sonrakı addımlar əvvəlki dərsdəki kimidir. `git status` `modified: docs-theme (new commits)` göstərir, `git diff --submodule` isə gələn commit-i: `Add dark mode`. Yeni gitlink-i `git add docs-theme` və `git commit` ilə bağlayırıq. `git push` bu commit-i serverə göndərir.

## Komanda yoldaşı: pull və submodule update {#teammate}

Ayla `git pull` edir. Əvvəlcə saytın yeni commit-i gəlir. Sonra `Fetching submodule docs-theme` sətri ilə Git theme-in yeni commit-lərini də yükləyir, çünki gəlib çatan commit gitlink-i dəyişib. `docs-theme | 2 +-` gitlink-də köhnə hash-in yenisi ilə əvəz olunduğunu göstərir.

Amma `git status` yenə `modified: docs-theme (new commits)` yazır. Pull gitlink-i yenilədi, `docs-theme` qovluğu isə köhnə commit-də qaldı. Burada `git add docs-theme` səhv olardı: o, qovluqdakı köhnə commit-i stage edir və Sam-ın yeniləməsini geri qaytarır. Düzgün komanda `git submodule update`-dir, bu dəfə `--remote` olmadan. O, submodule-u gitlink-dəki commit-ə keçirir. `ls docs-theme` indi `dark.css`-i də göstərir.

> **Bilgi:** `git config submodule.recurse true` ayarından sonra `git pull` submodule-u da gitlink-dəki commit-ə keçirir, ayrıca `git submodule update` lazım olmur. Hələ clone olunmamış submodule-u isə bu ayar gətirmir, onun üçün `--init` lazımdır.

`git status` hansı faylın dəyişdiyini deyir, `git diff` isə faylın içində **nəyin** dəyişdiyini göstərir. Arqumentsiz `git diff` working directory-ni staging area ilə müqayisə edir, yəni hələ stage edilməmiş dəyişiklikləri göstərir. Nümunə kafenin menyusudur: on sətir, hər birində məhsul və qiymət.

## Diff-i oxumaq {#one-change}

`sed` faylda `Coffee 3 USD`-ni `Coffee 4 USD` ilə əvəz edir. Bu, redaktorda əl ilə edəcəyiniz dəyişikliyin bir komandalıq variantıdır. Çıxış başlıqla başlayır: `diff --git` müqayisə olunan faylı, `---` köhnə versiyanı (`a/`), `+++` isə yeni versiyanı (`b/`) bildirir. `index` sətrindəki qısa kodlar faylın iki versiyasının daxili adlarıdır, onları oxumaq lazım deyil.

Sonra **hunk**, yəni dəyişikliyin bir parçası gəlir. `@@ -1,5 +1,5 @@` deyir ki, köhnə versiyada 1-ci sətirdən başlayan 5 sətir yeni versiyada da 1-ci sətirdən başlayan 5 sətirdir. `-` ilə başlayan sətir silinib, `+` ilə başlayan əlavə olunub. Dəyişmiş sətir bir silinmə və bir əlavə kimi görünür. Boşluqla başlayan sətirlər kontekstdir: dəyişikliyin yerini tapmaq üçün yuxarıda və aşağıda üç sətir.

## İki hunk {#two-hunks}

Menyunun sonuna `Lemonade` əlavə etdik. Bu sətir qəhvədən uzaqdadır, ona görə Git onu ayrıca hunk kimi göstərir: `@@ -8,3 +8,4 @@`. Köhnə versiyada 8-ci sətirdən başlayan hissə 3 sətir idi, yenidə 4 sətirdir, yəni bir sətir əlavə olunub. `@@`-dan sonrakı `Orange juice 3 USD` hunk-dan yuxarıdakı sətirdir, Git onu oriyentir üçün yazır.

> **Bilgi:** çox fayl dəyişəndə diff uzun olur. `git diff menu.txt` yalnız bir faylın dəyişikliklərini göstərir.

## Stage-dən sonra {#after-add}

`git add`-dan sonra `git diff` heç nə çap etmir. Səbəb: o, working directory-ni son commit ilə yox, staging area ilə müqayisə edir və indi ikisi eynidir. Dəyişikliklər itməyib, staging area-ya keçib (vizualda görünür). Staged dəyişikliklərə növbəti dərsdə `git diff --staged` ilə baxacağıq.

## Yenidən dəyişmək {#change-again}

Menyuya `Muffin` əlavə etdik. `git diff` indi yalnız bu sətri göstərir, çünki qəhvə və limonad artıq staging area-dadır. Faylın iki versiyası var: staging area-dakı (qəhvə və limonadla) və diskdəki (həm də muffin ilə).

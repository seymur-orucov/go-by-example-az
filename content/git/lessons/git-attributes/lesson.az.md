Windows-da sətir CR və LF simvolları ilə bitir (`\r\n`, qısaca CRLF), macOS və Linux-da isə yalnız LF ilə. Komanda hər iki sistemdə işləyəndə repository-yə CRLF düşə bilər, onda shell skriptləri macOS-da işləmir. `.gitattributes` faylı commit olunur və bütün komandaya sətir sonları, binary fayllar, diff və merge üçün eyni qaydaları verir.

Nümunə Windows və macOS-da işləyən komandanın build skriptləridir: `build.sh`, `setup.bat`, `logo.png` və `generated/api.js`.

## CRLF repository-də {#crlf}

`build.sh` Windows-da yazılıb və commit olunub. `cat -A` gizli simvolları göstərir: `^M` CR simvoludur, `$` sətrin sonudur. Bu faylı macOS-da işə salsanız, shell `/bin/sh` əvəzinə sonunda CR olan `/bin/sh^M` proqramını axtarır və `bad interpreter` xətası verir.

`git ls-files --eol` hər izlənən faylın sətir sonlarını göstərir. `i/` staging area-dakı, yəni commit-ə gedən versiyadır, `w/` working directory-dəki fayldır. `crlf` və `lf` sətir sonlarının növüdür. `-text` isə Git-in faylı binary saydığını bildirir. `logo.png` şəkildir. `attr/` sütunu faylın atributlarını göstərir. Hələ `.gitattributes` yoxdur, ona görə o boşdur.

> **Bilgi:** Windows üçün Git quraşdırılanda adətən `core.autocrlf true` seçilir və commit zamanı CRLF LF-ə çevrilir. Amma bu, hər kəsin öz kompüterindəki ayardır. Biri onu söndürsə, CRLF yenə repository-yə düşür. Bu sessiyada o söndürülüb.

## Qaydalar: .gitattributes {#renormalize}

`.gitattributes`-in hər sətrində bir pattern və onun atributları var. Pattern-lər `.gitignore`-dakı kimi yazılır.

- `* text=auto`: Git hər faylın mətn olub-olmadığını özü təyin edir. Mətn faylları repository-də LF ilə saxlanır.
- `*.sh text eol=lf`: `text` faylın mətn olduğunu deyir, `eol=lf` isə working directory-də də LF tələb edir.
- `*.bat text eol=crlf`: `.bat` faylları Windows üçündür, working directory-də CRLF ilə yazılır.

`build.sh` həm `*`, həm də `*.sh` pattern-inə uyğundur. Belə halda sonrakı sətir üstün gəlir.

Faylı yaradıb stage etdik (bu komandalar gizlidir). Amma yeni qaydalar artıq commit olunmuş fayllara özü tətbiq olunmur. `git add --renormalize .` bütün izlənən faylları yeni qaydalarla yenidən stage edir. İndi mətn fayllarının `i/` sütununda `lf` var: commit-ə LF gedəcək. `w/` sütunu dəyişməyib, diskdəki fayllar hələ CRLF-dir. `attr/` sütununda hər fayla tətbiq olunan qayda görünür.

> **Bilgi:** `eol` verilməyən mətn faylları (`text=auto`) working directory-də sistemin adəti ilə yazılır: Windows-da CRLF, macOS və Linux-da LF. Repository-də isə hamısı LF ilə saxlanır.

## Working directory-dəki fayl {#checkout}

Commit-dən sonra repository-də `build.sh` LF ilə saxlanır. Git diskdəki faylı yalnız onu yenidən yazanda çevirir: clone, `git switch` və ya `git restore` zamanı. Ona görə faylı silib `git restore` ilə geri qaytardıq. `cat -A` çıxışında artıq `^M` yoxdur, `ls-files --eol` də `w/lf` göstərir.

macOS-dakı komanda yoldaşı repository-ni clone edəndə `build.sh` LF ilə yazılır. Windows-da da LF olur, çünki qayda `eol=lf` deyir. `setup.bat` isə hər iki sistemdə CRLF ilə yazılır.

## Binary fayllar {#binary}

İkinci addımın çıxışında `logo.png`-ə `text=auto` tətbiq olunurdu. Git məzmuna baxıb faylın binary olduğunu özü təxmin etdi (`i/-text`). `*.png binary` qaydası bu təxmini aradan qaldırır. `git check-attr -a <fayl>` fayla tətbiq olunan bütün atributları çap edir.

`binary` makro atributdur, yəni üç atributu birdən dəyişir. `-text`: Git sətir sonlarına toxunmur. `-diff`: `git diff` sətir-sətir fərq göstərmir. `-merge`: iki branch faylı fərqli dəyişsə, Git onları birləşdirmir və konflikt verir. Çıxışdakı `set` atributun qoyulduğunu, `unset` isə götürüldüyünü bildirir (`.gitattributes`-də `-` işarəsi).

Dizayner loqonu yeniləyib. `git diff` yalnız `Binary files a/logo.png and b/logo.png differ` yazır: fayl dəyişib, amma məzmunu göstərilmir.

## GitHub atributları və check-attr {#linguist}

`generated/api.js` skriptlə yaradılır və hər build-də dəyişir. `linguist-generated` atributu Git-in işinə təsir etmir, onu GitHub oxuyur. GitHub belə faylları pull request diff-ində bağlı göstərir və repository-nin dil statistikasına salmır. `vendor/** linguist-vendored` kimi sətir isə başqasından götürülmüş kodu yalnız dil statistikasından çıxarır.

`git check-attr -a` bir neçə fayl da qəbul edir. `build.sh` üçün `text: set` və `eol: lf`, `api.js` üçün `text: auto` və `linguist-generated: set` çap olunub. Fayl gözlənildiyi kimi davranmayanda əvvəlcə buna baxın: hansı qaydanın işlədiyi dərhal görünür.

> **Bilgi:** `merge` atributuna öz merge driver-inizi də vermək olar. Məsələn, `version.txt merge=ours` və `git config merge.ours.driver true`: hər iki branch faylı dəyişəndə merge sizin versiyanı saxlayır. Driver `.gitattributes`-də yox, config-də yazılır, ona görə hər kəs onu öz clone-unda qurmalıdır.

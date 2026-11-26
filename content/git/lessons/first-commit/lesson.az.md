Əvvəlki dərsdə faylın commit-ə qədər üç sahədən keçdiyini gördük. İndi bu yolu komandalarla keçirik: `git status` ilə vəziyyəti oxuyuruq, `git add` ilə faylları staging area-ya qoyuruq, `git commit` ilə snapshot yaradırıq.

Nümunə kiçik portfolio saytıdır: əvvəlcə onun iki fayllıq ilk versiyasını commit edirik, sonra üslubda bir düzəliş edirik.

## git status: vəziyyəti oxumaq {#status}

`git status` vəziyyəti tam cümlələrlə izah edir. `On branch main` hansı branch-da olduğumuzu, `No commits yet` isə hələ heç bir commit olmadığını bildirir. `Untracked files` bölməsində Git-in izləmədiyi fayllar var, mötərizədəki ipucu da növbəti komandanı göstərir: `git add <file>`.

> **Bilgi:** branch-ları üçüncü modulda keçəcəyik. Hələlik `main` tarixçənin əsas xəttinin adıdır.

## Bir faylı əlavə etmək {#add-file}

`git add index.html` yalnız bir faylı stage edir. İndi `git status` iki bölmə göstərir: `Changes to be committed` növbəti commit-ə düşəcək faylları (`new file`, yəni yeni fayl), `Untracked files` isə hələ kənarda qalanları. Mötərizədəki `git rm --cached` faylı staging area-dan geri çıxarmaq üçündür; dəyişikliyi geri almağı "Səhvləri düzəltmək" modulunda keçəcəyik.

## Hamısını əlavə etmək: git add . {#add-all}

`git add .` cari qovluqdakı bütün yeni və dəyişmiş faylları stage edir: nöqtə "bu qovluq və içindəki hər şey" deməkdir. Qısa çıxışda hər iki fayl `A ` ilə görünür. Bu rahatdır, amma ehtiyatsız istifadə etsəniz, commit-ə təsadüfi fayllar düşə bilər: parollu konfiqurasiya, böyük loglar.

> **Diqqət:** `git add .`-dan əvvəl `git status`-a baxın. Heç vaxt commit olunmamalı faylları `.gitignore` ilə istisna etmək olar; bunu bu modulun son dərsində görəcəyik.

## Commit və onun çıxışı {#commit}

`git commit -m "..."` staging area-nı snapshot kimi yazır, `-m` isə mesajı birbaşa komandada verir. Çıxışın birinci sətrində branch (`main`), `root-commit` (ilk commit), qısa hash və mesaj var. Sonra statistika gəlir: neçə fayl dəyişib və neçə sətir əlavə olunub. `create mode 100644` bu commit-də yeni faylın yarandığını və onun adi, icra olunmayan fayl olduğunu bildirir.

> **Bilgi:** `-m` olmadan `git commit` mesaj yazmaq üçün mətn redaktoru açır. Bir neçə sətirlik uzun mesajlar üçün bu daha rahatdır.

## Qısayol: git commit -a {#commit-all}

`-a` flag-i izlənən, yəni artıq commit-də olan bütün dəyişmiş faylları özü stage edib commit edir, ayrıca `git add` lazım olmur (`-am` isə `-a -m`-in birləşmiş yazılışıdır). Amma **yeni** faylları götürmür: `about.html` heç vaxt commit olunmayıb, ona görə `??` ilə kənarda qaldı. Çıxışdakı `1 file changed` da bunu təsdiqləyir: yalnız `style.css` yazıldı.

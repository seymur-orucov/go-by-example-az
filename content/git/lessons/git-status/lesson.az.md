`git status` repository-nin cari vəziyyətini göstərir: hansı fayllar dəyişib, hansılar növbəti commit-ə hazırdır, hansıları Git ümumiyyətlə izləmir. Commit-dən əvvəl ona baxmaq təsadüfi faylların commit-ə düşməsinin qarşısını alır. Nümunə kiçik büdcə tətbiqidir: `README.md` və `app.js` artıq commit olunub.

## Təmiz vəziyyət {#clean}

`On branch main` hansı branch-da olduğunuzu göstərir. `nothing to commit, working tree clean` o deməkdir ki, fayllar son commit-dəki kimidir və staging area-da yeni heç nə yoxdur. Üç sahə eynidir.

## Dəyişmiş fayl: modified {#modified}

`app.js`-ə bir sətir əlavə etdik. Fayl artıq izlənir, ona görə `Untracked files`-da yox, `Changes not staged for commit` bölməsində `modified` kimi görünür. Dəyişiklik diskdədir, amma hələ stage edilməyib. Mötərizədəki ipuclarından `git add` dəyişikliyi staging area-ya qoyur, `git restore` isə onu ləğv edib faylı əvvəlki vəziyyətinə qaytarır.

> **Diqqət:** `git restore <file>` diskdəki dəyişikliyi geri qaytarmaq mümkün olmayan şəkildə silir. Onu "Səhvləri düzəltmək" modulunda ətraflı keçəcəyik.

## Üç bölmə {#sections}

İndi üç növ fayl var və `git status` hər birini ayrıca bölmədə göstərir:

- `Changes to be committed`: staged, növbəti commit-ə düşəcək (`README.md`);
- `Changes not staged for commit`: izlənən, amma stage edilməmiş dəyişiklik (`app.js`);
- `Untracked files`: Git-in hələ izləmədiyi yeni fayl (`notes.txt`).

Növbəti `git commit` yalnız birinci bölməni yazacaq. Birinci bölmənin ipucu `git restore --staged`-dir: o, faylı staging area-dan çıxarır, dəyişikliyi isə diskdə saxlayır.

## Qısa format: git status -s {#short}

`-s` (`--short`) hər faylı bir sətirdə, iki simvollu kodla göstərir. "Üç sahə" dərsində gördüyümüz kimi, sol simvol staging area-nı, sağ simvol working directory-ni bildirir: `M ` staged dəyişiklik, ` M` stage edilməmiş dəyişiklik, `??` untracked fayl.

`README.md`-ni stage etdikdən sonra yenidən dəyişdik və kod `MM` oldu. Staging area-da faylın bir versiyası, diskdə isə ondan yeni versiyası var. Commit yalnız staged versiyanı götürər.

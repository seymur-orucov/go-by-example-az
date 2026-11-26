`git diff --staged` staging area-nı son commit ilə müqayisə edir, yəni növbəti commit-ə məhz nəyin düşəcəyini göstərir. Əvvəlki dərsdəki adi `git diff` isə hələ stage edilməmiş dəyişiklikləri göstərirdi. İkisi birlikdə bütün dəyişiklikləri əhatə edir. Nümunə ad günü planıdır: qonaq siyahısı və büdcə.

## Staged dəyişikliyə baxmaq {#staged}

`Lena`-nı siyahıya əlavə edib stage etdik. Adi `git diff` heç nə göstərmir, çünki working directory staging area ilə eynidir. `git diff --staged` isə dəyişikliyi göstərir: staging area-da son commit-də olmayan bir sətir var. Çıxışın formatı əvvəlki dərsdəki ilə eynidir.

## İki diff, iki sual {#both}

Büdcəyə yeni xərc əlavə etdik, amma stage etmədik. İndi adi `git diff` yalnız `budget.txt`-i göstərir. `git diff --staged` isə dəyişməyib: orada hələ də yalnız `guests.txt` var. Commit-dən əvvəl `--staged` "commit-ə nə düşəcək?" sualına, adi `git diff` isə "nəyi stage etməyi unutmuşam?" sualına cavab verir.

> **Bilgi:** `git diff HEAD` hər ikisini birlikdə göstərir: o, working directory-ni son commit ilə müqayisə edir (`HEAD` son commit-dir, onu "Tarixçə" modulunda keçəcəyik).

## Yeni fayl {#new-file}

Untracked fayl heç bir diff-də görünmür, çünki Git onu hələ izləmir. `git add`-dan sonra `notes.txt` `git diff --staged`-də çıxır. `new file mode 100644` yeni faylı, `--- /dev/null` isə köhnə versiyanın olmadığını bildirir. `@@ -0,0 +1 @@` da bunu deyir: köhnədə sıfır sətir, yenidə bir sətir.

## --cached və commit {#cached}

`--cached` `--staged` ilə eyni işi görür. Bu, köhnə addır və bir çox sənəddə rast gəlinir. Sonda fayl adı yazsanız, diff yalnız o faylı göstərir. Commit-dən sonra `git diff --staged` boşdur, çünki staging area son commit ilə eynidir. Stage etmədiyimiz büdcə dəyişikliyi isə yerindədir və adi `git diff`-də görünür.

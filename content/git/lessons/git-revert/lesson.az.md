`git revert <commit>` həmin commit-in dəyişikliyini tərsinə çevirən **yeni** commit yaradır. Commit-in əlavə etdiyi sətir silinir, sildiyi sətir geri qayıdır, köhnə commit isə tarixçədə qalır. Tarixçə yenidən yazılmadığı üçün revert artıq push olunmuş branch-da da təhlükəsizdir.

Nümunə avtomobil kirayəsinin qiymət cədvəlidir (`car-rental/`): `prices.txt`-də gündəlik qiymətlər dollarla, `cars.txt`-də hər sinifdə neçə avtomobil olduğu yazılıb.

## Son commit-i geri almaq {#revert-last}

Son commit, `Raise the SUV price`, SUV-un qiymətini 80 dollardan 95 dollara qaldırıb. Bu qiymət razılaşdırılmayıb və onu geri qaytarmaq lazımdır. `git revert HEAD` son commit-in dəyişikliyinin tərsini yeni commit kimi yazır. `--no-edit` Git-in hazır mesajını redaktor açmadan götürür; merge-də də belə idi.

Çıxışın birinci sətri yeni commit-in mesajını göstərir: `Revert` sözü və dırnaqda köhnə commit-in mesajı. ` Date:` sətri yeni commit-in vaxtıdır. `1 file changed, 1 insertion(+), 1 deletion(-)` deyir ki, `prices.txt`-də `95` olan sətir silinib, `80` olan sətir qayıdıb.

`cat prices.txt` SUV üçün yenə `80 USD/day` göstərir. `git log --oneline`-da isə beş commit var. `Raise the SUV price` silinməyib, onun üstündə yeni commit durur. Vizualda yeni commit yalnız `prices.txt`-i dəyişib, `cars.txt` parent-dəki kimidir.

## Revert push olunmuş branch-da {#shared}

`git log -1` yeni commit-in tam mesajını göstərir. Başlıqdan sonra boş sətir, sonra `This reverts commit` və geri alınan commit-in tam hash-i gəlir. Bu sətirlə sonra hansı commit-in ləğv olunduğunu tapmaq olur. Səbəbi də yazmaq istəsəniz, `--no-edit`-siz işlədin: redaktorda başlığın altına bir sətir əlavə edərsiniz.

`Raise the SUV price` artıq serverdə idi: əvvəlki addımın vizualında `origin/main` onu göstərirdi. Buna baxmayaraq `git push` heç bir əlavə seçim istəmir. Çıxışdakı `main -> main` serverdəki `main`-in yeni commit-ə irəlilədiyini göstərir. Vizualda `origin/main` də yeni commit-ə keçib. Tarixçəyə yalnız commit əlavə olundu, ona görə komanda yoldaşları revert-i `git pull` ilə adi commit kimi alırlar.

Commit-i tarixçədən silən komandalar da var (`git reset`), onları növbəti dərslərdə keçəcəyik. Push olunmuş commit-i silmək başqalarının clone-undakı tarixçə ilə ziddiyyət yaradır. Revert-də belə problem yoxdur.

## Köhnə commit-i geri almaq {#older}

Ofis kabrioleti kirayə verməmək qərarına gəlir. `git log --oneline -3`-də `Add the convertible` üçüncü sətirdir, yəni `HEAD~2`. Revert yalnız son commit-i yox, istənilən commit-i geri ala bilər. `git revert --no-edit HEAD~2` yalnız həmin commit-in dəyişikliyini ləğv edir.

`2 files changed, 2 deletions(-)`: iki faylın hər birindən bir sətir silinib. `cat` iki faylı ardıcıl çap edir və heç birində `convertible` sətri yoxdur. Ondan sonrakı commit-lərin işi yerindədir: SUV-un qiyməti yenə 80 dollardır.

> **Diqqət:** geri alınan sətirləri sonrakı commit-lər də dəyişibsə, revert konfliktlə dayanır. Konflikti merge-dəki kimi həll edib `git add` və `git revert --continue` yazırsınız. Fikrinizi dəyişsəniz, `git revert --abort` hər şeyi əvvəlki vəziyyətə qaytarır.

## Bir neçə revert, bir commit {#no-commit}

Bu arada qış endirimi üçün iki commit yazılıb. `Add the winter discount` `discount.txt` faylını yaradıb, `Extend the winter discount` onu dəyişib. İndi endirim tam ləğv olunur. Hər commit-i ayrıca revert etsək, tarixçəyə iki `Revert` commit-i düşər.

`--no-commit` (qısası `-n`) commit yaratmır: dəyişikliyi faylda və staging-də saxlayır. `HEAD~2..HEAD` "HEAD-də var, `HEAD~2`-də yox" deməkdir, yəni son iki commit. Komanda heç nə çap etmir.

`git status`-da `ahead of 'origin/main' by 3 commits` üç commit-in hələ push olunmadığını deyir. `You are currently reverting commit` sətri revert-in bitmədiyini göstərir. Orada sonuncu geri alınan commit-in qısa hash-i var. Git aralıqda əvvəlcə yeni commit-i, sonra köhnəsini geri alır, ona görə bu, `Add the winter discount`-dır. Mötərizədəki ipucları `--continue`, `--skip` və `--abort`-u təklif edir. `Changes to be committed` altında `deleted: discount.txt` var: iki commit-in tərsi faylı silməkdir. `git commit -m` hamısını mesajını özünüz verdiyiniz bir commit kimi yazır və revert bitir.

## Merge commit-i geri almaq {#merge}

Sığorta seçimləri `feat/insurance` branch-ında hazırlanıb və `--no-ff` ilə merge olunub. Qrafda merge commit və branch-ın commit-i görünür. Sonra sığortanı hələ satmamaq qərara alınır.

`git revert HEAD` xəta verir: `is a merge but no -m option was given`. Merge commit-in iki parent-i var və Git hansı tərəfə qayıtmaq lazım olduğunu bilmir. `fatal: revert failed` heç nəyin dəyişmədiyini bildirir.

`-m 1` birinci parent-i, yəni merge-dən əvvəlki `main`-i əsas götürür. Git merge commit-i onunla müqayisə edir və branch-ın gətirdiyini geri alır. `delete mode 100644 insurance.txt`: fayl silinib, `ls` yalnız iki fayl göstərir. `feat/insurance` branch-ı və onun commit-i yerində qalıb.

> **Diqqət:** merge-i revert etdikdən sonra `feat/insurance`-ı yenidən merge etmək faylı qaytarmır. Git branch-ın commit-lərini artıq merge olunmuş sayır və `Already up to date.` yazır. Sığortanı qaytarmaq üçün revert commit-inin özünü revert edin: revert-in revert-i dəyişikliyi geri gətirir, mesajı isə `Reapply` ilə başlayır. Git 2.43-dən əvvəlki versiyalar burada `Revert "Revert ..."` yazırdı.

`post-checkout` hook-u `git switch` branch-ı dəyişib faylları working directory-yə yazandan sonra işləyir. `pre-commit`-dən fərqli olaraq o, heç nəyi dayandıra bilmir, ona görə onda keçiddən sonrakı xatırlatmaları yazırlar.

Nümunə kiçik mağaza API-sidir (`shop-api`): `feat/payments` branch-ı `deps.txt`-dəki asılılıqlara `stripe-cli` əlavə edir, developer-lər isə keçiddən sonra installer-i işə salmağı unudurlar.

## Hook-un üç arqumenti {#arguments}

Əvvəlcə arqumentləri görmək üçün iki sətirlik hook yazırıq. O, üç arqumenti bir sətirdə çap edir. Faylı əvvəlki dərslərdəki kimi `printf` və `chmod +x` ilə yaradırıq.

`git switch feat/payments` əvvəl öz sətrini çap edir: `Switched to branch 'feat/payments'`. Sonra hook işləyir. İlk iki arqument commit hash-ləridir. Birincisi keçiddən əvvəlki HEAD-dir, yəni `main`-in son commit-i. İkincisi yeni HEAD-dir, `feat/payments`-in son commit-i. Onların başlanğıcını `git branch -v`-dəki qısa hash-lərlə tutuşdurun. Üçüncü arqument `1`-dir, yəni bu, branch keçidi idi.

`git switch main` geri qayıdır və ilk iki hash yer dəyişir.

> **Bilgi:** `git checkout feat/payments` də hook-u eyni arqumentlərlə işə salır. `git clone` da onu işə salır, birinci arqument isə sıfırlardan ibarət olur, çünki əvvəlki HEAD yoxdur. Yeni klonun `.git/hooks`-unda hələ yalnız `.sample` faylları olur. Ona görə clone zamanı hook yalnız qlobal qoşulubsa işləyir, məsələn `git config --global core.hooksPath` ilə.

## Eyni commit və fayl bərpası {#same-commit}

`git switch -c feat/refunds` yeni branch yaradıb ona keçir. Hook yenə işləyir və bayraq `1`-dir, amma iki hash eynidir. Yeni branch `main`-in commit-indən başlayır. HEAD başqa branch-ı göstərir, commit isə dəyişmədi. Ona görə hook-da ilk iki arqumentin həmişə fərqli olduğunu fərz etməyin.

Sonra `app.sh`-ə sətir əlavə edib onu `git restore` ilə geri qaytarırıq. `git restore` da hook-u işə saldı, amma bayraq `0`-dır. `0` fayl bərpası deməkdir: Git branch-ı dəyişmədi, yalnız faylı staging area-dan götürdü. HEAD yerində qaldığı üçün iki hash eynidir.

> **Bilgi:** `git checkout -- app.sh` də faylı bərpa edir və hook-u `0` bayrağı ilə işə salır.

## deps.txt dəyişibsə, xatırlatmaq {#reminder}

İndi hook-u faydalı edirik, `cat` onun mətnini göstərir. `if [ "$3" = 1 ]` içini yalnız branch keçidində işə salır. `git diff --quiet "$1" "$2" -- deps.txt` iki commit-dəki `deps.txt`-i müqayisə edir və heç nə çap etmir. Fərq yoxdursa, çıxış kodu `0`, varsa `1` olur. `||` sağdakı komandanı yalnız soldakı uğursuz olanda işə salır. Ona görə `echo` yalnız `deps.txt` fərqli olanda çap olunur.

`fix/port` yalnız `app.sh`-də portu dəyişib, `deps.txt` isə `main`-dəki kimidir. Ona görə keçiddən sonra xatırlatma yoxdur. `feat/payments`-in `deps.txt`-ində `stripe-cli` var və hook `deps.txt changed: run the installer` çap edir.

Hook commit-ləri müqayisə edir, diskdəki faylı yox. `git restore --source=main deps.txt` faylı dəyişdi, `git status --short` ` M deps.txt` göstərir. Hook isə susdu: bayraq `0`-dır.

> **Bilgi:** `echo` əvəzinə quraşdırma komandasını birbaşa çağırmaq da olar. Onda hər keçid quraşdırma bitənə qədər gözləyir.

## Çıxış kodu keçidi geri qaytarmır {#exit-status}

`deps.txt`-i geri qaytarıb hook-u qəsdən uğursuz edirik: o, bir sətir çap edib `exit 1` ilə bitir. `git switch main` yenə `Switched to branch 'main'` yazır, sonra hook-un sətri gəlir. `echo $?` əvvəlki komandanın çıxış kodunu çap edir: `1`. `git branch` isə `* main` göstərir, yəni keçid baş verib.

`post-checkout` keçidin nəticəsini dəyişə bilmir. Onun çıxış kodu sadəcə `git switch`-in çıxış kodu olur. Bunu skriptlərdə görəcəksiniz: `git switch main && sh app.sh` zəncirində `app.sh` işləmir, halbuki branch artıq dəyişib.

> **Diqqət:** keçidi dayandırmaq üçün `post-checkout` yaramır, o işləyəndə fayllar artıq yazılıb. Xatırlatma hook-unu `0` ilə bitirin ki, `git switch` uğursuz görünməsin.

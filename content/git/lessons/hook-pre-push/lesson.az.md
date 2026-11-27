`pre-push` hook-u `git push` serverə nəsə göndərməzdən əvvəl işləyir. Hook 0-dan fərqli kodla bitsə, push dayanır və serverə heç nə getmir. `pre-commit` hər commit-də işləyir, `pre-push` isə yalnız push-da, ona görə uzun çəkən testlər üçün daha uyğundur.

Nümunə məhsulun landing page-idir (`index.html` və test skripti `check.sh`), `origin` isə `~/server/landing.git` bare repository-sidir.

## Hook nə alır {#hook-input}

İlk hook yalnız Git-in ona verdiyini çap edir. `$1` remote-un adı, `$2` onun ünvanıdır. Çıxışın birinci sətri budur: `origin /home/sam/server/landing.git`. GitHub-da ünvan `https://github.com/...` və ya `git@github.com:...` olardı.

`cat` hook-un stdin-ini, yəni Git-in hook-a yazdığı mətni çap edir. Push olunan hər ref üçün bir sətir gəlir, dörd sahə ilə. Birinci sahə lokal ref-dir: `refs/heads/main` `main` branch-ının tam adıdır. İkinci sahə göndərilən commit-in tam hash-idir. Üçüncü sahə serverdəki ref-dir. Dördüncü sahə serverdə həmin ref-in indiki commit-idir.

İlk push-da dördüncü sahə sıfırlardan ibarətdir: serverdə hələ `main` yox idi. İkinci push-da orada serverdəki `main`-in commit-i var. Onun ilk simvolları `To`-dan sonrakı sətirdə `..`-nın solundakı qısa hash ilə eynidir. Hook-un sətirləri `To` sətrindən əvvəl gəlir: hook işləyəndə hələ heç nə göndərilməyib.

## Testi işlətmək {#run-tests}

`check.sh` bu layihənin testidir. `index.html`-də `lorem` sözü varsa (böyük-kiçik hərf fərq etmir), xəbər çap edir və 1 kodu ilə bitir. Yeni hook bir sətirdir: `sh check.sh || exit 1`. Test uğursuz olsa, hook da 1 ilə çıxır. Faylı birinci addımdakı `chmod +x` icra olunan etdi, `printf` isə yalnız məzmununu dəyişir.

Sam səhifəyə şablon mətn (`Lorem ipsum...`) əlavə edib commit etdi və push yazdı. Test `check failed` yazdı, Git isə `error: failed to push some refs` ilə dayandı. `To` sətri yoxdur, serverə heç nə getməyib. `git status` commit-in lokal qaldığını göstərir: `ahead of 'origin/main' by 1 commit`.

## Düzəldib yenidən push etmək {#fix}

Sam şablon sətri real mətnlə əvəz edib yeni commit yaratdı. İndi test `check passed` yazır və 0 ilə bitir. Push keçir və serverə iki commit gedir: əvvəl dayanan commit və düzəliş.

> **Diqqət:** `check.sh` işçi qovluqdakı `index.html`-i yoxlayır, göndərilən commit-ləri yox. Şablonlu commit tarixçədə qaldı və serverə getdi. Onu tarixçədən çıxarmaq üçün push-dan əvvəl `git commit --amend` ilə düzəltmək olardı.

## main-ə birbaşa push-u saxlamaq {#block-main}

Çox komandada `main`-ə yalnız pull request ilə merge edilir. Yeni hook `main`-ə birbaşa push-u saxlayır. O, əvvəl testi işlədir, sonra stdin-i oxuyur. `while read` sətirləri bir-bir oxuyur və hər sətrin dörd sahəsini dörd dəyişənə yazır. `if` üçüncü sahəni, yəni serverdəki ref-i `refs/heads/main` ilə müqayisə edir. Uyğun gəlsə, hook xəbər çap edib 1 ilə çıxır.

Sam `main`-də commit yaratdı və push etdi. Test keçdi, amma hook push-u dayandırdı. Sam eyni commit-dən `buy-button` branch-ını yaratdı və onu göndərdi. Bu dəfə serverdəki ref `refs/heads/buy-button` idi, push keçdi. Vizualda `main`, `buy-button` və `origin/buy-button` eyni commit-dədir. `origin/main` isə bir commit geridə qalıb.

## Hook-u keçmək: --no-verify {#no-verify}

`git push --no-verify` hook-u ümumiyyətlə işlətmir. Çıxışda `check passed` da yoxdur: test də işləmədi. `main` serverə getdi.

Hook hər developer-in öz `.git/hooks` qovluğundadır. O, clone ilə ötürülmür və bir flag ilə keçilir. Ona görə `main`-i həqiqətən serverdəki qayda qoruyur, məsələn GitHub-da branch qorunma qaydası ("Client və server hook-ları" dərsi). `pre-push` isə xətanı push-dan əvvəl, developer-in öz kompüterində göstərir.

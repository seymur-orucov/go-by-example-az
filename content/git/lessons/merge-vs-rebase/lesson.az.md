Feature branch yaradılandan sonra `main`-ə yeni commit-lər düşür. Onları branch-a gətirməyin iki yolu var: `git merge main` və `git rebase main`. Hər ikisindən sonra fayllar eyni olur, fərq isə tarixçədə və komanda yoldaşlarına təsirdədir.

Nümunə kiçik xəbər saytının komandasıdır: Sam hava proqnozu widget-ini `feat/weather-widget` branch-ında yazır, Ayla da ona kömək edir.

## Eyni vəziyyət, iki yol {#two-ways}

`feat/weather-widget`-də iki commit var: `Add weather box` və `Show temperature`. Bu müddətdə `main`-ə `Add sports page` və `Add footer` düşüb. Sam widget-i saytın son halında yoxlamaq istəyir, ona görə `main`-in yeni commit-lərini branch-a gətirir.

`git merge main` branch-ın iki commit-inə toxunmur. Git onların üstünə merge commit yaradır, mesajı `Merge branch 'main' into feat/weather-widget` olur. `git log --oneline --graph`-da iki xətt görünür və merge commit-də birləşir. Tarixçə işin necə getdiyini olduğu kimi göstərir: iki iş paralel gedib, sonra birləşib.

`git rebase main` isə Sam-ın iki commit-ini `main`-in son commit-inin üstünə köçürür. Mesajlar və dəyişikliklər eynidir, amma bunlar yeni hash-li yeni commit-lərdir. Tarixçə düz xətt olur, merge commit yoxdur. Tarixçəyə baxan elə bilər ki, Sam işə `Add footer`-dən sonra başlayıb.

Cədvəldə yaşıl xana həmin aspektdə üstün olan tərəfi göstərir.

## Rebase-in qızıl qaydası {#golden-rule}

Rebase köhnə commit-ləri dəyişmir, onların yerinə yenilərini yaradır. Köhnələr isə Sam-ın branch-ından çıxır. Commit yalnız Sam-ın kompüterindədirsə, bunu heç kim hiss etmir. Commit push olunubsa, onun surəti serverdə və komanda yoldaşlarının clone-larında da var. Sam-ın rebase-i o surətlərə toxunmur.

Ona görə rebase-in qızıl qaydası var. Pro Git kitabı onu belə yazır: *Do not rebase commits that exist outside your repository and that people may have based work on.* Yəni repository-nizdən kənarda olan və başqalarının üzərində iş qura biləcəyi commit-ləri rebase etməyin. Push olunmuş commit artıq kənardadır. Push etmədiyiniz commit-ləri isə rahat rebase edə bilərsiniz.

Qayda merge-ə aid deyil. Merge mövcud commit-lərin heç birini dəyişmir, yalnız yenisini əlavə edir. Ona görə paylaşılmış branch-a `main`-i gətirməyin təhlükəsiz yolu merge-dür.

## Qayda pozulanda {#broken-rule}

Sam `feat/weather-widget`-i push edib. Ayla onu götürüb, üstünə `Add weather icons` commit-ini əlavə edib və push edib. Sam bunu `git pull` ilə alır. Sonra branch-ı `git rebase main` ilə yeniləyir. Rebase branch-ın üç commit-inin hamısını köçürür, Ayla-nınkını da. İndi Sam-da onların yeni surətləri var, serverdə isə köhnələri.

`git push` rədd olunur: `! [rejected] feat/weather-widget -> feat/weather-widget (non-fast-forward)`. Sam-ın branch-ı serverdəkinin davamı deyil, çünki köhnə commit-lər onda yoxdur. Push yalnız `git push --force` ilə keçir. Force push serverdəki branch-ı Sam-ınkı ilə əvəz edir; onu bu modulda ayrıca keçəcəyik.

Ayla-da isə köhnə commit-lər qalıb, üstündə də yeni `Add city search` commit-i var. O, `git pull --no-rebase` yazır. Git köhnə və yeni surətləri iki ayrı tarixçə kimi görür və merge commit ilə birləşdirir. Ayla-nın `git log`-unda `Add weather box` və `Add weather icons` iki dəfə görünür. Müəllif və mesaj eynidir, hash-lər fərqlidir. Ayla bunu push etsə, köhnə surətlər serverə qayıdır və tarixçə hamı üçün qarışır.

> **Bilgi:** `git pull --rebase` belə halda adətən kömək edir. Git yenidən yazılmış commit-ləri tanıyır və yalnız Ayla-nın öz commit-ini yeni tarixçənin üstünə köçürür. Amma bunun üçün Ayla nə baş verdiyini bilməlidir. Qaydaya əməl etmək daha asandır.

## Konflikt: bir dəfə və ya hər commit-də {#conflicts}

Bu dəfə Sam-ın branch-ında üç commit var: `Rename widget title`, `Add city to title` və `Add units to title`. Üçü də `widget.conf`-da başlıq sətrini dəyişir. `main`-də də kimsə həmin sətri `title=Forecast` edib.

`git merge main` iki tərəfin son halını müqayisə edir. Konflikt bir dəfə yaranır. Sam onu bir dəfə həll edir və merge commit yaranır.

`git rebase main` commit-ləri bir-bir köçürür və hər birini ayrıca tətbiq edir. Burada rebase üç dəfə dayanır. Sam hər dəfə rebase dərsindəki kimi konflikti həll edir və `git rebase --continue` yazır. Növbəti commit eyni sətri yenə dəyişir və yenə konflikt verir. Üç commit, üç konflikt.

Commit-lər faylın müxtəlif yerlərinə toxunursa, rebase-in bu xüsusiyyəti işə yarayır: hər dəfə yalnız bir commit-in dəyişikliyinə baxırsınız. Çox commit eyni sətri dəyişəndə isə merge daha az iş tələb edir.

## git pull --rebase və komanda qaydası {#team-rule}

Rebase-in ən təhlükəsiz yeri push olunmamış lokal commit-lərdir. Sam `main`-də `Add rain alert` commit-ini edib, hələ push etməyib. Bu vaxt Ayla serverə `Add ad banner` göndərib. Fetch və pull dərsində belə halda adi `git pull` dayanırdı və merge, rebase və ya fast-forward seçməyi istəyirdi.

`git pull --rebase` əvvəlcə fetch edir, sonra Sam-ın commit-ini `origin/main`-in üstünə köçürür. Merge commit yaranmır, tarixçədə `Merge branch 'main' of ...` kimi heç nə deməyən commit-lər yığılmır. `git status` `Your branch is ahead of 'origin/main' by 1 commit.` yazır və `git push` adi qaydada qəbul olunur. Sam-ın commit-i heç yerə push olunmamışdı, ona görə qızıl qayda pozulmur. Seçimi hər dəfə yazmamaq üçün: `git config --global pull.rebase true`.

Komanda üçün sadə qayda belə ola bilər:

- Push etmədiyiniz commit-lər: `git pull --rebase` və ya `git rebase main`.
- Başqası ilə paylaşdığınız branch: `git merge main`.
- `main`-i heç vaxt rebase etmirsiniz.

Bəzi komandalar yalnız bir nəfərin işlədiyi branch-ı push-dan sonra da rebase edib force push edir. Bunun şərtlərini force push dərsində görəcəyik.

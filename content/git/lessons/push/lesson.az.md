`git push` `git fetch`-in əksini edir: lokal commit-ləri serverə göndərir və serverdəki branch-ı onlara çəkir. Push yalnız serverdəki branch-ı irəli apara bilər. Başqasının commit-i itəcəksə, push rədd olunur.

Nümunə quiz tətbiqinin sual bankıdır (`questions.json`, `README.md`): Sam onu `~/server/quiz-bank.git` bare repository-sindən artıq clone edib.

## Commit-i serverə göndərmək {#push-main}

Sam yeni sual əlavə edib commit etdi. `git push origin main` iki şeyi deyir: hansı remote-a (`origin`) və hansı branch-ı (`main`). Git serverdə olmayan commit-ləri göndərir, sonra serverdəki `main`-i yeni commit-ə çəkir.

Çıxışdakı `To` sətri serverin ünvanıdır. Burada server lokal qovluqdur. GitHub-da bu sətirdə `https://github.com/...` və ya `git@github.com:...` olardı. Növbəti sətirdə iki qısa hash var: serverdəki `main` birincidən ikinciyə keçib. `main -> main` soldakı lokal branch-ın sağdakı server branch-ına yazıldığını göstərir. `git status` artıq `up to date with 'origin/main'` deyir: uğurlu push-dan sonra Git `origin/main`-i də yeniləyir.

> **Bilgi:** real terminalda push `Enumerating objects`, `Writing objects` kimi irəliləyiş sətirləri də çap edir. Git onları yalnız terminala yazır, ona görə burada görünmür.

## Upstream-i olmayan branch {#no-upstream}

Sam çətin suallar üçün `hard-questions` branch-ını yaratdı və `hard.json` faylını commit etdi. Arqumentsiz `git push` isə xəta verdi: `has no upstream branch`. Upstream lokal branch-ın bağlı olduğu remote-tracking branch-dır. Arqumentsiz `git push` və `git pull` hara göndərəcəyini və haradan götürəcəyini ondan öyrənir. Bunu "Remote nədir" dərsindəki `upstream` adlı remote ilə qarışdırmayın: orada bu söz sadəcə remote-un adıdır.

`main` upstream-i clone zamanı aldı, o, `origin/main`-ə bağlıdır. Yeni branch isə yalnız Sam-ın kompüterində var, serverdə onun adaşı yoxdur. Git düzgün komandanı özü təklif edir: `git push --set-upstream origin hard-questions`. Son iki sətirdəki `push.autoSetupRemote` bu addımı avtomatik edən ayardır.

## git push -u: upstream təyin etmək {#set-upstream}

`-u` `--set-upstream`-in qısa yazılışıdır. Çıxışdakı `* [new branch]` serverdə yeni branch yarandığını bildirir. Orada əvvəl `hard-questions` yox idi, ona görə köhnə hash da yoxdur. Son sətir, `branch 'hard-questions' set up to track 'origin/hard-questions'`, upstream-in təyin olunduğunu deyir.

`git branch -vv` hər branch-ın upstream-ini kvadrat mötərizədə göstərir: `[origin/hard-questions]` və `[origin/main]`. `git status` da `up to date with 'origin/hard-questions'` yazır. `-u` hər branch üçün bir dəfə lazımdır. Bundan sonra bu branch-da arqumentsiz `git push` və `git pull` işləyir.

## Rədd edilən push {#rejected}

Bu vaxt Ayla öz clone-unda `questions.json`-a sual əlavə edib push etdi. Sam bundan xəbərsizdir. `git switch main` də `up to date with 'origin/main'` deyir, çünki status serverə qoşulmur. Sam `README.md`-ni dəyişib commit etdi və `git push` yazdı.

Push rədd olundu: `! [rejected] main -> main (fetch first)`. Serverdəki `main` Ayla-nın commit-indədir. Sam-ın commit-i isə ondan əvvəlki commit-in üstündə qurulub. Server `main`-i Sam-ın commit-inə çəksəydi, Ayla-nın commit-i branch-dan düşərdi. Ona görə push yalnız branch-ı irəli çəkə bilər: göndərilən commit serverdəki commit-in davamı olmalıdır.

Vizualda Sam-ın `origin/main`-i köhnə commit-də qalıb, `HEAD → main` ondan bir commit irəlidədir. Ayla-nın commit-i vizualda yoxdur: o, Sam-ın repository-sinə hələ gəlməyib. Sam-ın repository-sinə baxsaq, push adi irəliləmə kimi görünür. Amma serverdəki `main` artıq başqa yerdədir.

`error: failed to push some refs` sətri push-un alınmadığını təsdiqləyir. `fetch first` və `hint` sətirləri yolu göstərir: əvvəlcə serverdəki işi götürün, sonra yenidən push edin.

> **Diqqət:** `git push --force` belə push-u zorla qəbul etdirir və Ayla-nın commit-ini serverdən silir. Paylaşılan branch-da onu işlətməyin. Force push-u "Tarixçəni yenidən yazmaq" modulunda keçəcəyik.

## Əvvəl pull, sonra push {#pull-then-push}

`git pull --no-rebase --no-edit` Ayla-nın commit-ini gətirir və Sam-ın commit-i ilə merge edir. `From` sətri fetch hissəsidir: serverdəki `main` `origin/main`-ə yazılıb. Ayla `questions.json`-u, Sam isə `README.md`-ni dəyişib, ona görə konflikt yoxdur və Git merge commit yaradır. `--no-rebase` və `--no-edit`-i fetch və pull dərsindən tanıyırsınız.

İndi Sam-ın `main`-i Ayla-nın commit-ini də saxlayır. Push serverdəki `main`-i irəli çəkir və qəbul olunur. Vizualda merge commit və onun iki parent-i görünür. `origin/main` də merge commit-ə keçib, çünki push qəbul olundu. `git fetch` və `git merge origin/main` ilə də eyni nəticəni alarsınız.

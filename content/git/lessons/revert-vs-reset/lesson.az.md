`git revert` səhvi ləğv edən yeni commit əlavə edir, `git reset` isə branch-ı geri çəkir və commit branch-dan çıxır. Hər ikisini bilirsiniz. Hansını seçmək bir sualdan asılıdır: bu commit-i başqası artıq götürüb?

Nümunə kiçik komandanın `main`-dən deploy olunan to-do veb tətbiqidir: serverdəki `main` dəyişəndə sayt yenilənir.

## Eyni səhv, iki nəticə {#two-ways}

Sam `Hide done tasks` commit-ini push etdi. Bu commit tamamlanmış tapşırıqları gizlətməli idi, amma bütün siyahını gizlədir. `git revert HEAD` bu commit-in əksini edən yeni commit yaradır: `Revert "Hide done tasks"`. Tarixçədə hər ikisi qalır, `main` isə bir commit irəli gedir.

`git reset --hard HEAD~1` başqa cür işləyir. O, `main`-i bir commit geri çəkir. `Hide done tasks` `main`-in tarixçəsindən çıxır, sanki heç olmayıb. Yəni revert tarixçəyə commit əlavə edir, reset isə tarixçəni dəyişir.

Cədvəldə yaşıl xana həmin vəziyyətdə daha uyğun yolu göstərir.

## Push olunmuş commit: revert {#shared-revert}

`Hide done tasks` serverdəki `main`-dədir. Sayt onunla deploy olunub, Ayla da `git pull` edib onu götürüb. Belə tarixçəyə paylaşılmış (*shared*) tarixçə deyilir: commit artıq başqalarının repository-sindədir. Onu Sam öz kompüterindən hamıdan silə bilməz.

Sam `git revert HEAD` edib push edir. Revert commit-i serverdəki `main`-in davamıdır, ona görə push adi qaydada qəbul olunur və sayt düzəlir. Ayla növbəti `git pull`-da revert commit-ini adi commit kimi alır.

Tarixçədə həm səhv, həm də onun ləğvi qalır. `git log`-da səhvi kimin və nə vaxt geri aldığı görünür. Revert commit-inin mesajında `This reverts commit` sətri səhv commit-in hash-ini saxlayır. Səhv commit merge commit idisə, revert dərsindən bildiyiniz kimi `git revert -m 1` lazımdır.

## Push olunmuş commit-i reset etsəniz {#shared-reset}

Sam revert əvəzinə `git reset --hard HEAD~1` etsəydi, yalnız öz `main`-i geri gedərdi. Serverdəki `main` və Ayla-nın clone-u yerində qalır, sayt hələ də xarabdır. `git status` bunu göstərir: `Your branch is behind 'origin/main' by 1 commit`.

`git push` rədd olunur: `! [rejected] main -> main (non-fast-forward)`. Push serverdəki branch-ı yalnız irəli çəkə bilər. Sam-ın `main`-i isə serverdəkinin davamı deyil, ondan geridədir. Push dərsində mötərizədə `fetch first` yazılmışdı. Orada Sam serverdəki commit-i hələ görməmişdi, burada isə `origin/main` onu göstərir.

Git-in məsləhəti `git pull`-dur, amma o, səhv commit-i geri gətirir. Sam başladığı yerə qayıdır. Push-u `--force` ilə zorla qəbul etdirmək olar, amma bu, komanda yoldaşlarının clone-larını pozur. Force push-u "Tarixçəni yenidən yazmaq" modulunda keçəcəyik.

## Lokal commit: reset {#local-reset}

Sam-ın ikinci səhvi `Log every request` commit-idir. Yoxlama üçün yazdığı kod təsadüfən commit olunub və hələ push olunmayıb. `git status` `Your branch is ahead of 'origin/main' by 1 commit` yazır. `git log --oneline origin/main..main` də push olunmamış commit-ləri siyahılayır. Bu commit yalnız Sam-ın kompüterindədir.

Burada reset düzgün seçimdir. `git reset --hard HEAD~1` commit-i və onun dəyişikliyini atır. Kodu saxlamaq istəsəniz, `--soft` və ya `--mixed` seçin. Sonrakı push adi qaydada işləyir və tarixçədə bu səhvin izi qalmır. Revert də işləyərdi, amma ortaq tarixçəyə heç kimin görmədiyi səhv və onun ləğvi düşərdi.

Səhv son commit-dədirsə və onu düzəltmək kifayətdirsə, `git commit --amend` daha qısa yoldur. Düzəldilmiş commit köhnəsini əvəz edir.

> **Bilgi:** `origin/main` serverdəki `main`-in Sam-ın son push və ya fetch anındakı vəziyyətidir. Commit `origin/main`-in tarixçəsindədirsə, o artıq serverdədir və başqası onu götürmüş ola bilər. Onda revert seçin.

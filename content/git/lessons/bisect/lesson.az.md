Proqram əvvəl düzgün işləyirdi, indi səhv nəticə verir. `git bisect` xətanı gətirən commit-i ikili axtarışla (binary search) tapır. O, ortadakı commit-i yoxlamağı təklif edir və hər cavabdan sonra şübhəli commit-lərin yarısını atır.

Nümunə `converter` repository-sidir: `convert.sh` Selsi dərəcəsini Farengeytə çevirir, səkkiz commit-in ilkində `v1.0` tag-ı durur.

## Xəta haradan gəlib {#problem}

`sh convert.sh 100` `203` çap edir. 100 °C isə 212 °F-dir, deməli skript səhv hesablayır. `v1.0` versiyası düzgün işləyirdi. Vizualda `tag: v1.0` ən aşağıdakı, ilk commit-in yanındadır.

`git log --oneline` səkkiz commit göstərir: `v1.0`-dan sonra yeddi commit gəlib və xəta onlardan birindədir. Sonuncunun pis olduğunu artıq bilirik. Qalanlarını bir-bir yoxlasaq, altı yoxlama lazım ola bilər. İkili axtarış ortadakı commit-i yoxlayır. Orada xəta yoxdursa, xəta sonrakı yarıdadır. Varsa, həmin commit-də və ya əvvəlki yarıdadır. Hər yoxlama şübhəli commit-ləri təxminən iki dəfə azaldır. Yeddi şübhəli commit üçün üç yoxlama kifayətdir, min commit üçün təxminən on.

## Bisect-i başlatmaq {#start}

`git bisect start` axtarışı başladır. Git hər komandadan sonra hələ nəyi gözlədiyini yazır. `waiting for both 'good' and 'bad' commits` o deməkdir ki, həm yaxşı (good), həm də pis (bad) commit lazımdır. `git bisect bad` arqumentsiz indiki commit-i, yəni HEAD-i pis kimi qeyd edir. `git bisect good v1.0` `v1.0`-ı yaxşı kimi qeyd edir.

İki sərhəd məlum olanda Git ortadakı commit-ə keçir. `Bisecting` sətri bu commit-dən sonra neçə commit yoxlanmalı qaldığını (`3 revisions`) və təxminən neçə addım qaldığını (`roughly 2 steps`) yazır. Növbəti sətirdə kvadrat mötərizədə keçdiyi commit-in tam hash-i, yanında isə mesajı var: `Add common temperatures`.

`git status` `HEAD detached at` yazır: bisect commit-lərə detached HEAD ilə keçir. İkinci sətir axtarışın `main`-dən başladığını xatırladır. Vizualda `HEAD` tarixçənin ortasındadır, `main` isə yerində qalıb.

## Yoxlamaq və qeyd etmək {#mark}

İşçi qovluqda indi `Add common temperatures` commit-inin faylları var. Skripti işə salırıq və `212` alırıq. Nəticə düzgündür, ona görə `git bisect good` yazırıq. Deməli, xəta bu commit-dən sonra gəlib. Git qalan commit-lərin ortasına, `Add body temperature`-a keçir. Burada `203` çıxır və `git bisect bad` yazırıq.

Hər cavabdan sonra `Bisecting` sətrindəki say azalır: əvvəl `1 revision`, sonra `0 revisions`. `0 revisions left` axtarışın bitdiyini bildirmir. Git yenə bir commit-ə keçib (`Simplify the formula`) və onu da yoxlamaq lazımdır. Bu yoxlamadan sonra başqa commit qalmır.

> **Diqqət:** səhv cavab (`good` əvəzinə `bad`) axtarışı səhv commit-ə aparır. `git bisect log` indiyə qədər verdiyiniz cavabları göstərir.

## Xətalı commit tapıldı {#found}

`Simplify the formula`-da da `203` çıxır və `git bisect bad` yazırıq. Git artıq cavabı bilir: `is the first 'bad' commit`. Bu sətirdə xətanın ilk göründüyü commit-in hash-i var. Altında həmin commit `git log` formatında gəlir. Orada müəllif, tarix, mesaj və dəyişən fayl (`convert.sh | 2 +-`) görünür. Cəmi üç yoxlama lazım oldu.

`git bisect reset` axtarışı bitirir və bisect-dən əvvəlki branch-a qaytarır. `Previous HEAD position was` sətri HEAD-in son yoxlanan commit-də olduğunu yazır, sonra `Switched to branch 'main'` gəlir. Reset etməsəniz, HEAD ayrılmış qalır və Git axtarışın davam etdiyini hesab edir.

Xətalı commit `main`-dən üç commit geridədir, ona görə `git show HEAD~3` onun diff-ini göstərir. Mötərizələrin silinməsi nəticəni dəyişmir. Xəta başqa yerdədir: `32` yerinə `23` yazılıb.

## Avtomatik axtarış: bisect run {#run}

Yoxlamanı əllə təkrarlamaq əvəzinə onu skriptə yazmaq olar. `test.sh` `convert.sh 100`-ün nəticəsini `212` ilə müqayisə edir. Nəticə düzdürsə, skript `0` kodu ilə çıxır, deyilsə `1` ilə. Bu ədədə çıxış kodu (exit code) deyilir, `echo $?` onu çap edir. `main`-də skript `1` qaytarır.

Bu dəfə axtarışı bir komanda ilə başladırıq: `git bisect start main v1.0`. Birinci arqument pis, ikincisi yaxşı commit-dir. `git bisect run sh test.sh` Git-in keçdiyi hər commit-də skripti işə salır (`running 'sh' 'test.sh'`) və cavabı özü verir. Kod `0`-dırsa, commit yaxşıdır. 1–127 arasındadırsa (125-dən başqa), pisdir. Nəticə əllə tapdığımızla eynidir. Son sətir, `bisect found first 'bad' commit`, axtarışın bitdiyini bildirir. Sonda yenə `git bisect reset` lazımdır.

`test.sh` commit olunmayıb. Bisect commit-lər arasında keçəndə izlənməyən fayla toxunmur, ona görə skript hər commit-də yerində qalır.

> **Bilgi:** bəzi commit-ləri yoxlamaq olmur, məsələn layihə orada heç işə düşmür. Skript belə commit-də `125` kodu ilə çıxsa, Git onu ötürür (skip).

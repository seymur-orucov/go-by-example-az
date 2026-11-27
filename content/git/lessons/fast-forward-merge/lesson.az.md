Fast-forward merge o zaman baş verir ki, source branch ayrılandan sonra target-də yeni commit olmayıb. Onda source-un commit-ləri target-in son commit-indən davam edir və birləşdiriləcək paralel iş yoxdur. Git yeni commit yaratmır, sadəcə target-i source-un son commit-inə irəli çəkir.

Nümunə piyada yürüşü marşrutlarının bələdçisidir (`trails/`): `routes.md`-də marşrutlar, `checklist.txt`-də çantaya qoyulacaq əşyalar yazılıb.

## main yerində qalıb {#ahead}

Yeni dağ marşrutu `ridge-trail` branch-ında hazırlanıb. `git branch -v`-də `main` `Add the packing checklist` commit-ində, `ridge-trail` isə `Add a rain jacket to the checklist` commit-indədir. `git log --oneline ridge-trail` `ridge-trail`-in tarixçəsini göstərir: dörd commit. `main`-in commit-i bu siyahının üçüncü sətridir. Deməli, `ridge-trail` ayrılandan sonra `main`-də yeni commit olmayıb, `ridge-trail` isə iki commit irəlidədir.

`git log --oneline ridge-trail..main` heç nə çap etmir. Əvvəlki modulda gördük ki, `A..B` "B-də var, A-da yox" deməkdir. Boş çıxış o deməkdir ki, `main`-də `ridge-trail`-də olmayan commit yoxdur. Fast-forward üçün şərt budur. Vizualda iki ad bir xəttin üstündədir, `HEAD → main` iki commit aşağıdadır.

## Git main-i irəli çəkir {#merge}

`main`-dəyik, ona görə `git merge ridge-trail` yazırıq. `Updating`-dən sonra `..` ilə ayrılmış iki qısa hash gəlir. Birincisi `main`-in indiyə qədər göstərdiyi commit-dir, ikincisi `ridge-trail`-in son commit-i. Onları birinci addımdakı `git branch -v` çıxışı ilə müqayisə etsəniz, eyni hash-ləri görərsiniz.

`Fast-forward` sətri merge-in necə edildiyini deyir. Paralel iş yox idi, ona görə Git yeni commit yaratmadı və `main`-i `ridge-trail`-in son commit-inə köçürdü. Working directory də yeniləndi: `cat routes.md` artıq `Ridge Path` sətrini çap edir. Sonrakı statistika hər iki fayla bir sətir əlavə olunduğunu göstərir. Vizualda yerini dəyişən `HEAD → main` vurğulanıb, yeni commit isə yoxdur.

## Commit-lər olduğu kimi qalıb {#after}

`git log --oneline` indi `main`-in tarixçəsini göstərir. Bu çıxış birinci addımdakı `git log --oneline ridge-trail` çıxışı ilə sətir-sətir eynidir. Commit-lərin hash-ləri dəyişməyib, merge commit də yoxdur. Commit-lər kopyalanmayıb, `main` sadəcə onlara çatıb.

`git branch -v`-də iki branch eyni commit-i göstərir. HEAD və `main` irəlilədi, `ridge-trail` isə yerində qaldı. Tarixçə hələ də düz xəttdir: hər commit-in bir parent-i var. Ona görə log-da `ridge-trail`-in commit-lərinin ayrıca branch-da yazıldığı görünmür. Bunun nə vaxt problem olduğunu "Fast-forward və --no-ff" dərsində görəcəyik.

## Gətiriləcək commit yoxdursa {#up-to-date}

`git merge ridge-trail`-i yenidən yazanda Git `Already up to date.` cavabını verir, yəni "artıq aktualdır". `ridge-trail`-in bütün commit-ləri artıq `main`-in tarixçəsindədir. Git heç nəyi dəyişmir: vizualda nə yeni commit var, nə də yerini dəyişən ad.

Source-un target-də olmayan commit-i yoxdursa, cavab həmişə belədir. Məsələn, `main`-dən yenicə yaradılmış, hələ commit-i olmayan branch-ı merge edəndə.

## Yalnız fast-forward: --ff-only {#ff-only}

Bu addımda `campsites` branch-ı yaradılıb. O da `Add the packing checklist`-dən ayrılıb və düşərgələr üçün bir commit əlavə edib. Amma `main` artıq irəliləyib. `git log --oneline campsites..main` iki commit çap edir: onlar `main`-də var, `campsites`-də yox. Birinci addımda eyni sual boş cavab vermişdi.

İndi fast-forward mümkün deyil. `main`-i `campsites`-in commit-inə çəksək, `ridge-trail`-in iki commit-i `main`-in tarixçəsindən çıxardı. Adi `git merge` belə halda merge commit yaradır, onu növbəti dərsdə görəcəyik. `--ff-only` isə Git-ə deyir ki, yalnız fast-forward etsin, alınmasa heç nə etməsin. Son sətir, `fatal: Not possible to fast-forward, aborting.`, merge-in edilmədiyini bildirir.

Birinci `hint` sətri səbəbi deyir: ayrılmış (*diverging*) branch-ları fast-forward etmək olmur. Sonra iki yol təklif olunur: `git merge --no-ff` və `git rebase`. İkisini də sonra keçəcəyik. Sonuncu `hint` bu ipucunu söndürən parametri göstərir. Vizualda `HEAD → main` yerindədir, `campsites` isə ayrı xəttdədir.

> **Bilgi:** fast-forward mümkün olanda `--ff-only` adi `git merge` kimi işləyir. Birinci addımda `git merge --ff-only ridge-trail` eyni nəticəni verərdi.

Bəzi kod bir neçə layihədə lazım olur və onu hər layihəyə köçürsəniz, hər düzəlişi bütün surətlərdə təkrarlamalısınız. **Submodule** başqa repository-ni sizin repository-nin içində ayrıca qovluq kimi saxlayır və onu bir konkret commit-ə bağlayır. O repository öz tarixçəsini və serverini saxlayır, siz isə onun hansı commit-ini istifadə etdiyinizi seçirsiniz.

Nümunə `brand-site` şirkət saytıdır və düymə və kart stillərini dizayn komandasının `ui-kit` repository-sindən götürür (server `~/server/ui-kit.git` qovluğudur).

## Submodule əlavə etmək {#add}

`git submodule add <ünvan> <qovluq>` iki iş görür. Əvvəlcə `ui-kit`-i serverdən `ui-kit` qovluğuna clone edir: `Cloning into` sətri `git clone`-un çıxışındakı kimidir. Sonra nəticəni stage edir. `git status` iki yeni element göstərir: `.gitmodules` faylı və `ui-kit`.

`.gitmodules` adi mətn faylıdır. `[submodule "ui-kit"]` bölməsində `path` submodule-un qovluğudur, `url` isə onun serveridir. Bu fayl commit-ə düşür, ona görə layihəni clone edən hər kəs `ui-kit`-in haradan gəldiyini bilir. Vizualda hələ yeni commit yoxdur, dəyişikliklər stage-dədir.

> **Bilgi:** burada server kompüterdəki qovluqdur. Git 2.38.1-dən bəri submodule-u belə yerli qovluqdan əlavə etmək defolt olaraq bağlıdır: komanda `fatal: transport 'file' not allowed` xətası verir. Ona görə gizli addımda `git config --global protocol.file.allow always` yazdıq. GitHub ünvanı (`https://github.com/...`) ilə bu ayar lazım deyil. Qadağa təhlükəsizlik üçündür: yad repository submodule vasitəsilə kompüterinizdəki faylları öz içinə köçürə bilməsin.

## Gitlink: yalnız commit-in hash-i {#gitlink}

Commit-in çıxışında `create mode 160000 ui-kit` sətri var. Adi fayl `100644` rejimi ilə yaranır. `160000` isə ayrıca növdür, **gitlink**: başqa repository-dəki commit-ə istinad.

`git ls-tree HEAD` commit-in tree-sini göstərir. `.gitmodules` və `index.html` `blob`-dur, `ui-kit` isə `commit`. Onun yanındakı hash fayl məzmununun yox, `ui-kit` repository-sindəki bir commit-in hash-idir. `ui-kit` qovluğunda `git log --oneline` yuxarıda `Add card styles` commit-ini göstərir. Onun qısa hash-i gitlink-dəki hash-in başlanğıcıdır.

Deməli, `brand-site` `ui-kit`-in fayllarını saxlamır, yalnız onun hansı commit-də olduğunu saxlayır. `ui-kit` qovluğu isə ayrıca repository-dir: orada `git log` `ui-kit`-in tarixçəsini göstərir, `brand-site`-ınkını yox. Vizualda da `ui-kit` commit-də bir element kimi görünür, `button.css` və `card.css` yoxdur.

## Submodule irəliləyəndə {#moved}

Saytda nişan (*badge*) lazımdır, stili isə `ui-kit`-ə aiddir. `ui-kit` qovluğunda `badge.css` yaradıb commit edirsiniz və `git push` ilə göndərirsiniz. Commit `brand-site`-a yox, `ui-kit`-ə düşür. Push da `ui-kit`-in serverinə gedir: çıxışda `To /home/sam/server/ui-kit.git` görünür.

`brand-site`-da `git status` `modified:   ui-kit (new commits)` göstərir: submodule artıq gitlink-dəki commit-də deyil, ondan irəlidədir. `git diff` bunu `Subproject commit` sətirləri ilə göstərir: `-` ilə köhnə hash, `+` ilə yeni hash. `brand-site` üçün dəyişiklik bir sətirdir, `badge.css` diff-də yoxdur.

`git diff --submodule` daha oxunaqlıdır. O, iki qısa hash arasındakı commit-ləri mesajları ilə sıralayır, `>` yeni commit-i bildirir. Vizual dəyişməyib, çünki `brand-site`-da hələ yeni commit yoxdur.

## Yeni commit-i bağlamaq {#pin}

`git add ui-kit` qovluqdakı faylları yox, submodule-un indiki commit-ini stage edir. Commit-in çıxışında `1 insertion(+), 1 deletion(-)` var: gitlink-in bir sətri dəyişdi. `git ls-tree HEAD ui-kit` artıq yeni hash göstərir. Onun başlanğıcı əvvəlki addımdakı `Add badge styles` commit-inin qısa hash-idir.

Vizualda yeni commit-də `ui-kit` dəyişmiş kimi işarələnib. `.gitmodules` isə dəyişməyib, çünki orada commit yox, yalnız yol və ünvan var. `ui-kit` nə qədər irəliləsə də, `brand-site` onun yeni commit-ini yalnız siz gitlink-i dəyişib commit edəndə alır. `brand-site`-ın əvvəlki commit-ləri köhnə `ui-kit` commit-inə bağlı qalır.

> **Diqqət:** submodule-dakı commit-i əvvəl onun serverinə push edin, sonra əsas repository-də commit edin. Əks halda gitlink serverdə olmayan commit-i göstərir. Komanda yoldaşınızın Git-i `ui-kit`-i clone edir, amma o commit-i tapmır: `not our ref` xətası çıxır.

## Submodule və subtree {#subtree}

`git ls-tree -r` tree-dəki bütün faylları, alt qovluqlardakılar da daxil, sıralayır. `--name-only` yalnız adları çap edir. Siyahıda `ui-kit/button.css` yoxdur, yalnız `ui-kit` var: `-r` gitlink-in içinə girmir. `ui-kit`-in faylları və tarixçəsi öz repository-sində qalır.

Eyni məsələnin ikinci həlli **subtree**-dir. `git subtree add --prefix=ui-kit <ünvan> main` başqa repository-nin fayllarını və commit-lərini sizin tarixçənizə birləşdirir. Onda `ui-kit/button.css` `brand-site`-ın adi faylı olur. Clone edən heç bir əlavə komanda bilməli deyil. Amma `ui-kit`-də etdiyiniz düzəlişi kitabxanaya geri göndərmək çətinləşir (`git subtree push` lazımdır), repository də böyüyür.

Submodule-u kitabxana ayrıca komandada inkişaf edəndə seçin. O zaman hər layihə onun hansı commit-ini istifadə etdiyini dəqiq bilir. Bunun qiyməti əlavə komandalardır: adi `git clone`-dan sonra `ui-kit` qovluğu boş qalır (bunu növbəti dərsdə keçəcəyik). Kod nadir dəyişirsə və ya onu əsasən öz layihənizdə dəyişirsinizsə, subtree daha sadədir.

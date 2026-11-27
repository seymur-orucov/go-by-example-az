`git cherry-pick <commit>` başqa branch-dakı bir commit-in dəyişikliyini hazırkı branch-a yeni commit kimi tətbiq edir. Rebase bunu branch-ın bütün commit-ləri üçün edirdi, cherry-pick isə yalnız seçdiyiniz commit üçün edir. Ən çox bir düzəlişi buraxılmış versiyaya çatdırmaq üçün işlədilir: yeni versiyanın qalan işi ora getmir.

Nümunə idman klubunun saytıdır (`club-site/`): `release/1.0` branch-ı saytda işləyən versiyadır, `main`-də isə növbəti versiya hazırlanır.

## Lazım olan commit-i tapmaq {#find}

`git switch release/1.0` saytda işləyən versiyaya keçir. `cat contacts.txt` köhnə telefon nömrəsini göstərir, sonu `0199` ilə bitir. Bu nömrə səhvdir və `main`-də artıq düzəldilib.

`git log --oneline release/1.0..main` `main`-də olub `release/1.0`-da olmayan commit-ləri göstərir. `Add the gallery page` və `Add the shop page` yeni versiyanın səhifələridir, onlar hələ sayta getməməlidir. Lazım olan yalnız `Fix the phone number`-dir. O, ikinci sətirdədir. Birinci sətir `main`-in son commit-idir, ikinci isə ondan bir addım əvvəlki, yəni `main~1`.

Vizualda `HEAD → release/1.0` `Add the menu and contacts` commit-ində dayanıb, `main` isə üç commit irəlidədir.

## Bir commit-i köçürmək {#pick}

`git cherry-pick main~1` həmin commit-in diff-ini götürür və `release/1.0`-ın son commit-inin üstünə tətbiq edir. Commit-i hash ilə də vermək olar, amma `main~1` hash-i axtarmadan işləyir.

Çıxışın birinci sətri `[release/1.0 ...]` formasındadır. Yeni commit `release/1.0`-a düşüb, mötərizədə onun qısa hash-i və mesajı var. Mesaj orijinal commit-dən götürülüb. `Date:` sətrindəki vaxt cherry-pick-in vaxtı deyil, orijinal commit-in vaxtıdır. `1 file changed` deyir ki, yalnız bir fayl dəyişib.

`cat contacts.txt` artıq `0100` ilə bitən nömrəni göstərir. `ls`-də `gallery.html` və `shop.html` yoxdur: yeni səhifələr gəlmədi. Vizualda `Fix the phone number` iki yerdədir: `main`-in xəttində və `release/1.0`-ın xəttində.

## Kopya yeni commit-dir {#new-commit}

`git log -1 main~1` orijinalı, `git log -1 release/1.0` isə kopyanı göstərir. `Author`, `Date` və mesaj eynidir. `commit` sətrindəki hash-lər fərqlidir.

Commit snapshot-u və parent-i saxlayır, hash da bunlardan hesablanır. Orijinalın parent-i `Add the gallery page`-dir, kopyanınkı isə `Add the menu and contacts`. Snapshot da başqadır: kopyada `gallery.html` yoxdur. Ona görə kopya yeni hash alır. Rebase-dən sonra commit-lərin hash-i də eyni səbəbdən dəyişirdi.

> **Bilgi:** Git commit-də iki şəxs saxlayır: dəyişikliyi yazan (author) və commit-i yaradan (committer). Başqasının commit-ini cherry-pick etsəniz, `Author` sətrində yenə o qalır, committer isə siz olursunuz. Bunu `git log --format=fuller` göstərir.

## Bir neçə commit və -x {#range}

Bu arada `main`-də cədvəl üçün iki düzəliş də yazılıb: `Fix the Saturday time` və `Fix the Wednesday time`. Hər ikisi saytda lazımdır. `main~2..main` "`main`-də var, `main~2`-də yox" deməkdir, yəni son iki commit. `main~2`-nin özü, `Add the shop page`, aralığa düşmür.

Git commit-ləri köhnədən yeniyə doğru bir-bir köçürür. Ona görə çıxışda iki `[release/1.0 ...]` bloku var.

`-x` kopyanın mesajına orijinal commit-in hash-ini əlavə edir. `git log -1`-in son sətri, `(cherry picked from commit ...)`, bu əlavədir. Sonra bu sətirlə düzəlişin `main`-dəki commit-ini tapmaq olur. Orijinal commit başqalarının da gördüyü branch-dadırsa, `-x` yazın. Yalnız sizin lokal branch-ınızdakı commit-in hash-i başqalarına heç nə demir.

## Konflikt və --abort {#conflict}

Mağaza səhifəsini də tez sayta qoymaq istəyirlər. Bu dəfə commit-i mesajı ilə adlandırırıq. `":/Add the shop"` mesajında `Add the shop` olan ən yeni commit-dir və Git onu bütün branch-larda axtarır. Mesajda boşluq olduğu üçün dırnaq lazımdır.

Cherry-pick konfliktlə dayanır: `CONFLICT (content): Merge conflict in menu.txt`. `error: could not apply` sətri tətbiq olunmayan commit-i göstərir. `menu.txt`-dəki işarələr merge-dəki kimidir. `HEAD` tərəfi boşdur, commit-in tərəfində isə `Gallery` və `Shop` var. Mağaza commit-i `Shop` sətrini `Gallery`-nin altına yazıb, `release/1.0`-da isə `Gallery` sətri yoxdur. Yəni bu commit qalereya commit-indən asılıdır.

Konflikti merge-dəki kimi həll etmək olar: faylı düzəldib `git add menu.txt`, sonra `git cherry-pick --continue` yazırsınız. Git mesajı təsdiq etmək üçün redaktor açır. Burada isə mağaza növbəti versiyanın işidir. `git cherry-pick --abort` hər şeyi cherry-pick-dən əvvəlki vəziyyətə qaytarır. `git status` təmiz iş qovluğu göstərir, vizualda da heç nə dəyişməyib.

> **Diqqət:** cherry-pick kiçik və müstəqil düzəlişlər üçündür. Böyük funksiya adətən bir-birindən asılı çoxlu commit-dir və onları tək-tək köçürəndə konflikt çıxa bilər. Hər kopya tarixçədə eyni dəyişikliyin ikinci commit-idir. Branch-ın hamısı lazımdırsa, onu merge edin.

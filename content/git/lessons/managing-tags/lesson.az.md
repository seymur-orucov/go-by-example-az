Tag-lar çoxaldıqca onları siyahılamaq və lazım olanı tapmaq lazım olur. Səhv də olur: versiyaya tag qoymağı unudursunuz və ya tag-ı tələsik qoyursunuz. Bunları `git tag` komandasının seçimləri həll edir.

Nümunə stolüstü oyunun qaydalar kitabçasıdır (`rules.md`): yeddi commit var və çap olunan nəşrlər tag ilə işarələnib.

## Tag-ların siyahısı {#list}

`git tag` arqumentsiz bütün tag-ları göstərir. Sıra əlifbaya görədir, yaradılma vaxtına görə yox. `playtest` birinci gəlir, çünki `p` hərfi `v`-dən əvvəldir. Nəşr nömrələri iki rəqəmlidir: kitabçaya semver-in patch rəqəmi lazım deyil.

`git tag -n` hər annotated tag-ın yanında onun mesajının birinci sətrini göstərir. `playtest` lightweight tag-dır, onun öz mesajı yoxdur. Git onun yerinə commit-in mesajını göstərir: `Add the scoring rules`. Mesajın bir neçə sətri lazımdırsa, rəqəm yazın: `-n3` ilk üç sətri göstərir.

## Filtr və versiya sırası {#filter}

`-l` (`--list`) siyahını nümunəyə görə filtrləyir. `*` istənilən simvolları əvəz edir, ona görə `"v1.*"` birinci versiyanın bütün nəşrlərini tapır. `playtest` və `v2.0` siyahıda yoxdur.

Siyahıda `v1.10` `v1.7`-dən əvvəl gəlir. Git adları mətn kimi müqayisə edir: `1.10`-da nöqtədən sonra `1` gəlir, bu simvol isə `7`-dən kiçikdir. `--sort=v:refname` adları versiya kimi oxuyur və `10`-u `9`-dan sonra qoyur. Açarın qarşısındakı `-` sıranı tərsinə çevirir: ən yeni nəşr yuxarıda olur.

Versiya sırasında boşluq da görünür: `v1.7`-dən sonra `v1.9` gəlir, `v1.8` yoxdur.

> **Diqqət:** nümunəni dırnağa alın. Cari qovluqda `v1.txt` kimi uyğun fayl olsa, terminal `v1.*`-ı faylın adı ilə əvəz edir və `git tag -l` heç nə tapmır.

## Köhnə commit-ə tag qoymaq {#older}

1.8 nəşri çap olunub, amma ona tag qoyulmayıb. Bu nəşrdə yalnız zər qaydası düzəldilib. `git log --oneline --decorate` commit-lərin yanında tag-ları da göstərir. `Fix the dice rule` commit-inin tag-ı yoxdur.

Tag-ın adından sonra commit yazanda Git tag-ı HEAD-ə yox, həmin commit-ə qoyur. `HEAD~4` HEAD-dən dörd addım geridir: çıxışın beşinci sətri. `HEAD~4` əvəzinə commit-in hash-ini də yazmaq olar. Komanda heç nə çap etmir. Siyahıda `v1.8` indi öz yerindədir, vizualda isə yeni tag köhnə commit-in yanında vurğulanıb.

> **Bilgi:** annotated tag-ın tarixi tag-ın yaradıldığı andır, commit-in tarixi deyil. `git show v1.8` `Tagger` sətrinin altında bu günün tarixini göstərəcək.

## Tag-ı silmək {#delete}

Oyunun sınağı bitib, `playtest` tag-ı artıq lazım deyil. `git tag -d` (`--delete`) tag-ı silir. Çıxışda `was`-dan sonra silinən tag-ın hash-i gəlir. `playtest` lightweight tag olduğu üçün bu, commit-in qısa hash-idir. Tag-ı səhvən silsəniz, bu hash ilə onu yenidən yarada bilərsiniz.

`git tag` artıq `playtest`-i göstərmir. Commit isə yerindədir: `git log` `Add the scoring rules`-u yenə göstərir. Tag commit-ə verilmiş addır, onu silmək commit-ə toxunmur.

## Mövcud tag-ı köçürmək {#force}

`v2.0` qoyulandan sonra növbə qaydasında hərf səhvi tapıldı: `startng`. Kitabça hələ çapa getməyib. Səhvi düzəldib commit edirik və `v2.0`-ı yeni commit-ə keçirmək istəyirik.

Eyni adla ikinci tag yaratmaq olmur: `fatal: tag 'v2.0' already exists`. `-f` (`--force`) köhnə tag-ı yenisi ilə əvəz edir və `Updated tag` yazır. Mötərizədə köhnə tag-ın hash-i var. Annotated tag ayrıca obyekt olduğu üçün bu hash commit-in hash-i ilə eyni deyil. `git log --decorate` göstərir ki, `v2.0` artıq yeni commit-dədir.

> **Diqqət:** başqalarına göndərilmiş tag-ı köçürməyin (tag-ları göndərməyi növbəti dərsdə keçəcəyik). Onlarda köhnə `v2.0` qalır və eyni adlı iki fərqli versiya yaranır. Belə halda düzəlişə yeni ad verin, məsələn `v2.1`.

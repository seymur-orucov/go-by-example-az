Commit mesajı dəyişikliyin qısa izahıdır və tarixçədə həmişəlik qalır. Onu siz yazırsınız, amma oxuyan başqasıdır: komanda yoldaşınız və ya bir neçə ay sonrakı siz. Bu dərsdə mesajın hissələrini, onu yazmağın qaydalarını və komandaların çox işlətdiyi Conventional Commits formatını görəcəyik.

Nümunə kiçik hava proqnozu proqramıdır: şəhər axtarışı, temperatur və proqnoz.

## Bir ay sonra tarixçə {#why}

`git log --oneline` hər commit-i bir sətirdə göstərir: qısa hash və mesajın birinci sətri. Cədvəlin sol sütununda dörd commit `wip`, `fix`, `update` kimi mesajlarla yazılıb. Onlardan nəyin və niyə dəyişdiyini bilmək olmur. Cavab üçün hər commit-in diff-ini ayrıca açmaq lazımdır.

Sağ sütunda eyni commit-lərin hər mesajı dəyişikliyi adlandırır. Deyək ki, boş şəhər adı ilə axtarış yenə çökür. Bu səhvin hansı commit-də düzəldildiyini tarixçəni oxuyan kimi tapırsınız.

## Başlıq: bir sətirdə nə edir {#subject}

Mesajın birinci sətri **başlıqdır** (subject). Git onu hər yerdə işlədir: `--oneline`-da, başqa qısa çıxışlarda, commit-i e-poçta çevirəndə mövzu sətri kimi. Başlıq dəyişikliyin nə etdiyini qısa deyir. Pro Git və Git-in sənədləri təxminən 50 simvol tövsiyə edir. Bu sərt qayda deyil, amma uzun başlıq dar pəncərəyə sığmır və bir çox alət onu kəsib göstərir.

Başlıq qısa alınmırsa, çox vaxt commit-də bir neçə iş var. `Fix search crash, add Fahrenheit and update footer` üç ayrı dəyişiklikdir. Hər məntiqi dəyişikliyi ayrıca commit edin. Onda hər başlıq qısa olur və bir dəyişikliyi o birilərinə toxunmadan tapmaq, lazım olsa geri almaq olur.

## Əmr forması {#imperative}

Başlığı əmr formasında (imperative mood) yazın: `Add city search form`, `Fix crash when city name is empty`. `Added ...` (keçmiş zaman) və ya `Fixes ...` (üçüncü şəxs) yox. Əmr forması commit-in koda nə etdiyini deyir, sizin dünən nə etdiyinizi yox.

Git öz yaratdığı mesajları da belə yazır. `git merge` commit-ə `Merge branch 'units'`, `git revert` isə `Revert "Update footer"` mesajı verir (bu komandaları sonrakı modullarda keçəcəyik). Sizin başlıqlarınız da eyni formada olanda tarixçə bir üslubda oxunur.

## Body: nə və niyə {#body}

Başlıq kifayət etməyəndə ondan sonra bir boş sətir qoyub **body** (mesajın əsas mətni) yazırsınız. Body nəyin və niyə dəyişdiyini izah edir: əvvəl necə idi, problem nə idi, indi necədir. Kodun necə dəyişdiyini təkrar yazmağa ehtiyac yoxdur, onu diff göstərir. Body sətirlərini təxminən 72 simvolda bölün: Git mətni özü sətirlərə bölmür, uzun sətir terminalda pis oxunur.

Boş sətir vacibdir. Git birinci boş sətrə qədər olan mətni başlıq sayır. Boş sətir olmasa, `--oneline` body-ni də başlığa qatıb bir uzun sətir göstərir.

> **Bilgi:** `-m` olmadan `git commit` mətn redaktoru açır: birinci sətrə başlığı, sonra boş sətir, sonra body yazırsınız. Qısa body üçün `-m`-i iki dəfə vermək də olar: `git commit -m "Fix crash when city name is empty" -m "The search sent an empty request."`. Git hər `-m`-i ayrıca abzas edir və aralarına boş sətir qoyur.

## Conventional Commits {#conventional}

Bir çox komanda başlığı razılaşdırılmış formatda yazır. Ən geniş yayılmışı **Conventional Commits**-dir: `type(scope): description`. `type` dəyişikliyin növüdür. `scope` layihənin hansı hissəsinə aid olduğunu göstərir və istəyə bağlıdır. `description` əmr formasında qısa izahdır: `fix(search): show error when city is not found`.

Spesifikasiya iki tipi müəyyən edir: `feat` yeni imkan, `fix` səhvin düzəlişi. Geniş işlənən başqa tiplər də var: `docs` sənədlər, `refactor` davranışı dəyişməyən kod dəyişikliyi, `test` testlər, `chore` texniki xidmət işi (məsələn, asılılıqları yeniləmək). Köhnə davranışı pozan dəyişiklik (breaking change) iki yolla qeyd olunur: tipdən sonra `!` ilə (`feat!: remove search by ZIP code`) və ya mesajın sonundakı footer-də `BREAKING CHANGE: ...` sətri ilə.

Format sabit olduğu üçün tarixçəni proqramlar da oxuya bilir. Alətlər commit-lərdən avtomatik changelog yaradır, yəni yeni versiyada nəyin dəyişdiyinin siyahısını. Versiya nömrəsini də özləri seçə bilirlər (Semantic Versioning): 1.4.2-dən sonra `fix` 1.4.3, `feat` 1.5.0, breaking change isə 2.0.0 verir.

> **Bilgi:** hansı formatı seçsəniz də, bir layihədə bir üslub işlədin. Bəzi komandalar formatı commit zamanı avtomatik yoxlayan alət qoşur (məsələn, commitlint).

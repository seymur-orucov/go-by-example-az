**Tag** bir commit-ə qoyulan sabit addır. Branch da commit-i göstərən addır, amma yeni commit-lə irəli gedir, tag isə həmişə eyni commit-də qalır. Ona görə proqramın buraxılışlarını (release) tag ilə işarələyirlər: `v1.0.0` adı illər sonra da həmin kodu göstərir.

Nümunə kiçik masaüstü kalkulyatorun buraxılışlarıdır: `calc.py`-də iki funksiya, `CHANGELOG.md`-də buraxılışların siyahısı var.

## Lightweight tag {#lightweight}

`git tag v1.0.0` HEAD-in göstərdiyi commit-ə `v1.0.0` adını qoyur və heç nə çap etmir. Arqumentsiz `git tag` repository-dəki tag-ları siyahılayır. Belə tag *lightweight* (yüngül) tag adlanır: o, yalnız commit-i göstərən addır.

Lightweight tag da branch kimi fayldır, yalnız başqa qovluqdadır: `.git/refs/tags/`. `cat .git/refs/tags/v1.0.0` bir sətir çap edir, commit-in tam hash-ini. `git log --oneline --decorate` son commit-in yanında `(HEAD -> main, tag: v1.0.0)` yazır: `main` və `v1.0.0` eyni commit-dədir. Vizualda da iki ad eyni commit-in yanındadır.

## Commit-dən sonra tag yerində qalır {#stays}

`v1.0.0` çıxandan sonra səhv tapıldı: sıfıra bölmə proqramı dayandırır. `calc.py`-də onu düzəldirik, `CHANGELOG.md`-yə sətir əlavə edirik və commit edirik. Dəyişikliyin özünü növbəti addımlarda diff-də görəcəyik.

`git log --oneline --decorate` göstərir ki, `HEAD -> main` yeni commit-ə keçib. `tag: v1.0.0` isə `Add division` commit-ində qalıb. Commit zamanı Git yalnız HEAD-in göstərdiyi branch-ı irəli aparır, tag-a toxunmur. Ona görə `v1.0.0` istifadəçilərə verilmiş versiyanı həmişə göstərəcək. Vizualda `main` yeni commit-ə keçib, tag isə köhnə commit-in yanındadır.

## Annotated tag: ayrıca obyekt {#annotated}

Düzəliş də buraxılışdır, ona `v1.0.1` adını veririk. Bu dəfə `-a` ilə *annotated* (qeydli) tag yaradırıq. `-m` tag-ın mesajıdır, commit mesajı kimi. `git tag` indi iki tag göstərir. Siyahı tarixə görə yox, əlifba sırası ilə düzülür.

Annotated tag Git-in ayrıca obyektidir. Orada tag-ı kimin qoyduğu (tagger), tarix və mesaj saxlanır, obyekt özü isə commit-i göstərir. `git cat-file -t` obyektin tipini çap edir. `v1.0.0` üçün cavab `commit`-dir: lightweight tag birbaşa commit-i göstərir. `v1.0.1` üçün cavab `tag`-dır: bu ad əvvəlcə tag obyektinə, oradan da commit-ə aparır.

> **Bilgi:** `-m` olmadan `git tag -a` mesaj yazmaq üçün redaktor açır. `-m` verib `-a`-nı yazmasanız da, Git annotated tag yaradır.

## git show: tag və commit {#show}

`git show v1.0.1` əvvəlcə tag obyektini, sonra onun göstərdiyi commit-i çap edir. Birinci sətir, `tag v1.0.1`, tag-ın adıdır. `Tagger` tag-ı kimin, `Date` isə nə vaxt yaratdığını göstərir. Boş sətirdən sonra tag-ın mesajı gəlir: `Release 1.0.1: fix division by zero`.

`commit` sətrindən sonra `git show`-un commit üçün adi çıxışı gəlir. Orada müəllif, commit-in tarixi, mesaj və diff var. Diff-də düzəliş görünür: `div` indi `b` sıfır olanda `None` qaytarır. Tag-ın tarixi (`09:18`) commit-in tarixindən (`09:16`) sonradır, çünki tag commit-dən sonra ayrıca yaradılıb.

Lightweight tag-da tag hissəsi yoxdur. `git show v1.0.0` birbaşa `commit` sətri ilə başlayır.

## Semantic versioning {#semver}

Kalkulyatora faiz hesablayan `pct` funksiyasını əlavə edirik, commit edirik və `v1.1.0` tag-ını qoyuruq. Versiya nömrələri *semantic versioning* qaydası ilə seçilib (semver.org): `MAJOR.MINOR.PATCH`. Məsələn, `1.4.2`-də major 1, minor 4, patch 2-dir.

- **PATCH** köhnə davranışı pozmayan səhv düzəlişində artır: `1.0.0` → `1.0.1`.
- **MINOR** köhnə kodu pozmayan yeni imkanda artır, patch sıfırlanır: `1.0.1` → `1.1.0`.
- **MAJOR** uyğunluğu pozan dəyişiklikdə artır, minor və patch sıfırlanır. Məsələn, `div` funksiyasının adı dəyişsə, onu çağıran kod işləməz və versiya `2.0.0` olar.

`cat CHANGELOG.md` üç buraxılışı göstərir, `git log --oneline --decorate` isə hər birinin commit-ini. Adın əvvəlindəki `v` semver-in hissəsi deyil, amma tag adlarında onu çox vaxt yazırlar. Bəzi layihələr sıfır patch-i tag adında yazmır: `v1.1` `1.1.0` versiyasıdır.

> **Bilgi:** buraxılışlara annotated tag qoyun. Git sənədləri də belə tövsiyə edir, `git describe` isə susmaya görə yalnız annotated tag-ları görür. Lightweight tag şəxsi, müvəqqəti qeydlər üçündür; burada `v1.0.0` fərqi göstərmək üçün lightweight qaldı.

Tag-ları filtrləməyi, silməyi və köhnə commit-ə tag qoymağı növbəti dərsdə keçəcəyik. `git push` tag-ları özü göndərmir, bunu da ayrıca dərsdə görəcəyik.

Elmi məqalədə istifadə olunan proqram da kitab və məqalə kimi sitat gətirilir. `CITATION.cff` faylı layihənin necə sitat gətirilməli olduğunu yazır. Bu fayl repository-də olanda GitHub ondan hazır sitat qurur.

Nümunə Ayla-nın `airq` Python paketidir: o, hava keyfiyyəti sensorlarının məlumatını təmizləyir və başqa tədqiqatçılar onu məqalələrində istifadə edir.

## Məcburi açarlar {#required}

CFF (*Citation File Format*) YAML faylıdır. Hər sətir `açar: dəyər` formasındadır. İç-içə hissələr boşluqla içəri çəkilir, tab işlətmək olmaz.

Dörd açar məcburidir:

- `cff-version` formatın versiyasıdır, hazırda `1.2.0`;
- `message` oxucuya qısa xahişdir: bu proqramı işlətsəniz, belə sitat gətirin;
- `title` layihənin adıdır;
- `authors` müəlliflərin siyahısıdır.

Hər müəllif `-` ilə başlayır. `family-names` soyad, `given-names` addır. Müəllif şəxs deyil, təşkilatdırsa, `name` yazılır. `orcid` tədqiqatçının ORCID identifikatorudur və məcburi deyil. Burada nümunə dəyər yazılıb.

Bu dörd açar olanda GitHub APA və BibTeX formatında sitat qurur. Nəticə sahəsinə baxın: APA sitatında adlar soyad və inisialla yazılıb, sonda `[Computer software]` var. BibTeX qeydi `@software` ilə başlayır.

## Versiya və tarix {#release}

`version` sitat gətirilən buraxılışın versiyasıdır. `date-released` həmin buraxılışın tarixidir, `"YYYY-MM-DD"` formasında. Tarixi dırnaqda yazın: dırnaqsız tarixi bəzi YAML oxuyucuları mətn yox, tarix obyekti kimi oxuyur.

İndi APA sitatında il `(2026)` və `(Version 1.2.0)` görünür. BibTeX-ə `version`, `month` və `year` əlavə olunub. Hər yeni buraxılışda bu iki sətri yeniləyin. Yoxsa insanlar köhnə versiyaya istinad edər.

## DOI və keçidlər {#links}

**DOI** elmi işlərin daimi identifikatorudur: ünvan dəyişsə də, `https://doi.org/...` linki işə aparır. Zenodo kimi xidmətlər proqramın buraxılışına DOI verir. Buradakı DOI nümunədir.

`repository-code` kodun olduğu yerdir, `license` isə license-in qısa adıdır (`MIT`, `Apache-2.0`). APA sitatının sonunda DOI linki gəlir. DOI yoxdursa, `repository-code` yazılır. BibTeX-də DOI ayrıca `doi` sahəsidir, `url` isə `repository-code`-dan götürülür.

Fayl default branch-da, repository-nin kökündə olanda GitHub repository səhifəsinin sağ panelində **Cite this repository** linkini göstərir. Onun pəncərəsində APA və BibTeX var. Nəticə sahəsi həmin pəncərənin sadələşdirilmiş formasıdır.

> **Bilgi:** insanların proqram yox, onun haqqında məqaləni sitat gətirməsini istəyirsinizsə, faylda `preferred-citation` hissəsi yazılır. Onda GitHub məqalənin sitatını göstərir. `CITATION` və ya `CITATION.bib` kimi başqa faylları GitHub tanıyır, amma çevirmir: pəncərədə sadəcə onlara keçid olur.

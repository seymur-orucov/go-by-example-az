GitHub-da hər repository-nin öz səhifəsi var. Kod, commit tarixçəsi, branch-lar, issue-lar və pull request-lər bu səhifənin bölmələrindədir. Bölmələri tanıyan adam başqasının layihəsində də tez yol tapır.

Nümunədə Sam ev hava stansiyasının ölçmələrini fayla yazan açıq mənbəli proqramın, `windvane/logger`-in repository-sinə baxır.

## Başlıq və tab-lar {#header}

Səhifənin yuxarısında repository-nin tam adı yazılır: `windvane / logger`. Əvvəl sahib gəlir, sonra repository-nin adı. Ünvan da belədir: `github.com/windvane/logger`. Adın yanındakı **Public** repository-ni hamının görə bildiyini deyir.

Sağda üç düymə var. **Watch** bildirişləri tənzimləyir, onu beşinci addımda görəcəyik. **Fork** repository-nin surətini sizin hesabınızda yaradır, "Fork və clone" dərsindəki kimi. **Star** repository-ni ulduzlu siyahınıza əlavə edir. Sonra onu profil menyusundakı **Your stars** səhifəsində tapmaq olur. Düymələrin yanındakı rəqəmlər neçə adamın bunu etdiyini göstərir.

Adın altında tab-lar, yəni səhifənin bölmələri durur. **Code** faylları göstərir. **Issues** issue-ların, yəni xəta və təkliflər üçün açılan müzakirələrin siyahısıdır. Onları ayrıca dərsdə keçəcəyik. **Pull requests** PR-ların siyahısıdır. **Actions** avtomatik işlərin, məsələn testlərin nəticələrini göstərir. Issues və Pull requests yanındakı rəqəm açıq olanların sayıdır.

Sam **Settings** tab-ını görmür. Settings yalnız repository-ni idarə etmək icazəsi olanlara görünür.

> **Bilgi:** tab-lara klaviatura ilə də keçmək olar. `g`, sonra `c` Code-u açır. `g` və `i` Issues-a, `g` və `p` Pull requests-ə keçir.

## Code tab-ı {#code-tab}

Code tab-ı repository-nin əsas səhifəsidir. Ortada fayl və qovluqların siyahısı var. Hər sətrin sağında həmin fayla toxunan son commit-in mesajı və vaxtı yazılır.

Siyahının üstündə branch seçimi durur, burada `main` görünür. Başqa branch seçəndə siyahı həmin branch-ın fayllarını göstərir. Açılan menyudakı **View all branches** bütün branch-ların siyahısını açır.

Siyahının yuxarı sətrində branch-ın son commit-i və commit-lərin sayı görünür. Saya basanda seçilmiş branch-ın commit tarixçəsi açılır. Bu, `git log`-un brauzer variantıdır.

Siyahının altında `README.md` göstərilir. Layihəyə gələn adam adətən ilk onu oxuyur. Maket sadələşdirilib: real səhifədə daha çox düymə və link var.

## About və Code düyməsi {#about-and-clone}

Sağ sütunda **About** bölməsi var. Burada layihənin bir cümləlik təsviri, saytı və mövzuları (*topics*) yazılır. Sam layihənin nə etdiyini README-ni açmadan da görür.

Fayl siyahısının üstündəki yaşıl **Code** düyməsi clone ünvanını verir. Menyuda üç variant var: **HTTPS**, **SSH** və **GitHub CLI**. Sam HTTPS ünvanını kopyalayır və terminalda yazır: `git clone https://github.com/windvane/logger.git`. Bu, "Repository-ni clone etmək" dərsindəki `git clone`-dur.

SSH ünvanı (`git@github.com:windvane/logger.git`) ilə işləmək üçün GitHub hesabına SSH açarı əlavə olunmalıdır.

## Issues və Pull requests {#issues-and-prs}

Issues və Pull requests tab-ları eyni quruluşdadır: başlıqların siyahısı. Siyahının üstündə iki say var: açıq olanlar (**Open**) və bağlananlar (**Closed**). Tab açılanda yalnız açıqlar görünür.

Hər sətirdə başlıq, nömrə və müəllif yazılır. Nömrə repository daxilində ortaqdır: issue `#41`-dirsə, növbəti PR `#42` ola bilər. Sətrin əvvəlindəki ikon vəziyyəti göstərir: açıq, bağlanmış və ya PR üçün merge olunmuş.

Sam Pull requests-də `Add wind speed sensor` PR-ını açır. PR-ın səhifəsində təsvir, commit-lər, dəyişikliklər və review var, "Pull request axını" dərsindəki kimi.

## Bildirişlər {#notifications}

Bildirişlər səhifənin yuxarı sağ küncündəki inbox ikonundadır. Birbaşa ünvanı `github.com/notifications`-dır. Müzakirədə iştirak edəndə bildiriş gəlir. Məsələn, şərh yazanda və ya issue açanda. Kimsə adınızı `@sam-lee` kimi çəkəndə də gəlir.

Repository-dən nə gələcəyini **Watch** menyusu təyin edir:

- **Participating and @mentions**: yalnız iştirak etdiyiniz müzakirələr və sizi çəkənlər.
- **All Activity**: repository-dəki bütün müzakirələr.
- **Custom**: iştirakdan əlavə seçdiyiniz növlər, məsələn yalnız Issues və ya Releases.
- **Ignore**: bu repository-dən heç bir bildiriş.

Sam layihəni izləmək istəyir, amma hər müzakirəni yox. O, **Custom** seçib yalnız **Releases**-i işarələyir: yeni versiya çıxanda xəbər tutacaq. Öz yaratdığınız repository-ləri GitHub avtomatik izləyir.

> **Diqqət:** böyük layihədə **All Activity** hər gün çoxlu bildiriş gətirir. Vacib bildirişlər onların arasında itir.

## Axtarış {#search}

Axtarış sətri hər səhifənin yuxarısındadır. `/` və ya `s` düyməsi kursoru oraya qoyur. Yazdıqca GitHub fayl və repository təklif edir.

Sorğuya `repo:windvane/logger` əlavə etsəniz, axtarış yalnız bu repository-də aparılır. Repository səhifəsində sətir adətən bu filtrlə artıq doldurulmuş olur. Bütün GitHub-da axtarmaq üçün `repo:` hissəsini silin.

Sam `humidity` yazıb Enter basır. Nəticələr səhifəsində kod, issue, pull request və commit nəticələri arasında keçmək olur. O, sensoru oxuyan faylı kodda, onun haqqında müzakirəni Issues-da tapır.

> **Bilgi:** kodda axtarmaq üçün hesaba daxil olmaq lazımdır, public repository-lərdə də.

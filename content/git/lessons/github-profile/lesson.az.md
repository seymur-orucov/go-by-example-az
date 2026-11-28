Profil `github.com/<istifadəçi adı>` ünvanındakı səhifədir, komanda yoldaşları və işə götürənlər ona baxır. Orada ad, şəkil və bio, seçdiyiniz repository-lər və son bir ilin töhfələri görünür. Ayarlarda commit-lərə yazılan email-i də gizli saxlamaq olar.

Nümunə yenə Sam-dır: o, əvvəlki dərsdə açdığı `sam-lee` hesabının profilini qurur.

## Ad, bio, şəkil və linklər {#public-profile}

Profil məlumatları **Settings** → **Public profile** səhifəsindədir. **Settings** sağ yuxarıdakı profil şəklinin menyusundadır.

- **Name**: göstərilən ad. Sam `Sam Lee` yazır. Bu ad istifadəçi adından ayrıdır və ünvana düşmür.
- **Bio**: özünüz haqqında qısa mətn, ən çox 160 simvol.
- **Social accounts**: ən çox dörd link, məsələn şəxsi sayt və ya LinkedIn. Linkin tam ünvanı yazılır.
- **Location**: şəhər və ya ölkə. Doldurmaq məcburi deyil.

Dəyişikliklər **Update profile** düyməsi ilə saxlanır. Şəkil üçün **Profile Picture** altında **Edit** → **Upload a photo...** seçilir. Şəkil PNG, JPG və ya GIF olmalı, 1 MB-dan kiçik olmalıdır. Şəkil olmasa, GitHub avtomatik naxış göstərir.

Profilə öz README-nizi də əlavə etmək olar. Bunu sonrakı modulda görəcəyik.

## Pinned repository-lər {#pinned}

Yeni profildə repository-lər **Popular repositories** bölməsində görünür. Ən yaxşı işlərinizi isə özünüz seçib yuxarıya bərkidə bilərsiniz. Bərkidilmiş elementlərə **pinned** deyilir.

Profil səhifəsində **Customize your pins** linkini basın. Açılan pəncərədə repository-ləri və gist-ləri işarələyin. Gist GitHub-da saxlanan kiçik kod parçasıdır. Repository və gist birlikdə ən çox altı element seçmək olar. Sonra **Save pins** düyməsini basın. Pin-lərin sırasını sürüşdürərək dəyişmək olar.

Sam üç repository seçir: `portfolio`, `trip-planner` və `recipe-book`. Köhnə məşq repository-ləri profildə önə çıxmır.

## Contribution graph {#contribution-graph}

Profildə son bir ilin töhfələri kvadratlarla göstərilir. Hər kvadrat bir gündür, rəng tündləşdikcə o gün töhfə çox olub. Başlıqda il ərzindəki ümumi say yazılır. Kvadrata basanda həmin günün töhfələri aşağıda açılır.

Töhfə təkcə commit deyil. Repository yaratmaq, fork etmək, issue və ya PR açmaq, PR-a review yazmaq da sayılır. Öz repository-nizdəki commit-in sayılması üçün üç şərt var:

- commit-in email-i GitHub hesabınıza bağlıdır;
- commit repository-nin default branch-ındadır (çox vaxt `main`);
- repository fork deyil, müstəqil repository-dir.

Sam feature branch-ında commit edib, amma onu hələ `main`-ə birləşdirməyib. Bu commit-lər qrafikdə hələ görünmür. Branch `main`-ə birləşəndə sayılacaq.

> **Bilgi:** private repository-lərdəki iş standart olaraq qrafikdə görünmür. Onu göstərmək üçün ayar var. Onda kvadratlar sayılır, amma repository-lərin adı və təfərrüatı gizli qalır.

## Email-i gizli saxlamaq {#private-email}

Git hər commit-ə müəllifin email-ini yazır. Public repository-yə push edilən commit-i hər kəs açıb oxuya bilər, deməli email də görünür. GitHub bunun üçün hər hesaba **noreply** ünvanı verir. Bu ünvan hesaba bağlıdır, amma ona məktub getmir.

Ayar **Settings** → **Emails** səhifəsindədir. **Keep my email addresses private** qutusunu işarələyin. Bundan sonra GitHub saytda etdiyiniz əməliyyatlarda, məsələn brauzerdə faylı redaktə edəndə və ya PR-ı birləşdirəndə, commit-ə noreply ünvanı yazır.

Ünvan bu formadadır: `ID+username@users.noreply.github.com`. `ID` hesabınızın nömrəsidir. Sam-ın ünvanı `12345678+sam-lee@users.noreply.github.com` kimi olur. Burada nömrə nümunədir: öz ünvanınızı həmin səhifədən köçürün.

İkinci qutu **Block command line pushes that expose my email**-dir. Push zamanı GitHub ən son commit-in müəllif email-inə baxır. O, sizin gizli email-inizdirsə, push rədd edilir.

## Commit email-ini Git-də təyin etmək {#commit-email}

Saytdakı ayar yalnız GitHub-ın özü yaratdığı commit-lərə aiddir. Kompüterdə edilən commit-lərə email-i Git yazır. Ona görə noreply ünvanını Git-də də təyin etmək lazımdır.

Sam `git config --global user.email "12345678+sam-lee@users.noreply.github.com"` işlədir. Yoxlamaq üçün `git config --global user.email` ünvanı çap edir: `12345678+sam-lee@users.noreply.github.com`. Bu ünvan bütün repository-lərdəki yeni commit-lərə yazılır. Bir repository-də başqa email lazımdırsa, "git config" dərsindəki kimi `--global` olmadan lokal ayar yazılır.

Əvvəlki commit-lər isə köhnə email ilə qalır. Sam-ın köhnə commit-ləri `sam@example.com` ilə yazılıb. Bu email də hesabına bağlıdır, ona görə həmin commit-lər qrafikdə sayılmağa davam edir.

> **Diqqət:** noreply ünvanını əl ilə yazmayın, **Emails** səhifəsindən olduğu kimi köçürün. Bir hərf səhv olsa, email hesabınıza bağlı olmur. Belə commit-lər contribution graph-da görünmür və profilinizə aid edilmir.

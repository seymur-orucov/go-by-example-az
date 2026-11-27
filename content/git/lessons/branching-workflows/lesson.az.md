Komanda branch-larla necə işləyəcəyini razılaşdırmalıdır: hansı branch-lar daimi qalır, iş branch-ı nə qədər yaşayır və istifadəçiyə hansı branch-dan çıxır. Bu razılaşmaya branching workflow deyilir, ən çox işlənənləri GitHub flow, trunk-based development və git flow-dur.

Nümunədə iki komanda var: beş nəfərlik startap həkim qəbuluna yazılış üçün veb tətbiqini gündə bir neçə dəfə deploy edir. Başqa komanda dil öyrənmə mobil tətbiqini `2.4`, `2.5` kimi versiyalarla buraxır.

## GitHub flow {#github-flow}

GitHub flow-da bir daimi branch var: `main`. Əsas qayda budur: `main`-dəki hər şey deploy oluna bilər. Deploy yeni versiyanı serverə qoymaqdır, ondan sonra istifadəçilər dəyişikliyi görür. Ona görə `main`-də yarımçıq və ya yoxlanmamış kod olmamalıdır.

Startapda Ayla onlayn ödəniş üzərində işləyir. O, `main`-dən `feat/online-payment` branch-ı yaradır və commit-lərini müntəzəm push edir. İş hazır olanda pull request açır. Pull request branch-ı `main`-ə qəbul etmək təklifidir, komanda yoldaşları onu review edir. Review keçəndən sonra branch `main`-ə merge olunur və `main` deploy olunur. Branch isə silinir.

Bu modeli Scott Chacon 2011-də GitHub-un öz iş qaydası kimi yazıb. GitHub o vaxt gündə bir neçə dəfə deploy edirdi. GitHub Docs bu gün axını altı addımla verir. Branch yaradılır, dəyişiklik edilir və pull request açılır. Review qeydləri düzəldilir, sonra branch merge olunur və silinir.

## Trunk-based development {#trunk-based}

Bu modeldə də bir əsas branch var, ona *trunk* (ağacın gövdəsi) deyilir. Git-də bu adətən `main`-dir. Qayda belədir: hər developer öz işini ən azı gündə bir dəfə trunk-a birləşdirir. Çox kiçik komandalar birbaşa `main`-ə commit edir. Böyük komandalar qısa branch və pull request işlədir, amma branch bir-iki gündən çox yaşamır. Review-u gözləmək də bu vaxta daxildir.

Bir gündə bitməyən iş belə gedir. Ayla-nın ödəniş funksiyası bir həftə çəkir. O, hər gün kiçik bir hissəni `main`-ə merge edir. Yarımçıq ödəniş ekranı isə **feature flag** arxasındadır. Feature flag kodda şərtdir: flag bağlı olduqca istifadəçi yeni ekranı görmür. Kod hər gün deploy olunur, funksiya hazır olanda isə flag açılır.

GitHub flow buna çox yaxındır. Fərq ondadır ki, trunk-based development inteqrasiyanın tezliyini qaydaya çevirir. GitHub flow-da pull request bir həftə review gözləyirsə, onun branch-ı artıq qısa deyil.

> **Bilgi:** versiya buraxan komanda trunk-based development-də də buraxılış üçün `main`-dən ayrıca branch ayıra bilər. O branch-da yeni iş getmir və buraxılışdan bir müddət sonra silinir.

## Git flow {#git-flow}

Git flow-u Vincent Driessen 2010-da təsvir edib. Burada iki daimi branch var. `main` istifadəçilərdəki versiyadır və hər buraxılış orada tag alır. Driessen-in məqaləsində bu branch `master` adlanır. `develop` isə növbəti versiyanın yığıldığı branch-dır. Üç növ köməkçi branch müvəqqətidir:

- `feature/...` `develop`-dan ayrılır və `develop`-a qayıdır.
- `release/...` `develop`-dan ayrılır, buraxılışa hazırlanır, sonra həm `main`-ə, həm `develop`-a merge olunur.
- `hotfix/...` `main`-dən ayrılır, təcili səhvi düzəldir, sonra həm `main`-ə, həm `develop`-a merge olunur.

Merge-lər `--no-ff` ilə edilir. Ona görə hər feature tarixçədə ayrıca merge commit kimi görünür.

Mobil komanda `2.4`-ü buraxmağa hazırlaşır və `develop`-dan `release/2.4` ayırır. Tətbiq mağazaya göndərilir, mağaza onu yoxlayır. Bu müddətdə `release/2.4`-ə yalnız səhv düzəlişləri düşür. `develop`-da isə `2.5`-in funksiyaları yığılmağa davam edir. Buraxılışda `release/2.4` `main`-ə merge olunur və `v2.4` tag-ı qoyulur. Telefonlarda təcili səhv tapılanda `main`-dən `hotfix/2.4.1` ayrılır.

> **Bilgi:** məqalədə adlar defislə yazılıb: `release-1.2`, `hotfix-1.2.1`. Driessen-in git flow-u avtomatlaşdıran `git-flow` aləti isə default olaraq `feature/`, `release/` və `hotfix/` prefikslərini işlədir.

## Uzunömürlü branch-ın qiyməti {#long-branches}

Branch nə qədər çox yaşayırsa, `main` də o qədər çox dəyişir. İki günlük branch-ı merge edəndə adətən konflikt olmur və ya bir-iki kiçik konflikt çıxır. Üç həftəlik branch-da vəziyyət başqadır. Bu müddətdə başqaları eyni faylları dəfələrlə dəyişib. Konfliktlər yığılır və onları həll etmək üçün başqalarının dəyişikliklərini də başa düşmək lazımdır.

Konfliktsiz merge də həmişə işləyən kod demək deyil. Deyək ki, Murad iki həftə əvvəl bir funksiyanın adını dəyişib. Ayla-nın branch-ı isə hələ köhnə adı çağırır. Dəyişikliklər fərqli fayllarda olduğu üçün Git konflikt görmür, amma merge-dən sonra tətbiq işləmir.

Git flow-da bu xərc daimi branch-lardan da gəlir. `release/2.4`-də edilən düzəliş `develop`-a da merge olunmalıdır. Unudulsa, səhv `2.5`-də geri qayıdır. Trunk-based development-də isə hissələr kiçikdir və hər gün birləşir, ona görə hər merge də kiçik qalır.

## Hansını seçmək {#choosing}

Seçim buraxılış qaydasından asılıdır. Cədvəldə GitHub flow və git flow yan-yana verilib. Yaşıl xana həmin aspektdə üstün olan tərəfi göstərir.

Veb tətbiqin istifadəçilərdə bir versiyası var: server yenilənəndə hamı yeni versiyanı görür. Startap üçün GitHub flow kifayətdir. Pull request-lər gün ərzində review olunursa, bu artıq trunk-based development-ə yaxındır.

Mobil tətbiqdə vəziyyət fərqlidir. Hər versiya mağazanın yoxlamasından keçir. İstifadəçilərin bir hissəsi tətbiqi yeniləmir və köhnə versiyada qalır. `2.5` hazırlanarkən `2.4` üçün də düzəliş lazım olur. Git flow-un `release` və `hotfix` branch-ları bu iş üçündür.

Driessen 2020-də məqaləsinə qeyd əlavə edib. Onun sözlərinə görə, bu gün çox komanda davamlı deploy olunan veb tətbiq yazır. Belə komandalar üçün GitHub flow kimi sadə workflow daha uyğundur. Versiyalarla buraxılan və bir neçə versiyası eyni vaxtda dəstəklənən proqram üçün isə git flow hələ də yaxşı seçim ola bilər. Qeyddə belə bir məsləhət də var: *Consider your own context*, yəni öz vəziyyətinizi nəzərə alın.

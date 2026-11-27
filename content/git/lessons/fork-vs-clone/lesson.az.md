Clone da, fork da repository-nin surətidir, amma surət ayrı yerlərdə yaranır. Clone Git-in əməliyyatıdır və repository-ni kompüterinizə köçürür, fork isə GitHub-ın imkanıdır və surəti sizin GitHub hesabınızda yaradır. Yazma icazəniz olmayan layihəyə töhfə vermək üçün ikisi birlikdə lazımdır.

Nümunədə Sam açıq mənbəli qeyd proqramına, `notely/notely`-yə, Azərbaycan dili tərcüməsi əlavə etmək istəyir, amma oraya yazma icazəsi yoxdur.

## Clone: kompüterdə surət {#clone}

Sam əvvəlcə tanış yolla gedir: `git clone https://github.com/notely/notely.git`. Kompüterində tam repository yaranır, `origin` isə `notely/notely`-ni göstərir. O, `translation-az` branch-ı yaradır və `az.json` faylını commit edir. Bunlar lokal əməliyyatlardır, heç bir icazə istəmir.

`git push` isə alınmır. GitHub push-u rədd edir, çünki `notely/notely`-yə yalnız layihənin komandası yaza bilər. Açıq repository-ni hər kəs clone edə bilər. Ona push etmək üçün isə yazma icazəsi lazımdır.

## Fork: GitHub-da surət {#fork}

Fork repository-nin GitHub-da, sizin hesabınızda yaranan surətidir. Sam `notely/notely` səhifəsində **Fork** düyməsini, sonra **Create fork**-u basır. GitHub `sam/notely` repository-sini yaradır, fayllar və commit-lər oraya köçürülür. Bu repository Sam-ındır və o, ora push edə bilər.

Fork Git komandası deyil: `git fork` yazsanız, Git `'fork' is not a git command` cavabını verir. Fork-u GitHub kimi hostinq xidmətləri edir. GitHub fork-un hansı repository-dən yarandığını yadda saxlayır. Bu əlaqə sayəsində fork-dan orijinala pull request, yəni dəyişikliyi qəbul etmək təklifi açmaq olur. Pull request-ləri növbəti dərsdə keçəcəyik.

Fork faylları kompüterə gətirmir. Faylları redaktə etmək üçün fork-u clone etmək lazımdır. Ona görə cədvəldəki iki surət bir-birini əvəz etmir, birlikdə işləyir.

## Fork-u clone etmək: origin və upstream {#remotes}

Adətən fork-u clone edirlər: `git clone https://github.com/sam/notely.git`. Sam-ın kompüterində isə orijinalın clone-u artıq var. Onu silmək lazım deyil, `origin`-i fork-a yönəltmək kifayətdir: `git remote set-url origin https://github.com/sam/notely.git`. Hər iki halda `origin` fork-u göstərir və `git push origin` işləyir.

Orijinal repository də lazımdır, çünki layihənin yenilikləri oraya gəlir. Sam onu ikinci remote kimi əlavə edir: `git remote add upstream https://github.com/notely/notely.git`. Remote-un adı istənilən ola bilər, amma orijinal üçün `upstream` adı qəbul olunub. GitHub sənədləri də bu addan istifadə edir. `git remote -v` indi dörd sətir göstərir: `origin` üçün iki, `upstream` üçün iki.

Vizualda üç repository var. Sam yenilikləri `upstream`-dən götürür, öz commit-lərini isə `origin`-ə göndərir.

> **Diqqət:** push dərsində *upstream* lokal branch-ın bağlı olduğu remote-tracking branch idi. Burada `upstream` sadəcə remote-un adıdır, ikisini qarışdırmayın.

## Fork-u yeni saxlamaq {#sync}

Sam tərcümə üzərində işləyərkən `notely/notely`-yə yeni commit-lər gəlir. Fork özü yenilənmir. Lokal `main`-i yeniləmək üçün dörd komanda lazımdır:

- `git fetch upstream` orijinalın yeni commit-lərini gətirir və `upstream/main`-i yeniləyir.
- `git switch main` lokal `main`-ə keçir.
- `git merge upstream/main` həmin commit-ləri lokal `main`-ə əlavə edir. Merge əvəzinə `git rebase upstream/main` da olar.
- `git push origin main` yenilənmiş `main`-i fork-a göndərir.

İlk üç komanda yalnız lokal repository-ni dəyişir. Son komanda olmasa, GitHub-dakı fork köhnə qalır.

GitHub-da bu iş üçün düymə də var. Fork səhifəsində **Sync fork** menyusunu açıb **Update branch** basırsınız. Onda fork GitHub-da yenilənir, lokal `main`-ə isə `git pull` ilə gətirirsiniz.

Tərcümə hazır olanda Sam `translation-az` branch-ını `origin`-ə push edir. Sonra GitHub-da `notely/notely`-yə pull request açır.

## Fork nə vaxt lazım deyil {#when}

Fork repository-yə yazma icazəniz olmayanda lazımdır. Açıq mənbəli layihələrdə bu adi haldır. Kənar iştirakçı commit-lərini öz fork-una push edir. Layihənin komandası isə pull request-i qəbul edib-etməməyə qərar verir.

Ayla `notely` komandasının üzvüdür və repository-yə yaza bilir. Ona fork lazım deyil. O, `notely/notely`-ni birbaşa clone edir, iş üçün branch açır və branch-ı `origin`-ə push edir. Pull request eyni repository-nin içində açılır: Ayla-nın branch-ından `main`-ə. Kiçik komandalar və şirkətlərin qapalı layihələri adətən belə işləyir.

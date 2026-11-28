Lokal repository-ni GitHub-a qoymaq üçün əvvəlcə GitHub-da repository yaradılır. Sonra lokal repository-yə onun ünvanı remote kimi əlavə olunur və commit-lər push edilir. Yaratma formasındakı bir seçim bu işi poza bilər: GitHub-ın özünün yaratdığı fayllar.

Nümunə Sam-ın vərdiş izləyicisidir: `habit-tracker/` qovluğunda `tracker.py` və `README.md` commit edilib, Sam onu GitHub-a qoymaq istəyir.

## Yeni repository forması {#new-repo}

Forma sağ yuxarı küncdəki **+** menyusundan açılır: **New repository**. **Owner** repository-nin sahibini seçir: sizin hesabınız və ya üzv olduğunuz təşkilat. **Repository name** ünvanın son hissəsi olur: `github.com/sam-lee/habit-tracker`. Adda yalnız ASCII hərflər, rəqəmlər və `.`, `-`, `_` ola bilər, uzunluq 100 simvola qədərdir. Başqa simvolları, məsələn boşluğu, GitHub `-` ilə əvəz edir.

**Description** istəyə bağlıdır, bir cümləlik izahdır. Görünmə seçimini (**Public** və ya **Private**) "Private və public repository" dərsində keçdik. Sam hələlik **Private** seçir.

Formanın aşağısında üç fayl seçimi var: README, `.gitignore` və license. Sonda **Create repository** düyməsi repository-ni yaradır. GitHub formanın görünüşünü vaxtaşırı dəyişir, maket onun sadə variantıdır.

## README, .gitignore və license {#templates}

Bu üç seçim yeni repository-yə hazır fayl qoyur:

- **README** layihənin nə etdiyini və necə işə salındığını izah edir.
- **`.gitignore`** Git-in izləməyəcəyi faylların siyahısıdır, onu ".gitignore" dərsində keçdik. Formada dil seçilir, məsələn Python, və GitHub həmin dil üçün hazır siyahı qoyur. Bu siyahılar `github/gitignore` public repository-sində saxlanır.
- **License** başqalarının kodla nə edə biləcəyini deyir. License faylı repository-nin kökünə yazılır.

License olmasa, müəllif hüququ qanunları işləyir. Bütün hüquqlar sizdə qalır: başqaları kodu köçürə, yaya və onun üzərində öz işini qura bilməz. Public repository-yə baxmaq və onu fork etmək isə GitHub-ın qaydalarına görə yenə mümkündür. License seçməyə `choosealicense.com` saytı kömək edir.

## Lokal repository varsa, seçimləri boş saxlayın {#keep-empty}

Üç seçimdən biri işarələnsə, GitHub repository-ni ilk commit ilə yaradır. Sam-ın lokal repository-sində isə öz commit-i var. Bu iki tarixçənin ortaq commit-i yoxdur.

Sam belə repository-yə `git push -u origin main` etsə, push rədd olunur: `! [rejected] main -> main (fetch first)`. Bu, "push və upstream" dərsindəki vəziyyətdir: serverdə Sam-da olmayan commit var. `git pull --no-rebase origin main` də alınmır: `fatal: refusing to merge unrelated histories`. Git ortaq keçmişi olmayan tarixçələri adi qaydada birləşdirmir.

GitHub Docs da eyni şeyi tövsiyə edir. Lokal kodu əlavə edəcəksinizsə, repository-ni README, license və `.gitignore` olmadan yaradın. Bu faylları push-dan sonra da əlavə etmək olar. Sam üç seçimi boş saxlayır.

## Quick setup: remote və push {#push}

Boş repository yarananda GitHub **Quick setup** səhifəsini göstərir. Yuxarıda repository-nin URL-i və onu köçürən düymə var. URL HTTPS və ya SSH ola bilər, fərqini "Remote nədir" dərsində keçdik. Aşağıda mövcud lokal repository üçün komandalar verilir:

- `git remote add origin https://github.com/sam-lee/habit-tracker.git` remote əlavə edir ("Remote-ları idarə etmək" dərsi). `git remote -v` ilə ünvanı yoxlamaq olar.
- `git branch -M main` cari branch-ın adını `main` edir. Köhnə Git versiyaları ilk branch-ı `master` adlandırırdı. Branch artıq `main`-dirsə, komanda heç nə dəyişmir və heç nə çap etmir.
- `git push -u origin main` commit-ləri göndərir və upstream təyin edir ("push və upstream" dərsi).

Sam komandaları `habit-tracker/` qovluğunda işlədir. Push iki sətir çap edir: `* [new branch] main -> main` və `branch 'main' set up to track 'origin/main'.` Serverdə `main` əvvəl yox idi, ona görə yeni branch kimi yaranır. Səhifə yenilənəndə Quick setup əvəzinə fayllar görünür: `README.md` və `tracker.py`.

> **Bilgi:** GitHub-a push edəndə Git sizi tanıtmalıdır: HTTPS-də token və ya credential manager, SSH-də açar lazımdır. Bunu "Remote nədir" dərsində keçdik.

## Başqa yol: əvvəl GitHub, sonra clone {#clone-first}

Layihə hələ başlamayıbsa, ardıcıllığı dəyişmək rahatdır. Repository GitHub-da **Add README** ilə yaradılır, lazım olsa `.gitignore` və license ilə. Sonra repository səhifəsində **Code** düyməsindən URL köçürülür və `git clone` onu kompüterə gətirir ("Repository-ni clone etmək" dərsi).

Bu yolda `git remote add` və `-u` lazım deyil. Clone `origin`-i və `main`-in upstream-ini özü qurur: `git branch -vv` `[origin/main]` göstərir. Push rədd olunmur, çünki lokal tarixçə GitHub-dakı ilk commit-dən başlayır.

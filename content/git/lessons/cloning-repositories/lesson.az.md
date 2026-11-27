Başqasının layihəsi üzərində işləmək üçün onun repository-sini öz kompüterinizə köçürürsünüz. `git clone <ünvan>` bunu bir komanda ilə edir: bütün commit-lər, branch-lar və serverin ünvanı gəlir. Sonra tarixçəyə baxmaq, commit etmək və branch yaratmaq üçün serverə ehtiyac qalmır.

Nümunə Ayla-nın açıq mənbəli (*open-source*) ikon paketidir, server isə "Remote nədir" dərsindəki kimi bu kompüterdəki `~/server/icons.git` qovluğudur.

## git clone {#clone}

`git clone` serverin ünvanını alır və repository-ni yeni qovluğa köçürür. Qovluğun adını Git ünvanın son hissəsindən götürür: `icons.git`-dən `.git` atılır, `icons` qalır. Çıxışdakı `Cloning into 'icons'...` sətri bunu deyir, `done.` isə köçürmənin bitdiyini bildirir.

Serverdəki repository-nin adı çox vaxt `.git` ilə bitir. Onun working directory-si yoxdur, yalnız commit-lər saxlanır: serverdə faylları heç kim redaktə etmir. Belə repository *bare* repository adlanır.

Növbəti komanda `cd icons`-dur, çünki repository yeni qovluqdadır. `ls` serverdəki faylları göstərir: ikonlar `svg` qovluğundadır, yanında `README.md` və `LICENSE` var. Git onları `main` branch-ının son commit-indən çıxarıb.

GitHub-da eyni komanda belə olardı: `git clone https://github.com/ayla/icons.git` (HTTPS) və ya `git clone git@github.com:ayla/icons.git` (SSH). Nəticə eynidir. Fərq yalnız girişin necə yoxlanmasındadır.

> **Bilgi:** ayrıca `done.` sətrini Git kompüterdəki qovluqdan kopyalayanda yazır. İnternetdən clone edəndə onun yerinə yükləmənin gedişi görünür, məsələn `Receiving objects: 100%`.

## Tarixçə və origin {#history}

`git log --oneline` dörd commit göstərir. Bu, Ayla-nın bütün tarixçəsidir, təkcə son vəziyyət deyil. Commit-lər artıq lokal repository-dədir, ona görə `git log` və `git diff` serverə müraciət etmədən işləyir.

`git remote -v` repository-nin tanıdığı remote-ları göstərir. Clone serveri `origin` adı ilə özü əlavə edib. Hər sətirdə əvvəlcə ad, sonra ünvan gəlir. `(fetch)` və `(push)` sətirlərini "Remote nədir" dərsindən tanıyırsınız: biri götürmək, o biri göndərmək üçün ünvandır.

## Branch-lar: git branch -a {#branches}

`git branch -a` (*all*) lokal branch-larla yanaşı serverdən gələnləri də göstərir. Lokal branch birdir: `main`. Clone serverin default branch-ını lokal yaradır və ona keçir.

`remotes/origin/` ilə başlayan sətirlər serverdəki branch-ları göstərir. `origin/main` serverdəki `main`-in yeridir: Git onu clone anında yadda saxlayıb. Belə branch *remote-tracking branch* adlanır. Siz lokal `main`-də işləyirsiniz, `origin/main`-i isə yalnız Git yeniləyir. Bunu "fetch və pull" dərsində ətraflı keçəcəyik. `remotes/origin/HEAD -> origin/main` sətri serverin default branch-ının `main` olduğunu bildirir.

Serverdə `outline` branch-ı da var. Onun commit-ləri clone ilə gəlib, amma lokal `outline` yoxdur, yalnız `origin/outline` var. Vizualda remote-tracking branch-lar qırıq xətli çərçivədədir. `Add outline home icon` commit-inin yanında yalnız `origin/outline` var.

> **Bilgi:** `git switch outline` yazsanız, Git `origin/outline`-dan eyni adlı lokal branch yaradıb ona keçir. Ayrıca `git branch outline` lazım deyil.

## Başqa qovluq adı {#folder-name}

`cd ..` ilə `projects` qovluğuna qayıdırıq. Ünvandan sonra qovluq adı yazsanız, Git adı ünvandan götürmür. `git clone ~/server/icons.git my-icons` eyni repository-ni `my-icons` qovluğuna köçürür. `ls` indi iki qovluq göstərir. Hər biri ayrıca, tam repository-dir: birində etdiyiniz commit o birində görünmür.

Bu, `icons` adlı qovluq artıq olanda və ya layihənin ikinci nüsxəsi lazım olanda işə yarayır. Nöqtə yazsanız (`git clone <ünvan> .`), repository cari boş qovluğa köçürülür.

> **Diqqət:** boş olmayan qovluğa clone etmək olmur. Git `destination path 'icons' already exists and is not an empty directory` xətası verir.

## Shallow clone: --depth {#shallow}

`--depth 1` yalnız son commit-i gətirir. Belə clone-a *shallow* (dayaz) clone deyilir. `git log --oneline` bir sətir göstərir, əvvəlki üç commit gəlməyib. Fayllar isə tamdır, çünki son commit-in snapshot-u bütün layihəni saxlayır. `git branch -a`-da `origin/outline` yoxdur: `--depth` yalnız default branch-ı gətirir.

Shallow clone uzun tarixçəli böyük repository-ləri tez yükləyir. CI, yəni hər push-dan sonra layihəni avtomatik yoxlayan server də belə clone edir, çünki testlərə tarixçə lazım deyil. Mənfi tərəfi budur: köhnə commit-lər lokalda yoxdur, onlara baxmaq və onlarla müqayisə etmək olmur.

Ünvan burada `file://` ilə başlayır. Adi qovluq yolunda Git faylları birbaşa kopyalayır və `--depth`-i nəzərə almır (`--depth is ignored in local clones` xəbərdarlığı verir). `file://` ilə isə serverlə işlədiyi kimi işləyir, ona görə çıxışda `done.` da yoxdur. `$HOME` ev qovluğunun yoludur, burada `/home/sam`. GitHub-da `file://` lazım deyil: `git clone --depth 1 https://github.com/ayla/icons.git`.

> **Bilgi:** tarixçə sonra lazım olsa, `git fetch --unshallow` qalan commit-ləri gətirir.

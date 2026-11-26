**Repository** (qısaca *repo*) Git-in idarə etdiyi layihədir: layihənin faylları və onların bütün tarixçəsi bir yerdə. Əvvəlki dərslərdəki tarixçə məhz repository-də saxlanır. Hər layihənin öz repository-si olur.

## Fayllar və tarixçə {#parts}

Repository-nin iki hissəsi var. Birincisi üzərində işlədiyiniz fayllardır: onları adi qovluqdakı kimi açıb redaktə edirsiniz. İkincisi layihənin kökündəki gizli `.git` qovluğudur. Orada bütün commit-lər, yəni layihənin hər yadda saxlanmış vəziyyəti, həmçinin ayarlar saxlanır.

## Tarixçə layihənin içindədir {#history-inside}

Tarixçə ayrıca serverdə yox, `.git`-in içindədir. Ona görə qovluğu başqa yerə köçürsəniz, tarixçə də onunla gedir. `.git`-i silsəniz, fayllar qalır, tarixçə isə itir.

> **Diqqət:** `.git` gizli qovluqdur və fayl menecerində adətən görünmür. Layihəni köçürəndə və ya arxivləyəndə onu da götürün, yoxsa tarixçə yeni yerə getməyəcək.

## Lokal və remote repository {#local-remote}

Kompüterinizdəki repository **lokal** repository-dir. Onunla internetsiz işləyirsiniz: commit edirsiniz, tarixçəyə baxırsınız. **Remote** (uzaq) repository eyni layihənin serverdəki surətidir, məsələn GitHub və ya GitLab-da.

Remote komandanın ortaq nöqtəsidir. Hər kəs öz commit-lərini ora göndərir və başqalarının commit-lərini oradan götürür. Lokal repository-də isə tarixçənin tam surəti olur, ona görə server əlçatan olmayanda da iş dayanmır.

## Repository necə yaranır {#getting}

Repository əldə etməyin iki yolu var. `git init` mövcud qovluqda yeni, boş repository yaradır: layihəni özünüz başlayanda bu lazımdır. `git clone` remote repository-ni bütün tarixçəsi ilə birlikdə kompüterinizə köçürür: mövcud layihəyə qoşulanda bu lazımdır. Hər ikisini qarşıdakı dərslərdə işlədəcəyik.

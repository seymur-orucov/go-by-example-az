Branch yaradılandan sonra `main` yerində qalıbsa, `git merge` default olaraq fast-forward edir və merge commit yaranmır. `--no-ff` belə halda da merge commit yaradır, `--ff-only` isə fast-forward alınmayanda merge-dən imtina edir. Üç halda da faylların son vəziyyəti eynidir, fərq tarixçənin necə görünməsindədir.

Nümunə mobil oyun komandasıdır: yeni imkanlar `feat/daily-reward`, düzəlişlər `fix/sound-toggle` kimi branch-larda hazırlanır.

## Default: fast-forward {#fast-forward}

`feat/daily-reward` branch-ında iki commit var: `Add reward screen` və `Give coins each day`. Branch yaradılandan sonra `main`-ə heç kim commit etməyib. `git merge feat/daily-reward` çıxışında `Fast-forward` sətri görünür: Git `main`-i branch-ın son commit-inə çəkdi. Yeni commit yaranmadı.

İndi `git log --oneline --graph` düz xətt göstərir: üç commit, hər birinin qarşısında bir `*`. Bu tarixçədən iki commit-in ayrıca branch-da yazıldığını bilmək olmur. `git branch -d` ilə branch silinəndən sonra onun adı da heç yerdə qalmır. Bir commit-lik düzəliş üçün bu problem deyil. On commit-lik yeni imkanın (*feature*) isə harada başlayıb harada bitdiyini tarixçədən tapmaq olmur.

## --no-ff: həmişə merge commit {#no-ff}

İndi eyni vəziyyətdə `git merge --no-ff feat/daily-reward` yazırsınız. Fast-forward mümkün idi, amma Git merge commit yaradır. Çıxışda `Fast-forward` əvəzinə `Merge made by the 'ort' strategy.` görünür. Redaktordakı hazır mesaj `Merge branch 'feat/daily-reward'` olur.

`git log --oneline --graph`-da ən yuxarıda merge commit durur. `|\` sətrində xətt ikiyə ayrılır, sağ xəttdə branch-ın iki commit-i görünür. `|/` sətrində xətlər `Add main menu`-da yenidən birləşir. Bu "qabarcıq" branch silinəndən sonra da qalır, merge commit-in mesajı isə branch-ın adını saxlayır.

Merge commit-in birinci parent-i `Add main menu`-dur, ikincisi branch-ın son commit-i. `git log --oneline --first-parent` yalnız birinci parent-lərlə gedir və burada iki sətir göstərir: merge commit və `Add main menu`. Yəni `main`-də hər feature bir sətirdir. Feature-i bütövlükdə geri almaq üçün də bir komanda kifayətdir. `git revert -m 1` merge commit-in gətirdiyini bir yeni commit ilə ləğv edir; onu "Səhvləri düzəltmək" modulunda keçəcəyik.

## --ff-only: ya fast-forward, ya heç nə {#ff-only}

Bu arada `fix/sound-toggle` branch-ında səs düyməsi düzəldilib. Bu branch `Add main menu`-dan ayrılıb, `main`-ə isə o vaxtdan `feat/daily-reward`-ın merge commit-i əlavə olunub. Fast-forward mümkün deyil. `git merge --ff-only fix/sound-toggle` merge etmir: `fatal: Not possible to fast-forward, aborting.` `main` dəyişmir.

Bu xətanı və onun `hint` sətirlərini "Fast-forward merge" dərsində görmüşdük. Orada təklif olunan `git rebase` branch-ın commit-lərini `main`-in son commit-inin üstünə köçürür və fast-forward yenə mümkün olur. Rebase-i "Tarixçəni yenidən yazmaq" modulunda keçəcəyik.

`--ff-only` `main`-i düz xətt saxlamaq istəyən komandalar üçündür. `main`-ə yalnız onun son commit-i üzərində qurulmuş iş düşür və heç bir merge commit təsadüfən yaranmır. Fast-forward mümkün olanda `--ff-only` adi `git merge` kimi işləyir.

## Seçimi config-də saxlamaq {#config}

Seçimi hər merge-də yazmamaq üçün onu `merge.ff` parametrində saxlamaq olur. Onun üç dəyəri vizualda göstərilib. Məsələn, `git config merge.ff only` bu repository-də hər `git merge`-ü `--ff-only` kimi işlədir. Komanda sətrindəki seçim config-dən üstündür: `merge.ff false` olsa da, `git merge --ff` mümkün olanda fast-forward edir.

`git pull` serverdəki yeni commit-ləri gətirib hazırkı branch-a merge edir. Onu "Remote-lar" modulunda keçəcəyik. `git pull` üçün ayrıca `pull.ff` parametri var və o, `merge.ff`-dən üstündür. Sizin də lokal commit-iniz varsa, yeni Git versiyaları ayarsız da merge etmir. `git pull` dayanır və necə birləşdirmək lazım olduğunu soruşur: `fatal: Need to specify how to reconcile divergent branches.` İpucunda təklif olunan ayarlardan biri `git config --global pull.ff only`-dir. Onunla Git daha soruşmur: `git pull` yalnız fast-forward edir, alınmasa xəta ilə dayanır.

## Hansını seçmək {#choose}

Fast-forward tarixçəni qısa və düz saxlayır, amma feature-in sərhədlərini itirir. `--no-ff` sərhədləri saxlayır, əvəzində tarixçədə əlavə commit-lər və budaqlar olur. Seçimi komanda bir dəfə edir və hamı ona əməl edir.

Oyun komandası belə razılaşa bilər. `feat/daily-reward` kimi feature-lər `--no-ff` ilə merge olunur: mükafat ekranı problem yaratsa, onu bir `git revert` ilə geri almaq olur. Bir commit-lik düzəlişdə qabarcıq heç nə vermir, ona görə belə branch-lar mümkün olanda fast-forward ilə merge olunur. `main`-i tam düz xətt istəyən komandalar isə `--ff-only` seçir və branch-ı merge-dən əvvəl rebase edir.

GitHub-da pull request-i merge edəndə default düymə **Merge pull request**-dir, menyuda bu üsulun adı **Create a merge commit**. GitHub sənədlərinə görə bu üsul `--no-ff` ilə merge edir. Yəni fast-forward mümkün olanda da merge commit yaranır. Menyudakı digər iki üsul, **Squash and merge** və **Rebase and merge**, merge commit yaratmır. Pull request-ləri "Komanda işi" modulunda, squash merge-i isə növbəti dərsdə keçəcəyik.

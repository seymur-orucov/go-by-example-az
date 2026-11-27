Fast-forward yalnız bir tərəf irəliləyəndə mümkündür. Hər iki branch-da yeni commit varsa, Git onların dəyişikliklərini birləşdirib iki parent-i olan yeni commit yaradır, **merge commit**. Bunun üçün Git faylın üç versiyasını müqayisə edir, ona görə üsul **three-way merge** adlanır.

Nümunə otaq yoldaşlarının ortaq siyahısıdır (`groceries.txt` alınacaqlar, `cleaning.txt` təmizlik növbəsi üçün), Sam `groceries`, Ayla isə `cleaning` branch-ında işləyib.

## Hər iki tərəf irəliləyib {#fork}

`git merge groceries` fast-forward ilə bitir. `main` bu branch-ın ayrıldığı commit-də idi, Git onu sadəcə irəli çəkdi. Sam süd növünü dəyişib: `milk` əvəzinə `oat milk`.

İndi `git log --graph --all` tarixçənin ikiyə ayrıldığını göstərir. `|/` sətri xətlərin ayrıldığı yerdir. Sağ xəttdə `cleaning`-in iki commit-i var, onları Ayla yazıb. Sol xəttdə `main`-in yeni commit-i var, `Switch to oat milk`. Bu commit `cleaning`-in tarixçəsində yoxdur.

`cleaning`-i fast-forward ilə gətirmək üçün `main`-in son commit-i `cleaning`-in tarixçəsində olmalı idi. Burada belə deyil: `main`-i Ayla-nın commit-inə çəksək, `Switch to oat milk` `main`-dən çıxar. Ona görə fast-forward mümkün deyil. Vizualda `HEAD → main` və `groceries` bir commit-dədir, `cleaning` isə ayrı xəttdədir.

## Merge base: son ortaq commit {#merge-base}

`git merge-base main cleaning` iki branch-ın son ortaq commit-ini tapır və onun tam hash-ini çap edir. Bu commit **merge base** adlanır. Onun hansı commit olduğunu görmək üçün hash-i `git log --oneline -1`-ə veririk. `$(...)` bash-in yazılışıdır: içindəki komandanın çıxışını komanda sətrinə qoyur.

Merge base `Add the cleaning rota`-dır. Qrafda bu, xətlərin ayrıldığı commit-dir. O, hər iki branch-ın tarixçəsindədir. Ondan sonrakı commit-lər isə yalnız bir tərəfdədir.

## Üç versiya: base, ours, theirs {#two-sides}

Merge zamanı Git hər faylın üç versiyasına baxır. Birincisi merge base-dəkidir (*base*). İkincisi hazırkı branch-dakıdır (*ours*, "bizimki"), burada `main`. Üçüncüsü birləşdirilən branch-dakıdır (*theirs*, "onlarınkı"), burada `cleaning`.

Üç nöqtəli `git diff` branch-ı merge base ilə müqayisə edir; bunu branch-lar arası fərq dərsində görmüşdük. Ona görə bu iki komanda hər tərəfin base-dən sonra nəyi dəyişdiyini göstərir. `main` yalnız `groceries.txt`-in birinci sətrini dəyişib. `cleaning` isə `cleaning.txt`-ə `hallway: Ayla`, `groceries.txt`-in sonuna `dish soap` əlavə edib. İkinci diff-də hunk başlığından sonra gələn `milk` hunk-dan əvvəlki sətirdir: Ayla-nın versiyasında hələ köhnə `milk` var.

Bir sətri yalnız bir tərəf dəyişibsə, Git həmin dəyişikliyi götürür. Birinci sətri yalnız `main` dəyişib, ona görə merge-dən sonra orada `oat milk` olacaq. `dish soap` yalnız `cleaning`-də əlavə olunub, o da nəticəyə düşəcək. Base olmasaydı, Git `dish soap` sətrini Ayla əlavə edib, yoxsa Sam silib, bilməzdi. Üçüncü versiya bu sualın cavabıdır.

> **Diqqət:** eyni sətri iki tərəf fərqli dəyişibsə, Git özü seçə bilmir və konflikt yaranır. Konfliktləri bu modulun sonunda keçəcəyik.

## Merge commit {#merge}

`git merge --no-edit cleaning` birləşdirməni edir. `Auto-merging groceries.txt` sətri bu faylı iki tərəfin də dəyişdiyini bildirir: Git onu sətir-sətir birləşdirdi. `Merge made by the 'ort' strategy.` merge-in yeni commit ilə bitdiyini göstərir. `ort` birləşdirmə alqoritminin, yəni strategiyanın adıdır. Git 2.34-dən bəri default strategiya odur, ondan əvvəl `recursive` idi. Sonrakı sətirlər `main`-ə nə gəldiyini göstərir: iki faylın hər birində bir yeni sətir.

`cat groceries.txt` iki dəyişikliyi birlikdə göstərir: əvvəldə `oat milk`, sonda `dish soap`. Qrafda yeni commit, `Merge branch 'cleaning'`, iki xətti birləşdirir. `|\` sətri ondan aşağı iki xəttin ayrıldığını göstərir. Vizualda `HEAD → main` merge commit-ə keçib, `cleaning` isə yerində qalıb.

> **Bilgi:** `--no-edit` Git-in hazır mesajını redaktor açmadan götürür. Bunu "git merge əsasları" dərsində görmüşdük.

## İki parent {#parents}

`git cat-file -p HEAD` merge commit-in içini göstərir. Adi commit-dən fərqi `parent` sətirlərindədir: burada onlar ikidir. Birincisi merge-dən əvvəl `main`-in son commit-idir, ikincisi `cleaning`-in son commit-i. `tree` isə birdir, birləşdirilmiş faylların snapshot-u. `author` Sam-dir, çünki merge-i o edib. Ayla-nın commit-ləri tarixçədə öz adı ilə qalır.

`HEAD^1` birinci parent-dir: `Switch to oat milk`. `HEAD^2` ikinci parent-dir: `Add dish soap to the list`. Birinci parent merge zamanı olduğunuz branch-dan, ikincisi birləşdirdiyiniz branch-dan gəlir. `HEAD~1` birinci parent-lə gedir, ona görə `HEAD^1` ilə eyni commit-dir.

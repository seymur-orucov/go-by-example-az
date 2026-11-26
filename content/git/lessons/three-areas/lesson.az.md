Git-də fayl commit-ə düşənə qədər üç sahədən keçir. **Working directory** kompüterdə gördüyünüz və redaktə etdiyiniz fayllardır. **Staging area** (başqa adı *index*) növbəti commit-in qaralamasıdır: ora yalnız seçdiyiniz dəyişikliklər düşür. **Repository** isə `.git` qovluğunda saxlanan commit-lərdir, yəni layihənin yadda saxlanmış snapshot-ları (müəyyən andakı tam surətləri).

Bu ara mərhələ ona görə lazımdır ki, üzərində işlədiyiniz hər şey eyni anda commit-ə hazır olmur. Səyahət planında çanta siyahısı artıq hazırdır, büdcə isə hələ yox: staging area yalnız hazır olanı commit etməyə imkan verir.

## Yeni fayllar izlənmir {#untracked}

Repository yaradılıb (`git init`) və içində iki yeni fayl var. `git status --short` hər fayl üçün iki simvollu kod göstərir. `??` o deməkdir ki, Git bu faylı **izləmir** (untracked): fayl yalnız working directory-dədir. Staging area və repository hələ boşdur.

## Staging area-ya əlavə etmək {#stage}

`git add packing.txt` faylın indiki halının surətini staging area-ya qoyur. Kodun iki sütunu var: sol sütun staging area-nı son commit ilə, sağ sütun working directory-ni staging area ilə müqayisə edir. `A ` (soldakı `A`, *added*) deyir ki, fayl staging area-da var, son commit-də isə yox. `budget.txt`-ə toxunmadıq: hazır olmadığı üçün o, commit-ə düşməyəcək.

## Commit: snapshot repository-yə yazılır {#commit}

`git commit` staging area-da olanı snapshot kimi repository-yə yazır və ona qısa hash, yəni unikal ad verir (çıxışın birinci sətrində). `root-commit` bunun repository-nin ilk commit-i olduğunu bildirir. İndi `packing.txt` üç sahədə eynidir, ona görə `git status` onu ümumiyyətlə göstərmir.

> **Diqqət:** commit-dən sonra staging area boşalmır. Orada son commit-in surəti qalır, çünki staging area həmişə "növbəti commit belə olacaq" deyir. Vizualda `packing.txt` hər üç sahədədir.

## Faylı dəyişmək {#modify}

Siyahıya şarj cihazını (`charger`) əlavə edirik. Kod ` M` oldu: sağ sütundakı `M` (*modified*) deyir ki, working directory-dəki fayl staging area-dakından fərqlidir. Sol sütun boşdur, yəni staging area hələ də son commit ilə eynidir. Yeni sətir hələ yalnız diskdədir.

## Dəyişikliyi yenidən stage etmək {#stage-again}

Git faylı artıq izləsə də, hər yeni versiyanı commit-ə daxil etmək üçün onu yenidən `git add` etmək lazımdır. Kod `M ` oldu: fərq indi sol sütundadır, yəni staging area son commit-dən fərqlənir, working directory isə staging area ilə eynidir. Növbəti `git commit` məhz bu versiyanı repository-yə yazacaq.

> **Bilgi:** `git add` faylın həmin andakı surətini götürür. `add`-dan sonra faylı yenə dəyişsəniz, staging area-da köhnə surət qalır və `git status --short` `MM` göstərir.

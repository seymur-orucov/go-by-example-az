Git faylın hər versiyasını ayrıca blob kimi saxlayır. Mətn faylı üçün bu problem deyil, amma böyük binary fayl hər dəyişiklikdə repository-ni öz ölçüsü qədər böyüdür. Git LFS (Large File Storage) belə faylları Git-in obyektlərindən kənarda saxlayır, commit-ə isə onların yerinə kiçik mətn faylı yazır.

Nümunə ferma oyununun prototipidir: rəssam otun 300 000 baytlıq teksturasını, `textures/grass.psd`-ni tez-tez yeniləyir.

## Problem: hər versiya tam blob-dur {#problem}

`old-art` eyni oyunun LFS-siz köhnə nüsxəsidir, tekstura orada iki dəfə commit olunub. `--stat` binary faylda sətir saymır, ölçünü yazır. `Bin 0 -> 300000 bytes` faylın yarandığını, `Bin 300000 -> 300000 bytes` isə ölçüsü eyni qalan, amma məzmunu dəyişən faylı göstərir.

`git count-objects -H` Git-in obyektlərinin sayını və diskdə tutduğu yeri göstərir. `586.65 KiB` təxminən iki dəfə 300 000 baytdır: hər versiya tam blob kimi yazılıb. Git obyektləri sıxır, amma şəkil və səs faylları adətən artıq sıxılmış olur və ölçü azalmır.

Bu blob-lar tarixçədə həmişəlik qalır. Faylı sonra silsəniz də, köhnə commit-lər onlara istinad edir. Hər `git clone` isə bütün tarixçəni, yəni teksturanın hər versiyasını yükləyir.

## LFS-i qoşmaq: install və track {#track}

`git lfs install` hər istifadəçi üçün bir dəfə işlədilir. `Git LFS initialized` onun qlobal konfiqurasiyaya, yəni `~/.gitconfig`-ə `lfs` adlı filter yazdığını bildirir. Növbəti iki komanda bu filter-i göstərir. `clean` fayl `git add` ilə repository-yə girəndə işləyir, `smudge` isə checkout zamanı fayl diskə yazılanda; `%f` faylın adıdır.

Komandanı repository-nin içində işlətdik, ona görə `Updated Git hooks` sətri də var. LFS bu repository-yə `pre-push` və başqa hook-lar qoydu. Push zamanı LFS fayllarını serverə `pre-push` hook-u göndərir.

`git lfs track "*.psd"` LFS-ə hansı faylları verəcəyimizi deyir və `.gitattributes`-a bir sətir yazır. `filter=lfs` bu faylları həmin filter-dən keçirir. `diff=lfs` və `merge=lfs` onları diff və merge üçün də LFS faylı kimi qeyd edir, `-text` isə sətir sonlarının çevrilməsini söndürür.

> **Diqqət:** `"*.psd"`-ni dırnaqda yazın. Dırnaqsız shell nümunəni qovluqdakı `.psd` fayllarının adları ilə əvəz edə bilər.

## Commit-də pointer fayl {#pointer}

`git add .` `.gitattributes`-ı, `README.md`-ni və teksturanı stage etdi. Commit çıxışı adi görünür, `textures/grass.psd` də `create mode` ilə yaranıb. Amma `5 insertions(+)`-a baxın. `.gitattributes` və `README.md` bir sətirlikdir, qalan üç sətir teksturadandır. Binary faylda sətir sayılmazdı.

`git show HEAD:textures/grass.psd` commit-də bu ad altında saxlanan blob-u çap edir. Bu, üç sətirlik mətndir və ona pointer fayl (göstərici) deyilir:

- `version` pointer formatının versiyasıdır;
- `oid sha256:` faylın məzmununun SHA-256 hash-idir, LFS faylı bu adla tapır;
- `size` real faylın baytla ölçüsüdür.

Diskdəki fayl isə tamdır: `wc -c` 300 000 bayt göstərir. Real məzmun `.git/lfs/objects`-dədir və faylın adı pointer-dəki `oid`-dir. `git lfs ls-files` LFS-in izlədiyi faylları sadalayır: əvvəldə `oid`-in ilk 10 simvolu, sonra `*` gəlir. `*` faylın tam məzmununun lokal olduğunu bildirir. Lokal yalnız pointer olsaydı, `-` görünərdi.

> **Diqqət:** `.gitattributes`-ı da commit edin. Komandanın qalan üzvləri qaydanı ondan alır. Onsuz onların kompüterində `.psd` faylları yenə adi blob kimi commit olunacaq.

## Yeni versiya {#new-version}

Rəssam teksturanı yenilədi (faylı dəyişən komanda gizlidir). Commit `1 insertion(+), 1 deletion(-)` göstərir: Git-də yalnız pointer-in `oid` sətri dəyişib. `.git/lfs/objects`-də isə artıq iki fayl var. LFS də hər versiyanı tam saxlayır, sadəcə Git-in obyektlərindən kənarda.

`git count-objects -H` burada `10 objects, 997 bytes` göstərir, `old-art`-da eyni iki versiya `586.65 KiB` idi. Bu 10 obyekt iki commit, dörd tree və dörd kiçik blob-dur: `.gitattributes`, `README.md` və iki pointer. Git tarixçəsi kiçik qalır. Başqa sistemlərdə rəqəm fərqli ola bilər, amma `old-art`-dakından xeyli kiçik qalır.

> **Bilgi:** `git lfs track` artıq commit olunmuş fayllara toxunmur. Böyük fayl tarixçəyə adi blob kimi düşübsə, onu LFS-ə köçürmək üçün tarixçəni yenidən yazan `git lfs migrate` var.

## Push və clone {#push-clone}

`git push` çıxışı adi push kimidir. Push-dan əvvəl LFS-in `pre-push` hook-u işlədi və LFS fayllarını serverə köçürdü: serverin `lfs/objects` qovluğunda hər iki versiya var. Burada server lokal qovluqdur. GitHub-da LFS faylları ayrıca LFS yaddaşına yüklənir və terminalda `Uploading LFS objects` sətri görünür.

Sonra ikinci developer, Ayla, repository-ni clone edir (`-q` irəliləyiş sətirlərini gizlədir). Clone Git tarixçəsini, yəni bütün pointer-ləri yükləyir. LFS-dən isə yalnız checkout olunan versiyanı götürür: Ayla-nın `.git/lfs/objects`-ində bir fayl var. `wc -c` göstərir ki, diskdəki tekstura tamdır. Köhnə commit-ə keçəndə LFS həmin versiyanı serverdən yükləyəcək.

> **Bilgi:** GitHub LFS üçün limit qoyur. Push olunan hər versiya yaddaşa tam sayılır, clone və pull zamanı yükləmələr isə trafikə. Pulsuz hesabda indi yaddaş 10 GiB, trafik ayda 10 GiB-dır. Rəqəmlər dəyişə bilər, GitHub Docs-da "Git Large File Storage billing" səhifəsinə baxın.

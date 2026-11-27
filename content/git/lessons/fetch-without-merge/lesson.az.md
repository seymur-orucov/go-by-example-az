`git pull` serverdəki dəyişiklikləri gətirən kimi sizin branch-a merge edir. `git fetch` isə yalnız gətirir: yeni commit-lər `origin/main`-də gözləyir, siz onlara baxıb merge etməyə özünüz qərar verirsiniz.

Nümunə xeyriyyə qaçışının qeydiyyat səhifəsidir: `index.html` və `routes.txt`. Siz layihəni `charity-run` qovluğuna clone etmisiniz, komanda yoldaşınız Ayla isə serverə iki commit və yeni branch göndərib (`git push`, növbəti dərsdə).

## Serverdən gətirmək: git fetch {#fetch}

`git fetch` serverdə olub sizdə olmayan commit-ləri gətirir. `From` sətrini və `main -> origin/main` sətrini "fetch və pull" dərsindən tanıyırsınız. Qabaqdakı iki qısa hash `..` ilə yazılıb, bu aralığı olduğu kimi `git log`-a vermək olar. `* [new branch]` sətrində `*` serverdə yeni branch olduğunu bildirir. Git onun üçün `origin/feat/tshirt-sizes` yaradıb, lokal branch isə yaratmayıb.

`git status` indi `behind 'origin/main' by 2 commits` yazır: `origin/main`-də sizin `main`-də olmayan iki commit var. `can be fast-forwarded` sizin öz yeni commit-inizin olmadığını bildirir. Git `git pull` təklif edir, amma əvvəlcə nə gəldiyinə baxacağıq. `working tree clean` sətri də göstərir ki, fetch heç bir faylı dəyişməyib.

Vizualda `origin/main` iki commit irəlidədir, `HEAD → main` isə yerində qalıb. Ən yuxarıda Ayla-nın branch-ının commit-idir, yanında yalnız `origin/feat/tshirt-sizes` var.

## Nə gəlib: log və diff {#look}

`git log --oneline HEAD..origin/main` `origin/main`-də olan, amma `HEAD`-də olmayan commit-ləri göstərir. `..`-ni branch-lar arası fərq dərsindən tanıyırsınız: "B-də var, A-da yox". Burada bunlar Ayla-nın iki commit-idir: yeni marşrut və iştirak haqqı.

`git diff --stat HEAD...origin/main` bu commit-lərin hansı fayllara toxunduğunu göstərir. Hər faylda bir sətir əlavə olunub. Sonuncu komanda bir faylın diff-ini açır: `index.html`-ə `<p>Entry fee: 15 USD</p>` sətri gəlib.

> **Bilgi:** üç nöqtə `origin/main`-i merge base ilə müqayisə edir, yəni yalnız serverdən gələn dəyişikliyi göstərir. Sizin hələ göndərmədiyiniz commit-ləriniz olsa, onlar bu diff-ə qarışmır. Burada belə commit yoxdur, ona görə iki nöqtə də eyni nəticəni verərdi.

## Baxdıqdan sonra: git merge origin/main {#merge}

Dəyişikliklərə baxdıq: marşrut və qiymət düzdür. `git merge origin/main` onları `main`-ə gətirir. `origin/main`-i adi branch kimi merge etmək olar. Sizin `main`-də yeni commit olmadığı üçün merge fast-forward olub. `main` irəli çəkilib, merge commit yaranmayıb. Sonrakı `git status` `up to date` yazır.

Merge etməyə tələsmək lazım deyil. Yarımçıq işiniz varsa, əvvəlcə onu bitirib commit edin. Gələn commit-lər `origin/main`-də gözləyir.

> **Bilgi:** `git pull` fetch və merge-i bir komandada edir. Burada eyni işi iki addımda etdik və arada nə gəldiyinə baxdıq.

## Serverdəki branch-lar: git branch -r {#remote-branches}

`git branch -r` (*remote*) yalnız remote-tracking branch-ları göstərir, `-a`-dan fərqli olaraq lokal branch-lar burada yoxdur. Siyahıda `origin/main` və fetch-in gətirdiyi `origin/feat/tshirt-sizes` var. `origin/HEAD -> origin/main` sətrini clone dərsindən tanıyırsınız.

Ayla-nın branch-ına keçmədən baxmaq olar. `git log --oneline main..origin/feat/tshirt-sizes` branch-da olub `main`-də olmayan commit-i göstərir: `Add T-shirt sizes`. Bu branch-da işləmək istəsəniz, `git switch feat/tshirt-sizes` eyni adlı lokal branch yaradıb ona keçər.

## Silinmiş branch-lar: git fetch --prune {#prune}

Ayla T-shirt fikrindən imtina edib və branch-ı serverdən silib. Adi `git fetch` heç nə çap etmir. `git branch -r` isə hələ də `origin/feat/tshirt-sizes` göstərir. Fetch yeni commit və branch-ları gətirir, amma serverdə artıq olmayan branch-ların surətini silmir.

`git fetch --prune` silir. `- [deleted]` sətrində `-` silinməni bildirir. `(none)` serverdə bu adda branch-ın artıq olmadığını göstərir. Sağdakı `origin/feat/tshirt-sizes` sizdə silinən remote-tracking branch-dır. Sonrakı `git branch -r`-də o yoxdur. Vizualda da yoxdur, onun commit-i də görünmür: indi o commit-ə heç bir branch aparmır.

> **Bilgi:** `git config --global fetch.prune true` hər fetch-i `--prune` ilə işlədir. `--prune` yalnız `origin/...` branch-larını silir, lokal branch-larınıza toxunmur.

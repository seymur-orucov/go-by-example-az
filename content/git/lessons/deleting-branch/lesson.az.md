İşi bitən branch-ı silirlər, yoxsa `git branch` siyahısı köhnə adlarla dolur. Branch commit-ə pointer olduğu üçün silinən yalnız addır, commit-lər yerində qalır. `git branch -d` ehtiyatla silir: commit-ləri hələ hazırkı branch-da olmayan branch-ı silmir, `-D` isə yoxlamadan silir.

Nümunə ev heyvanına qulluq cədvəlidir: `feeding.txt`-də yemək saatları, `vet.txt`-də baytar ziyarəti yazılıb.

## Hansı branch-lar var {#list}

`git branch -v` hər branch-ın göstərdiyi commit-i və onun mesajını çap edir, `*` hazırkı branch-ı göstərir. `vet-visit` və `main` eyni commit-i, `Add vet visit`-i göstərir. Deməli, `vet-visit`-in commit-i artıq `main`-dədir. Bu, merge ilə edilib; merge-i növbəti modulda keçəcəyik.

`new-food`-un isə öz commit-i var: `Try salmon food`. Bu commit `main`-də yoxdur, yeni yem hələ sınaqdadır.

## git branch -d: işi bitmiş branch {#delete-merged}

`git branch -d vet-visit` branch-ı silir. Çıxışdakı `(was ...)` branch-ın silinməzdən əvvəl göstərdiyi commit-in qısa hash-idir. `git log --oneline` göstərir ki, `Add vet visit` commit-i yerindədir. Silinən yalnız pointer oldu. Commit `main`-in tarixçəsində olduğu üçün heç nə itmədi. Vizualda bu commit-in yanında artıq yalnız `HEAD → main` var.

> **Bilgi:** `-d` `--delete`-in qısa yazılışıdır.

## Merge olunmamış branch: -d və -D {#force}

`git branch -d new-food` xəta verir: `the branch 'new-food' is not fully merged`. Yəni `new-food`-da `main`-də olmayan commit var. Branch silinsə, `Try salmon food` commit-ini heç bir ad göstərməyəcək, ona görə `-d` onu silmir. Birinci `hint` sətri çıxış yolunu deyir: əminsinizsə, `git branch -D new-food` yazın. İkinci `hint` bu ipucunu söndürən parametri göstərir.

`git branch -D new-food` yoxlamadan silir: `-D` `--delete --force` deməkdir. İndi `git branch` yalnız `main`-i göstərir. `Try salmon food` commit-i vizualdan da çıxdı, çünki onu göstərən branch qalmadı. Belə commit-ə *unreachable* (əlçatmaz) deyilir. O, dərhal silinmir, Git onu bir müddət saxlayır. Onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

> **Bilgi:** branch-ı səhvən sildinizsə, onu `(was ...)`-dakı hash-dən yenidən yaradın: `git branch new-food <hash>`.

## Hazırkı branch-ı silmək olmur {#current}

`main`-də olarkən `git branch -d main` xəta verir: `cannot delete branch 'main' used by worktree`. Worktree burada iş qovluğunuzdur, `/home/sam/pet-care`. HEAD bu branch-ı göstərir, ona görə Git onu silmir. `-D` də burada kömək etmir. Hazırkı branch-ı silmək üçün əvvəlcə `git switch` ilə başqa branch-a keçin.

## Serverdəki branch-ı silmək {#remote}

Bu repository-nin `origin` adlı serveri var və `vet-visit` əvvəlcə ora göndərilib (*push*). Lokal `git branch -d` onu serverdən silmir. Server branch-ı üçün ayrıca komanda var: `git push origin --delete vet-visit`. Remote-ları və push-u "Remote-lar" modulunda keçəcəyik.

Çıxışdakı `To` sətri serverin ünvanıdır. Burada o, kompüterdəki qovluqdur, GitHub-da `https://github.com/...` kimi ünvan olardı. `- [deleted]` `vet-visit`-in serverdən silindiyini bildirir.

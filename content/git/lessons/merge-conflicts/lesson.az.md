İki branch eyni sətri fərqli cür dəyişəndə Git hansı versiyanın doğru olduğunu bilmir. Buna konflikt (merge conflict) deyilir: Git merge-i dayandırır və qərarı sizə buraxır. Siz faylın son versiyasını yazır və merge-i commit ilə bitirirsiniz.

Nümunə kitab klubunun görüş planıdır (`agenda.md`): Ayla `ayla-time` branch-ında saatı `19:00` edib, Sam isə `main`-də `17:30`.

## Merge dayanır {#conflict}

Sam `main`-dədir və `git merge ayla-time` işə salır. `Auto-merging agenda.md` Git-in faylı özü birləşdirməyə çalışdığını bildirir. `CONFLICT (content)` faylın məzmununda konflikt olduğunu deyir: hər iki branch eyni sətri dəyişib. Son sətir merge-in alınmadığını yazır. Merge commit yaranmayıb, komanda da xəta kodu ilə bitib.

`git status`-da `You have unmerged paths` sətri var, yəni birləşdirilməmiş fayllar qalıb. `Unmerged paths` bölməsində `both modified: agenda.md` görünür: fayl hər iki branch-da dəyişib. Mötərizədəki ipuclarında iki yol var: konflikti həll edib `git commit` etmək və ya `git merge --abort` ilə merge-dən imtina etmək. Vizualda hər branch-ın öz commit-i var, `HEAD` hələ `main`-dədir.

## Ləğv etmək: git merge --abort {#abort}

`git merge --abort` merge-i ləğv edir və repository-ni merge-dən əvvəlki vəziyyətə qaytarır. `git status` yenə `nothing to commit, working tree clean` yazır. `agenda.md`-də Sam-ın versiyası, `Time: 17:30` qalıb. Ayla-nın commit-i də itməyib, `ayla-time` branch-ındadır. Konflikti indi həll etməyə vaxtınız yoxdursa və ya səhv branch-ı merge etmisinizsə, bu yol işə yarayır.

> **Diqqət:** merge-ə commit olunmamış dəyişiklik olmadan başlayın. Belə dəyişikliklər varsa, `--abort` onları həmişə bərpa edə bilmir.

## Konflikt markerləri {#markers}

Merge-i yenidən işə salırıq və o, yenə dayanır. `cat agenda.md` faylın içini göstərir. Git konfliktli yerə hər iki versiyanı yazıb və onları üç marker sətri ilə ayırıb:

- `<<<<<<< HEAD` konfliktin başlanğıcıdır. Ondan sonra `HEAD`-in, yəni hazırkı branch-ın (`main`) versiyası gəlir: `Time: 17:30`.
- `=======` iki versiyanı ayırır.
- `>>>>>>> ayla-time` konfliktin sonudur. Bu sətirlə `=======` arasında merge etdiyiniz branch-ın versiyası var: `Time: 19:00`.

`Day: Friday` və `Place: Library` markerlərdən kənardadır, onlarda konflikt yoxdur. Branch-lar fərqli sətirləri dəyişsəydi, Git onları özü birləşdirərdi.

> **Bilgi:** konflikt zamanı `git diff` də bu yeri göstərir. Bu, birləşmiş diff-dir (combined diff). Hər sətrin qarşısında iki sütun var: biri `HEAD`, biri digər branch üçün.

## Həll etmək və git add {#resolve}

Konflikti həll etmək faylın son versiyasını yazmaq deməkdir. Adətən faylı redaktorda açır, markerləri və artıq sətri silirsiniz. Nəticə bir tərəfin versiyası və ya yeni variant ola bilər. Sam və Ayla ortada razılaşıb: `Time: 18:30`. Biz faylı `printf` ilə yenidən yazırıq ki, nəticə terminalda görünsün.

`git add agenda.md` faylı həll olunmuş kimi işarələyir. `git status` indi `All conflicts fixed but you are still merging` yazır: konfliktlər həll olunub, amma merge hələ bitməyib. `Changes to be committed` bölməsində `modified: agenda.md` var, çünki yeni saat `main`-dəkindən fərqlidir.

`git mergetool` konfliktli faylları qrafik alətdə açır, məsələn Meld və ya vimdiff-də. Aləti `merge.tool` ayarı ilə seçirsiniz. Bu komanda interaktivdir, ona görə burada işə salmırıq.

> **Diqqət:** `git add` markerləri yoxlamır. Faylda `<<<<<<<` sətri qalsa, o da commit-ə düşəcək. `git add`-dan əvvəl faylı bir də oxuyun.

## Merge-i bitirmək {#finish}

Merge-i adi `git commit` bitirir, `git merge`-i yenidən yazmaq lazım deyil. Mesajı Git özü hazırlayıb: `Merge branch 'ayla-time'`. `--no-edit` onu "git merge əsasları" dərsindəki kimi redaktor açmadan götürür. Çıxışda merge commit-in qısa hash-i və bu mesaj var.

`git log --oneline --graph` nəticəni göstərir. Ən yuxarıdakı merge commit-in iki parent-i var: Sam-ın və Ayla-nın commit-ləri. Xətlər iki budağın bu commit-də birləşdiyini göstərir. Merge commit-də `agenda.md`-in son versiyası, yəni `Time: 18:30` saxlanılıb.

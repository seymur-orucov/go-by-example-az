Tag da branch kimi əvvəlcə yalnız sizin repository-də yaranır. `git push` isə branch-ı göndərir, tag-ları yox. Tag-ı serverə ayrıca göndərməsəniz, komanda yoldaşlarınız `v1.0`-ın hansı commit olduğunu bilməyəcək.

Nümunə brauzerdə açıq tab-ları saxlayan extension-dur (`manifest.json`, `popup.html`), Sam onu `~/server/tab-saver.git` serverinə push edib.

## git push origin v1.0: bir tag {#push-one-tag}

Sam versiyanı `1.0` etdi, commit yaratdı və bu commit-ə annotated tag qoydu. `git push origin main` yalnız branch-ı göndərdi: çıxışda bir sətir var, `main -> main`. `git ls-remote --tags origin` serverdəki tag-ları göstərir. O, heç nə çap etmədi, çünki serverdə hələ tag yoxdur.

`git push origin v1.0` branch adının yerində tag adı alır və yalnız bu tag-ı göndərir. `* [new tag] v1.0 -> v1.0` serverdə yeni tag yarandığını bildirir, `[new branch]` kimi. Server burada lokal qovluqdur, GitHub-da `To` sətrində `https://github.com/...` olardı.

İkinci `ls-remote` iki sətir çap edir. "Tag nədir" dərsindən bilirsiniz ki, annotated tag ayrıca obyektdir. `refs/tags/v1.0` sətrində bu obyektin hash-i, `refs/tags/v1.0^{}` sətrində isə onun göstərdiyi commit-in hash-i var. Bu hash `main -> main` sətrindəki yeni hash ilə başlayır.

## git push --follow-tags {#follow-tags}

`popup.html`-i dəyişməzdən əvvəl Sam hazırkı commit-ə lightweight tag qoydu: `old-popup`. Bu, yalnız özü üçün qeyddir. Sonra axtarış sahəsi əlavə etdi, versiyanı `1.1` etdi və `v1.1` annotated tag-ını yaratdı. `git tag` üç tag göstərir.

`git push --follow-tags` branch-ı və onunla birlikdə annotated tag-ları göndərir. Çıxışda `main -> main` və `* [new tag] v1.1 -> v1.1` var. Tag iki şərtlə gedir: annotated olmalıdır və push olunan branch-ın tarixçəsindəki commit-ə baxmalıdır. `old-popup` da serverdə yoxdur və `main`-in tarixçəsindədir. Amma lightweight olduğu üçün getməyib.

Release-ləri annotated, şəxsi qeydləri lightweight tag ilə etsəniz, bu seçim yalnız release-ləri paylaşır. `git config push.followTags true` onu default edir: bu repository-də adi `git push` da `--follow-tags` kimi işləyəcək. `--global` ilə bu ayar bütün repository-lərə aiddir.

## git push origin --tags: bütün tag-lar {#all-tags}

Sam ilk commit-ə də tag qoydu: `HEAD~2`-yə `v0.9`. `git push origin --tags` serverdə olmayan bütün lokal tag-ları göndərir, annotated olsun, lightweight olsun. Branch-ı isə göndərmir. Çıxışda iki tag var: `old-popup` və `v0.9`. `v1.0` və `v1.1` artıq serverdə idi.

`v0.9` lazım idi, `old-popup` isə yox. İndi Sam-ın şəxsi qeydi serverdədir və hər kəs növbəti fetch-də onu alacaq. `--tags` kompüterinizdəki unudulmuş test tag-larını da göndərir. Vizualda Sam-ın lokal tag-ları görünür: `v1.0` və `old-popup` eyni commit-dədir. Qırıq xətli `origin/main` isə `main`-lə birlikdədir, çünki branch artıq göndərilib.

> **Bilgi:** `--tags`-dan əvvəl `git tag` ilə siyahıya baxın. Bir-iki tag üçün `git push origin <tag>` daha etibarlıdır.

## Serverdəki tag-ı silmək {#delete-remote-tag}

`git push origin --delete old-popup` tag-ı serverdən silir. Serverdəki branch da bu komanda ilə silinir. Çıxışdakı `- [deleted]` bunu təsdiqləyir. Push lokal tag-a toxunmur, ona görə `git tag -d old-popup` onu Sam-ın repository-sindən də silir. Lightweight tag commit-ə birbaşa baxdığı üçün `was` sözündən sonra commit-in hash-i yazılıb. Son `ls-remote` serverdə yalnız `v0.9`, `v1.0` və `v1.1`-i göstərir, hər birini iki sətirlə.

Köhnə yazılış da var: `git push origin :refs/tags/old-popup`. İki nöqtədən solda heç nə yoxdur. Git bunu "serverdəki bu ref-i sil" kimi başa düşür.

> **Diqqət:** serverdən silmək başqalarının clone-undakı tag-ı silmir. Komanda yoldaşınız `old-popup`-ı silinməzdən əvvəl fetch etsəydi, tag onda qalardı və onu `git tag -d` ilə özü silməli olardı.

## Komanda yoldaşı tag-ları necə alır {#fetch-tags}

Son komandalar Ayla-nın clone-unda (`~/ayla/tab-saver`) işləyir. O, layihəni dərsin əvvəlində clone edib, onda serverdə tag yox idi. `git fetch` yeni commit-lərlə birlikdə tag-ları da gətirir: hər tag üçün `* [new tag]` sətri var. Fetch gətirdiyi tarixçədəki commit-lərə baxan tag-ları ayrıca seçim olmadan götürür. `old-popup` gəlmədi, çünki serverdən silinib. Bundan sonra clone edən hər kəs tag-ları clone ilə alır.

> **Diqqət:** paylaşılmış tag-ı başqa commit-ə köçürməyin. Sam `v1.1`-i silib yeni commit-ə qoysa və push etsə, Ayla-nın `git fetch`-i köhnə `v1.1`-i dəyişmir və heç nə demir. Onda iki nəfərdə eyni adlı fərqli versiya olar. Səhv release-dən sonra yeni tag yaradın, məsələn `v1.1.1`.
